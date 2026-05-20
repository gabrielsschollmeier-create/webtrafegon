/* ── Roles ──────────────────────────────────────────────── */
export const ROLE_CONFIG = {
  admin:        { label: 'Administrador', tier: 1, color: '#6eda2c', icon: '🔑', short: 'Admin' },
  gerente:      { label: 'Gerente',       tier: 2, color: '#60a5fa', icon: '👔', short: 'Gerente' },
  colaborador:  { label: 'Colaborador',   tier: 3, color: '#be29ec', icon: '👤', short: 'Colab' },
  visualizador: { label: 'Visualizador',  tier: 4, color: '#8890b5', icon: '👁',  short: 'View' },
  cliente:      { label: 'Portal Cliente',tier: 5, color: '#ea8a29', icon: '🏢', short: 'Portal' },
}

export const TEAM_ROLES = ['admin', 'gerente', 'colaborador', 'visualizador']

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
}

export const PORTAL_MODULE_LABELS = {
  indicadores: { label: 'Indicadores',    icon: '📊' },
  entregaveis: { label: 'Entregáveis',    icon: '📦' },
  reunioes:    { label: 'Reuniões',       icon: '📅' },
  timeline:    { label: 'Linha do Tempo', icon: '📈' },
}

export const AVATAR_COLORS = [
  '#6eda2c', '#60a5fa', '#be29ec', '#ea8a29',
  '#ef4444', '#22d3ee', '#f59e0b', '#ec4899',
  '#34d399', '#a78bfa',
]

/* ── Default data ───────────────────────────────────────── */
const INITIAL_TEAM = [
  { id: 'gs', name: 'Gabriel S.',  email: 'gabrielsschollmeier@gmail.com', password: 'Trafegon@2026', role: 'admin', avatar: 'GS', color: '#6eda2c', createdAt: '2026-01-01' },
  { id: 'jc', name: 'João C.',     email: 'joao@trafegon.com.br',    password: '123456', role: 'colaborador', avatar: 'JC', color: '#be29ec', createdAt: '2026-01-05' },
  { id: 'am', name: 'Ana M.',      email: 'ana@trafegon.com.br',     password: '123456', role: 'colaborador', avatar: 'AM', color: '#ea8a29', createdAt: '2026-01-10' },
  { id: 'rf', name: 'Rafael F.',   email: 'rafael@trafegon.com.br',  password: '123456', role: 'colaborador', avatar: 'RF', color: '#60a5fa', createdAt: '2026-02-01' },
]

const INITIAL_CLIENTS = [
  { id: 'cooperja_c',  name: 'Cooperja',         email: 'cooperja@cliente.com',  password: '123456', role: 'cliente', clientId: 'cooperja',  avatar: 'CJ', color: '#6eda2c', createdAt: '2026-01-10', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'rizzotto_c',  name: 'Posto Rizzotto',    email: 'rizzotto@cliente.com',  password: '123456', role: 'cliente', clientId: 'rizzotto',  avatar: 'PR', color: '#60a5fa', createdAt: '2026-02-05', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'kamy_c',      name: 'Kamy',              email: 'kamy@cliente.com',      password: '123456', role: 'cliente', clientId: 'kamy',      avatar: 'KM', color: '#be29ec', createdAt: '2026-01-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'ararastur_c', name: 'Ararastur',          email: 'ararastur@cliente.com', password: '123456', role: 'cliente', clientId: 'ararastur', avatar: 'AR', color: '#ea8a29', createdAt: '2025-11-15', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'cacarola_c',  name: 'Caçarola',           email: 'cacarola@cliente.com',  password: '123456', role: 'cliente', clientId: 'cacarola',  avatar: 'CA', color: '#f87171', createdAt: '2025-12-01', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'intime_c',    name: 'Intime Sistemas',    email: 'intime@cliente.com',    password: '123456', role: 'cliente', clientId: 'intime',    avatar: 'IT', color: '#a78bfa', createdAt: '2025-10-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'polizio_c',        name: 'Polizio Advogados',         email: 'polizio@cliente.com',        password: '123456', role: 'cliente', clientId: 'polizio',        avatar: 'PA', color: '#34d399', createdAt: '2025-09-01', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'cdc_c',            name: 'CDC Araranguá',              email: 'cdc@cliente.com',            password: '123456', role: 'cliente', clientId: 'cdc',            avatar: 'CD', color: '#f97316', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'andressa_adv_c',   name: 'Andressa Advogada',          email: 'andressa@cliente.com',       password: '123456', role: 'cliente', clientId: 'andressa_adv',   avatar: 'AA', color: '#c084fc', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'cooperja_lojas_c', name: 'Cooperja Lojas',              email: 'cooperjalojas@cliente.com',  password: '123456', role: 'cliente', clientId: 'cooperja_lojas', avatar: 'CL', color: '#86efac', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'fonseca_gonc_c',   name: 'Fonseca e Gonçalves Adv',    email: 'fonseca@cliente.com',        password: '123456', role: 'cliente', clientId: 'fonseca_gonc',   avatar: 'FG', color: '#67e8f9', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'lenergy_c',        name: 'Lenergy',                    email: 'lenergy@cliente.com',        password: '123456', role: 'cliente', clientId: 'lenergy',        avatar: 'LN', color: '#fde047', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'mayara_campos_c',  name: 'Mayara Campos Advogada',     email: 'mayara@cliente.com',         password: '123456', role: 'cliente', clientId: 'mayara_campos',  avatar: 'MC', color: '#f9a8d4', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
  { id: 'rca_adv_c',        name: 'RCA Advogados',              email: 'rca@cliente.com',            password: '123456', role: 'cliente', clientId: 'rca_adv',        avatar: 'RC', color: '#a5b4fc', createdAt: '2026-05-20', portalModules: { indicadores: true, entregaveis: true, reunioes: true, timeline: true } },
]

const STORAGE_KEY = 'trafegon_users_v2'

/* ── CRUD ───────────────────────────────────────────────── */
export function getUsers() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { team: INITIAL_TEAM, clients: INITIAL_CLIENTS }
}

export function saveUsers(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch {}
}

export function getAllUsers() {
  const { team, clients } = getUsers()
  return [...team, ...clients]
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
