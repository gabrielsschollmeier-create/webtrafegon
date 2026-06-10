export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { notes, meetingTitle, topics = [] } = req.body || {}

  if (!notes?.trim() && topics.length === 0) {
    return res.status(400).json({ error: 'Nenhuma anotação ou tópico fornecido' })
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'ANTHROPIC_API_KEY não configurada no Vercel' })
  }

  const topicsSection = topics.length > 0
    ? `Tópicos da pauta: ${topics.map((t, i) => `${i + 1}. ${t}`).join(', ')}\n`
    : ''

  const prompt = `Você é um assistente especializado em reuniões de gestão de tráfego pago. Analise as anotações abaixo e organize de forma profissional e clara.

Reunião: ${meetingTitle || 'Sem título'}
${topicsSection}
Anotações brutas:
${notes || '(sem anotações livres)'}

Responda SOMENTE com JSON válido, sem markdown, sem explicação, neste formato exato:
{
  "resumo": "2 a 3 frases resumindo o que foi discutido e o contexto geral",
  "decisoes": ["decisão objetiva 1", "decisão objetiva 2"],
  "proximos_passos": ["ação concreta 1 (responsável se mencionado)", "ação concreta 2"],
  "pontos_atencao": ["ponto relevante que merece atenção ou follow-up"]
}`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic error:', err)
      return res.status(502).json({ error: 'Falha ao chamar API Anthropic' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    const cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(cleaned)

    return res.status(200).json(parsed)
  } catch (err) {
    console.error('AI pauta error:', err)
    return res.status(500).json({ error: 'Erro ao processar resposta da IA' })
  }
}
