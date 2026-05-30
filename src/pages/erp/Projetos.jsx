import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  LayoutGrid, Kanban, Filter, ChevronRight, AlertTriangle,
  Clock, CheckCircle2, Zap, Flag, Users, TrendingUp, Star,
  ArrowUpRight, Circle,
} from 'lucide-react'
import { taskTypes, statusConfig, erpClients as mockClients, tasks as mockTasks, collaborators as mockCollaborators } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import UserAvatar from '../../components/UserAvatar'
const today      = new Date().toISOString().split('T')[0]
const fmtDate    = d => new Date(d + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
const isOverdue  = t => t.dueDate < today && t.status !== 'done'
const xpForTask  = t => taskTypes[t.type]?.xp ?? 50

const PRIORITY_CFG = {
  high:   { label: 'Alta',  color: '#ef4444', dot: '🔴' },
  medium: { label: 'Média', color: '#ea8a29', dot: '🟡' },
  low:    { label: 'Baixa', color: '#8890b5', dot: '⚪' },
}

/* ── XP progress ring ───────────────────────────────── */
function Ring({ pct, color, size = 56, stroke = 5 }) {
  const r   = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const off  = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color + '20'} strokeWidth={stroke} />
      <motion.circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: off }}
        transition={{ duration: 1, ease: [0.22,1,0.36,1] }}
      />
    </svg>
  )
}

/* ── Badge de conquista ─────────────────────────────── */
function AchievementBadge({ icon, label, color }) {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-extrabold"
      style={{ background: color + '18', color, border: `1px solid ${color}30` }}>
      {icon} {label}
    </span>
  )
}

