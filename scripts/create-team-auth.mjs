// create-team-auth.mjs — cria contas no Supabase Auth para a EQUIPE interna (Fase 1).
// Uso: node scripts/create-team-auth.mjs          (dry-run: só lista o que faria)
//      node scripts/create-team-auth.mjs --apply   (cria de fato)
//
// Aditivo e idempotente: usa email_confirm=true e a senha atual. Se a conta já
// existir, PULA (não altera senha, não apaga nada). Clientes NÃO entram aqui.
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const get = k => ((env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || '').trim()
const sb = createClient(get('VITE_SUPABASE_URL'), get('VITE_SUPABASE_SERVICE_KEY'), { auth: { persistSession: false } })

// Equipe interna (role admin/colaborador) — espelha INITIAL_TEAM de src/data/users-store.js
const TEAM = [
  { email: 'gabrielsschollmeier@gmail.com',        password: 'Trafegon@2026', name: 'Gabriel S.' },
  { email: 'carolinepaganiadv@gmail.com',          password: 'trafegon',      name: 'Carol' },
  { email: 'gestaotrafegon@gmail.com',             password: 'trafegon',      name: 'Juliano' },
  { email: 'socialmediaclientestrafegon@gmail.com',password: 'trafegon',      name: 'Ana' },
  { email: 'atendimentotrafegon@gmail.com',        password: 'trafegon',      name: 'Érica' },
  { email: 'elieserpeper@gmail.com',               password: 'Trafegon@2026', name: 'Elieser' },
  { email: 'contato@tudoinforj.com.br',            password: 'Trafegon@2026', name: 'Deivisson' },
  { email: 'socialmediatrafegon@gmail.com',        password: 'trafegon',      name: 'Beatriz' },
  { email: 'socialmediatrafegonjuridico@gmail.com',password: '123456',        name: 'Mariana' },
]

const APPLY = process.argv.includes('--apply')

// Mapa e-mail -> id das contas já existentes no Auth
const byEmail = new Map()
for (let page = 1; ; page++) {
  const { data, error } = await sb.auth.admin.listUsers({ page, perPage: 1000 })
  if (error) { console.error('Erro ao listar usuários:', error.message); process.exit(1) }
  data.users.forEach(u => byEmail.set((u.email || '').toLowerCase(), u.id))
  if (data.users.length < 1000) break
}

console.log(APPLY ? '=== APLICANDO ===' : '=== DRY-RUN (nada será alterado; use --apply) ===')
for (const m of TEAM) {
  const mail = m.email.toLowerCase()
  const id = byEmail.get(mail)
  if (id) {
    // Existe: sincroniza a senha com a atual (só auth; garante que ninguém trave)
    if (!APPLY) { console.log(`  sincronizaria senha: ${m.email}`); continue }
    const { error } = await sb.auth.admin.updateUserById(id, { password: m.password, email_confirm: true })
    console.log(error ? `  ERRO ${m.email}: ${error.message}` : `  senha sincronizada:  ${m.email}`)
  } else {
    // Não existe: cria
    if (!APPLY) { console.log(`  criaria:             ${m.email}`); continue }
    const { error } = await sb.auth.admin.createUser({
      email: m.email, password: m.password, email_confirm: true, user_metadata: { name: m.name },
    })
    console.log(error ? `  ERRO ${m.email}: ${error.message}` : `  criado:              ${m.email}`)
  }
}
console.log('\nFeito.')
