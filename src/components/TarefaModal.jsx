import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Flag, Calendar, User, Tag, FileText } from 'lucide-react'
import { taskTypes } from '../data/erp-mock'
import { TASK_LEVELS } from '../data/tasks-store'
import { getAllUsers, TEAM_ROLES } from '../data/users-store'

const PRIORITIES = [
  { key: 'low',    label: 'Baixa',  color: '#8890b5' },
  { key: 'medium', label: 'Media',  color: '#ea8a29' },
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

  const member   = teamMembers.find(m => m.id === assignee)
  const cliName  = clientName || (clients && clients.find(c => c.id === clientId)?.name) || ''
  const canSave  = !!title.trim() && (!hasClientSelect || !!clientId) && !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    await onSave({
      title: title.trim(), type, clientId, assignee,
      dueDate: dueDate || null, priority, level,
      description: description.trim(), status: 'todo',
    })
    setSaved(true)
    setTimeout(onClose, 900)
  }

  const INPUT = {
    className: 'w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none',
    style: { background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' },
  }

  return (
    <>
      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/*
        Container flex: items-end no mobile (anchora no fundo)
                        items-center no desktop (centraliza)
        pointer-events-none no container, pointer-events-auto no modal
        Assim o Framer Motion so anima y — sem conflito com translate do Tailwind
      */}
      <div className="fixed inset-0 z-50 flex items-end justify-center md:items-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-auto w-full md:w-[560px] bg-white rounded-t-3xl md:rounded-2xl flex flex-col"
          style={{
            maxHeight: '92dvh',
            boxShadow: '0 -8px 40px rgba(26,29,46,0.2), 0 0 0 1px rgba(26,29,46,0.07)',
          }}
        >
          {/* Drag handle — mobile only */}
          <div className="flex justify-center pt-3 pb-1 md:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#d1d5e8' }} />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b flex-shrink-0" style={{ borderColor: '#e0e3f0' }}>
            <div>
              <p className="text-sm font-extrabold" style={{ color: '#1a1d2e' }}>Nova Tarefa</p>
              {cliName && <p className="text-[10px] mt-0.5" style={{ color: '#8890b5' }}>{cliName}</p>}
            </div>
            <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ color: '#8890b5' }}>
              <X size={16} />
            </button>
          </div>

          {/* Body — scrollavel */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">

            {/* Cliente */}
            {hasClientSelect && (
              <div>
                <label className="block text-xs font-bold mb-2" style={{ color: '#4b5068' }}>Cliente *</label>
                <div className="flex flex-wrap gap-2">
                  {clients.map(cl => (
                    <button
                      key={cl.id} type="button"
                      onClick={() => setSelectedClientId(cl.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-bold transition-all"
                      style={{
                        backgroundColor: clientId === cl.id ? cl.color + '20' : 'white',
                        borderColor:     clientId === cl.id ? cl.color         : '#e0e3f0',
                        color:           clientId === cl.id ? cl.color         : '#8890b5',
                      }}
                    >
                      <div className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold text-white flex-shrink-0"
                        style={{ backgroundColor: cl.color }}>
                        {cl.name[0]}
                      </div>
                      {cl.name}
                    </button>
                  ))}
                </div>
                {!clientId && <p className="text-[10px] mt-1" style={{ color: '#ef4444' }}>Selecione um cliente</p>}
              </div>
            )}

            {/* Titulo */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>Titulo *</label>
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canSave && handleSave()}
                placeholder="Ex: Criar criativos para campanha de maio"
                {...INPUT}
              />
            </div>

            {/* Tipo */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                <Tag size={11} /> Tipo de entregavel
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

            {/* Nivel */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                Visibilidade na linha do tempo
              </label>
              <div className="flex flex-col gap-2">
                {Object.entries(TASK_LEVELS).map(([key, cfg]) => (
                  <button key={key} onClick={() => setLevel(key)}
                    className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl border transition-all text-left"
                    style={level === key
                      ? { backgroundColor: cfg.color + '12', borderColor: cfg.color + '40' }
                      : { backgroundColor: 'white', borderColor: '#e0e3f0' }}>
                    <span className="text-base">{cfg.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold" style={{ color: level === key ? cfg.color : '#1a1d2e' }}>{cfg.label}</p>
                      <p className="text-[10px] leading-snug mt-0.5" style={{ color: '#8890b5' }}>{cfg.desc}</p>
                    </div>
                    {level === key && <Check size={13} style={{ color: cfg.color }} />}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {/* Responsavel */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                  <User size={11} /> Responsavel
                </label>
                <select value={assignee} onChange={e => setAssignee(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                  style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }}>
                  {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                {member && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                      style={{ backgroundColor: member.color }}>
                      {member.avatar}
                    </div>
                    <span className="text-[10px]" style={{ color: '#8890b5' }}>{member.role || 'Colaborador'}</span>
                  </div>
                )}
              </div>

              {/* Data limite */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                  <Calendar size={11} /> Data limite
                </label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                  style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }} />
              </div>
            </div>

            {/* Prioridade */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
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

            {/* Descricao */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                <FileText size={11} /> Descricao (opcional)
              </label>
              <textarea value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Detalhes, links, contexto..."
                rows={3}
                className="w-full rounded-xl px-3.5 py-2.5 text-sm border resize-none outline-none"
                style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }} />
            </div>

            {/* Espaco extra para iOS home indicator */}
            <div className="h-2" />
          </div>

          {/* Footer fixo */}
          <div className="flex-shrink-0 px-5 py-4 border-t flex gap-3" style={{ borderColor: '#e0e3f0' }}>
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border transition-colors"
              style={{ color: '#8890b5', borderColor: '#e0e3f0', background: 'white' }}>
              Cancelar
            </button>
            <motion.button
              whileHover={{ scale: canSave ? 1.01 : 1 }}
              whileTap={{ scale: canSave ? 0.97 : 1 }}
              onClick={handleSave}
              disabled={!canSave}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all"
              style={{
                backgroundColor: saved ? '#dcfce7' : canSave ? '#c6f135' : '#e0e3f0',
                color:           saved ? '#16a34a' : canSave ? '#15172a' : '#8890b5',
                cursor: canSave ? 'pointer' : 'not-allowed',
              }}>
              {saved ? <><Check size={14} /> Criada!</> : saving ? 'Salvando...' : 'Criar tarefa'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
