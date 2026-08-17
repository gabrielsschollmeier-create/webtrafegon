import { useState, useRef, useEffect, useMemo } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, LogOut, X, Menu, KeyRound, Eye, EyeOff, Check, PanelLeftClose, PanelLeftOpen, Search } from 'lucide-react'
import Sidebar from './Sidebar'
import UserAvatar from './UserAvatar'
import SyncStatus from './SyncStatus'
import FloatingNexus from './FloatingNexus'
import BeltBadge from './BeltBadge'
import { BELTS } from '../data/belt-system'
import { updateUserPasswordLocal } from '../data/users-store'
import { useData } from '../contexts/DataContext'
import { supabase, supabaseReady } from '../lib/supabase'

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
  '/integracoes':    'Integracoes',
  '/configuracoes':  'Configuracoes',
  '/erp':            'Operacional · Dashboard',
  '/clientes':       'Operacional · Clientes',
  '/workspaces':     'Operacional · Clientes',
  '/projetos':       'Operacional · Clientes',
  '/entregas':       'Operacional · Tarefas',
  '/equipe':         'Operacional · Equipe',
  '/permissoes':     'Permissoes & Acessos',
  '/home':           'Inicio',
  '/playbooks':      'Operacional · Playbooks',

  '/agenda':         'Operacional · Agenda Interna',
  '/conhecimento':   'IA · Base de Conhecimento',
}

function timeAgo(dateStr) {
  if (!dateStr) return ''
  const diff = Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / 86400000)
  if (diff === 0) return 'hoje'
  if (diff === 1) return '1d'
  return `${diff}d`
}

/* ── Gera notificacoes separadas: pessoais + gerais ── */
function buildNotifications(tasks, erpClients, userId, userEmail, collaborators) {
  const now      = new Date()
  const today    = now.toLocaleDateString('en-CA')
  const d1       = new Date(now); d1.setDate(now.getDate() + 1)
  const tomorrow = d1.toLocaleDateString('en-CA')
  const d3       = new Date(now); d3.setDate(now.getDate() + 3)
  const in3days  = d3.toLocaleDateString('en-CA')

  // Resolve ID do colaborador: usuários Supabase têm UUID como id, mas
  // as tarefas usam o slug de colaborador ('gs', 'tochiro', etc.)
  // Tentamos casar pelo email primeiro, depois pelo id diretamente.
  const collabId = (collaborators || []).find(c => c.email === userEmail)?.id || userId
  const myIds    = new Set([String(collabId), String(userId)].filter(Boolean))
  const myTasks  = tasks.filter(t => myIds.has(String(t.assignee)))

  /* ─ Pessoais: apenas do usuario logado ─ */
  const personal = []

  // Minhas atrasadas
  myTasks
    .filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      personal.push({
        id: `late_${t.id}`, icon: '🔴',
        title:  t.title + ' esta atrasada',
        detail: (client?.name || 'Sem cliente') + ' · prazo vencido há ' + timeAgo(t.dueDate),
        time: timeAgo(t.dueDate), color: '#ef4444',
        path: '/entregas', task: t,
      })
    })

  // Minhas que vencem hoje
  myTasks
    .filter(t => t.status !== 'done' && t.dueDate === today)
    .slice(0, 4)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      personal.push({
        id: `today_${t.id}`, icon: '⚠️',
        title:  t.title + ' vence hoje',
        detail: (client?.name || 'Sem cliente') + ' · entrega urgente',
        time: 'hoje', color: '#ea8a29',
        path: '/entregas', task: t,
      })
    })

  // Minhas que vencem amanhã
  myTasks
    .filter(t => t.status !== 'done' && t.dueDate === tomorrow)
    .slice(0, 3)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      personal.push({
        id: `tomorrow_${t.id}`, icon: '🕐',
        title:  t.title + ' vence amanhã',
        detail: (client?.name || 'Sem cliente') + ' · prepare a entrega',
        time: 'amanhã', color: '#f97316',
        path: '/entregas', task: t,
      })
    })

  // Minhas que vencem em breve (2–3 dias)
  myTasks
    .filter(t => t.status !== 'done' && t.dueDate > tomorrow && t.dueDate <= in3days)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 2)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      const dias   = Math.ceil((new Date(t.dueDate + 'T00:00:00') - now) / 86400000)
      personal.push({
        id: `soon_${t.id}`, icon: '📅',
        title:  t.title,
        detail: (client?.name || 'Sem cliente') + ` · vence em ${dias} dias`,
        time: `${dias}d`, color: '#60a5fa',
        path: '/entregas', task: t,
      })
    })

  // Minhas em revisao
  myTasks
    .filter(t => t.status === 'review')
    .slice(0, 3)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      personal.push({
        id: `review_${t.id}`, icon: '👀',
        title:  t.title + ' aguarda revisao',
        detail: (client?.name || 'Sem cliente') + ' · pendente de aprovacao',
        time: '', color: '#be29ec',
        path: '/entregas', task: t,
      })
    })

  // Minhas a fazer — próximas sem ser amanhã ou logo
  myTasks
    .filter(t => t.status === 'todo' && t.dueDate && t.dueDate > in3days)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      personal.push({
        id: `todo_${t.id}`, icon: '📋',
        title:  t.title,
        detail: (client?.name || 'Sem cliente') + ' · a fazer',
        time: t.dueDate ? new Date(t.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }) : '',
        color: '#8890b5',
        path: '/entregas', task: t,
      })
    })

  /* ─ Gerais: visivel para toda equipe ─ */
  const general = []

  // Clientes em risco
  erpClients
    .filter(c => c.status === 'at_risk')
    .slice(0, 4)
    .forEach(c => {
      general.push({
        id: `risk_${c.id}`, icon: '⚡',
        title:  c.name + ' esta em risco',
        detail: 'Atencao necessaria — cliente precisa de suporte',
        time: '', color: '#f59e0b',
        path: `/workspaces/${c.id}`, task: null,
      })
    })

  // Tarefas de outros membros em revisao — pedem aprovacao coletiva
  tasks
    .filter(t => t.status === 'review' && !myIds.has(String(t.assignee)))
    .slice(0, 4)
    .forEach(t => {
      const client = erpClients.find(c => c.id === t.clientId)
      general.push({
        id: `review_team_${t.id}`, icon: '👁️',
        title:  t.title + ' aguarda aprovacao',
        detail: (client?.name || 'Sem cliente') + ' · precisa de revisao do time',
        time: '', color: '#be29ec',
        path: '/entregas', task: t,
      })
    })

  return { personal: personal.slice(0, 12), general: general.slice(0, 8) }
}

