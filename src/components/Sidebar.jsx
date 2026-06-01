import { NavLink, useNavigate } from 'react-router-dom'
import { getAvatarComponent } from '../data/avatars'
import Logo from './Logo'
import { motion, AnimatePresence } from 'framer-motion'
import BeltBadge from './BeltBadge'
import { useData } from '../contexts/DataContext'
import {
  LayoutDashboard, Kanban, Users, MessageSquare,
  Calendar, BarChart2, Settings, Webhook, ChevronRight,
  FolderOpen, Package, Users2, Zap, Shield, BookOpen, MessageCircle, Home, LayoutGrid, X,
  Bot, GraduationCap, Handshake, Newspaper, PhoneCall, Flame, Hourglass, CalendarDays, Brain
} from 'lucide-react'
import clsx from 'clsx'
import { PERMISSIONS, EMAIL_MODULE_OVERRIDES } from '../data/users-store'

const ROUTE_MODULE = {
  '/':           'crm',
  '/home':       'crm',
  '/pipeline':   'crm',
  '/contatos':   'crm',
  '/conversas':  'crm',
  '/calendario': 'crm',
  '/relatorios': 'relatorios',
  '/erp':        'erp',
  '/projetos':   'erp',
  '/workspaces': 'erp',
  '/entregas':   'erp',
  '/equipe':     'erp',
  '/playbooks':  'erp',
  '/whatsapp':   'erp',
  '/integracoes':    'configuracoes',
  '/configuracoes':  'configuracoes',
  '/agenda':         'erp',
  '/conhecimento':   'erp',
}

const navCRM = [
  { to: '/home',       icon: Home,            label: 'Inicio' },
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipeline',   icon: Kanban,          label: 'Pipeline' },
  { to: '/contatos',   icon: Users,           label: 'Contatos' },
  { to: '/conversas',  icon: MessageSquare,   label: 'Conversas' },
  { to: '/calendario', icon: Calendar,        label: 'Calendario' },
  { to: '/relatorios', icon: BarChart2,       label: 'Relatorios' },
]

const navERP = [
  { to: '/erp',        icon: Zap,            label: 'Dashboard' },
  { to: '/projetos',   icon: LayoutGrid,     label: 'Projetos' },
  { to: '/workspaces', icon: FolderOpen,     label: 'Workspaces' },
  { to: '/entregas',   icon: Package,        label: 'Tarefas' },
  { to: '/equipe',     icon: Users2,         label: 'Equipe',    adminOnly: true },
  { to: '/playbooks',  icon: BookOpen,       label: 'Playbooks' },
  { to: '/whatsapp',   icon: MessageCircle,  label: 'WhatsApp' },
]

const navRecursos = [
  { to: '/assistant',    icon: Bot,           label: 'Assistente IA' },
  { to: '/conhecimento', icon: Brain,         label: 'Base IA' },
  { to: '/ligacao-ia',   icon: PhoneCall,     label: 'Ligacao IA',   wip: true },
  { to: '/educacao',     icon: GraduationCap, label: 'Educacao',     wip: true },
  { to: '/parceiros',    icon: Handshake,     label: 'Parceiros',    wip: true },
  { to: '/noticias',     icon: Newspaper,     label: 'Noticias',     wip: true },
]

const navBottomBase = [
  { to: '/integracoes',   icon: Webhook,  label: 'Integracoes' },
  { to: '/configuracoes', icon: Settings, label: 'Configuracoes' },
]

const ROLE_LABELS = {
  admin:        'Admin',
  gerente:      'Gerente',
  colaborador:  'Colaborador',
  collaborator: 'Colaborador',
  visualizador: 'Visualizador',
  cliente:      'Portal',
  client:       'Portal',
}

const ERP_ROUTES = new Set(['/erp','/projetos','/workspaces','/entregas','/equipe','/playbooks','/whatsapp','/agenda'])
const CRM_ROUTES = new Set(['/','/home','/pipeline','/contatos','/conversas','/calendario','/relatorios'])

