import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS })

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const serviceKey  = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const { email } = await req.json()
    if (!email) {
      return new Response('Bad Request: campo "email" obrigatorio', {
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
