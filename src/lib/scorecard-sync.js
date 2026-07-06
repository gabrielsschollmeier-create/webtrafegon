// Sincronização do Scorecard com o Supabase.
// Filosofia: o localStorage continua sendo a base local (nunca é apagado).
// O Supabase é um espelho durável e compartilhado. Toda falha é silenciosa —
// se o Supabase cair, o app segue funcionando só com o localStorage. Aditivo.
import { supabase } from './supabase'

// nested {cycle:{member:{criterion:state}}}  <->  linhas
export function scoresToRows(scores) {
  const rows = []
  for (const cycle in scores || {})
    for (const m in scores[cycle] || {})
      for (const c in scores[cycle][m] || {}) {
        const state = scores[cycle][m][c]
        if (state) rows.push({ cycle, member_id: m, criterion_id: c, state })
      }
  return rows
}

export function rowsToScores(rows) {
  const s = {}
  for (const r of rows || []) {
    s[r.cycle] = s[r.cycle] || {}
    s[r.cycle][r.member_id] = s[r.cycle][r.member_id] || {}
    s[r.cycle][r.member_id][r.criterion_id] = r.state
  }
  return s
}

// União profunda. Em conflito, o remoto (fonte compartilhada) vence; o que só
// existe no local é preservado — nada é perdido.
export function mergeScores(local, remote) {
  const out = JSON.parse(JSON.stringify(local || {}))
  for (const cycle in remote || {}) {
    out[cycle] = out[cycle] || {}
    for (const m in remote[cycle]) {
      out[cycle][m] = { ...(out[cycle][m] || {}), ...remote[cycle][m] }
    }
  }
  return out
}

export async function fetchRemoteScores() {
  const { data, error } = await supabase.from('scorecard_scores').select('*')
  if (error) throw error
  return rowsToScores(data)
}

export function pushScore(cycle, memberId, criterionId, state) {
  return supabase.from('scorecard_scores').upsert(
    { cycle, member_id: memberId, criterion_id: criterionId, state, updated_at: new Date().toISOString() },
    { onConflict: 'cycle,member_id,criterion_id' },
  )
}

export function clearRemoteMember(cycle, memberId) {
  return supabase.from('scorecard_scores').delete().eq('cycle', cycle).eq('member_id', memberId)
}

// Migração: envia ao Supabase apenas as linhas locais que ainda NÃO existem lá.
// Nunca sobrescreve o remoto — só acrescenta. Retorna quantas subiram.
export async function migrateLocalOnly(local, remote) {
  const localRows  = scoresToRows(local)
  const remoteKeys = new Set(scoresToRows(remote).map(r => `${r.cycle}|${r.member_id}|${r.criterion_id}`))
  const toPush = localRows.filter(r => !remoteKeys.has(`${r.cycle}|${r.member_id}|${r.criterion_id}`))
  if (!toPush.length) return 0
  const { error } = await supabase.from('scorecard_scores').upsert(
    toPush.map(r => ({ ...r, updated_at: new Date().toISOString() })),
    { onConflict: 'cycle,member_id,criterion_id' },
  )
  if (error) throw error
  return toPush.length
}
