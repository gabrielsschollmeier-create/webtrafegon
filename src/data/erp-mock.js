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
  { id: 'cooperja',   name: 'Cooperja',           color: '#6eda2c', manager: 'gs', status: 'active',  since: '2026-01-10', monthlyValue: 4500, niche: 'Cooperativa' },
  { id: 'rizzotto',   name: 'Posto Rizzotto',      color: '#60a5fa', manager: 'gs', status: 'active',  since: '2026-02-05', monthlyValue: 3200, niche: 'Combustível' },
  { id: 'kamy',       name: 'Kamy',                color: '#be29ec', manager: 'jc', status: 'active',  since: '2026-01-20', monthlyValue: 2800, niche: 'Moda' },
  { id: 'ararastur',  name: 'Ararastur',            color: '#ea8a29', manager: 'gs', status: 'at_risk', since: '2025-11-15', monthlyValue: 1900, niche: 'Turismo' },
  { id: 'cacarola',   name: 'Caçarola',             color: '#f87171', manager: 'gs', status: 'at_risk', since: '2025-12-01', monthlyValue: 2200, niche: 'Alimentação' },
  { id: 'intime',     name: 'Intime Sistemas',      color: '#a78bfa', manager: 'jc', status: 'active',  since: '2025-10-20', monthlyValue: 3500, niche: 'Software' },
  { id: 'polizio',    name: 'Polizio Advogados',    color: '#34d399', manager: 'am', status: 'active',  since: '2026-03-01', monthlyValue: 2800, niche: 'Advocacia' },
]

