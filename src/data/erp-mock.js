/* ── Atividades e pontuação em ons ───────────────────────────────────────
   1 on  = rotina
   2 ons = execução
   3 ons = estratégico
   + 1 on de bônus se entregue no prazo ou antes (completedAt <= dueDate)
   ─────────────────────────────────────────────────────────────────────── */
export const taskTypes = {
  /* ── TIPOS ATIVOS — aparecem no seletor de nova tarefa ─────────────── */

  /* 1 on — Rotina */
  atendimento:  { label: 'Atendimento',  icon: '💬', color: '#8890b5', ons: 1 },

  /* 2 ons — Execução */
  copy:         { label: 'Copy',         icon: '✏️',  color: '#ea8a29', ons: 2 },
  criativo:     { label: 'Criativo',     icon: '🎨', color: '#be29ec', ons: 2 },
  social_media: { label: 'Social Media', icon: '📱', color: '#60a5fa', ons: 2 },
  relatorio:    { label: 'Relatório',    icon: '📈', color: '#60a5fa', ons: 2 },
  reuniao:      { label: 'Reunião',      icon: '📅', color: '#60a5fa', ons: 2 },

  /* 3 ons — Estratégico */
  campanha:     { label: 'Campanha',     icon: '📢', color: '#f59e0b', ons: 3 },
  video:        { label: 'Vídeo',        icon: '🎬', color: '#ef4444', ons: 3 },
  lp:           { label: 'Landing Page', icon: '🖥️', color: '#6eda2c', ons: 3 },
  onboarding:   { label: 'Onboarding',   icon: '🚀', color: '#f59e0b', ons: 3 },

  /* ── LEGADO — não aparecem no seletor; mantidos para lookup de ons ─── */
  atualizar_gmn:     { label: 'Google Meu Negócio',      icon: '📍', color: '#8890b5', ons: 1, legacy: true },
  enviar_dash:       { label: 'Enviar Dashboard',         icon: '📤', color: '#8890b5', ons: 1, legacy: true },
  whats_grupos:      { label: 'Grupos WhatsApp',          icon: '💬', color: '#8890b5', ons: 1, legacy: true },
  gestao_diaria:     { label: 'Gestão Diária',            icon: '🔄', color: '#8890b5', ons: 1, legacy: true },
  planilha_ind:      { label: 'Planilha Indicadores',     icon: '📋', color: '#8890b5', ons: 1, legacy: true },
  criar_artes:       { label: 'Criação de Artes',         icon: '🎨', color: '#8890b5', ons: 1, legacy: true },
  pesquisa_merc:     { label: 'Pesquisa de Mercado',      icon: '🔎', color: '#8890b5', ons: 1, legacy: true },
  publicar_posts:    { label: 'Publicar/Agendar Posts',   icon: '📱', color: '#8890b5', ons: 1, legacy: true },
  boletos_notif:     { label: 'Boletos e Notificações',   icon: '💰', color: '#8890b5', ons: 1, legacy: true },
  org_perfil:        { label: 'Organizar Perfil Social',  icon: '✨', color: '#60a5fa', ons: 2, legacy: true },
  roteiro:           { label: 'Planej. Roteiro',          icon: '✍️', color: '#60a5fa', ons: 2, legacy: true },
  calendario_post:   { label: 'Calendário de Post',       icon: '📆', color: '#60a5fa', ons: 2, legacy: true },
  rastreamento:      { label: 'Rastreamento',             icon: '🎯', color: '#60a5fa', ons: 2, legacy: true },
  analisar_crm:      { label: 'Analisar CRM',             icon: '📊', color: '#60a5fa', ons: 2, legacy: true },
  edicao_video:      { label: 'Edição de Vídeo',          icon: '🎬', color: '#60a5fa', ons: 2, legacy: true },
  captacao_video:    { label: 'Captação de Vídeo',        icon: '🎥', color: '#60a5fa', ons: 2, legacy: true },
  planilha_clientes: { label: 'Planilhas Clientes',       icon: '📑', color: '#60a5fa', ons: 2, legacy: true },
  design_lp:         { label: 'Design de Landing Page',   icon: '🖥️', color: '#60a5fa', ons: 2, legacy: true },
  criacao_copy:      { label: 'Criação de Copy',          icon: '✏️', color: '#60a5fa', ons: 2, legacy: true },
  relatorio_perf:    { label: 'Relatório de Performance', icon: '📈', color: '#60a5fa', ons: 2, legacy: true },
  config_pixel:      { label: 'Configurar Pixel',         icon: '🔧', color: '#60a5fa', ons: 2, legacy: true },
  analisar_concorr:  { label: 'Analisar Concorrentes',    icon: '🕵️', color: '#60a5fa', ons: 2, legacy: true },
  setup_conta:       { label: 'Setup de Conta',           icon: '⚙️', color: '#f59e0b', ons: 3, legacy: true },
  criar_campanha:    { label: 'Criar Campanha do Zero',   icon: '📢', color: '#f59e0b', ons: 3, legacy: true },
  treinamento:       { label: 'Treinamento de Vendas',    icon: '🎓', color: '#f59e0b', ons: 3, legacy: true },
  auditoria:         { label: 'Auditoria de Conta',       icon: '🔍', color: '#f59e0b', ons: 3, legacy: true },
  plan_estrategico:  { label: 'Planej. Estratégico',      icon: '🗺️', color: '#f59e0b', ons: 3, legacy: true },
  metas_kpis:        { label: 'Metas e KPIs',             icon: '🎯', color: '#f59e0b', ons: 3, legacy: true },
  trein_equipe:      { label: 'Trein. Equipe Cliente',    icon: '👥', color: '#f59e0b', ons: 3, legacy: true },
  analise_conv:      { label: 'Analisar Conv. CRM',       icon: '🔍', color: '#8890b5', ons: 1, legacy: true },
  pipeline_crm:      { label: 'Pipeline & CRM',           icon: '📊', color: '#60a5fa', ons: 2, legacy: true },
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
    since: '2020-06-15', xpResetAt: '2020-06-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'carol', name: 'Carol', email: 'carolinepaganiadv@gmail.com',
    role: 'Administrador', avatar: 'CA', color: '#be29ec',
    belt: 'preta', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2020-06-15', xpResetAt: '2020-06-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'tochiro', name: 'Juliano', email: 'gestaotrafegon@gmail.com',
    role: 'Traffic Analyst Meta', avatar: 'JU', color: '#22d3ee',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-15', xpResetAt: '2026-05-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'ana_sm', name: 'Ana', email: 'socialmediaclientestrafegon@gmail.com',
    role: 'Marketing Trainee', avatar: 'AN', color: '#ec4899',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-20', xpResetAt: '2026-05-20',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
    active: false,
  },
  {
    id: 'beatriz', name: 'Beatriz', email: 'socialmediatrafegon@gmail.com',
    role: 'Creative Producer', avatar: 'BZ', color: '#f97316',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'elieser', name: 'Elieser', email: 'elieserpeper@gmail.com',
    role: 'Gestor de Dados', avatar: 'EL', color: '#ea8a29',
    belt: 'azul', grau: 1,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2025-08-15', xpResetAt: '2025-08-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'deivisson', name: 'Deivisson', email: 'contato@tudoinforj.com.br',
    role: 'Web Designer', avatar: 'DE', color: '#818cf8',
    belt: 'marrom', grau: 1,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2024-06-15', xpResetAt: '2024-06-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'adm_at', name: 'Érica', email: 'atendimentotrafegon@gmail.com',
    role: 'Marketing Assistant', avatar: 'ER', color: '#f59e0b',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-05-28', xpResetAt: '2026-05-28',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'mariana', name: 'Mariana', email: 'socialmediatrafegonjuridico@gmail.com',
    role: 'Content Creator', avatar: 'MA', color: '#14b8a6',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-06-16', xpResetAt: '2026-06-16',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
  {
    id: 'henrique', name: 'Henrique', email: 'gestaotrafegon01@gmail.com',
    role: 'Traffic Analyst', avatar: 'HE', color: '#06d6a0',
    belt: 'branca', grau: 0,
    streak: 0, tasksCompleted: 0, tasksThisMonth: 0,
    since: '2026-08-15', xpResetAt: '2026-08-15',
    deliveriesByType: { lp: 0, criativo: 0, campanha: 0, copy: 0, video: 0, reuniao: 0 },
    badges: [],
  },
]

