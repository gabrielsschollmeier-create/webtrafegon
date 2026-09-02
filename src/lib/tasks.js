// Uma pessoa está envolvida na tarefa se é o responsável principal OU um dos
// co-responsáveis. Usado para que o 2º (3º...) envolvido também VEJA a tarefa
// nas telas de "minhas tarefas". Não altera nenhum dado — só filtro de exibição.
export function isInvolved(task, id) {
  if (!task || id == null) return false
  if (String(task.assignee) === String(id)) return true
  const co = Array.isArray(task.coResponsaveis) ? task.coResponsaveis
    : Array.isArray(task.co_responsaveis) ? task.co_responsaveis : []
  return co.some(x => String(x) === String(id))
}

// Versão para um conjunto de ids (ex.: o usuário pode ter mais de um id/slug).
export function isInvolvedAny(task, ids) {
  return (ids || []).some(id => isInvolved(task, id))
}
