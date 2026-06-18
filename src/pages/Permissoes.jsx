import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield, Users, Building2, Check, X, Eye, EyeOff, Copy, ChevronDown,
  Plus, Trash2, KeyRound, ChevronRight, Info, Send,
} from 'lucide-react'
import {
  ROLE_CONFIG, TEAM_ROLES, PERMISSIONS, PERM_MODULES, AVATAR_COLORS,
  DEFAULT_PORTAL_MODULES, PORTAL_MODULE_LABELS,
  getUsers, saveUsers, makeAvatar,
} from '../data/users-store'
import { useData } from '../contexts/DataContext'
import { supabase, supabaseReady } from '../lib/supabase'

const ROUTE_MODULE = {
  '/home':       'erp',
  '/erp':        'erp',  '/clientes':   'erp',
  '/projetos':   'erp',  '/workspaces': 'erp',
  '/entregas':   'erp',
  '/equipe':     'erp',  '/playbooks':  'erp',  '/whatsapp':   'erp',
  '/integracoes':   'configuracoes',
  '/configuracoes': 'configuracoes',
}

const NAV_SECTIONS = [
  {
    label: 'Operacional',
    items: [
      { to: '/home',       label: 'Início' },
      { to: '/erp',        label: 'Dashboard' },
      { to: '/clientes',   label: 'Clientes' },
      { to: '/entregas',   label: 'Tarefas' },
      { to: '/equipe',     label: 'Equipe' },
      { to: '/playbooks',  label: 'Playbooks' },
      { to: '/whatsapp',   label: 'WhatsApp' },
    ],
  },
  {
    label: 'Recursos',
    items: [
      { to: '/assistant',    label: 'Assistente IA' },
      { to: '/conhecimento', label: 'Base IA' },
      { to: '/noticias',     label: 'Notícias' },
    ],
  },
  {
    label: 'Sistema',
    items: [
      { to: '/integracoes',   label: 'Integrações' },
      { to: '/configuracoes', label: 'Configurações' },
    ],
  },
]

/* Paths de cada área (deve espelhar Sidebar.jsx) */
const CRM_PATHS      = []
const ERP_PATHS      = ['/home', '/erp', '/clientes', '/entregas', '/equipe', '/playbooks', '/whatsapp']
const RECURSOS_PATHS = ['/assistant', '/conhecimento', '/noticias']
const GROUP_PATHS    = [...ERP_PATHS, ...RECURSOS_PATHS]

const GROUP_PRESETS = {
  vendas:   Object.fromEntries([
    ...CRM_PATHS.map(p      => [p, true]),
    ...ERP_PATHS.map(p      => [p, false]),
    ...RECURSOS_PATHS.map(p => [p, true]),
  ]),
  operacao: Object.fromEntries([
    ...CRM_PATHS.map(p      => [p, false]),
    ...ERP_PATHS.map(p      => [p, true]),
    ...RECURSOS_PATHS.map(p => [p, true]),
  ]),
}

async function registerInSupabase(email, password) {
  if (!supabaseReady) return
  try {
    const { data: { session: adminSession } } = await supabase.auth.getSession()
    await supabase.auth.signUp({ email, password })
    if (adminSession?.access_token) {
      await supabase.auth.setSession({
        access_token:  adminSession.access_token,
        refresh_token: adminSession.refresh_token,
      })
    }
  } catch {}
}

