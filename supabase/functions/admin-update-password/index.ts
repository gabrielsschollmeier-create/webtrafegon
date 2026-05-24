import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: CORS })
    }

    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!
    const anonKey      = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Verificar identidade do chamador
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authErr } = await callerClient.auth.getUser()
    if (authErr || !user) {
      return new Response('Unauthorized', { status: 401, headers: CORS })
    }

    // Apenas admin pode alterar senhas de outros usuários
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return new Response('Forbidden: apenas administradores podem alterar senhas', {
        status: 403, headers: CORS,
      })
    }

    const { email, password } = await req.json()
    if (!email || !password || password.length < 6) {
      return new Response('Bad Request: email e senha (mín. 6 chars) são obrigatórios', {
        status: 400, headers: CORS,
      })
    }

    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: list, error: listErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
    if (listErr) throw listErr

    const target = list.users.find(u => u.email === email)
    if (!target) {
      return new Response(JSON.stringify({ ok: false, error: 'Usuário não encontrado no Supabase' }), {
        status: 404, headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const { error: upErr } = await adminClient.auth.admin.updateUserById(target.id, { password })
    if (upErr) throw upErr

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('[admin-update-password]', err)
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
