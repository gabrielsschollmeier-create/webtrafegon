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
    id: 'gs', name: 'Gabriel S.', email: 'gabrielsschollmeier@gmail.com',
    role: 'Gestor de Tráfego', avatar: 'GS', color: '#6eda2c',
    level: 1, rank: 'Aprendiz', xp: 0, xpToNext: 500,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'carol', name: 'Carol', email: 'carolinepaganiadv@gmail.com',
    role: 'Administrador', avatar: 'CA', color: '#be29ec',
    level: 1, rank: 'Aprendiz', xp: 0, xpToNext: 500,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'tochiro', name: 'Tochiro', email: 'gestaotrafegon@gmail.com',
    role: 'Gestor de Tráfego', avatar: 'TO', color: '#22d3ee',
    level: 1, rank: 'Aprendiz', xp: 0, xpToNext: 500,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'ana_sm', name: 'Ana', email: 'socialmediatrafegon@gmail.com',
    role: 'Social Media', avatar: 'AN', color: '#ec4899',
    level: 1, rank: 'Aprendiz', xp: 0, xpToNext: 500,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'adm_at', name: 'ADM', email: 'atendimentotrafegon@gmail.com',
    role: 'Atendimento', avatar: 'AD', color: '#f59e0b',
    level: 1, rank: 'Aprendiz', xp: 0, xpToNext: 500,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'juliano', name: 'Juliano', email: 'trafegonvendas@gmail.com',
    role: 'Vendas', avatar: 'JU', color: '#a78bfa',
    level: 1, rank: 'Aprendiz', xp: 0, xpToNext: 500,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
]

/* ── Clientes (workspaces do ERP) ───────────────── */
export const erpClients = [
  { id: 'cooperja',      name: 'Cooperja',              color: '#6eda2c', manager: 'gs', status: 'active',  since: '2026-01-10', monthlyValue: 4500, niche: 'Cooperativa' },
  { id: 'rizzotto',      name: 'Posto Rizzotto',         color: '#60a5fa', manager: 'gs', status: 'active',  since: '2026-02-05', monthlyValue: 3200, niche: 'Combustível' },
  { id: 'kamy',          name: 'Kamy',                   color: '#be29ec', manager: 'tochiro', status: 'active',  since: '2026-01-20', monthlyValue: 2800, niche: 'Moda' },
  { id: 'intime',        name: 'Intime Sistemas',         color: '#a78bfa', manager: 'tochiro', status: 'active',  since: '2025-10-20', monthlyValue: 3500, niche: 'Software' },
  { id: 'kinto',         name: 'Kinto Sistemas',          color: '#f59e0b', manager: 'gs', status: 'active',  since: '2025-09-01', monthlyValue: 3200, niche: 'Software' },
  { id: 'carol_adv',     name: 'Carol Adv',               color: '#f43f5e', manager: 'ana_sm', status: 'active',  since: '2025-08-15', monthlyValue: 2500, niche: 'Advocacia' },
  { id: 'polizio',       name: 'Polizio Advogados',       color: '#34d399', manager: 'ana_sm', status: 'active',  since: '2026-03-01', monthlyValue: 2800, niche: 'Advocacia' },
  { id: 'pit_floripa',   name: 'Pit Floripa',              color: '#fb923c', manager: 'gs', status: 'active',  since: '2025-11-01', monthlyValue: 2200, niche: 'Alimentação' },
  { id: 'cacarola',      name: 'Caçarola',                color: '#f87171', manager: 'gs', status: 'at_risk', since: '2025-12-01', monthlyValue: 2200, niche: 'Alimentação' },
  { id: 'sitio_girabas', name: 'Sítio Girabas',           color: '#4ade80', manager: 'tochiro', status: 'active',  since: '2025-07-10', monthlyValue: 1800, niche: 'Turismo' },
  { id: 'ararastur',     name: 'Ararastur',                color: '#ea8a29', manager: 'gs', status: 'at_risk', since: '2025-11-15', monthlyValue: 1900, niche: 'Turismo' },
  { id: 'gabriel_piva',  name: 'Gabriel Piva Advocacia',  color: '#818cf8', manager: 'ana_sm', status: 'active',  since: '2026-01-05', monthlyValue: 1800, niche: 'Advocacia' },
  { id: 'quadros',       name: 'Quadros Paisagismo',      color: '#2dd4bf', manager: 'tochiro', status: 'active',  since: '2025-10-15', monthlyValue: 1500, niche: 'Paisagismo' },
  { id: 'cdc',              name: 'CDC Araranguá',                color: '#f97316', manager: 'gs', status: 'active',  since: '2026-05-20', monthlyValue: 3000, niche: 'Construção' },
  { id: 'andressa_adv',    name: 'Andressa Advogada',            color: '#c084fc', manager: 'ana_sm', status: 'active',  since: '2026-05-20', monthlyValue: 0,    niche: 'Advocacia' },
  { id: 'cooperja_lojas',  name: 'Cooperja Lojas',               color: '#86efac', manager: 'gs',     status: 'active',  since: '2026-05-20', monthlyValue: 0,    niche: 'Agropecuária' },
  { id: 'fonseca_gonc',    name: 'Fonseca e Gonçalves Adv',      color: '#67e8f9', manager: 'ana_sm', status: 'active',  since: '2026-05-20', monthlyValue: 0,    niche: 'Advocacia' },
  { id: 'lenergy',         name: 'Lenergy',                      color: '#fde047', manager: 'gs',     status: 'paused', since: '2026-05-20', monthlyValue: 0,    niche: 'Energia Solar' },
  { id: 'mayara_campos',   name: 'Mayara Campos Advogada',       color: '#f9a8d4', manager: 'ana_sm', status: 'active',  since: '2026-05-20', monthlyValue: 0,    niche: 'Advocacia' },
  { id: 'rca_adv',         name: 'RCA Advogados',                color: '#a5b4fc', manager: 'ana_sm', status: 'active',  since: '2026-05-20', monthlyValue: 0,    niche: 'Advocacia' },
]

