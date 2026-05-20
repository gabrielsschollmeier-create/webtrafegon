import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, CheckCircle2, AlertCircle, MoreHorizontal, Filter } from 'lucide-react'
import { tasks, erpClients, collaborators, taskTypes, statusConfig } from '../../data/erp-mock'

const clientMap  = Object.fromEntries(erpClients.map(c => [c.id, c]))
const collabMap  = Object.fromEntries(collaborators.map(c => [c.id, c]))

const priorityColor = { high: '#ef4444', medium: '#ea8a29', low: '#8890b5' }

function DeliveryRow({ task, index }) {
  const type     = taskTypes[task.type]
  const status   = statusConfig[task.status]
  const client   = clientMap[task.clientId]
  const assignee = collabMap[task.assignee]
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <motion.tr
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.25 }}
      className="border-b border-border/40 hover:bg-surface-2/60 transition-colors cursor-pointer group"
    >
      {/* Tipo */}
      <td className="px-5 py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg"
          style={{ color: type.color, backgroundColor: type.color + '15' }}
        >
          {type.icon} {type.label}
        </span>
      </td>

      {/* Tarefa */}
      <td className="px-5 py-3.5">
        <p className="text-sm font-semibold text-text">{task.title}</p>
        {task.description && <p className="text-[11px] text-muted truncate max-w-xs">{task.description}</p>}
      </td>

      {/* Cliente */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div
            className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold text-white"
            style={{ backgroundColor: client?.color }}
          >
            {client?.name[0]}
          </div>
          <span className="text-sm text-text-2 font-medium">{client?.name}</span>
        </div>
      </td>

      {/* Responsável */}
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-extrabold text-white"
            style={{ backgroundColor: assignee?.color }}
          >
            {assignee?.avatar}
          </div>
          <span className="text-sm text-text-2">{assignee?.name}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-5 py-3.5">
        <span
          className="inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-lg"
          style={{ color: status.color, backgroundColor: status.color + '18' }}
        >
          {task.status === 'done' ? <CheckCircle2 size={11} /> : <Clock size={11} />}
          {status.label}
        </span>
      </td>

      {/* Prazo */}
      <td className="px-5 py-3.5">
        <div className={`flex items-center gap-1.5 text-sm font-semibold ${isOverdue ? 'text-danger' : 'text-text-2'}`}>
          {isOverdue && <AlertCircle size={12} />}
          {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
        </div>
      </td>

      {/* Prioridade */}
      <td className="px-5 py-3.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: priorityColor[task.priority] }}
          title={task.priority}
        />
      </td>

      {/* Ações */}
      <td className="px-4 py-3.5">
        <button className="opacity-0 group-hover:opacity-100 transition-opacity w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04]">
          <MoreHorizontal size={14} />
        </button>
      </td>
    </motion.tr>
  )
}

const TYPE_FILTERS = ['all', ...Object.keys(taskTypes)]
const STATUS_FILTERS = ['all', 'todo', 'doing', 'review', 'done']

export default function Entregas() {
  const [typeF,   setTypeF]   = useState('all')
  const [statusF, setStatusF] = useState('all')
  const [clientF, setClientF] = useState('all')
  const [search,  setSearch]  = useState('')

  const filtered = tasks.filter(t => {
    const matchType   = typeF   === 'all' || t.type     === typeF
    const matchStatus = statusF === 'all' || t.status   === statusF
    const matchClient = clientF === 'all' || t.clientId === clientF
    const matchSearch = search  === ''   || t.title.toLowerCase().includes(search.toLowerCase())
    return matchType && matchStatus && matchClient && matchSearch
  })

  // Contadores por status
  const counts = {
    todo:   tasks.filter(t => t.status === 'todo').length,
    doing:  tasks.filter(t => t.status === 'doing').length,
    review: tasks.filter(t => t.status === 'review').length,
    done:   tasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-extrabold text-text">Entregas</h1>
        <p className="text-sm text-muted mt-0.5">Visão unificada de todos os entregáveis em andamento</p>

        {/* Status overview */}
        <div className="flex items-center gap-3 mt-6">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <motion.button
              key={key}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              onClick={() => setStatusF(statusF === key ? 'all' : key)}
              className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl transition-all"
              style={{
                backgroundColor: statusF === key ? cfg.color : cfg.color + '12',
                boxShadow: statusF === key ? `0 4px 14px ${cfg.color}35` : 'none',
              }}
            >
              <span className="text-xl font-extrabold" style={{ color: statusF === key ? '#fff' : cfg.color }}>
                {counts[key]}
              </span>
              <span className="text-xs font-bold" style={{ color: statusF === key ? 'rgba(255,255,255,0.85)' : cfg.color }}>
                {cfg.label}
              </span>
            </motion.button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar entrega..."
              className="bg-white border border-border rounded-xl px-3 py-2 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/40 transition-colors w-44"
              style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        {/* Tipo */}
        <div className="flex items-center bg-white border border-border rounded-xl p-0.5" style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
          {TYPE_FILTERS.map(key => {
            const cfg = key === 'all' ? null : taskTypes[key]
            return (
              <button key={key} onClick={() => setTypeF(key)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={typeF === key ? {
                  backgroundColor: cfg?.color || '#111827',
                  color: '#fff',
                } : {
                  color: cfg?.color || '#7680a8',
                }}
              >
                {cfg ? `${cfg.icon} ${cfg.label}` : 'Todos os tipos'}
              </button>
            )
          })}
        </div>

        {/* Cliente */}
        <select
          value={clientF}
          onChange={e => setClientF(e.target.value)}
          className="bg-white border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-2 focus:outline-none focus:border-accent/40 transition-colors"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}
        >
          <option value="all">Todos os clientes</option>
          {erpClients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {/* Tabela */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              {['Tipo', 'Tarefa', 'Cliente', 'Responsável', 'Status', 'Prazo', '', ''].map((col, i) => (
                <th key={i} className="text-left text-[10px] font-extrabold text-muted uppercase tracking-widest px-5 py-3.5">
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filtered.map((task, i) => (
                <DeliveryRow key={task.id} task={task} index={i} />
              ))}
            </AnimatePresence>
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-16 text-muted text-sm">Nenhuma entrega encontrada.</div>
        )}
      </motion.div>
    </div>
  )
}
