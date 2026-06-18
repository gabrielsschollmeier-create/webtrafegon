/* ── Roles ──────────────────────────────────────────────── */
export const ROLE_CONFIG = {
  admin:        { label: 'Administrador', tier: 1, color: '#6eda2c', icon: '🔑', short: 'Admin' },
  gerente:      { label: 'Gerente',       tier: 2, color: '#60a5fa', icon: '👔', short: 'Gerente' },
  colaborador:  { label: 'Colaborador',   tier: 3, color: '#be29ec', icon: '👤', short: 'Colab' },
  visualizador: { label: 'Visualizador',  tier: 4, color: '#8890b5', icon: '👁',  short: 'View' },
  cliente:      { label: 'Portal Cliente',tier: 5, color: '#ea8a29', icon: '🏢', short: 'Portal' },
}

export const TEAM_ROLES = ['admin', 'gerente', 'colaborador', 'visualizador', 'Social Media']

/* ── Permissions matrix ─────────────────────────────────── */
export const PERMISSIONS = {
  admin: {
    crm: 'full', erp: 'full', relatorios: 'full',
    financeiro: 'full', configuracoes: 'full', usuarios: 'full',
  },
  gerente: {
    crm: 'full', erp: 'full', relatorios: 'full',
    financeiro: 'view', configuracoes: 'none', usuarios: 'none',
  },
  colaborador: {
    crm: 'full', erp: 'full', relatorios: 'view',
    financeiro: 'none', configuracoes: 'none', usuarios: 'none',
  },
  visualizador: {
    crm: 'view', erp: 'view', relatorios: 'view',
    financeiro: 'none', configuracoes: 'none', usuarios: 'none',
  },
  cliente: {
    crm: 'none', erp: 'none', relatorios: 'none',
    financeiro: 'none', configuracoes: 'none', usuarios: 'none',
  },
}

export const PERM_MODULES = [
  { key: 'crm',           label: 'CRM (Pipeline, Leads, Contatos)' },
  { key: 'erp',           label: 'Operacional (Workspaces, Entregas)' },
  { key: 'relatorios',    label: 'Relatórios' },
  { key: 'financeiro',    label: 'Dados financeiros' },
  { key: 'configuracoes', label: 'Configurações & Integrações' },
  { key: 'usuarios',      label: 'Gestão de usuários' },
]

export const DEFAULT_PORTAL_MODULES = {
  indicadores: true,
  entregaveis: true,
  reunioes:    true,
  timeline:    true,
  crm:         true,
}

export const PORTAL_MODULE_LABELS = {
  indicadores: { label: 'Indicadores',    icon: '📊' },
  entregaveis: { label: 'Entregáveis',    icon: '📦' },
  reunioes:    { label: 'Reuniões',       icon: '📅' },
  timeline:    { label: 'Linha do Tempo', icon: '📈' },
  crm:         { label: 'CRM',            icon: '🎯' },
}

export const TEAM_MODULE_LABELS = {
  crm:           { label: 'CRM',               icon: '📊' },
  erp:           { label: 'Operacional',        icon: '⚙️' },
  relatorios:    { label: 'Relatórios',         icon: '📈' },
  financeiro:    { label: 'Financeiro',         icon: '💰' },
  configuracoes: { label: 'Configurações',      icon: '🔧' },
  usuarios:      { label: 'Usuários',           icon: '👥' },
}

export const AVATAR_COLORS = [
  '#6eda2c', '#60a5fa', '#be29ec', '#ea8a29',
  '#ef4444', '#22d3ee', '#f59e0b', '#ec4899',
  '#34d399', '#a78bfa',
]

/* ── Default data ───────────────────────────────────────── */
const MOD_OPERACAO = {
  '/home': false, '/': false, '/pipeline': false, '/contatos': false, '/conversas': false,
  '/calendario': false, '/relatorios': false,
  '/erp': true, '/projetos': true, '/workspaces': true, '/entregas': true,
  '/equipe': true, '/playbooks': true, '/whatsapp': true,
   '/educacao': true, '/parceiros': true, '/noticias': true,
}