/* ── Tarefas / Entregas ─────────────────────────── */
export const tasks = [
  { id: 1, clientId: 'cooperja', type: 'lp',      title: 'LP Safra 2026',        assignee: 'gs',      status: 'doing', priority: 'high',   dueDate: '2026-06-10', description: 'Landing page para campanha de safra' },
  { id: 2, clientId: 'intime',   type: 'campanha', title: 'Google Ads B2B Intime', assignee: 'tochiro', status: 'todo',  priority: 'medium', dueDate: '2026-06-15', description: 'Campanhas Search para demo do software' },
]

/* ── Reuniões no Google Agenda ──────────────────── */
export const meetings = [
  { id: 1, clientId: 'cooperja', title: 'Reunião mensal Cooperja', date: '2026-06-02', time: '10:00', duration: 60, attendees: ['gs'], type: 'monthly_review', link: '' },
]

/* ── Tipos de marco (Linha do Tempo) ────────────── */
export const milestoneTypes = {
  kickoff:   { label: 'Kickoff',       icon: '🚀', color: '#6eda2c' },
  lp:        { label: 'LP publicada',  icon: '🖥️', color: '#60a5fa' },
  campanha:  { label: 'Campanha',      icon: '📢', color: '#ea8a29' },
  revisao:   { label: 'Revisão',       icon: '📋', color: '#be29ec' },
  renovacao: { label: 'Renovação',     icon: '🔄', color: '#22d3ee' },
  alerta:    { label: 'Alerta',        icon: '⚠️', color: '#ef4444' },
  setup:     { label: 'Configuração',  icon: '⚙️', color: '#22d3ee' },
  automacao: { label: 'Automação',     icon: '🤖', color: '#a78bfa' },
  criativo:  { label: 'Conteúdo',      icon: '🎨', color: '#ec4899' },
  meta:      { label: 'Meta atingida', icon: '🎯', color: '#6eda2c' },
}

