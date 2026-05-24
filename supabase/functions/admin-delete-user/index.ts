import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Pre-flight CORS
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    // 1. JWT do usuário que fez a chamada
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response('Unauthorized', { status: 401, headers: CORS })
    }

    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!
    const anonKey      = Deno.env.get('SUPABASE_ANON_KEY')!
    const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // ← apenas server-side

    // 2. Verificar identidade do chamador via JWT
    const callerClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: { user }, error: authErr } = await callerClient.auth.getUser()
    if (authErr || !user) {
      return new Response('Unauthorized', { status: 401, headers: CORS })
    }

    // 3. Garantir que o chamador é admin
    const role = user.user_metadata?.role
    if (role !== 'admin') {
      return new Response('Forbidden: apenas administradores podem remover usuários', {
        status: 403, headers: CORS,
      })
    }

    // 4. Ler payload
    const { email } = await req.json()
    if (!email) {
      return new Response('Bad Request: campo "email" obrigatório', {
        status: 400, headers: CORS,
      })
    }

    // 5. Executar operação com service role (server-side)
    const adminClient = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    const { data: list, error: listErr } = await adminClient.auth.admin.listUsers({ perPage: 1000 })
    if (listErr) throw listErr

    const target = list.users.find(u => u.email === email)
    if (!target) {
      // Usuário não existe no Supabase — ok, pode ter sido criado só no localStorage
      return new Response(JSON.stringify({ ok: true, info: 'not_found_in_supabase' }), {
        headers: { ...CORS, 'Content-Type': 'application/json' },
      })
    }

    const { error: delErr } = await adminClient.auth.admin.deleteUser(target.id)
    if (delErr) throw delErr

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...CORS, 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('[admin-delete-user]', err)
    return new Response(JSON.stringify({ ok: false, error: err.message }), {
      status: 500, headers: { ...CORS, 'Content-Type': 'application/json' },
    })
  }
})