/* ── NavItem ─────────────────────────────────────────────── */
function NavItem({ to, icon: Icon, label, delay = 0, end: endProp, onClick, collapsed, wip = false, isAdmin = false }) {
  if (wip && !isAdmin) {
    return (
      <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.2 }}>
        <div
          title={collapsed ? `${label} — em breve` : undefined}
          className={clsx(
            'flex items-center rounded-xl text-sm font-medium cursor-not-allowed select-none relative overflow-hidden',
            collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5',
          )}
          style={{ opacity: 1 }}
        >
          {/* Scanner verde varrendo da esquerda pra direita */}
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-xl"
            style={{
              background: 'linear-gradient(90deg, transparent 0%, rgba(110,218,44,0.07) 35%, rgba(110,218,44,0.15) 50%, rgba(110,218,44,0.07) 65%, transparent 100%)',
            }}
            animate={{ x: ['-110%', '110%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear', repeatDelay: 1 }}
          />

          <Icon size={16} className="flex-shrink-0 text-white/50 relative z-10" />

          {!collapsed && (
            <>
              <span className="flex-1 relative z-10 italic" style={{ color: 'rgba(255,255,255,0.55)' }}>{label}</span>

              {/* Ampulheta girando — mesmo padrão do badge Construindo */}
              <div className="flex items-center gap-1.5 relative z-10 flex-shrink-0">
                <motion.div
                  animate={{ rotate: [0, 0, 180, 180, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.5, 0.7, 0.8, 1] }}
                >
                  <Hourglass size={12} style={{ color: '#6eda2c' }} />
                </motion.div>
                <span className="text-[9px] font-extrabold tracking-wide"
                  style={{ color: 'rgba(110,218,44,0.9)' }}>
                  Construindo
                </span>
              </div>
            </>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay, duration: 0.2 }}>
      <NavLink
        to={to}
        end={endProp ?? to === '/'}
        onClick={onClick}
        title={collapsed ? label : undefined}
        className={({ isActive }) =>
          clsx(
            'flex items-center rounded-xl text-sm font-medium transition-all group relative overflow-hidden',
            collapsed ? 'justify-center w-10 h-10 mx-auto' : 'gap-3 px-3 py-2.5',
            isActive
              ? 'bg-accent/[0.14] text-accent font-semibold'
              : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div layoutId={`pill-${to}`}
                className="absolute inset-0 rounded-xl"
                style={{ background: 'rgba(110,218,44,0.12)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon size={16} className={clsx('flex-shrink-0 transition-colors relative z-10',
              isActive ? 'text-accent' : 'text-white/35 group-hover:text-white/70')} />
            {!collapsed && <span className="flex-1 relative z-10">{label}</span>}
            {!collapsed && isActive && <ChevronRight size={12} className="text-accent/60 relative z-10" />}
          </>
        )}
      </NavLink>
    </motion.div>
  )
}

function SectionLabel({ label, delay = 0, collapsed }) {
  if (collapsed) return (
    <div className="my-1 mx-2" style={{ height: 1, background: 'rgba(255,255,255,0.08)' }} />
  )
  return (
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
      className="text-[9px] font-extrabold tracking-widest px-3 mb-1 mt-1 uppercase"
      style={{ color: 'rgba(255,255,255,0.25)' }}>
      {label}
    </motion.p>
  )
}

