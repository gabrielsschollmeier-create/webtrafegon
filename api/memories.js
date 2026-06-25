const SUPABASE_URL = 'https://bfyshboqvisnuefeyqdv.supabase.co'

function sbHeaders(serviceKey) {
  return {
    'Authorization': `Bearer ${serviceKey}`,
    'apikey': serviceKey,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  }
}

async function tableExists(serviceKey) {
  const r = await fetch(`${SUPABASE_URL}/rest/v1/ton_memories?select=id&limit=1`, {
    headers: sbHeaders(serviceKey),
  })
  return r.ok
}

async function createTable(serviceKey) {
  // Usar ton_alertas como proxy para criar a tabela via trigger/RPC não é possível pelo REST.
  // Usamos a Management API do Supabase com o service key como JWT.
  const ref = 'bfyshboqvisnuefeyqdv'
  const sql = `
    create table if not exists public.ton_memories (
      id          bigserial primary key,
      category    text not null default 'insight',
      content     text not null,
      client_name text,
      tags        text[] default '{}',
      session_id  text,
      created_at  timestamptz default now()
    );
    alter table public.ton_memories enable row level security;
    do $$ begin
      if not exists (
        select 1 from pg_policies where tablename = 'ton_memories' and policyname = 'ton_memories_all'
      ) then
        create policy ton_memories_all on public.ton_memories for all using (true) with check (true);
      end if;
    end $$;
    create index if not exists idx_ton_memories_client  on public.ton_memories(client_name);
    create index if not exists idx_ton_memories_created on public.ton_memories(created_at desc);
  `
  const r = await fetch(`https://api.supabase.com/v1/projects/${ref}/database/query`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${serviceKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: sql }),
  })
  return r.ok
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if (req.method === 'OPTIONS') return res.status(200).end()

  const serviceKey = process.env.SUPABASE_SERVICE_KEY
  if (!serviceKey) return res.status(500).json({ erro: 'SUPABASE_SERVICE_KEY não configurada' })

  const exists = await tableExists(serviceKey)
  if (!exists) {
    const created = await createTable(serviceKey)
    if (!created) {
      return res.status(500).json({ erro: 'Não foi possível criar a tabela ton_memories. Execute o SQL manualmente no Supabase Dashboard.' })
    }
  }

  // GET — listar memórias
  if (req.method === 'GET') {
    const limit = req.query.limit || 60
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ton_memories?select=*&order=created_at.desc&limit=${limit}`, {
      headers: sbHeaders(serviceKey),
    })
    const data = await r.json()
    return res.status(r.ok ? 200 : 502).json(data)
  }

  // POST — inserir memória(s)
  if (req.method === 'POST') {
    const body = req.body
    const items = Array.isArray(body) ? body : [body]
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ton_memories`, {
      method: 'POST',
      headers: sbHeaders(serviceKey),
      body: JSON.stringify(items),
    })
    const data = await r.json()
    return res.status(r.ok ? 201 : 502).json(data)
  }

  // DELETE — limpar memórias antigas (opcional)
  if (req.method === 'DELETE') {
    const { antes_de } = req.query
    if (!antes_de) return res.status(400).json({ erro: 'Parâmetro antes_de (data ISO) obrigatório' })
    const r = await fetch(`${SUPABASE_URL}/rest/v1/ton_memories?created_at=lt.${antes_de}`, {
      method: 'DELETE',
      headers: sbHeaders(serviceKey),
    })
    return res.status(r.ok ? 200 : 502).json({ ok: r.ok })
  }

  return res.status(405).json({ erro: 'Method not allowed' })
}
