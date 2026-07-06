export default async function handler(req, res) {
  const key = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY
  if (!key) return res.status(500).json({ erro: 'service key não encontrada' })
  const r = await fetch('https://bfyshboqvisnuefeyqdv.supabase.co/rest/v1/collaborators?id=eq.deivisson', {
    method: 'PATCH',
    headers: { 'Authorization': `Bearer ${key}`, 'apikey': key, 'Content-Type': 'application/json', 'Prefer': 'return=representation' },
    body: JSON.stringify({ belt: 'marrom' }),
  })
  const data = await r.json().catch(() => ({}))
  return res.status(r.ok ? 200 : 400).json({ ok: r.ok, data })
}
