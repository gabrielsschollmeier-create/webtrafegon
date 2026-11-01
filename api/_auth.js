const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://bfyshboqvisnuefeyqdv.supabase.co'
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'

export const EMAIL_GABRIEL = 'gabrielsschollmeier@gmail.com'

async function usuarioDaSessao(req) {
  const token = String(req.headers.authorization || '').replace(/^Bearer\s+/i, '')
  if (!token) return null
  const r = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${token}` },
  })
  return r.ok ? r.json() : null
}

// Sem sessão válida do hub, a rota responde 401 e não executa nada.
// Com `emails`, só esses usuários passam (403 para os demais).
export async function exigirLogin(req, res, { emails } = {}) {
  const usuario = await usuarioDaSessao(req).catch(() => null)
  if (!usuario) {
    res.status(401).json({ erro: 'Faça login no hub para usar este recurso' })
    return null
  }
  if (emails && !emails.includes(String(usuario.email || '').toLowerCase())) {
    res.status(403).json({ erro: 'Seu usuário não tem acesso a este recurso' })
    return null
  }
  return usuario
}
