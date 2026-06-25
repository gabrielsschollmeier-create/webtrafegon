const ADS_API_VERSION = 'v21'

async function getAccessToken(clientId, clientSecret, refreshToken) {
  const resp = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(`OAuth2: ${data.error_description || data.error}`)
  return data.access_token
}

async function gadsQuery(accessToken, developerToken, mccId, customerId, query) {
  const cid = String(customerId).replace(/-/g, '')
  const url = `https://googleads.googleapis.com/${ADS_API_VERSION}/customers/${cid}/googleAds:search`
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'developer-token': developerToken,
      'login-customer-id': String(mccId).replace(/-/g, ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  })
  const data = await resp.json()
  if (!resp.ok) throw new Error(data.error?.message || `Google Ads API ${resp.status}`)
  return data.results || []
}

function calcDates(dias) {
  const hoje = new Date()
  const dataFim    = hoje.toISOString().split('T')[0]
  const dataInicio = new Date(hoje.getTime() - Number(dias) * 86400000).toISOString().split('T')[0]
  return { dataInicio, dataFim }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })

  const {
    GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET,
    GOOGLE_ADS_REFRESH_TOKEN, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID,
  } = process.env

  if (!GOOGLE_ADS_CLIENT_ID || !GOOGLE_ADS_DEVELOPER_TOKEN) {
    return res.status(500).json({ erro: 'Credenciais Google Ads não configuradas no servidor Vercel' })
  }

  const { action, customerId, customerIds, dias = 30 } = req.body || {}

  try {
    const token = await getAccessToken(GOOGLE_ADS_CLIENT_ID, GOOGLE_ADS_CLIENT_SECRET, GOOGLE_ADS_REFRESH_TOKEN)

    // ── Lista campanhas ────────────────────────────────────────────────────────
    if (action === 'campanhas') {
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT campaign.id, campaign.name, campaign.status,
               campaign_budget.amount_micros, campaign.advertising_channel_type
        FROM campaign
        WHERE campaign.status != 'REMOVED'
        ORDER BY campaign.name
      `)
      return res.status(200).json(rows.map(r => ({
        id:               r.campaign?.id,
        nome:             r.campaign?.name,
        status:           r.campaign?.status,
        orcamento_diario: r.campaignBudget?.amountMicros
          ? (Number(r.campaignBudget.amountMicros) / 1_000_000).toFixed(2)
          : null,
        tipo:             r.campaign?.advertisingChannelType,
      })))
    }

    // ── Performance de um cliente ──────────────────────────────────────────────
    if (action === 'performance') {
      const { dataInicio, dataFim } = calcDates(dias)
      const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, customerId, `
        SELECT campaign.id, campaign.name, campaign.status,
               metrics.impressions, metrics.clicks, metrics.ctr,
               metrics.average_cpc, metrics.cost_micros,
               metrics.conversions, metrics.cost_per_conversion
        FROM campaign
        WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
          AND campaign.status != 'REMOVED'
      `)
      return res.status(200).json(rows.map(r => ({
        id:          r.campaign?.id,
        nome:        r.campaign?.name,
        status:      r.campaign?.status,
        impressoes:  Number(r.metrics?.impressions || 0),
        cliques:     Number(r.metrics?.clicks || 0),
        ctr:         parseFloat(((r.metrics?.ctr || 0) * 100).toFixed(2)),
        cpc_medio:   parseFloat((Number(r.metrics?.averageCpc || 0) / 1_000_000).toFixed(2)),
        custo_total: parseFloat((Number(r.metrics?.costMicros || 0) / 1_000_000).toFixed(2)),
        conversoes:  Number(r.metrics?.conversions || 0),
        cpa:         Number(r.metrics?.conversions || 0) > 0
          ? parseFloat((Number(r.metrics?.costPerConversion || 0) / 1_000_000).toFixed(2))
          : null,
      })))
    }

    // ── Carteira completa (múltiplos clientes) ────────────────────────────────
    if (action === 'carteira') {
      const ids = Array.isArray(customerIds) ? customerIds : []
      const { dataInicio, dataFim } = calcDates(dias)
      const query = `
        SELECT campaign.id, campaign.name, campaign.status,
               metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions
        FROM campaign
        WHERE segments.date BETWEEN '${dataInicio}' AND '${dataFim}'
          AND campaign.status != 'REMOVED'
      `
      const resultados = {}
      for (const cid of ids) {
        try {
          const rows = await gadsQuery(token, GOOGLE_ADS_DEVELOPER_TOKEN, GOOGLE_ADS_MCC_ID, cid, query)
          const total = { gasto: 0, cliques: 0, impressoes: 0, conversoes: 0 }
          for (const r of rows) {
            total.gasto      += Number(r.metrics?.costMicros || 0) / 1_000_000
            total.cliques    += Number(r.metrics?.clicks || 0)
            total.impressoes += Number(r.metrics?.impressions || 0)
            total.conversoes += Number(r.metrics?.conversions || 0)
          }
          total.gasto = +total.gasto.toFixed(2)
          total.cpl   = total.conversoes > 0 ? +(total.gasto / total.conversoes).toFixed(2) : null
          resultados[cid] = total
        } catch (e) {
          resultados[cid] = { erro: e.message }
        }
      }
      return res.status(200).json(resultados)
    }

    return res.status(400).json({ erro: `action inválida: "${action}". Use: campanhas, performance, carteira` })
  } catch (e) {
    console.error('[api/gads]', e.message)
    return res.status(502).json({ erro: e.message })
  }
}