/* ── Clientes (workspaces do ERP) ───────────────── */
/* type: 'recorrencia' = assessoria mensal | 'avulso' = consultoria / projeto pontual */
export const erpClients = [
  /* ── Agência (aparece em Assessoria) ── */
  { id: 'agencia', name: 'TráfegOn', clientType: 'recorrente', color: '#6eda2c', manager: 'gs', status: 'active', since: '2022-05-30', monthlyValue: 0, niche: 'Agência' },
  { id: 'thais_cardoso', name: 'Dra. Thais Cardoso', type: 'projeto', color: '#3b82f6', manager: 'gs', status: 'active', since: '2026-08-19', monthlyValue: 0, niche: 'Advocacia · Família e Sucessões' },

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
  { id: 'tecnoeletro',    name: 'Tecnoeletro',                 type: 'recorrencia', color: '#06b6d4', manager: 'tochiro', status: 'active',  since: '2026-07-04', monthlyValue: 0, niche: 'Eletroeletrônicos' },
  /* ── Destrava Digital (Avulso) ── */
  { id: 'girassol_arq',  name: 'Priscila - Girassol Arquitetura', clientType: 'destrava_digital', color: '#f59e0b', manager: 'gs',  status: 'active', since: '2026-05-31', monthlyValue: 0, niche: 'Arquitetura' },
  { id: 'dsorrir',       name: "D'Sorrir Odontologia",            clientType: 'destrava_digital', color: '#14b8a6', manager: 'gs',  status: 'active', since: '2026-05-01', monthlyValue: 0, niche: 'Odontologia' },
  { id: 'luciana_vasco', name: 'Luciana Vasco',                   clientType: 'destrava_digital', color: '#f472b6', manager: 'gs',  status: 'active', since: '2026-05-20', monthlyValue: 0, niche: 'Consultoria' },
  { id: 'plano_ideal',   name: 'Imob. Plano Ideal',               clientType: 'destrava_digital', color: '#0ea5e9', manager: 'gs',  status: 'active', since: '2026-05-30', monthlyValue: 0, niche: 'Imobiliário' },
  { id: 'patricia_ramos', name: 'Patrícia Ramos Advogada',         clientType: 'destrava_digital', color: '#6366f1', manager: 'gs',  status: 'active', since: '2026-06-15', monthlyValue: 0, niche: 'Advocacia' },
]

