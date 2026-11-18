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

const DIA = 86400000
const MAX_DIAS_PERIODO = 400
const ehDataISO = v => /^\d{4}-\d{2}-\d{2}$/.test(String(v)) && !Number.isNaN(Date.parse(`${v}T12:00:00Z`))

// Período escolhido na tela, no fuso de Brasília. Os de "N dias" terminam ontem (dia fechado);
// hoje, este mês e o personalizado podem incluir o dia corrente. O anterior tem o mesmo tamanho, logo antes.
function periodoDe(b) {
  const hoje = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) + 'T12:00:00Z')
  const ontem = new Date(hoje.getTime() - DIA)
  const chave = String(b.periodo || (b.dias ? `d${b.dias}` : 'd30'))
  let ini, fim
  if (chave === 'hoje') { ini = hoje; fim = hoje }
  else if (chave === 'ontem') { ini = ontem; fim = ontem }
  else if (chave === 'mes') { ini = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 1, 12)); fim = hoje }
  else if (chave === 'mes_anterior') {
    ini = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() - 1, 1, 12))
    fim = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth(), 0, 12))
  } else if (chave.startsWith('r:')) {
    const [, a, z] = chave.split(':')
    if (!ehDataISO(a) || !ehDataISO(z)) recusar('Datas do período inválidas')
    ini = new Date(`${a}T12:00:00Z`); fim = new Date(`${z}T12:00:00Z`)
    if (ini > fim) [ini, fim] = [fim, ini]
    if (fim > hoje) fim = hoje
    if (ini > hoje) recusar('O período não pode começar no futuro')
    if ((fim - ini) / DIA + 1 > MAX_DIAS_PERIODO) recusar(`Escolha um período de até ${MAX_DIAS_PERIODO} dias`)
  } else {
    const n = [7, 14, 30, 90].includes(Number(chave.slice(1))) ? Number(chave.slice(1)) : 30
    fim = ontem; ini = new Date(ontem.getTime() - (n - 1) * DIA)
  }
  const dias = Math.round((fim - ini) / DIA) + 1
  const fimAnt = new Date(ini.getTime() - DIA)
  const iniAnt = new Date(fimAnt.getTime() - (dias - 1) * DIA)
  return { ini: dataISO(ini), fim: dataISO(fim), iniAnt: dataISO(iniAnt), fimAnt: dataISO(fimAnt), dias, incluiHoje: dataISO(fim) === dataISO(hoje) }
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

// Até `tamanho` leituras ao mesmo tempo; assim que uma termina, a próxima começa
// (em levas fixas, cada leva esperava a conta mais lenta). Mantém a ordem original.
async function emLotes(itens, tamanho, fn) {
  const saida = new Array(itens.length)
  let proximo = 0
  const trabalhador = async () => {
    while (proximo < itens.length) {
      const i = proximo++
      saida[i] = await fn(itens[i])
    }
  }
  await Promise.all(Array.from({ length: Math.min(tamanho, itens.length) }, trabalhador))
  return saida
}

const statusTexto = s => (s === 2 || s === 'ENABLED' ? 'ENABLED' : s === 3 || s === 'PAUSED' ? 'PAUSED' : 'OUTRO')

const TIPOS_REGIAO = {
  Country: 'País', State: 'Estado', City: 'Cidade', Municipality: 'Município', Region: 'Região',
  District: 'Distrito', Neighborhood: 'Bairro', 'Postal Code': 'CEP', 'Metro Area': 'Região metropolitana',
}

function nomeRegiao(g) {
  return String(g.canonical_name || g.name || '')
    .split(',').map(p => p.replace(/^State of /, 'Estado de ')).filter((p, i, a) => p !== 'Brazil' && p !== a[i - 1]).join(', ')
}

