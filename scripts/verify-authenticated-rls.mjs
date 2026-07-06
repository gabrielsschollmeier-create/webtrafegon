// verify-authenticated-rls.mjs — loga como usuário da equipe (role authenticated, via ANON key)
// e testa se o RLS permite LER e ESCREVER nas tabelas que o app usa.
// Prova se remover a senha da equipe vai quebrar acesso a dados. NÃO altera nenhum dado
// (o teste de escrita regrava um campo com o MESMO valor).
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
console.log('Logado como authenticated (Gabriel).\n')

const READ_TABLES = ['tasks','erp_clients','meetings','collaborators','milestones','monthly_stats','notifications','playbooks','pipelines','pipeline_stages','leads','activities']

console.log('--- LEITURA (SELECT) ---')
for (const t of READ_TABLES) {
  const { data, error } = await sb.from(t).select('*').limit(1)
  console.log(error ? `  BLOQUEADO ${t}: ${error.message}` : `  OK        ${t} (${data.length ? 'tem dados' : 'vazia'})`)
}

console.log('\n--- ESCRITA (UPDATE regravando mesmo valor, sem alterar dado) ---')
{
  const { data: rows } = await sb.from('tasks').select('id,title').limit(1)
  if (!rows?.length) { console.log('  (sem task para testar)') }
  else {
    const { error } = await sb.from('tasks').update({ title: rows[0].title }).eq('id', rows[0].id)
    console.log(error ? `  BLOQUEADO tasks(update): ${error.message}` : `  OK        tasks(update) — RLS permite escrita`)
  }
}
await sb.auth.signOut()