/* ── Card de projeto (visão Cards) ──────────────────── */
function ProjectCard({ client, clientTasks, delay, collabMap }) {
  const navigate = useNavigate()

  const done     = clientTasks.filter(t => t.status === 'done').length
  const doing    = clientTasks.filter(t => t.status === 'doing').length
  const review   = clientTasks.filter(t => t.status === 'review').length
  const todo     = clientTasks.filter(t => t.status === 'todo').length
  const overdue  = clientTasks.filter(isOverdue).length
  const total    = clientTasks.length
  const pct      = total > 0 ? Math.round((done / total) * 100) : 0
  const xpEarned = clientTasks.filter(t => t.status === 'done').reduce((s, t) => s + xpForTask(t), 0)
  const manager  = collabMap?.[client.manager]

  const badges = []
  if (pct === 100 && total > 0) badges.push({ icon: '🏆', label: '100% entregue', color: '#6eda2c' })
  if (overdue === 0 && total > 0) badges.push({ icon: '⚡', label: 'No prazo',     color: '#60a5fa' })
  if (client.status === 'at_risk') badges.push({ icon: '⚠️', label: 'Em risco',    color: '#ef4444' })
  if (done >= 3) badges.push({ icon: '🔥', label: 'Alta entrega',              color: '#ea8a29' })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22,1,0.36,1] }}
      whileHover={{ y: -3 }}
      className="bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{ boxShadow: '0 2px 16px rgba(26,29,46,0.09)' }}
      onClick={() => navigate(`/workspaces/${client.id}`)}
    >
      {/* Color bar */}
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${client.color}, ${client.color}70)` }} />

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-base font-extrabold text-white"
              style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}90)`, boxShadow: `0 4px 12px ${client.color}35` }}>
              {client.name[0]}
            </div>
            <div>
              <p className="text-sm font-extrabold text-text">{client.name}</p>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ background: client.color + '15', color: client.color }}>
                {client.niche}
              </span>
            </div>
          </div>

          {/* Ring */}
          <div className="relative flex-shrink-0">
            <Ring pct={pct} color={client.color} size={52} stroke={4} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[11px] font-extrabold" style={{ color: client.color }}>{pct}%</span>
            </div>
          </div>
        </div>

        {/* Task status mini-bar */}
        <div className="mb-3">
          <div className="flex h-1.5 rounded-full overflow-hidden gap-px">
            {[
              { v: done,   c: '#6eda2c' },
              { v: review, c: '#ea8a29' },
              { v: doing,  c: '#60a5fa' },
              { v: todo,   c: '#e2e5f0' },
            ].map((s, i) => (
              <motion.div key={i} className="h-full rounded-sm"
                style={{ width: total > 0 ? `${(s.v/total)*100}%` : (i===3?'100%':'0%'), background: s.c }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: delay + 0.2 + i*0.05, ease: [0.22,1,0.36,1] }}
              />
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[
            { label: 'Concluído', value: done,   color: '#6eda2c', icon: '✓' },
            { label: 'Revisão',   value: review, color: '#ea8a29', icon: '↻' },
            { label: 'Fazendo',   value: doing,  color: '#60a5fa', icon: '▶' },
            { label: 'A fazer',   value: todo,   color: '#8890b5', icon: '○' },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl py-2" style={{ background: s.color + '0d' }}>
              <p className="text-base font-extrabold" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-bold text-muted uppercase tracking-wide">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Conquistas */}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {badges.map(b => <AchievementBadge key={b.label} {...b} />)}
          </div>
        )}

        {/* Alerta atraso */}
        {overdue > 0 && (
          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-xl"
            style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
            <AlertTriangle size={12} style={{ color: '#ef4444', flexShrink: 0 }} />
            <p className="text-xs font-bold text-danger">{overdue} tarefa{overdue > 1 ? 's' : ''} atrasada{overdue > 1 ? 's' : ''}</p>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3" style={{ borderTop: '1px solid #edf0f7' }}>
          <div className="flex items-center gap-2">
            {manager && (
              <div className="flex items-center gap-1.5">
                <UserAvatar user={manager} size={20} />
                <span className="text-[10px] text-muted font-medium">{manager.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={11} style={{ color: '#ea8a29' }} />
            <span className="text-[10px] font-extrabold" style={{ color: '#ea8a29' }}>{xpEarned} ons</span>
            <ChevronRight size={13} className="text-muted group-hover:text-text transition-colors ml-1" />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Kanban task card ───────────────────────────────── */
function KanbanCard({ task, delay, collabMap, clientMap }) {
  const navigate = useNavigate()
  const client   = clientMap?.[task.clientId]
  const assignee = collabMap?.[task.assignee]
  const type     = taskTypes[task.type]
  const priority = PRIORITY_CFG[task.priority]
  const overdue  = isOverdue(task)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px rgba(26,29,46,0.14)' }}
      className="bg-white rounded-xl p-3.5 cursor-pointer"
      style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08)', borderLeft: `3px solid ${client?.color ?? '#e2e5f0'}` }}
      onClick={() => navigate(`/workspaces/${task.clientId}`)}
    >
      {/* Type + Priority */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-1"
          style={{ color: type?.color, background: (type?.color ?? '#888') + '18' }}>
          {type?.icon} {type?.label}
        </span>
        <span className="text-[10px]" title={priority?.label}>{priority?.dot}</span>
      </div>

      {/* Title */}
      <p className="text-xs font-bold text-text leading-snug mb-2">{task.title}</p>

      {/* Client tag */}
      <div className="flex items-center gap-1 mb-2.5">
        <div className="w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[7px] font-extrabold text-white"
          style={{ backgroundColor: client?.color }}>
          {client?.name[0]}
        </div>
        <span className="text-[10px] font-semibold" style={{ color: client?.color }}>{client?.name}</span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {assignee && (
            <UserAvatar user={assignee} size={20} />
          )}
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-semibold ${overdue ? 'text-danger' : 'text-muted'}`}>
          {overdue && <AlertTriangle size={9} />}
          <Clock size={9} /> {fmtDate(task.dueDate)}
        </div>
      </div>

      {/* XP badge */}
      <div className="mt-2 pt-2 flex justify-end" style={{ borderTop: '1px solid #f1f3f9' }}>
        <span className="text-[9px] font-extrabold" style={{ color: '#ea8a29' }}>
          <Zap size={9} className="inline mr-0.5" />+{type?.xp ?? 50} ons ao concluir
        </span>
      </div>
    </motion.div>
  )
}

/* ── Coluna Kanban ──────────────────────────────────── */
function KanbanColumn({ status, tasks: colTasks, collabMap, clientMap }) {
  const cfg   = statusConfig[status]
  const xpCol = colTasks.filter(t => t.status === 'done').reduce((s, t) => s + xpForTask(t), 0)
  return (
    <div className="flex flex-col min-w-[260px] flex-1">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ background: cfg.color }} />
        <span className="text-xs font-extrabold text-text flex-1">{cfg.label}</span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ color: cfg.color, background: cfg.color + '18' }}>{colTasks.length}</span>
        {status === 'done' && xpCol > 0 && (
          <span className="text-[9px] font-extrabold ml-1" style={{ color: '#ea8a29' }}>
            ⚡{xpCol}xp
          </span>
        )}
      </div>
      {/* Cards */}
      <div className="flex flex-col gap-2 flex-1 min-h-[120px]">
        <AnimatePresence>
          {colTasks.map((t, i) => <KanbanCard key={t.id} task={t} delay={i * 0.03} collabMap={collabMap} clientMap={clientMap} />)}
        </AnimatePresence>
        {colTasks.length === 0 && (
          <div className="flex-1 rounded-xl flex items-center justify-center text-xs text-muted"
            style={{ border: '2px dashed #e2e5f0', minHeight: 80 }}>
            Sem tarefas
          </div>
        )}
      </div>
    </div>
  )
}

/* ── Barra de filtros ───────────────────────────────── */
function FilterBar({ view, setView, filters, setFilters, erpClients, collaborators }) {
  return (
    <div className="flex flex-wrap items-center gap-3 py-4 px-5 bg-white rounded-2xl"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)' }}>

      {/* View toggle */}
      <div className="flex items-center gap-1 p-1 rounded-xl" style={{ background: '#f1f3f9' }}>
        {[
          { v: 'cards',  icon: LayoutGrid, label: 'Cards'  },
          { v: 'kanban', icon: Kanban,     label: 'Kanban' },
        ].map(({ v, icon: Icon, label }) => (
          <button key={v} onClick={() => setView(v)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
            style={view === v
              ? { background: '#fff', color: '#1a1d2e', boxShadow: '0 1px 4px rgba(0,0,0,0.1)' }
              : { color: '#8890b5' }}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Cliente */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Cliente</span>
        <select
          value={filters.client}
          onChange={e => setFilters(f => ({ ...f, client: e.target.value }))}
          className="text-xs font-bold text-text border border-border rounded-lg px-2 py-1.5 outline-none"
          style={{ background: '#f8f9fc' }}
        >
          <option value="">Todos</option>
          {erpClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Responsável */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Responsável</span>
        <select
          value={filters.assignee}
          onChange={e => setFilters(f => ({ ...f, assignee: e.target.value }))}
          className="text-xs font-bold text-text border border-border rounded-lg px-2 py-1.5 outline-none"
          style={{ background: '#f8f9fc' }}
        >
          <option value="">Todos</option>
          {collaborators.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Prioridade */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Prioridade</span>
        <select
          value={filters.priority}
          onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))}
          className="text-xs font-bold text-text border border-border rounded-lg px-2 py-1.5 outline-none"
          style={{ background: '#f8f9fc' }}
        >
          <option value="">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
      </div>

      {/* Status do cliente */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Status</span>
        <select
          value={filters.status}
          onChange={e => setFilters(f => ({ ...f, status: e.target.value }))}
          className="text-xs font-bold text-text border border-border rounded-lg px-2 py-1.5 outline-none"
          style={{ background: '#f8f9fc' }}
        >
          <option value="">Todos</option>
          <option value="active">Ativos</option>
          <option value="at_risk">Em risco</option>
        </select>
      </div>

      {/* Limpar filtros */}
      {(filters.client || filters.assignee || filters.priority || filters.status) && (
        <button
          onClick={() => setFilters({ client: '', assignee: '', priority: '', status: '' })}
          className="text-[10px] font-bold text-danger hover:text-danger/80 transition-colors ml-auto"
        >
          ✕ Limpar filtros
        </button>
      )}
    </div>
  )
}

/* ── Página principal ───────────────────────────────── */
export default function Projetos() {
  const { erpClients: dbClients, tasks: dbTasks, collaborators: dbCollaborators } = useData()
  const erpClients    = dbClients.length       ? dbClients       : mockClients
  const tasks         = dbTasks.length         ? dbTasks         : mockTasks
  const collaborators = dbCollaborators.length ? dbCollaborators : mockCollaborators
  const collabMap = Object.fromEntries(collaborators.map(c => [c.id, c]))
  const clientMap = Object.fromEntries(erpClients.map(c => [c.id, c]))
  const [view,    setView]    = useState('cards')
  const [filters, setFilters] = useState({ client: '', assignee: '', priority: '', status: '' })

  /* KPIs globais */
  const totalTasks   = tasks.length
  const doneTasks    = tasks.filter(t => t.status === 'done').length
  const doingTasks   = tasks.filter(t => t.status === 'doing' || t.status === 'review').length
  const overdueTasks = tasks.filter(isOverdue).length
  const totalXP      = tasks.filter(t => t.status === 'done').reduce((s, t) => s + xpForTask(t), 0)
  const globalPct    = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  /* Filtros aplicados */
  const filteredTasks = useMemo(() => tasks.filter(t => {
    if (filters.client   && t.clientId  !== filters.client)   return false
    if (filters.assignee && t.assignee  !== filters.assignee) return false
    if (filters.priority && t.priority  !== filters.priority) return false
    if (filters.status) {
      const c = clientMap[t.clientId]
      if (!c || c.status !== filters.status) return false
    }
    return true
  }), [filters])

  const filteredClients = useMemo(() => erpClients.filter(c => {
    if (filters.client && c.id !== filters.client) return false
    if (filters.status && c.status !== filters.status) return false
    if (filters.assignee) {
      const ct = tasks.filter(t => t.clientId === c.id && t.assignee === filters.assignee)
      if (ct.length === 0) return false
    }
    return true
  }), [filters])

  const COLS = ['todo','doing','review','done']

  return (
    <div className="space-y-5 pb-8">

      {/* ── Hero header ──────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden px-8 py-6"
        style={{ background: 'linear-gradient(135deg, #12141e 0%, #1a1d2e 100%)' }}
      >
        {/* glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-40px] left-[-40px] w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(110,218,44,0.14) 0%, transparent 65%)' }} />
          <div className="absolute bottom-[-30px] right-[5%] w-48 h-48 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(190,41,236,0.10) 0%, transparent 65%)' }} />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-accent" />
              <p className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: 'rgba(110,218,44,0.7)' }}>
                Fazemos mais que o combinado
              </p>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Visão Geral de Projetos</h1>
            <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {erpClients.length} clientes · {totalTasks} tarefas · operação em andamento
            </p>
          </div>

          {/* KPI strip */}
          <div className="flex items-center gap-3 flex-wrap justify-center lg:justify-end">
            {[
              { label: 'Concluídas',  value: doneTasks,    color: '#6eda2c', icon: CheckCircle2 },
              { label: 'Andamento',   value: doingTasks,   color: '#60a5fa', icon: TrendingUp },
              { label: 'Atrasadas',   value: overdueTasks, color: '#ef4444', icon: AlertTriangle },
              { label: 'ons gerados',  value: `${totalXP}`, color: '#ea8a29', icon: Star },
            ].map(({ label, value, color, icon: Icon }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.07 }}
                className="flex flex-col items-center px-4 py-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <Icon size={14} style={{ color }} className="mb-1" />
                <p className="text-xl font-black" style={{ color }}>{value}</p>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{label}</p>
              </motion.div>
            ))}

            {/* Global progress ring */}
            <div className="relative ml-2">
              <Ring pct={globalPct} color="#6eda2c" size={72} stroke={6} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-base font-black text-white">{globalPct}%</span>
                <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.4)' }}>geral</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Filtros ──────────────────────────────── */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <FilterBar view={view} setView={setView} filters={filters} setFilters={setFilters} erpClients={erpClients} collaborators={collaborators} />
      </motion.div>

      {/* ── Conteúdo ─────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* CARDS VIEW */}
        {view === 'cards' && (
          <motion.div key="cards"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {filteredClients.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl"
                style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                <Filter size={32} className="mx-auto mb-3 text-muted" style={{ opacity: 0.3 }} />
                <p className="text-sm font-bold text-muted">Nenhum projeto encontrado com esses filtros.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredClients.map((client, i) => {
                  const clientTasks = filteredTasks.filter(t => t.clientId === client.id)
                  return (
                    <ProjectCard
                      key={client.id}
                      client={client}
                      clientTasks={clientTasks}
                      delay={i * 0.06}
                      collabMap={collabMap}
                    />
                  )
                })}
              </div>
            )}

            {/* Ranking de entrega rápido */}
            {filteredClients.length > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-5 bg-white rounded-2xl p-5"
                style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Star size={15} style={{ color: '#ea8a29' }} />
                  <p className="text-sm font-extrabold text-text">Ranking de Performance — Todos os projetos</p>
                  <span className="ml-auto text-[10px] text-muted italic font-medium">
                    "Acreditamos no mérito"
                  </span>
                </div>
                <div className="space-y-2.5">
                  {[...erpClients]
                    .map(c => {
                      const ct   = tasks.filter(t => t.clientId === c.id)
                      const done = ct.filter(t => t.status === 'done').length
                      const pct  = ct.length > 0 ? Math.round((done / ct.length) * 100) : 0
                      const xp   = ct.filter(t => t.status === 'done').reduce((s, t) => s + xpForTask(t), 0)
                      const od   = ct.filter(isOverdue).length
                      return { ...c, pct, xp, done, total: ct.length, overdue: od }
                    })
                    .sort((a, b) => b.pct - a.pct || b.xp - a.xp)
                    .map((c, i) => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="w-6 text-center text-sm font-extrabold flex-shrink-0"
                          style={{ color: ['#f59e0b','#94a3b8','#b45309'][i] || '#8890b5' }}>
                          {['🥇','🥈','🥉'][i] || `#${i+1}`}
                        </span>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                          style={{ backgroundColor: c.color }}>
                          {c.name[0]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold text-text">{c.name}</span>
                            <div className="flex items-center gap-3">
                              {c.overdue > 0 && (
                                <span className="text-[10px] font-bold text-danger flex items-center gap-0.5">
                                  <AlertTriangle size={9} /> {c.overdue} atras.
                                </span>
                              )}
                              <span className="text-[10px] font-extrabold" style={{ color: '#ea8a29' }}>⚡ {c.xp} ons</span>
                              <span className="text-[10px] font-bold" style={{ color: c.color }}>{c.pct}%</span>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.color + '20' }}>
                            <motion.div className="h-full rounded-full" style={{ background: c.color }}
                              initial={{ width: 0 }} animate={{ width: `${c.pct}%` }}
                              transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.22,1,0.36,1] }} />
                          </div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* KANBAN VIEW */}
        {view === 'kanban' && (
          <motion.div key="kanban"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="overflow-x-auto pb-4"
          >
            {/* Valor reforçado */}
            <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: 'rgba(110,218,44,0.6)' }}>
              ⚡ Obsessivos pelo sucesso e experiência do cliente — {filteredTasks.length} tarefas visíveis
            </p>

            <div className="flex gap-4 min-w-max">
              {COLS.map(col => (
                <KanbanColumn
                  key={col}
                  status={col}
                  tasks={filteredTasks.filter(t => t.status === col)}
                  collabMap={collabMap}
                  clientMap={clientMap}
                />
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <div className="text-center py-16 bg-white rounded-2xl"
                style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                <Filter size={28} className="mx-auto mb-3 text-muted" style={{ opacity: 0.3 }} />
                <p className="text-sm font-bold text-muted">Nenhuma tarefa com esses filtros.</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