/* ── Tarefas / Entregas ─────────────────────────── */
export const tasks = [
  /* ── Camila Masera Advogada — Assessoria Aceleração (6 meses · D0=2026-06-17) ── */
  { id: 'cm-001', clientId: 'camila_masera', title: 'Diagnóstico + Benchmark',                                      type: 'plan_estrategico', status: 'doing', priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-06-19', createdAt: '2026-06-17', description: 'Levantamento completo do negócio, concorrência e benchmark de mercado.' },
  { id: 'cm-002', clientId: 'camila_masera', title: 'Auditoria + Config. de Contas (Gerenciador + GTM)',            type: 'auditoria',        status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-06-24', createdAt: '2026-06-17', description: 'Auditoria do Gerenciador de Negócios, GTM e configuração de contas.' },
  { id: 'cm-003', clientId: 'camila_masera', title: 'Traqueamento de Eventos e Conversões',                         type: 'config_pixel',     status: 'todo',  priority: 'high',   level: 'interno', assignee: 'ana_sm', dueDate: '2026-06-24', createdAt: '2026-06-17', description: 'Instalação e validação de todos os eventos de conversão no Meta e Google.' },
  { id: 'cm-004', clientId: 'camila_masera', title: 'Criar/Atualizar Google Meu Negócio',                           type: 'atualizar_gmn',    status: 'todo',  priority: 'medium', level: 'externo', assignee: 'ana_sm', dueDate: '2026-06-24', createdAt: '2026-06-17', description: 'Otimização completa do perfil do Google Meu Negócio.' },
  { id: 'cm-005', clientId: 'camila_masera', title: 'Organização do perfil (Instagram)',                             type: 'org_perfil',       status: 'todo',  priority: 'medium', level: 'externo', assignee: 'ana_sm', dueDate: '2026-06-24', createdAt: '2026-06-17', description: 'Bio, destaques, feed e identidade visual do Instagram.' },
  { id: 'cm-006', clientId: 'camila_masera', title: 'Edição de vídeos + Criação de artes para anúncios',            type: 'edicao_video',     status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-06-27', createdAt: '2026-06-17', description: 'Produção de criativos estáticos e vídeos para as primeiras campanhas.' },
  { id: 'cm-007', clientId: 'camila_masera', title: 'B — Campanhas de Fast Traffic',                                type: 'criar_campanha',   status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-01', createdAt: '2026-06-17', description: 'Campanhas de tráfego rápido para iniciar geração de demanda imediata.' },
  { id: 'cm-008', clientId: 'camila_masera', title: 'A — Campanhas de teste (Público, Criativos, Canais)',          type: 'criar_campanha',   status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-01', createdAt: '2026-06-17', description: 'Fase de testes: validação de públicos, criativos e copies.' },
  { id: 'cm-009', clientId: 'camila_masera', title: 'Dashboard básico de performance de criativos',                 type: 'relatorio_perf',   status: 'todo',  priority: 'medium', level: 'interno', assignee: 'ana_sm', dueDate: '2026-07-07', createdAt: '2026-06-17', description: 'Dashboard inicial para acompanhar performance de criativos por criativo.' },
  { id: 'cm-010', clientId: 'camila_masera', title: 'CRM Básico — Implementação + Treinamento',                     type: 'setup_conta',      status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-17', createdAt: '2026-06-17', description: 'Implantação do CRM e treinamento do time para gestão de leads e follow-up.' },
  { id: 'cm-011', clientId: 'camila_masera', title: 'Automação de entrada de leads + integração WhatsApp API',      type: 'roteiro',          status: 'todo',  priority: 'high',   level: 'interno', assignee: 'ana_sm', dueDate: '2026-07-22', createdAt: '2026-06-17', description: 'Fluxo automático de entrada de leads no funil com integração WhatsApp.' },
  { id: 'cm-012', clientId: 'camila_masera', title: 'Estruturar rotina comercial (cadência, follow-up, abordagem)', type: 'plan_estrategico', status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-22', createdAt: '2026-06-17', description: 'Definição de cadência, follow-up, abordagem e rotina do time comercial.' },
  { id: 'cm-013', clientId: 'camila_masera', title: 'Script de abordagem e follow-up para leads',                   type: 'criacao_copy',     status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-24', createdAt: '2026-06-17', description: 'Scripts prontos de abordagem inicial e cadência de follow-up.' },
  { id: 'cm-014', clientId: 'camila_masera', title: 'Treinamento comercial — abordagem, cadência e conversão',      type: 'treinamento',      status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-27', createdAt: '2026-06-17', description: 'Treinamento prático do time de vendas em abordagem, cadência e conversão de leads.' },
  { id: 'cm-015', clientId: 'camila_masera', title: 'Landing Page (Design, Textos, Web e Rastreamentos)',            type: 'design_lp',        status: 'todo',  priority: 'high',   level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-22', createdAt: '2026-06-17', description: 'LP completa: design Figma → aprovação → desenvolvimento web → rastreamentos.' },
  { id: 'cm-016', clientId: 'camila_masera', title: 'D — Campanhas de Remarketing',                                 type: 'criar_campanha',   status: 'todo',  priority: 'medium', level: 'externo', assignee: 'ana_sm', dueDate: '2026-08-06', createdAt: '2026-06-17', description: 'Remarketing para leads e visitantes que não converteram — ativa após LP no ar.' },
  { id: 'cm-017', clientId: 'camila_masera', title: 'Dashboard — Looker Studio',                                    type: 'relatorio_perf',   status: 'todo',  priority: 'medium', level: 'interno', assignee: 'ana_sm', dueDate: '2026-08-16', createdAt: '2026-06-17', description: 'Dashboard completo no Looker Studio com métricas de tráfego, leads e vendas.' },
  { id: 'cm-018', clientId: 'camila_masera', title: 'Desenvolvimento de agente de I.A pré-vendas',                  type: 'setup_conta',      status: 'todo',  priority: 'medium', level: 'externo', assignee: 'ana_sm', dueDate: '2026-08-31', createdAt: '2026-06-17', description: 'Agente de IA para qualificação automática e atendimento no pré-vendas.' },
  { id: 'cm-019', clientId: 'camila_masera', title: 'Reunião de acompanhamento — quinzenal',                         type: 'reuniao',          status: 'todo',  priority: 'medium', level: 'externo', assignee: 'ana_sm', dueDate: '2026-07-02', createdAt: '2026-06-17', description: 'Primeira reunião quinzenal de acompanhamento do projeto (D15).' },
  { id: 'cm-020', clientId: 'camila_masera', title: 'B.I — relatório de performance mensal',                        type: 'relatorio_perf',   status: 'todo',  priority: 'medium', level: 'interno', assignee: 'ana_sm', dueDate: '2026-07-17', createdAt: '2026-06-17', description: 'Relatório mensal de performance: leads, CAC, CPL, conversão.' },
  { id: 'cm-021', clientId: 'camila_masera', title: 'Novo planejamento próximo semestre',                            type: 'plan_estrategico', status: 'todo',  priority: 'medium', level: 'externo', assignee: 'ana_sm', dueDate: '2026-11-14', createdAt: '2026-06-17', description: 'Avaliação do ROI dos 6 meses e planejamento estratégico para o próximo ciclo.' },

  /* ── D'Sorrir Odontologia — Destrava Digital ─── */
  { id: 'ds-001', clientId: 'dsorrir', title: 'Criação de criativos e artes para anúncios', type: 'criativo', status: 'done', priority: 'high', level: 'externo', assignee: 'gs', createdAt: '2026-05-01', updatedAt: '2026-06-05' },
  { id: 'ds-002', clientId: 'dsorrir', title: 'Organização do perfil Instagram e Facebook', type: 'criativo', status: 'done', priority: 'high', level: 'externo', assignee: 'gs', createdAt: '2026-05-01', updatedAt: '2026-06-05' },
  { id: 'ds-003', clientId: 'dsorrir', title: 'Copy dos anúncios e textos de campanha',    type: 'criativo', status: 'done', priority: 'high', level: 'externo', assignee: 'gs', createdAt: '2026-05-01', updatedAt: '2026-06-05' },
  { id: 'ds-004', clientId: 'dsorrir', title: 'Campanha de tráfego ativa e configurada',   type: 'campanha', status: 'done', priority: 'high', level: 'externo', assignee: 'gs', createdAt: '2026-05-08', updatedAt: '2026-06-07' },
]

/* ── Reuniões no Google Agenda ──────────────────── */

// Gera instâncias recorrentes até 31/12/2026
const _mtg = (() => {
  let _id = 10
  return (clientId, title, time, start, intervalDays, attendees, duration) => {
    const out = []
    let d = new Date(start + 'T12:00:00')
    const end = new Date('2026-12-31T12:00:00')
    while (d <= end) {
      out.push({
        id: _id++, clientId, title,
        date: d.toISOString().split('T')[0],
        time, duration: duration || 60,
        attendees: attendees || ['gs'],
        type: 'monthly_review', link: '',
      })
      d = new Date(d.getTime() + intervalDays * 864e5)
    }
    return out
  }
})()

export const meetings = [
  // ── Reunião única ───────────────────────────────
  { id: 1, clientId: 'cooperja', title: 'Reunião mensal Cooperja', date: '2026-06-02', time: '10:00', duration: 60, attendees: ['gs'], type: 'monthly_review', link: '' },

  // ── Quinzenais (15 dias) ────────────────────────
  ..._mtg('quadros',        'Reunião quinzenal — Quadros Paisagismo',  '09:00', '2026-06-23', 15, ['tochiro']),
  ..._mtg('sitio_girabas',  'Reunião quinzenal — Sítio Girabas',       '09:30', '2026-06-19', 15, ['tochiro']),
  ..._mtg('andressa_adv',   'Reunião quinzenal — Andressa',            '16:00', '2026-06-15', 15, ['ana_sm']),
  ..._mtg('mayara_campos',  'Reunião quinzenal — Mayara Campos',       '16:00', '2026-06-16', 15, ['ana_sm']),
  ..._mtg('intime',         'Reunião quinzenal — Intime',              '08:30', '2026-06-19', 15, ['tochiro']),
  ..._mtg('lenergy',        'Reunião quinzenal — Lenergy',             '11:00', '2026-06-16', 15, ['gs']),
  ..._mtg('casa_construtor','Reunião quinzenal — Casa do Construtor',  '08:15', '2026-06-19', 15, ['gs']),
  ..._mtg('heirs',          'Reunião quinzenal — Heirs do Brasil',     '11:00', '2026-06-23', 15, ['tochiro']),

  // ── Mensais / 30 dias ───────────────────────────
  ..._mtg('ararastur',      'Reunião mensal — Ararastur',              '17:00', '2026-06-18', 30, ['gs']),
  ..._mtg('rizzotto',       'Reunião mensal — Rizzotto',               '17:00', '2026-06-17', 30, ['gs']),
  ..._mtg('kamy',           'Reunião mensal — Kamy',                   '09:00', '2026-06-30', 30, ['tochiro']),
  ..._mtg('milfer',         'Reunião mensal — Milfer',                 '09:00', '2026-06-18', 30, ['gs']),

  // ── Semanal (7 dias) ────────────────────────────
  ..._mtg('carol_adv',      'Reunião semanal — Carol Adv',             '17:00', '2026-06-18',  7, ['ana_sm']),

  // ── 21 dias ─────────────────────────────────────
  ..._mtg('loja_ambiente',  'Reunião — Loja Ambiente',                 '11:00', '2026-06-25', 21, ['gs']),

  // ── Mensal — pauta semeada (ver SEED_PAUTAS em WorkspaceDetail) ──
  { id: 'nosso_studio_jun2026', clientId: 'nosso_studio', title: 'Reunião — Fechamento Junho | Nosso Studio', date: '2026-06-23', time: '10:00', duration: 60, attendees: ['gs'], type: 'monthly_review', link: '' },

  ..._mtg('camila_masera', 'Reunião quinzenal — Camila Masera Adv', '09:00', '2026-07-02', 15, ['ana_sm']),

  // ── Sem agendamento definido (a combinar) ───────
  // polizio, fonseca_gonc (FGLaw),
  // cacarola, kinto, pit_floripa, gabriel_piva (Piva), nueva
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
  captacao:  { label: 'Captação Presencial', icon: '🎥', color: '#f59e0b' },
  comercial: { label: 'Estrutura Comercial', icon: '🤝', color: '#f59e0b' },
  dashboard: { label: 'Dashboard',    icon: '📊', color: '#38bdf8' },
  crm:       { label: 'CRM',          icon: '🗂️', color: '#a78bfa' },
}

/* ── Personas por cliente ───────────────────────── */
export const clientPersonas = {
  nueva: [
    {
      id:          'arquitetos',
      name:        'Arquitetos Parceiros',
      icon:        '🏛️',
      color:       '#6366f1',
      description: 'Profissionais de arquitetura e design de interiores que indicam o NUEVA ou integram parcerias estratégicas com os nucleados.',
      desires:     'Ampliar portfólio com fornecedores de qualidade, fortalecer autoridade no mercado e criar novas fontes de renda por indicação.',
      pain:        'Dificuldade em encontrar parceiros confiáveis que agreguem valor ao seu trabalho e aos clientes finais.',
      tone:        'Técnico · Autoridade · Referência',
      tags:        ['B2B', 'Indicação', 'Parceria estratégica'],
    },
    {
      id:          'consumidor',
      name:        'Consumidor Final',
      icon:        '🏠',
      color:       '#f59e0b',
      description: 'Famílias e indivíduos que estão reformando, construindo ou decorando e buscam empresas confiáveis para realizar seu projeto.',
      desires:     'Realizar o sonho da casa idealizada com segurança, qualidade e sem dores de cabeça na contratação de fornecedores.',
      pain:        'Medo de contratar empresas desconhecidas, receio de prejuízo e dificuldade em encontrar profissionais que entreguem o que prometem.',
      tone:        'Inspiracional · Confiança · Emoção',
      tags:        ['B2C', 'Sonho', 'Decisão emocional'],
    },
    {
      id:          'nucleados',
      name:        'Novos Nucleados',
      icon:        '🤝',
      color:       '#10b981',
      description: 'Empresas do setor de construção, arquitetura e decoração que querem integrar o ecossistema NUEVA como membros do núcleo.',
      desires:     'Crescer junto com outros negócios complementares, ampliar a rede de contatos e se destacar no mercado local com apoio coletivo.',
      pain:        'Isolamento competitivo, dificuldade em gerar indicações e falta de visibilidade fora do ciclo de clientes atual.',
      tone:        'Comunidade · Crescimento · Parceria',
      tags:        ['B2B', 'Ecossistema', 'Indicação mútua'],
    },
  ],
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

  /* ── Camila Masera — Aceleração 6 meses (Jun–Dez 2026) ──── */
  { id: 201, clientId: 'camila_masera', date: '2026-06-17', type: 'kickoff',   title: '🚀 Kickoff — Início do Aceleração',                      description: 'Início da jornada de 6 meses — objetivo: projeto se pagar e dar lucro dentro do semestre.' },
  { id: 202, clientId: 'camila_masera', date: '2026-06-19', type: 'revisao',   title: '📋 Diagnóstico + Benchmark',                             description: 'Levantamento do negócio, público-alvo e análise de concorrência.' },
  { id: 203, clientId: 'camila_masera', date: '2026-06-24', type: 'setup',     title: '⚙️ Auditoria + Config. Contas + Rastreamentos',           description: 'Gerenciador de negócios, GTM, pixels e eventos de conversão configurados.' },
  { id: 204, clientId: 'camila_masera', date: '2026-07-01', type: 'campanha',  title: '📢 Campanhas Fast Traffic + Teste no ar',                 description: 'Primeiras campanhas ativas — início da geração de demanda.' },
  { id: 205, clientId: 'camila_masera', date: '2026-07-07', type: 'criativo',  title: '📊 Dashboard de Criativos entregue',                     description: 'Dashboard básico de performance por criativo para otimização das campanhas.' },
  { id: 206, clientId: 'camila_masera', date: '2026-07-17', type: 'automacao', title: '🤖 CRM + Automação de entrada de leads',                  description: 'CRM implantado, time treinado e funil de entrada de leads automatizado.' },
  { id: 207, clientId: 'camila_masera', date: '2026-07-27', type: 'revisao',   title: '💼 Treinamento Comercial concluído',                     description: 'Rotina comercial estruturada, script de abordagem e treinamento de conversão entregues.' },
  { id: 208, clientId: 'camila_masera', date: '2026-08-01', type: 'lp',        title: '🖥️ Landing Page publicada',                              description: 'LP no ar com design, textos, desenvolvimento web e rastreamentos configurados.' },
  { id: 209, clientId: 'camila_masera', date: '2026-08-06', type: 'campanha',  title: '📢 Remarketing ativo',                                   description: 'Campanhas de remarketing para leads que visitaram a LP e não converteram.' },
  { id: 210, clientId: 'camila_masera', date: '2026-08-16', type: 'setup',     title: '📊 Dashboard Looker Studio entregue',                    description: 'Dashboard completo com métricas de tráfego, leads, CAC, CPL e vendas.' },
  { id: 211, clientId: 'camila_masera', date: '2026-08-31', type: 'automacao', title: '🤖 Agente de I.A pré-vendas entregue',                   description: 'Agente de IA qualificando leads automaticamente no pré-vendas.' },
  { id: 212, clientId: 'camila_masera', date: '2026-11-14', type: 'revisao',   title: '📅 Planejamento próximo semestre',                        description: 'Avaliação do ROI dos 6 meses e planejamento do próximo ciclo.' },

  /* ── Casa do Construtor: Mês 1 (Mar–Abr 2026) ──── */
  /* ── D'Sorrir Odontologia — Destrava Digital ─── */
  { id: 301, clientId: 'dsorrir', date: '2026-05-01', type: 'kickoff',  title: '🚀 Kickoff D\'Sorrir',                          description: 'Início da consultoria Destrava Digital — alinhamento estratégico e planejamento.' },
  { id: 302, clientId: 'dsorrir', date: '2026-05-08', type: 'criativo', title: '✅ Criativos e artes entregues',                 description: 'Produção de criativos, artes e copy para campanhas de tráfego pago — concluído.' },
  { id: 303, clientId: 'dsorrir', date: '2026-05-08', type: 'criativo', title: '✅ Perfil Instagram e Facebook organizados',     description: 'Feed, bio, destaques e identidade visual estruturados — concluído.' },
  { id: 304, clientId: 'dsorrir', date: '2026-05-15', type: 'campanha', title: '✅ Campanha de tráfego no ar',                   description: 'Campanha ativa no Meta Ads com público, criativos e rastreamento configurados — concluído.' },
  { id: 305, clientId: 'dsorrir', date: '2026-06-07', type: 'revisao',  title: '📋 Apresentação Destrava Digital',              description: 'Consultoria de onboarding realizada — glossário, CPL limite calculado e missões entregues.' },
  { id: 306, clientId: 'dsorrir', date: '2026-06-22', type: 'revisao',  title: '📅 Call de encerramento — 15 dias',             description: 'Balanço da quinzena e próximos passos — agendado.' },

  { id: 201, clientId: 'casa_construtor', date: '2026-03-20', type: 'criativo', title: '🎬 Vídeos Humanizados',      description: 'Produção de vídeos com humanização de marca para campanhas Meta Ads nas 4 lojas.' },
  { id: 202, clientId: 'casa_construtor', date: '2026-04-05', type: 'lp',       title: '✅ Nova Landing Page',        description: 'Criação e publicação de LP otimizada para conversão com rastreamento configurado.' },
  { id: 203, clientId: 'casa_construtor', date: '2026-04-10', type: 'meta',     title: '📈 Conv. 12,41%→16,26%',     description: 'Taxa de conversão da LP aumentou 31% após otimizações de copy e layout.' },
  { id: 204, clientId: 'casa_construtor', date: '2026-04-15', type: 'meta',     title: '🏆 CPL R$28→R$20,73',        description: 'Custo por lead caiu 26,6% — resultado da nova LP e otimização de campanhas.' },
]
