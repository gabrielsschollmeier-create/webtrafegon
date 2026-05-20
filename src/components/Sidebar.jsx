import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Kanban, Users, MessageSquare,
  Calendar, BarChart2, Settings, Webhook, ChevronRight,
  FolderOpen, Package, Users2, Zap, Shield, BookOpen, MessageCircle, Home, LayoutGrid, X,
  Bot, GraduationCap, Handshake, Newspaper, PhoneCall
} from 'lucide-react'
import clsx from 'clsx'

const navCRM = [
  { to: '/home',       icon: Home,            label: 'Início' },
  { to: '/',           icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pipeline',   icon: Kanban,          label: 'Pipeline' },
  { to: '/contatos',   icon: Users,           label: 'Contatos' },
  { to: '/conversas',  icon: MessageSquare,   label: 'Conversas' },
  { to: '/calendario', icon: Calendar,        label: 'Calendário' },
  { to: '/relatorios', icon: BarChart2,       label: 'Relatórios' },
]

const navERP = [
  { to: '/erp',        icon: Zap,            label: 'Dashboard' },
  { to: '/projetos',   icon: LayoutGrid,     label: 'Projetos' },
  { to: '/workspaces', icon: FolderOpen,     label: 'Workspaces' },
  { to: '/entregas',   icon: Package,        label: 'Entregas' },
  { to: '/equipe',     icon: Users2,         label: 'Equipe' },
  { to: '/playbooks',  icon: BookOpen,       label: 'Playbooks' },
  { to: '/whatsapp',   icon: MessageCircle,  label: 'WhatsApp' },
]

const navRecursos = [
  { to: '/assistant',  icon: Bot,           label: 'Assistente IA' },
  { to: '/ligacao-ia', icon: PhoneCall,     label: 'Ligação IA' },
  { to: '/educacao',   icon: GraduationCap, label: 'Educação' },
  { to: '/parceiros',  icon: Handshake,     label: 'Parceiros' },
  { to: '/noticias',   icon: Newspaper,     label: 'Notícias' },
]

const navBottomBase = [
  { to: '/integracoes',   icon: Webhook,  label: 'Integrações' },
  { to: '/configuracoes', icon: Settings, label: 'Configurações' },
]
const navBottomAdmin = [
  ...navBottomBase,
  { to: '/permissoes', icon: Shield, label: 'Permissões' },
]

const ROLE_LABELS = {
  admin:        '🔑 Admin',
  gerente:      '👔 Gerente',
  colaborador:  '👤 Colaborador',
  collaborator: '👤 Colaborador',
  visualizador: '👁 Visualizador',
  cliente:      '🏢 Portal',
  client:       '🏢 Portal',
}

function NavItem({ to, icon: Icon, label, delay = 0, end: endProp, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.25 }}
    >
      <NavLink
        to={to}
        end={endProp ?? to === '/'}
        onClick={onClick}
        className={({ isActive }) =>
          clsx(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative overflow-hidden',
            isActive
              ? 'bg-accent/[0.14] text-accent font-semibold'
              : 'text-white/45 hover:text-white/80 hover:bg-white/[0.06]'
          )
        }
      >
        {({ isActive }) => (
          <>
            {isActive && (
              <motion.div
                layoutId="active-pill"
                className="absolute inset-0 rounded-xl"
                style={{ background: 'rgba(110,218,44,0.12)' }}
                transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
              />
            )}
            <Icon size={16} className={clsx('flex-shrink-0 transition-colors relative z-10', isActive ? 'text-accent' : 'text-white/35 group-hover:text-white/70')} />
            <span className="flex-1 relative z-10">{label}</span>
            {isActive && <ChevronRight size={12} className="text-accent/60 relative z-10" />}
          </>
        )}
      </NavLink>
    </motion.div>
  )
}

function SectionLabel({ label, delay = 0 }) {
  return (
    <motion.p
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay }}
      className="text-[9px] font-extrabold tracking-widest px-3 mb-1 mt-1 uppercase"
      style={{ color: 'rgba(255,255,255,0.25)' }}
    >
      {label}
    </motion.p>
  )
}

function SidebarContent({ user, onClose }) {
  const navBottom = user?.role === 'admin' ? navBottomAdmin : navBottomBase
  return (
    <aside className="h-full w-56 flex flex-col" style={{ background: '#12141e', boxShadow: '1px 0 0 rgba(255,255,255,0.06)' }}>
      {/* Logo */}
      <div className="px-4 py-4 flex items-start justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #6eda2c, #4db81e)', boxShadow: '0 2px 8px rgba(110,218,44,0.35)' }}>
              <Zap size={15} className="text-[#0f1117]" fill="currentColor" />
            </div>
            <div>
              <p className="text-[15px] font-extrabold leading-none tracking-tight" style={{ color: 'white' }}>
                Tráfeg<span style={{ color: '#6eda2c' }}>On</span>
              </p>
              <p className="text-[8px] font-bold tracking-[0.12em] uppercase mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Suite</p>
            </div>
          </div>
          <div className="mt-2.5 px-0.5">
            <p className="text-[10px] leading-snug tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>Acelerar negócios &</p>
            <p className="text-[10px] leading-snug font-bold tracking-wide text-accent">impulsionar o empreendedorismo</p>
          </div>
        </div>
        <button onClick={onClose} className="lg:hidden p-1.5 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/[0.06] mt-1 flex-shrink-0">
          <X size={15} />
        </button>
      </div>

      {/* Badge */}
      <div className="mx-3 mt-3 mb-1 px-3 py-1.5 rounded-xl flex items-center gap-2"
        style={{ background: 'rgba(110,218,44,0.10)', border: '1px solid rgba(110,218,44,0.22)' }}>
        <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-green" />
        <span className="text-[11px] font-bold text-accent tracking-wide">TráfegOn Suite</span>
        <span className="ml-auto text-[9px] font-bold text-accent/50 tracking-widest">v1</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
        <SectionLabel label="CRM" delay={0.05} />
        {navCRM.map((item, i) => <NavItem key={item.to} {...item} delay={0.04 + i * 0.03} onClick={onClose} />)}
        <div className="my-3 mx-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <SectionLabel label="Operacional" delay={0.15} />
        {navERP.map((item, i) => <NavItem key={item.to} {...item} delay={0.16 + i * 0.03} end={false} onClick={onClose} />)}
        <div className="my-3 mx-1" style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
        <SectionLabel label="Recursos" delay={0.28} />
        {navRecursos.map((item, i) => <NavItem key={item.to} {...item} delay={0.29 + i * 0.03} end={false} onClick={onClose} />)}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-3 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {navBottom.map((item, i) => <NavItem key={item.to} {...item} delay={0.04 * i} onClick={onClose} />)}
        {user && (
          <div className="flex items-center gap-3 px-3 py-2.5 mt-1 rounded-xl cursor-pointer hover:bg-white/[0.04] transition-colors">
            <div className="relative flex-shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ backgroundColor: user.color }}>{user.avatar}</div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-accent border-2" style={{ borderColor: '#12141e' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white/80 truncate">{user.name}</p>
              <p className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.35)' }}>{ROLE_LABELS[user.role] || user.role}</p>
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}

export default function Sidebar({ user, isOpen, onClose }) {
  return (
    <>
      {/* Desktop — sempre visível */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen w-56 z-50">
        <SidebarContent user={user} onClose={() => {}} />
      </div>

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
              <SidebarContent user={user} onClose={onClose} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
