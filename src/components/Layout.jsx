import { useState, useRef, useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, LogOut, X, Menu, KeyRound, Eye, EyeOff, Check, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import Sidebar from './Sidebar'
import SyncStatus from './SyncStatus'
import { updateUserPasswordLocal } from '../data/users-store'
import { useData } from '../contexts/DataContext'

// Logout automático após 8h de inatividade
const INACTIVITY_MS = 8 * 60 * 60 * 1000
const ACTIVITY_KEY  = 'trafegon_last_activity'

function touchActivity() {
  try { localStorage.setItem(ACTIVITY_KEY, String(Date.now())) } catch {}
}

function isSessionExpired() {
  try {
    const last = Number(localStorage.getItem(ACTIVITY_KEY) || '0')
    if (!last) return false                    // nunca registrado → não expira
    return Date.now() - last > INACTIVITY_MS
  } catch { return false }
}

const BREADCRUMBS = {
  '/':               'CRM · Dashboard',
  '/pipeline':       'CRM · Pipeline',
  '/contatos':       'CRM · Contatos',
  '/conversas':      'CRM · Conversas',
  '/calendario':     'CRM · Calendario',
  '/relatorios':     'CRM · Relatorios',
  '/integracoes':    'CRM · Integracoes',
  '/configuracoes':  'Configuracoes',
  '/erp':            'Operacional · Dashboard',
  '/workspaces':     'Operacional · Workspaces',
  '/entregas':       'Operacional · Entregas',
  '/equipe':         'Operacional · Equipe',
  '/permissoes':     'Permissoes & Acessos',
  '/home':           'Inicio',
  '/projetos':       'Operacional · Projetos',
  '/playbooks':      'Operacional · Playbooks',
  '/whatsapp':       'Operacional · WhatsApp',
  '/assistant':      'Assistente IA',
  '/educacao':       'Educacao',
  '/parceiros':      'Parceiros',
  '/noticias':       'Noticias do Mercado',
  '/ligacao-ia':     'Ligacao IA · Auto-call',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / 86400000)
  if (diff === 0) return 'hoje'
  if (diff === 1) return '1d'
  return `${diff}d`
}

/* ── Gera notificacoes dinamicas a partir dos dados reais ── */
function buildNotifications(tasks, erpClients) {
  const today = new Date().toISOString().split('T')[0]
  const notifs = []

  // Tarefas atrasadas (max 4)
  tasks
    .filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today)
    .slice(0, 4)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      notifs.push({
        id:     `late_${t.id}`,
        icon:   '🔴',
        title:  t.title + ' esta atrasada',
        detail: (client?.name || 'Cliente') + ' · prazo vencido',
        time:   timeAgo(t.dueDate),
        color:  '#ef4444',
        read:   false,
        path:   '/entregas',
      })
    })

  // Tarefas que vencem hoje (max 3)
  tasks
    .filter(t => t.status !== 'done' && t.dueDate === today)
    .slice(0, 3)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      notifs.push({
        id:     `today_${t.id}`,
        icon:   '⚠️',
        title:  t.title + ' vence hoje',
        detail: (client?.name || 'Cliente') + ' · urgente',
        time:   'hoje',
        color:  '#ea8a29',
        read:   false,
        path:   '/entregas',
      })
    })

  // Clientes em risco (max 3)
  erpClients
    .filter(c => c.status === 'at_risk')
    .slice(0, 3)
    .forEach(c => {
      notifs.push({
        id:     `risk_${c.id}`,
        icon:   '⚡',
        title:  c.name + ' esta em risco',
        detail: 'Atencao necessaria — cliente em risco',
        time:   '',
        color:  '#f59e0b',
        read:   false,
        path:   `/workspaces/${c.id}`,
      })
    })

  // Tarefas em revisao aguardando aprovacao (max 3)
  tasks
    .filter(t => t.status === 'review')
    .slice(0, 3)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      notifs.push({
        id:     `review_${t.id}`,
        icon:   '👀',
        title:  t.title + ' aguarda revisao',
        detail: (client?.name || 'Cliente') + ' · em aprovacao',
        time:   '',
        color:  '#be29ec',
        read:   false,
        path:   '/entregas',
      })
    })

  return notifs.slice(0, 10)
}

