// backup-data.mjs — dump completo (read-only) de todas as tabelas do Supabase para JSON.
// Uso: node scripts/backup-data.mjs
// Não altera NADA no banco. Apenas lê e salva em C:\projetos\_backups\trafego-central\data-<timestamp>\
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const env = fs.readFileSync(new URL('../.env', import.meta.url), 'utf8')
const get = k => ((env.match(new RegExp(`^${k}=(.*)$`, 'm')) || [])[1] || '').trim()

const url = get('VITE_SUPABASE_URL')
// Service key pode estar comentada no .env (pós-migração) — extrai o JWT service_role
// de qualquer lugar do arquivo. Uso local apenas, para backup/leitura.
const key = get('VITE_SUPABASE_SERVICE_KEY') || (env.match(/eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/) || [])[0]
if (!url || !key) { console.error('Faltam VITE_SUPABASE_URL / VITE_SUPABASE_SERVICE_KEY no .env'); process.exit(1) }

const sb = createClient(url, key, { auth: { persistSession: false } })

const TABLES = [
  'tasks', 'erp_clients', 'meetings', 'collaborators', 'milestones',
  'monthly_stats', 'ai_knowledge', 'notifications', 'playbooks',
  'pipelines', 'pipeline_stages', 'leads', 'activities', 'lead_notes',
  'conversations', 'messages', 'user_stats', 'user_achievements', 'profiles',
]

const stamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
const outDir = path.join('C:\\projetos\\_backups\\trafego-central', `data-${stamp}`)
fs.mkdirSync(outDir, { recursive: true })

let totalRows = 0
const summary = []
for (const t of TABLES) {
  const { data, error } = await sb.from(t).select('*')
  if (error) { summary.push(`  ${t}: (pulada — ${error.message})`); continue }
  fs.writeFileSync(path.join(outDir, `${t}.json`), JSON.stringify(data, null, 2))
  totalRows += data.length
  summary.push(`  ${t}: ${data.length} linhas`)
}

fs.writeFileSync(path.join(outDir, '_manifest.json'), JSON.stringify({ stamp, totalRows, tables: summary }, null, 2))
console.log(`\nBackup salvo em: ${outDir}`)
console.log(summary.join('\n'))
console.log(`\nTOTAL: ${totalRows} linhas em ${TABLES.length} tabelas verificadas.`)
