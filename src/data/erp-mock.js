/* ── Tipos de entregável ────────────────────────── */
export const taskTypes = {
  lp:       { label: 'Landing Page', icon: '🖥️',  color: '#6eda2c', xp: 150 },
  criativo: { label: 'Criativo',     icon: '🎨',  color: '#be29ec', xp: 80  },
  campanha: { label: 'Campanha',     icon: '📢',  color: '#60a5fa', xp: 120 },
  copy:     { label: 'Copy',         icon: '✍️',  color: '#ea8a29', xp: 100 },
  video:    { label: 'Vídeo',        icon: '🎬',  color: '#ef4444', xp: 130 },
  reuniao:  { label: 'Reunião',      icon: '📅',  color: '#8890b5', xp: 50  },
}

/* ── Status das tarefas ─────────────────────────── */
export const statusConfig = {
  todo:   { label: 'A Fazer',       color: '#8890b5' },
  doing:  { label: 'Em Andamento',  color: '#60a5fa' },
  review: { label: 'Em Revisão',    color: '#ea8a29' },
  done:   { label: 'Concluído',     color: '#6eda2c' },
}

/* ── Colaboradores ──────────────────────────────── */
export const collaborators = [
  {
    id: 'gs', name: 'Gabriel S.', email: 'gabriel@trafegon.com.br',
    role: 'Gestor de Tráfego', avatar: 'GS', color: '#6eda2c',
    level: 3, rank: 'Gold Closer', xp: 2840, xpToNext: 4000,
    streak: 7, tasksCompleted: 47, tasksThisMonth: 12,
    since: '2025-01-10',
    deliveriesByType: { lp: 4, criativo: 2, campanha: 8, copy: 3, video: 1, reuniao: 6 },
    badges: ['🏆', '⚡', '🎯'],
  },
  {
    id: 'jc', name: 'João C.', email: 'joao@trafegon.com.br',
    role: 'Designer', avatar: 'JC', color: '#be29ec',
    level: 2, rank: 'Silver Maker', xp: 1680, xpToNext: 2500,
    streak: 3, tasksCompleted: 31, tasksThisMonth: 8,
    since: '2025-04-15',
    deliveriesByType: { lp: 6, criativo: 12, campanha: 0, copy: 1, video: 3, reuniao: 4 },
    badges: ['🎨', '✨'],
  },
  {
    id: 'am', name: 'Ana M.', email: 'ana@trafegon.com.br',
    role: 'Copywriter', avatar: 'AM', color: '#ea8a29',
    level: 2, rank: 'Bronze Writer', xp: 1200, xpToNext: 2500,
    streak: 5, tasksCompleted: 28, tasksThisMonth: 9,
    since: '2025-06-01',
    deliveriesByType: { lp: 2, criativo: 0, campanha: 0, copy: 18, video: 0, reuniao: 3 },
    badges: ['✍️', '🔥'],
  },
  {
    id: 'rf', name: 'Rafael F.', email: 'rafael@trafegon.com.br',
    role: 'Gestor de Tráfego', avatar: 'RF', color: '#60a5fa',
    level: 1, rank: 'Rising Star', xp: 540, xpToNext: 1000,
    streak: 1, tasksCompleted: 14, tasksThisMonth: 4,
    since: '2026-02-01',
    deliveriesByType: { lp: 1, criativo: 0, campanha: 4, copy: 2, video: 0, reuniao: 2 },
    badges: ['🚀'],
  },
]

/* ── Clientes (workspaces do ERP) ───────────────── */
export const erpClients = [
  { id: 'cooperja',      name: 'Cooperja',              color: '#6eda2c', manager: 'gs', status: 'active',  since: '2026-01-10', monthlyValue: 4500, niche: 'Cooperativa' },
  { id: 'rizzotto',      name: 'Posto Rizzotto',         color: '#60a5fa', manager: 'gs', status: 'active',  since: '2026-02-05', monthlyValue: 3200, niche: 'Combustível' },
  { id: 'kamy',          name: 'Kamy',                   color: '#be29ec', manager: 'jc', status: 'active',  since: '2026-01-20', monthlyValue: 2800, niche: 'Moda' },
  { id: 'intime',        name: 'Intime Sistemas',         color: '#a78bfa', manager: 'jc', status: 'active',  since: '2025-10-20', monthlyValue: 3500, niche: 'Software' },
  { id: 'kinto',         name: 'Kinto Sistemas',          color: '#f59e0b', manager: 'gs', status: 'active',  since: '2025-09-01', monthlyValue: 3200, niche: 'Software' },
  { id: 'carol_adv',     name: 'Carol Adv',               color: '#f43f5e', manager: 'am', status: 'active',  since: '2025-08-15', monthlyValue: 2500, niche: 'Advocacia' },
  { id: 'polizio',       name: 'Polizio Advogados',       color: '#34d399', manager: 'am', status: 'active',  since: '2026-03-01', monthlyValue: 2800, niche: 'Advocacia' },
  { id: 'pit_floripa',   name: 'Pit Floripa',              color: '#fb923c', manager: 'gs', status: 'active',  since: '2025-11-01', monthlyValue: 2200, niche: 'Alimentação' },
  { id: 'cacarola',      name: 'Caçarola',                color: '#f87171', manager: 'gs', status: 'at_risk', since: '2025-12-01', monthlyValue: 2200, niche: 'Alimentação' },
  { id: 'sitio_girabas', name: 'Sítio Girabas',           color: '#4ade80', manager: 'jc', status: 'active',  since: '2025-07-10', monthlyValue: 1800, niche: 'Turismo' },
  { id: 'ararastur',     name: 'Ararastur',                color: '#ea8a29', manager: 'gs', status: 'at_risk', since: '2025-11-15', monthlyValue: 1900, niche: 'Turismo' },
  { id: 'gabriel_piva',  name: 'Gabriel Piva Advocacia',  color: '#818cf8', manager: 'am', status: 'active',  since: '2026-01-05', monthlyValue: 1800, niche: 'Advocacia' },
  { id: 'quadros',       name: 'Quadros Paisagismo',      color: '#2dd4bf', manager: 'jc', status: 'active',  since: '2025-10-15', monthlyValue: 1500, niche: 'Paisagismo' },
]