/* ── Modal troca senha ─────────────────────────────────────── */
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
    if (next !== confirm)              { setError('As senhas nao conferem.'); return }
    updateUserPasswordLocal(user.id, next)
    setSaved(true)
    setTimeout(onClose, 1200)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm" onClick={onClose} />
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
          {[
            { label: 'Senha atual',       val: current,  set: setCurrent, show: showCur,  setShow: setShowCur  },
            { label: 'Nova senha',        val: next,     set: setNext,    show: showNext, setShow: setShowNext },
            { label: 'Confirmar nova senha', val: confirm, set: setConfirm, show: false, setShow: null },
          ].map(({ label, val, set, show, setShow }, i) => (
            <div key={i}>
              <label className="block text-xs font-bold text-text-2 mb-1">{label}</label>
              <div className="relative">
                <input
                  type={show ? 'text' : 'password'} value={val}
                  onChange={e => set(e.target.value)}
                  placeholder={i === 1 ? 'Minimo 6 caracteres' : '••••••••'}
                  className="w-full bg-bg border border-border rounded-xl px-3 py-2 pr-9 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50"
                />
                {setShow && (
                  <button type="button" onClick={() => setShow(v => !v)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted hover:text-text-2">
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                )}
              </div>
            </div>
          ))}
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

/* ══ Layout ══════════════════════════════════════════════════ */
export default function Layout({ user, onLogout }) {
  const { tasks, erpClients, syncTasks, syncing, pendingOps } = useData()
  const navigate = useNavigate()

  const [showNotifs,       setShowNotifs]       = useState(false)
  const [sidebarOpen,      setSidebarOpen]      = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === '1' } catch { return false }
  })
  const [readIds,      setReadIds]      = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('notif_read') || '[]')) } catch { return new Set() }
  })
  const [showProfile,  setShowProfile]  = useState(false)
  const [showChangePw, setShowChangePw] = useState(false)
  const profileRef    = useRef(null)
  const inactivityRef = useRef(null)
  const location      = useLocation()

  const sideW = sidebarCollapsed ? 56 : 224

  // ── Rastrear atividade e expirar sessão por inatividade ───
  useEffect(() => {
    // Verifica se sessão expirou ao montar
    if (isSessionExpired()) { onLogout(); return }
    touchActivity()

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'mousemove']
    function resetTimer() {
      touchActivity()
      clearTimeout(inactivityRef.current)
      inactivityRef.current = setTimeout(() => onLogout(), INACTIVITY_MS)
    }

    events.forEach(ev => window.addEventListener(ev, resetTimer, { passive: true }))
    inactivityRef.current = setTimeout(() => onLogout(), INACTIVITY_MS)

    return () => {
      clearTimeout(inactivityRef.current)
      events.forEach(ev => window.removeEventListener(ev, resetTimer))
    }
  }, [onLogout])

  function toggleSidebar() {
    setSidebarCollapsed(v => {
      const next = !v
      try { localStorage.setItem('sidebar_collapsed', next ? '1' : '0') } catch {}
      return next
    })
  }

  // Gera notificacoes dinamicas
  const notifs = useMemo(() => buildNotifications(tasks, erpClients), [tasks, erpClients])
  const unread = notifs.filter(n => !readIds.has(n.id)).length

  function markRead(id) {
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      try { localStorage.setItem('notif_read', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  function markAllRead() {
    const next = new Set(notifs.map(n => n.id))
    setReadIds(next)
    try { localStorage.setItem('notif_read', JSON.stringify([...next])) } catch {}
  }

  function handleNotifClick(notif) {
    markRead(notif.id)
    setShowNotifs(false)
    if (notif.path) navigate(notif.path)
  }

  useEffect(() => {
    function handleClick(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false)
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
        {/* ── Topbar ── */}
        <motion.div
          className="fixed top-0 right-0 h-12 bg-white border-b border-border flex items-center px-4 z-40"
          style={{ boxShadow: '0 1px 0 #e0e3f0', left: 0 }}
          animate={{ left: sideW }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Mobile hamburger */}
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-3 p-1.5 rounded-xl text-muted hover:bg-surface transition-colors">
            <Menu size={18} />
          </button>

          {/* Desktop collapse toggle */}
          <button onClick={toggleSidebar}
            className="hidden lg:flex mr-3 p-1.5 rounded-xl text-muted hover:bg-surface hover:text-text-2 transition-colors"
            title={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}>
            {sidebarCollapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}
          </button>

          <p className="text-xs font-bold text-muted flex-1 truncate">{breadcrumb}</p>

          <div className="flex items-center gap-2">
            {/* Sync status */}
            <SyncStatus onSync={syncTasks} syncing={syncing} pendingOps={pendingOps} />

            {/* Bell */}
            <div className="relative">
              <button onClick={() => setShowNotifs(v => !v)}
                className="relative w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                <Bell size={15} />
                {unread > 0 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-[#0f1117]"
                    style={{ backgroundColor: '#6eda2c' }}>
                    {unread}
                  </motion.div>
                )}
              </button>
            </div>

            {/* User avatar */}
            {user && (
              <div ref={profileRef} className="relative flex items-center gap-2 pl-2 border-l border-border">
                <button onClick={() => setShowProfile(v => !v)}
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold text-white"
                  style={{ backgroundColor: user.color }}
                  title={`${user.name} · ${user.role}`}>
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
                        <button onClick={() => { setShowProfile(false); setShowChangePw(true) }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-text-2 hover:bg-surface transition-colors">
                          <KeyRound size={13} className="text-muted" /> Trocar senha
                        </button>
                        <button onClick={onLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-danger hover:bg-danger/5 transition-colors">
                          <LogOut size={13} /> Sair
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <button onClick={onLogout}
                  className="w-7 h-7 rounded-xl flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  title="Sair">
                  <LogOut size={13} />
                </button>
              </div>
            )}
          </div>
        </motion.div>

        <main className="flex-1 pt-12">
          <Outlet />
        </main>
      </motion.div>

      {/* ── Painel de notificacoes ── */}
      <AnimatePresence>
        {showNotifs && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-50" onClick={() => setShowNotifs(false)} />
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
                  <p className="text-sm font-extrabold text-text">Notificacoes</p>
                  {unread > 0 && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full text-[#0f1117]"
                      style={{ backgroundColor: '#6eda2c' }}>{unread}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="text-[10px] text-accent font-bold hover:underline">
                      Marcar lidas
                    </button>
                  )}
                  <button onClick={() => setShowNotifs(false)} className="text-muted hover:text-text-2">
                    <X size={14} />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {notifs.length === 0 ? (
                  <div className="flex flex-col items-center py-10 text-center">
                    <span className="text-3xl mb-2">🎉</span>
                    <p className="text-sm font-bold text-text">Tudo em dia!</p>
                    <p className="text-xs text-muted mt-1">Nenhum alerta no momento</p>
                  </div>
                ) : notifs.map((n, i) => {
                  const isRead = readIds.has(n.id)
                  return (
                    <motion.div
                      key={n.id}
                      initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleNotifClick(n)}
                      className={`flex items-start gap-3 px-4 py-3 border-b border-border/40 cursor-pointer hover:bg-surface-2 transition-colors ${!isRead ? 'bg-accent/[0.03]' : ''}`}
                    >
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: n.color + '18' }}>
                        {n.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-xs leading-snug ${!isRead ? 'font-bold text-text' : 'font-semibold text-text-2'}`}>
                          {n.title}
                        </p>
                        <p className="text-[10px] text-muted mt-0.5">{n.detail}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                        {n.time && <span className="text-[9px] text-muted">{n.time}</span>}
                        {!isRead && <div className="w-1.5 h-1.5 rounded-full bg-accent" />}
                      </div>
                    </motion.div>
                  )
                })}
              </div>

              {notifs.length > 0 && (
                <div className="px-4 py-3 border-t border-border">
                  <button
                    onClick={() => { setShowNotifs(false); navigate('/entregas') }}
                    className="w-full text-xs text-accent font-bold text-center hover:underline">
                    Ver todas as tarefas
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Modal trocar senha ── */}
      <AnimatePresence>
        {showChangePw && (
          <ChangePasswordModal user={user} onClose={() => setShowChangePw(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}