const MOD_VENDAS = {
  '/home': true, '/': true, '/pipeline': true, '/contatos': true, '/conversas': true,
  '/calendario': true, '/relatorios': true,
  '/erp': false, '/projetos': false, '/workspaces': false, '/entregas': false,
  '/equipe': false, '/playbooks': false, '/whatsapp': false,
   '/educacao': true, '/parceiros': true, '/noticias': true,
}

// Designer — foco em entregas criativas
const MOD_DESIGNER = {
  '/home': true,  '/': false, '/pipeline': false, '/contatos': false, '/conversas': false,
  '/calendario': true, '/relatorios': false,
  '/erp': true, '/projetos': false, '/workspaces': true, '/entregas': true,
  '/equipe': true, '/playbooks': true, '/whatsapp': false, '/agenda': true,
   '/educacao': true, '/parceiros': false, '/noticias': true,
}

// Gestor de Dados — acesso a relatórios e dashboards
const MOD_DADOS = {
  '/home': true, '/': true, '/pipeline': false, '/contatos': false, '/conversas': false,
  '/calendario': true, '/relatorios': true,
  '/erp': true, '/projetos': false, '/workspaces': true, '/entregas': true,
  '/equipe': true, '/playbooks': true, '/whatsapp': false, '/agenda': true,
   '/educacao': true, '/parceiros': false, '/noticias': true,
}

// Web Designer — foco em entregas e projetos web
const MOD_WEBDESIGNER = {
  '/home': true, '/': false, '/pipeline': false, '/contatos': false, '/conversas': false,
  '/calendario': true, '/relatorios': false,
  '/erp': true, '/projetos': true, '/workspaces': true, '/entregas': true,
  '/equipe': true, '/playbooks': true, '/whatsapp': false, '/agenda': true,
   '/educacao': true, '/parceiros': false, '/noticias': true,
}

// Acesso básico MVP: Dashboard Operacional, Tarefas, Workspaces, Projetos, Arena, Equipe
const MOD_BASICO = {
  '/home': false, '/': false, '/pipeline': false, '/contatos': false, '/conversas': false,
  '/calendario': false, '/relatorios': false,
  '/erp': true, '/projetos': true, '/workspaces': true, '/entregas': true,
  '/equipe': true, '/playbooks': false, '/whatsapp': false, '/agenda': false,
   '/educacao': false, '/parceiros': false, '/noticias': true,
  '/arena': true, '/conhecimento': false,
}

// Emails com acesso básico — usado em Arena e Equipe para ocultar seções avançadas
export const RESTRICTED_EMAILS = new Set([
  'gestaotrafegon@gmail.com',
  'socialmediatrafegon@gmail.com',         // Beatriz
  'socialmediaclientestrafegon@gmail.com', // Ana
  'socialmediatrafegonjuridico@gmail.com', // Mariana
  'designertrafegon@gmail.com',            // Geovana
  'elieserpeper@gmail.com',                // Elieser
  'contato@tudoinforj.com.br',             // Deivisson
  'atendimentotrafegon@gmail.com',         // Érica
])

// Mapa email → overrides (usado no buildProfile do App.jsx para Supabase users)
export const EMAIL_MODULE_OVERRIDES = {
  'designertrafegon@gmail.com':              MOD_BASICO, // Geovana
  'elieserpeper@gmail.com':                  MOD_BASICO, // Elieser
  'contato@tudoinforj.com.br':               MOD_BASICO, // Deivisson
  'atendimentotrafegon@gmail.com':           MOD_BASICO, // Érica
  'gestaotrafegon@gmail.com':                MOD_BASICO,
  'socialmediatrafegon@gmail.com':           MOD_BASICO, // Beatriz
  'socialmediaclientestrafegon@gmail.com':   MOD_BASICO, // Ana
  'socialmediatrafegonjuridico@gmail.com':   MOD_BASICO, // Mariana
  'trafegonvendas@gmail.com':                MOD_VENDAS,
}