/* ── Tarefas / Entregas ─────────────────────────── */
export const tasks = [
  // Cooperja
  { id: 1,  clientId: 'cooperja',  type: 'lp',       title: 'LP Safra 2026',                 assignee: 'gs', status: 'doing',  priority: 'high',   dueDate: '2026-05-28', description: 'Landing page para campanha de safra' },
  { id: 2,  clientId: 'cooperja',  type: 'criativo',  title: 'Banner Facebook — Cooperja',    assignee: 'jc', status: 'review', priority: 'medium', dueDate: '2026-05-22', description: '5 variações criativo feed + stories' },
  { id: 3,  clientId: 'cooperja',  type: 'campanha',  title: 'Setup Meta Ads Safra',          assignee: 'gs', status: 'todo',   priority: 'high',   dueDate: '2026-05-30', description: 'Estruturar campanhas Meta Ads para safra' },
  { id: 4,  clientId: 'cooperja',  type: 'copy',      title: 'Textos LP Safra',               assignee: 'am', status: 'done',   priority: 'high',   dueDate: '2026-05-20', description: 'Copy completa para LP de safra' },
  { id: 5,  clientId: 'cooperja',  type: 'reuniao',   title: 'Reunião mensal Cooperja',       assignee: 'gs', status: 'todo',   priority: 'low',    dueDate: '2026-06-02', description: 'Apresentação de resultados mensais' },

  // Posto Rizzotto
  { id: 6,  clientId: 'rizzotto',  type: 'criativo',  title: 'Artes Promoção Combustível',    assignee: 'jc', status: 'doing',  priority: 'high',   dueDate: '2026-05-23', description: 'Criativos para promoção semanal' },
  { id: 7,  clientId: 'rizzotto',  type: 'campanha',  title: 'Google Ads — Posto Rizzotto',   assignee: 'rf', status: 'doing',  priority: 'medium', dueDate: '2026-05-25', description: 'Campanhas Google Search local' },
  { id: 8,  clientId: 'rizzotto',  type: 'copy',      title: 'Copy Stories Instagram',        assignee: 'am', status: 'todo',   priority: 'low',    dueDate: '2026-05-26', description: 'Legendas e CTAs para stories semanais' },
  { id: 9,  clientId: 'rizzotto',  type: 'reuniao',   title: 'Review de Performance',         assignee: 'gs', status: 'done',   priority: 'medium', dueDate: '2026-05-18', description: 'Reunião de revisão mensal' },

  // Kamy
  { id: 10, clientId: 'kamy',      type: 'lp',       title: 'LP Coleção Inverno 2026',       assignee: 'jc', status: 'review', priority: 'high',   dueDate: '2026-05-24', description: 'Landing page coleção inverno' },
  { id: 11, clientId: 'kamy',      type: 'video',    title: 'Edição Reels Kamy',             assignee: 'jc', status: 'todo',   priority: 'medium', dueDate: '2026-05-27', description: '3 Reels para lançamento de coleção' },
  { id: 12, clientId: 'kamy',      type: 'criativo', title: 'Feed Instagram — Inverno',       assignee: 'jc', status: 'doing',  priority: 'high',   dueDate: '2026-05-22', description: 'Grid planejado para o mês de junho' },
  { id: 13, clientId: 'kamy',      type: 'campanha', title: 'Meta Ads Inverno',              assignee: 'gs', status: 'todo',   priority: 'high',   dueDate: '2026-05-29', description: 'Campanha lançamento coleção inverno' },

  // Ararastur
  { id: 14, clientId: 'ararastur', type: 'criativo', title: 'Artes Pacotes de Verão',        assignee: 'jc', status: 'todo',   priority: 'medium', dueDate: '2026-06-01', description: 'Criativos para pacotes de viagem' },
  { id: 15, clientId: 'ararastur', type: 'copy',     title: 'Emails Retenção Ararastur',     assignee: 'am', status: 'doing',  priority: 'high',   dueDate: '2026-05-23', description: 'Sequência de emails para reativar cliente' },
  { id: 16, clientId: 'ararastur', type: 'reuniao',  title: 'Reunião Retenção Urgente',      assignee: 'gs', status: 'todo',   priority: 'high',   dueDate: '2026-05-21', description: 'Alinhamento para reverter situação de risco' },

  // Caçarola
  { id: 17, clientId: 'cacarola',  type: 'lp',       title: 'LP Cardápio Digital',           assignee: 'gs', status: 'todo',   priority: 'medium', dueDate: '2026-06-05', description: 'LP com cardápio e delivery' },
  { id: 18, clientId: 'cacarola',  type: 'video',    title: 'Reels Prato do Dia',            assignee: 'jc', status: 'doing',  priority: 'medium', dueDate: '2026-05-25', description: 'Edição de 4 reels semanais' },

  // Intime Sistemas
  { id: 19, clientId: 'intime',    type: 'lp',       title: 'LP Demo do Sistema',            assignee: 'gs', status: 'review', priority: 'high',   dueDate: '2026-05-26', description: 'LP para captação de demos do software' },
  { id: 20, clientId: 'intime',    type: 'copy',     title: 'Copy LinkedIn Intime',          assignee: 'am', status: 'done',   priority: 'medium', dueDate: '2026-05-19', description: 'Posts LinkedIn para geração de leads B2B' },
  { id: 21, clientId: 'intime',    type: 'campanha', title: 'Google Ads B2B Intime',         assignee: 'rf', status: 'doing',  priority: 'high',   dueDate: '2026-05-28', description: 'Campanhas Search para demo do software' },

  // Polizio
  { id: 22, clientId: 'polizio',   type: 'criativo', title: 'Artes Direito Trabalhista',     assignee: 'jc', status: 'done',   priority: 'medium', dueDate: '2026-05-18', description: 'Posts informativos sobre direitos' },
  { id: 23, clientId: 'polizio',   type: 'copy',     title: 'Copy Posts Jurídicos',          assignee: 'am', status: 'review', priority: 'medium', dueDate: '2026-05-22', description: 'Textos educativos para Instagram' },
  { id: 24, clientId: 'polizio',   type: 'campanha', title: 'Meta Ads Polizio',              assignee: 'rf', status: 'todo',   priority: 'low',    dueDate: '2026-06-01', description: 'Campanha de captação de leads jurídicos' },
]

