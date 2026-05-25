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

function _load() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

function _save(q) {
  try { localStorage.setItem(KEY, JSON.stringify(q)) } catch {}
}

/** Adiciona operação à fila. Retorna o _id gerado. */
export function mqPush(op) {
  const item = {
    ...op,
    _id: `${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    _attempts: 0,
    _at: Date.now(),
  }
  const q = _load()
  q.push(item)
  _save(q)
  return item._id
}

/** Remove item da fila pelo _id. */
export function mqRemove(id) {
  _save(_load().filter(op => op._id !== id))
}

/** Incrementa contador de tentativas. */
export function mqBump(id) {
  _save(_load().map(op =>
    op._id === id
      ? { ...op, _attempts: op._attempts + 1, _lastAttempt: Date.now() }
      : op
  ))
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