const INITIAL_TEAM = [
  { id: 'gs',      name: 'Gabriel S.', email: 'gabrielsschollmeier@gmail.com', password: 'Trafegon@2026', role: 'admin',       avatar: 'GS', color: '#6eda2c', createdAt: '2026-01-01' },
  { id: 'carol',   name: 'Carol',      email: 'carolinepaganiadv@gmail.com',   password: 'trafegon',      role: 'admin',       avatar: 'CA', color: '#be29ec', createdAt: '2026-05-23' },
  { id: 'tochiro', name: 'Tochiro',    email: 'gestaotrafegon@gmail.com',      password: 'trafegon',      role: 'colaborador', avatar: 'TO', color: '#22d3ee', createdAt: '2026-05-23', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'ana_sm',  name: 'Ana',        email: 'socialmediaclientestrafegon@gmail.com', password: 'trafegon', role: 'colaborador', avatar: 'AN', color: '#ec4899', createdAt: '2026-05-23', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'adm_at',  name: 'Érica',       email: 'atendimentotrafegon@gmail.com', password: 'trafegon',      role: 'colaborador', avatar: 'ER', color: '#f59e0b', createdAt: '2026-05-23', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'juliano',  name: 'Juliano',  email: 'trafegonvendas@gmail.com',       password: 'trafegon',       role: 'colaborador', avatar: 'JU', color: '#a78bfa', createdAt: '2026-05-23', group: 'vendas',     moduleOverrides: MOD_VENDAS      },
  { id: 'geovana',  name: 'Geovana',  email: 'designertrafegon@gmail.com',    password: '654321',        role: 'colaborador', avatar: 'GE', color: '#f59e0b', createdAt: '2026-05-30', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'elieser',  name: 'Elieser',  email: 'elieserpeper@gmail.com',        password: 'Trafegon@2026', role: 'colaborador', avatar: 'EL', color: '#ea8a29', createdAt: '2026-05-30', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'deivisson',name: 'Deivisson',email: 'contato@tudoinforj.com.br',     password: 'Trafegon@2026', role: 'colaborador', avatar: 'DE', color: '#818cf8', createdAt: '2026-05-30', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'beatriz',  name: 'Beatriz',  email: 'socialmediatrafegon@gmail.com',          password: 'trafegon', role: 'colaborador', avatar: 'BZ', color: '#f97316', createdAt: '2026-05-30', group: 'basico', moduleOverrides: MOD_BASICO },
  { id: 'mariana',  name: 'Mariana',  email: 'socialmediatrafegonjuridico@gmail.com', password: '123456',   role: 'colaborador', avatar: 'MA', color: '#14b8a6', createdAt: '2026-06-15', group: 'basico', moduleOverrides: MOD_BASICO },
]