/* ── Reuniões no Google Agenda ──────────────────── */
export const meetings = [
  { id: 1, clientId: 'cooperja',  title: 'Reunião mensal Cooperja',    date: '2026-06-02', time: '10:00', duration: 60,  attendees: ['gs'], type: 'monthly_review' },
  { id: 2, clientId: 'rizzotto',  title: 'Review de Performance',      date: '2026-05-28', time: '14:00', duration: 45,  attendees: ['gs', 'rf'], type: 'performance' },
  { id: 3, clientId: 'ararastur', title: 'Reunião Retenção Urgente',   date: '2026-05-21', time: '09:00', duration: 60,  attendees: ['gs'], type: 'retention' },
  { id: 4, clientId: 'kamy',      title: 'Kickoff Coleção Inverno',    date: '2026-05-23', time: '11:00', duration: 90,  attendees: ['gs', 'jc', 'am'], type: 'kickoff' },
  { id: 5, clientId: 'intime',    title: 'Alinhamento B2B Intime',     date: '2026-05-29', time: '15:00', duration: 60,  attendees: ['gs', 'rf'], type: 'alignment' },
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
  // Cooperja
  { id: 1,  clientId: 'cooperja',  date: '2026-01-10', type: 'kickoff',   title: 'Kickoff Cooperja',          description: 'Início da parceria, alinhamento estratégico' },
  { id: 2,  clientId: 'cooperja',  date: '2026-02-01', type: 'lp',        title: 'LP Institucional live',     description: 'Landing page institucional no ar' },
  { id: 3,  clientId: 'cooperja',  date: '2026-02-15', type: 'campanha',  title: 'Meta Ads ativos',           description: 'Campanhas de tráfego pago ativadas' },
  { id: 4,  clientId: 'cooperja',  date: '2026-03-05', type: 'revisao',   title: 'Revisão março',             description: 'Apresentação de resultados do 1º mês' },
  { id: 5,  clientId: 'cooperja',  date: '2026-04-10', type: 'revisao',   title: 'Revisão abril',             description: 'Ajustes de campanha e novos criativos' },
  { id: 6,  clientId: 'cooperja',  date: '2026-05-28', type: 'lp',        title: 'LP Safra 2026',             description: 'Landing page da campanha de safra' },
  { id: 7,  clientId: 'cooperja',  date: '2026-07-10', type: 'revisao',   title: 'Revisão semestral',         description: 'Revisão completa do 1º semestre' },
  { id: 8,  clientId: 'cooperja',  date: '2027-01-10', type: 'renovacao', title: 'Renovação anual',           description: 'Renovação do contrato' },

  // Rizzotto
  { id: 9,  clientId: 'rizzotto',  date: '2026-02-05', type: 'kickoff',   title: 'Kickoff Rizzotto',          description: 'Início da parceria' },
  { id: 10, clientId: 'rizzotto',  date: '2026-02-20', type: 'campanha',  title: 'Google Ads local',          description: 'Search para combustível e conveniência' },
  { id: 11, clientId: 'rizzotto',  date: '2026-03-15', type: 'revisao',   title: 'Revisão março',             description: 'Performance do 1º mês' },
  { id: 12, clientId: 'rizzotto',  date: '2026-05-18', type: 'revisao',   title: 'Revisão maio',              description: 'Ajuste de campanhas' },
  { id: 13, clientId: 'rizzotto',  date: '2026-08-05', type: 'renovacao', title: 'Renovação semestral',       description: 'Revisão e renovação do contrato' },

  // Kamy
  { id: 14, clientId: 'kamy',      date: '2026-01-20', type: 'kickoff',   title: 'Kickoff Kamy',              description: 'Início da parceria de moda' },
  { id: 15, clientId: 'kamy',      date: '2026-02-10', type: 'campanha',  title: 'Coleção Verão ativa',       description: 'Campanhas de verão ativadas' },
  { id: 16, clientId: 'kamy',      date: '2026-03-20', type: 'revisao',   title: 'Review Verão',              description: 'Resultados da temporada' },
  { id: 17, clientId: 'kamy',      date: '2026-05-23', type: 'kickoff',   title: 'Kickoff Inverno',           description: 'Briefing coleção inverno' },
  { id: 18, clientId: 'kamy',      date: '2026-05-30', type: 'lp',        title: 'LP Inverno (revisão)',      description: 'Landing page em aprovação' },
  { id: 19, clientId: 'kamy',      date: '2026-07-20', type: 'renovacao', title: 'Renovação semestral',       description: 'Renovação do contrato' },

  // Ararastur (at risk)
  { id: 20, clientId: 'ararastur', date: '2025-11-15', type: 'kickoff',   title: 'Kickoff Ararastur',         description: 'Início da parceria de turismo' },
  { id: 21, clientId: 'ararastur', date: '2025-12-10', type: 'campanha',  title: 'Campanhas de verão',        description: 'Meta Ads para pacotes de viagem' },
  { id: 22, clientId: 'ararastur', date: '2026-02-01', type: 'revisao',   title: 'Review pós-verão',          description: 'Análise da temporada' },
  { id: 23, clientId: 'ararastur', date: '2026-04-15', type: 'alerta',    title: 'Alerta de churn',           description: 'Cliente em risco — ação necessária' },
  { id: 24, clientId: 'ararastur', date: '2026-05-21', type: 'revisao',   title: 'Reunião de retenção',       description: 'Reunião emergencial' },

  // Caçarola (at risk)
  { id: 25, clientId: 'cacarola',  date: '2025-12-01', type: 'kickoff',   title: 'Kickoff Caçarola',          description: 'Início da parceria gastronômica' },
  { id: 26, clientId: 'cacarola',  date: '2026-01-15', type: 'campanha',  title: 'Meta Ads delivery',         description: 'Campanhas delivery e local' },
  { id: 27, clientId: 'cacarola',  date: '2026-03-01', type: 'revisao',   title: 'Revisão Q1',                description: 'Revisão do primeiro trimestre' },
  { id: 28, clientId: 'cacarola',  date: '2026-04-20', type: 'alerta',    title: 'LP atrasada',               description: 'Prazo vencido para LP Cardápio Digital' },

  // Intime
  { id: 29, clientId: 'intime',    date: '2025-10-20', type: 'kickoff',   title: 'Kickoff Intime',            description: 'Início da parceria B2B' },
  { id: 30, clientId: 'intime',    date: '2025-11-10', type: 'campanha',  title: 'Google Ads B2B',            description: 'Search B2B ativo' },
  { id: 31, clientId: 'intime',    date: '2026-01-15', type: 'revisao',   title: 'Revisão Q4 2025',           description: 'Resultados do último trimestre' },
  { id: 32, clientId: 'intime',    date: '2026-03-20', type: 'revisao',   title: 'Revisão Q1 2026',           description: 'Resultados do 1º trimestre' },
  { id: 33, clientId: 'intime',    date: '2026-05-26', type: 'lp',        title: 'LP Demo (revisão)',         description: 'LP captação de demos em aprovação' },
  { id: 34, clientId: 'intime',    date: '2026-10-20', type: 'renovacao', title: 'Renovação anual',           description: 'Renovação do contrato' },

  // Polizio
  { id: 35, clientId: 'polizio',   date: '2026-03-01', type: 'kickoff',   title: 'Kickoff Polizio',           description: 'Início da parceria com advocacia' },
  { id: 36, clientId: 'polizio',   date: '2026-03-20', type: 'campanha',  title: 'Meta Ads jurídico',         description: 'Campanhas de captação' },
  { id: 37, clientId: 'polizio',   date: '2026-04-25', type: 'revisao',   title: 'Revisão abril',             description: 'Resultados do primeiro mês' },
  { id: 38, clientId: 'polizio',   date: '2026-09-01', type: 'renovacao', title: 'Renovação semestral',       description: 'Renovação do contrato' },
]