/* ── Busca Global ──────────────────────────────────────────── */
function GlobalSearch({ onClose, erpClients, tasks }) {
  const navigate   = useNavigate()
  const inputRef   = useRef(null)
  const [q, setQ]  = useState('')

  useEffect(() => { inputRef.current?.focus() }, [])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const term = q.trim().toLowerCase()

  const results = term.length < 2 ? [] : [
    ...erpClients
      .filter(c => c.name.toLowerCase().includes(term) || (c.niche || '').toLowerCase().includes(term))
      .slice(0, 4)
      .map(c => ({ id: `c_${c.id}`, icon: '🏢', label: c.name, sub: c.niche || '', color: c.color, path: `/workspaces/${c.id}` })),
    ...tasks
      .filter(t => t.title.toLowerCase().includes(term))
      .slice(0, 4)
      .map(t => {
        const client = erpClients.find(c => c.id === t.clientId)
        return { id: `t_${t.id}`, icon: '📦', label: t.title, sub: client?.name || '', color: '#60a5fa', path: '/entregas' }
      }),
  ]

  function go(path) { navigate(path); onClose() }

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -12, scale: 0.97 }}
        transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-[72px] left-1/2 -translate-x-1/2 w-[calc(100vw-32px)] max-w-lg z-[61] bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 24px 60px rgba(26,29,46,0.22), 0 0 0 1px rgba(26,29,46,0.08)' }}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border">
          <Search size={15} className="text-muted flex-shrink-0" />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Buscar clientes e tarefas..."
            className="flex-1 text-sm text-text placeholder:text-muted bg-transparent focus:outline-none"
          />
          <kbd className="text-[10px] text-muted border border-border rounded px-1.5 py-0.5 font-mono">Esc</kbd>
        </div>

        {results.length > 0 && (
          <div className="py-1.5 max-h-72 overflow-y-auto">
            {results.map(r => (
              <button key={r.id} onClick={() => go(r.path)}
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-surface-2 transition-colors text-left">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0"
                  style={{ backgroundColor: r.color + '18' }}>
                  {r.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-text truncate">{r.label}</p>
                  {r.sub && <p className="text-[10px] text-muted truncate">{r.sub}</p>}
                </div>
                <span className="text-[10px] text-muted">→</span>
              </button>
            ))}
          </div>
        )}

        {term.length >= 2 && results.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-sm font-bold text-text-2">Nenhum resultado</p>
            <p className="text-xs text-muted mt-1">Tente outro termo</p>
          </div>
        )}

        {term.length < 2 && (
          <div className="py-5 px-4 flex flex-wrap gap-2">
            {erpClients.slice(0, 6).map(c => (
              <button key={c.id} onClick={() => go(`/workspaces/${c.id}`)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-colors hover:bg-surface-2"
                style={{ color: c.color, backgroundColor: c.color + '12' }}>
                {c.name[0]} {c.name}
              </button>
            ))}
          </div>
        )}
      </motion.div>
    </>
  )
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
  const { tasks, erpClients, collaborators, syncTasks, syncing, pendingOps } = useData()
  const navigate   = useNavigate()
  const userCollab = collaborators?.find(c => c.email === user?.email || c.id === user?.id)
  const userBelt   = userCollab?.belt ?? 'branca'
  const userGrau   = userCollab?.grau ?? 0

  const [showSearch,       setShowSearch]       = useState(false)
  const [showNotifs,       setShowNotifs]       = useState(false)
  const [eventNotifs,      setEventNotifs]      = useState([])
  const [sidebarOpen,      setSidebarOpen]      = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    try { return localStorage.getItem('sidebar_collapsed') === '1' } catch { return false }
  })
  const [readIds,      setReadIds]      = useState(() => {
    try { return new Set(JSON.parse(localStorage.getItem('notif_read') || '[]')) } catch { return new Set() }
  })
  const [showProfile,  setShowProfile]  = useState(false)
  const [showChangePw, setShowChangePw] = useState(false)
  const [saveErrMsg,   setSaveErrMsg]   = useState(null)
  const profileRef    = useRef(null)
  const inactivityRef = useRef(null)
  const location      = useLocation()

  const [isDesktop, setIsDesktop] = useState(() => typeof window !== 'undefined' && window.innerWidth >= 1024)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    function handler(e) { setIsDesktop(e.matches) }
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  useEffect(() => {
    function onSaveError(e) {
      setSaveErrMsg(e.detail?.msg || 'Erro ao salvar. Tente novamente.')
      setTimeout(() => setSaveErrMsg(null), 6000)
    }
    window.addEventListener('trafegon:save-error', onSaveError)
    return () => window.removeEventListener('trafegon:save-error', onSaveError)
  }, [])

  const [lsWarning, setLsWarning] = useState(false)
  const [mqWarning, setMqWarning] = useState(null)
  useEffect(() => {
    function onQuota() { setLsWarning(true) }
    function onDiscard(e) {
      const label = e.detail?.type === 'insert_task' ? 'criação de tarefa'
        : e.detail?.type === 'update_task' ? 'atualização de tarefa'
        : e.detail?.type === 'delete_task' ? 'exclusão de tarefa'
        : 'operação'
      setMqWarning(`Uma ${label} não pôde ser sincronizada após várias tentativas. Verifique sua conexão.`)
    }
    window.addEventListener('ls-quota-exceeded', onQuota)
    window.addEventListener('mq-op-discarded', onDiscard)
    return () => {
      window.removeEventListener('ls-quota-exceeded', onQuota)
      window.removeEventListener('mq-op-discarded', onDiscard)
    }
  }, [])

  const sideW = sidebarCollapsed ? 56 : 224

  // ── ton:navigate — navegação via assistente ──────────────────────────────
  useEffect(() => {
    function handleTonNav(e) { if (e.detail?.path) navigate(e.detail.path) }
    window.addEventListener('ton:navigate', handleTonNav)
    return () => window.removeEventListener('ton:navigate', handleTonNav)
  }, [navigate])

  // ── Redireciona para /erp se usuário caiu em / sem ter acesso ao CRM ───
  useEffect(() => {
    const overrides = user?.moduleOverrides ?? {}
    if (location.pathname === '/' && overrides['/'] === false && overrides['/erp'] !== false) {
      navigate('/erp', { replace: true })
    }
  }, [])

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

  useEffect(() => {
    function onKey(e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); setShowSearch(v => !v) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function toggleSidebar() {
    setSidebarCollapsed(v => {
      const next = !v
      try { localStorage.setItem('sidebar_collapsed', next ? '1' : '0') } catch {}
      return next
    })
  }

  // Slug do colaborador logado — nunca usa UUID como fallback para evitar mismatch
  const collabId = useMemo(() => {
    return collaborators?.find(c => c.email === user?.email)?.id || null
  }, [collaborators, user?.email])

  // Busca notificacoes de evento do Supabase + subscription realtime
  useEffect(() => {
    if (!collabId || !supabaseReady) return
    supabase.from('notifications')
      .select('*')
      .eq('target_collab_id', collabId)
      .order('created_at', { ascending: false })
      .limit(15)
      .then(({ data }) => setEventNotifs(data || []))

    const channel = supabase
      .channel(`ev-notifs-${collabId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'notifications',
        filter: `target_collab_id=eq.${collabId}`,
      }, ({ new: row }) => setEventNotifs(prev => [row, ...prev].slice(0, 15)))
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [collabId])

  // Gera notificacoes dinamicas — pessoais + gerais
  const { personal, general } = useMemo(
    () => buildNotifications(tasks, erpClients, user?.id, user?.email, collaborators),
    [tasks, erpClients, user?.id, user?.email, collaborators]
  )
  const allNotifs     = [...personal, ...general]
  const eventUnread   = eventNotifs.filter(n => !n.read).length
  const unread        = allNotifs.filter(n => !readIds.has(n.id)).length + eventUnread

  async function markEventRead(id) {
    setEventNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    if (supabaseReady) await supabase.from('notifications').update({ read: true }).eq('id', id)
  }

  async function markAllEventsRead() {
    const ids = eventNotifs.filter(n => !n.read).map(n => n.id)
    if (!ids.length) return
    setEventNotifs(prev => prev.map(n => ({ ...n, read: true })))
    if (supabaseReady) await supabase.from('notifications').update({ read: true }).in('id', ids)
  }

  function markRead(id) {
    setReadIds(prev => {
      const next = new Set(prev)
      next.add(id)
      try { localStorage.setItem('notif_read', JSON.stringify([...next])) } catch {}
      return next
    })
  }

  function markAllRead() {
    const next = new Set(allNotifs.map(n => n.id))
    setReadIds(next)
    try { localStorage.setItem('notif_read', JSON.stringify([...next])) } catch {}
    markAllEventsRead()
  }

  function handleNotifClick(notif) {
    markRead(notif.id)
    setShowNotifs(false)
    if (notif.task) {
      // Abre a tarefa diretamente no modal de edicao
      navigate('/entregas', { state: { openTask: notif.task } })
    } else if (notif.path) {
      navigate(notif.path)
    }
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
      {/* ── Copa 2026 Ribbon ── */}
      <style>{`
        @keyframes copa-slide{0%{background-position:0% 50%}100%{background-position:200% 50%}}
        @keyframes copa-glow{0%,100%{box-shadow:0 0 6px rgba(255,223,0,0.55),0 2px 14px rgba(0,156,59,0.3)}50%{box-shadow:0 0 14px rgba(255,223,0,0.9),0 2px 28px rgba(0,156,59,0.55)}}
      `}</style>
      <div style={{
        position:'fixed', top:0, left:0, right:0, height:4, zIndex:300, pointerEvents:'none',
        background:'linear-gradient(90deg,#009C3B,#FFDF00,#00c44a,#FFE44d,#009C3B,#FFDF00)',
        backgroundSize:'300% 100%',
        animation:'copa-slide 3s linear infinite, copa-glow 2s ease-in-out infinite',
      }} />

      {lsWarning && (
        <div className="fixed top-4 left-1/2 z-[500] -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl"
          style={{ background: '#ef4444', color: '#fff', maxWidth: 480 }}>
          <span>⚠</span>
          <span>Armazenamento local cheio — dados offline podem não ser salvos. Conecte-se à internet para sincronizar.</span>
          <button onClick={() => setLsWarning(false)} className="ml-1 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}
      {mqWarning && (
        <div className="fixed top-4 left-1/2 z-[500] -translate-x-1/2 flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-bold shadow-xl"
          style={{ background: '#ef4444', color: '#fff', maxWidth: 520 }}>
          <span>⚠</span>
          <span>{mqWarning}</span>
          <button onClick={() => setMqWarning(null)} className="ml-1 opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <Sidebar user={user} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} collapsed={sidebarCollapsed} />

      <motion.div
        className="flex-1 flex flex-col min-h-screen min-w-0 overflow-x-hidden"
        animate={{ marginLeft: isDesktop ? sideW : 0 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        style={{ marginLeft: isDesktop ? sideW : 0 }}
      >
        {/* ── Topbar ── */}
        <motion.div
          className="fixed top-0 right-0 h-12 bg-white border-b border-border flex items-center px-4 z-40"
          style={{ boxShadow: '0 1px 0 #e0e3f0', left: 0 }}
          animate={{ left: isDesktop ? sideW : 0 }}
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

            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="hidden sm:flex items-center gap-2 h-8 px-3 rounded-xl border border-border text-xs text-muted hover:text-text-2 hover:border-accent/30 hover:bg-surface transition-colors"
              title="Busca global (Ctrl+K)"
            >
              <Search size={13} />
              <span>Buscar</span>
              <kbd className="text-[9px] border border-border rounded px-1 font-mono ml-1">⌃K</kbd>
            </button>
            <button
              onClick={() => setShowSearch(true)}
              className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors"
            >
              <Search size={15} />
            </button>

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
                <div className="flex items-center gap-1.5">
                  <button onClick={() => setShowProfile(v => !v)}
                    className="rounded-full p-0 border-0 bg-transparent"
                    title={`${user.name} · ${user.role}`}>
                    <UserAvatar user={user} size={28} />
                  </button>
                  <BeltBadge beltId={userBelt} grau={userGrau} size="xs" />
                </div>

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

        <main className="flex-1 pt-12" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
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
              {/* Header */}
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

              <div className="max-h-[70vh] overflow-y-auto">

                {/* ─ Secao: Atividade recente (eventos do Supabase) ─ */}
                {eventNotifs.length > 0 && (() => {
                  const EVENT_CFG = {
                    task_assigned:   { icon: '👋', color: '#6eda2c' },
                    task_unassigned: { icon: '🔕', color: '#ef4444' },
                    task_moved:      { icon: '🔁', color: '#60a5fa' },
                    task_deleted:    { icon: '🗑️', color: '#ef4444' },
                    co_added:        { icon: '➕', color: '#6eda2c' },
                    co_removed:      { icon: '➖', color: '#ef4444' },
                  }
                  return (
                    <>
                      <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                        <span className="text-[10px] font-extrabold text-text-2 uppercase tracking-wide">Atividade recente</span>
                        {eventUnread > 0 && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                            style={{ background: '#6eda2c18', color: '#6eda2c' }}>
                            {eventUnread} nova{eventUnread > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      {eventNotifs.map((n, i) => {
                        const cfg = EVENT_CFG[n.event_type] || { icon: '🔔', color: '#8890b5' }
                        return (
                          <motion.div key={n.id}
                            initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            onClick={() => { if (!n.read) markEventRead(n.id); setShowNotifs(false); navigate('/entregas') }}
                            className={`flex items-start gap-3 px-4 py-2.5 border-b border-border/30 cursor-pointer hover:bg-surface-2 transition-colors ${!n.read ? 'bg-accent/[0.03]' : ''}`}
                          >
                            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: cfg.color + '18' }}>
                              {cfg.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs leading-snug ${!n.read ? 'font-bold text-text' : 'font-semibold text-text-2'}`}>
                                {n.message}
                              </p>
                              {n.task_title && n.message && !n.message.includes(n.task_title) && (
                                <p className="text-[10px] text-muted mt-0.5 truncate">{n.task_title}</p>
                              )}
                              <p className="text-[9px] text-muted/60 mt-0.5">
                                {(() => {
                                  const diff = Math.floor((Date.now() - new Date(n.created_at).getTime()) / 60000)
                                  if (diff < 1) return 'agora'
                                  if (diff < 60) return `${diff}min atrás`
                                  const h = Math.floor(diff / 60)
                                  if (h < 24) return `${h}h atrás`
                                  return `${Math.floor(h / 24)}d atrás`
                                })()}
                              </p>
                            </div>
                            {!n.read && <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#6eda2c' }} />}
                          </motion.div>
                        )
                      })}
                    </>
                  )
                })()}

                {/* ─ Secao: Minhas ─ */}
                {personal.length > 0 && (
                  <>
                    <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-text-2 uppercase tracking-wide">Minhas tarefas</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: '#6eda2c18', color: '#6eda2c' }}>
                        {personal.filter(n => !readIds.has(n.id)).length} novas
                      </span>
                    </div>
                    {personal.map((n, i) => {
                      const isRead = readIds.has(n.id)
                      return (
                        <motion.div key={n.id}
                          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleNotifClick(n)}
                          className={`flex items-start gap-3 px-4 py-2.5 border-b border-border/30 cursor-pointer hover:bg-surface-2 transition-colors ${!isRead ? 'bg-accent/[0.03]' : ''}`}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: n.color + '18' }}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-snug ${!isRead ? 'font-bold text-text' : 'font-semibold text-text-2'}`}>
                              {n.title}
                            </p>
                            <p className="text-[10px] text-muted mt-0.5">{n.detail}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {n.time && <span className="text-[9px] text-muted">{n.time}</span>}
                            <span className="text-[8px] font-bold" style={{ color: n.color }}>Abrir →</span>
                            {!isRead && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: '#6eda2c' }} />}
                          </div>
                        </motion.div>
                      )
                    })}
                  </>
                )}

                {/* ─ Secao: Geral do time ─ */}
                {general.length > 0 && (
                  <>
                    <div className="px-4 pt-3 pb-1.5 flex items-center gap-2">
                      <span className="text-[10px] font-extrabold text-text-2 uppercase tracking-wide">Geral — time</span>
                    </div>
                    {general.map((n, i) => {
                      const isRead = readIds.has(n.id)
                      return (
                        <motion.div key={n.id}
                          initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.03 }}
                          onClick={() => handleNotifClick(n)}
                          className={`flex items-start gap-3 px-4 py-2.5 border-b border-border/30 cursor-pointer hover:bg-surface-2 transition-colors ${!isRead ? 'bg-accent/[0.03]' : ''}`}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                            style={{ backgroundColor: n.color + '18' }}>
                            {n.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs leading-snug ${!isRead ? 'font-bold text-text' : 'font-semibold text-text-2'}`}>
                              {n.title}
                            </p>
                            <p className="text-[10px] text-muted mt-0.5">{n.detail}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1 flex-shrink-0">
                            {n.time && <span className="text-[9px] text-muted">{n.time}</span>}
                            <span className="text-[8px] font-bold" style={{ color: n.color }}>Ver →</span>
                            {!isRead && <div className="w-1.5 h-1.5 rounded-full mt-0.5" style={{ backgroundColor: '#6eda2c' }} />}
                          </div>
                        </motion.div>
                      )
                    })}
                  </>
                )}

                {/* Estado vazio */}
                {personal.length === 0 && general.length === 0 && eventNotifs.length === 0 && (
                  <div className="flex flex-col items-center py-10 text-center">
                    <span className="text-3xl mb-2">🎉</span>
                    <p className="text-sm font-bold text-text">Tudo em dia!</p>
                    <p className="text-xs text-muted mt-1">Nenhum alerta no momento</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-border">
                <button
                  onClick={() => { setShowNotifs(false); navigate('/entregas') }}
                  className="w-full text-xs text-accent font-bold text-center hover:underline">
                  Ver todas as tarefas →
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Busca Global ── */}
      <AnimatePresence>
        {showSearch && (
          <GlobalSearch
            onClose={() => setShowSearch(false)}
            erpClients={erpClients}
            tasks={tasks}
          />
        )}
      </AnimatePresence>

      {/* ── Modal trocar senha ── */}
      <AnimatePresence>
        {showChangePw && (
          <ChangePasswordModal user={user} onClose={() => setShowChangePw(false)} />
        )}
      </AnimatePresence>

      {/* ── TON — Agente flutuante ── */}
      <FloatingNexus />

      {/* ── Toast de erro de salvamento ── */}
      <AnimatePresence>
        {saveErrMsg && (
          <motion.div
            key="save-err-toast"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            style={{
              position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
              zIndex: 99998, display: 'flex', alignItems: 'center', gap: 10,
              padding: '11px 16px', borderRadius: 12,
              background: '#2a1010', border: '1px solid #7f1d1d',
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              fontFamily: 'system-ui, sans-serif', fontSize: 13, color: '#fca5a5',
              maxWidth: 'calc(100vw - 32px)',
            }}
          >
            <span style={{ fontSize: 16 }}>⚠️</span>
            <span>{saveErrMsg}</span>
            <button onClick={() => setSaveErrMsg(null)}
              style={{ marginLeft: 6, background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: 16, lineHeight: 1 }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
