export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.AUTENTIQUE_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'AUTENTIQUE_API_KEY não configurada no Vercel' })

  const { query, variables } = req.body || {}
  if (!query) return res.status(400).json({ error: 'query obrigatória' })

  try {
    const upstream = await fetch('https://api.autentique.com.br/v2/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ query, variables }),
    })
    const data = await upstream.json()
    return res.status(upstream.status).json(data)
  } catch (e) {
    return res.status(502).json({ error: `Falha na API Autentique: ${e.message}` })
  }
}
