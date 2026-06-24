export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })

  const { accountIds = [], periodo = 'last_30d', connector = 'google_ads' } = req.body || {}

  const WINDSOR_KEY = process.env.WINDSOR_API_KEY
  if (!WINDSOR_KEY) return res.status(500).json({ erro: 'WINDSOR_API_KEY não configurada no servidor' })
  if (!accountIds.length) return res.status(400).json({ erro: 'accountIds é obrigatório' })

  const slug   = connector === 'meta_ads' ? 'facebook' : 'google_ads'
  const fields = connector === 'meta_ads'
    ? 'account_name,campaign_name,spend,clicks,impressions,ctr,date,leads'
    : 'account_name,campaign,cost,clicks,impressions,conversions,date'

  const params = new URLSearchParams({ api_key: WINDSOR_KEY, fields, date_preset: periodo })
  for (const id of accountIds) params.append('accounts[]', id)

  try {
    const resp = await fetch(`https://connectors.windsor.ai/${slug}?${params}`)
    if (!resp.ok) {
      const txt = await resp.text()
      return res.status(502).json({ erro: `Windsor ${resp.status}: ${txt.slice(0, 200)}` })
    }
    const data = await resp.json()
    return res.status(200).json(data)
  } catch (e) {
    return res.status(502).json({ erro: `Windsor indisponível: ${e.message}` })
  }
}
