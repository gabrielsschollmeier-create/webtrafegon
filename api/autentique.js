const CREATE_DOC_MUTATION = `
  mutation CreateDocument($document: DocumentInput!, $signers: [SignerInput!]!, $file: Upload!) {
    createDocument(document: $document, signers: $signers, file: $file) {
      id name link created_at
      signatures { public_id name email link }
    }
  }
`

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.AUTENTIQUE_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'AUTENTIQUE_API_KEY não configurada no Vercel' })

  const body = req.body || {}

  /* ── Criar documento (multipart upload) ── */
  if (body.action === 'createDocument') {
    const { documentName, message, pdfBase64, signers, deadlineAt } = body
    if (!pdfBase64)      return res.status(400).json({ error: 'pdfBase64 obrigatório' })
    if (!documentName)   return res.status(400).json({ error: 'documentName obrigatório' })
    if (!signers?.length) return res.status(400).json({ error: 'Pelo menos um signatário obrigatório' })

    try {
      const pdfBuffer = Buffer.from(pdfBase64, 'base64')

      const operations = JSON.stringify({
        query: CREATE_DOC_MUTATION,
        variables: {
          document: {
            name:        documentName,
            message:     message || 'Segue o contrato para sua assinatura digital.',
            ...(deadlineAt ? { deadline_at: deadlineAt } : {}),
          },
          signers: signers.map(s => ({
            email:                s.email,
            name:                 s.name  || '',
            action:               s.action || 'SIGN',
            send_automatic_email: true,
          })),
          file: null,
        },
      })

      const formData = new FormData()
      formData.append('operations', operations)
      formData.append('map', JSON.stringify({ '0': ['variables.file'] }))
      formData.append('0', new Blob([pdfBuffer], { type: 'application/pdf' }), 'contrato.pdf')

      const upstream = await fetch('https://api.autentique.com.br/v2/graphql', {
        method:  'POST',
        headers: { 'Authorization': `Bearer ${apiKey}` },
        body:    formData,
      })

      const data = await upstream.json().catch(() => ({ errors: [{ message: 'Resposta inválida do Autentique' }] }))
      if (data.errors?.length) return res.status(400).json({ error: data.errors[0].message })
      return res.status(200).json(data)
    } catch (e) {
      return res.status(502).json({ error: `Falha ao criar documento: ${e.message}` })
    }
  }

  /* ── Queries GraphQL padrão (listar, etc.) ── */
  const { query, variables } = body
  if (!query) return res.status(400).json({ error: 'query obrigatória' })

  try {
    const upstream = await fetch('https://api.autentique.com.br/v2/graphql', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body:    JSON.stringify({ query, variables }),
    })
    const data = await upstream.json()
    return res.status(upstream.status).json(data)
  } catch (e) {
    return res.status(502).json({ error: `Falha na API Autentique: ${e.message}` })
  }
}
