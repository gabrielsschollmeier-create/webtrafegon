export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()
  const secret = req.headers['x-migration-secret']
  if (secret !== process.env.SUPABASE_SERVICE_KEY?.slice(-8)) return res.status(403).end()
  const key = process.env.SUPABASE_SERVICE_KEY
  const url = 'https://bfyshboqvisnuefeyqdv.supabase.co/rest/v1/collaborators?id=eq.deivisson'
  const r = await fetch(url, {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${key}`, 'apikey': key, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify({ belt: 'marrom' }),
  })
  const data = await r.json().catch(() => ({}))
  return res.status(r.ok ? 200 : 400).json({ ok: r.ok, status: r.status, data })
}
