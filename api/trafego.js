import { GoogleAdsApi, enums } from 'google-ads-api'
import { exigirLogin, EMAIL_GABRIEL } from './_auth.js'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bfyshboqvisnuefeyqdv.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'

const ORCAMENTO_MAX = 5000
const LOTE_MAX = 50

const limpar = id => String(id).replace(/-/g, '')
const soDigitos = v => /^\d+$/.test(String(v))

class ErroUsuario extends Error {}
const recusar = msg => { throw new ErroUsuario(msg) }

function dataISO(d) { return d.toISOString().split('T')[0] }

// Período atual termina ontem (dia fechado, no fuso de Brasília); o anterior tem o mesmo tamanho, logo antes.
function periodos(dias) {
  const hoje  = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) + 'T12:00:00Z')
  const ontem = new Date(hoje.getTime() - 86400000)
  const ini   = new Date(ontem.getTime() - (dias - 1) * 86400000)
  const fimAnt = new Date(ini.getTime() - 86400000)
  const iniAnt = new Date(fimAnt.getTime() - (dias - 1) * 86400000)
  return { ini: dataISO(ini), fim: dataISO(ontem), iniAnt: dataISO(iniAnt), fimAnt: dataISO(fimAnt) }
}

function cliente(gads, customerId) {
  return gads.Customer({
    customer_id:       limpar(customerId),
    login_customer_id: limpar(process.env.GOOGLE_ADS_MCC_ID),
    refresh_token:     process.env.GOOGLE_ADS_REFRESH_TOKEN,
  })
}

const vazio = () => ({ custo: 0, conversoes: 0, valor: 0, cliques: 0, impressoes: 0 })

function somar(acc, m) {
  acc.custo      += Number(m?.cost_micros || 0) / 1e6
  acc.conversoes += Number(m?.conversions || 0)
  acc.valor      += Number(m?.conversions_value || 0)
  acc.cliques    += Number(m?.clicks || 0)
  acc.impressoes += Number(m?.impressions || 0)
  return acc
}

async function emLotes(itens, tamanho, fn) {
  const saida = []
  for (let i = 0; i < itens.length; i += tamanho) {
    saida.push(...await Promise.all(itens.slice(i, i + tamanho).map(fn)))
  }
  return saida
}

const statusTexto = s => (s === 2 || s === 'ENABLED' ? 'ENABLED' : s === 3 || s === 'PAUSED' ? 'PAUSED' : 'OUTRO')

const TIPOS_REGIAO = {
  Country: 'País', State: 'Estado', City: 'Cidade', Municipality: 'Município', Region: 'Região',
  District: 'Distrito', Neighborhood: 'Bairro', 'Postal Code': 'CEP', 'Metro Area': 'Região metropolitana',
}

function nomeRegiao(g) {
  return String(g.canonical_name || g.name || '')
    .split(',').map(p => p.replace(/^State of /, 'Estado de ')).filter(p => p !== 'Brazil').join(', ')
}

async function resumoDaConta(gads, conta, p) {
  const c = cliente(gads, conta.id)
  try {
    const [diario, campanhas] = await Promise.all([
      c.query(`
        SELECT segments.date, metrics.cost_micros, metrics.conversions, metrics.conversions_value,
               metrics.clicks, metrics.impressions
        FROM customer
        WHERE segments.date BETWEEN '${p.iniAnt}' AND '${p.fim}'
      `),
      c.query(`
        SELECT campaign.id, campaign.name, campaign.advertising_channel_type,
               campaign_budget.amount_micros,
               metrics.cost_micros, metrics.conversions, metrics.conversions_value,
               metrics.clicks, metrics.impressions,
               metrics.search_impression_share, metrics.search_budget_lost_impression_share,
               metrics.search_rank_lost_impression_share
        FROM campaign
        WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}'
          AND campaign.status = 'ENABLED'
      `),
    ])

    const atual = vazio(), anterior = vazio()
    for (const r of diario) somar(r.segments.date >= p.ini ? atual : anterior, r.metrics)

    return {
      ...conta,
      atual, anterior,
      campanhas: campanhas.map(r => ({
        id:                 String(r.campaign.id),
        nome:               r.campaign.name,
        tipo:               r.campaign.advertising_channel_type,
        orcamento_diario:   Number(r.campaign_budget?.amount_micros || 0) / 1e6,
        ...somar(vazio(), r.metrics),
        parcela_impressoes: r.metrics.search_impression_share ?? null,
        perda_orcamento:    r.metrics.search_budget_lost_impression_share ?? null,
        perda_classificacao: r.metrics.search_rank_lost_impression_share ?? null,
      })),
    }
  } catch (e) {
    return { ...conta, erro: e.errors?.[0]?.message || e.message }
  }
}

