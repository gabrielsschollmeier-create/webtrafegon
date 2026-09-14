// Cálculo de ONS — fonte única da regra.
// O ONS é sempre somado AO VIVO das tarefas concluídas (as tarefas nunca são
// alteradas). A pontuação de competição usa o MÊS CORRENTE, que zera na virada.
//
// Regras:
//   Base por tipo: 1 (rotina) / 2 (execução) / 3 (estratégico)
//   Bônus pontualidade: +1 se completedAt <= dueDate
//   Penalidade por atraso: a partir do 1º dia de atraso
//     1–7 dias → -1 on   |   8–14 dias → -2 ons   |   15+ dias → -3 ons
//   Mínimo: 1 on (a tarefa sempre gera algo)
//   Divisão entre envolvidos: o ONS da tarefa é DIVIDIDO entre o responsável
//     principal e os co-responsáveis (2 pessoas = metade cada, etc.).
import { taskTypes } from '../data/erp-mock'
import { isInvolved } from './tasks'

const onTimeBonus = t =>
  (t.completedAt && t.dueDate && t.completedAt <= t.dueDate) ? 1 : 0

const latePenalty = t => {
  if (!t.completedAt || !t.dueDate || t.completedAt <= t.dueDate) return 0
  const days = (new Date(t.completedAt).getTime() - new Date(t.dueDate).getTime()) / 86400000
  if (days <= 7)  return -1
  if (days <= 14) return -2
  return -3
}

export const taskOns = t =>
  Math.max(1, (taskTypes[t.type]?.ons ?? 1) + onTimeBonus(t) + latePenalty(t))
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
