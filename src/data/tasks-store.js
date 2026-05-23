/* ── Persistência local de tarefas e marcos ──────────────
   Funciona como fonte de verdade no localStorage,
   sincronizado opcionalmente com Supabase via DataContext.
─────────────────────────────────────────────────────── */

const TASKS_KEY      = 'trafegon_tasks_v2'
const MILESTONES_KEY = 'trafegon_milestones_v2'

/* ── Tarefas ─────────────────────────────────────────── */
export function getTasks() {
  try { return JSON.parse(localStorage.getItem(TASKS_KEY) || '[]') } catch { return [] }
}

export function saveTasks(tasks) {
  try { localStorage.setItem(TASKS_KEY, JSON.stringify(tasks)) } catch {}
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
  try { localStorage.setItem(MILESTONES_KEY, JSON.stringify(milestones)) } catch {}
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
  interno:  { label: 'Interno',         icon: '🔒', color: '#8890b5', desc: 'Apenas equipe interna vê' },
}
