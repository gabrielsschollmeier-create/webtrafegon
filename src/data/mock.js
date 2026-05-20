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
  { id: 'fechado',     label: 'Fechado',          color: '#6eda2c', pipelineId: 1 },
  // Retenção
  { id: 'ativo',       label: 'Cliente Ativo',    color: '#6eda2c', pipelineId: 2 },
  { id: 'risco',       label: 'Em Risco',         color: '#ea8a29', pipelineId: 2 },
  { id: 'reengaja',    label: 'Reengajamento',    color: '#be29ec', pipelineId: 2 },
  { id: 'churn',       label: 'Churn',            color: '#ef4444', pipelineId: 2 },
]

/* ── Leads ──────────────────────────────────── */
export const leads = [
  // Aquisição
  { id: 1,  name: 'Livianne Alcântara',  phone: '+5547999990001', source: 'WhatsApp',       stage: 'novo',        value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-10' },
  { id: 2,  name: 'RT Publicidade',      phone: '+5547999990002', source: 'Meta Ads',        stage: 'novo',        value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-11' },
  { id: 3,  name: 'Marcos Teixeira',     phone: '+5548991234567', source: 'WhatsApp',        stage: 'novo',        value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-12' },
  { id: 12, name: 'Mariana Costa',       phone: '+5547999990012', source: 'Google Ads',      stage: 'novo',        value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-13' },
  { id: 13, name: 'Pedro Alves',         phone: '+5547999990013', source: 'Meta Formulário', stage: 'novo',        value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-14' },
  { id: 4,  name: 'Dr. Paulo Varejão',   phone: '+5547999990004', source: 'Meta Formulário', stage: 'contato',     value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-08' },
  { id: 5,  name: 'Morando Advocacia',   phone: '+5547999990005', source: 'Orgânico',        stage: 'contato',     value: 0,    pipelineId: 1, assignee: 'JC', createdAt: '2026-05-09' },
  { id: 6,  name: 'Luciano Sordi',       phone: '+5547999990006', source: 'Lista de leads',  stage: 'contato',     value: 0,    pipelineId: 1, assignee: 'JC', createdAt: '2026-05-07' },
  { id: 14, name: 'Simoni Semi Jóias',   phone: '+5547999990014', source: 'WhatsApp',        stage: 'contato',     value: 0,    pipelineId: 1, assignee: 'GS', createdAt: '2026-05-06' },
  { id: 7,  name: 'Francine Baenea',     phone: '+5547999990007', source: 'Meta Formulário', stage: 'qualificado', value: 1870, pipelineId: 1, assignee: 'GS', createdAt: '2026-05-06' },
  { id: 15, name: 'Carlos Mendes',       phone: '+5547999990015', source: 'Meta Ads',        stage: 'qualificado', value: 2500, pipelineId: 1, assignee: 'JC', createdAt: '2026-05-05' },
  { id: 8,  name: 'Luís Henrique',       phone: '+5547999990008', source: 'WhatsApp',        stage: 'proposta',    value: 1870, pipelineId: 1, assignee: 'GS', createdAt: '2026-05-05' },
  { id: 9,  name: 'Larissa A.',          phone: '+5547999990009', source: 'Meta Ads',        stage: 'proposta',    value: 1870, pipelineId: 1, assignee: 'JC', createdAt: '2026-05-04' },
  { id: 10, name: 'Alexandre',           phone: '+5547999990010', source: 'WhatsApp',        stage: 'proposta',    value: 1870, pipelineId: 1, assignee: 'JC', createdAt: '2026-05-03' },
  { id: 11, name: 'Graça',               phone: '+5547999990011', source: 'Indicação',       stage: 'fechado',     value: 3370, pipelineId: 1, assignee: 'GS', createdAt: '2026-05-01' },
  { id: 16, name: 'Alexandre Faria',     phone: '+5547999990016', source: 'Google Ads',      stage: 'fechado',     value: 1870, pipelineId: 1, assignee: 'GS', createdAt: '2026-05-02' },
  // Retenção
  { id: 20, name: 'Cooperja',            phone: '+5547991110001', source: 'Cliente',         stage: 'ativo',       value: 4500, pipelineId: 2, assignee: 'GS', createdAt: '2026-01-10' },
  { id: 21, name: 'Posto Rizzotto',      phone: '+5547991110002', source: 'Cliente',         stage: 'ativo',       value: 3200, pipelineId: 2, assignee: 'GS', createdAt: '2026-02-05' },
  { id: 22, name: 'Kamy',                phone: '+5547991110003', source: 'Cliente',         stage: 'ativo',       value: 2800, pipelineId: 2, assignee: 'JC', createdAt: '2026-01-20' },
  { id: 23, name: 'Ararastur',           phone: '+5547991110004', source: 'Cliente',         stage: 'risco',       value: 1900, pipelineId: 2, assignee: 'GS', createdAt: '2025-11-15' },
  { id: 24, name: 'Caçarola',            phone: '+5547991110005', source: 'Cliente',         stage: 'risco',       value: 2200, pipelineId: 2, assignee: 'GS', createdAt: '2025-12-01' },
  { id: 25, name: 'Intime Sistemas',     phone: '+5547991110006', source: 'Cliente',         stage: 'reengaja',    value: 3500, pipelineId: 2, assignee: 'JC', createdAt: '2025-10-20' },
  { id: 26, name: 'Polizio Advogados',   phone: '+5547991110007', source: 'Cliente',         stage: 'churn',       value: 0,    pipelineId: 2, assignee: 'GS', createdAt: '2025-09-01' },
]

/* ── Atividades ─────────────────────────────── */
export const activities = [
  { id: 1, leadId: 4,  type: 'call',    description: 'Ligar para apresentar proposta',    dueDate: '2026-05-19', time: '09:00', done: false },
  { id: 2, leadId: 7,  type: 'meeting', description: 'Reunião de demonstração',           dueDate: '2026-05-20', time: '14:00', done: false },
  { id: 3, leadId: 8,  type: 'follow',  description: 'Follow-up da proposta enviada',     dueDate: '2026-05-18', time: '10:30', done: false },
  { id: 4, leadId: 11, type: 'call',    description: 'Onboarding inicial',                dueDate: '2026-05-15', time: '11:00', done: true  },
  { id: 5, leadId: 15, type: 'follow',  description: 'Verificar interesse após proposta', dueDate: '2026-05-19', time: '16:00', done: false },
  { id: 6, leadId: 23, type: 'call',    description: 'Conversa de retenção — Ararastur',  dueDate: '2026-05-20', time: '09:30', done: false },
  { id: 7, leadId: 24, type: 'meeting', description: 'Reunião de revisão — Caçarola',    dueDate: '2026-05-21', time: '15:00', done: false },
  { id: 8, leadId: 9,  type: 'follow',  description: 'Acompanhar análise da proposta',    dueDate: '2026-05-22', time: '10:00', done: false },
]

/* ── Conversas/Mensagens ────────────────────── */
export const conversations = [
  {
    id: 1, contactId: 1, platform: 'whatsapp', unread: 2,
    messages: [
      { id: 1, dir: 'in',  text: 'Olá! Vi o anúncio de vocês no Instagram, quero saber mais sobre o serviço.',       time: '09:12', date: '2026-05-18' },
      { id: 2, dir: 'out', text: 'Oi Livianne! Tudo bem? 😊 Que ótimo que você entrou em contato! Qual serviço te interessou mais?', time: '09:15', date: '2026-05-18' },
      { id: 3, dir: 'in',  text: 'Gestão de tráfego para meu negócio de moda. Tenho uma loja física e quero vender mais pelo Instagram.',  time: '09:18', date: '2026-05-18' },
      { id: 4, dir: 'out', text: 'Perfeito! Trabalhamos muito com e-commerce de moda. Posso te enviar um material explicando nossa metodologia?', time: '09:20', date: '2026-05-18' },
      { id: 5, dir: 'in',  text: 'Sim, pode mandar! E qual o investimento mínimo?',  time: '09:45', date: '2026-05-18' },
      { id: 6, dir: 'in',  text: 'Também quero saber sobre prazos para começar.',    time: '09:46', date: '2026-05-18' },
    ],
  },
  {
    id: 2, contactId: 4, platform: 'whatsapp', unread: 0,
    messages: [
      { id: 1, dir: 'out', text: 'Dr. Paulo, bom dia! Preparei a proposta que conversamos. Posso enviar agora?', time: '08:30', date: '2026-05-17' },
      { id: 2, dir: 'in',  text: 'Bom dia! Pode enviar sim.', time: '08:55', date: '2026-05-17' },
      { id: 3, dir: 'out', text: '📎 Proposta_TráfegOn_DrPaulo.pdf', time: '09:00', date: '2026-05-17', isFile: true },
      { id: 4, dir: 'in',  text: 'Recebi! Vou analisar até amanhã e te dou um retorno.', time: '09:05', date: '2026-05-17' },
      { id: 5, dir: 'out', text: 'Ótimo! Qualquer dúvida estou à disposição 🙂', time: '09:06', date: '2026-05-17' },
    ],
  },
  {
    id: 3, contactId: 7, platform: 'whatsapp', unread: 1,
    messages: [
      { id: 1, dir: 'in',  text: 'Oi! Vim pelo formulário do Facebook. Tenho um salão de beleza e quero anunciar.', time: '14:22', date: '2026-05-16' },
      { id: 2, dir: 'out', text: 'Oi Francine! Que legal! Salão de beleza é um nicho que a gente tem muito resultado. Me conta um pouco mais do seu negócio?', time: '14:30', date: '2026-05-16' },
      { id: 3, dir: 'in',  text: 'Tenho 3 profissionais, atendo em Balneário Camboriú. Quero mais clientes para procedimentos estéticos.', time: '14:35', date: '2026-05-16' },
      { id: 4, dir: 'in',  text: 'Quando podemos marcar uma reunião?', time: '14:36', date: '2026-05-16' },
    ],
  },
  {
    id: 4, contactId: 20, platform: 'whatsapp', unread: 0,
    messages: [
      { id: 1, dir: 'out', text: 'Cooperja, bom dia! Passando para compartilhar o relatório de performance de abril 📊', time: '10:00', date: '2026-05-15' },
      { id: 2, dir: 'in',  text: 'Bom dia Gabriel! Pode mandar.', time: '10:15', date: '2026-05-15' },
      { id: 3, dir: 'out', text: '📎 Relatorio_Cooperja_Abril2026.pdf', time: '10:16', date: '2026-05-15', isFile: true },
      { id: 4, dir: 'in',  text: 'Excelente! Crescimento de 34% no mês. Parabéns à equipe! 👏', time: '11:00', date: '2026-05-15' },
    ],
  },
  {
    id: 5, contactId: 8, platform: 'whatsapp', unread: 3,
    messages: [
      { id: 1, dir: 'in', text: 'Oi, já faz uma semana que recebi a proposta. Você pode me dar um desconto?', time: '16:30', date: '2026-05-18' },
      { id: 2, dir: 'in', text: 'Preciso de uma resposta antes de sexta.', time: '16:31', date: '2026-05-18' },
      { id: 3, dir: 'in', text: 'Você está disponível para uma ligação amanhã de manhã?', time: '16:45', date: '2026-05-18' },
    ],
  },
]

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
