import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, LogOut, X, Menu } from 'lucide-react'
import Sidebar from './Sidebar'

const NOTIFS = [
  { id: 1, icon: '⚠️',  title: 'Ararastur em risco',            detail: 'Reunião de retenção pendente',   time: '1h', color: '#ea8a29', read: false },
  { id: 2, icon: '🔴',  title: 'LP Cardápio Digital atrasada',   detail: 'Caçarola · prazo vencido',      time: '3h', color: '#ef4444', read: false },
  { id: 3, icon: '👀',  title: 'LP Coleção Inverno em revisão',  detail: 'Kamy · aguardando aprovação',   time: '5h', color: '#ea8a29', read: false },
  { id: 4, icon: '📅',  title: 'Kickoff Kamy amanhã às 11h',     detail: 'Com Gabriel, João e Ana',       time: '1d', color: '#60a5fa', read: true  },
  { id: 5, icon: '📥',  title: 'Novo lead: Pedro Alves',         detail: 'Meta Formulário → Novo Lead',   time: '2d', color: '#6eda2c', read: true  },
  { id: 6, icon: '✅',  title: 'Copy LinkedIn Intime concluída', detail: 'Ana M. concluiu a tarefa',      time: '2d', color: '#6eda2c', read: true  },
]

const BREADCRUMBS = {
  '/':               'CRM · Dashboard',
  '/pipeline':       'CRM · Pipeline',
  '/contatos':       'CRM · Contatos',
  '/conversas':      'CRM · Conversas',
  '/calendario':     'CRM · Calendário',
  '/relatorios':     'CRM · Relatórios',
  '/integracoes':    'CRM · Integrações',
  '/configuracoes':  'Configurações',
  '/erp':            'Operacional · Dashboard',
  '/workspaces':     'Operacional · Workspaces',
  '/entregas':       'Operacional · Entregas',
  '/equipe':         'Operacional · Equipe',
  '/permissoes':     'Permissões & Acessos',
  '/home':           'Início',
  '/projetos':       'Operacional · Projetos',
  '/playbooks':      'Operacional · Playbooks',
  '/whatsapp':       'Operacional · WhatsApp',
  '/assistant':      'Assistente IA',
  '/educacao':       'Educação',
  '/parceiros':      'Parceiros',
  '/noticias':       'Notícias do Mercado',
  '/ligacao-ia':     'Ligação IA · Auto-call',
}

export default function Layout({ user, onLogout }) {
  const [showNotifs,   setShowNotifs]   = useState(false)
  const [sidebarOpen,  setSidebarOpen]  = useState(false)
  const [notifs,       setNotifs]       = useState(NOTIFS)
  const location = useLocation()

  const unread = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  const breadcrumb = (() => {
    const path = location.pathname
    if (BREADCRUMBS[path]) return BREADCRUMBS[path]
    if (path.startsWith('/workspaces/')) return 'Operacional · Workspace'
    if (path.startsWith('/contatos/'))   return 'CRM · Contato'
    return ''
  })()

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area — offset only on desktop */}
      <div className="flex-1 lg:ml-56 flex flex-col min-h-screen">

        {/* Top bar */}
        <div
          className="fixed top-0 left-0 right-0 lg:left-56 h-12 bg-white border-b border-border flex items-center px-4 z-40"
          style={{ boxShadow: '0 1px 0 #e0e3f0' }}
        >
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-1.5 rounded-xl text-muted hover:bg-surface transition-colors"
          >
            <Menu size={18} />
          </button>

          <p className="text-xs font-bold text-muted flex-1 truncate">{breadcrumb}</p>

          <div className="flex items-center gap-2">
            {/* Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifs(v => !v)}
                className="relative w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors"
              >
                <Bell size={15} />
                {unread > 0 && (
                  <motion.div
                    initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-[#0f1117]"
                    style={{ backgroundColor: '#6eda2c' }}
                  >
                    {unread}
                  </motion.div>
                )}
              </button>
            </div>

            {/* User + logout */}
            {user && (
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white cursor-pointer"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} · ${user.role}`}
                >
                  {user.avatar}
                </div>
                <button
                  onClick={onLogout}
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Sair"
                >
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 pt-12">
          <Outlet />
        </main>
      </div>

      {/* Notifications panel */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50"
              onClick={() => setShowNotifs(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-14 right-3 w-[calc(100vw-24px)] max-w-sm bg-white rounded-2xl z-50 overflow-hidden"
              style={{ boxShadow: '0 24px 60px rgba(26,29,46,0.18), 0 0 0 1px rgba(26,29,46,0.07)' }}
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-extrabold text-text">Notificações</p>
                  {unread > 0 && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-[#0f1117]"
                      style={{ backgroundColor: '#6eda2c' }}>{unread}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-accent font-bold">Marcar lidas</button>
                  )}
                  <button onClick={() => setShowNotifs(false)} className="text-muted hover:text-text-2">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {notifs.map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    onClick={() => setNotifs(prev => prev.map(x => x.id === n.id ? { ...x, read: true } : x))}
                    className={`flex items-start gap-3 px-4 py-3 border-b border-border/40 cursor-pointer hover:bg-surface-2 ${!n.read ? 'bg-accent/[0.03]' : ''}`}
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                      style={{ backgroundColor: n.color + '18' }}>{n.icon}</div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-snug ${!n.read ? 'font-bold text-text' : 'font-semibold text-text-2'}`}>{n.title}</p>
                      <p className="text-[10px] text-muted mt-0.5">{n.detail}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                      <span className="text-[9px] text-muted">{n.time}</span>
                      {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="px-4 py-3 border-t border-border">
                <button className="w-full text-xs text-accent font-bold text-center">Ver todas as notificações</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