// Só contas ligadas à MCC configurada podem ser lidas ou alteradas por aqui.
async function contaDaMcc(gads, contaId) {
  if (!soDigitos(limpar(contaId || ''))) recusar('Conta inválida')
  const mcc = cliente(gads, process.env.GOOGLE_ADS_MCC_ID)
  const [r] = await mcc.query(`
    SELECT customer_client.id, customer_client.descriptive_name
    FROM customer_client
    WHERE customer_client.level = 1 AND customer_client.id = ${limpar(contaId)}
  `)
  if (!r) recusar('Esta conta não está vinculada à MCC do hub')
  return { id: String(r.customer_client.id), nome: r.customer_client.descriptive_name }
}

async function campanhaDaConta(c, contaId, campanhaId) {
  if (!soDigitos(campanhaId)) recusar('Campanha inválida')
  const [r] = await c.query(`
    SELECT campaign.id, campaign.name, campaign.status, campaign.campaign_budget,
           campaign_budget.amount_micros, campaign_budget.explicitly_shared, campaign_budget.reference_count
    FROM campaign
    WHERE campaign.id = ${campanhaId} AND campaign.status != 'REMOVED'
  `)
  if (!r) recusar('Campanha não encontrada nesta conta')
  return {
    id: String(r.campaign.id), nome: r.campaign.name, status: statusTexto(r.campaign.status),
    rn: `customers/${limpar(contaId)}/campaigns/${r.campaign.id}`,
    orcamentoRn: r.campaign.campaign_budget,
    orcamento: Number(r.campaign_budget?.amount_micros || 0) / 1e6,
    orcamentoCompartilhado: !!r.campaign_budget?.explicitly_shared || Number(r.campaign_budget?.reference_count || 1) > 1,
  }
}

