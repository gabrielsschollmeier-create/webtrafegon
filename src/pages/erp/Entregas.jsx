import { useState, useMemo, useEffect, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLocation } from 'react-router-dom'
import {
  Clock, CheckCircle2, AlertCircle, Plus, Zap, Trophy,
  Target, TrendingUp, Search, ChevronRight, ChevronLeft, ChevronDown, Flame,
  LayoutGrid, List, Hourglass, Info, Gift, BarChart3, CalendarDays, ArrowUpDown
} from 'lucide-react'
import { taskTypes, statusConfig, TASK_FLAGS } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import { getAllUsers, TEAM_ROLES } from '../../data/users-store'
import TarefaModal from '../../components/TarefaModal'
import TaskTemplatesDrawer from '../../components/TaskTemplatesDrawer'
import UserAvatar from '../../components/UserAvatar'

/* Seletor de responsável com busca — mais fácil de achar a pessoa que a fila de avatares */
function AssigneeSelect({ members, value, onChange }) {
  const [open, setOpen] = useState(false)
  const [q, setQ]       = useState('')
  const selected = value !== 'all' ? members.find(m => m.id === value) : null
  const filtered = q ? members.filter(m => (m.name || '').toLowerCase().includes(q.toLowerCase())) : members
  return (
    <div className="relative flex-shrink-0">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 bg-white border border-border rounded-xl pl-1.5 pr-2.5 py-1 text-xs font-bold text-text hover:border-accent/40 transition-all"
        style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)', minHeight: 34 }}>
        {selected
          ? <><UserAvatar user={selected} size={22} /><span className="max-w-[100px] truncate">{selected.name}</span></>
          : <span className="text-muted px-1">Responsável</span>}
        <ChevronDown size={12} className="text-muted flex-shrink-0" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => { setOpen(false); setQ('') }} />
          <div className="absolute right-0 z-30 mt-1 w-56 bg-white border border-border rounded-xl p-1.5"
            style={{ boxShadow: '0 8px 28px rgba(26,29,46,0.16)' }}>
            <div className="relative mb-1.5">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar pessoa..."
                className="w-full bg-surface border border-border rounded-lg pl-7 pr-2 py-1.5 text-xs text-text placeholder:text-muted focus:outline-none focus:border-accent/40" />
            </div>
            <div className="max-h-60 overflow-auto">
              <button onClick={() => { onChange('all'); setOpen(false); setQ('') }}
                className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors hover:bg-surface ${value === 'all' ? 'bg-surface' : ''}`}>
                <span className="w-[22px] h-[22px] rounded-full bg-text/10 flex items-center justify-center text-[9px] font-extrabold text-text flex-shrink-0">T</span>
                Equipe toda
              </button>
              {filtered.map(m => (
                <button key={m.id} onClick={() => { onChange(m.id); setOpen(false); setQ('') }}
                  className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs font-semibold text-left transition-colors hover:bg-surface ${value === m.id ? 'bg-surface' : ''}`}>
                  <UserAvatar user={m} size={22} />
                  <span className="truncate">{m.name}</span>
                </button>
              ))}
              {filtered.length === 0 && <p className="text-[11px] text-muted px-2 py-2">Ninguém encontrado</p>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

/* Ons & Ranking */
const RANKS = [
  { min: 0,   label: 'Iniciante',    icon: '🌱', color: '#8890b5', bg: '#8890b512' },
  { min: 15,  label: 'Executor',     icon: '⚡', color: '#60a5fa', bg: '#60a5fa12' },
  { min: 50,  label: 'Velocista',    icon: '🚀', color: '#ea8a29', bg: '#ea8a2912' },
  { min: 120, label: 'Especialista', icon: '🏆', color: '#6eda2c', bg: '#6eda2c12' },
  { min: 250, label: 'Elite',        icon: '👑', color: '#f59e0b', bg: '#f59e0b12' },
]

const KANBAN_COLS = [
  { key: 'todo',     label: 'A Fazer',                color: '#60a5fa', emoji: '📋' },
  { key: 'doing',    label: 'Em Andamento',            color: '#f59e0b', emoji: '🔄' },
  { key: 'review',   label: 'Em Revisao',              color: '#be29ec', emoji: '👁️' },
  { key: 'aprovado', label: 'Aprovados para anúncios', color: '#ea8a29', emoji: '🚀' },
  { key: 'done',     label: 'Concluido',               color: '#6eda2c', emoji: '✅' },
]

function getRank(ons) {
  let rank = RANKS[0], idx = 0
  for (let i = 0; i < RANKS.length; i++) { if (ons >= RANKS[i].min) { rank = RANKS[i]; idx = i } }
  const nextRank = RANKS[idx + 1]
  const pct = nextRank
    ? Math.min(100, Math.round(((ons - rank.min) / (nextRank.min - rank.min)) * 100))
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
const CollabCard = memo(function CollabCard({ member, allTasks, position, layoutId }) {
  const memberTasks = allTasks.filter(t => t.assignee === member.id)
  const todo    = memberTasks.filter(t => t.status === 'todo').length
  const done    = memberTasks.filter(t => t.status === 'done').length
  const doing   = memberTasks.filter(t => t.status === 'doing' || t.status === 'review').length
  const overdue = memberTasks.filter(t => t.status !== 'done' && t.dueDate && new Date(t.dueDate + 'T00:00:00') < new Date()).length
  const ons     = calcOns(member.id, allTasks)
  const rank    = getRank(ons)
  const medals  = ['🥇', '🥈', '🥉']

  return (
    <motion.div
      layout
      layoutId={layoutId}
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ layout: { type: 'spring', stiffness: 300, damping: 30 }, delay: position * 0.05 }}
      className="bg-white rounded-xl p-3 relative"
      style={{
        boxShadow: position === 0
          ? '0 2px 14px rgba(245,158,11,0.18), 0 0 0 1.5px rgba(245,158,11,0.25)'
          : '0 1px 6px rgba(26,29,46,0.07)',
      }}
    >
      <div className="flex items-center gap-2 mb-2">
        <div className="w-4 text-center flex-shrink-0">
          {position < 3
            ? <span className="text-sm leading-none">{medals[position]}</span>
            : <span className="text-[10px] font-bold text-muted">#{position + 1}</span>
          }
        </div>
        <motion.div
          animate={position === 0 ? { boxShadow: ['0 0 0px #f59e0b00','0 0 8px #f59e0b55','0 0 0px #f59e0b00'] } : {}}
          transition={{ repeat: Infinity, duration: 2.5 }}
          className="flex-shrink-0"
          style={{ borderRadius: 8, border: position === 0 ? '1.5px solid #f59e0b' : `1.5px solid ${member.color}35` }}
        >
          <UserAvatar user={member} size={28} rounded="lg" showBelt />
        </motion.div>
        <p className="text-xs font-extrabold text-text truncate flex-1 min-w-0">{member.name.split(' ')[0]}</p>
        <span className="text-xs font-extrabold flex-shrink-0" style={{ color: rank.color }}>
          {ons}<span className="text-[9px] font-semibold ml-0.5">ons</span>
        </span>
      </div>

      <div className="h-[3px] rounded-full overflow-hidden mb-1.5" style={{ background: rank.color + '18' }}>
        <motion.div className="h-full rounded-full" style={{ background: rank.color }}
          initial={{ width: 0 }} animate={{ width: `${rank.pct}%` }}
          transition={{ duration: 0.8, delay: position * 0.05 + 0.2, ease: [0.22,1,0.36,1] }} />
      </div>

      <div className="text-[9px] text-muted mb-2">
        {rank.pct}%{rank.nextRank ? ` → ${rank.nextRank.min} ons` : ''}
      </div>

      <div className="grid grid-cols-4 gap-1">
        {[
          { label: 'A Fazer', value: todo,   color: '#8890b5' },
          { label: 'Feitas',  value: done,   color: '#6eda2c' },
          { label: 'Fazendo', value: doing,  color: '#60a5fa' },
          { label: 'Atraso',  value: overdue, color: overdue > 0 ? '#ef4444' : '#8890b5' },
        ].map(s => (
          <div key={s.label} className="text-center rounded-lg py-1" style={{ backgroundColor: s.color + '10' }}>
            <p className="text-xs font-extrabold leading-none mb-0.5" style={{ color: s.color }}>{s.value}</p>
            <p className="text-[8px] font-bold text-muted uppercase tracking-wide leading-none">{s.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
})

/* TaskRow (lista) */
const TaskRow = memo(function TaskRow({ task, clientMap, collabMap, onStatusChange, onEdit, index }) {
  const [hovering,  setHovering]  = useState(false)
  const [advancing, setAdvancing] = useState(false)

  const type     = taskTypes[task.type]      || { icon: '📌', color: '#8890b5', label: 'Outro' }
  const status   = statusConfig[task.status] || statusConfig.todo
  const client   = clientMap[task.clientId]
  const assignee = collabMap[task.assignee]
  const today    = new Date().toLocaleDateString('en-CA')
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
})

/* KanbanCard */
const KanbanCard = memo(function KanbanCard({ task, clientMap, collabMap, onStatusChange, onEdit }) {
  const [advancing, setAdvancing] = useState(false)

  const type     = taskTypes[task.type]      || { icon: '📌', color: '#8890b5', label: 'Outro' }
  const status   = statusConfig[task.status] || statusConfig.todo
  const client   = clientMap[task.clientId]
  const assignee = collabMap[task.assignee]
  const today    = new Date().toLocaleDateString('en-CA')
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
                className="w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0"
                style={{ backgroundColor: client.color }}>
                {client.name.slice(0, 2).toUpperCase()}
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
})

/* KanbanColumn */
function KanbanColumn({ col, tasks, clientMap, collabMap, onStatusChange, onNewTask, onEdit, sorted, onToggleSort }) {
  const [isDragOver, setIsDragOver] = useState(false)

  const displayTasks = sorted
    ? [...tasks].sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return a.dueDate.localeCompare(b.dueDate)
      })
    : tasks

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
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleSort}
            title={sorted ? 'Remover ordenação por prazo' : 'Ordenar por prazo (mais próximo primeiro)'}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: sorted ? col.color + '35' : 'transparent', color: sorted ? col.color : col.color + '60' }}>
            <ArrowUpDown size={10} />
          </button>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
            onClick={onNewTask}
            className="w-6 h-6 rounded-lg flex items-center justify-center transition-colors"
            style={{ backgroundColor: col.color + '25', color: col.color }}
            title="Nova tarefa nesta coluna">
            <Plus size={12} />
          </motion.button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2" style={{ minHeight: 120, maxHeight: 'calc(100vh - 380px)' }}>
        {isDragOver && tasks.length === 0 && (
          <div className="flex items-center justify-center py-6 rounded-xl border-2 border-dashed"
            style={{ borderColor: col.color + '50' }}>
            <p className="text-[11px] font-bold" style={{ color: col.color }}>Soltar aqui</p>
          </div>
        )}
        <AnimatePresence mode="popLayout">
          {displayTasks.map(task => (
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

const MONTH_NAMES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']
const DOW_NAMES   = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']

function CalendarView({ tasks, onEdit, clientMap }) {
  const [current,      setCurrent]      = useState(() => new Date())
  const [expandedDay,  setExpandedDay]  = useState(null)
  const year  = current.getFullYear()
  const month = current.getMonth()

  const firstDow    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDow; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const todayDate  = new Date()
  const isToday    = (d) => d && todayDate.getFullYear() === year && todayDate.getMonth() === month && todayDate.getDate() === d
  const isWeekend  = (cellIdx) => cellIdx % 7 === 0 || cellIdx % 7 === 6

  function tasksForDay(d) {
    if (!d) return []
    const ds = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    return tasks.filter(t => t.dueDate === ds)
  }

  const monthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`
  const totalTasks  = tasks.filter(t => t.dueDate?.startsWith(monthPrefix)).length

  const STATUS_DOT = { todo: '#60a5fa', doing: '#f59e0b', review: '#be29ec', aprovado: '#ea8a29', done: '#6eda2c' }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
      {/* Header navegação */}
      <div className="flex items-center justify-between mb-5 px-1">
        <button
          onClick={() => { setCurrent(new Date(year, month - 1)); setExpandedDay(null) }}
          className="w-9 h-9 rounded-xl border border-border text-muted hover:text-text hover:border-accent/40 flex items-center justify-center transition-all"
        ><ChevronLeft size={16} /></button>
        <div className="text-center">
          <p className="text-base font-extrabold text-text">{MONTH_NAMES[month]} {year}</p>
          <p className="text-[11px] text-muted mt-0.5">{totalTasks} {totalTasks === 1 ? 'tarefa' : 'tarefas'} este mês</p>
        </div>
        <button
          onClick={() => { setCurrent(new Date(year, month + 1)); setExpandedDay(null) }}
          className="w-9 h-9 rounded-xl border border-border text-muted hover:text-text hover:border-accent/40 flex items-center justify-center transition-all"
        ><ChevronRight size={16} /></button>
      </div>

      {/* Cabeçalho dias da semana */}
      <div className="grid grid-cols-7 mb-1">
        {DOW_NAMES.map((d, i) => (
          <p key={d} className="text-center text-[11px] font-extrabold uppercase tracking-wider py-2"
            style={{ color: i === 0 || i === 6 ? '#c0c5dc' : '#8890b5' }}>{d}</p>
        ))}
      </div>

      {/* Grid de dias */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((day, i) => {
          const dayTasks   = tasksForDay(day)
          const today_     = isToday(day)
          const weekend    = isWeekend(i)
          const isExpanded = expandedDay === day && day !== null
          const visibleMax = isExpanded ? dayTasks.length : 3

          return (
            <div
              key={i}
              className="rounded-2xl transition-all"
              style={{
                minHeight: isExpanded ? 'auto' : 120,
                backgroundColor: day
                  ? today_   ? '#1a1d2e06'
                  : weekend  ? '#f5f6fc'
                  : 'white'
                  : 'transparent',
                boxShadow: day && !today_ ? '0 1px 4px rgba(26,29,46,0.05), 0 0 0 1px rgba(26,29,46,0.04)' : 'none',
                outline: today_ ? '2.5px solid #6eda2c' : 'none',
                outlineOffset: -1,
                padding: day ? '10px 8px 8px' : 0,
              }}
            >
              {day && (
                <>
                  {/* Número do dia */}
                  <div className="flex items-center justify-between mb-1.5">
                    {today_ ? (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-extrabold"
                        style={{ background: '#6eda2c' }}>
                        {day}
                      </div>
                    ) : (
                      <p className="text-[12px] font-extrabold leading-none"
                        style={{ color: weekend ? '#c0c5dc' : '#4b5068' }}>{day}</p>
                    )}
                    {dayTasks.length > 0 && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full leading-none"
                        style={{ background: '#60a5fa18', color: '#60a5fa' }}>
                        {dayTasks.length}
                      </span>
                    )}
                  </div>

                  {/* Chips de tarefas */}
                  <div className="flex flex-col gap-1">
                    {dayTasks.slice(0, visibleMax).map(task => {
                      const tt = taskTypes[task.type]
                      const sc = STATUS_DOT[task.status] || '#8890b5'
                      const cl = clientMap?.[task.clientId]
                      return (
                        <button
                          key={task.id}
                          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task) }}
                          title={`${task.title}${cl ? ' · ' + cl.name : ''}`}
                          className="text-left text-[9px] font-bold rounded-lg w-full transition-all hover:opacity-90 group"
                          style={{
                            backgroundColor: (tt?.color || sc) + '18',
                            border: `1px solid ${tt?.color || sc}25`,
                            padding: '3px 6px',
                          }}
                        >
                          <div className="flex items-start gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5"
                              style={{ backgroundColor: sc }} />
                            <span className="leading-snug line-clamp-2" style={{ color: tt?.color || '#4b5068' }}>
                              {task.title}
                            </span>
                          </div>
                          {cl && (
                            <div className="flex items-center gap-1 mt-1">
                              <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0"
                                style={{ backgroundColor: cl.color }} />
                              <span className="text-[8px] truncate" style={{ color: '#8890b5' }}>{cl.name}</span>
                            </div>
                          )}
                        </button>
                      )
                    })}
                    {dayTasks.length > 3 && (
                      <button
                        onClick={() => setExpandedDay(isExpanded ? null : day)}
                        className="text-[9px] font-bold text-center py-1 rounded-lg transition-all w-full"
                        style={{ color: '#60a5fa', background: '#60a5fa10' }}>
                        {isExpanded ? '▲ Mostrar menos' : `+${dayTasks.length - 3} mais`}
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* Entregas */
export default function Entregas() {
  const { tasks, erpClients, collaborators, addTask, addMilestone, updateTask, deleteTask, loading } = useData()
  const teamMembers = getAllUsers().filter(u => TEAM_ROLES.includes(u.role))
  const location    = useLocation()

  const clientMap  = useMemo(() => Object.fromEntries(erpClients.map(c => [c.id, c])), [erpClients])
  const collabMap  = useMemo(() => Object.fromEntries(collaborators.map(c => [c.id, c])), [collaborators])

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
  const [showOnsGuide,    setShowOnsGuide]    = useState(false)
  const [urgentCollapsed, setUrgentCollapsed] = useState(true)
  const [showAllUrgent,   setShowAllUrgent]   = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showTypeFilter,  setShowTypeFilter]  = useState(false)
  const [customDateF,     setCustomDateF]     = useState('')
  const [customDateF2,    setCustomDateF2]    = useState('')
  const [sortedCols,      setSortedCols]      = useState(new Set())
  const [groupByDate,     setGroupByDate]     = useState(false)
  const [dateField,       setDateField]       = useState('due')

  const today = new Date().toLocaleDateString('en-CA')

  // Abre modal da tarefa quando chega via notificacao (navigate com state.openTask)
  useEffect(() => {
    if (location.state?.openTask) {
      setEditingTask(location.state.openTask)
      // Limpa o state para nao reabrir ao navegar de volta
      window.history.replaceState({}, document.title)
    }
  }, [location.state])

  const { totalTasks, doneTasks, doingTasks, overdueTasks, dueTodayTasks, teamRate } = useMemo(() => {
    const total   = tasks.length
    const done    = tasks.filter(t => t.status === 'done').length
    const doing   = tasks.filter(t => t.status === 'doing').length
    const overdue = tasks.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length
    const dueToday = tasks.filter(t => t.status !== 'done' && t.dueDate === today).length
    return {
      totalTasks: total, doneTasks: done, doingTasks: doing,
      overdueTasks: overdue, dueTodayTasks: dueToday,
      teamRate: total > 0 ? Math.round((done / total) * 100) : 0,
    }
  }, [tasks, today])

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
      const taskDate      = dateField === 'created'
        ? (t.createdAt ? t.createdAt.split('T')[0] : null)
        : (t.dueDate || null)
      const matchDate     = dateF === 'all'     ? true
        : dateF === 'overdue'  ? (t.status !== 'done' && !!t.dueDate && t.dueDate < today)
        : dateF === 'today'    ? (taskDate === today)
        : dateF === 'week'     ? (!!taskDate && taskDate >= today && taskDate <= eow)
        : dateF === 'no_date'  ? (!taskDate)
        : dateF === 'custom'   ? (!!customDateF && taskDate === customDateF)
        : dateF === 'range'    ? (!!customDateF && !!taskDate && taskDate >= customDateF && (!customDateF2 || taskDate <= customDateF2))
        : true
      return matchType && matchStatus && matchClient && matchAssignee && matchSearch && matchPriority && matchDate
    })
  }, [tasks, typeF, statusF, clientF, assigneeF, search, showDone, priorityF, dateF, customDateF, customDateF2, dateField, today])

  const dateGroups = useMemo(() => {
    if (!groupByDate) return null
    const endOfWeek = new Date(today)
    endOfWeek.setDate(endOfWeek.getDate() + 6)
    const eow = endOfWeek.toISOString().split('T')[0]
    const groups = [
      { key: 'overdue', label: 'Atrasadas',    color: '#ef4444', tasks: [] },
      { key: 'today',   label: 'Hoje',          color: '#ea8a29', tasks: [] },
      { key: 'week',    label: 'Esta Semana',   color: '#60a5fa', tasks: [] },
      { key: 'future',  label: 'Próximas',      color: '#8890b5', tasks: [] },
      { key: 'no_date', label: 'Sem data',      color: '#c0c5dc', tasks: [] },
    ]
    for (const t of filtered) {
      const td = dateField === 'created'
        ? (t.createdAt ? t.createdAt.split('T')[0] : null)
        : (t.dueDate || null)
      if (!td)                                          { groups[4].tasks.push(t); continue }
      if (t.status !== 'done' && td < today)            { groups[0].tasks.push(t); continue }
      if (td === today)                                 { groups[1].tasks.push(t); continue }
      if (td > today && td <= eow)                      { groups[2].tasks.push(t); continue }
      groups[3].tasks.push(t)
    }
    return groups.filter(g => g.tasks.length > 0)
  }, [filtered, groupByDate, dateField, today])

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

  if (loading) return (
    <div className="p-4 lg:p-6 min-h-screen animate-pulse space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-8 w-40 bg-surface rounded-xl" />
        <div className="h-9 w-32 bg-surface rounded-xl" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 bg-surface rounded-xl" />)}
      </div>
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => <div key={i} className="flex-shrink-0 w-72 h-96 bg-surface rounded-2xl" />)}
      </div>
    </div>
  )

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
            <button
              onClick={() => setView('calendar')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={view === 'calendar'
                ? { backgroundColor: '#1a1d2e', color: 'white' }
                : { color: '#8890b5' }}>
              <CalendarDays size={13} /> Calendário
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

      {/* Ranking — compacto e colapsável */}
      <div className="bg-white rounded-2xl mb-4 overflow-hidden"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>
        <button
          onClick={() => setShowLeaderboard(v => !v)}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-2/30 transition-colors text-left">
          <Trophy size={13} style={{ color: '#f59e0b' }} />
          <span className="text-xs font-extrabold text-text">Ranking</span>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 overflow-hidden">
            {leaderboard.slice(0, 5).map((m, i) => (
              <span key={m.id} className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                style={{ background: m.color + '15', color: m.color }}>
                #{i + 1} {m.name.split(' ')[0]} · {m.ons}ons
              </span>
            ))}
            {leaderboard.length > 5 && (
              <span className="text-[10px] text-muted flex-shrink-0">+{leaderboard.length - 5}</span>
            )}
          </div>
          <motion.span animate={{ rotate: showLeaderboard ? 180 : 0 }} transition={{ duration: 0.2 }} className="text-muted flex-shrink-0">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
          </motion.span>
        </button>
        <AnimatePresence initial={false}>
          {showLeaderboard && (
            <motion.div
              initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              style={{ overflow: 'hidden' }}>
              <div className="px-4 pb-4 pt-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-2"
                style={{ borderTop: '1px solid #f0f2fb' }}>
                {leaderboard.map((member, i) => (
                  <CollabCard key={member.id} layoutId={`collab-${member.id}`} member={member} allTasks={tasks} position={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Missoes Urgentes */}
      <AnimatePresence>
        {urgent.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Flame size={14} className="text-danger" />
              <p className="text-sm font-extrabold text-danger">Missoes Urgentes</p>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-danger/10 text-danger">{urgent.length}</span>
              <button
                onClick={() => setUrgentCollapsed(v => !v)}
                className="ml-auto flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-all"
                style={{ color: '#8890b5', background: '#f0f2fb' }}>
                {urgentCollapsed ? <><ChevronDown size={10} /> Expandir</> : <><ChevronDown size={10} style={{ transform: 'rotate(180deg)' }} /> Minimizar</>}
              </button>
            </div>
            <AnimatePresence initial={false}>
              {!urgentCollapsed && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="bg-white rounded-2xl overflow-hidden"
                    style={{ boxShadow: '0 2px 12px rgba(239,68,68,0.12), 0 0 0 1px rgba(239,68,68,0.12)' }}>
                    {(showAllUrgent ? urgent : urgent.slice(0, 5)).map((task, i) => (
                      <TaskRow key={task.id} task={task} index={i}
                        clientMap={clientMap} collabMap={collabMap}
                        onStatusChange={handleStatusChange}
                        onEdit={openEditModal} />
                    ))}
                    {urgent.length > 5 && (
                      <button
                        onClick={() => setShowAllUrgent(v => !v)}
                        className="w-full px-5 py-2.5 text-center text-xs font-bold text-danger border-t border-border/40 hover:bg-danger/5 transition-colors"
                      >
                        {showAllUrgent
                          ? '▲ Mostrar menos'
                          : `▼ Ver todas as ${urgent.length} tarefas urgentes`}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filtros — barra única compacta */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">

        {/* Tipo — colapsável */}
        <div className="flex-shrink-0">
          <AnimatePresence initial={false} mode="wait">
            {!showTypeFilter ? (
              <motion.button key="collapsed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setShowTypeFilter(true)}
                className="flex items-center gap-1.5 bg-white border rounded-xl px-3 py-2 text-xs font-bold transition-all"
                style={{
                  borderColor: typeF !== 'all' ? (taskTypes[typeF]?.color + '60' || '#e0e3f0') : '#e0e3f0',
                  color:       typeF !== 'all' ? taskTypes[typeF]?.color : '#8890b5',
                  boxShadow: '0 1px 4px rgba(26,29,46,0.06)',
                }}>
                <span>{typeF !== 'all' ? taskTypes[typeF]?.icon : '📌'}</span>
                <span>{typeF !== 'all' ? taskTypes[typeF]?.label : 'Tipo'}</span>
                <ChevronDown size={10} />
              </motion.button>
            ) : (
              <motion.div key="expanded" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-center bg-white border border-border rounded-xl p-0.5"
                style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
                <button onClick={() => { setTypeF('all'); setShowTypeFilter(false) }}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${typeF === 'all' ? 'bg-text text-white' : 'text-muted hover:text-text'}`}>
                  Todos
                </button>
                {TYPE_KEYS.map(key => {
                  const cfg = taskTypes[key]
                  return (
                    <button key={key} onClick={() => { setTypeF(key); setShowTypeFilter(false) }} title={cfg.label}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all"
                      style={typeF === key ? { backgroundColor: cfg.color + '20', color: cfg.color } : { color: '#8890b5' }}>
                      {cfg.icon}
                    </button>
                  )
                })}
                <button onClick={() => setShowTypeFilter(false)}
                  className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-text transition-all ml-0.5">
                  <ChevronDown size={10} style={{ transform: 'rotate(180deg)' }} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
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

        {/* Data — campo + modo */}
        <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap">

          {/* Toggle: Vencimento | Criação */}
          <div className="flex items-center bg-white border border-border rounded-xl p-0.5"
            style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
            <button
              onClick={() => { setDateField('due'); setDateF('all'); setCustomDateF(''); setCustomDateF2('') }}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={dateField === 'due' ? { background: '#1a1d2e', color: 'white' } : { color: '#8890b5' }}>
              Vencimento
            </button>
            <button
              onClick={() => { setDateField('created'); setDateF('all'); setCustomDateF(''); setCustomDateF2('') }}
              className="px-2.5 py-1.5 rounded-lg text-[10px] font-bold transition-all"
              style={dateField === 'created' ? { background: '#1a1d2e', color: 'white' } : { color: '#8890b5' }}>
              Criação
            </button>
          </div>

          {/* Select de período */}
          <div className="relative">
            <CalendarDays size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ color: dateF !== 'all'
                ? dateF === 'overdue' ? '#ef4444'
                : dateF === 'today'   ? '#ea8a29'
                : dateF === 'range'   ? '#be29ec'
                : '#60a5fa'
                : '#8890b5' }} />
            <select
              value={dateF}
              onChange={e => { setDateF(e.target.value); setCustomDateF(''); setCustomDateF2('') }}
              className="appearance-none bg-white border rounded-xl text-xs font-bold pl-7 pr-7 py-2 outline-none cursor-pointer transition-all"
              style={{
                borderColor: dateF !== 'all'
                  ? dateF === 'overdue' ? '#ef4444'
                  : dateF === 'today'   ? '#ea8a29'
                  : dateF === 'range'   ? '#be29ec'
                  : '#60a5fa'
                  : '#e0e3f0',
                color: dateF !== 'all'
                  ? dateF === 'overdue' ? '#ef4444'
                  : dateF === 'today'   ? '#ea8a29'
                  : dateF === 'range'   ? '#be29ec'
                  : '#60a5fa'
                  : '#8890b5',
                boxShadow: '0 1px 4px rgba(26,29,46,0.06)',
                minWidth: 130,
              }}>
              <option value="all">Todas as datas</option>
              {dateField === 'due' && <option value="overdue">Atrasadas</option>}
              <option value="today">{dateField === 'due' ? 'Vence hoje' : 'Criado hoje'}</option>
              <option value="week">{dateField === 'due' ? 'Vence esta semana' : 'Criado esta semana'}</option>
              {dateField === 'due' && <option value="no_date">Sem data</option>}
              <option value="custom">Dia específico</option>
              <option value="range">Período (entre)</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
              <svg width="10" height="6" viewBox="0 0 10 6" fill="currentColor"><path d="M0 0l5 6 5-6z"/></svg>
            </div>
          </div>

          {dateF === 'custom' && (
            <input
              type="date"
              value={customDateF}
              onChange={e => setCustomDateF(e.target.value)}
              className="bg-white border rounded-xl text-xs font-bold px-2.5 py-2 outline-none cursor-pointer"
              style={{ borderColor: '#60a5fa50', color: '#60a5fa', boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}
            />
          )}

          {dateF === 'range' && (
            <div className="flex items-center gap-1">
              <input
                type="date"
                value={customDateF}
                onChange={e => setCustomDateF(e.target.value)}
                className="bg-white border rounded-xl text-xs font-bold px-2.5 py-2 outline-none cursor-pointer"
                style={{ borderColor: '#be29ec50', color: '#be29ec', boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}
              />
              <span className="text-[10px] font-bold text-muted">até</span>
              <input
                type="date"
                value={customDateF2}
                min={customDateF || undefined}
                onChange={e => setCustomDateF2(e.target.value)}
                className="bg-white border rounded-xl text-xs font-bold px-2.5 py-2 outline-none cursor-pointer"
                style={{ borderColor: '#be29ec50', color: '#be29ec', boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}
              />
            </div>
          )}
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

        {/* Responsável — seletor com busca (acha a pessoa pelo nome) */}
        <AssigneeSelect members={teamMembers} value={assigneeF} onChange={setAssigneeF} />

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
                  sorted={sortedCols.has(col.key)}
                  onToggleSort={() => setSortedCols(prev => {
                    const next = new Set(prev)
                    next.has(col.key) ? next.delete(col.key) : next.add(col.key)
                    return next
                  })}
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
            <div className="flex items-center gap-3">
              <button
                onClick={() => setGroupByDate(v => !v)}
                className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all"
                style={groupByDate
                  ? { background: '#60a5fa15', color: '#60a5fa', borderColor: '#60a5fa40' }
                  : { background: 'transparent', color: '#8890b5', borderColor: '#e0e3f0' }}>
                <CalendarDays size={11} /> Agrupar por data
              </button>
              <p className="text-[10px] text-muted hidden sm:block">
                Clique para <span className="font-bold text-accent">editar</span>
              </p>
            </div>
          </div>

          <AnimatePresence mode="popLayout">
            {dateGroups
              ? dateGroups.map(group => (
                  <div key={group.key}>
                    <div className="flex items-center gap-2 px-4 py-2 border-b border-border/40"
                      style={{ background: group.color + '08', borderLeftWidth: 3, borderLeftColor: group.color }}>
                      <span className="text-[11px] font-extrabold" style={{ color: group.color }}>{group.label}</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: group.color + '20', color: group.color }}>
                        {group.tasks.length}
                      </span>
                    </div>
                    {group.tasks.map((task, i) => (
                      <TaskRow key={task.id} task={task} index={i}
                        clientMap={clientMap} collabMap={collabMap}
                        onStatusChange={handleStatusChange}
                        onEdit={openEditModal} />
                    ))}
                  </div>
                ))
              : filtered.map((task, i) => (
                  <TaskRow key={task.id} task={task} index={i}
                    clientMap={clientMap} collabMap={collabMap}
                    onStatusChange={handleStatusChange}
                    onEdit={openEditModal} />
                ))
            }
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


      {/* VIEW CALENDÁRIO */}
      {view === 'calendar' && (
        <CalendarView tasks={filtered} onEdit={openEditModal} clientMap={clientMap} />
      )}

      {/* Modais */}
      <AnimatePresence>
        {(showModal || editingTask) && (
          <TarefaModal
            task={editingTask}
            initialStatus={modalInitStatus}
            onSave={handleSaveTarefa}
            onClose={closeModal}
            onDelete={async (id) => {
              const res = await deleteTask(id)
              // Banco recusou: devolve o erro para o modal exibir e mantem a tarefa
              if (res && res.ok === false) return res
              closeModal()
              return res
            }}
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
