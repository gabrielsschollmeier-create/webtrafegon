// create-client-auth.mjs — cria/sincroniza contas Supabase Auth para todos os CLIENTES.
// Lê os clientes direto de src/data/users-store.js (role: 'cliente') para não errar transcrição.
// Uso: node scripts/create-client-auth.mjs           (dry-run)
//      node scripts/create-client-auth.mjs --apply     (aplica)
// Aditivo e idempotente. Não apaga nada.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const get = k => ((env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || '').trim()
const sb = createClient(get('VITE_SUPABASE_URL'), get('VITE_SUPABASE_SERVICE_KEY'), { auth: { persistSession: false } })

// Extrai clientes do users-store.js
const store = fs.readFileSync(new URL('../src/data/users-store.js', import.meta.url), 'utf8')
const CLIENTS = []
for (const line of store.split('\n')) {
  if (!/role:\s*'cliente'/.test(line)) continue
  const email = (line.match(/email:\s*'([^']+)'/) || [])[1]
  const password = (line.match(/password:\s*'([^']+)'/) || [])[1]
  const name = (line.match(/name:\s*[`'"]([^`'"]+)[`'"]/) || [])[1]
  if (email && password) CLIENTS.push({ email, password, name: name || email })
}

const APPLY = process.argv.includes('--apply')
console.log(`${CLIENTS.length} clientes encontrados no users-store.js.\n`)

const byEmail = new Map()
for (let page = 1; ; page++) {
  const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 })
  if (error) { console.error('Erro ao listar:', error.message); process.exit(1) }
  data.users.forEach(u => byEmail.set((u.email || '').toLowerCase(), u.id))
  if (data.users.length < 1000) break
}

console.log(APPLY ? '=== APLICANDO ===' : '=== DRY-RUN (use --apply) ===')
let criados = 0, sync = 0
for (const c of CLIENTS) {
  const id = byEmail.get(c.email.toLowerCase())
  if (id) {
    if (!APPLY) { console.log(`  sincronizaria: ${c.email}`); continue }
    const { error } = await sb.auth.admin.updateUserById(id, { password: c.password, email_confirm: true })
    if (!error) sync++
    console.log(error ? `  ERRO ${c.email}: ${error.message}` : `  sincronizado:  ${c.email}`)
  } else {
    if (!APPLY) { console.log(`  criaria:       ${c.email}`); continue }
    const { error } = await sb.auth.admin.createUser({
      email: c.email, password: c.password, email_confirm: true, user_metadata: { name: c.name },
    })
    if (!error) criados++
    console.log(error ? `  ERRO ${c.email}: ${error.message}` : `  criado:        ${c.email}`)
  }
}
if (APPLY) console.log(`\n${criados} criados, ${sync} sincronizados.`)
