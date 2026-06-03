/* ── Atividades e pontuação em ons ───────────────────────────────────────
   1 on  = rotina rápida (< 15 min)
   2 ons = execução média (30–60 min)
   3 ons = entrega estratégica / complexa (1h+)
   ─────────────────────────────────────────────────────────────────────── */
export const taskTypes = {
  /* 1 on — Rotina */
  atualizar_gmn:  { label: 'Google Meu Negócio',      icon: '📍', color: '#8890b5', ons: 1 },
  enviar_dash:    { label: 'Enviar Dashboard',         icon: '📤', color: '#8890b5', ons: 1 },
  whats_grupos:   { label: 'Grupos WhatsApp',          icon: '💬', color: '#8890b5', ons: 1 },
  gestao_diaria:  { label: 'Gestão Diária',            icon: '🔄', color: '#8890b5', ons: 1 },
  planilha_ind:   { label: 'Planilha Indicadores',     icon: '📋', color: '#8890b5', ons: 1 },
  analise_conv:   { label: 'Analisar Conversas CRM',   icon: '🔍', color: '#8890b5', ons: 1 },

  /* 2 ons — Execução */
  org_perfil:     { label: 'Organizar Perfil Social',  icon: '✨', color: '#60a5fa', ons: 2 },
  reuniao:        { label: 'Reunião de Acomp.',        icon: '📅', color: '#60a5fa', ons: 2 },
  criar_artes:    { label: 'Criação de Artes',         icon: '🎨', color: '#60a5fa', ons: 2 },
  roteiro:        { label: 'Planej. Roteiro',          icon: '✍️', color: '#60a5fa', ons: 2 },
  calendario_post:{ label: 'Calendário de Post',       icon: '📆', color: '#60a5fa', ons: 2 },
  pesquisa_merc:  { label: 'Pesquisa de Mercado',      icon: '🔎', color: '#60a5fa', ons: 2 },
  rastreamento:   { label: 'Rastreamento',             icon: '🎯', color: '#60a5fa', ons: 2 },
  pipeline_crm:   { label: 'Pipeline & CRM',           icon: '📊', color: '#60a5fa', ons: 2 },

  /* 3 ons — Estratégico */
  setup_conta:    { label: 'Setup de Conta',           icon: '⚙️', color: '#f59e0b', ons: 3 },
  criar_campanha: { label: 'Criar Campanha',           icon: '📢', color: '#f59e0b', ons: 3 },
  treinamento:    { label: 'Treinamento Cliente',      icon: '🎓', color: '#f59e0b', ons: 3 },
  captacao_video: { label: 'Captação de Vídeo',        icon: '🎥', color: '#f59e0b', ons: 3 },
  edicao_video:   { label: 'Edição de Vídeo',          icon: '🎬', color: '#f59e0b', ons: 3 },

  /* legado — tipos antigos ainda no banco */
  lp:       { label: 'Landing Page', icon: '🖥️', color: '#6eda2c', ons: 3 },
  criativo: { label: 'Criativo',     icon: '🎨', color: '#be29ec', ons: 2 },
  campanha: { label: 'Campanha',     icon: '📢', color: '#60a5fa', ons: 3 },
  copy:     { label: 'Copy',         icon: '✍️', color: '#ea8a29', ons: 2 },
  video:    { label: 'Vídeo',        icon: '🎬', color: '#ef4444', ons: 3 },
}

/* ── Status das tarefas ─────────────────────────── */
export const statusConfig = {
  todo:     { label: 'A Fazer',                color: '#8890b5' },
  doing:    { label: 'Em Andamento',            color: '#60a5fa' },
  review:   { label: 'Em Revisão',              color: '#ea8a29' },
  aprovado: { label: 'Aprovado para anúncio',   color: '#ea8a29' },
  done:     { label: 'Concluído',               color: '#6eda2c' },
}

/* ── Flags de aprovação (visível dentro do card) ── */
export const TASK_FLAGS = {
  pending_internal: { label: 'Aguarda revisão interna', color: '#60a5fa', dot: '🔵' },
  pending_client:   { label: 'Aguarda cliente',         color: '#f59e0b', dot: '🟡' },
  revision:         { label: 'Alteração solicitada',    color: '#ef4444', dot: '🔴' },
  approved_ad:      { label: 'Aprovado p/ anúncio',     color: '#6eda2c', dot: '🟢' },
}