function CredentialsCard({ email, password, onClose }) {
  const [copied, setCopied] = useState(false)
  const text = `Acesso TráfegOn Suite\nLink: ${window.location.origin}\nE-mail: ${email}\nSenha: ${password}`
  function copy() {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white rounded-2xl w-full max-w-sm p-6"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#6eda2c18' }}>
            <Send size={15} style={{ color: '#6eda2c' }} />
          </div>
          <p className="text-sm font-extrabold text-text">Usuário criado!</p>
        </div>
        <p className="text-xs text-muted mb-4">Copie as credenciais e envie pelo WhatsApp para o usuário.</p>
        <div className="rounded-xl p-4 space-y-2 text-xs font-mono" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
          <p><span className="text-muted">Link:  </span><span className="text-text font-bold">{window.location.origin}</span></p>
          <p><span className="text-muted">E-mail:</span><span className="text-text font-bold ml-1">{email}</span></p>
          <p><span className="text-muted">Senha: </span><span className="text-text font-bold ml-1">{password}</span></p>
        </div>
        <div className="flex gap-2 mt-4">
          <button onClick={copy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={{ background: copied ? '#6eda2c' : '#f7f8fc', color: copied ? '#fff' : '#1a1d2e', border: '1px solid #edf0f7' }}>
            <Copy size={13} /> {copied ? 'Copiado!' : 'Copiar credenciais'}
          </button>
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted border border-border hover:bg-surface transition-colors">
            Fechar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── helpers ───────────────────────────────────────────── */
function PermCell({ level }) {
  if (level === 'full') return <div className="flex justify-center"><Check size={14} className="text-accent" /></div>
  if (level === 'view') return <div className="flex justify-center"><Eye size={13} className="text-blue-400" /></div>
  return <div className="flex justify-center"><X size={12} className="text-border" /></div>
}

function RoleBadge({ role, small }) {
  const cfg = ROLE_CONFIG[role]
  if (!cfg) return null
  return (
    <span className={`inline-flex items-center gap-1 font-bold rounded-full ${small ? 'text-[9px] px-2 py-0.5' : 'text-[10px] px-2.5 py-1'}`}
      style={{ backgroundColor: cfg.color + '18', color: cfg.color }}>
      {cfg.icon} {cfg.short}
    </span>
  )
}

/* ── Modals ────────────────────────────────────────────── */
function NewMemberModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', email: '', password: '123456', role: 'colaborador', color: AVATAR_COLORS[1] })
  const [creds, setCreds] = useState(null)
  const [saving, setSaving] = useState(false)
  const avatar = makeAvatar(form.name || 'NN')

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim() || saving) return
    setSaving(true)
    const user = { ...form, id: 'u_' + Date.now(), avatar, createdAt: new Date().toISOString().split('T')[0] }
    onSave(user)
    await registerInSupabase(form.email.trim(), form.password)
    setCreds({ email: form.email.trim(), password: form.password })
  }

  if (creds) return <CredentialsCard email={creds.email} password={creds.password} onClose={onClose} />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-md"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-base font-extrabold text-text">Novo membro da equipe</p>
            <p className="text-xs text-muted mt-0.5">Criar acesso interno à TráfegOn Suite</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:bg-black/[0.04] transition-colors"><X size={15} /></button>
        </div>

        <div className="p-6 space-y-4">
          {/* Avatar preview */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-extrabold text-white"
              style={{ backgroundColor: form.color }}>{avatar}</div>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-6 h-6 rounded-lg border-2 transition-transform hover:scale-110 flex items-center justify-center"
                  style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent', outline: form.color === c ? `2px solid ${c}` : 'none' }}>
                  {form.color === c && <Check size={10} className="text-white" />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nome *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Nome completo" autoFocus
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">E-mail *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="nome@trafegon.com.br"
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Senha inicial</label>
              <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nível de acesso</label>
              <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                {TEAM_ROLES.map(r => <option key={r} value={r}>{ROLE_CONFIG[r].label}</option>)}
              </select>
            </div>
          </div>

          {/* Preview */}
          <div className="p-3 rounded-xl" style={{ background: ROLE_CONFIG[form.role].color + '10', border: `1px solid ${ROLE_CONFIG[form.role].color}25` }}>
            <p className="text-[11px] font-bold" style={{ color: ROLE_CONFIG[form.role].color }}>
              {ROLE_CONFIG[form.role].icon} {ROLE_CONFIG[form.role].label}
            </p>
            <p className="text-[11px] text-muted mt-0.5">
              {form.role === 'admin' && 'Acesso total ao sistema incluindo usuários e configurações.'}
              {form.role === 'gerente' && 'Acesso ao CRM, ERP e relatórios. Visualiza financeiro. Sem gestão de usuários.'}
              {form.role === 'colaborador' && 'Acesso ao CRM e ERP operacional. Sem acesso a financeiro ou configurações.'}
              {form.role === 'visualizador' && 'Apenas leitura no CRM e ERP. Sem edição ou acesso a dados sensíveis.'}
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim() || saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] disabled:opacity-40 transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 16px #6eda2c30' }}>
            {saving ? 'Criando...' : 'Criar acesso'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function NewClientModal({ onClose, onSave, erpClients }) {
  const [form, setForm] = useState({ name: '', email: '', password: '123456', clientId: erpClients[0]?.id || '', color: AVATAR_COLORS[4] })
  const [creds, setCreds] = useState(null)
  const [saving, setSaving] = useState(false)
  const avatar = makeAvatar(form.name || 'NN')

  async function handleSave() {
    if (!form.name.trim() || !form.email.trim() || !form.clientId || saving) return
    setSaving(true)
    const user = { ...form, id: 'c_' + Date.now(), role: 'cliente', avatar, createdAt: new Date().toISOString().split('T')[0] }
    onSave(user)
    await registerInSupabase(form.email.trim(), form.password)
    setCreds({ email: form.email.trim(), password: form.password })
  }

  if (creds) return <CredentialsCard email={creds.email} password={creds.password} onClose={onClose} />

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-md"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div>
            <p className="text-base font-extrabold text-text">Novo acesso de cliente</p>
            <p className="text-xs text-muted mt-0.5">Criar credenciais para o portal do cliente</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:bg-black/[0.04] transition-colors"><X size={15} /></button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
              style={{ backgroundColor: form.color }}>{avatar}</div>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_COLORS.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))}
                  className="w-5 h-5 rounded-md border-2 transition-transform hover:scale-110"
                  style={{ backgroundColor: c, borderColor: form.color === c ? 'white' : 'transparent', outline: form.color === c ? `2px solid ${c}` : 'none' }} />
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Workspace do cliente *</label>
            <select value={form.clientId} onChange={e => setForm(f => ({ ...f, clientId: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
              {erpClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Nome do contato *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ex: João da Silva" autoFocus
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">E-mail *</label>
              <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                placeholder="contato@cliente.com"
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Senha inicial</label>
            <input value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors" />
          </div>

          <div className="p-3 rounded-xl" style={{ background: '#ea8a2910', border: '1px solid #ea8a2925' }}>
            <p className="text-[11px] font-bold text-orange">🏢 Acesso restrito ao portal</p>
            <p className="text-[11px] text-muted mt-0.5">
              O cliente verá apenas os entregáveis, reuniões e linha do tempo do próprio workspace. Sem acesso a dados da agência.
            </p>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">Cancelar</button>
          <button onClick={handleSave} disabled={!form.name.trim() || !form.email.trim() || !form.clientId || saving}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] disabled:opacity-40 transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 16px #6eda2c30' }}>
            {saving ? 'Criando...' : 'Criar portal'}
          </button>
        </div>
      </motion.div>
    </div>
  )
}

/* ── Main page ─────────────────────────────────────────── */
export default function Permissoes() {
  const { erpClients } = useData()
  const stored = getUsers()
  const [team,    setTeam]    = useState(stored.team)
  const [clients, setClients] = useState(stored.clients)
  const [showHierarchy,  setShowHierarchy]  = useState(false)
  const [showNewMember,  setShowNewMember]  = useState(false)
  const [showNewClient,  setShowNewClient]  = useState(false)
  const [showPw,         setShowPw]         = useState({})
  const [copied,         setCopied]         = useState(null)
  const [editingRole,    setEditingRole]    = useState(null)
  const [expandedPortal, setExpandedPortal] = useState(null)
  const [expandedTeam,   setExpandedTeam]   = useState(null)

  function persist(newTeam, newClients) {
    const { deleted } = getUsers()
    saveUsers({ team: newTeam ?? team, clients: newClients ?? clients, deleted: deleted ?? [] })
  }

  function addMember(user) {
    const next = [...team, user]
    setTeam(next)
    persist(next, null)
  }

  function addClient(user) {
    const next = [...clients, user]
    setClients(next)
    persist(null, next)
  }

  function changeRole(userId, newRole) {
    const next = team.map(u => u.id === userId ? { ...u, role: newRole } : u)
    setTeam(next)
    setEditingRole(null)
    persist(next, null)
    window.dispatchEvent(new CustomEvent('trafegon:permissions-changed'))
  }

  function changeGroup(userId, group) {
    const next = team.map(u => {
      if (u.id !== userId) return u
      const base = { ...(u.moduleOverrides ?? {}) }
      if (group) {
        Object.assign(base, GROUP_PRESETS[group])
      } else {
        GROUP_PATHS.forEach(p => delete base[p])
      }
      return { ...u, group, moduleOverrides: base }
    })
    setTeam(next)
    persist(next, null)
  }

  function removeMember(userId) {
    const next = team.filter(u => u.id !== userId)
    setTeam(next)
    persist(next, null)
  }

  function removeClient(userId) {
    const next = clients.filter(u => u.id !== userId)
    setClients(next)
    persist(null, next)
  }

  function updatePortalModules(clientId, key, value) {
    const next = clients.map(u => {
      if (u.id !== clientId) return u
      const modules = { ...(u.portalModules ?? DEFAULT_PORTAL_MODULES), [key]: value }
      return { ...u, portalModules: modules }
    })
    setClients(next)
    persist(null, next)
    window.dispatchEvent(new CustomEvent('trafegon:permissions-changed'))
  }

  function updateTeamModules(userId, path, value) {
    const next = team.map(u => {
      if (u.id !== userId) return u
      const moduleOverrides = { ...(u.moduleOverrides ?? {}), [path]: value }
      return { ...u, moduleOverrides }
    })
    setTeam(next)
    persist(next, null)
    window.dispatchEvent(new CustomEvent('trafegon:permissions-changed'))
  }

  function copyText(text, key) {
    navigator.clipboard.writeText(text).catch(() => {})
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  const teamByTier = [...team].sort((a, b) => {
    const ta = ROLE_CONFIG[a.role]?.tier ?? 9
    const tb = ROLE_CONFIG[b.role]?.tier ?? 9
    return ta - tb
  })

  return (
    <div className="p-4 lg:p-8">
      {/* ── Header ── */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 lg:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-text">Permissões & Acessos</h1>
            <p className="text-sm text-muted mt-0.5">Gerencie quem acessa o quê na TráfegOn Suite</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => setShowNewClient(true)}
              className="flex items-center gap-1.5 text-sm font-bold px-3 py-2.5 rounded-xl border border-border hover:border-orange/40 hover:text-orange text-muted transition-all">
              <Building2 size={14} /> Novo portal cliente
            </button>
            <button onClick={() => setShowNewMember(true)}
              className="flex items-center gap-1.5 text-sm font-extrabold px-4 py-2.5 rounded-xl text-[#0f1117] transition-all"
              style={{ background: '#6eda2c', boxShadow: '0 4px 14px #6eda2c35' }}>
              <Plus size={15} /> Novo membro
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Equipe interna', value: team.length, color: '#6eda2c', icon: '👥' },
            { label: 'Admins', value: team.filter(u => u.role === 'admin').length, color: '#60a5fa', icon: '🔑' },
            { label: 'Portais de cliente', value: clients.length, color: '#be29ec', icon: '🏢' },
            { label: 'Total de usuários', value: team.length + clients.length, color: '#ea8a29', icon: '⚡' },
          ].map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.04 }}
              className="bg-white rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.04)' }}>
              <span className="text-xl">{s.icon}</span>
              <div>
                <p className="text-lg font-extrabold" style={{ color: s.color }}>{s.value}</p>
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ── Hierarchy ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl mb-6 overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
        <button onClick={() => setShowHierarchy(v => !v)}
          className="w-full flex items-center justify-between px-6 py-4 hover:bg-surface-2 transition-colors">
          <div className="flex items-center gap-3">
            <Shield size={16} className="text-accent" />
            <div className="text-left">
              <p className="text-sm font-extrabold text-text">Hierarquia de acesso</p>
              <p className="text-xs text-muted">Veja o que cada nível pode fazer</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-muted transition-transform ${showHierarchy ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {showHierarchy && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="px-6 pb-6">
                {/* Role tier cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-6">
                  {Object.entries(ROLE_CONFIG).map(([key, cfg], i) => (
                    <motion.div key={key}
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className="rounded-xl p-3.5 border"
                      style={{ borderColor: cfg.color + '30', backgroundColor: cfg.color + '08' }}>
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-base">{cfg.icon}</span>
                        <span className="text-[9px] font-extrabold rounded-full px-1.5 py-0.5"
                          style={{ backgroundColor: cfg.color + '20', color: cfg.color }}>
                          T{cfg.tier}
                        </span>
                      </div>
                      <p className="text-xs font-extrabold text-text">{cfg.label}</p>
                      <p className="text-[10px] text-muted mt-1">
                        {key === 'admin' && 'Controle total do sistema'}
                        {key === 'gerente' && 'Gestão operacional completa'}
                        {key === 'colaborador' && 'Acesso operacional'}
                        {key === 'visualizador' && 'Somente leitura'}
                        {key === 'cliente' && 'Portal próprio restrito'}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Permission matrix */}
                <div className="overflow-x-auto rounded-xl border border-border">
                  <table className="w-full text-xs">
                    <thead>
                      <tr style={{ backgroundColor: '#f7f8fc' }}>
                        <th className="text-left px-4 py-2.5 font-bold text-muted">Módulo</th>
                        {Object.keys(ROLE_CONFIG).map(r => (
                          <th key={r} className="px-3 py-2.5 font-extrabold text-center" style={{ color: ROLE_CONFIG[r].color }}>
                            {ROLE_CONFIG[r].icon} {ROLE_CONFIG[r].short}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {PERM_MODULES.map((mod, i) => (
                        <tr key={mod.key} className={i % 2 === 0 ? '' : 'bg-surface-2/50'}>
                          <td className="px-4 py-2 text-text-2 font-semibold">{mod.label}</td>
                          {Object.keys(ROLE_CONFIG).map(r => (
                            <td key={r} className="px-3 py-2">
                              <PermCell level={PERMISSIONS[r]?.[mod.key] ?? 'none'} />
                            </td>
                          ))}
                        </tr>
                      ))}
                      <tr className="bg-orange/5">
                        <td className="px-4 py-2 text-text-2 font-semibold">Portal do cliente</td>
                        {Object.keys(ROLE_CONFIG).map(r => (
                          <td key={r} className="px-3 py-2">
                            <PermCell level={r === 'cliente' ? 'full' : 'none'} />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                  <div className="flex items-center gap-5 px-4 py-3 border-t border-border" style={{ backgroundColor: '#f7f8fc' }}>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted"><Check size={11} className="text-accent" /> Acesso total</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted"><Eye size={10} className="text-blue-400" /> Somente visualização</div>
                    <div className="flex items-center gap-1.5 text-[10px] text-muted"><X size={10} className="text-border" /> Sem acesso</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ── Team members ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl p-5 mb-5"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-extrabold text-text">Equipe interna</p>
            <p className="text-xs text-muted mt-0.5">Membros com acesso ao sistema da agência</p>
          </div>
          <button onClick={() => setShowNewMember(true)}
            className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors">
            <Plus size={12} /> Adicionar
          </button>
        </div>

        <div className="divide-y divide-border/50">
          {teamByTier.map((user, i) => {
            const cfg = ROLE_CONFIG[user.role]
            const isEditing     = editingRole === user.id
            const isTeamExpanded = expandedTeam === user.id
            return (
              <motion.div key={user.id}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.18 + i * 0.05 }}
                className="py-3 group">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-extrabold text-white flex-shrink-0"
                    style={{ backgroundColor: user.color }}>
                    {user.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text">{user.name}</p>
                    <p className="text-[11px] text-muted font-mono">{user.email}</p>
                  </div>
                  <p className="text-[10px] text-muted hidden sm:block">
                    desde {new Date(user.createdAt + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' })}
                  </p>

                  {/* Role selector */}
                  <div className="relative">
                    <button onClick={() => setEditingRole(isEditing ? null : user.id)}
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition-all"
                      style={{
                        backgroundColor: cfg?.color + '15',
                        borderColor: cfg?.color + '35',
                        color: cfg?.color,
                      }}>
                      <span className="text-[10px] font-extrabold">{cfg?.icon} {cfg?.label}</span>
                      <ChevronDown size={10} />
                    </button>
                    <AnimatePresence>
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -4 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -4 }}
                          className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl border border-border overflow-hidden"
                          style={{ boxShadow: '0 8px 32px rgba(26,29,46,0.18)', width: 180 }}>
                          {TEAM_ROLES.map(r => (
                            <button key={r} onClick={() => changeRole(user.id, r)}
                              className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-surface-2 transition-colors text-left">
                              <span className="text-sm">{ROLE_CONFIG[r].icon}</span>
                              <div>
                                <p className="text-xs font-bold text-text">{ROLE_CONFIG[r].label}</p>
                                <p className="text-[9px] text-muted">Tier {ROLE_CONFIG[r].tier}</p>
                              </div>
                              {user.role === r && <Check size={12} className="text-accent ml-auto" />}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Grupo */}
                  <div className="flex gap-1">
                    <button onClick={() => changeGroup(user.id, user.group === 'vendas' ? null : 'vendas')}
                      className="text-[9px] font-extrabold px-2 py-1 rounded-lg transition-all"
                      style={{
                        background:  user.group === 'vendas' ? '#6eda2c' : '#f2f4fb',
                        color:       user.group === 'vendas' ? '#fff'    : '#7680a8',
                        border: `1px solid ${user.group === 'vendas' ? '#6eda2c' : '#e0e3f0'}`,
                      }}>
                      Vendas
                    </button>
                    <button onClick={() => changeGroup(user.id, user.group === 'operacao' ? null : 'operacao')}
                      className="text-[9px] font-extrabold px-2 py-1 rounded-lg transition-all"
                      style={{
                        background:  user.group === 'operacao' ? '#be29ec' : '#f2f4fb',
                        color:       user.group === 'operacao' ? '#fff'    : '#7680a8',
                        border: `1px solid ${user.group === 'operacao' ? '#be29ec' : '#e0e3f0'}`,
                      }}>
                      Operação
                    </button>
                  </div>

                  {/* Módulos button */}
                  <button onClick={() => setExpandedTeam(isTeamExpanded ? null : user.id)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                    style={{
                      backgroundColor: isTeamExpanded ? '#6eda2c18' : '#f2f4fb',
                      color:           isTeamExpanded ? '#6eda2c'   : '#7680a8',
                      border: `1px solid ${isTeamExpanded ? '#6eda2c30' : '#e0e3f0'}`,
                    }}>
                    <Shield size={9} /> Módulos
                    <ChevronDown size={9} className={`transition-transform ${isTeamExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyText(user.password, `pw_${user.id}`)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors"
                      title="Copiar senha">
                      {copied === `pw_${user.id}` ? <Check size={12} className="text-accent" /> : <KeyRound size={12} />}
                    </button>
                    {team.filter(u => u.role === 'admin').length > 1 || user.role !== 'admin' ? (
                      <button onClick={() => removeMember(user.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                        title="Remover acesso">
                        <Trash2 size={12} />
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Module overrides panel */}
                <AnimatePresence>
                  {isTeamExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 ml-12 p-3 rounded-xl" style={{ background: '#f7f8fc', border: '1px solid #e0e3f0' }}>
                        <p className="text-[9px] font-extrabold text-muted uppercase tracking-widest mb-2.5">Menus visíveis</p>
                        {NAV_SECTIONS.map(section => (
                          <div key={section.label} className="mb-3 last:mb-0">
                            <p className="text-[8px] font-extrabold text-muted uppercase tracking-widest mb-1.5">{section.label}</p>
                            <div className="flex flex-wrap gap-1.5">
                              {section.items.map(item => {
                                const ov   = (user.moduleOverrides ?? {})[item.to]
                                const mod  = ROUTE_MODULE[item.to]
                                const byRole = mod ? PERMISSIONS[user.role ?? 'colaborador']?.[mod] !== 'none' : true
                                const effective = ov !== undefined ? ov !== false : byRole
                                const hasOverride = ov !== undefined
                                return (
                                  <button key={item.to}
                                    onClick={() => updateTeamModules(user.id, item.to, !effective)}
                                    className="flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold border transition-all"
                                    style={{
                                      backgroundColor: effective ? '#6eda2c12' : 'white',
                                      borderColor:     effective ? '#6eda2c35' : '#d1d5db',
                                      color:           effective ? '#4ab81e'   : '#b0b8d0',
                                      opacity:         hasOverride ? 1 : 0.75,
                                    }}>
                                    {item.label}
                                    {hasOverride && <span className="text-[8px] opacity-60">*</span>}
                                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                                      style={{ background: effective ? '#6eda2c' : '#d1d5db' }} />
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        ))}
                        <p className="text-[9px] text-muted mt-2">Clique para mostrar/ocultar cada item do menu.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {team.length === 0 && (
          <p className="text-center text-sm text-muted py-8">Nenhum membro cadastrado.</p>
        )}
      </motion.div>

      {/* ── Client portals ── */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-5"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm font-extrabold text-text">Portais de clientes</p>
            <p className="text-xs text-muted mt-0.5">Credenciais de acesso ao portal restrito de cada cliente</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-xl"
              style={{ backgroundColor: '#ea8a2915', color: '#ea8a29' }}>
              🏢 Acesso restrito
            </span>
            <button onClick={() => setShowNewClient(true)}
              className="flex items-center gap-1 text-xs font-bold text-accent hover:text-accent-hover transition-colors">
              <Plus size={12} /> Adicionar
            </button>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {clients.map((client, i) => {
            const workspace   = erpClients.find(c => c.id === client.clientId)
            const isExpanded  = expandedPortal === client.id
            const modules     = client.portalModules ?? DEFAULT_PORTAL_MODULES
            return (
              <motion.div key={client.id}
                initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.22 + i * 0.04 }}
                className="py-3 group">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0"
                    style={{ backgroundColor: client.color }}>
                    {client.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text">{client.name}</p>
                    <p className="text-[10px] text-muted font-mono">{client.email}</p>
                  </div>
                  {workspace && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md hidden sm:inline"
                      style={{ backgroundColor: '#be29ec12', color: '#be29ec' }}>
                      {workspace.name}
                    </span>
                  )}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setExpandedPortal(isExpanded ? null : client.id)}
                      className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all"
                      style={{
                        backgroundColor: isExpanded ? '#6eda2c18' : '#f2f4fb',
                        color: isExpanded ? '#6eda2c' : '#7680a8',
                        border: `1px solid ${isExpanded ? '#6eda2c30' : '#e0e3f0'}`,
                      }}>
                      <Shield size={9} /> Módulos
                      <ChevronDown size={9} className={`transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    <button onClick={() => setShowPw(p => ({ ...p, [client.id]: !p[client.id] }))}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                      {showPw[client.id] ? <EyeOff size={11} /> : <Eye size={11} />}
                    </button>
                    <span className="text-[10px] font-mono text-muted w-12 text-center">
                      {showPw[client.id] ? client.password : '••••••'}
                    </span>
                    <button onClick={() => copyText(client.email, client.id)}
                      className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                      style={{
                        color:           copied === client.id ? '#6eda2c' : '#7680a8',
                        backgroundColor: copied === client.id ? '#6eda2c18' : '#8890b512',
                      }}>
                      {copied === client.id ? <Check size={10} /> : <Copy size={10} />}
                      {copied === client.id ? 'Copiado!' : 'Copiar'}
                    </button>
                    <button onClick={() => removeClient(client.id)}
                      className="w-6 h-6 rounded-lg flex items-center justify-center text-muted opacity-0 group-hover:opacity-100 hover:text-danger hover:bg-danger/10 transition-all">
                      <Trash2 size={11} />
                    </button>
                  </div>
                </div>

                {/* Module toggles */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden">
                      <div className="mt-3 ml-12 p-3 rounded-xl" style={{ background: '#f7f8fc', border: '1px solid #e0e3f0' }}>
                        <p className="text-[9px] font-extrabold text-muted uppercase tracking-widest mb-2.5">Seções visíveis no portal</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {Object.entries(PORTAL_MODULE_LABELS).map(([key, cfg]) => {
                            const enabled = modules[key] ?? true
                            return (
                              <button key={key}
                                onClick={() => updatePortalModules(client.id, key, !enabled)}
                                className="flex items-center gap-2 px-2.5 py-2 rounded-xl border text-left transition-all"
                                style={{
                                  backgroundColor: enabled ? '#6eda2c12' : 'white',
                                  borderColor:     enabled ? '#6eda2c35' : '#e0e3f0',
                                }}>
                                <span className="text-sm">{cfg.icon}</span>
                                <span className="text-[10px] font-bold flex-1" style={{ color: enabled ? '#6eda2c' : '#8890b5' }}>{cfg.label}</span>
                                <div className="w-6 h-3.5 rounded-full flex-shrink-0 relative transition-colors"
                                  style={{ backgroundColor: enabled ? '#6eda2c' : '#d1d5db' }}>
                                  <div className="absolute top-0.5 w-2.5 h-2.5 rounded-full bg-white transition-all"
                                    style={{ left: enabled ? '11px' : '2px' }} />
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>

        {clients.length === 0 && (
          <p className="text-center text-sm text-muted py-8">Nenhum portal de cliente cadastrado.</p>
        )}

        <div className="mt-4 p-3.5 rounded-xl" style={{ background: '#6eda2c08', border: '1px solid #6eda2c20' }}>
          <div className="flex items-start gap-2.5">
            <Info size={13} className="text-accent flex-shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted leading-relaxed">
              O cliente acessa via login normal usando e-mail e senha acima. Ele verá apenas o próprio workspace: entregáveis ativos, próximas reuniões e linha do tempo do projeto. <strong className="text-text-2">Sem acesso a dados da agência, pipeline ou equipe.</strong>
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {showNewMember && <NewMemberModal onClose={() => setShowNewMember(false)} onSave={addMember} />}
      </AnimatePresence>
      <AnimatePresence>
        {showNewClient && <NewClientModal onClose={() => setShowNewClient(false)} onSave={addClient} erpClients={erpClients} />}
      </AnimatePresence>
    </div>
  )
}
