// verify-write-rls.mjs — prova que, como authenticated (via ANON key, sem service key),
// o RLS permite ESCREVER em todas as tabelas que o app grava.
// Técnica: pega 1 linha real, escolhe um campo próprio e regrava com o MESMO valor.
// NÃO altera nenhum dado (valor idêntico). Se der erro = RLS bloquearia a escrita.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const get = k => ((env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || '').trim()
const anon = get('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_ZNp8LfPIbyYay1bsF3F4gw_ZCxVQPxl'

const sb = createClient(get('VITE_SUPABASE_URL'), anon, { auth: { persistSession: false } })
const { error: loginErr } = await sb.auth.signInWithPassword({
  email: 'gabrielsschollmeier@gmail.com', password: 'Trafegon@2026',
})
if (loginErr) { console.error('Não logou:', loginErr.message); process.exit(1) }
console.log('Logado como authenticated. Testando escrita (regravando mesmo valor)...\n')

// Tabelas que o app efetivamente grava (DataContext)
const WRITE_TABLES = ['tasks','erp_clients','meetings','collaborators','milestones','monthly_stats','notifications','playbooks','pipelines','pipeline_stages']

let ok = 0, total = 0
for (const t of WRITE_TABLES) {
  const { data: rows, error: readErr } = await sb.from(t).select('*').limit(1)
  if (readErr) { console.log(`  ? ${t}: não leu (${readErr.message})`); continue }
  if (!rows?.length) { console.log(`  - ${t}: vazia, pulada`); continue }
  const row = rows[0]
  if (!('id' in row)) { console.log(`  - ${t}: sem coluna id, pulada`); continue }
  // Escolhe um campo próprio não-id e não-null para regravar com o mesmo valor
  const field = Object.keys(row).find(k => k !== 'id' && row[k] !== null && typeof row[k] !== 'object')
  if (!field) { console.log(`  - ${t}: sem campo simples para probe, pulada`); continue }
  total++
  const { error } = await sb.from(t).update({ [field]: row[field] }).eq('id', row.id)
  if (error) { console.log(`  BLOQUEADO ${t} (campo ${field}): ${error.message}`) }
  else { ok++; console.log(`  OK        ${t} (regravou ${field} idêntico)`) }
}
await sb.auth.signOut()
console.log(`\n${ok}/${total} tabelas permitem escrita como authenticated. Nenhum dado alterado.`)