/* ── Colaboradores ──────────────────────────────── */
export const collaborators = [
  {
    id: 'gs', name: 'Gabriel S.', email: 'gabrielsschollmeier@gmail.com',
    role: 'Gestor de Tráfego', avatar: 'GS', color: '#6eda2c',
    belt: 'preta', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2022-05-30', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'carol', name: 'Carol', email: 'carolinepaganiadv@gmail.com',
    role: 'Administrador', avatar: 'CA', color: '#be29ec',
    belt: 'preta', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2022-05-30', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'tochiro', name: 'Tochiro', email: 'gestaotrafegon@gmail.com',
    role: 'Gestor de Tráfego', avatar: 'TO', color: '#22d3ee',
    belt: 'branca', grau: 2,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2025-12-30', xpResetAt: '2025-12-30',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'ana_sm', name: 'Ana', email: 'socialmediaclientestrafegon@gmail.com',
    role: 'Social Media', avatar: 'AN', color: '#ec4899',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-15', xpResetAt: '2026-05-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'beatriz', name: 'Beatriz', email: 'socialmediatrafegon@gmail.com',
    role: 'Social Media', avatar: 'BZ', color: '#f97316',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-30', xpResetAt: '2026-05-30',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'geovana', name: 'Geovana', email: 'designertrafegon@gmail.com',
    role: 'Designer', avatar: 'GE', color: '#f59e0b',
    belt: 'preta', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2025-05-30', xpResetAt: '2025-05-30',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'elieser', name: 'Elieser', email: 'elieserpeper@gmail.com',
    role: 'Gestor de Dados', avatar: 'EL', color: '#ea8a29',
    belt: 'preta', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2025-08-30', xpResetAt: '2025-08-30',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'deivisson', name: 'Deivisson', email: 'contato@tudoinforj.com.br',
    role: 'Web Designer', avatar: 'DE', color: '#818cf8',
    belt: 'preta', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2023-11-30', xpResetAt: '2023-11-30',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'adm_at', name: 'ADM', email: 'atendimentotrafegon@gmail.com',
    role: 'Fantasma', avatar: '?', color: '#555555',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'juliano', name: 'Juliano', email: 'trafegonvendas@gmail.com',
    role: 'Vendas', avatar: 'JU', color: '#a78bfa',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-04-30', xpResetAt: '2026-04-30',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
]

/* ── Clientes (workspaces do ERP) ───────────────── */
/* type: 'recorrencia' = assessoria mensal | 'avulso' = consultoria / projeto pontual */
export const erpClients = [
  /* ── Agência (interno) ── */
  { id: 'agencia', name: 'TráfegOn (Agência)', type: 'agencia', color: '#6eda2c', manager: 'gs', status: 'active', since: '2022-05-30', monthlyValue: 0, niche: 'Agência' },

  /* ── Recorrência (Assessoria) ── */
  { id: 'cooperja',       name: 'Cooperja',                   type: 'recorrencia', color: '#6eda2c', manager: 'gs',      status: 'active',  since: '2026-01-10', monthlyValue: 0, niche: 'Cooperativa' },
  { id: 'cooperja_lojas', name: 'Cooperja Lojas Agropecuárias', type: 'recorrencia', color: '#86efac', manager: 'gs',   status: 'active',  since: '2026-05-20', monthlyValue: 0, niche: 'Agropecuária' },
  { id: 'cooperja_rh',    name: 'Cooperja RH',                type: 'recorrencia', color: '#a3e635', manager: 'gs',      status: 'active',  since: '2026-01-10', monthlyValue: 0,  niche: 'RH / Cooperativa' },
  { id: 'rizzotto',       name: 'Posto Rizzotto',              type: 'recorrencia', color: '#60a5fa', manager: 'gs',      status: 'active',  since: '2026-02-05', monthlyValue: 0, niche: 'Combustível' },
  { id: 'kamy',           name: 'Kamy Mat. de Construção',     type: 'recorrencia', color: '#be29ec', manager: 'tochiro', status: 'active',  since: '2026-01-20', monthlyValue: 0, niche: 'Materiais de Construção' },
  { id: 'intime',         name: 'Intime Sistemas',             type: 'recorrencia', color: '#a78bfa', manager: 'tochiro', status: 'active',  since: '2025-10-20', monthlyValue: 0, niche: 'Software B2B' },
  { id: 'kinto',          name: 'Kinto Escola',                type: 'recorrencia', color: '#f59e0b', manager: 'gs',      status: 'active',  since: '2025-09-01', monthlyValue: 0, niche: 'Educação' },
  { id: 'carol_adv',      name: 'Caroline Pagani Advogada',    type: 'recorrencia', color: '#f43f5e', manager: 'ana_sm',  status: 'active',  since: '2025-08-15', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'polizio',        name: 'Polízio Advogados',           type: 'recorrencia', color: '#34d399', manager: 'ana_sm',  status: 'active',  since: '2026-03-01', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'pit_floripa',    name: 'Pit Floripa',                 type: 'recorrencia', color: '#fb923c', manager: 'gs',      status: 'active',  since: '2025-11-01', monthlyValue: 0, niche: 'Alimentação' },
  { id: 'cacarola',       name: 'Caçarola',                    type: 'recorrencia', color: '#f87171', manager: 'gs',      status: 'active',  since: '2025-12-01', monthlyValue: 0, niche: 'Alimentação' },
  { id: 'sitio_girabas',  name: 'Sítio Girabas',               type: 'recorrencia', color: '#4ade80', manager: 'tochiro', status: 'active',  since: '2025-07-10', monthlyValue: 0, niche: 'Turismo / Eventos' },
  { id: 'ararastur',      name: 'Ararastur',                   type: 'recorrencia', color: '#ea8a29', manager: 'gs',      status: 'active',  since: '2025-11-15', monthlyValue: 0, niche: 'Turismo' },
  { id: 'gabriel_piva',   name: 'Da Rós e Piva Advogados',     type: 'recorrencia', color: '#818cf8', manager: 'ana_sm',  status: 'active',  since: '2026-01-05', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'quadros',        name: 'Quadros Paisagismo',          type: 'recorrencia', color: '#2dd4bf', manager: 'tochiro', status: 'active',  since: '2025-10-15', monthlyValue: 0, niche: 'Paisagismo' },
  { id: 'andressa_adv',   name: 'Andressa Advogada',           type: 'recorrencia', color: '#c084fc', manager: 'ana_sm',  status: 'active',  since: '2026-05-20', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'fonseca_gonc',   name: 'Fonseca e Gonçalves Adv',     type: 'recorrencia', color: '#67e8f9', manager: 'ana_sm',  status: 'active',  since: '2026-05-20', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'lenergy',        name: 'Lenergy Energia Solar',       type: 'recorrencia', color: '#fde047', manager: 'gs',      status: 'paused', since: '2026-05-20', monthlyValue: 0, niche: 'Energia Solar' },
  { id: 'mayara_campos',  name: 'Mayara Campos Advogada',      type: 'recorrencia', color: '#f9a8d4', manager: 'ana_sm',  status: 'active',  since: '2026-05-20', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'rca_adv',        name: 'RCA Advocacia',               type: 'recorrencia', color: '#a5b4fc', manager: 'ana_sm',  status: 'active',  since: '2026-05-20', monthlyValue: 0, niche: 'Advocacia' },
  { id: 'milfer',         name: 'Milfer',                      type: 'recorrencia', color: '#64748b', manager: 'gs',      status: 'active',  since: '2023-04-01', monthlyValue: 0, niche: 'Ferro e Aço' },
  { id: 'nueva',          name: 'Nucleo Nueva',                type: 'recorrencia', color: '#7c3aed', manager: 'gs',      status: 'active',  since: '2025-06-01', monthlyValue: 0, niche: 'Arquitetura' },
  { id: 'heirs',          name: 'Heirs do Brasil',             type: 'recorrencia', color: '#dc2626', manager: 'tochiro', status: 'active',  since: '2025-09-15', monthlyValue: 2000, niche: 'Moda / Vestuário' },
  { id: 'loja_ambiente',  name: 'Loja Ambiente',               type: 'recorrencia', color: '#059669', manager: 'gs',      status: 'active',  since: '2025-08-01', monthlyValue: 0, niche: 'Decoração / Móveis' },
  { id: 'casa_construtor',name: 'Casa do Construtor',          type: 'recorrencia', color: '#d97706', manager: 'gs',      status: 'active',  since: '2026-03-10', monthlyValue: 0, niche: 'Construção / Materiais' },
  { id: 'nosso_studio',   name: 'Nosso Studio',                type: 'recorrencia', color: '#ec4899', manager: 'gs',      status: 'active',  since: '2026-04-01', monthlyValue: 0, niche: 'Moda / Lingerie' },
  { id: 'camila_masera',  name: 'Camila Masera Advogada',      type: 'recorrencia', color: '#0891b2', manager: 'ana_sm',  status: 'active',  since: '2026-04-15', monthlyValue: 0, niche: 'Advocacia' },

  { id: 'girassol_arq', name: 'Priscila - Girassol Arquitetura', type: 'avulso', color: '#f59e0b', manager: 'gs', status: 'active', since: '2026-05-31', monthlyValue: 0, niche: 'Arquitetura' },

  /* ── Avulso (Consultoria / Projeto) ── */
  { id: 'dsorrir',        name: "D'Sorrir Odontologia",        type: 'avulso',      color: '#14b8a6', manager: 'gs',      status: 'active',  since: '2026-05-01', monthlyValue: 0,    niche: 'Odontologia' },
  { id: 'luciana_vasco',  name: 'Luciana Vasco',               type: 'avulso',      color: '#f472b6', manager: 'gs',      status: 'active',  since: '2026-05-20', monthlyValue: 0,    niche: 'Consultoria' },
  { id: 'plano_ideal',    name: 'Imob. Plano Ideal',           type: 'avulso',      color: '#0ea5e9', manager: 'gs',      status: 'active',  since: '2026-05-30', monthlyValue: 0,    niche: 'Imobiliário' },
  { id: 'cdc',            name: 'CDC Araranguá',               type: 'avulso',      color: '#f97316', manager: 'gs',      status: 'active',  since: '2026-05-20', monthlyValue: 3000, niche: 'Construção' },
]

/* ── Tarefas / Entregas ─────────────────────────── */
export const tasks = []

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