/* ── SidebarContent ──────────────────────────────────────── */
function SidebarContent({ user, onClose, collapsed }) {
  const navigate     = useNavigate()
  // Sempre usa os overrides do código (EMAIL_MODULE_OVERRIDES) se o email estiver mapeado,
  // evitando que sessões em cache com valores antigos ignorem mudanças de permissão.
  const overrides    = (user?.email && EMAIL_MODULE_OVERRIDES[user.email]) ?? user?.moduleOverrides ?? {}
  const role         = user?.role  ?? 'colaborador'
  const group        = user?.group ?? null
  const { collaborators } = useData()
  const collabData   = collaborators?.find(c => c.email === user?.email || c.id === user?.id)
  const userBelt     = collabData?.belt  ?? 'branca'
  const userGrau     = collabData?.grau  ?? 0

  function canSee(to) {
    if (group === 'vendas'   && ERP_ROUTES.has(to)) return false
    if (group === 'operacao' && CRM_ROUTES.has(to)) return false
    if (overrides[to] === false) return false
    if (overrides[to] === true)  return true
    const mod = ROUTE_MODULE[to]
    if (!mod) return true
    return PERMISSIONS[role]?.[mod] !== 'none'
  }

  const filteredCRM      = navCRM.filter(item => canSee(item.to))
  const isAdmin          = role === 'admin'
  const filteredERP      = navERP.filter(item => (!item.adminOnly || isAdmin) && canSee(item.to))
  const filteredRecursos = navRecursos.filter(item => canSee(item.to))
  const filteredBottom   = [
    ...navBottomBase.filter(item => canSee(item.to)),
    ...(role === 'admin' ? [{ to: '/permissoes', icon: Shield, label: 'Permissoes' }] : []),
  ]

  return (
    <aside
      className="h-full flex flex-col overflow-hidden"
      style={{ background: '#12141e', boxShadow: '1px 0 0 rgba(255,255,255,0.06)', width: collapsed ? 56 : 224 }}
    >
      {/* Logo */}
      <div className={clsx('flex items-center py-4 flex-shrink-0', collapsed ? 'justify-center px-0' : 'px-4 justify-between')}
        style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        {collapsed ? (
          <Logo variant="icon" size="sm" />
        ) : (
          <>
            <Logo variant="full" size="sm" dark />

            <button onClick={onClose} className="lg:hidden p-1.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.06] mt-1 flex-shrink-0">
              <X size={15} />
            </button>
          </>
        )}
      </div>

      {/* Badge (so expandido) */}
      {!collapsed && (
        <div className="mx-3 mt-3 mb-1 px-3 py-1.5 rounded-xl flex items-center gap-2"
          style={{ background: 'rgba(110,218,44,0.10)', border: '1px solid rgba(110,218,44,0.22)' }}>
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-green" />
          <span className="text-[11px] font-bold text-accent tracking-wide">on suite</span>
          <span className="ml-auto text-[9px] font-bold text-accent/50 tracking-widest">v1</span>
        </div>
      )}

      {/* Nav */}
      <nav className={clsx('flex-1 py-3 overflow-y-auto overflow-x-hidden', collapsed ? 'px-0 space-y-1' : 'px-3 space-y-0.5')}>
        {filteredCRM.length > 0 && <>
          <SectionLabel label="CRM" delay={0.05} collapsed={collapsed} />
          {filteredCRM.map((item, i) => <NavItem key={item.to} {...item} delay={0.04 + i * 0.03} onClick={onClose} collapsed={collapsed} />)}
          {!collapsed && <div className="my-3 mx-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />}
        </>}
        {filteredERP.length > 0 && <>
          <SectionLabel label="Operacional" delay={0.15} collapsed={collapsed} />
          {filteredERP.map((item, i) => <NavItem key={item.to} {...item} delay={0.16 + i * 0.03} end={false} onClick={onClose} collapsed={collapsed} />)}
          {!collapsed && <div className="my-3 mx-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />}
        </>}
        {filteredRecursos.length > 0 && <>
          <SectionLabel label="Recursos" delay={0.28} collapsed={collapsed} />
          {filteredRecursos.map((item, i) => <NavItem key={item.to} {...item} delay={0.29 + i * 0.03} end={false} onClick={onClose} collapsed={collapsed} isAdmin={role === 'admin'} />)}
        </>}
      </nav>

      {/* Bottom */}
      <div className={clsx('py-3 space-y-0.5 flex-shrink-0', collapsed ? 'px-0' : 'px-3')}
        style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {filteredBottom.map((item, i) => <NavItem key={item.to} {...item} delay={0.04 * i} onClick={onClose} collapsed={collapsed} />)}
        {user && !collapsed && (
          <div>
            <motion.button whileHover={{ scale:1.02 }} whileTap={{ scale:0.97 }}
              onClick={() => { navigate('/arena'); onClose?.() }}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl mb-1 transition-all"
              style={{ background:'linear-gradient(90deg,rgba(110,218,44,0.12),rgba(110,218,44,0.05))', border:'1px solid rgba(110,218,44,0.2)' }}>
              <Flame size={13} style={{ color:'#6eda2c' }} />
              <span className="text-[11px] font-extrabold text-accent">Arena</span>
              <span className="ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background:'rgba(110,218,44,0.15)',color:'#6eda2c' }}>ons</span>
            </motion.button>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
              <div className="relative flex-shrink-0">
                {(() => { const Svg = getAvatarComponent(user.email) || getAvatarComponent(user.id); return Svg
                  ? <div className="w-7 h-7 rounded-full overflow-hidden"><Svg /></div>
                  : <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: user.color }}>{user.avatar}</div>
                })()}
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2" style={{ borderColor: '#12141e' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white/80 truncate">{user.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <BeltBadge beltId={userBelt} grau={userGrau} size="xs" />
                </div>
              </div>
            </div>
          </div>
        )}
        {user && collapsed && (
          <div className="flex justify-center py-2" title={user.name}>
            {(() => { const Svg = getAvatarComponent(user.email) || getAvatarComponent(user.id); return Svg
              ? <div className="w-7 h-7 rounded-full overflow-hidden"><Svg /></div>
              : <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: user.color }}>{user.avatar}</div>
            })()}
          </div>
        )}
      </div>
    </aside>
  )
}

/* ── Sidebar export ──────────────────────────────────────── */
export default function Sidebar({ user, isOpen, onClose, collapsed }) {
  return (
    <>
      {/* Desktop — sempre visivel, anima width */}
      <motion.div
        className="hidden lg:block fixed left-0 top-0 h-screen z-50"
        animate={{ width: collapsed ? 56 : 224 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <SidebarContent user={user} onClose={() => {}} collapsed={collapsed} />
      </motion.div>

      {/* Mobile — drawer com overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={onClose}
            />
            <motion.div
              initial={{ x: -256 }} animate={{ x: 0 }} exit={{ x: -256 }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed left-0 top-0 h-screen z-50 lg:hidden"
            >
              <SidebarContent user={user} onClose={onClose} collapsed={false} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
