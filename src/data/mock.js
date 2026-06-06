/* ── Pipelines ──────────────────────────────── */
export const pipelines = [
  { id: 1, name: 'Aquisição' },
  { id: 2, name: 'Retenção' },
]

/* ── Estágios ───────────────────────────────── */
export const stages = [
  { id: 'novo',        label: 'Novo Lead',        color: '#8890b5', pipelineId: 1 },
  { id: 'contato',     label: 'Contato feito',    color: '#60a5fa', pipelineId: 1 },
  { id: 'qualificado', label: 'Qualificado',      color: '#be29ec', pipelineId: 1 },
  { id: 'proposta',    label: 'Proposta enviada', color: '#ea8a29', pipelineId: 1 },
  { id: 'ganho',       label: 'Ganho ✓',          color: '#6eda2c', pipelineId: 1 },
  { id: 'perdido',     label: 'Perdido ✗',        color: '#ef4444', pipelineId: 1 },
  // Retenção
  { id: 'ativo',       label: 'Cliente Ativo',    color: '#6eda2c', pipelineId: 2 },
  { id: 'risco',       label: 'Em Risco',         color: '#ea8a29', pipelineId: 2 },
  { id: 'reengaja',    label: 'Reengajamento',    color: '#be29ec', pipelineId: 2 },
  { id: 'churn',       label: 'Churn',            color: '#ef4444', pipelineId: 2 },
]

/* ── Leads ──────────────────────────────────── */
export const leads = []

/* ── Atividades ─────────────────────────────── */
export const activities = []

/* ── Conversas/Mensagens ────────────────────── */
export const conversations = []

/* ── Dados para Relatórios ──────────────────── */
export const monthlyData = [
  { mes: 'Dez', leads: 28, fechados: 4, receita: 7200  },
  { mes: 'Jan', leads: 34, fechados: 6, receita: 9800  },
  { mes: 'Fev', leads: 41, fechados: 7, receita: 11400 },
  { mes: 'Mar', leads: 52, fechados: 9, receita: 15200 },
  { mes: 'Abr', leads: 48, fechados: 8, receita: 13800 },
  { mes: 'Mai', leads: 61, fechados: 10, receita: 18600 },
]

export const sourceData = [
  { name: 'WhatsApp',       value: 38, color: '#25d366' },
  { name: 'Meta Ads',       value: 28, color: '#4f6ef7' },
  { name: 'Meta Formulário',value: 16, color: '#be29ec' },
  { name: 'Google Ads',     value: 10, color: '#ea8a29' },
  { name: 'Orgânico',       value: 5,  color: '#6eda2c' },
  { name: 'Indicação',      value: 3,  color: '#ec4899' },
]

export const weeklyActivity = [
  { dia: 'Seg', ligacoes: 8,  followups: 5,  reunioes: 2 },
  { dia: 'Ter', ligacoes: 12, followups: 7,  reunioes: 3 },
  { dia: 'Qua', ligacoes: 6,  followups: 10, reunioes: 4 },
  { dia: 'Qui', ligacoes: 14, followups: 6,  reunioes: 2 },
  { dia: 'Sex', ligacoes: 9,  followups: 8,  reunioes: 5 },
]

/* ── Gamificação ────────────────────────────── */
export const userStats = {
  name: 'Gabriel S.',
  level: 3,
  rank: 'Silver Closer',
  xp: 2840,
  xpToNext: 4000,
  streak: 7,
  dailyGoal: { contacted: 5, target: 10, label: 'contatos hoje' },
  weeklyDeals: { done: 2, target: 5 },
  achievements: [
    { id: 'first_deal',   icon: '🏆', name: 'Primeiro Fechamento',  desc: 'Fechou o primeiro negócio',         earned: true  },
    { id: 'streak_7',     icon: '🔥', name: '7 Dias em Chamas',     desc: '7 dias consecutivos de atividade', earned: true  },
    { id: 'speed_closer', icon: '⚡', name: 'Fechamento Rápido',    desc: 'Fechou em menos de 3 dias',        earned: true  },
    { id: 'contacts_50',  icon: '👥', name: '50 Contatos',          desc: 'Adicionou 50 contatos',            earned: false },
    { id: 'deals_10',     icon: '💎', name: 'Gold Closer',          desc: 'Fechou 10 negócios',               earned: false },
    { id: 'pipeline_10k', icon: '🚀', name: 'Pipeline 10k',         desc: 'R$10.000 no pipeline',             earned: false },
  ],
}