/* ── Tarefas / Entregas ─────────────────────────── */
export const tasks = [
  { id: 1,  clientId: 'cooperja',  type: 'lp',       title: 'LP Safra 2026',              assignee: 'gs', status: 'doing',  priority: 'high',   dueDate: '2026-05-28', description: 'Landing page para campanha de safra' },
  { id: 2,  clientId: 'rizzotto',  type: 'campanha',  title: 'Google Ads — Posto Rizzotto', assignee: 'rf', status: 'doing',  priority: 'medium', dueDate: '2026-05-25', description: 'Campanhas Google Search local' },
  { id: 3,  clientId: 'kamy',      type: 'criativo',  title: 'Feed Instagram — Inverno',    assignee: 'jc', status: 'doing',  priority: 'high',   dueDate: '2026-05-22', description: 'Grid planejado para o mês de junho' },
  { id: 4,  clientId: 'ararastur', type: 'reuniao',   title: 'Reunião Retenção Urgente',    assignee: 'gs', status: 'todo',   priority: 'high',   dueDate: '2026-05-21', description: 'Alinhamento para reverter situação de risco' },
  { id: 5,  clientId: 'cacarola',  type: 'lp',        title: 'LP Cardápio Digital',         assignee: 'gs', status: 'todo',   priority: 'medium', dueDate: '2026-06-05', description: 'LP com cardápio e delivery' },
  { id: 6,  clientId: 'intime',    type: 'campanha',  title: 'Google Ads B2B Intime',       assignee: 'rf', status: 'doing',  priority: 'high',   dueDate: '2026-05-28', description: 'Campanhas Search para demo do software' },
  { id: 7,  clientId: 'polizio',   type: 'criativo',  title: 'Artes Direito Trabalhista',   assignee: 'jc', status: 'done',   priority: 'medium', dueDate: '2026-05-18', description: 'Posts informativos sobre direitos' },
]

/* ── Reuniões no Google Agenda ──────────────────── */
export const meetings = [
  { id: 1, clientId: 'cooperja', title: 'Reunião mensal Cooperja', date: '2026-06-02', time: '10:00', duration: 60, attendees: ['gs'], type: 'monthly_review' },
]

/* ── Tipos de marco (Linha do Tempo) ────────────── */
export const milestoneTypes = {
  kickoff:   { label: 'Kickoff',       icon: '🚀', color: '#6eda2c' },
  lp:        { label: 'LP publicada',  icon: '🖥️', color: '#60a5fa' },
  campanha:  { label: 'Campanha',      icon: '📢', color: '#ea8a29' },
  revisao:   { label: 'Revisão',       icon: '📋', color: '#be29ec' },
  renovacao: { label: 'Renovação',     icon: '🔄', color: '#22d3ee' },
  alerta:    { label: 'Alerta',        icon: '⚠️', color: '#ef4444' },
}

/* ── Marcos por cliente ─────────────────────────── */
export const milestones = [
  { id: 1, clientId: 'cooperja',  date: '2026-01-10', type: 'kickoff', title: 'Kickoff Cooperja',  description: 'Início da parceria, alinhamento estratégico' },
  { id: 2, clientId: 'rizzotto',  date: '2026-02-05', type: 'kickoff', title: 'Kickoff Rizzotto',  description: 'Início da parceria' },
  { id: 3, clientId: 'kamy',      date: '2026-01-20', type: 'kickoff', title: 'Kickoff Kamy',      description: 'Início da parceria de moda' },
  { id: 4, clientId: 'ararastur', date: '2025-11-15', type: 'kickoff', title: 'Kickoff Ararastur', description: 'Início da parceria de turismo' },
  { id: 5, clientId: 'cacarola',  date: '2025-12-01', type: 'kickoff', title: 'Kickoff Caçarola',  description: 'Início da parceria gastronômica' },
  { id: 6, clientId: 'intime',    date: '2025-10-20', type: 'kickoff', title: 'Kickoff Intime',    description: 'Início da parceria B2B' },
  { id: 7, clientId: 'polizio',   date: '2026-03-01', type: 'kickoff', title: 'Kickoff Polizio',   description: 'Início da parceria com advocacia' },
]
