// Cálculo de ONS — fonte única da regra "ONS do mês".
// O ONS é sempre somado AO VIVO das tarefas concluídas (as tarefas nunca são
// alteradas). A pontuação de competição/gamificação usa o MÊS CORRENTE, que
// zera sozinho na virada. As faixas seguem no acumulado (ver belt-system).
//
// Sistema de 2 camadas:
//   Camada 1 — base por tipo: 1 (rotina) / 2 (execução) / 3 (estratégico)
//   Camada 2 — bônus pontualidade: +1 se completedAt <= dueDate
import { taskTypes } from '../data/erp-mock'

const onTimeBonus = t =>
  (t.completedAt && t.dueDate && t.completedAt <= t.dueDate) ? 1 : 0

export const taskOns = t => (taskTypes[t.type]?.ons ?? 1) + onTimeBonus(t)
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
