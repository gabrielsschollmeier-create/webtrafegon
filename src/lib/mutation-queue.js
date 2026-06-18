/**
 * MutationQueue — fila persistente de operações offline
 *
 * Quando uma escrita no Supabase falha (rede offline, timeout, erro RLS),
 * a operação é enfileirada no localStorage. Ao reconectar, o DataContext
 * drena a fila automaticamente e tenta reprocessar.
 *
 * Estrutura de cada item:
 *   _id         string   — identificador único
 *   _type       string   — 'insert_task' | 'update_task' | 'delete_task'
 *   _attempts   number   — tentativas realizadas
 *   _at         number   — timestamp de criação
 *   _localId    any      — ID temporário local (para insert)
 *   ...payload           — dados da operação
 */

const KEY = 'trafegon_mq_v2'
const MAX_ATTEMPTS = 5
const MAX_AGE_MS   = 7 * 24 * 60 * 60 * 1000 // 7 dias

function _load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function _save(q) {
  try { localStorage.setItem(KEY, JSON.stringify(q)) } catch {}
}

/** Remove itens expirados por tentativas ou idade. Chamado internamente antes de cada operação. */
function _prune(q) {
  const now = Date.now()
  return q.filter(op => op._attempts < MAX_ATTEMPTS && (now - op._at) < MAX_AGE_MS)
}

/** Adiciona operação à fila. Retorna o _id gerado. */
export function mqPush(op) {
  const item = {
    ...op,
    _id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    _attempts: 0,
    _at: Date.now(),
  }
  const q = _prune(_load())
  q.push(item)
  _save(q)
  return item._id
}

/** Remove item da fila pelo _id. */
export function mqRemove(id) {
  _save(_load().filter(op => op._id !== id))
}

/** Incrementa contador de tentativas. Auto-descarta ao atingir MAX_ATTEMPTS. */
export function mqBump(id) {
  const q = _load().map(op =>
    op._id === id
      ? { ...op, _attempts: op._attempts + 1, _lastAttempt: Date.now() }
      : op
  )
  const discarded = q.find(op => op._id === id && op._attempts >= MAX_ATTEMPTS)
  if (discarded) console.warn('[mq] op descartada após', MAX_ATTEMPTS, 'tentativas:', discarded._type, discarded._targetId ?? discarded._localId)
  _save(_prune(q))
}

/** Retorna todos os itens na fila. */
export function mqGetAll() {
  return _load()
}

/** Quantidade de itens pendentes. */
export function mqCount() {
  return _load().length
}

/** Limpa a fila inteira. */
export function mqClear() {
  localStorage.removeItem(KEY)
}