const INITIAL_CLIENTS = [
  { id: 'cooperja_c',  name: 'Cooperja',         email: 'cooperja@cliente.com',  password: '123456', role: 'cliente', clientId: 'cooperja',  avatar: 'CJ', color: '#6eda2c', createdAt: '2026-01-10', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'rizzotto_c',  name: 'Posto Rizzotto',    email: 'rizzotto@cliente.com',  password: '123456', role: 'cliente', clientId: 'rizzotto',  avatar: 'PR', color: '#60a5fa', createdAt: '2026-02-05', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'kamy_c',      name: 'Kamy',              email: 'kamy@cliente.com',      password: '123456', role: 'cliente', clientId: 'kamy',      avatar: 'KM', color: '#be29ec', createdAt: '2026-01-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'ararastur_c', name: 'Ararastur',          email: 'ararastur@cliente.com', password: '123456', role: 'cliente', clientId: 'ararastur', avatar: 'AR', color: '#ea8a29', createdAt: '2025-11-15', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'cacarola_c',  name: 'Caçarola',           email: 'cacarola@cliente.com',  password: '123456', role: 'cliente', clientId: 'cacarola',  avatar: 'CA', color: '#f87171', createdAt: '2025-12-01', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'intime_c',    name: 'Intime Sistemas',    email: 'intime@cliente.com',    password: '123456', role: 'cliente', clientId: 'intime',    avatar: 'IT', color: '#a78bfa', createdAt: '2025-10-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'polizio_c',        name: 'Polizio Advogados',         email: 'polizio@cliente.com',        password: '123456', role: 'cliente', clientId: 'polizio',        avatar: 'PA', color: '#34d399', createdAt: '2025-09-01', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'andressa_adv_c',   name: 'Andressa Advogada',          email: 'andressa@cliente.com',       password: '123456', role: 'cliente', clientId: 'andressa_adv',   avatar: 'AA', color: '#c084fc', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'cooperja_lojas_c', name: 'Cooperja Lojas',              email: 'cooperjalojas@cliente.com',  password: '123456', role: 'cliente', clientId: 'cooperja_lojas', avatar: 'CL', color: '#86efac', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'fonseca_gonc_c',   name: 'Fonseca e Gonçalves Adv',    email: 'fonseca@cliente.com',        password: '123456', role: 'cliente', clientId: 'fonseca_gonc',   avatar: 'FG', color: '#67e8f9', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'lenergy_c',        name: 'Lenergy',                    email: 'lenergy@cliente.com',        password: '123456', role: 'cliente', clientId: 'lenergy',        avatar: 'LN', color: '#fde047', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'mayara_campos_c',  name: 'Mayara Campos Advogada',     email: 'mayara@cliente.com',         password: '123456', role: 'cliente', clientId: 'mayara_campos',  avatar: 'MC', color: '#f9a8d4', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'rca_adv_c',        name: 'RCA Advogados',              email: 'rca@cliente.com',            password: '123456', role: 'cliente', clientId: 'rca_adv',        avatar: 'RC', color: '#a5b4fc', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  // Destrava Digital
  { id: 'dsorrir_c',      name: "D'Sorrir Odontologia",       email: 'dsorrir@cliente.com',        password: '123456', role: 'cliente', clientId: 'dsorrir',        avatar: 'DS', color: '#14b8a6', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'luciana_vasco_c',name: 'Luciana Vasco',              email: 'luciana@cliente.com',        password: '123456', role: 'cliente', clientId: 'luciana_vasco',  avatar: 'LV', color: '#f472b6', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'plano_ideal_c',  name: 'Imob. Plano Ideal',          email: 'planoideal@cliente.com',     password: '123456', role: 'cliente', clientId: 'plano_ideal',    avatar: 'PI', color: '#0ea5e9', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'girassol_arq_c',     name: 'Girassol Arquitetura', email: 'girassol@cliente.com',          password: '123456', role: 'cliente', clientId: 'girassol_arq',     avatar: 'GA', color: '#f59e0b', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'maria_elisabeth_c',  name: 'Maria Elisabeth',      email: 'mariaelisabeth@cliente.com',    password: '123456', role: 'cliente', clientId: 'maria_elisabeth',  avatar: 'ME', color: '#8b5cf6', createdAt: '2026-06-09', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'patricia_ramos_c',   name: 'Patrícia Ramos Advogada', email: 'patricia@cliente.com',       password: '123456', role: 'cliente', clientId: 'patricia_ramos',   avatar: 'PR', color: '#6366f1', createdAt: '2026-06-15', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  // Demais clientes
  { id: 'cooperja_rh_c',  name: 'Cooperja RH',                email: 'cooperjarh@cliente.com',     password: '123456', role: 'cliente', clientId: 'cooperja_rh',    avatar: 'CR', color: '#a3e635', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'kinto_c',        name: 'Kinto Escola',               email: 'kinto@cliente.com',          password: '123456', role: 'cliente', clientId: 'kinto',          avatar: 'KI', color: '#f59e0b', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'carol_adv_c',    name: 'Caroline Pagani Adv',        email: 'caroladv@cliente.com',       password: '123456', role: 'cliente', clientId: 'carol_adv',      avatar: 'CP', color: '#f43f5e', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'pit_floripa_c',  name: 'Pit Floripa',                email: 'pit@cliente.com',            password: '123456', role: 'cliente', clientId: 'pit_floripa',    avatar: 'PF', color: '#fb923c', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'sitio_girabas_c',name: 'Sítio Girabas',             email: 'girabas@cliente.com',        password: '123456', role: 'cliente', clientId: 'sitio_girabas',  avatar: 'SG', color: '#4ade80', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'gabriel_piva_c', name: 'Da Rós e Piva Adv',         email: 'gabrielpiva@cliente.com',    password: '123456', role: 'cliente', clientId: 'gabriel_piva',   avatar: 'GP', color: '#818cf8', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'quadros_c',      name: 'Quadros Paisagismo',         email: 'quadros@cliente.com',        password: '123456', role: 'cliente', clientId: 'quadros',        avatar: 'QP', color: '#2dd4bf', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'milfer_c',       name: 'Milfer',                     email: 'milfer@cliente.com',         password: '123456', role: 'cliente', clientId: 'milfer',         avatar: 'ML', color: '#64748b', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'nueva_c',        name: 'Nucleo Nueva',               email: 'nueva@cliente.com',          password: '123456', role: 'cliente', clientId: 'nueva',          avatar: 'NN', color: '#7c3aed', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'heirs_c',        name: 'Heirs do Brasil',            email: 'heirs@cliente.com',          password: '123456', role: 'cliente', clientId: 'heirs',          avatar: 'HB', color: '#dc2626', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'loja_ambiente_c',name: 'Loja Ambiente',              email: 'lojaambiente@cliente.com',   password: '123456', role: 'cliente', clientId: 'loja_ambiente',  avatar: 'LA', color: '#059669', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'casa_const_c',   name: 'Casa do Construtor',         email: 'casaconstrutor@cliente.com', password: '123456', role: 'cliente', clientId: 'casa_construtor',avatar: 'CC', color: '#d97706', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'nosso_studio_c', name: 'Nosso Studio',               email: 'nossostudio@cliente.com',    password: '123456', role: 'cliente', clientId: 'nosso_studio',   avatar: 'NS', color: '#ec4899', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'camila_mas_c',   name: 'Camila Masera Adv',          email: 'camilamasera@cliente.com',   password: '123456', role: 'cliente', clientId: 'camila_masera',  avatar: 'CM', color: '#0891b2', createdAt: '2026-06-07', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
]

const STORAGE_KEY    = 'trafegon_users_v2'
const SCHEMA_VERSION = 13  // incrementar aqui sempre que INITIAL_TEAM ou INITIAL_CLIENTS mudar

function migrate(stored) {
  const storedVersion = stored._version || 1
  const deletedIds    = new Set(stored.deleted || [])

  if (storedVersion < SCHEMA_VERSION) {
    // Force-sync: membros do INITIAL_TEAM sempre presentes e atualizados.
    // Preserva dados customizados pelo admin (ex: senha alterada), mas aplica
    // os defaults mais recentes do código por cima.
    const existingById  = Object.fromEntries((stored.team || []).map(u => [u.id, u]))
    const coreTeam      = INITIAL_TEAM.map(u => ({ ...existingById[u.id] || {}, ...u }))
    const coreIds       = new Set(INITIAL_TEAM.map(u => u.id))
    const extraTeam     = (stored.team || []).filter(u => !coreIds.has(u.id) && !deletedIds.has(u.id))

    const existingClientById = Object.fromEntries((stored.clients || []).map(u => [u.id, u]))
    const coreClients   = INITIAL_CLIENTS.map(u => ({ ...existingClientById[u.id] || {}, ...u }))
    const coreClientIds = new Set(INITIAL_CLIENTS.map(u => u.id))
    const extraClients  = (stored.clients || []).filter(u => !coreClientIds.has(u.id) && !deletedIds.has(u.id))

    return {
      team:     [...coreTeam,    ...extraTeam],
      clients:  [...coreClients, ...extraClients],
      deleted:  stored.deleted || [],
      _version: SCHEMA_VERSION,
    }
  }

  // Mesma versão: só adiciona membros novos que ainda não existem
  const existingTeamIds   = new Set((stored.team    || []).map(u => u.id))
  const existingClientIds = new Set((stored.clients || []).map(u => u.id))
  const newTeam    = INITIAL_TEAM.filter(u    => !existingTeamIds.has(u.id)   && !deletedIds.has(u.id))
  const newClients = INITIAL_CLIENTS.filter(u => !existingClientIds.has(u.id) && !deletedIds.has(u.id))
  if (newTeam.length === 0 && newClients.length === 0) return stored
  return {
    team:     [...(stored.team    || []), ...newTeam],
    clients:  [...(stored.clients || []), ...newClients],
    deleted:  stored.deleted || [],
    _version: SCHEMA_VERSION,
  }
}

/* ── CRUD ───────────────────────────────────────────────── */
export function getUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed   = JSON.parse(stored)
      const migrated = migrate(parsed)
      if (migrated !== parsed) saveUsers(migrated)
      return migrated
    }
  } catch {}
  return { team: INITIAL_TEAM, clients: INITIAL_CLIENTS, _version: SCHEMA_VERSION }
}

