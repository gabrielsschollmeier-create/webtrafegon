// Cálculo de ONS — fonte única da regra "ONS do mês".
// O ONS é sempre somado AO VIVO das tarefas concluídas (as tarefas nunca são
// alteradas). A pontuação de competição/gamificação usa o MÊS CORRENTE, que
// zera sozinho na virada. As faixas seguem no acumulado (ver belt-system).
import { taskTypes } from '../data/erp-mock'

export const taskOns  = t => (taskTypes[t.type]?.ons ?? 1)
export const currentYm = () => new Date().toISOString().slice(0, 7)

// Tarefa concluída dentro do mês informado? Data = completedAt || dueDate || createdAt.
export const isThisMonth = (t, ym = currentYm()) =>
  String(t.completedAt || t.dueDate || t.createdAt || '').slice(0, 7) === ym

// Soma de ONS das tarefas concluídas de um responsável no mês corrente.
export function monthlyOns(tasks, assigneeId, ym = currentYm()) {
  return (tasks || []).reduce((s, t) =>
    (t.assignee === assigneeId && t.status === 'done' && isThisMonth(t, ym))
      ? s + taskOns(t) : s, 0)
}
