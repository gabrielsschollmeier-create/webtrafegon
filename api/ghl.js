// Proxy serverless do GoHighLevel — um token (Private Integration Token) por
// cliente, guardado em env na Vercel: GHL_<SLUG>_TOKEN e GHL_<SLUG>_LOCATION.
// Ex.: GHL_RCA_TOKEN / GHL_RCA_LOCATION. O navegador nunca vê o token.
const BASE = 'https://services.leadconnectorhq.com'
const GHL_VERSION = '2021-07-28'

// Resolve token+location a partir do nome/slug do cliente.
function resolveGhlCreds(cliente) {
  const norm = String(cliente || '').toUpperCase().replace(/[^A-Z0-9]+/g, '_').replace(/^_|_$/g, '')
  if (!norm) return null
  const candidates = [norm, norm.split('_')[0]]
  for (const key of candidates) {
    const token = process.env[`GHL_${key}_TOKEN`]
    if (token) return { token, location: process.env[`GHL_${key}_LOCATION`] || '', slug: key }
  }
  return null
}

async function ghlGet(url, token) {
  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${token}`, Version: GHL_VERSION, Accept: 'application/json' },
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.message || data.error || `GHL ${r.status}`)
  return data
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })

  const { action, cliente } = req.body || {}
  const creds = resolveGhlCreds(cliente)
  if (!creds) {
    return res.status(404).json({ erro: `GoHighLevel não configurado para "${cliente}". Gere um Private Integration Token na subconta e adicione GHL_<SLUG>_TOKEN e GHL_<SLUG>_LOCATION na Vercel.` })
  }
  const { token, location } = creds
  if (!location) return res.status(500).json({ erro: `GHL_${creds.slug}_LOCATION não configurada na Vercel.` })

  try {
    // ── Funil de vendas (oportunidades por etapa) ───────────────────────────
    if (action === 'pipeline') {
      const pipes = await ghlGet(`${BASE}/opportunities/pipelines?locationId=${location}`, token)
      const stageName = {}
      for (const p of (pipes.pipelines || [])) {
        for (const s of (p.stages || [])) stageName[s.id] = s.name
      }
      const opps = await ghlGet(`${BASE}/opportunities/search?location_id=${location}&limit=100`, token)
      const list = opps.opportunities || []
      const por_etapa = {}
      let valor_total = 0, ganhos = 0, valor_ganho = 0, perdidos = 0
      for (const o of list) {
        const st = stageName[o.pipelineStageId] || o.pipelineStageId || 'sem etapa'
        if (!por_etapa[st]) por_etapa[st] = { qtd: 0, valor: 0 }
        por_etapa[st].qtd++
        por_etapa[st].valor += Number(o.monetaryValue || 0)
        valor_total += Number(o.monetaryValue || 0)
        const status = (o.status || '').toLowerCase()
        if (status === 'won') { ganhos++; valor_ganho += Number(o.monetaryValue || 0) }
        if (status === 'lost') perdidos++
      }
      for (const k of Object.keys(por_etapa)) por_etapa[k].valor = +por_etapa[k].valor.toFixed(2)
      return res.status(200).json({
        cliente, total_oportunidades: opps.meta?.total ?? list.length,
        amostra_analisada: list.length,
        por_etapa, valor_total: +valor_total.toFixed(2),
        ganhos, valor_ganho: +valor_ganho.toFixed(2), perdidos,
      })
    }

    // ── Leads / contatos recentes ───────────────────────────────────────────
    if (action === 'leads') {
      const c = await ghlGet(`${BASE}/contacts/?locationId=${location}&limit=20`, token)
      const list = c.contacts || []
      return res.status(200).json({
        cliente, total: c.meta?.total ?? list.length,
        leads: list.slice(0, 20).map(x => ({
          nome:   `${x.firstName || ''} ${x.lastName || ''}`.trim() || x.contactName || x.name || 'sem nome',
          origem: x.source || x.attributionSource?.utmSource || x.lastAttributionSource?.utmSource || null,
          criado: x.dateAdded,
          tags:   Array.isArray(x.tags) ? x.tags.slice(0, 5) : [],
        })),
      })
    }

    // ── Status das conversas (leads sem resposta) ───────────────────────────
    if (action === 'conversas') {
      const conv = await ghlGet(`${BASE}/conversations/search?locationId=${location}&limit=20`, token)
      const list = conv.conversations || []
      const sem_resposta = list.filter(x => (x.unreadCount || 0) > 0).length
      return res.status(200).json({
        cliente, total: list.length, sem_resposta,
        conversas: list.slice(0, 20).map(x => ({
          contato:    x.fullName || x.contactName || 'sem nome',
          nao_lidas:  x.unreadCount || 0,
          ultima_msg: (x.lastMessageBody || '').slice(0, 120),
          data:       x.lastMessageDate,
          tipo:       x.lastMessageType,
        })),
      })
    }

    return res.status(400).json({ erro: `action inválida: "${action}"` })
  } catch (e) {
    return res.status(502).json({ erro: `GoHighLevel: ${e.message}` })
  }
}