async function resumoDaConta(gads, conta, p) {
  const c = cliente(gads, conta.id)
  try {
    // Consulta à parte e tolerante a falha: se der erro, a conta continua sendo lida.
    const reprovadosQ = c.query(`
      SELECT ad_group_ad.ad.id FROM ad_group_ad
      WHERE ad_group_ad.status = 'ENABLED' AND ad_group.status = 'ENABLED' AND campaign.status = 'ENABLED'
        AND ad_group_ad.policy_summary.approval_status = 'DISAPPROVED'
    `).then(r => r.length).catch(() => null)
    const saldoQ = saldoDaConta(c).catch(() => null)
    const [diario, campanhas, categorias, reprovados, saldo] = await Promise.all([
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
      c.query(`
        SELECT segments.conversion_action_category, metrics.conversions
        FROM customer WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}'
      `),
      reprovadosQ,
      saldoQ,
    ])

    const atual = vazio(), anterior = vazio()
    for (const r of diario) somar(r.segments.date >= p.ini ? atual : anterior, r.metrics)

    // Dias seguidos sem gasto até ontem. Cartão recusado ou conta travada aparece
    // aqui em 1–2 dias, bem antes de pesar na comparação de períodos.
    const gastoDia = {}
    for (const r of diario) gastoDia[r.segments.date] = (gastoDia[r.segments.date] || 0) + Number(r.metrics.cost_micros || 0)
    let diasSemGasto = 0
    const dia = new Date(`${p.fim}T12:00:00Z`)
    if (p.incluiHoje) dia.setUTCDate(dia.getUTCDate() - 1)
    while (diasSemGasto < 7 && dia.toISOString().slice(0, 10) >= p.iniAnt && !(gastoDia[dia.toISOString().slice(0, 10)] > 0)) {
      diasSemGasto++
      dia.setUTCDate(dia.getUTCDate() - 1)
    }
    atual.diasSemGasto = diasSemGasto
    atual.anunciosReprovados = reprovados

    // Gasto dia a dia do período (para o mini-gráfico da lista), com zero nos dias sem gasto.
    const serie = []
    for (let d = new Date(`${p.ini}T12:00:00Z`); dataISO(d) <= p.fim && serie.length < 400; d.setUTCDate(d.getUTCDate() + 1)) {
      serie.push(Math.round((gastoDia[dataISO(d)] || 0) / 1e4) / 100)
    }

    atual.conversoesFracas = categorias
      .filter(r => CATEGORIAS_FRACAS.includes(nomeEnum(enums.ConversionActionCategory, r.segments.conversion_action_category)))
      .reduce((t, r) => t + Number(r.metrics.conversions || 0), 0)

    return {
      ...conta,
      atual, anterior, serie, saldo,
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

// ── Saldo das contas pré-pagas ──────────────────────────────────────────────
// Na conta de boleto/Pix, cada pagamento vira o limite do orçamento da conta:
// saldo = total pago + ajustes (créditos) − total já veiculado. Conta no cartão
// tem orçamento ilimitado e fica de fora. O gasto veiculado pode atrasar algumas horas.

const SALDO_LIMITE = 300
const SALDO_DIAS = 3

async function saldoDaConta(c) {
  const orcamentos = await c.query(`
    SELECT account_budget.approved_spending_limit_micros, account_budget.approved_spending_limit_type,
           account_budget.amount_served_micros, account_budget.total_adjustments_micros,
           account_budget.approved_start_date_time, account_budget.approved_end_date_time
    FROM account_budget WHERE account_budget.status = 'APPROVED'
  `)
  const agora = new Date().toLocaleString('sv-SE', { timeZone: 'America/Sao_Paulo' })
  const vigente = orcamentos.map(r => r.account_budget)
    .filter(a => !a.approved_end_date_time || a.approved_end_date_time > agora)
    .sort((a, b) => String(b.approved_start_date_time).localeCompare(String(a.approved_start_date_time)))[0]
  if (!vigente) return null
  const ilimitado = nomeEnum(enums.SpendingLimitType, vigente.approved_spending_limit_type) === 'INFINITE'
  if (ilimitado || vigente.approved_spending_limit_micros == null) return { prepago: false }
  // Mesmo cálculo do Faturamento do Google (conferido com Carol e Andressa): total pago
  // + ajustes − veiculado. O Google atualiza o veiculado com algumas horas de atraso.
  const hoje = agora.slice(0, 10)
  const ontem = dataISO(new Date(Date.parse(`${hoje}T12:00:00Z`) - DIA))
  const seteDias = dataISO(new Date(Date.parse(`${hoje}T12:00:00Z`) - 7 * DIA))
  const recente = await c.query(`SELECT metrics.cost_micros FROM customer WHERE segments.date BETWEEN '${seteDias}' AND '${ontem}'`)
  const somaMicros = rows => rows.reduce((s, r) => s + Number(r.metrics.cost_micros || 0), 0)
  const valor = (Number(vigente.approved_spending_limit_micros) + Number(vigente.total_adjustments_micros || 0)
    - Number(vigente.amount_served_micros || 0)) / 1e6
  const mediaDia = somaMicros(recente) / 1e6 / 7
  const saldo = Math.max(0, Math.round(valor * 100) / 100)
  return {
    prepago: true, valor: saldo, mediaDia: Math.round(mediaDia * 100) / 100,
    dias: mediaDia > 0.5 ? Math.floor((saldo / mediaDia) * 10) / 10 : null,
    baixo: saldo <= SALDO_LIMITE || (mediaDia > 0.5 && saldo / mediaDia < SALDO_DIAS),
  }
}

const curto = nome => String(nome).split(" | ")[0].trim()
const brlTexto = v => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

function textoDoAviso(itens) {
  const data = new Date().toLocaleDateString('pt-BR', { timeZone: 'America/Sao_Paulo', day: '2-digit', month: '2-digit' })
  const dura = d => d == null ? 'sem gasto nos últimos 7 dias' : d < 1 ? 'acaba hoje' : `dura ~${Math.floor(d)} ${Math.floor(d) === 1 ? 'dia' : 'dias'}`
  const porNome = (a, b) => curto(a.nome).localeCompare(curto(b.nome), 'pt-BR')
  const lidas = itens.filter(i => i.saldo)
  const grupos = [
    {
      titulo: '🔴 *ZERADAS* — anúncios parados',
      itens: lidas.filter(i => i.saldo.valor < 1).sort(porNome),
      linha: i => `• ${curto(i.nome)}`,
    },
    {
      titulo: `🟠 *SALDO BAIXO* — até ${brlTexto(SALDO_LIMITE)}`,
      itens: lidas.filter(i => i.saldo.valor >= 1 && i.saldo.valor <= SALDO_LIMITE).sort((a, b) => a.saldo.valor - b.saldo.valor),
      linha: i => `• ${curto(i.nome)}\n   ${brlTexto(i.saldo.valor)} · ${dura(i.saldo.dias)}`,
    },
    {
      titulo: `🟡 *ACABA EM BREVE* — menos de ${SALDO_DIAS} dias`,
      itens: lidas.filter(i => i.saldo.valor > SALDO_LIMITE).sort((a, b) => (a.saldo.dias ?? 99) - (b.saldo.dias ?? 99)),
      linha: i => `• ${curto(i.nome)}\n   ${brlTexto(i.saldo.valor)} · ${dura(i.saldo.dias)}`,
    },
    {
      titulo: '⚫ *SUSPENSAS* no Google Ads',
      itens: itens.filter(i => i.suspensa).sort(porNome),
      linha: i => `• ${curto(i.nome)}`,
    },
    {
      titulo: '⚪ *NÃO CONSEGUI LER*',
      itens: itens.filter(i => i.erro).sort(porNome),
      linha: i => `• ${curto(i.nome)}`,
    },
  ].filter(g => g.itens.length)
  const blocos = grupos.map(g => `${g.titulo} (${g.itens.length})\n${g.itens.map(g.linha).join('\n')}`)
  return [
    `💰 *Saldo Google Ads — ${data}*`,
    ...blocos,
    `_Contas de boleto/Pix. Recarregue em Faturamento no Google Ads. Valores estimados pela API do Google._`,
  ].join('\n\n')
}

async function verificarSaldos(gads) {
  const mcc = cliente(gads, process.env.GOOGLE_ADS_MCC_ID)
  const linhas = await mcc.query(`
    SELECT customer_client.id, customer_client.descriptive_name, customer_client.status, customer_client.manager
    FROM customer_client WHERE customer_client.level = 1
  `)
  const clientes = linhas.map(r => r.customer_client).filter(c => !c.manager)
  const ativa = c => c.status === 2 || c.status === 'ENABLED'
  const suspensa = c => c.status === 4 || c.status === 'SUSPENDED'
  const lidas = await emLotes(clientes.filter(ativa), 12, async c => {
    const conta = { id: String(c.id), nome: c.descriptive_name }
    try { return { ...conta, saldo: await saldoDaConta(cliente(gads, conta.id)) } }
    catch (e) { return { ...conta, erro: e.errors?.[0]?.message || e.message } }
  })
  const itens = [
    ...clientes.filter(suspensa).map(c => ({ id: String(c.id), nome: c.descriptive_name, suspensa: true })),
    ...lidas.filter(i => i.erro || i.saldo?.baixo).sort((a, b) => (a.saldo?.valor ?? -1) - (b.saldo?.valor ?? -1)),
  ]
  return { itens, lidas: lidas.length, texto: itens.length ? textoDoAviso(itens) : null }
}

// WhatsApp pela Z-API Omni (conexão WhatsApp Web "Gestão Tráfegon"). Secret Key e
// destinatários ficam só nas variáveis do Vercel.
async function enviarWhatsApp(texto) {
  const { ZAPI_OMNI_SECRET, ZAPI_CANAL_ID, AVISO_WHATSAPP } = process.env
  if (!ZAPI_OMNI_SECRET || !ZAPI_CANAL_ID || !AVISO_WHATSAPP) return { enviado: false, motivo: 'WhatsApp ainda não configurado no Vercel' }
  const numeros = AVISO_WHATSAPP.split(',').map(n => n.replace(/\D/g, '')).filter(Boolean)
  const falhas = []
  for (const identifier of numeros) {
    try {
      const r = await fetch(`https://api.omni.z-api.io/v1/channels/${encodeURIComponent(ZAPI_CANAL_ID.trim())}/messages`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${ZAPI_OMNI_SECRET.trim()}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipient: { identifier }, content: { type: 'TEXT', body: { message: texto } } }),
      })
      if (!r.ok) falhas.push(`${identifier.slice(-4)}: ${r.status} ${(await r.text()).slice(0, 120)}`)
    } catch (e) { falhas.push(`${identifier.slice(-4)}: ${e.message}`) }
  }
  return { enviado: falhas.length < numeros.length, falhas }
}

