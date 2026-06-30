// Proxy serverless do Ton — a chave da Claude fica no servidor (env CLAUDE_API_KEY).
// O navegador chama /api/ton sem chave; aqui repassamos para a Anthropic.
// Suporta streaming (SSE) e modo normal (JSON).
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: { message: 'Method not allowed' } })

  const key = process.env.CLAUDE_API_KEY || process.env.VITE_CLAUDE_API_KEY
  if (!key) return res.status(500).json({ error: { message: 'CLAUDE_API_KEY não configurada no servidor Vercel' } })

  const body = req.body || {}
  const wantsStream = body.stream === true

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    // Streaming: repassa os eventos SSE direto para o navegador
    if (wantsStream && upstream.ok && upstream.body) {
      res.setHeader('Content-Type', 'text/event-stream; charset=utf-8')
      res.setHeader('Cache-Control', 'no-cache, no-transform')
      res.setHeader('Connection', 'keep-alive')
      const reader = upstream.body.getReader()
      const decoder = new TextDecoder()
      try {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          res.write(decoder.decode(value, { stream: true }))
        }
      } catch { /* cliente desconectou ou erro no stream */ }
      return res.end()
    }

    // Modo normal (ou erro no upstream): devolve JSON
    const data = await upstream.json().catch(() => ({ error: { message: 'Resposta inválida do upstream' } }))
    return res.status(upstream.status).json(data)
  } catch (e) {
    return res.status(502).json({ error: { message: `Falha ao chamar a Claude: ${e.message}` } })
  }
}