/* ── Marcos por cliente ─────────────────────────── */
export const milestones = [
  { id: 1, clientId: 'cooperja',  date: '2026-01-10', type: 'kickoff', title: 'Kickoff Cooperja',  description: 'Início da parceria, alinhamento estratégico' },
  { id: 2, clientId: 'rizzotto',  date: '2026-02-05', type: 'kickoff', title: 'Kickoff Rizzotto',  description: 'Início da parceria' },
  { id: 3, clientId: 'kamy',      date: '2026-01-20', type: 'kickoff', title: 'Kickoff Kamy',      description: 'Início da parceria de moda' },
  { id: 4, clientId: 'ararastur', date: '2025-11-15', type: 'kickoff', title: 'Kickoff Ararastur', description: 'Início da parceria de turismo' },
  { id: 5, clientId: 'cacarola',  date: '2025-12-01', type: 'kickoff', title: 'Kickoff Caçarola',  description: 'Início da parceria gastronômica' },
  { id: 6, clientId: 'intime',    date: '2026-02-13', type: 'kickoff', title: '🚀 Kickoff Intime Sistemas', description: 'Início da operação de aceleração — Temoos/Intime ERP.' },
  { id: 7, clientId: 'polizio',   date: '2026-03-01', type: 'kickoff', title: 'Kickoff Polizio',   description: 'Início da parceria com advocacia' },

  /* ── Intime: Aceleração Fev–Mai 2026 (Gantt) ─── */
  { id: 101, clientId: 'intime', date: '2026-02-13', type: 'setup',     title: '✅ Diagnóstico & Benchmark',                      description: 'Diagnóstico do negócio e benchmark de mercado — concluído.' },
  { id: 102, clientId: 'intime', date: '2026-02-20', type: 'setup',     title: '✅ Auditoria & Config. de Contas',                 description: 'Auditoria e configuração do Gerenciador de Negócios, GTM e rastreamentos — concluído.' },
  { id: 103, clientId: 'intime', date: '2026-02-27', type: 'setup',     title: '✅ Fragmentação de Eventos e Conversões',          description: 'Configuração dos eventos de conversão e fragmentação no Meta/Google — concluído.' },
  { id: 104, clientId: 'intime', date: '2026-02-27', type: 'setup',     title: '✅ Google Meu Negócio',                            description: 'Configuração e otimização do perfil Google Meu Negócio — concluído.' },
  { id: 105, clientId: 'intime', date: '2026-03-06', type: 'revisao',   title: '✅ Estudo de Público-Alvo & Definição de Ofertas', description: 'Personas definidas, ofertas estruturadas e posicionamento validado — concluído.' },
  { id: 106, clientId: 'intime', date: '2026-02-20', type: 'revisao',   title: '✅ Reunião de Planejamento Estratégico',           description: 'Alinhamento de cronograma e projeções financeiras com o cliente — concluído.' },
  { id: 107, clientId: 'intime', date: '2026-03-06', type: 'revisao',   title: '✅ Reunião de Acompanhamento de Pauta',            description: 'Primeira reunião de acompanhamento — em ciclo recorrente quinzenal.' },
  { id: 108, clientId: 'intime', date: '2026-03-20', type: 'automacao', title: '✅ Automações de Entrada de Leads (WhatsApp)',      description: 'Automações no funil de entrada + integração WhatsApp via API — concluído.' },
  { id: 109, clientId: 'intime', date: '2026-03-20', type: 'automacao', title: '✅ CRM Básico — Implementação & Treinamento',      description: 'CRM implantado e time treinado para gestão de leads e follow-up — concluído.' },
  { id: 110, clientId: 'intime', date: '2026-04-10', type: 'setup',     title: '✅ Dashboard & Looker Studio',                     description: 'Dashboard de performance criado no Looker Studio com métricas de tráfego e vendas — concluído.' },
  { id: 111, clientId: 'intime', date: '2026-02-13', type: 'campanha',  title: '✅ Campanhas A — Teste (Públicos, Criativos, Copies)', description: 'Fase de testes: validação de públicos, criativos e copies — concluído.' },
  { id: 112, clientId: 'intime', date: '2026-03-06', type: 'campanha',  title: '🟢 Campanhas B — Fast Traffic',                   description: 'Campanhas de tráfego rápido para geração de demanda — ativas e em escala.' },
  { id: 113, clientId: 'intime', date: '2026-04-10', type: 'campanha',  title: '🟢 Campanhas C — Remarketing',                    description: 'Campanhas de remarketing para leads que não converteram — ativas.' },
  { id: 114, clientId: 'intime', date: '2026-02-13', type: 'criativo',  title: '🟡 Organização do Perfil Instagram',               description: 'Organização do feed, bio, destaques e identidade visual no Instagram — em andamento.' },
  { id: 115, clientId: 'intime', date: '2026-02-20', type: 'criativo',  title: '✅ Edições de Vídeos & Criação de Artes',          description: 'Produção de artes, vídeos e criativos para campanhas — entrega contínua.' },
  { id: 116, clientId: 'intime', date: '2026-04-17', type: 'lp',        title: '✅ Landing Page (Design, Copy, Web, Rastreamento)', description: 'Landing page completa desenvolvida, publicada e com rastreamento configurado — concluído.' },
  { id: 117, clientId: 'intime', date: '2026-04-17', type: 'automacao', title: '🟡 Agente de IA Pré-Vendas',                       description: 'Desenvolvimento do agente de IA para qualificação e atendimento no pré-vendas — em andamento.' },
  { id: 118, clientId: 'intime', date: '2026-05-27', type: 'revisao',   title: '📅 Novo Planejamento Estratégico',                 description: 'Novo ciclo de planejamento — próxima semana.' },
  /* Metas atingidas */
  { id: 120, clientId: 'intime', date: '2026-04-30', type: 'meta',      title: '🏆 Breakeven da Agência Atingido',                 description: '13 clientes ativos — ponto de equilíbrio do fee da agência atingido em abril/2026.' },
  { id: 121, clientId: 'intime', date: '2026-05-21', type: 'meta',      title: '🏆 22 Contratos & MRR R$5.976',                   description: '22 contratos fechados, MRR de R$5.976 — base autossustentável construída em 4 meses.' },
]
