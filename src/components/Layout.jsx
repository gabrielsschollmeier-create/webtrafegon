import { useState, useRef, useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, LogOut, X, Menu, KeyRound, Eye, EyeOff, Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Sidebar from './Sidebar'
import { updateUserPasswordLocal } from '../data/users-store'

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

function ChangePasswordModal({ user, onClose }) {
  const [current,  setCurrent]  = useState('')
  const [next,     setNext]     = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showCur,  setShowCur]  = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [error,    setError]    = useState('')
  const [saved,    setSaved]    = useState(false)

  function handleSave() {
    setError('')
    if (!current || !next || !confirm) { setError('Preencha todos os campos.'); return }
    if (next.length < 6)               { setError('Nova senha deve ter pelo menos 6 caracteres.'); return }
    if (next !== confirm)              { setError('As senhas não conferem.'); return }
    updateUserPasswordLocal(user.id, next)
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: -8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -8 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-sm bg-white rounded-2xl z-50 p-5"
        style={{ boxShadow: '0 24px 60px rgba(26,29,46,0.18), 0 0 0 1px rgba(26,29,46,0.07)' }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-accent/10 flex items-center justify-center">
              <KeyRound size={14} className="text-accent" />
            </div>
            <p className="text-sm font-extrabold text-text">Trocar senha</p>
          </div>
          <button onClick={onClose} className="text-muted hover:text-text-2"><X size={15} /></button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1">Senha atual</label>
            <div className="relative">
              <input type={showCur ? 'text' : 'password'} value={current} onChange={e => setCurrent(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-bg border border-border rounded-xl px-3 py-2 pr-9 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
              <button type="button" onClick={() => setShowCur(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text-2">
                {showCur ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-2 mb-1">Nova senha</label>
            <div className="relative">
              <input type={showNext ? 'text' : 'password'} value={next} onChange={e => setNext(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full bg-bg border border-border rounded-xl px-3 py-2 pr-9 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
              <button type="button" onClick={() => setShowNext(v => !v)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text-2">
                {showNext ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-text-2 mb-1">Confirmar nova senha</label>
            <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
              placeholder="Repita a nova senha"
              className="w-full bg-bg border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50" />
          </div>

          {error && <p className="text-xs text-danger font-semibold">{error}</p>}
        </div>

        <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
          onClick={handleSave}
          className={`w-full mt-4 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
            saved ? 'bg-accent/10 text-accent border border-accent/20' : 'bg-accent hover:bg-accent-hover text-[#15172a]'
          }`}>
          {saved ? <><Check size={14} /> Senha alterada!</> : 'Salvar nova senha'}
        </motion.button>
      </motion.div>
    </>
  )
}

export default function Layout({ user, onLogout }) {
  const [showNotifs,      setShowNotifs]      = useState(false)
  const [sidebarOpen,     setSidebarOpen]     = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === '1' } catch { return false }
  })
  const [notifs,       setNotifs]       = useState(NOTIFS)
  const [showProfile,  setShowProfile]  = useState(false)
  const [showChangePw, setShowChangePw] = useState(false)
  const profileRef = useRef(null)
  const location = useLocation()

  function toggleSidebar() {
    setSidebarCollapsed(v => {
      const next = !v
      try { localStorage.setItem('sidebar_collapsed', next ? '1' : '0') } catch {}
      return next
    })
  }

  const sideW = sidebarCollapsed ? 56 : 224

  const unread = notifs.filter(n => !n.read).length

  function markAllRead() {
    setNotifs(prev => prev.map(n => ({ ...n, read: true })))
  }

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const breadcrumb = (() => {
    const path = location.pathname
    if (BREADCRUMBS[path]) return BREADCRUMBS[path]
    if (path.startsWith('/workspaces/')) return 'Operacional · Workspace'
    if (path.startsWith('/contatos/'))   return 'CRM · Contato'
    return ''
  })()

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} />

      <motion.div
        className="flex-1 flex flex-col min-h-screen"
        animate={{ marginLeft: sideW }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginLeft: sideW }}
      >

        {/* Top bar */}
        <motion.div
          className="fixed top-0 right-0 h-12 bg-white border-b border-border flex items-center px-4 z-40"
          style={{ boxShadow: '0 1px 0 #e0e3f0', left: 0 }}
          animate={{ left: sideW }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile hamburger */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-1.5 rounded-xl text-muted hover:bg-surface transition-colors"
          >
            <Menu size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden lg:flex mr-3 p-1.5 rounded-xl text-muted hover:bg-surface hover:text-text-2 transition-colors"
            title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
          >
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
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

            {/* User avatar + dropdown */}
            {user && (
              <div ref={profileRef} className="relative flex items-center gap-2 pl-2 border-l border-border">
                <button
                  onClick={() => setShowProfile(v => !v)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} · ${user.role}`}
                >
                  {user.avatar}
                </button>

                <AnimatePresence>
                  {showProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute top-9 right-0 w-48 bg-white rounded-2xl overflow-hidden"
                      style={{ boxShadow: '0 16px 40px rgba(26,29,46,0.14), 0 0 0 1px rgba(26,29,46,0.07)' }}
                    >
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-xs font-extrabold text-text truncate">{user.name}</p>
                        <p className="text-[10px] text-muted truncate">{user.email}</p>
                      </div>
                      <div className="p-1.5">
                        <button
                          onClick={() => { setShowProfile(false); setShowChangePw(true) }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-text-2 hover:bg-surface transition-colors"
                        >
                          <KeyRound size={13} className="text-muted" /> Trocar senha
                        </button>
                        <button
                          onClick={onLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-danger hover:bg-danger/5 transition-colors"
                        >
                          <LogOut size={13} /> Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

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

        <main className="flex-1 pt-12">
          <Outlet />
        </main>
      </motion.div>

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

      {/* Change password modal */}
      <AnimatePresence>
        {showChangePw && (
          <ChangePasswordModal user={user} onClose={() => setShowChangePw(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
