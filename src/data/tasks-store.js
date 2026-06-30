/* ── Persistência local de tarefas e marcos ──────────────
   Funciona como fonte de verdade no localStorage,
   sincronizado opcionalmente com Supabase via DataContext.
─────────────────────────────────────────────────────── */

const TASKS_KEY      = 'trafegon_tasks_v2'
const MILESTONES_KEY = 'trafegon_milestones_v2'
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000

function isQuotaError(e) {
  return e?.name === 'QuotaExceededError' || e?.code === 22 || e?.name === 'NS_ERROR_DOM_QUOTA_REACHED'
}

function pruneOldCompleted(tasks) {
  const cutoff = Date.now() - THIRTY_DAYS_MS
  return tasks.filter(t => {
    if (t.status !== 'done') return true
    const ts = t.completedAt ? new Date(t.completedAt).getTime() : 0
    return !ts || ts > cutoff
  })
}

/* ── Tarefas ─────────────────────────────────────────── */
export function getTasks() {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]') } catch { return [] }
}

export function saveTasks(tasks) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  } catch (e) {
    if (!isQuotaError(e)) return
    // Tenta liberar espaço removendo tarefas concluídas há mais de 30 dias
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(pruneOldCompleted(tasks)))
    } catch {
      // Ainda sem espaço — avisa a UI
      try { window.dispatchEvent(new CustomEvent('ls-quota-exceeded')) } catch {}
    }
  }
}

export function addTaskLocal(task) {
  const tasks = getTasks()
  const now   = new Date().toISOString()
  const full  = { ...task, createdAt: task.createdAt || now, updatedAt: now }
  tasks.unshift(full)
  saveTasks(tasks)
  return full
}

export function updateTaskLocal(id, updates) {
  const tasks = getTasks()
  const idx   = tasks.findIndex(t => String(t.id) === String(id))
  if (idx < 0) return null
  tasks[idx] = { ...tasks[idx], ...updates, updatedAt: new Date().toISOString() }
  saveTasks(tasks)
  return tasks[idx]
}

export function deleteTaskLocal(id) {
  saveTasks(getTasks().filter(t => String(t.id) !== String(id)))
}

/* ── Marcos / Linha do tempo ─────────────────────────── */
export function getMilestones() {
  try { return JSON.parse(localStorage.getItem(MILESTONES_KEY) || '[]') } catch { return [] }
}

export function saveMilestones(milestones) {
  try {
    localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones))
  } catch (e) {
    if (isQuotaError(e)) {
      try { window.dispatchEvent(new CustomEvent('ls-quota-exceeded')) } catch {}
    }
  }
}

export function addMilestoneLocal(milestone) {
  const all = getMilestones()
  all.push(milestone)
  all.sort((a, b) => a.date.localeCompare(b.date))
  saveMilestones(all)
  return milestone
}

export function deleteMilestoneLocal(id) {
  saveMilestones(getMilestones().filter(m => String(m.id) !== String(id)))
}

/* ── Tipos de nível de tarefa ────────────────────────── */
export const TASK_LEVELS = {
  marco:    { label: 'Marco',           icon: '🏁', color: '#6eda2c', desc: 'Aparece na linha do tempo do cliente como entrega importante' },
  operacao: { label: 'Operação diária', icon: '⚙️', color: '#60a5fa', desc: 'Registro do dia a dia — visível na timeline do cliente' },
}