async function registrar(req, usuario, conta, campanha, acao, resumo, detalhe) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/trafego_alteracoes`, {
      method: 'POST',
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({
        usuario_email: usuario.email, conta_id: conta.id, conta_nome: conta.nome,
        campanha_id: campanha?.id || null, campanha_nome: campanha?.nome || null,
        acao, resumo, detalhe,
      }),
    })
    return r.ok
  } catch {
    return false
  }
}

async function lerHistorico(req, contaId) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  const r = await fetch(
    `${SUPABASE_URL}/rest/v1/trafego_alteracoes?conta_id=eq.${limpar(contaId)}&order=criado_em.desc&limit=30&select=criado_em,usuario_email,campanha_nome,acao,resumo`,
    { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } },
  )
  if (!r.ok) return { disponivel: false, itens: [] }
  return { disponivel: true, itens: await r.json() }
}

// ── Leitura ─────────────────────────────────────────────────────────────────

async function lerConta(gads, conta, p) {
  const c = cliente(gads, conta.id)
  const [base, metricas] = await Promise.all([
    c.query(`
      SELECT campaign.id, campaign.name, campaign.status, campaign.advertising_channel_type,
             campaign_budget.amount_micros, campaign_budget.explicitly_shared, campaign_budget.reference_count
      FROM campaign
      WHERE campaign.status IN ('ENABLED', 'PAUSED')
    `),
    c.query(`
      SELECT campaign.id, metrics.cost_micros, metrics.conversions, metrics.conversions_value,
             metrics.clicks, metrics.impressions,
             metrics.search_budget_lost_impression_share, metrics.search_rank_lost_impression_share
      FROM campaign
      WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}' AND campaign.status IN ('ENABLED', 'PAUSED')
    `),
  ])
  const porId = new Map(metricas.map(r => [String(r.campaign.id), r.metrics]))
  return base.map(r => {
    const m = porId.get(String(r.campaign.id))
    return {
      id:     String(r.campaign.id),
      nome:   r.campaign.name,
      status: statusTexto(r.campaign.status),
      pesquisa: r.campaign.advertising_channel_type === 2 || r.campaign.advertising_channel_type === 'SEARCH',
      orcamento_diario: Number(r.campaign_budget?.amount_micros || 0) / 1e6,
      orcamento_compartilhado: !!r.campaign_budget?.explicitly_shared || Number(r.campaign_budget?.reference_count || 1) > 1,
      ...somar(vazio(), m),
      perda_orcamento:     m?.search_budget_lost_impression_share ?? null,
      perda_classificacao: m?.search_rank_lost_impression_share ?? null,
    }
  })
}

async function lerPalavras(gads, contaId, campanhaId, p) {
  const c = cliente(gads, contaId)
  const [grupos, palavras, metricas] = await Promise.all([
    c.query(`
      SELECT ad_group.id, ad_group.name, ad_group.status FROM ad_group
      WHERE campaign.id = ${campanhaId} AND ad_group.status != 'REMOVED'
    `),
    c.query(`
      SELECT ad_group.id, ad_group_criterion.criterion_id, ad_group_criterion.keyword.text,
             ad_group_criterion.keyword.match_type, ad_group_criterion.status
      FROM ad_group_criterion
      WHERE campaign.id = ${campanhaId} AND ad_group_criterion.type = 'KEYWORD'
        AND ad_group_criterion.negative = FALSE AND ad_group_criterion.status != 'REMOVED'
    `),
    c.query(`
      SELECT ad_group.id, ad_group_criterion.criterion_id, metrics.cost_micros, metrics.conversions, metrics.clicks
      FROM keyword_view
      WHERE campaign.id = ${campanhaId} AND segments.date BETWEEN '${p.ini}' AND '${p.fim}'
    `),
  ])
  const chave = r => `${r.ad_group.id}~${r.ad_group_criterion.criterion_id}`
  const m = new Map(metricas.map(r => [chave(r), r.metrics]))
  const correspondencia = { 2: 'EXACT', 3: 'PHRASE', 4: 'BROAD' }
  return grupos.map(g => ({
    id: String(g.ad_group.id), nome: g.ad_group.name, status: statusTexto(g.ad_group.status),
    palavras: palavras.filter(k => String(k.ad_group.id) === String(g.ad_group.id)).map(k => {
      const mm = m.get(chave(k))
      return {
        id: chave(k),
        texto: k.ad_group_criterion.keyword.text,
        correspondencia: correspondencia[k.ad_group_criterion.keyword.match_type] || String(k.ad_group_criterion.keyword.match_type),
        status: statusTexto(k.ad_group_criterion.status),
        custo: Number(mm?.cost_micros || 0) / 1e6,
        conversoes: Number(mm?.conversions || 0),
        cliques: Number(mm?.clicks || 0),
      }
    }).sort((a, b) => b.custo - a.custo),
  }))
}

async function lerRegioes(gads, contaId, campanhaId) {
  const c = cliente(gads, contaId)
  const crit = await c.query(`
    SELECT campaign_criterion.criterion_id, campaign_criterion.negative, campaign_criterion.location.geo_target_constant
    FROM campaign_criterion
    WHERE campaign.id = ${campanhaId} AND campaign_criterion.type = 'LOCATION'
  `)
  if (!crit.length) return []
  const rns = crit.map(r => `'${r.campaign_criterion.location.geo_target_constant}'`).join(',')
  const nomes = await c.query(`
    SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name, geo_target_constant.target_type
    FROM geo_target_constant WHERE geo_target_constant.resource_name IN (${rns})
  `)
  const porRn = new Map(nomes.map(n => [n.geo_target_constant.resource_name, n.geo_target_constant]))
  return crit.map(r => {
    const g = porRn.get(r.campaign_criterion.location.geo_target_constant) || {}
    return {
      criterio: String(r.campaign_criterion.criterion_id),
      nome: nomeRegiao(g),
      tipo: TIPOS_REGIAO[g.target_type] || g.target_type || '',
      excluida: !!r.campaign_criterion.negative,
    }
  })
}

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })
  const usuario = await exigirLogin(req, res, { emails: [EMAIL_GABRIEL] })
  if (!usuario) return

  if (!process.env.GOOGLE_ADS_DEVELOPER_TOKEN || !process.env.GOOGLE_ADS_MCC_ID) {
    return res.status(500).json({ erro: 'Credenciais Google Ads não configuradas no servidor' })
  }

  const b = req.body || {}
  const { acao } = b
  const n = [7, 14, 30, 90].includes(Number(b.dias)) ? Number(b.dias) : 30
  const p = periodos(n)

  const gads = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  })

  try {
    if (acao === 'contas') {
      const mcc = cliente(gads, process.env.GOOGLE_ADS_MCC_ID)
      const linhas = await mcc.query(`
        SELECT customer_client.id, customer_client.descriptive_name, customer_client.currency_code,
               customer_client.status, customer_client.manager
        FROM customer_client
        WHERE customer_client.level = 1
      `)
      const contas = linhas
        .map(r => r.customer_client)
        .filter(c => !c.manager && (c.status === 2 || c.status === 'ENABLED'))
        .map(c => ({ id: String(c.id), nome: c.descriptive_name, moeda: c.currency_code }))

      const resultado = await emLotes(contas, 6, conta => resumoDaConta(gads, conta, p))
      return res.status(200).json({ periodo: p, dias: n, mcc: limpar(process.env.GOOGLE_ADS_MCC_ID), contas: resultado })
    }

    // Todas as ações abaixo são de uma conta específica, que precisa pertencer à MCC.
    const conta = await contaDaMcc(gads, b.contaId)
    const c = cliente(gads, conta.id)

    if (acao === 'conta') {
      const [campanhas, historico] = await Promise.all([lerConta(gads, conta, p), lerHistorico(req, conta.id)])
      return res.status(200).json({ periodo: p, campanhas, historico })
    }

    // Termos que gastam sem converter: carregado sob demanda ao abrir uma conta.
    if (acao === 'termos') {
      const rows = await c.query(`
        SELECT search_term_view.search_term, campaign.id, campaign.name,
               metrics.cost_micros, metrics.clicks, metrics.conversions
        FROM search_term_view
        WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}'
          AND metrics.cost_micros > 0
        ORDER BY metrics.cost_micros DESC
        LIMIT 300
      `)
      const termos = rows
        .map(r => ({
          termo:       r.search_term_view.search_term,
          campanha_id: String(r.campaign.id),
          campanha:    r.campaign.name,
          custo:       Number(r.metrics.cost_micros || 0) / 1e6,
          cliques:     Number(r.metrics.clicks || 0),
          conversoes:  Number(r.metrics.conversions || 0),
        }))
        .filter(t => t.conversoes === 0)
        .slice(0, 30)
      return res.status(200).json({ periodo: p, termos })
    }

    if (acao === 'palavras') {
      if (!soDigitos(b.campanhaId)) recusar('Campanha inválida')
      return res.status(200).json({ grupos: await lerPalavras(gads, conta.id, b.campanhaId, p) })
    }

    if (acao === 'regioes') {
      if (!soDigitos(b.campanhaId)) recusar('Campanha inválida')
      return res.status(200).json({ regioes: await lerRegioes(gads, conta.id, b.campanhaId) })
    }

    if (acao === 'buscar_regiao') {
      const texto = String(b.texto || '').trim()
      if (texto.length < 2) return res.status(200).json({ sugestoes: [] })
      const r = await c.geoTargetConstants.suggestGeoTargetConstants({ locale: 'pt', country_code: 'BR', location_names: { names: [texto] } })
      const sugestoes = (r.geo_target_constant_suggestions || []).slice(0, 8).map(s => ({
        geo:  s.geo_target_constant.resource_name,
        nome: nomeRegiao(s.geo_target_constant),
        tipo: TIPOS_REGIAO[s.geo_target_constant.target_type] || s.geo_target_constant.target_type,
        alcance: Number(s.reach || 0),
      }))
      return res.status(200).json({ sugestoes })
    }

    // ── Alterações ─────────────────────────────────────────────────────────
    let campanha = null, resumo = '', detalhe = {}

    if (acao === 'status_campanha') {
      if (!['ENABLED', 'PAUSED'].includes(b.status)) recusar('Status inválido')
      campanha = await campanhaDaConta(c, conta.id, b.campanhaId)
      if (campanha.status === b.status) recusar(`A campanha já está ${b.status === 'ENABLED' ? 'ativa' : 'pausada'}`)
      await c.campaigns.update([{ resource_name: campanha.rn, status: b.status }])
      resumo = b.status === 'ENABLED' ? 'Campanha ativada' : 'Campanha pausada'
      detalhe = { antes: campanha.status, depois: b.status }
    }

    else if (acao === 'orcamento') {
      const valor = Math.round(Number(b.valor) * 100) / 100
      if (!(valor >= 1 && valor <= ORCAMENTO_MAX)) recusar(`O orçamento diário precisa ficar entre R$ 1 e R$ ${ORCAMENTO_MAX}`)
      campanha = await campanhaDaConta(c, conta.id, b.campanhaId)
      if (campanha.orcamentoCompartilhado) recusar('Esta campanha usa um orçamento compartilhado com outras campanhas. Altere direto no Google Ads para não mexer nas outras sem querer.')
      if (!campanha.orcamentoRn) recusar('Orçamento da campanha não encontrado')
      await c.campaignBudgets.update([{ resource_name: campanha.orcamentoRn, amount_micros: Math.round(valor * 1e6) }])
      resumo = `Orçamento diário de R$ ${campanha.orcamento.toFixed(2)} para R$ ${valor.toFixed(2)}`
      detalhe = { antes: campanha.orcamento, depois: valor }
    }

    else if (acao === 'negativar') {
      const termos = [...new Set((b.termos || []).map(t => String(t).trim().toLowerCase()).filter(Boolean))]
      if (!termos.length) recusar('Nenhum termo selecionado')
      if (termos.length > LOTE_MAX) recusar(`No máximo ${LOTE_MAX} termos por vez`)
      if (termos.some(t => t.length > 80)) recusar('Termo longo demais (máximo de 80 caracteres)')
      const tipo = b.correspondencia === 'PHRASE' ? 'PHRASE' : 'EXACT'
      campanha = await campanhaDaConta(c, conta.id, b.campanhaId)
      const r = await c.campaignCriteria.create(
        termos.map(text => ({ campaign: campanha.rn, negative: true, keyword: { text, match_type: enums.KeywordMatchType[tipo] } })),
        { partial_failure: true },
      )
      const falhas = (r.partial_failure_error?.details || []).length
      resumo = `${termos.length} ${termos.length === 1 ? 'termo negativado' : 'termos negativados'} (${tipo === 'EXACT' ? 'exata' : 'frase'})`
      detalhe = { termos, correspondencia: tipo, falhas }
    }

    else if (acao === 'palavras_adicionar') {
      const palavras = [...new Set((b.palavras || []).map(t => String(t).trim().toLowerCase()).filter(Boolean))]
      if (!palavras.length) recusar('Nenhuma palavra-chave informada')
      if (palavras.length > LOTE_MAX) recusar(`No máximo ${LOTE_MAX} palavras-chave por vez`)
      if (palavras.some(t => t.length > 80)) recusar('Palavra-chave longa demais (máximo de 80 caracteres)')
      const tipo = ['EXACT', 'PHRASE', 'BROAD'].includes(b.correspondencia) ? b.correspondencia : 'PHRASE'
      if (!soDigitos(b.grupoId)) recusar('Grupo de anúncios inválido')
      const [g] = await c.query(`
        SELECT ad_group.id, ad_group.name, campaign.id, campaign.name FROM ad_group
        WHERE ad_group.id = ${b.grupoId} AND ad_group.status != 'REMOVED'
      `)
      if (!g) recusar('Grupo de anúncios não encontrado nesta conta')
      campanha = { id: String(g.campaign.id), nome: g.campaign.name }
      await c.adGroupCriteria.create(palavras.map(text => ({
        ad_group: `customers/${conta.id}/adGroups/${g.ad_group.id}`,
        status: 'ENABLED',
        keyword: { text, match_type: enums.KeywordMatchType[tipo] },
      })))
      resumo = `${palavras.length} ${palavras.length === 1 ? 'palavra-chave adicionada' : 'palavras-chave adicionadas'} no grupo ${g.ad_group.name}`
      detalhe = { grupo: g.ad_group.name, palavras, correspondencia: tipo }
    }

    else if (acao === 'palavra_status') {
      if (!['ENABLED', 'PAUSED'].includes(b.status)) recusar('Status inválido')
      const [grupoId, criterioId] = String(b.palavraId || '').split('~')
      if (!soDigitos(grupoId) || !soDigitos(criterioId)) recusar('Palavra-chave inválida')
      const [k] = await c.query(`
        SELECT ad_group_criterion.keyword.text, ad_group_criterion.status, campaign.id, campaign.name
        FROM ad_group_criterion
        WHERE ad_group.id = ${grupoId} AND ad_group_criterion.criterion_id = ${criterioId}
      `)
      if (!k) recusar('Palavra-chave não encontrada nesta conta')
      campanha = { id: String(k.campaign.id), nome: k.campaign.name }
      await c.adGroupCriteria.update([{ resource_name: `customers/${conta.id}/adGroupCriteria/${grupoId}~${criterioId}`, status: b.status }])
      resumo = `Palavra-chave "${k.ad_group_criterion.keyword.text}" ${b.status === 'ENABLED' ? 'ativada' : 'pausada'}`
      detalhe = { palavra: k.ad_group_criterion.keyword.text, antes: statusTexto(k.ad_group_criterion.status), depois: b.status }
    }

    else if (acao === 'regiao_adicionar') {
      if (!/^geoTargetConstants\/\d+$/.test(String(b.geo))) recusar('Região inválida')
      campanha = await campanhaDaConta(c, conta.id, b.campanhaId)
      const excluir = !!b.excluir
      await c.campaignCriteria.create([{ campaign: campanha.rn, negative: excluir, location: { geo_target_constant: b.geo } }])
      resumo = `${excluir ? 'Região excluída' : 'Região incluída'}: ${b.nome || b.geo}`
      detalhe = { geo: b.geo, nome: b.nome, excluida: excluir }
    }

    else if (acao === 'regiao_remover') {
      if (!soDigitos(b.criterio)) recusar('Região inválida')
      campanha = await campanhaDaConta(c, conta.id, b.campanhaId)
      const regioes = await lerRegioes(gads, conta.id, campanha.id)
      const alvo = regioes.find(r => r.criterio === String(b.criterio))
      if (!alvo) recusar('Região não encontrada nesta campanha')
      if (!alvo.excluida && regioes.filter(r => !r.excluida).length === 1) {
        recusar('Esta é a única região da campanha. Sem nenhuma, ela passaria a aparecer no mundo inteiro. Inclua a nova região antes de remover esta.')
      }
      await c.campaignCriteria.remove([`${campanha.rn.replace('/campaigns/', '/campaignCriteria/')}~${alvo.criterio}`])
      resumo = `${alvo.excluida ? 'Exclusão de região desfeita' : 'Região removida'}: ${alvo.nome}`
      detalhe = { nome: alvo.nome, excluida: alvo.excluida }
    }

    else {
      return res.status(400).json({ erro: `acao inválida: "${acao}"` })
    }

    const registrado = await registrar(req, usuario, conta, campanha, acao, resumo, detalhe)
    return res.status(200).json({ ok: true, resumo, registrado, detalhe })
  } catch (e) {
    if (e instanceof ErroUsuario) return res.status(422).json({ erro: e.message })
    const msg = e.errors?.[0]?.message || e.message
    console.error('[api/trafego]', acao, msg)
    return res.status(502).json({ erro: `O Google Ads recusou: ${msg}` })
  }
}
