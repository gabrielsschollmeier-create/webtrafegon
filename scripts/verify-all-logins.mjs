// verify-all-logins.mjs — confirma que TODAS as contas (equipe + clientes) logam via Supabase.
// Garante que ninguém fica trancado antes de remover o login local. Não altera dados.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const get = k => ((env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || '').trim()
const anon = get('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'
const SB_URL = get('VITE_SUPABASE_URL')

const TEAM = [
  ['gabrielsschollmeier@gmail.com', 'Trafegon@2026'],
  ['carolinepaganiadv@gmail.com', 'trafegon'],
  ['gestaotrafegon@gmail.com', 'trafegon'],
  ['socialmediaclientestrafegon@gmail.com', 'trafegon'],
  ['atendimentotrafegon@gmail.com', 'trafegon'],
  ['elieserpeper@gmail.com', 'Trafegon@2026'],
  ['contato@tudoinforj.com.br', 'Trafegon@2026'],
  ['socialmediatrafegon@gmail.com', 'trafegon'],
  ['socialmediatrafegonjuridico@gmail.com', '123456'],
]

// Clientes: extrai email+password do users-store (todos 123456 hoje)
const store = fs.readFileSync(new URL('../src/data/users-store.js', import.meta.url), 'utf8')
const CLIENTS = []
for (const line of store.split('\n')) {
  if (!/role:\s*'cliente'/.test(line)) continue
  const email = (line.match(/email:\s*'([^']+)'/) || [])[1]
  const password = (line.match(/password:\s*'([^']+)'/) || [])[1]
  if (email && password) CLIENTS.push([email, password])
}

const ALL = [...TEAM, ...CLIENTS]
let ok = 0
const fails = []
for (const [email, password] of ALL) {
  const sb = createClient(SB_URL, anon, { auth: { persistSession: false } })
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error || !data?.user) { fails.push(`${email}: ${error?.message || 'sem usuário'}`) }
  else { ok++; await sb.auth.signOut() }
}
console.log(`${ok}/${ALL.length} contas autenticam via Supabase.`)
if (fails.length) { console.log('\nFALHAS (resolver ANTES de remover login local):'); fails.forEach(f => console.log('  ' + f)) }
else console.log('Ninguém fica trancado. Seguro remover o login local.')