async function notificarNoHub(texto, itens) {
  const chave = process.env.SUPABASE_SERVICE_KEY
  if (!chave) return { enviado: false, motivo: 'SUPABASE_SERVICE_KEY ausente' }
  const destinos = String(process.env.AVISO_HUB_IDS || 'gs').split(',').map(s => s.trim()).filter(Boolean)
  const resumo = `Saldo baixo em ${itens.length} ${itens.length === 1 ? 'conta' : 'contas'}: ${itens.slice(0, 4).map(i => i.nome).join(', ')}${itens.length > 4 ? '…' : ''}`
  const r = await fetch(`${SUPABASE_URL}/rest/v1/notifications`, {
    method: 'POST',
    headers: { apikey: chave, Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
    body: JSON.stringify(destinos.map(id => ({ target_collab_id: id, actor_collab_id: null, event_type: 'saldo_baixo', message: resumo }))),
  })
  return { enviado: r.ok, motivo: r.ok ? null : `${r.status} ${(await r.text()).slice(0, 200)}` }
}

async function avisarSaldos(gads) {
  const v = await verificarSaldos(gads)
  if (!v.texto) return { ...v, hub: null, whatsapp: null }
  const [hub, whatsapp] = await Promise.all([notificarNoHub(v.texto, v.itens), enviarWhatsApp(v.texto)])
  return { ...v, hub, whatsapp }
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

const nomeEnum = (en, v) => (typeof v === 'string' ? v : Object.keys(en).find(k => en[k] === v) || String(v))

// Ações que medem interesse, e não contato ou venda: quando principais, inflam as conversões.
const CATEGORIAS_FRACAS = ['PAGE_VIEW', 'ENGAGEMENT', 'ADD_TO_CART', 'BEGIN_CHECKOUT']

const LANCES = {
  MANUAL_CPC: 'CPC manual', ENHANCED_CPC: 'CPC otimizado', MAXIMIZE_CONVERSIONS: 'Maximizar conversões',
  MAXIMIZE_CONVERSION_VALUE: 'Maximizar valor de conversão', TARGET_CPA: 'CPA desejado', TARGET_ROAS: 'ROAS desejado',
  TARGET_SPEND: 'Maximizar cliques', TARGET_IMPRESSION_SHARE: 'Parcela de impressões desejada',
}

const FORCA_ANUNCIO = { POOR: 'Ruim', AVERAGE: 'Média', GOOD: 'Boa', EXCELLENT: 'Excelente', PENDING: 'Em análise', NO_ADS: 'Sem anúncios' }

// Tudo o que o roteiro de otimização precisa de uma conta, numa leitura só.
async function lerOtimizacao(gads, conta, p) {
  const c = cliente(gads, conta.id)
  // Estrutura (palavras, anúncios, grupos) é lida sem filtro de data e as métricas do
  // período vêm à parte. Com data junto, o Google omite tudo o que não teve impressão
  // no período: palavra recém-adicionada não aparecia e anúncio sumia ao trocar 30 → 7 dias.
  const [diario, mes, acoesMetricas, acoesCfg, campanhasLance, palavras, palavrasMet, anuncios, anunciosMet, grupos, ativos, cidades, campanhas] = await Promise.all([
    c.query(`
      SELECT segments.date, metrics.cost_micros, metrics.conversions, metrics.clicks, metrics.impressions
      FROM customer WHERE segments.date BETWEEN '${p.iniAnt}' AND '${p.fim}'
    `),
    c.query(`SELECT metrics.cost_micros, metrics.conversions FROM customer WHERE segments.date DURING THIS_MONTH`),
    c.query(`
      SELECT segments.conversion_action, metrics.conversions, metrics.all_conversions
      FROM customer WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}'
    `),
    c.query(`
      SELECT conversion_action.resource_name, conversion_action.name, conversion_action.primary_for_goal,
             conversion_action.category, conversion_action.status
      FROM conversion_action WHERE conversion_action.status = 'ENABLED'
    `),
    c.query(`
      SELECT campaign.id, campaign.bidding_strategy_type, campaign.target_cpa.target_cpa_micros,
             campaign.maximize_conversions.target_cpa_micros
      FROM campaign WHERE campaign.status = 'ENABLED'
    `),
    c.query(`
      SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, ad_group_criterion.criterion_id,
             ad_group_criterion.keyword.text, ad_group_criterion.keyword.match_type, ad_group_criterion.status,
             ad_group_criterion.cpc_bid_micros, ad_group_criterion.quality_info.quality_score
      FROM ad_group_criterion
      WHERE campaign.status = 'ENABLED' AND ad_group.status != 'REMOVED'
        AND ad_group_criterion.type = 'KEYWORD' AND ad_group_criterion.negative = FALSE
        AND ad_group_criterion.status != 'REMOVED'
    `),
    c.query(`
      SELECT ad_group.id, ad_group_criterion.criterion_id,
             metrics.cost_micros, metrics.conversions, metrics.clicks, metrics.impressions
      FROM keyword_view
      WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}' AND campaign.status = 'ENABLED'
    `),
    c.query(`
      SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, ad_group_ad.ad.id, ad_group_ad.ad.type,
             ad_group_ad.status, ad_group_ad.ad_strength, ad_group_ad.policy_summary.approval_status,
             ad_group_ad.ad.responsive_search_ad.headlines, ad_group_ad.ad.responsive_search_ad.descriptions,
             ad_group_ad.ad.responsive_search_ad.path1, ad_group_ad.ad.responsive_search_ad.path2,
             ad_group_ad.ad.final_urls
      FROM ad_group_ad
      WHERE campaign.status = 'ENABLED' AND ad_group.status != 'REMOVED' AND ad_group_ad.status != 'REMOVED'
    `),
    c.query(`
      SELECT ad_group.id, ad_group_ad.ad.id, metrics.cost_micros, metrics.conversions, metrics.clicks, metrics.impressions
      FROM ad_group_ad
      WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}' AND campaign.status = 'ENABLED'
    `),
    c.query(`
      SELECT campaign.id, campaign.name, ad_group.id, ad_group.name, ad_group.status
      FROM ad_group
      WHERE campaign.status IN ('ENABLED', 'PAUSED') AND ad_group.status != 'REMOVED'
        AND campaign.advertising_channel_type = 'SEARCH'
    `),
    // Desempenho de cada título e descrição no período. Tolerante: se o Google não devolver, a conta continua.
    c.query(`
      SELECT ad_group.id, ad_group_ad.ad.id, asset.text_asset.text,
             ad_group_ad_asset_view.field_type, ad_group_ad_asset_view.performance_label,
             metrics.impressions, metrics.clicks, metrics.conversions
      FROM ad_group_ad_asset_view
      WHERE campaign.status = 'ENABLED' AND ad_group_ad_asset_view.enabled = TRUE
        AND segments.date BETWEEN '${p.ini}' AND '${p.fim}'
    `).catch(() => []),
    c.query(`
      SELECT campaign.id, campaign.status, segments.geo_target_city, metrics.cost_micros, metrics.conversions, metrics.clicks
      FROM geographic_view
      WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}' AND campaign.status = 'ENABLED'
    `),
    lerConta(gads, conta, p),
  ])

  const porDia = new Map()
  const atual = vazio(), anterior = vazio()
  for (const r of diario) {
    somar(r.segments.date >= p.ini ? atual : anterior, r.metrics)
    if (r.segments.date >= p.ini) porDia.set(r.segments.date, somar(porDia.get(r.segments.date) || vazio(), r.metrics))
  }
  const dias = []
  for (let d = new Date(p.ini + 'T12:00:00Z'); dataISO(d) <= p.fim; d = new Date(d.getTime() + 86400000)) {
    const v = porDia.get(dataISO(d)) || vazio()
    dias.push({ data: dataISO(d), custo: v.custo, conversoes: v.conversoes })
  }

  const hoje = new Date(new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) + 'T12:00:00Z')
  const diasNoMes = new Date(Date.UTC(hoje.getUTCFullYear(), hoje.getUTCMonth() + 1, 0)).getUTCDate()
  const lancePorCampanha = new Map(campanhasLance.map(r => [String(r.campaign.id), r.campaign]))
  const ativas = campanhas.filter(x => x.status === 'ENABLED')

  const metricasAcao = new Map()
  for (const r of acoesMetricas) {
    const m = metricasAcao.get(r.segments.conversion_action) || { conversoes: 0, todas: 0 }
    m.conversoes += Number(r.metrics.conversions || 0)
    m.todas += Number(r.metrics.all_conversions || 0)
    metricasAcao.set(r.segments.conversion_action, m)
  }

  const nomesCidades = new Map()
  const rnsCidades = [...new Set(cidades.map(r => r.segments.geo_target_city).filter(Boolean))]
  if (rnsCidades.length) {
    const g = await c.query(`
      SELECT geo_target_constant.resource_name, geo_target_constant.canonical_name, geo_target_constant.target_type
      FROM geo_target_constant WHERE geo_target_constant.resource_name IN (${rnsCidades.map(x => `'${x}'`).join(',')})
    `)
    for (const x of g) nomesCidades.set(x.geo_target_constant.resource_name, nomeRegiao(x.geo_target_constant))
  }
  const porCidade = new Map()
  for (const r of cidades) {
    const rn = r.segments.geo_target_city
    if (!rn) continue
    const atualCidade = porCidade.get(rn) || { geo: rn, nome: nomesCidades.get(rn) || rn, custo: 0, conversoes: 0, cliques: 0, campanhas: [] }
    atualCidade.custo += Number(r.metrics.cost_micros || 0) / 1e6
    atualCidade.conversoes += Number(r.metrics.conversions || 0)
    atualCidade.cliques += Number(r.metrics.clicks || 0)
    if (!atualCidade.campanhas.includes(String(r.campaign.id))) atualCidade.campanhas.push(String(r.campaign.id))
    porCidade.set(rn, atualCidade)
  }

  const metPalavra = somaPorChave(palavrasMet, m => `${m.ad_group.id}~${m.ad_group_criterion.criterion_id}`)
  const metAnuncio = somaPorChave(anunciosMet, m => `${m.ad_group.id}~${m.ad_group_ad.ad.id}`)
  const correspondencia = { 2: 'EXACT', 3: 'PHRASE', 4: 'BROAD' }
  return {
    atual, anterior, dias,
    mes: {
      custo: Number(mes[0]?.metrics.cost_micros || 0) / 1e6,
      conversoes: Number(mes[0]?.metrics.conversions || 0),
      diasPassados: hoje.getUTCDate() - 1,
      diasNoMes,
      orcamentoDiario: ativas.reduce((s, x) => s + x.orcamento_diario, 0),
    },
    conversoes: acoesCfg.map(r => {
      const a = r.conversion_action
      const m = metricasAcao.get(a.resource_name) || { conversoes: 0, todas: 0 }
      const categoria = nomeEnum(enums.ConversionActionCategory, a.category)
      return {
        id: a.resource_name, nome: a.name, principal: !!a.primary_for_goal, categoria,
        fraca: CATEGORIAS_FRACAS.includes(categoria), conversoes: m.conversoes, todas: m.todas,
      }
    }).sort((x, y) => y.todas - x.todas),
    campanhas: campanhas.map(x => {
      const l = lancePorCampanha.get(x.id)
      const tipo = l ? nomeEnum(enums.BiddingStrategyType, l.bidding_strategy_type) : null
      const cpaAlvo = Number(l?.target_cpa?.target_cpa_micros || l?.maximize_conversions?.target_cpa_micros || 0) / 1e6
      return { ...x, lance: tipo, lanceNome: LANCES[tipo] || tipo, cpaAlvo: cpaAlvo || null, lanceManual: ['MANUAL_CPC', 'ENHANCED_CPC'].includes(tipo) }
    }),
    palavras: palavras.map(r => ({
      id: `${r.ad_group.id}~${r.ad_group_criterion.criterion_id}`,
      texto: r.ad_group_criterion.keyword.text,
      correspondencia: correspondencia[r.ad_group_criterion.keyword.match_type] || String(r.ad_group_criterion.keyword.match_type),
      status: statusTexto(r.ad_group_criterion.status),
      campanhaId: String(r.campaign.id), campanha: r.campaign.name, grupoId: String(r.ad_group.id), grupo: r.ad_group.name,
      lance: r.ad_group_criterion.cpc_bid_micros ? Number(r.ad_group_criterion.cpc_bid_micros) / 1e6 : null,
      qualidade: r.ad_group_criterion.quality_info?.quality_score || null,
      ...(metPalavra.get(`${r.ad_group.id}~${r.ad_group_criterion.criterion_id}`) || vazio()),
    })).sort((x, y) => y.custo - x.custo),
    grupos: grupos.map(r => ({
      id: String(r.ad_group.id), nome: r.ad_group.name, status: statusTexto(r.ad_group.status),
      campanhaId: String(r.campaign.id), campanha: r.campaign.name,
    })),
    anuncios: anuncios.map(r => {
      const chave = `${r.ad_group.id}~${r.ad_group_ad.ad.id}`
      const rsa = r.ad_group_ad.ad.responsive_search_ad
      const desempenho = rotulosDosAtivos(ativos, chave)
      const textoComFixo = h => {
        const m = desempenho.get(h.text)
        return { texto: h.text, fixo: h.pinned_field ? nomeEnum(enums.ServedAssetFieldType, h.pinned_field) : null, desempenho: m?.rotulo || null, numeros: m ? { impressoes: m.impressoes, cliques: m.cliques, conversoes: m.conversoes } : null }
      }
      return {
        id: chave,
        tipo: nomeEnum(enums.AdType, r.ad_group_ad.ad.type),
        editavel: !!rsa && nomeEnum(enums.AdType, r.ad_group_ad.ad.type) === 'RESPONSIVE_SEARCH_AD',
        status: statusTexto(r.ad_group_ad.status),
        forca: FORCA_ANUNCIO[nomeEnum(enums.AdStrength, r.ad_group_ad.ad_strength)] || null,
        reprovado: nomeEnum(enums.PolicyApprovalStatus, r.ad_group_ad.policy_summary?.approval_status) === 'DISAPPROVED',
        limitado: nomeEnum(enums.PolicyApprovalStatus, r.ad_group_ad.policy_summary?.approval_status) === 'APPROVED_LIMITED',
        titulos: (rsa?.headlines || []).map(textoComFixo),
        descricoes: (rsa?.descriptions || []).map(textoComFixo),
        caminho1: rsa?.path1 || '', caminho2: rsa?.path2 || '',
        destino: r.ad_group_ad.ad.final_urls?.[0] || null,
        campanhaId: String(r.campaign.id), campanha: r.campaign.name, grupoId: String(r.ad_group.id), grupo: r.ad_group.name,
        ...(metAnuncio.get(chave) || vazio()),
      }
    }).sort((x, y) => y.custo - x.custo),
    cidades: juntarCidades([...porCidade.values()]).sort((x, y) => y.custo - x.custo).slice(0, 40),
  }
}

// Valida e monta títulos, descrições, URL e caminhos de um anúncio responsivo de pesquisa.
// Os limites são os do Google; validar aqui dá mensagem clara em vez do erro técnico dele.
const FIXOS = { titulo: ['HEADLINE_1', 'HEADLINE_2', 'HEADLINE_3'], descricao: ['DESCRIPTION_1', 'DESCRIPTION_2'] }
function textosDoAnuncio(b) {
  const lista = (itens, max, minimo, maximo, fixos, nome) => {
    const v = (Array.isArray(itens) ? itens : [])
      .map(x => ({ texto: String(x?.texto || '').trim(), fixo: fixos.includes(x?.fixo) ? x.fixo : null }))
      .filter(x => x.texto)
    if (v.length < minimo || v.length > maximo) recusar(`O anúncio precisa de ${minimo} a ${maximo} ${nome}`)
    const longo = v.find(x => x.texto.length > max)
    if (longo) recusar(`"${longo.texto}" passa de ${max} caracteres`)
    const vistos = new Set()
    for (const x of v) {
      const k = x.texto.toLowerCase()
      if (vistos.has(k)) recusar(`Texto repetido: "${x.texto}"`)
      vistos.add(k)
    }
    return v
  }
  const titulos = lista(b.titulos, 30, 3, 15, FIXOS.titulo, 'títulos')
  const descricoes = lista(b.descricoes, 90, 2, 4, FIXOS.descricao, 'descrições')
  let url
  try { url = new URL(String(b.url || '').trim()) } catch { recusar('URL de destino inválida') }
  if (!['http:', 'https:'].includes(url.protocol)) recusar('A URL de destino precisa começar com https://')
  const caminho = v => {
    const t = String(v || '').trim()
    if (t.length > 15) recusar(`O caminho "${t}" passa de 15 caracteres`)
    if (/[\s/]/.test(t)) recusar('O caminho da URL não pode ter espaço nem barra')
    return t
  }
  const caminho1 = caminho(b.caminho1), caminho2 = caminho(b.caminho2)
  if (caminho2 && !caminho1) recusar('Preencha o caminho 1 antes do caminho 2')
  const ativo = x => ({ text: x.texto, ...(x.fixo ? { pinned_field: enums.ServedAssetFieldType[x.fixo] } : {}) })
  return {
    url: url.toString(),
    rsa: { headlines: titulos.map(ativo), descriptions: descricoes.map(ativo), path1: caminho1, path2: caminho2 },
    resumo: { titulos: titulos.map(x => x.texto), descricoes: descricoes.map(x => x.texto), url: url.toString() },
  }
}

// Soma as linhas de métricas por chave (ex.: grupo~palavra).
function somaPorChave(linhas, chave) {
  const mapa = new Map()
  for (const r of linhas) {
    const k = chave(r)
    mapa.set(k, somar(mapa.get(k) || vazio(), r.metrics))
  }
  return mapa
}

const ROTULO_ATIVO = { BEST: 'Melhor', GOOD: 'Bom', LOW: 'Baixo', LEARNING: 'Aprendendo', PENDING: 'Aprendendo' }

// Desempenho de cada texto (título/descrição) de um anúncio, pelo rótulo do Google.
// O Google deixou de dar a etiqueta Melhor/Bom/Baixo (vem "não aplicável"), mas entrega os
// números de cada texto. A avaliação compara textos do mesmo tipo dentro do mesmo anúncio:
// o que mais converte é "Melhor"; o que o Google quase não mostra é "Baixo" (candidato a trocar).
function rotulosDosAtivos(ativos, chave) {
  const textos = new Map()
  for (const r of ativos) {
    if (`${r.ad_group.id}~${r.ad_group_ad.ad.id}` !== chave || !r.asset?.text_asset?.text) continue
    const k = `${r.ad_group_ad_asset_view.field_type}|${r.asset.text_asset.text}`
    const t = textos.get(k) || { tipo: r.ad_group_ad_asset_view.field_type, texto: r.asset.text_asset.text, impressoes: 0, cliques: 0, conversoes: 0,
      google: ROTULO_ATIVO[nomeEnum(enums.AssetPerformanceLabel, r.ad_group_ad_asset_view.performance_label)] || null }
    t.impressoes += Number(r.metrics?.impressions || 0)
    t.cliques += Number(r.metrics?.clicks || 0)
    t.conversoes += Number(r.metrics?.conversions || 0)
    textos.set(k, t)
  }
  const mapa = new Map()
  for (const t of textos.values()) {
    const mesmos = [...textos.values()].filter(x => x.tipo === t.tipo)
    const maxImp = Math.max(...mesmos.map(x => x.impressoes))
    const maxConv = Math.max(...mesmos.map(x => x.conversoes))
    let rotulo = t.google
    if (!rotulo && maxConv > 0 && t.conversoes === maxConv) rotulo = 'Melhor'
    else if (!rotulo && maxImp >= 100 && t.impressoes < maxImp * 0.15) rotulo = 'Baixo'
    mapa.set(t.texto, { rotulo, impressoes: t.impressoes, cliques: t.cliques, conversoes: Math.round(t.conversoes * 10) / 10 })
  }
  return mapa
}

// O Google separa cidade e município com o mesmo nome; para o gestor é um lugar só.
function juntarCidades(lista) {
  const porNome = new Map()
  for (const c of lista) {
    const j = porNome.get(c.nome)
    if (!j) { porNome.set(c.nome, { ...c, geos: [c.geo] }); continue }
    j.custo += c.custo
    j.conversoes += c.conversoes
    j.cliques += c.cliques
    j.geos.push(c.geo)
    for (const id of c.campanhas) if (!j.campanhas.includes(id)) j.campanhas.push(id)
  }
  return [...porNome.values()]
}

async function ultimasOtimizacoes(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  try {
    const r = await fetch(
      `${SUPABASE_URL}/rest/v1/trafego_alteracoes?acao=eq.otimizacao_concluida&order=criado_em.desc&limit=1000&select=conta_id,criado_em,usuario_email`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` } },
    )
    if (!r.ok) return {}
    const mapa = {}
    for (const x of await r.json()) if (!mapa[x.conta_id]) mapa[x.conta_id] = { em: x.criado_em, por: x.usuario_email }
    return mapa
  } catch {
    return {}
  }
}

// ── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Rotina diária do Vercel (vercel.json → crons): só passa com o CRON_SECRET.
  if (req.method === 'GET') {
    const segredo = process.env.CRON_SECRET
    if (!segredo || req.headers.authorization !== `Bearer ${segredo}`) return res.status(401).json({ erro: 'Não autorizado' })
    try {
      const gads = new GoogleAdsApi({
        client_id: process.env.GOOGLE_ADS_CLIENT_ID, client_secret: process.env.GOOGLE_ADS_CLIENT_SECRET,
        developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
      })
      const r = await avisarSaldos(gads)
      return res.status(200).json({ contas_lidas: r.lidas, avisos: r.itens.length, hub: r.hub, whatsapp: r.whatsapp })
    } catch (e) {
      return res.status(500).json({ erro: e.errors?.[0]?.message || e.message })
    }
  }
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })
  const usuario = await exigirLogin(req, res, { emails: [EMAIL_GABRIEL] })
  if (!usuario) return

  if (!process.env.GOOGLE_ADS_DEVELOPER_TOKEN || !process.env.GOOGLE_ADS_MCC_ID) {
    return res.status(500).json({ erro: 'Credenciais Google Ads não configuradas no servidor' })
  }

  const b = req.body || {}
  const { acao } = b
  let p

  const gads = new GoogleAdsApi({
    client_id:       process.env.GOOGLE_ADS_CLIENT_ID,
    client_secret:   process.env.GOOGLE_ADS_CLIENT_SECRET,
    developer_token: process.env.GOOGLE_ADS_DEVELOPER_TOKEN,
  })

  try {
    p = periodoDe(b)
    if (acao === 'contas') {
      const mcc = cliente(gads, process.env.GOOGLE_ADS_MCC_ID)
      const linhas = await mcc.query(`
        SELECT customer_client.id, customer_client.descriptive_name, customer_client.currency_code,
               customer_client.status, customer_client.manager
        FROM customer_client
        WHERE customer_client.level = 1
      `)
      const clientes = linhas.map(r => r.customer_client).filter(c => !c.manager)
      const contas = clientes
        .filter(c => c.status === 2 || c.status === 'ENABLED')
        .map(c => ({ id: String(c.id), nome: c.descriptive_name, moeda: c.currency_code }))
      // Conta suspensa não pode sumir da lista: é justamente a que mais precisa de atenção.
      const suspensas = clientes
        .filter(c => c.status === 4 || c.status === 'SUSPENDED')
        .map(c => ({ id: String(c.id), nome: c.descriptive_name, moeda: c.currency_code, situacao: 'suspensa', erro: 'A conta está suspensa pelo Google Ads' }))

      const [resultado, otimizacoes] = await Promise.all([
        emLotes(contas, 12, conta => resumoDaConta(gads, conta, p)),
        ultimasOtimizacoes(req),
      ])
      return res.status(200).json({ periodo: p, dias: p.dias, mcc: limpar(process.env.GOOGLE_ADS_MCC_ID), contas: [...suspensas, ...resultado], otimizacoes })
    }

    // Prévia do aviso diário de saldo; com enviar: true dispara agora para o hub e o WhatsApp.
    if (acao === 'aviso_saldo') {
      const r = b.enviar ? await avisarSaldos(gads) : await verificarSaldos(gads)
      return res.status(200).json({ contas_lidas: r.lidas, itens: r.itens, texto: r.texto, hub: r.hub ?? null, whatsapp: r.whatsapp ?? null })
    }

    // Todas as ações abaixo são de uma conta específica, que precisa pertencer à MCC.
    const conta = await contaDaMcc(gads, b.contaId)
    const c = cliente(gads, conta.id)

    if (acao === 'otimizar') {
      const [dados, historico] = await Promise.all([lerOtimizacao(gads, conta, p), lerHistorico(req, conta.id)])
      return res.status(200).json({ periodo: p, ...dados, historico })
    }

    if (acao === 'conta') {
      const [campanhas, historico] = await Promise.all([lerConta(gads, conta, p), lerHistorico(req, conta.id)])
      return res.status(200).json({ periodo: p, campanhas, historico })
    }

    // Termos de pesquisa do período: os que gastaram sem converter (para negativar) e os
    // que converteram e ainda não são palavra-chave (para adicionar). Termo já negativado
    // não volta para a lista — antes ele reaparecia e parecia que a negativação não tinha salvo.
    if (acao === 'termos') {
      const [rows, listas, totais] = await Promise.all([
        c.query(`
          SELECT search_term_view.search_term, search_term_view.status, campaign.id, campaign.name,
                 ad_group.id, ad_group.name, metrics.impressions, metrics.cost_micros, metrics.clicks, metrics.conversions
          FROM search_term_view
          WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}' AND metrics.impressions > 0
          ORDER BY metrics.clicks DESC
          LIMIT 10000
        `),
        c.query(`
          SELECT shared_set.id, shared_set.name, shared_set.member_count, shared_set.reference_count
          FROM shared_set WHERE shared_set.type = 'NEGATIVE_KEYWORDS' AND shared_set.status = 'ENABLED'
        `).catch(() => []),
        c.query(`
          SELECT metrics.clicks, metrics.cost_micros FROM campaign
          WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}' AND campaign.advertising_channel_type = 'SEARCH'
        `).catch(() => null),
      ])
      const porTermo = new Map()
      for (const r of rows) {
        const texto = r.search_term_view.search_term
        const k = `${r.campaign.id}|${texto}`
        const t = porTermo.get(k) || {
          termo: texto, campanha_id: String(r.campaign.id), campanha: r.campaign.name,
          impressoes: 0, custo: 0, cliques: 0, conversoes: 0, negativado: false, ePalavra: false, grupos: new Map(),
        }
        const conv = Number(r.metrics.conversions || 0)
        t.impressoes += Number(r.metrics.impressions || 0)
        t.custo += Number(r.metrics.cost_micros || 0) / 1e6
        t.cliques += Number(r.metrics.clicks || 0)
        t.conversoes += conv
        const situacao = nomeEnum(enums.SearchTermTargetingStatus, r.search_term_view.status)
        if (situacao === 'EXCLUDED' || situacao === 'ADDED_EXCLUDED') t.negativado = true
        if (situacao === 'ADDED' || situacao === 'ADDED_EXCLUDED') t.ePalavra = true
        const g = t.grupos.get(String(r.ad_group.id)) || { id: String(r.ad_group.id), nome: r.ad_group.name, conversoes: 0 }
        g.conversoes += conv
        t.grupos.set(g.id, g)
        porTermo.set(k, t)
      }
      const lista = [...porTermo.values()].map(({ grupos, ...t }) => {
        const g = [...grupos.values()].sort((a, b) => b.conversoes - a.conversoes)[0]
        return { ...t, grupo_id: g?.id || null, grupo: g?.nome || null }
      })
      const ordem = (a, b) => b.custo - a.custo || b.cliques - a.cliques || b.impressoes - a.impressoes
      // Todo termo sem conversão entra, inclusive os que só tiveram impressão: é o que o
      // Google mostra no relatório, e negativar cedo evita o clique pago depois.
      const termos = lista.filter(t => t.conversoes === 0 && !t.negativado && !t.ePalavra).sort(ordem).slice(0, 1000)
      const convertidos = lista.filter(t => t.conversoes > 0 && !t.ePalavra && !t.negativado)
        .sort((a, b) => b.conversoes - a.conversoes || b.custo - a.custo).slice(0, 200)
      const todos = [...lista].sort((a, b) => b.cliques - a.cliques || b.impressoes - a.impressoes || b.custo - a.custo).slice(0, 2000)
      const visiveis = lista.reduce((s, t) => s + t.cliques, 0)
      const cliquesConta = totais ? totais.reduce((s, r) => s + Number(r.metrics.clicks || 0), 0) : null
      return res.status(200).json({
        periodo: p, termos, convertidos, todos,
        cliques: { termos: visiveis, conta: cliquesConta, ocultos: cliquesConta == null ? null : Math.max(0, cliquesConta - visiveis) },
        listas: listas.map(r => ({
          id: String(r.shared_set.id), nome: r.shared_set.name,
          palavras: Number(r.shared_set.member_count || 0), campanhas: Number(r.shared_set.reference_count || 0),
        })).sort((a, b) => b.campanhas - a.campanhas),
      })
    }

    // Quem disputa o mesmo leilão (relatório de leilões do Google). Nem toda conta de
    // desenvolvedor tem esse dado liberado: quando não vem, mostra a própria parcela.
    if (acao === 'concorrentes') {
      if (!soDigitos(b.campanhaId)) recusar('Escolha uma campanha')
      const [eu] = await c.query(`
        SELECT campaign.name, metrics.search_impression_share, metrics.search_top_impression_share,
               metrics.search_absolute_top_impression_share, metrics.search_rank_lost_impression_share,
               metrics.search_budget_lost_impression_share
        FROM campaign WHERE campaign.id = ${b.campanhaId} AND segments.date BETWEEN '${p.ini}' AND '${p.fim}'
      `)
      const voce = eu ? {
        parcela: eu.metrics.search_impression_share ?? null,
        topo: eu.metrics.search_top_impression_share ?? null,
        primeiro: eu.metrics.search_absolute_top_impression_share ?? null,
        perdaClassificacao: eu.metrics.search_rank_lost_impression_share ?? null,
        perdaOrcamento: eu.metrics.search_budget_lost_impression_share ?? null,
      } : null
      try {
        const rows = await c.query(`
          SELECT segments.auction_insight_domain, metrics.auction_insight_search_impression_share,
                 metrics.auction_insight_search_overlap_rate, metrics.auction_insight_search_position_above_rate,
                 metrics.auction_insight_search_outranking_share, metrics.auction_insight_search_top_impression_percentage
          FROM campaign WHERE campaign.id = ${b.campanhaId} AND segments.date BETWEEN '${p.ini}' AND '${p.fim}'
        `)
        const concorrentes = rows.map(r => ({
          dominio: r.segments.auction_insight_domain,
          parcela: r.metrics.auction_insight_search_impression_share ?? null,
          sobreposicao: r.metrics.auction_insight_search_overlap_rate ?? null,
          acimaDeVoce: r.metrics.auction_insight_search_position_above_rate ?? null,
          voceNaFrente: r.metrics.auction_insight_search_outranking_share ?? null,
          topo: r.metrics.auction_insight_search_top_impression_percentage ?? null,
        })).filter(x => x.dominio).sort((a, b) => (b.parcela || 0) - (a.parcela || 0))
        return res.status(200).json({ periodo: p, disponivel: true, voce, concorrentes })
      } catch (e) {
        return res.status(200).json({ periodo: p, disponivel: false, voce, concorrentes: [], motivo: e.errors?.[0]?.message || e.message })
      }
    }

    // Confere se a página de destino responde antes de salvar um anúncio.
    if (acao === 'testar_url') {
      let u
      try { u = new URL(String(b.url || '').trim()) } catch { return res.status(200).json({ ok: false, motivo: 'URL inválida' }) }
      if (!['http:', 'https:'].includes(u.protocol)) return res.status(200).json({ ok: false, motivo: 'A URL precisa começar com https://' })
      if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|169\.254\.|0\.|\[)/i.test(u.hostname) || /\.(local|internal)$/i.test(u.hostname)) {
        return res.status(200).json({ ok: false, motivo: 'Endereço não permitido' })
      }
      try {
        const r = await fetch(u, { redirect: 'follow', signal: AbortSignal.timeout(8000), headers: { 'User-Agent': 'Mozilla/5.0 (compatible; HubTrafegon/1.0)' } })
        return res.status(200).json({ ok: r.status < 400, status: r.status, motivo: r.status < 400 ? null : `A página respondeu com erro ${r.status}` })
      } catch (e) {
        return res.status(200).json({ ok: false, motivo: e.name === 'TimeoutError' ? 'A página demorou mais de 8 segundos para responder' : 'A página não respondeu' })
      }
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

    else if (acao === 'anuncio_status') {
      if (!['ENABLED', 'PAUSED'].includes(b.status)) recusar('Status inválido')
      const [grupoId, anuncioId] = String(b.anuncioId || '').split('~')
      if (!soDigitos(grupoId) || !soDigitos(anuncioId)) recusar('Anúncio inválido')
      const [a] = await c.query(`
        SELECT ad_group_ad.status, ad_group.name, campaign.id, campaign.name FROM ad_group_ad
        WHERE ad_group.id = ${grupoId} AND ad_group_ad.ad.id = ${anuncioId}
      `)
      if (!a) recusar('Anúncio não encontrado nesta conta')
      if (b.status === 'PAUSED') {
        const [ativos] = await c.query(`
          SELECT ad_group.id FROM ad_group_ad
          WHERE ad_group.id = ${grupoId} AND ad_group_ad.status = 'ENABLED' AND ad_group_ad.ad.id != ${anuncioId}
          LIMIT 1
        `)
        if (!ativos) recusar('Este é o único anúncio ativo do grupo. Pausá-lo faz o grupo inteiro parar de aparecer. Crie outro anúncio antes.')
      }
      campanha = { id: String(a.campaign.id), nome: a.campaign.name }
      await c.adGroupAds.update([{ resource_name: `customers/${conta.id}/adGroupAds/${grupoId}~${anuncioId}`, status: b.status }])
      resumo = `Anúncio do grupo ${a.ad_group.name} ${b.status === 'ENABLED' ? 'ativado' : 'pausado'}`
      detalhe = { grupo: a.ad_group.name, antes: statusTexto(a.ad_group_ad.status), depois: b.status }
    }

    else if (acao === 'lance_palavra') {
      const valor = Math.round(Number(b.valor) * 100) / 100
      if (!(valor >= 0.05 && valor <= 200)) recusar('O lance precisa ficar entre R$ 0,05 e R$ 200')
      const [grupoId, criterioId] = String(b.palavraId || '').split('~')
      if (!soDigitos(grupoId) || !soDigitos(criterioId)) recusar('Palavra-chave inválida')
      const [k] = await c.query(`
        SELECT ad_group_criterion.keyword.text, ad_group_criterion.cpc_bid_micros, campaign.id, campaign.name, campaign.bidding_strategy_type
        FROM ad_group_criterion WHERE ad_group.id = ${grupoId} AND ad_group_criterion.criterion_id = ${criterioId}
      `)
      if (!k) recusar('Palavra-chave não encontrada nesta conta')
      const estrategia = nomeEnum(enums.BiddingStrategyType, k.campaign.bidding_strategy_type)
      if (!['MANUAL_CPC', 'ENHANCED_CPC'].includes(estrategia)) recusar(`A campanha usa ${LANCES[estrategia] || estrategia}: o Google define o lance de cada palavra. Ajuste a estratégia da campanha.`)
      campanha = { id: String(k.campaign.id), nome: k.campaign.name }
      const antes = Number(k.ad_group_criterion.cpc_bid_micros || 0) / 1e6
      await c.adGroupCriteria.update([{ resource_name: `customers/${conta.id}/adGroupCriteria/${grupoId}~${criterioId}`, cpc_bid_micros: Math.round(valor * 1e6) }])
      resumo = `Lance de "${k.ad_group_criterion.keyword.text}" de R$ ${antes.toFixed(2)} para R$ ${valor.toFixed(2)}`
      detalhe = { palavra: k.ad_group_criterion.keyword.text, antes, depois: valor }
    }

    else if (acao === 'cpa_alvo') {
      const valor = Math.round(Number(b.valor) * 100) / 100
      if (!(valor >= 1 && valor <= 5000)) recusar('O CPA desejado precisa ficar entre R$ 1 e R$ 5.000')
      campanha = await campanhaDaConta(c, conta.id, b.campanhaId)
      const [l] = await c.query(`
        SELECT campaign.bidding_strategy_type, campaign.target_cpa.target_cpa_micros, campaign.maximize_conversions.target_cpa_micros
        FROM campaign WHERE campaign.id = ${campanha.id}
      `)
      const estrategia = nomeEnum(enums.BiddingStrategyType, l.campaign.bidding_strategy_type)
      let antes
      if (estrategia === 'TARGET_CPA') {
        antes = Number(l.campaign.target_cpa?.target_cpa_micros || 0) / 1e6
        await c.campaigns.update([{ resource_name: campanha.rn, target_cpa: { target_cpa_micros: Math.round(valor * 1e6) } }])
      } else if (estrategia === 'MAXIMIZE_CONVERSIONS') {
        antes = Number(l.campaign.maximize_conversions?.target_cpa_micros || 0) / 1e6
        await c.campaigns.update([{ resource_name: campanha.rn, maximize_conversions: { target_cpa_micros: Math.round(valor * 1e6) } }])
      } else {
        recusar(`A campanha usa ${LANCES[estrategia] || estrategia}, que não tem CPA desejado.`)
      }
      resumo = antes ? `CPA desejado de R$ ${antes.toFixed(2)} para R$ ${valor.toFixed(2)}` : `CPA desejado definido em R$ ${valor.toFixed(2)}`
      detalhe = { estrategia, antes: antes || null, depois: valor }
    }

    else if (acao === 'conversao_principal') {
      const rn = String(b.conversaoId || '')
      if (!new RegExp(`^customers/${conta.id}/conversionActions/\\d+$`).test(rn)) recusar('Ação de conversão inválida')
      const [a] = await c.query(`
        SELECT conversion_action.name, conversion_action.primary_for_goal FROM conversion_action
        WHERE conversion_action.resource_name = '${rn}'
      `)
      if (!a) recusar('Ação de conversão não encontrada nesta conta')
      const principal = !!b.principal
      if (!!a.conversion_action.primary_for_goal === principal) recusar(`Esta ação já é ${principal ? 'principal' : 'secundária'}`)
      if (!principal) {
        const outras = await c.query(`
          SELECT conversion_action.resource_name FROM conversion_action
          WHERE conversion_action.status = 'ENABLED' AND conversion_action.primary_for_goal = TRUE
        `)
        if (outras.filter(o => o.conversion_action.resource_name !== rn).length === 0) {
          recusar('Esta é a única conversão principal da conta. Sem nenhuma, as campanhas que otimizam por conversão ficam sem referência. Marque outra como principal antes.')
        }
      }
      await c.conversionActions.update([{ resource_name: rn, primary_for_goal: principal }])
      resumo = `Conversão "${a.conversion_action.name}" agora é ${principal ? 'principal' : 'secundária'}`
      detalhe = { conversao: a.conversion_action.name, principal }
    }

    else if (acao === 'negativar_lista') {
      const termos = [...new Set((b.termos || []).map(t => String(t).trim().toLowerCase()).filter(Boolean))]
      if (!termos.length) recusar('Nenhum termo selecionado')
      if (termos.length > LOTE_MAX) recusar(`No máximo ${LOTE_MAX} termos por vez`)
      if (termos.some(t => t.length > 80)) recusar('Termo longo demais (máximo de 80 caracteres)')
      const tipo = b.correspondencia === 'PHRASE' ? 'PHRASE' : 'EXACT'
      if (!soDigitos(b.listaId)) recusar('Lista de negativas inválida')
      const [l] = await c.query(`
        SELECT shared_set.id, shared_set.name FROM shared_set
        WHERE shared_set.id = ${b.listaId} AND shared_set.type = 'NEGATIVE_KEYWORDS' AND shared_set.status = 'ENABLED'
      `)
      if (!l) recusar('Lista de negativas não encontrada nesta conta')
      const r = await c.sharedCriteria.create(
        termos.map(text => ({ shared_set: `customers/${conta.id}/sharedSets/${l.shared_set.id}`, keyword: { text, match_type: enums.KeywordMatchType[tipo] } })),
        { partial_failure: true },
      )
      const falhas = (r.partial_failure_error?.details || []).length
      resumo = `${termos.length} ${termos.length === 1 ? 'termo negativado' : 'termos negativados'} na lista "${l.shared_set.name}" (${tipo === 'EXACT' ? 'exata' : 'frase'})`
      detalhe = { lista: l.shared_set.name, termos, correspondencia: tipo, falhas }
    }

    else if (acao === 'anuncio_editar') {
      const [grupoId, anuncioId] = String(b.anuncioId || '').split('~')
      if (!soDigitos(grupoId) || !soDigitos(anuncioId)) recusar('Anúncio inválido')
      const [a] = await c.query(`
        SELECT ad_group_ad.ad.id, ad_group_ad.ad.type, ad_group.name, campaign.id, campaign.name FROM ad_group_ad
        WHERE ad_group.id = ${grupoId} AND ad_group_ad.ad.id = ${anuncioId} AND ad_group_ad.status != 'REMOVED'
      `)
      if (!a) recusar('Anúncio não encontrado nesta conta')
      if (nomeEnum(enums.AdType, a.ad_group_ad.ad.type) !== 'RESPONSIVE_SEARCH_AD') recusar('Só anúncios responsivos de pesquisa podem ser editados por aqui')
      const t = textosDoAnuncio(b)
      campanha = { id: String(a.campaign.id), nome: a.campaign.name }
      await c.ads.update([{ resource_name: `customers/${conta.id}/ads/${anuncioId}`, final_urls: [t.url], responsive_search_ad: t.rsa }])
      resumo = `Anúncio editado no grupo ${a.ad_group.name}`
      detalhe = { grupo: a.ad_group.name, ...t.resumo }
    }

    else if (acao === 'anuncio_criar') {
      if (!soDigitos(b.grupoId)) recusar('Grupo de anúncios inválido')
      const [g] = await c.query(`
        SELECT ad_group.id, ad_group.name, campaign.id, campaign.name FROM ad_group
        WHERE ad_group.id = ${b.grupoId} AND ad_group.status != 'REMOVED'
      `)
      if (!g) recusar('Grupo de anúncios não encontrado nesta conta')
      const t = textosDoAnuncio(b)
      campanha = { id: String(g.campaign.id), nome: g.campaign.name }
      await c.adGroupAds.create([{
        ad_group: `customers/${conta.id}/adGroups/${g.ad_group.id}`,
        status: 'ENABLED',
        ad: { final_urls: [t.url], responsive_search_ad: t.rsa },
      }])
      resumo = `Novo anúncio criado no grupo ${g.ad_group.name}`
      detalhe = { grupo: g.ad_group.name, ...t.resumo }
    }

    else if (acao === 'concluir_otimizacao') {
      const nota = String(b.nota || '').trim().slice(0, 2000)
      resumo = nota ? `Otimização concluída: ${nota}` : 'Otimização concluída'
      detalhe = { nota }
    }

    else {
      return res.status(400).json({ erro: `acao inválida: "${acao}"` })
    }

    const registrado = await registrar(req, usuario, conta, campanha, acao === 'concluir_otimizacao' ? 'otimizacao_concluida' : acao, resumo, detalhe)
    if (acao === 'concluir_otimizacao' && !registrado) {
      return res.status(503).json({ erro: 'Não foi possível registrar a otimização. Confira se o arquivo supabase/create-trafego-alteracoes.sql já foi rodado no Supabase.' })
    }
    return res.status(200).json({ ok: true, resumo, registrado, detalhe })
  } catch (e) {
    if (e instanceof ErroUsuario) return res.status(422).json({ erro: e.message })
    const msg = e.errors?.[0]?.message || e.message
    console.error('[api/trafego]', acao, msg)
    return res.status(502).json({ erro: `O Google Ads recusou: ${msg}` })
  }
}
