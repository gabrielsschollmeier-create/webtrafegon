import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Check, Flag, Calendar, User, Tag, FileText, Paperclip, Upload } from 'lucide-react'
import { taskTypes } from '../data/erp-mock'
import { TASK_LEVELS } from '../data/tasks-store'
import { getAllUsers, TEAM_ROLES } from '../data/users-store'
import { useData } from '../contexts/DataContext'

const PRIORITIES = [
  { key: 'low',    label: 'Baixa', color: '#8890b5' },
  { key: 'medium', label: 'Media', color: '#ea8a29' },
  { key: 'high',   label: 'Alta',  color: '#ef4444' },
]

function formatBytes(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

export default function TarefaModal({ clientId: clientIdProp, clientName, onSave, onClose, task }) {
  const { erpClients } = useData()
  const teamMembers = getAllUsers().filter(u => TEAM_ROLES.includes(u.role))

  const isEdit = !!task

  const showSelector = !clientIdProp && erpClients.length > 0

  const [selectedClientId, setSelectedClientId] = useState(
    clientIdProp || task?.clientId || erpClients[0]?.id || ''
  )

  const [title,       setTitle]       = useState(task?.title       || '')
  const [type,        setType]        = useState(task?.type        || 'criativo')
  const [assignee,    setAssignee]    = useState(task?.assignee    || teamMembers[0]?.id || 'gs')
  const [dueDate,     setDueDate]     = useState(task?.dueDate     || '')
  const [priority,    setPriority]    = useState(task?.priority    || 'medium')
  const [level,       setLevel]       = useState(task?.level       || 'operacao')
  const [description, setDescription] = useState(task?.description || '')
  const [files,       setFiles]       = useState([])
  const [saving,      setSaving]      = useState(false)
  const [saved,       setSaved]       = useState(false)
  const [dragOver,    setDragOver]    = useState(false)
  const fileRef = useRef(null)

  useEffect(() => {
    if (!clientIdProp && !selectedClientId && erpClients.length > 0) {
      setSelectedClientId(task?.clientId || erpClients[0].id)
    }
  }, [erpClients, clientIdProp, selectedClientId, task])

  const clientId = selectedClientId
  const member   = teamMembers.find(m => m.id === assignee)

  const fixedClientName = clientName
    || (!showSelector ? erpClients.find(c => c.id === clientId)?.name : null)

  const canSave = !!title.trim() && !!clientId && !saving

  function addFiles(newFiles) {
    const arr = Array.from(newFiles).map(f => ({ name: f.name, size: f.size, type: f.type }))
    setFiles(prev => [...prev, ...arr])
  }
  function removeFile(idx) { setFiles(prev => prev.filter((_, i) => i !== idx)) }

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    const payload = {
      ...(isEdit && { id: task.id }),
      title:       title.trim(),
      type,
      clientId,
      assignee,
      dueDate:     dueDate || null,
      priority,
      level,
      description: description.trim(),
      status:      task?.status || 'todo',
      attachments: files,
    }
    await onSave(payload)
    setSaved(true)
    setTimeout(onClose, 800)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.48)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

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
          {/* Drag handle mobile */}
          <div className="flex justify-center pt-3 pb-0 md:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#d1d5e8' }} />
          </div>

          {/* HEADER */}
          <div className="flex-shrink-0">
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div>
                <p className="text-sm font-extrabold" style={{ color: '#1a1d2e' }}>
                  {isEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
                </p>
                {fixedClientName && (
                  <p className="text-[10px] mt-0.5" style={{ color: '#8890b5' }}>{fixedClientName}</p>
                )}
              </div>
              <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-xl" style={{ color: '#8890b5' }}>
                <X size={16} />
              </button>
            </div>

            {showSelector && (
              <div className="px-5 pb-3">
                <p className="text-[10px] font-bold mb-2" style={{ color: '#4b5068' }}>CLIENTE *</p>
                <div className="relative">
                  {clientId && erpClients.find(c => c.id === clientId) && (
                    <div
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm pointer-events-none z-10"
                      style={{ backgroundColor: erpClients.find(c => c.id === clientId)?.color || '#6d6afa' }}
                    />
                  )}
                  <select
                    value={clientId}
                    onChange={e => setSelectedClientId(e.target.value)}
                    className="w-full rounded-xl py-2.5 pr-3 text-sm border outline-none font-semibold appearance-none"
                    style={{
                      background:   '#f8f9fc',
                      borderColor:  clientId ? (erpClients.find(c => c.id === clientId)?.color || '#e0e3f0') : '#e0e3f0',
                      borderWidth:  1.5,
                      color:        '#1a1d2e',
                      paddingLeft:  clientId ? '2.25rem' : '0.875rem',
                    }}
                  >
                    <option value="" disabled>Selecione o cliente...</option>
                    {erpClients.map(cl => (
                      <option key={cl.id} value={cl.id}>{cl.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="mx-5 border-b" style={{ borderColor: '#e0e3f0' }} />
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">

            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>Titulo *</label>
              <input
                autoFocus
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canSave && handleSave()}
                placeholder="Ex: Criar criativos para campanha de maio"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none"
                style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }}
              />
            </div>

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

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                  <Calendar size={11} /> Data limite
                </label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                  style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }} />
              </div>
            </div>

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

            {!isEdit && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                  <Paperclip size={11} /> Anexos (opcional)
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files) }}
                  className="flex flex-col items-center gap-1.5 rounded-xl border-2 border-dashed py-4 cursor-pointer transition-all"
                  style={{
                    borderColor:     dragOver ? '#6d6afa' : '#d1d5e8',
                    backgroundColor: dragOver ? '#6d6afa08' : '#f8f9fc',
                  }}
                >
                  <Upload size={15} style={{ color: dragOver ? '#6d6afa' : '#8890b5' }} />
                  <p className="text-xs font-bold" style={{ color: dragOver ? '#6d6afa' : '#8890b5' }}>
                    Clique ou arraste arquivos
                  </p>
                  <p className="text-[10px]" style={{ color: '#b0b5cc' }}>PDF, imagens, docs</p>
                </div>
                <input ref={fileRef} type="file" multiple className="hidden"
                  onChange={e => addFiles(e.target.files)} />
                {files.length > 0 && (
                  <div className="mt-2 flex flex-col gap-1.5">
                    {files.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                        style={{ background: '#f8f9fc', borderColor: '#e0e3f0' }}>
                        <Paperclip size={11} style={{ color: '#8890b5', flexShrink: 0 }} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold truncate" style={{ color: '#1a1d2e' }}>{f.name}</p>
                          <p className="text-[10px]" style={{ color: '#8890b5' }}>{formatBytes(f.size)}</p>
                        </div>
                        <button onClick={() => removeFile(i)}
                          className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0"
                          style={{ color: '#b0b5cc' }}>
                          <X size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="h-2" />
          </div>

          {/* FOOTER */}
          <div className="flex-shrink-0 px-5 py-4 border-t flex gap-3" style={{ borderColor: '#e0e3f0' }}>
            <button onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold border"
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
              {saved
                ? <><Check size={14} /> {isEdit ? 'Salvo!' : 'Criada!'}</>
                : saving
                  ? 'Salvando...'
                  : isEdit ? 'Salvar alteracoes' : 'Criar tarefa'}
            </motion.button>
          </div>
        </motion.div>
      </div>
    </>
  )
}
