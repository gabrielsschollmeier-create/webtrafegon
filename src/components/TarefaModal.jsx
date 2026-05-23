import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Flag, Calendar, User, Tag, FileText } from 'lucide-react'
import { taskTypes, statusConfig } from '../data/erp-mock'
import { TASK_LEVELS } from '../data/tasks-store'
import { getAllUsers, TEAM_ROLES } from '../data/users-store'

const PRIORITIES = [
  { key: 'low',    label: 'Baixa',  color: '#8890b5' },
  { key: 'medium', label: 'Média',  color: '#ea8a29' },
  { key: 'high',   label: 'Alta',   color: '#ef4444' },
]

export default function TarefaModal({ clientId: clientIdProp, clientName, clients, onSave, onClose }) {
  const teamMembers = getAllUsers().filter(u => TEAM_ROLES.includes(u.role))
  const hasClientSelect = !clientIdProp && Array.isArray(clients) && clients.length > 0
  const [selectedClientId, setSelectedClientId] = useState(clientIdProp || clients?.[0]?.id || '')
  const clientId = selectedClientId

  const [title,       setTitle]       = useState('')
  const [type,        setType]        = useState('criativo')
  const [assignee,    setAssignee]    = useState(teamMembers[0]?.id || 'gs')
  const [dueDate,     setDueDate]     = useState('')
  const [priority,    setPriority]    = useState('medium')
  const [level,       setLevel]       = useState('operacao')
  const [description, setDescription] = useState('')
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)

  const member = teamMembers.find(m => m.id === assignee)
  const resolvedClientName = clientName || (clients && clients.find(c => c.id === clientId)?.name) || ''

  async function handleSave() {
    if (!title.trim()) return
    setSaving(true)
    await onSave({
      title:       title.trim(),
      type,
      clientId,
      assignee,
      dueDate:     dueDate || null,
      priority,
      level,
      description: description.trim(),
      status:      'todo',
    })
    setSaved(true)
    setTimeout(onClose, 900)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/40 z-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: -12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: -12 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-32px)] max-w-lg bg-white rounded-2xl z-50 overflow-hidden"
        style={{ boxShadow: '0 32px 80px rgba(26,29,46,0.22), 0 0 0 1px rgba(26,29,46,0.07)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div>
            <p className="text-sm font-extrabold text-text">Nova Tarefa</p>
            {resolvedClientName && <p className="text-[10px] text-muted mt-0.5">{resolvedClientName}</p>}
          </div>
          <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors">
            <X size={15} />
          </button>
        </div>

        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Cliente (quando aberto sem contexto) */}
          {hasClientSelect && (
            <div>
              <label className="block text-xs font-bold text-text-2 mb-2">
                Cliente *
              </label>
              <div className="flex flex-wrap gap-2">
                {clients.map(cl => (
                  <button
                    key={cl.id}
                    type="button"
                    onClick={() => setSelectedClientId(cl.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border transition-all text-sm font-bold"
                    style={{
                      backgroundColor: clientId === cl.id ? cl.color + '20' : 'white',
                      borderColor:     clientId === cl.id ? cl.color         : '#e0e3f0',
                      color:           clientId === cl.id ? cl.color         : '#8890b5',
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold text-white flex-shrink-0"
                      style={{ backgroundColor: cl.color }}
                    >
                      {cl.name[0]}
                    </div>
                    {cl.name}
                  </button>
                ))}
              </div>
              {!clientId && (
                <p className="text-[10px] text-danger mt-1">Selecione um cliente</p>
              )}
            </div>
          )}

          {/* Título */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1.5">Título *</label>
            <input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Criar criativos para campanha de maio"
              className="w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Tipo */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1.5 flex items-center gap-1.5">
              <Tag size={11} /> Tipo de entregável
            </label>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(taskTypes).map(([key, cfg]) => (
                <button key={key} onClick={() => setType(key)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all"
                  style={{
                    backgroundColor: type === key ? cfg.color : 'white',
                    color:           type === key ? '#0f1117' : cfg.color,
                    borderColor:     type === key ? cfg.color : cfg.color + '40',
                  }}>
                  {cfg.icon} {cfg.label}
                </button>
              ))}
            </div>
          </div>

          {/* Nível */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1.5">Visibilidade na linha do tempo</label>
            <div className="flex flex-col gap-2">
              {Object.entries(TASK_LEVELS).map(([key, cfg]) => (
                <button key={key} onClick={() => setLevel(key)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-left ${
                    level === key ? 'border-transparent' : 'border-border bg-white hover:border-border'
                  }`}
                  style={level === key ? { backgroundColor: cfg.color + '12', borderColor: cfg.color + '40' } : {}}>
                  <span className="text-base">{cfg.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold" style={{ color: level === key ? cfg.color : '#1a1d2e' }}>
                      {cfg.label}
                    </p>
                    <p className="text-[10px] text-muted leading-snug mt-0.5">{cfg.desc}</p>
                  </div>
                  {level === key && <Check size={13} style={{ color: cfg.color }} />}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Responsável */}
            <div>
              <label className="block text-xs font-bold text-text-2 mb-1.5 flex items-center gap-1.5">
                <User size={11} /> Responsável
              </label>
              <select
                value={assignee}
                onChange={e => setAssignee(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50"
              >
                {teamMembers.map(m => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
              {member && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ backgroundColor: member.color }}>
                    {member.avatar}
                  </div>
                  <span className="text-[10px] text-muted">{member.role || 'Colaborador'}</span>
                </div>
              )}
            </div>

            {/* Data limite */}
            <div>
              <label className="block text-xs font-bold text-text-2 mb-1.5 flex items-center gap-1.5">
                <Calendar size={11} /> Data limite
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                className="w-full bg-bg border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50"
              />
            </div>
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1.5 flex items-center gap-1.5">
              <Flag size={11} /> Prioridade
            </label>
            <div className="flex gap-2">
              {PRIORITIES.map(p => (
                <button key={p.key} onClick={() => setPriority(p.key)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    backgroundColor: priority === p.key ? p.color : 'white',
                    color:           priority === p.key ? 'white' : p.color,
                    borderColor:     priority === p.key ? p.color : p.color + '40',
                  }}>
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-bold text-text-2 mb-1.5 flex items-center gap-1.5">
              <FileText size={11} /> Descrição (opcional)
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Detalhes, links, contexto..."
              rows={3}
              className="w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 resize-none transition-colors"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-3">
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-bold text-muted border border-border hover:text-text-2 transition-colors">
            Cancelar
          </button>
          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave}
            disabled={!title.trim() || saving || (hasClientSelect && !clientId)}
            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
              saved ? 'bg-accent/10 text-accent border border-accent/20'
                    : !title.trim() ? 'bg-border text-muted cursor-not-allowed'
                    : 'bg-accent hover:bg-accent-hover text-[#15172a]'
            }`}>
            {saved ? <><Check size={14} /> Criada!</> : saving ? 'Salvando...' : 'Criar tarefa'}
          </motion.button>
        </div>
      </motion.div>
    </>
  )
}