export function saveUsers(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    window.dispatchEvent(new CustomEvent('trafegon:permissions-changed'))
  } catch {}
}

export function getAllUsers() {
  const { team, clients } = getUsers()
  const all = [...team, ...clients]
  // Garante que usuários do código-fonte sempre estão presentes (evita problema de cache antigo)
  const allIds = new Set(all.map(u => u.id))
  const missing = [...INITIAL_TEAM, ...INITIAL_CLIENTS].filter(u => !allIds.has(u.id))
  return [...all, ...missing]
}

export function makeAvatar(name) {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

export function addTeamMember(member) {
  const data = getUsers()
  data.team.push(member)
  saveUsers(data)
}

export function removeTeamMember(id) {
  try {
    const raw  = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : { team: INITIAL_TEAM, clients: INITIAL_CLIENTS }
    data.team    = (data.team    || []).filter(u => u.id !== id)
    data.deleted = [...(data.deleted || []), id]
    saveUsers(data)
  } catch {}
}

export function removeClient(id) {
  try {
    const raw  = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : { team: INITIAL_TEAM, clients: INITIAL_CLIENTS }
    data.clients = (data.clients || []).filter(u => u.id !== id)
    data.deleted = [...(data.deleted || []), id]
    saveUsers(data)
  } catch {}
}

export function updateUserPasswordLocal(id, newPassword) {
  try {
    const raw  = localStorage.getItem(STORAGE_KEY)
    const data = raw ? JSON.parse(raw) : { team: INITIAL_TEAM, clients: INITIAL_CLIENTS }
    const ti = (data.team || []).findIndex(u => u.id === id)
    if (ti >= 0) { data.team[ti] = { ...data.team[ti], password: newPassword }; saveUsers(data); return }
    const ci = (data.clients || []).findIndex(u => u.id === id)
    if (ci >= 0) { data.clients[ci] = { ...data.clients[ci], password: newPassword }; saveUsers(data) }
  } catch {}
}

/* ── Invites ─────────────────────────────────────────────── */
const INVITES_KEY = 'trafegon_invites'

function getInvites() {
  try { return JSON.parse(localStorage.getItem(INVITES_KEY) || '[]') } catch { return [] }
}
function saveInvites(invites) {
  try { localStorage.setItem(INVITES_KEY, JSON.stringify(invites)) } catch {}
}

export function createInvite(email, role, inviterName) {
  const token = Math.random().toString(36).slice(2, 9) + Math.random().toString(36).slice(2, 9)
  const invite = { token, email, role, inviterName, createdAt: new Date().toISOString(), used: false }
  const invites = getInvites()
  invites.push(invite)
  saveInvites(invites)
  return invite
}

export function getInviteByToken(token) {
  return getInvites().find(i => i.token === token && !i.used) || null
}

export function getPendingInvites() {
  return getInvites().filter(i => !i.used)
}

export function acceptInvite(token, name, password) {
  const invites = getInvites()
  const idx = invites.findIndex(i => i.token === token && !i.used)
  if (idx === -1) return null
  const invite = invites[idx]
  invites[idx] = { ...invite, used: true, usedAt: new Date().toISOString() }
  saveInvites(invites)
  const id = name.toLowerCase().replace(/\s+/g, '_') + '_' + Date.now()
  const color = AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)]
  const user = {
    id, name, email: invite.email, password, role: invite.role,
    avatar: makeAvatar(name), color, createdAt: new Date().toISOString(),
  }
  addTeamMember(user)
  return user
}

export function revokeInvite(token) {
  const invites = getInvites().filter(i => i.token !== token)
  saveInvites(invites)
}
