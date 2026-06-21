import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Users2, Clock, CheckCircle2, AlertTriangle, ChevronRight, Zap, Calendar, Filter } from 'lucide-react'
import { taskTypes, statusConfig } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import UserAvatar from '../../components/UserAvatar'

function StatCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
      <div className="p-5">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: color + '18' }}>
          <Icon size={18} style={{ color }} />
        </div>
        <p className="text-3xl font-black" style={{ color }}>{value}</p>
        <p className="text-[11px] font-bold text-muted uppercase tracking-widest mt-1">{label}</p>
      </div>
    </motion.div>
  )
}

const DATE_PRESETS = [
  { key: 'all',   label: 'Todos' },
  { key: 'today', label: 'Hoje' },
  { key: 'week',  label: 'Esta semana' },
  { key: 'month', label: 'Este mês' },
]

function getDateRange(preset) {
  const now = new Date()
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  if (preset === 'today') return { from: start, to: new Date(start.getTime() + 86399999) }
  if (preset === 'week') {
    const mon = new Date(start)
    mon.setDate(start.getDate() - ((start.getDay() + 6) % 7))
    const sun = new Date(mon); sun.setDate(mon.getDate() + 6); sun.setHours(23, 59, 59, 999)
    return { from: mon, to: sun }
  }
  if (preset === 'month') {
    const from = new Date(now.getFullYear(), now.getMonth(), 1)
    const to   = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
    return { from, to }
  }
  return null
}

