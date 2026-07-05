// verify-team-login.mjs — testa signInWithPassword (via ANON key) de cada conta da equipe.
// Prova que a auth via Supabase funciona ANTES de mexer no código. Não altera dados.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const get = k => ((env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || '').trim()
const anon = get('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'

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

let ok = 0
for (const [email, password] of TEAM) {
  const sb = createClient(get('VITE_SUPABASE_URL'), anon, { auth: { persistSession: false } })
  const { data, error } = await sb.auth.signInWithPassword({ email, password })
  if (error || !data?.user) { console.log(`  FALHOU  ${email}: ${error?.message || 'sem usuário'}`); continue }
  ok++
  console.log(`  OK      ${email}`)
  await sb.auth.signOut()
}
console.log(`\n${ok}/${TEAM.length} contas autenticaram via Supabase.`)
