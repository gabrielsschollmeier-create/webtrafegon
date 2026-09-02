// Cálculo de ONS — fonte única da regra.
// O ONS é sempre somado AO VIVO das tarefas concluídas (as tarefas nunca são
// alteradas). A pontuação de competição usa o MÊS CORRENTE, que zera na virada.
//
// Regras:
//   Base por tipo: 1 (rotina) / 2 (execução) / 3 (estratégico)
//   Bônus pontualidade: +1 se completedAt <= dueDate
//   Divisão entre envolvidos: o ONS da tarefa é DIVIDIDO entre o responsável
//     principal e os co-responsáveis (2 pessoas = metade cada, etc.).
import { taskTypes } from '../data/erp-mock'
import { isInvolved } from './tasks'

const onTimeBonus = t =>
  (t.completedAt && t.dueDate && t.completedAt <= t.dueDate) ? 1 : 0

export const taskOns = t => (taskTypes[t.type]?.ons ?? 1) + onTimeBonus(t)
export const currentYm = () => new Date().toISOString().slice(0, 7)

// Tarefa concluída dentro do mês informado? Data = completedAt || dueDate || createdAt.
export const isThisMonth = (t, ym = currentYm()) =>
  String(t.completedAt || t.dueDate || t.createdAt || '').slice(0, 7) === ym

// Nº de envolvidos na tarefa (principal + co-responsáveis).
export function involvedCount(t) {
  const co = Array.isArray(t.coResponsaveis) ? t.coResponsaveis
    : Array.isArray(t.co_responsaveis) ? t.co_responsaveis : []
  return 1 + co.length
}

// ONS que UMA pessoa ganha por UMA tarefa: 0 se não envolvida; senão a parte
// dela = ONS da tarefa ÷ nº de envolvidos (ONS dividido entre todos).
export function taskOnsFor(t, id) {
  return isInvolved(t, id) ? taskOns(t) / involvedCount(t) : 0
}

// Soma de ONS de uma pessoa nas tarefas concluídas (opcionalmente só de um mês).
export function sumOnsFor(tasks, id, ym) {
  const total = (tasks || []).reduce((s, t) => {
    if (t.status !== 'done') return s
    if (ym && !isThisMonth(t, ym)) return s
    return s + taskOnsFor(t, id)
  }, 0)
  return Math.round(total)
}

// ONS do mês corrente (padrão) e acumulado — ambos já com divisão entre envolvidos.
export const monthlyOns = (tasks, id, ym = currentYm()) => sumOnsFor(tasks, id, ym)
export const allTimeOns = (tasks, id) => sumOnsFor(tasks, id)