export default function ErpDashboard() {
  const { tasks, erpClients, collaborators, meetings, loading } = useData()
  const navigate = useNavigate()

  const [datePreset,   setDatePreset]   = useState('all')
  const [memberFilter, setMemberFilter] = useState('all')

  const collabMap = useMemo(
    () => Object.fromEntries(collaborators.map(c => [c.id, c])),
    [collaborators]
  )
  const clientMap = useMemo(
    () => Object.fromEntries(erpClients.map(c => [c.id, c])),
    [erpClients]
  )

  const filteredTasks = useMemo(() => {
    let result = tasks
    if (memberFilter !== 'all') result = result.filter(t => t.assignee === memberFilter)
    const range = getDateRange(datePreset)
    if (range) {
      result = result.filter(t => {
        const d = t.dueDate ? new Date(t.dueDate + 'T12:00:00') : null
        return d && d >= range.from && d <= range.to
      })
    }
    return result
  }, [tasks, datePreset, memberFilter])

  const today = new Date().toLocaleDateString('en-CA')

  const { doing, review, done, overdue } = useMemo(() => ({
    doing:   filteredTasks.filter(t => t.status === 'doing').length,
    review:  filteredTasks.filter(t => t.status === 'review').length,
    done:    filteredTasks.filter(t => t.status === 'done').length,
    overdue: filteredTasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length,
  }), [filteredTasks, today])

  const diasParaCopa = Math.max(0, Math.ceil((new Date('2026-06-11') - new Date()) / 86400000))

  const upcomingMeetings = useMemo(
    () => meetings.filter(m => m.date >= today).slice(0, 4),
    [meetings, today]
  )
  const urgentTasks = useMemo(
    () => filteredTasks.filter(t => t.status !== 'done' && t.priority === 'high').slice(0, 5),
    [filteredTasks]
  )
  const collabOns = useMemo(() => {
    const map = {}
    collaborators.forEach(c => {
      map[c.id] = tasks
        .filter(t => t.assignee === c.id && t.status === 'done')
        .reduce((sum, t) => sum + (taskTypes[t.type]?.ons ?? 1), 0)
    })
    return map
  }, [collaborators, tasks])

  const topCollab = useMemo(
    () => [...collaborators].sort((a, b) => (collabOns[b.id] || 0) - (collabOns[a.id] || 0)).slice(0, 3),
    [collaborators, collabOns]
  )
  const clientStats = useMemo(
    () => erpClients.map(client => {
      const ct   = tasks.filter(t => t.clientId === client.id)
      const pct  = ct.length > 0 ? Math.round((ct.filter(t => t.status === 'done').length / ct.length) * 100) : 0
      return { ...client, pct }
    }),
    [erpClients, tasks]
  )

  if (loading) return (
    <div className="p-4 lg:p-6 animate-pulse space-y-5">
      <div className="h-8 w-48 bg-surface rounded-xl" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-28 bg-surface rounded-2xl" />)}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 h-64 bg-surface rounded-2xl" />
        <div className="h-64 bg-surface rounded-2xl" />
      </div>
    </div>
  )

  return (
    <div className="p-4 lg:p-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 lg:mb-8">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-text">Operacional</h1>
            <p className="text-sm text-muted mt-0.5">
              {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
            style={{ background: '#12141e', border: '1px solid rgba(110,218,44,0.25)' }}
          >
            <Zap size={13} className="text-accent" fill="currentColor" />
            <p className="text-xs font-bold text-white/70">TráfegOn</p>
            <p className="text-xs font-extrabold text-accent">ERP v1</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Filtros */}
      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="flex flex-wrap items-center gap-2 mb-5">
        {/* Filtro de período */}
        <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-2"
          style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.06)' }}>
          <Calendar size={13} className="text-muted flex-shrink-0" />
          {DATE_PRESETS.map(p => (
            <button key={p.key} onClick={() => setDatePreset(p.key)}
              className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
              style={datePreset === p.key
                ? { background: '#6eda2c', color: '#0f1117' }
                : { color: '#8890b5' }}>
              {p.label}
            </button>
          ))}
        </div>

        {/* Filtro de membro */}
        <div className="flex items-center gap-1.5 bg-white rounded-xl px-3 py-2 flex-wrap"
          style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.06)' }}>
          <Filter size={13} className="text-muted flex-shrink-0" />
          <button onClick={() => setMemberFilter('all')}
            className="text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
            style={memberFilter === 'all' ? { background: '#6eda2c', color: '#0f1117' } : { color: '#8890b5' }}>
            Todos
          </button>
          {collaborators.map(c => (
            <button key={c.id} onClick={() => setMemberFilter(memberFilter === c.id ? 'all' : c.id)}
              className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg transition-all"
              style={memberFilter === c.id
                ? { background: c.color + '25', color: c.color, outline: `1.5px solid ${c.color}` }
                : { color: '#8890b5' }}>
              <UserAvatar user={c} size={16} />
              {c.name.split(' ')[0]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-4">
        <StatCard icon={Package}     label="Em andamento"  value={doing}  color="#60a5fa" delay={0.05} />
        <StatCard icon={Clock}       label="Em revisão"    value={review} color="#ea8a29" delay={0.10} />
        <StatCard icon={CheckCircle2}label="Concluídos"    value={done}   color="#6eda2c" delay={0.15} />
        <StatCard icon={AlertTriangle}label="Atrasados"    value={overdue}color="#ef4444" delay={0.20} />
        <StatCard icon={Users2}      label="Clientes ativos" value={erpClients.filter(c=>c.status==='active').length} color="#be29ec" delay={0.25} />
      </div>

      {/* Copa 2026 Banner */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="mb-6 rounded-2xl overflow-hidden relative"
        style={{ background: 'linear-gradient(135deg,#003d1a 0%,#005c27 40%,#004d22 70%,#1a2200 100%)', boxShadow: '0 4px 20px rgba(0,156,59,0.25), 0 0 0 1px rgba(255,223,0,0.2)' }}
      >
        <div className="px-5 py-3 flex items-center gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <span style={{ fontSize: 28 }}>⚽</span>
            <span style={{ fontSize: 24 }}>🇧🇷</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-extrabold" style={{ color: '#FFDF00' }}>
              {diasParaCopa > 0 ? `${diasParaCopa} dias para a Copa do Mundo 2026` : 'A Copa começa hoje!'}
            </p>
            <p className="text-[11px] font-bold" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Rumo ao Hexa — Brasil 🏆🏆🏆🏆🏆🏆
            </p>
          </div>
          <div className="flex-shrink-0 text-right hidden sm:block">
            <p className="text-2xl font-black" style={{ color: '#FFDF00', lineHeight: 1 }}>{diasParaCopa}</p>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,223,0,0.6)' }}>dias</p>
          </div>
        </div>
        {/* Faixa verde-amarela animada */}
        <div style={{ height: 3, background: 'linear-gradient(90deg,#009C3B,#FFDF00,#009C3B,#FFDF00,#009C3B)', backgroundSize: '300% 100%', animation: 'copa-slide 3s linear infinite' }} />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Tarefas urgentes */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">Alta prioridade</p>
            <button onClick={() => navigate('/entregas')}
              className="text-xs text-accent font-bold hover:text-accent-hover flex items-center gap-0.5 transition-colors">
              Ver todas <ChevronRight size={12} />
            </button>
          </div>
          {urgentTasks.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <span className="text-2xl mb-2">✅</span>
              <p className="text-sm font-bold text-text">Nenhuma tarefa urgente</p>
              <p className="text-xs text-muted mt-0.5">Tudo sob controle por agora</p>
            </div>
          )}
          <div className="space-y-2">
            {urgentTasks.map((task, i) => {
              const type     = taskTypes[task.type]
              const client   = clientMap[task.clientId]
              const assignee = collabMap[task.assignee]
              const status   = statusConfig[task.status]
              const isOverdue = task.dueDate && task.dueDate < new Date().toLocaleDateString('en-CA')
              return (
                <motion.div key={task.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  onClick={() => navigate(`/workspaces/${task.clientId}`)}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-surface-2 cursor-pointer transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                    style={{ backgroundColor: type.color + '18' }}>
                    {type.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-text truncate">{task.title}</p>
                      {isOverdue && <span className="text-[9px] font-extrabold text-danger bg-danger/10 px-1.5 py-0.5 rounded-md flex-shrink-0">ATRASADO</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-3 h-3 rounded-sm flex items-center justify-center text-[7px] font-extrabold text-white" style={{ backgroundColor: client?.color }}>{client?.name[0]}</div>
                      <span className="text-[11px] text-muted">{client?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg" style={{ color: status.color, backgroundColor: status.color + '18' }}>{status.label}</span>
                    <UserAvatar user={assignee} size={20} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Reuniões */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
        >
          <p className="text-sm font-extrabold text-text mb-4">Próximas reuniões</p>
          <div className="space-y-2.5">
            {upcomingMeetings.map((m, i) => {
              const client = clientMap[m.clientId]
              const isToday = m.date === today
              return (
                <motion.div key={m.id}
                  initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl transition-colors hover:bg-surface-2 cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                    style={{ backgroundColor: isToday ? '#6eda2c18' : '#8890b512' }}>
                    📅
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-text truncate">{m.title}</p>
                    <p className="text-[10px] text-muted mt-0.5">
                      {isToday ? <span className="text-accent font-extrabold">Hoje</span>
                        : new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      {' '}· {m.time}
                    </p>
                  </div>
                  <div className="w-4 h-4 rounded-sm flex items-center justify-center text-[8px] font-extrabold text-white flex-shrink-0"
                    style={{ backgroundColor: client?.color }}>
                    {client?.name[0]}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>

        {/* Clientes — status saúde */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="lg:col-span-2 bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">Saúde dos clientes</p>
            <button onClick={() => navigate('/clientes')}
              className="text-xs text-accent font-bold hover:text-accent-hover flex items-center gap-0.5 transition-colors">
              Clientes <ChevronRight size={12} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {clientStats.map((client, i) => (
              <motion.div key={client.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                onClick={() => navigate(`/workspaces/${client.id}`)}
                className="flex items-center gap-2.5 p-2.5 rounded-xl hover:bg-surface-2 cursor-pointer transition-colors"
              >
                <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}80)` }}>
                  {client.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-xs font-bold text-text truncate">{client.name}</p>
                    {client.status === 'at_risk' && <AlertTriangle size={10} className="text-orange flex-shrink-0" />}
                  </div>
                  <div className="h-1 rounded-full mt-1" style={{ backgroundColor: client.color + '20' }}>
                    <div className="h-full rounded-full transition-all" style={{ backgroundColor: client.color, width: `${client.pct}%` }} />
                  </div>
                </div>
                <span className="text-[10px] font-extrabold flex-shrink-0" style={{ color: client.color }}>{client.pct}%</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Top equipe */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-5"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-extrabold text-text">Top equipe</p>
            <button onClick={() => navigate('/equipe')}
              className="text-xs text-accent font-bold hover:text-accent-hover flex items-center gap-0.5 transition-colors">
              Ver todos <ChevronRight size={12} />
            </button>
          </div>
          <div className="space-y-3">
            {topCollab.map((c, i) => {
              const medals = ['🥇', '🥈', '🥉']
              const ons = collabOns[c.id] || 0
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <span className="text-base w-5 text-center flex-shrink-0">{medals[i]}</span>
                  <UserAvatar user={c} size={28} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold text-text">{c.name}</p>
                      <p className="text-[10px] font-extrabold" style={{ color: c.color }}>{ons.toLocaleString('pt-BR')} ons</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Tipos mais entregues */}
          <div className="mt-5 pt-4 border-t border-border">
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-3">Entregas do mês</p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(taskTypes).map(([key, cfg]) => {
                const count = filteredTasks.filter(t => t.status === 'done' && t.type === key).length
                if (count === 0) return null
                return (
                  <span key={key} className="text-[10px] font-bold px-2 py-1 rounded-lg"
                    style={{ color: cfg.color, backgroundColor: cfg.color + '15' }}>
                    {cfg.icon} {count}
                  </span>
                )
              })}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
