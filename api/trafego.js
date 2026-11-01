import { GoogleAdsApi } from 'google-ads-api'
import { exigirLogin, EMAIL_GABRIEL } from './_auth.js'

// Módulo Tráfego: somente leitura. Nenhuma ação altera as contas daqui.

const limpar = id => String(id).replace(/-/g, '')

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

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })
  if (!(await exigirLogin(req, res, { emails: [EMAIL_GABRIEL] }))) return

  if (!process.env.GOOGLE_ADS_DEVELOPER_TOKEN || !process.env.GOOGLE_ADS_MCC_ID) {
    return res.status(500).json({ erro: 'Credenciais Google Ads não configuradas no servidor' })
  }

  const { acao, dias = 30, contaId } = req.body || {}
  const n = [7, 14, 30, 90].includes(Number(dias)) ? Number(dias) : 30
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

    // Termos que gastam sem converter: carregado sob demanda ao abrir uma conta.
    if (acao === 'termos') {
      if (!contaId) return res.status(400).json({ erro: 'contaId obrigatório' })
      const rows = await cliente(gads, contaId).query(`
        SELECT search_term_view.search_term, campaign.name,
               metrics.cost_micros, metrics.clicks, metrics.conversions
        FROM search_term_view
        WHERE segments.date BETWEEN '${p.ini}' AND '${p.fim}'
          AND metrics.cost_micros > 0
        ORDER BY metrics.cost_micros DESC
        LIMIT 200
      `)
      const termos = rows
        .map(r => ({
          termo:      r.search_term_view.search_term,
          campanha:   r.campaign.name,
          custo:      Number(r.metrics.cost_micros || 0) / 1e6,
          cliques:    Number(r.metrics.clicks || 0),
          conversoes: Number(r.metrics.conversions || 0),
        }))
        .filter(t => t.conversoes === 0)
        .slice(0, 15)
      return res.status(200).json({ periodo: p, termos })
    }

    return res.status(400).json({ erro: `acao inválida: "${acao}"` })
  } catch (e) {
    console.error('[api/trafego]', e.message)
    return res.status(502).json({ erro: e.errors?.[0]?.message || e.message })
  }
}
