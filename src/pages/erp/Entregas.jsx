import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import {
  Clock, CheckCircle2, AlertCircle, Plus, Zap, Trophy,
  Target, TrendingUp, Search, ChevronRight, Flame,
  LayoutGrid, List, Hourglass, Info, Gift, BarChart3, CalendarDays
} from 'lucide-react'
import { taskTypes, statusConfig, TASK_FLAGS } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import { getAllUsers, TEAM_ROLES } from '../../data/users-store'
import TarefaModal from '../../components/TarefaModal'
import TaskTemplatesDrawer from '../../components/TaskTemplatesDrawer'
import UserAvatar from '../../components/UserAvatar'

/* Ons & Ranking */
const RANKS = [
  { min: 0,   label: 'Iniciante',    icon: '🌱', color: '#8890b5', bg: '#8890b512' },
  { min: 15,  label: 'Executor',     icon: '⚡', color: '#60a5fa', bg: '#60a5fa12' },
  { min: 50,  label: 'Velocista',    icon: '🚀', color: '#ea8a29', bg: '#ea8a2912' },
  { min: 120, label: 'Especialista', icon: '🏆', color: '#6eda2c', bg: '#6eda2c12' },
  { min: 250, label: 'Elite',        icon: '👑', color: '#f59e0b', bg: '#f59e0b12' },
]

const KANBAN_COLS = [
  { key: 'todo',   label: 'A Fazer',       color: '#60a5fa', emoji: '📋' },
  { key: 'doing',  label: 'Em Andamento',  color: '#f59e0b', emoji: '🔄' },
  { key: 'review', label: 'Em Revisao',    color: '#be29ec', emoji: '👁️' },
  { key: 'done',   label: 'Concluido',     color: '#6eda2c', emoji: '✅' },
]

function getRank(xp) {
  let rank = RANKS[0], idx = 0
  for (let i = 0; i < RANKS.length; i++) { if (xp >= RANKS[i].min) { rank = RANKS[i]; idx = i } }
  const nextRank = RANKS[idx + 1]
  const pct = nextRank
    ? Math.min(100, Math.round(((xp - rank.min) / (nextRank.min - rank.min)) * 100))
    : 100
  return { ...rank, nextRank, pct, idx }
}

function calcOns(memberId, tasks) {
  return tasks
    .filter(t => t.assignee === memberId && t.status === 'done')
    .reduce((sum, t) => sum + (taskTypes[t.type]?.ons ?? 1), 0)
}

const STATUS_ORDER = ['todo', 'doing', 'review', 'done']
function nextStatus(current) {
  const i = STATUS_ORDER.indexOf(current)
  return STATUS_ORDER[(i + 1) % STATUS_ORDER.length]
}

/* CollabCard */
function CollabCard({ member, allTasks, position, layoutId }) {
  const memberTasks = allTasks.filter(t => t.assignee === member.id)
  const todo        = memberTasks.filter(t => t.status === 'todo').length
  const done        = memberTasks.filter(t => t.status === 'done').length
  const doing       = memberTasks.filter(t => t.status === 'doing' || t.status === 'review').length
  const overdue     = memberTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate + 'T00:00:00') < new Date()).length
  const total       = memberTasks.length
  const ons         = calcOns(member.id, allTasks)
  const rank        = getRank(ons)
  const pctDone     = total > 0 ? Math.round((done / total) * 100) : 0
  const medals      = ['🥇', '🥈', '🥉']

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, delay: position * 0.07 }}
      className="bg-white rounded-2xl p-4 relative overflow-hidden flex-shrink-0"
      style={{
        boxShadow: position === 0
          ? '0 4px 20px rgba(245,158,11,0.2), 0 0 0 2px rgba(245,158,11,0.3)'
          : '0 2px 12px rgba(26,29,46,0.09)',
        minWidth: 180,
      }}
    >
      {position < 3 && <div className="absolute top-3 right-3 text-lg">{medals[position]}</div>}

      <div className="flex items-center gap-3 mb-3">
        <motion.div
          animate={position === 0 ? { boxShadow: ['0 0 0px #f59e0b00','0 0 14px #f59e0b60','0 0 0px #f59e0b00'] } : {}}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="flex-shrink-0"
          style={{ borderRadius: 14, border: position === 0 ? '2px solid #f59e0b' : `2px solid ${member.color}50` }}
        >
          <UserAvatar user={member} size={44} rounded="xl" showBelt />
        </motion.div>
        <div className="min-w-0">
          <p className="text-sm font-extrabold text-text truncate">{member.name}</p>
          <p className="text-[10px] text-muted">{member.role}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="font-extrabold" style={{ color: rank.color }}>{ons} ons</span>
          {rank.nextRank && <span className="text-muted">{rank.pct}% → {rank.nextRank.min} ons</span>}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: rank.color + '20' }}>
          <motion.div className="h-full rounded-full" style={{ background: rank.color }}
            initial={{ width: 0 }} animate={{ width: `${rank.pct}%` }}
            transition={{ duration: 1, delay: position * 0.07 + 0.3, ease: [0.22,1,0.36,1] }} />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {[
          { label: 'A Fazer', value: todo,   color: '#8890b5' },
          { label: 'Feitas',  value: done,   color: '#6eda2c' },
          { label: 'Fazendo', value: doing,  color: '#60a5fa' },
          { label: 'Atraso',  value: overdue, color: overdue > 0 ? '#ef4444' : '#8890b5' },
        ].map(s => (
          <div key={s.label} className="text-center rounded-xl py-1.5" style={{ backgroundColor: s.color + '10' }}>
            <p className="text-sm font-extrabold" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[9px] font-bold text-muted uppercase tracking-wide">{s.label}</p>
          </div>
        ))}
      </div>

      {total > 0 && (
        <div className="mt-2.5 flex items-center gap-2">
          <div className="flex-1 h-1 rounded-full overflow-hidden bg-surface-2">
            <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }}
              animate={{ width: `${pctDone}%` }}
              transition={{ duration: 1, delay: position * 0.07 + 0.5, ease: [0.22,1,0.36,1] }} />
          </div>
          <span className="text-[10px] font-bold text-accent">{pctDone}%</span>
        </div>
      )}
    </motion.div>
  )
}

