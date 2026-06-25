const FEEDS = [
  { nome: 'Mundo do Marketing', url: 'https://www.mundodomarketing.com.br/feed/' },
  { nome: 'Meio & Mensagem',    url: 'https://www.meioemensagem.com.br/feed/' },
  { nome: 'AdNews',             url: 'https://adnews.com.br/feed/' },
  { nome: 'PropMark',           url: 'https://propmark.com.br/feed/' },
  { nome: 'E-Commerce Brasil',  url: 'https://www.ecommercebrasil.com.br/feed/' },
  { nome: 'Exame Marketing',    url: 'https://exame.com/marketing/feed/' },
  { nome: 'B9',                 url: 'https://www.b9.com.br/feed/' },
  { nome: 'Search Engine Journal', url: 'https://www.searchenginejournal.com/feed/' },
  { nome: 'Social Media Today', url: 'https://www.socialmediatoday.com/rss/' },
]

function extractText(xml, tag) {
  const re = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i')
  return xml.match(re)?.[1]?.trim() || ''
}

function parseItems(xml, fonte, maxPorFeed) {
  const items = []
  const itemRe = /<item>([\s\S]*?)<\/item>/g
  let m
  while ((m = itemRe.exec(xml)) !== null && items.length < maxPorFeed) {
    const block = m[1]
    const titulo = extractText(block, 'title')
    const link   = extractText(block, 'link') || ''
    const data   = extractText(block, 'pubDate')
    const resumo = extractText(block, 'description')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .slice(0, 240)
      .trim()
    if (titulo) items.push({ titulo, link, data, resumo, fonte })
  }
  return items
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ erro: 'Method not allowed' })

  const { action = 'feeds', q, max = 20, por_feed = 4 } = req.body || {}

  try {
    if (action === 'busca' && q) {
      const url = `https://news.google.com/rss/search?q=${encodeURIComponent(q)}&hl=pt-BR&gl=BR&ceid=BR:pt-BR`
      const r = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TrafegonBot/1.0)' } })
      if (!r.ok) throw new Error(`Google News retornou ${r.status}`)
      const xml = await r.text()
      const artigos = parseItems(xml, 'Google News', max)
      return res.status(200).json({ query: q, total: artigos.length, artigos })
    }

    if (action === 'feeds') {
      const timeoutMs = 8000
      const results = await Promise.allSettled(
        FEEDS.map(async (feed) => {
          const controller = new AbortController()
          const timer = setTimeout(() => controller.abort(), timeoutMs)
          try {
            const r = await fetch(feed.url, {
              headers: { 'User-Agent': 'Mozilla/5.0 (compatible; TrafegonBot/1.0)' },
              signal: controller.signal,
            })
            clearTimeout(timer)
            if (!r.ok) return []
            const xml = await r.text()
            return parseItems(xml, feed.nome, por_feed)
          } catch {
            clearTimeout(timer)
            return []
          }
        })
      )

      const artigos = results
        .filter(r => r.status === 'fulfilled')
        .flatMap(r => r.value)
        .filter(a => a.titulo)
        .sort((a, b) => {
          const da = new Date(a.data), db = new Date(b.data)
          return isNaN(db) ? -1 : isNaN(da) ? 1 : db - da
        })
        .slice(0, max)

      return res.status(200).json({
        total: artigos.length,
        fontes: FEEDS.map(f => f.nome),
        artigos,
      })
    }

    return res.status(400).json({ erro: `action inválida: "${action}"` })
  } catch (e) {
    console.error('[api/search]', e.message)
    return res.status(502).json({ erro: e.message })
  }
}