/* TaskRow (lista) */
function TaskRow({ task, clientMap, collabMap, onStatusChange, onEdit, index }) {
  const [hovering,  setHovering]  = useState(false)
  const [advancing, setAdvancing] = useState(false)

  const type     = taskTypes[task.type]      || { icon: '📌', color: '#8890b5', label: 'Outro' }
  const status   = statusConfig[task.status] || statusConfig.todo
  const client   = clientMap[task.clientId]
  const assignee = collabMap[task.assignee]
  const today    = new Date().toISOString().split('T')[0]
  const isOverdue  = task.status !== 'done' && task.dueDate && task.dueDate < today
  const isDueToday = task.status !== 'done' && task.dueDate === today
  const isDone     = task.status === 'done'
  const xpEarned   = taskTypes[task.type]?.ons ?? 1

  async function handleAdvance(e) {
    e.stopPropagation()
    if (advancing) return
    setAdvancing(true)
    await onStatusChange(task.id, nextStatus(task.status))
    setAdvancing(false)
  }

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: isDone ? 0.55 : 1, y: 0 }}
      transition={{ delay: index * 0.025 }}
      onHoverStart={() => setHovering(true)} onHoverEnd={() => setHovering(false)}
      onClick={() => onEdit && onEdit(task)}
      className="flex items-center gap-3 px-4 py-3 border-b border-border/40 hover:bg-surface-2/50 transition-all group cursor-pointer"
    >
      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.92 }}
        onClick={handleAdvance}
        title={isDone ? 'Concluida' : `Avancar para ${statusConfig[nextStatus(task.status)]?.label}`}
        className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
        style={{
          backgroundColor: isDone ? '#6eda2c20' : hovering ? status.color + '25' : status.color + '12',
          border: `2px solid ${isDone ? '#6eda2c' : status.color + '50'}`,
        }}
      >
        {advancing
          ? <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin" />
          : isDone ? <CheckCircle2 size={13} style={{ color: '#6eda2c' }} />
          : <ChevronRight size={12} style={{ color: status.color }} />}
      </motion.button>

      <span className="text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 hidden sm:inline-flex items-center gap-1"
        style={{ color: type.color, backgroundColor: type.color + '15' }}>
        {type.icon} {type.label}
      </span>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold leading-snug ${isDone ? 'line-through text-muted' : 'text-text'}`}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-[10px] text-muted truncate mt-0.5 hidden md:block">{task.description}</p>
        )}
      </div>

      {isDone && (
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0"
          style={{ background: '#6eda2c15', color: '#6eda2c' }}>
          +{xpEarned} ons
        </span>
      )}

      {client && (
        <div className="hidden lg:flex items-center gap-1.5 flex-shrink-0">
          <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold text-white"
            style={{ backgroundColor: client.color }}>
            {client.name[0]}
          </div>
          <span className="text-xs text-muted font-medium truncate max-w-[80px]">{client.name}</span>
        </div>
      )}

      {assignee && <UserAvatar user={assignee} size={24} />}

      <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 hidden sm:inline-flex items-center gap-1 cursor-pointer hover:opacity-80"
        style={{ color: status.color, backgroundColor: status.color + '18' }}
        onClick={handleAdvance}>
        {isDone ? <CheckCircle2 size={10} /> : <Clock size={10} />} {status.label}
      </span>

      <div className={`flex items-center gap-1 text-[11px] font-semibold flex-shrink-0 ${
        isOverdue ? 'text-danger' : isDueToday ? 'text-[#ea8a29]' : 'text-muted'
      }`}>
        {isOverdue  && <AlertCircle size={11} />}
        {isDueToday && <Flame size={11} />}
        {task.dueDate
          ? new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
          : '—'}
      </div>

      <div className="w-2 h-2 rounded-full flex-shrink-0"
        style={{ backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#ea8a29' : '#8890b5' }} />
    </motion.div>
  )
}

/* KanbanCard */
function KanbanCard({ task, clientMap, collabMap, onStatusChange, onEdit }) {
  const [advancing, setAdvancing] = useState(false)

  const type     = taskTypes[task.type]      || { icon: '📌', color: '#8890b5', label: 'Outro' }
  const status   = statusConfig[task.status] || statusConfig.todo
  const client   = clientMap[task.clientId]
  const assignee = collabMap[task.assignee]
  const today    = new Date().toISOString().split('T')[0]
  const isOverdue  = task.status !== 'done' && task.dueDate && task.dueDate < today
  const isDueToday = task.status !== 'done' && task.dueDate === today
  const isDone     = task.status === 'done'
  const xp         = taskTypes[task.type]?.ons ?? 1

  async function handleAdvance(e) {
    e.stopPropagation()
    if (isDone || advancing) return
    setAdvancing(true)
    await onStatusChange(task.id, nextStatus(task.status))
    setAdvancing(false)
  }

  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
    >
      <div
        draggable
        onDragStart={e => {
          e.dataTransfer.setData('taskId', String(task.id))
          e.dataTransfer.effectAllowed = 'move'
        }}
        onClick={() => onEdit && onEdit(task)}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(26,29,46,0.13)' }}
        onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
        className="bg-white rounded-xl border overflow-hidden select-none"
        style={{
          borderColor: '#e0e3f0',
          borderLeftWidth: 3,
          borderLeftColor: client?.color || status.color,
          cursor: 'grab',
          boxShadow: '0 1px 4px rgba(26,29,46,0.08)',
          transition: 'transform 0.12s, box-shadow 0.12s',
        }}
      >
      <div className="p-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
            style={{ color: type.color, backgroundColor: type.color + '15' }}>
            {type.icon} {type.label}
          </span>
          <div className="flex items-center gap-1">
            {isOverdue  && <AlertCircle size={11} className="text-danger" />}
            {isDueToday && <Flame size={11} style={{ color: '#ea8a29' }} />}
          </div>
        </div>

        <p className={`text-xs font-bold leading-snug mb-2 ${isDone ? 'line-through text-muted' : 'text-text'}`}>
          {task.title}
        </p>

        {task.flag && TASK_FLAGS[task.flag] && (
          <div className="mb-2.5">
            <span className="inline-flex items-center gap-1 text-[9px] font-extrabold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: TASK_FLAGS[task.flag].color + '18',
                color:           TASK_FLAGS[task.flag].color,
                border:          `1px solid ${TASK_FLAGS[task.flag].color}35`,
              }}>
              {TASK_FLAGS[task.flag].dot} {TASK_FLAGS[task.flag].label}
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-1">
          <div className="flex items-center gap-1.5">
            {client && (
              <div title={client.name}
                className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-extrabold text-white flex-shrink-0"
                style={{ backgroundColor: client.color }}>
                {client.name[0]}
              </div>
            )}
            {assignee && <UserAvatar user={assignee} size={20} style={{ title: assignee.name }} />}
            <div className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ backgroundColor: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#ea8a29' : '#8890b5' }} />
          </div>

          <div className="flex items-center gap-1.5">
            {task.dueDate && (
              <span className={`text-[10px] font-semibold ${isOverdue ? 'text-danger' : isDueToday ? 'text-[#ea8a29]' : 'text-muted'}`}>
                {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </span>
            )}
            {isDone ? (
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                style={{ background: '#6eda2c15', color: '#6eda2c' }}>
                +{xp} ons
              </span>
            ) : (
              <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                onClick={handleAdvance} disabled={advancing}
                title={`Avancar para ${statusConfig[nextStatus(task.status)]?.label}`}
                className="w-6 h-6 rounded-lg flex items-center justify-center transition-all"
                style={{ backgroundColor: status.color + '20', color: status.color }}>
                {advancing
                  ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  : <ChevronRight size={12} />}
              </motion.button>
            )}
          </div>
        </div>
      </div>
      </div>
    </motion.div>
  )
}

/* KanbanColumn */
function KanbanColumn({ col, tasks, clientMap, collabMap, onStatusChange, onNewTask, onEdit }) {
  const [isDragOver, setIsDragOver] = useState(false)

  return (
    <div
      className="flex-shrink-0 w-72 flex flex-col rounded-2xl overflow-hidden transition-all duration-150"
      onDragOver={e => { e.preventDefault(); setIsDragOver(true); e.dataTransfer.dropEffect = 'move' }}
      onDragLeave={e => { if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget)) setIsDragOver(false) }}
      onDrop={e => {
        e.preventDefault()
        setIsDragOver(false)
        const taskId = e.dataTransfer.getData('taskId')
        if (taskId) onStatusChange(taskId, col.key)
      }}
      style={{
        background:  isDragOver ? col.color + '18' : col.color + '08',
        border:      `${isDragOver ? '2px' : '1.5px'} ${isDragOver ? 'dashed' : 'solid'} ${isDragOver ? col.color + '70' : col.color + '30'}`,
        transform:   isDragOver ? 'scale(1.01)' : 'scale(1)',
      }}
    >
      <div className="flex items-center justify-between px-4 py-3"
        style={{ background: col.color + '15', borderBottom: `1px solid ${col.color}25` }}>
        <div className="flex items-center gap-2">
          <span className="text-base">{col.emoji}</span>
          <span className="text-xs font-extrabold" style={{ color: col.color }}>{col.label}</span>
          <span className="text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center"
            style={{ backgroundColor: col.color + '30', color: col.color }}>
            {tasks.length}
          </span>
        </div>
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
          onClick={onNewTask}
          className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
          style={{ backgroundColor: col.color + '25', color: col.color }}
          title="Nova tarefa nesta coluna">
          <Plus size={12} />
        </motion.button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 120, maxHeight: 'calc(100vh - 380px)' }}>
        {isDragOver && tasks.length === 0 && (
          <div className="flex items-center justify-center py-6 rounded-xl border-2 border-dashed"
            style={{ borderColor: col.color + '50' }}>
            <p className="text-[11px] font-bold" style={{ color: col.color }}>Soltar aqui</p>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {tasks.map(task => (
            <KanbanCard key={task.id} task={task}
              clientMap={clientMap} collabMap={collabMap}
              onStatusChange={onStatusChange}
              onEdit={onEdit} />
          ))}
        </AnimatePresence>
        {!isDragOver && tasks.length === 0 && (
          <div className="flex items-center justify-center py-8 rounded-xl border-2 border-dashed cursor-pointer transition-all"
            style={{ borderColor: col.color + '30' }}
            onClick={onNewTask}
            title="Clique para criar uma tarefa">
            <p className="text-[11px] font-bold select-none" style={{ color: col.color + '80' }}>+ Nenhuma tarefa</p>
          </div>
        )}
      </div>
    </div>
  )
}

const TYPE_KEYS   = Object.keys(taskTypes)
const STATUS_KEYS = ['todo', 'doing', 'review', 'done']

/* Entregas */
export default function Entregas() {
  const { tasks, erpClients, collaborators, addTask, addMilestone, updateTask, deleteTask } = useData()
  const teamMembers = getAllUsers().filter(u => TEAM_ROLES.includes(u.role))
  const location    = useLocation()

  const clientMap  = Object.fromEntries(erpClients.map(c => [c.id, c]))
  const collabMap  = Object.fromEntries(collaborators.map(c => [c.id, c]))

  const [view,          setView]          = useState('kanban')
  const [typeF,         setTypeF]         = useState('all')
  const [statusF,       setStatusF]       = useState('all')
  const [clientF,       setClientF]       = useState('all')
  const [assigneeF,     setAssigneeF]     = useState('all')
  const [search,        setSearch]        = useState('')
  const [showModal,        setShowModal]        = useState(false)
  const [editingTask,      setEditingTask]      = useState(null)
  const [showTemplates,    setShowTemplates]    = useState(false)
  const [modalInitStatus,  setModalInitStatus]  = useState('todo')
  const [showDone,      setShowDone]      = useState(true)
  const [dateF,         setDateF]         = useState('all')
  const [priorityF,     setPriorityF]     = useState('all')
  const [showOnsGuide,  setShowOnsGuide]  = useState(false)

  const today = new Date().toISOString().split('T')[0]

  // Abre modal da tarefa quando chega via notificacao (navigate com state.openTask)
  useEffect(() => {
    if (location.state?.openTask) {
      setEditingTask(location.state.openTask)
      // Limpa o state para nao reabrir ao navegar de volta
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const totalTasks    = tasks.length
  const doneTasks     = tasks.filter(t => t.status === 'done').length
  const doingTasks    = tasks.filter(t => t.status === 'doing').length
  const overdueTasks  = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length
  const dueTodayTasks = tasks.filter(t => t.status !== 'done' && t.dueDate === today).length
  const teamRate      = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const leaderboard = useMemo(() =>
    teamMembers.map(m => ({ ...m, ons: calcOns(m.id, tasks) })).sort((a, b) => b.ons - a.ons)
  , [tasks])

  const urgent = useMemo(() =>
    tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate <= today)
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
  , [tasks])

  const filtered = useMemo(() => {
    const endOfWeek = new Date(today)
    endOfWeek.setDate(endOfWeek.getDate() + 6)
    const eow = endOfWeek.toISOString().split('T')[0]

    return tasks.filter(t => {
      if (!showDone && t.status === 'done') return false
      const matchType     = typeF     === 'all' || t.type     === typeF
      const matchStatus   = statusF   === 'all' || t.status   === statusF
      const matchClient   = clientF   === 'all' || t.clientId === clientF
      const matchAssignee = assigneeF === 'all' || t.assignee === assigneeF
      const matchSearch   = search    === ''    || t.title.toLowerCase().includes(search.toLowerCase())
      const matchPriority = priorityF === 'all' || t.priority === priorityF
      const matchDate     = dateF === 'all'    ? true
        : dateF === 'overdue'  ? (t.status !== 'done' && !!t.dueDate && t.dueDate < today)
        : dateF === 'today'    ? (t.dueDate === today)
        : dateF === 'week'     ? (!!t.dueDate && t.dueDate >= today && t.dueDate <= eow)
        : dateF === 'no_date'  ? (!t.dueDate)
        : true
      return matchType && matchStatus && matchClient && matchAssignee && matchSearch && matchPriority && matchDate
    })
  }, [tasks, typeF, statusF, clientF, assigneeF, search, showDone, priorityF, dateF, today])

  async function handleSaveTarefa(taskData) {
    try {
      if (taskData.id) {
        const updates = {
          title:    taskData.title,
          type:     taskData.type,
          clientId: taskData.clientId,
          assignee: taskData.assignee,
          dueDate:  taskData.dueDate,
          priority: taskData.priority,
          flag:     taskData.flag ?? null,
          level:    taskData.level,
        }
        if (taskData.comments?.length) updates.comments = taskData.comments
        await updateTask(taskData.id, updates)
      } else {
        await addTask({ ...taskData })
        if (taskData.level === 'marco' && taskData.dueDate) {
          await addMilestone({
            clientId:    taskData.clientId,
            date:        taskData.dueDate,
            title:       taskData.title,
            type:        'entrega',
            description: taskData.description || '',
          })
        }
      }
    } catch (err) {
      console.error('[save] erro ao salvar tarefa:', err)
    }
    setShowModal(false)
    setEditingTask(null)
    setShowTemplates(false)
  }

  async function handleStatusChange(taskId, newStatus) {
    await updateTask(taskId, { status: newStatus })
  }

  function openEditModal(task) {
    setEditingTask(task)
    setShowModal(false)
  }

  function closeModal() {
    setShowModal(false)
    setEditingTask(null)
  }

  return (
    <div className="p-4 lg:p-6 min-h-screen">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-text flex items-center gap-2">
            <Trophy size={22} className="text-[#f59e0b]" /> Tarefas
          </h1>
          <p className="text-sm text-muted mt-0.5">Central de tarefas da equipe</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center bg-white border border-border rounded-xl p-1"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.08)' }}>
            <button
              onClick={() => setView('list')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={view === 'list'
                ? { backgroundColor: '#1a1d2e', color: 'white' }
                : { color: '#8890b5' }}>
              <List size={13} /> Lista
            </button>
            <button
              onClick={() => setView('kanban')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={view === 'kanban'
                ? { backgroundColor: '#1a1d2e', color: 'white' }
                : { color: '#8890b5' }}>
              <LayoutGrid size={13} /> Kanban
            </button>
          </div>

          <button onClick={() => setShowTemplates(true)}
            className="flex items-center gap-1.5 text-sm font-bold px-4 py-2.5 rounded-xl border border-border text-muted hover:text-text-2 hover:border-accent/40 transition-all">
            <Zap size={14} /> Modelos
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setModalInitStatus('todo'); setShowModal(true); setEditingTask(null) }}
            className="flex items-center gap-1.5 text-sm font-extrabold px-4 py-2.5 rounded-xl text-[#0f1117]"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}>
            <Plus size={15} /> Nova Tarefa
          </motion.button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Taxa do time',  value: `${teamRate}%`, color: '#6eda2c', icon: TrendingUp, sub: `${doneTasks} de ${totalTasks} concluidas` },
          { label: 'Em andamento',  value: doingTasks,      color: '#60a5fa', icon: Target,     sub: 'tarefas ativas agora' },
          { label: 'Vencem hoje',   value: dueTodayTasks,   color: '#ea8a29', icon: Flame,      sub: 'precisam de atencao' },
          { label: 'Atrasadas',     value: overdueTasks,    color: '#ef4444', icon: AlertCircle, sub: 'alem do prazo' },
        ].map((kpi, i) => (
          <motion.div key={kpi.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${kpi.color}, ${kpi.color}60)` }} />
            <div className="p-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2"
                style={{ backgroundColor: kpi.color + '18' }}>
                <kpi.icon size={15} style={{ color: kpi.color }} />
              </div>
              <p className="text-2xl font-black" style={{ color: kpi.color }}>{kpi.value}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-wider mt-0.5">{kpi.label}</p>
              <p className="text-[10px] text-muted mt-0.5">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Leaderboard */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy size={14} className="text-[#f59e0b]" />
          <p className="text-sm font-extrabold text-text">Ranking da Equipe</p>
          <span className="text-[10px] text-muted ml-1">— ons por tarefas concluidas</span>
        </div>
        <motion.div layout className="flex gap-3 overflow-x-auto pb-2">
          {leaderboard.map((member, i) => (
            <CollabCard key={member.id} layoutId={`collab-${member.id}`} member={member} allTasks={tasks} position={i} />
          ))}
        </motion.div>
      </motion.div>

      {/* Como ganhar ons — colapsável */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-6">
        <div className="rounded-2xl overflow-hidden" style={{ background: 'white', boxShadow: '0 2px 12px rgba(26,29,46,0.08), 0 0 0 1px rgba(110,218,44,0.12)' }}>
          <button
            onClick={() => setShowOnsGuide(v => !v)}
            className="w-full px-5 py-3 flex items-center gap-2 text-left transition-colors hover:bg-surface-2/40"
            style={{ borderBottom: showOnsGuide ? '1px solid #f0f2fb' : 'none', background: 'linear-gradient(90deg,#6eda2c08,transparent)' }}
          >
            <Info size={13} style={{ color: '#6eda2c' }} />
            <p className="text-xs font-extrabold text-text">Como ganhar ons</p>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#6eda2c15', color: '#6eda2c' }}>sistema de pontuação</span>
            <motion.span
              animate={{ rotate: showOnsGuide ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="ml-2 text-muted"
            >
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {showOnsGuide && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                style={{ overflow: 'hidden' }}
              >
                <div className="px-5 py-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    {
                      tier: '1 on', label: 'Rotina', color: '#8890b5',
                      activities: ['Atualizar Google Meu Negócio','Enviar Dashboard','Interagir grupos WhatsApp','Gestão diária de campanhas','Preencher planilha indicadores','Analisar conversas CRM'],
                    },
                    {
                      tier: '2 ons', label: 'Execução', color: '#60a5fa',
                      activities: ['Organizar perfil redes sociais','Reunião de acompanhamento','Criação de artes','Planejamento de roteiro','Planejar calendário de post','Pesquisa de mercado','Rastreamento','Analisar pipeline e tx CRM'],
                    },
                    {
                      tier: '3 ons', label: 'Estratégico', color: '#f59e0b',
                      activities: ['Setup de conta de anúncios','Criar campanhas, públicos e anúncios','Treinamento de vendas ao cliente','Captação de vídeo','Edição de vídeo'],
                    },
                  ].map(group => (
                    <div key={group.tier} className="rounded-xl p-3.5 border" style={{ borderColor: group.color + '25', background: group.color + '06' }}>
                      <div className="flex items-center gap-2 mb-2.5">
                        <span className="text-base font-black" style={{ color: group.color }}>{group.tier}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: group.color + '20', color: group.color }}>{group.label}</span>
                      </div>
                      <ul className="space-y-1">
                        {group.activities.map(a => (
                          <li key={a} className="flex items-start gap-1.5 text-[11px]" style={{ color: '#4b5068' }}>
                            <span className="mt-0.5 w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: group.color }} />
                            {a}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* KPIs / OKRs / Recompensas — em construcao */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={13} className="text-muted" />
          <p className="text-xs font-extrabold text-muted uppercase tracking-wider">Plataforma de performance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'KPIs',
              icon: BarChart3,
              color: '#60a5fa',
              desc: 'Indicadores-chave de performance por colaborador e cliente.',
            },
            {
              label: 'OKRs',
              icon: Target,
              color: '#be29ec',
              desc: 'Objetivos e resultados-chave do time para o trimestre.',
            },
            {
              label: 'Recompensas',
              icon: Gift,
              color: '#f59e0b',
              desc: 'Troque seus ons por benefícios e reconhecimentos reais.',
            },
          ].map((section, i) => (
            <motion.div key={section.label}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28 + i * 0.06 }}
              className="relative overflow-hidden rounded-2xl border bg-white"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)', borderColor: section.color + '25' }}
            >
              {/* Faixa de cor no topo */}
              <div className="h-1" style={{ background: `linear-gradient(90deg, ${section.color}, ${section.color}50)` }} />

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: section.color + '15' }}>
                    <section.icon size={16} style={{ color: section.color }} />
                  </div>
                  {/* Badge construindo + ampulheta animada */}
                  <div className="flex items-center gap-1.5 px-2 py-1 rounded-xl"
                    style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
                    <motion.div
                      animate={{ rotate: [0, 0, 180, 180, 180, 360] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', times: [0, 0.3, 0.5, 0.7, 0.8, 1] }}
                    >
                      <Hourglass size={11} style={{ color: '#f59e0b' }} />
                    </motion.div>
                    <span className="text-[10px] font-extrabold tracking-wide" style={{ color: '#f59e0b' }}>Construindo</span>
                  </div>
                </div>

                <p className="text-sm font-extrabold text-text mb-1">{section.label}</p>
                <p className="text-[11px] leading-relaxed" style={{ color: '#8890b5' }}>{section.desc}</p>

                {/* Skeleton placeholder */}
                <div className="mt-4 space-y-2">
                  {[70, 50, 85].map((w, j) => (
                    <div key={j} className="h-2 rounded-full animate-pulse" style={{ width: `${w}%`, background: section.color + '20' }} />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Missoes Urgentes */}
      <AnimatePresence>
        {urgent.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-danger" />
              <p className="text-sm font-extrabold text-danger">Missoes Urgentes</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger">{urgent.length}</span>
            </div>
            <div className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(239,68,68,0.12), 0 0 0 1px rgba(239,68,68,0.12)' }}>
              {urgent.slice(0, 5).map((task, i) => (
                <TaskRow key={task.id} task={task} index={i}
                  clientMap={clientMap} collabMap={collabMap}
                  onStatusChange={handleStatusChange}
                  onEdit={openEditModal} />
              ))}
              {urgent.length > 5 && (
                <div className="px-5 py-2.5 text-center text-xs text-muted border-t border-border/40">
                  + {urgent.length - 5} tarefas urgentes na lista abaixo
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros — barra única compacta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">

        {/* Tipo — ícones compactos */}
        <div className="flex items-center bg-white border border-border rounded-xl p-0.5 flex-shrink-0"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
          <button onClick={() => setTypeF('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${typeF === 'all' ? 'bg-text text-white' : 'text-muted hover:text-text'}`}>
            Todos
          </button>
          {TYPE_KEYS.map(key => {
            const cfg = taskTypes[key]
            return (
              <button key={key} onClick={() => setTypeF(key)} title={cfg.label}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
                style={typeF === key ? { backgroundColor: cfg.color + '20', color: cfg.color } : { color: '#8890b5' }}>
                {cfg.icon}
              </button>
            )
          })}
        </div>

        {/* Status — só na list view */}
        {view === 'list' && (
          <div className="flex items-center bg-white border border-border rounded-xl p-0.5 flex-shrink-0"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
            <button onClick={() => setStatusF('all')}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${statusF === 'all' ? 'bg-text text-white' : 'text-muted hover:text-text'}`}>
              Todos
            </button>
            {STATUS_KEYS.map(key => {
              const cfg = statusConfig[key]
              return (
                <button key={key} onClick={() => setStatusF(key)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={statusF === key ? { backgroundColor: cfg.color, color: '#fff' } : { color: cfg.color }}>
                  {cfg.label}
                </button>
              )
            })}
          </div>
        )}

        {/* Cliente — dropdown */}
        <div className="relative flex-shrink-0">
          {clientF !== 'all' && (() => {
            const cl = erpClients.find(c => c.id === clientF)
            return cl ? (
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-sm flex items-center justify-center text-[7px] font-extrabold text-white pointer-events-none z-10"
                style={{ backgroundColor: cl.color }}>
                {cl.name[0]}
              </div>
            ) : null
          })()}
          <select
            value={clientF}
            onChange={e => setClientF(e.target.value)}
            className="appearance-none bg-white border rounded-xl text-xs font-bold pr-7 py-2 outline-none cursor-pointer transition-all"
            style={{
              paddingLeft: clientF !== 'all' ? '2rem' : '0.75rem',
              borderColor: clientF !== 'all' ? (erpClients.find(c => c.id === clientF)?.color || '#e0e3f0') : '#e0e3f0',
              color: clientF !== 'all' ? (erpClients.find(c => c.id === clientF)?.color || '#1a1d2e') : '#8890b5',
              boxShadow: '0 1px 4px rgba(26,29,46,0.06)',
              minWidth: 140,
            }}>
            <option value="all">Todos os clientes</option>
            {erpClients.map(cl => (
              <option key={cl.id} value={cl.id}>{cl.name}</option>
            ))}
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
          </div>
        </div>

        {/* Data de vencimento */}
        <div className="relative flex-shrink-0">
          <CalendarDays size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
            style={{ color: dateF !== 'all' ? (dateF === 'overdue' ? '#ef4444' : dateF === 'today' ? '#ea8a29' : '#60a5fa') : '#8890b5' }} />
          <select
            value={dateF}
            onChange={e => setDateF(e.target.value)}
            className="appearance-none bg-white border rounded-xl text-xs font-bold pl-7 pr-7 py-2 outline-none cursor-pointer transition-all"
            style={{
              borderColor: dateF !== 'all' ? (dateF === 'overdue' ? '#ef4444' : dateF === 'today' ? '#ea8a29' : '#60a5fa') : '#e0e3f0',
              color:       dateF !== 'all' ? (dateF === 'overdue' ? '#ef4444' : dateF === 'today' ? '#ea8a29' : '#60a5fa') : '#8890b5',
              boxShadow: '0 1px 4px rgba(26,29,46,0.06)',
              minWidth: 130,
            }}>
            <option value="all">Todas as datas</option>
            <option value="overdue">Atrasadas</option>
            <option value="today">Vence hoje</option>
            <option value="week">Esta semana</option>
            <option value="no_date">Sem data</option>
          </select>
          <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
          </div>
        </div>

        {/* Prioridade */}
        <div className="flex items-center bg-white border border-border rounded-xl p-0.5 flex-shrink-0"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
          <button onClick={() => setPriorityF('all')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${priorityF === 'all' ? 'bg-text text-white' : 'text-muted hover:text-text'}`}>
            Todas
          </button>
          {[
            { key: 'high',   label: 'Alta',  color: '#ef4444' },
            { key: 'medium', label: 'Média', color: '#ea8a29' },
            { key: 'low',    label: 'Baixa', color: '#8890b5' },
          ].map(p => (
            <button key={p.key} onClick={() => setPriorityF(priorityF === p.key ? 'all' : p.key)}
              title={p.label}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={priorityF === p.key
                ? { backgroundColor: p.color + '20', color: p.color }
                : { color: '#8890b5' }}>
              <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: priorityF === p.key ? p.color : p.color + '80' }} />
              {p.label}
            </button>
          ))}
        </div>

        {/* Responsável — avatares clicáveis sem texto */}
        <div className="flex items-center gap-0.5 flex-shrink-0 bg-white border border-border rounded-xl px-1.5 py-1"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
          <button onClick={() => setAssigneeF('all')} title="Equipe toda"
            className={`text-[9px] font-extrabold px-1.5 py-1 rounded-lg transition-all ${assigneeF === 'all' ? 'bg-text text-white' : 'text-muted hover:text-text'}`}>
            Todos
          </button>
          {teamMembers.map(m => (
            <button key={m.id} onClick={() => setAssigneeF(assigneeF === m.id ? 'all' : m.id)} title={m.name}
              className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white transition-all flex-shrink-0"
              style={{
                backgroundColor: m.color,
                opacity: assigneeF !== 'all' && assigneeF !== m.id ? 0.3 : 1,
                boxShadow: assigneeF === m.id ? `0 0 0 2px white, 0 0 0 3px ${m.color}` : 'none',
                transform: assigneeF === m.id ? 'scale(1.15)' : 'scale(1)',
              }}>
              {m.avatar}
            </button>
          ))}
        </div>

        {/* Busca */}
        <div className="relative ml-auto">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Buscar tarefa..."
            className="bg-white border border-border rounded-xl pl-8 pr-3 py-2 text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent/40 w-36"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }} />
        </div>

        {view === 'list' && (
          <button onClick={() => setShowDone(v => !v)}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border transition-all ${
              showDone ? 'bg-accent/10 text-accent border-accent/30' : 'bg-white text-muted border-border'
            }`}>
            <CheckCircle2 size={12} /> Concluidas
          </button>
        )}
      </div>

      {/* VIEW KANBAN */}
      {view === 'kanban' && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <p className="text-[10px] text-muted mb-3 flex items-center gap-1.5">
            <span className="opacity-60">✦</span> Arraste os cards entre colunas · Clique para editar
          </p>
          <div className="flex gap-4 overflow-x-auto pb-4" style={{ minHeight: 400 }}>
            {KANBAN_COLS.map(col => {
              const colTasks = filtered.filter(t => t.status === col.key)
              return (
                <KanbanColumn
                  key={col.key}
                  col={col}
                  tasks={colTasks}
                  clientMap={clientMap}
                  collabMap={collabMap}
                  onStatusChange={handleStatusChange}
                  onNewTask={() => { setModalInitStatus(col.key); setShowModal(true); setEditingTask(null) }}
                  onEdit={openEditModal}
                />
              )
            })}
          </div>
        </motion.div>
      )}

      {/* VIEW LISTA */}
      {view === 'list' && (
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <p className="text-xs font-extrabold text-muted uppercase tracking-wider">
              {filtered.length} {filtered.length === 1 ? 'tarefa' : 'tarefas'}
            </p>
            <p className="text-[10px] text-muted">
              Clique em qualquer linha para <span className="font-bold text-accent">editar</span>
            </p>
          </div>

          <AnimatePresence mode="popLayout">
            {filtered.map((task, i) => (
              <TaskRow key={task.id} task={task} index={i}
                clientMap={clientMap} collabMap={collabMap}
                onStatusChange={handleStatusChange}
                onEdit={openEditModal} />
            ))}
          </AnimatePresence>

          {filtered.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="flex flex-col items-center py-16 text-center">
              <span className="text-4xl mb-3">🎯</span>
              <p className="text-sm font-bold text-text">Nenhuma tarefa encontrada</p>
              <p className="text-xs text-muted mt-1">Ajuste os filtros ou crie uma nova tarefa</p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { setModalInitStatus('todo'); setShowModal(true); setEditingTask(null) }}
                className="mt-4 flex items-center gap-1.5 text-sm font-extrabold px-4 py-2 rounded-xl text-[#0f1117]"
                style={{ background: '#6eda2c' }}>
                <Plus size={14} /> Nova Tarefa
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* Legenda ons */}
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Ranks:</p>
        <span className="text-[10px] text-muted">
          {RANKS.map(r => `${r.icon} ${r.label} (${r.min}+)`).join(' · ')}
        </span>
      </div>

      {/* Modais */}
      <AnimatePresence>
        {(showModal || editingTask) && (
          <TarefaModal
            task={editingTask}
            initialStatus={modalInitStatus}
            onSave={handleSaveTarefa}
            onClose={closeModal}
            onDelete={async (id) => { await deleteTask(id); closeModal() }}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showTemplates && (
          <TaskTemplatesDrawer
            clientId={erpClients[0]?.id}
            clientName=""
            assignee={teamMembers[0]?.id}
            onApply={async (taskData) => { await handleSaveTarefa(taskData); setShowTemplates(false) }}
            onClose={() => setShowTemplates(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
