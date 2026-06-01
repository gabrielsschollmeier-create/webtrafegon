import { useState, useEffect, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Flag, Calendar, User, Tag, FileText, Link, Building2, Trash2, AlertTriangle, ExternalLink, Send, MessageSquare } from 'lucide-react'
import { taskTypes, TASK_FLAGS } from '../data/erp-mock'
import { TASK_LEVELS } from '../data/tasks-store'
import { getAllUsers, TEAM_ROLES } from '../data/users-store'
import { useData } from '../contexts/DataContext'

function timeAgoShort(ts) {
  const diff = Math.floor((Date.now() - new Date(ts).getTime()) / 1000)
  if (diff < 60)  return 'agora'
  if (diff < 3600) return `${Math.floor(diff/60)}min`
  if (diff < 86400) return `${Math.floor(diff/3600)}h`
  return `${Math.floor(diff/86400)}d`
}

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

export default function TarefaModal({ clientId: clientIdProp, clientName, onSave, onClose, onDelete, task, initialStatus = 'todo' }) {
  const { erpClients, updateTask } = useData()
  const teamMembers = getAllUsers().filter(u => TEAM_ROLES.includes(u.role))

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}') } catch { return {} }
  }, [])

  const isEdit     = !!task
  const showSelector = !clientIdProp

  const [selectedClientId, setSelectedClientId] = useState(
    clientIdProp || task?.clientId || erpClients[0]?.id || ''
  )
  const [title,       setTitle]       = useState(task?.title       || '')
  const [type,        setType]        = useState(task?.type        || 'criativo')
  const [assignee,    setAssignee]    = useState(task?.assignee    || teamMembers[0]?.id || 'gs')
  const [dueDate,     setDueDate]     = useState(task?.dueDate     || '')
  const [priority,    setPriority]    = useState(task?.priority    || 'medium')
  const [level,       setLevel]       = useState(task?.level || 'operacao')
  const [flag,        setFlag]        = useState(task?.flag  || null)

  // Comentários — timeline
  const initComments = useMemo(() => {
    if (!task?.comments) return []
    if (Array.isArray(task.comments)) return task.comments
    try { return JSON.parse(task.comments) } catch { return [] }
  }, [task])
  const [commentList,  setCommentList]  = useState(initComments)
  const [newComment,   setNewComment]   = useState('')
  const [publishing,   setPublishing]   = useState(false)
  const commentsEndRef = useRef(null)

  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [confirmDel,   setConfirmDel]   = useState(false)
  const [deleting,     setDeleting]     = useState(false)

  useEffect(() => {
    if (!clientIdProp && !selectedClientId && erpClients.length > 0) {
      setSelectedClientId(task?.clientId || erpClients[0].id)
    }
  }, [erpClients, clientIdProp, selectedClientId, task])

  const clientId  = selectedClientId
  const member    = teamMembers.find(m => m.id === assignee)
  const selClient = erpClients.find(c => c.id === clientId)

  const fixedClientName = clientName
    || (!showSelector && clientId ? selClient?.name : null)

  const canSave = !!title.trim() && (!!clientId || !!clientIdProp) && !saving

  async function handleSave() {
    if (!canSave) return
    setSaving(true)
    try {
      const payload = {
        ...(isEdit && { id: task.id }),
        title:    title.trim(),
        type,
        clientId: clientIdProp || clientId,
        assignee,
        dueDate:  dueDate || null,
        priority,
        level,
        flag:     flag || null,
        status:   task?.status || initialStatus || 'todo',
        comments: commentList.length ? commentList : undefined,
      }
      await onSave(payload)
      setSaved(true)
      setTimeout(onClose, 800)
    } catch (err) {
      console.error('[modal] erro ao salvar:', err)
      setSaving(false)
    }
  }

  async function handlePublishComment() {
    if (!newComment.trim() || !task?.id) return
    setPublishing(true)
    const comment = {
      id:       Date.now().toString(),
      author:   currentUser?.name || currentUser?.email || 'Usuário',
      authorId: currentUser?.id   || 'unknown',
      color:    currentUser?.color || '#8890b5',
      text:     newComment.trim(),
      ts:       new Date().toISOString(),
    }
    const updated = [...commentList, comment]
    setCommentList(updated)
    setNewComment('')
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    try { await updateTask(task.id, { comments: updated }) } catch {}
    setPublishing(false)
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50"
        style={{ backgroundColor: 'rgba(0,0,0,0.52)', backdropFilter: 'blur(6px)' }}
        onClick={onClose}
      />

      {/* Posicionamento */}
      <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={e => e.stopPropagation()}
          className="pointer-events-auto w-full md:w-[580px] bg-white rounded-t-3xl md:rounded-3xl flex flex-col"
          style={{
            maxHeight: '94dvh',
            boxShadow: '0 0 0 1px rgba(26,29,46,0.08), 0 20px 60px rgba(26,29,46,0.26), 0 8px 24px rgba(26,29,46,0.14)',
          }}
        >
          {/* Drag handle mobile */}
          <div className="flex justify-center pt-3 md:hidden flex-shrink-0">
            <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#d1d5e8' }} />
          </div>

          {/* HEADER */}
          <div className="flex items-center justify-between px-5 pt-4 pb-3 flex-shrink-0"
            style={{ borderBottom: '1px solid #f0f2fb' }}>
            <div>
              <p className="text-sm font-extrabold" style={{ color: '#1a1d2e' }}>
                {isEdit ? 'Editar Tarefa' : 'Nova Tarefa'}
              </p>
              {fixedClientName && (
                <p className="text-[11px] mt-0.5 font-medium" style={{ color: '#8890b5' }}>{fixedClientName}</p>
              )}
            </div>
            <button onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
              style={{ color: '#8890b5' }}>
              <X size={16} />
            </button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4 space-y-4">

            {/* Seletor de Cliente — no topo do corpo, sempre visivel */}
            {showSelector && (
              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-2 uppercase tracking-wider"
                  style={{ color: '#4b5068' }}>
                  <Building2 size={11} /> Cliente *
                </label>

                {erpClients.length === 0 ? (
                  <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border"
                    style={{ background: '#f8f9fc', borderColor: '#e0e3f0' }}>
                    <div className="w-3 h-3 rounded-full animate-pulse" style={{ background: '#d1d5e8' }} />
                    <span className="text-sm text-muted">Carregando clientes...</span>
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      value={clientId}
                      onChange={e => setSelectedClientId(e.target.value)}
                      className="w-full rounded-xl py-3 text-sm border-2 outline-none font-semibold appearance-none"
                      style={{
                        paddingLeft:  clientId ? '2.5rem' : '1rem',
                        paddingRight: '1rem',
                        background:   '#f8f9fc',
                        borderColor:  clientId ? (selClient?.color || '#6d6afa') : '#e0e3f0',
                        color:        clientId ? '#1a1d2e' : '#8890b5',
                        cursor:       'pointer',
                      }}
                    >
                      <option value="">Selecione o cliente...</option>
                      {erpClients.map(cl => (
                        <option key={cl.id} value={cl.id}>{cl.name}</option>
                      ))}
                    </select>
                    {clientId && selClient && (
                      <div
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3 h-3 rounded-sm pointer-events-none"
                        style={{ backgroundColor: selClient.color }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Titulo */}
            <div>
              <label className="block text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>Titulo *</label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && canSave && handleSave()}
                placeholder="Ex: Criar criativos para campanha de maio"
                className="w-full rounded-xl px-3.5 py-2.5 text-sm border outline-none"
                style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }}
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

            {/* Visibilidade */}
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

            {/* Responsavel + Data */}
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

            {/* Flag de aprovação */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                <Flag size={11} /> Status de aprovação
              </label>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setFlag(null)}
                  className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all"
                  style={{
                    backgroundColor: !flag ? '#1a1d2e' : 'white',
                    color:           !flag ? 'white'    : '#8890b5',
                    borderColor:     !flag ? '#1a1d2e'  : '#e0e3f0',
                  }}>
                  Nenhum
                </button>
                {Object.entries(TASK_FLAGS).map(([key, cfg]) => (
                  <button key={key} onClick={() => setFlag(flag === key ? null : key)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl border transition-all"
                    style={{
                      backgroundColor: flag === key ? cfg.color : 'white',
                      color:           flag === key ? 'white'   : cfg.color,
                      borderColor:     flag === key ? cfg.color : cfg.color + '50',
                    }}>
                    {cfg.dot} {cfg.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Comentários — timeline */}
            <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#4b5068' }}>
                  <MessageSquare size={11} /> Comentários
                  {commentList.length > 0 && (
                    <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: '#60a5fa20', color: '#60a5fa' }}>
                      {commentList.length}
                    </span>
                  )}
                </label>

                {/* Lista de comentários */}
                {commentList.length > 0 && (
                  <div className="mb-3 space-y-2 max-h-48 overflow-y-auto pr-1"
                    style={{ scrollbarWidth: 'thin' }}>
                    {commentList.map(c => (
                      <div key={c.id} className="flex gap-2.5">
                        <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-white mt-0.5"
                          style={{ backgroundColor: c.color || '#8890b5' }}>
                          {(c.author || 'U')[0].toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-[11px] font-bold" style={{ color: '#1a1d2e' }}>{c.author}</span>
                            <span className="text-[10px]" style={{ color: '#b0b5cc' }}>{timeAgoShort(c.ts)}</span>
                          </div>
                          <p className="text-xs mt-0.5 leading-relaxed" style={{ color: '#4b5068' }}>{c.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={commentsEndRef} />
                  </div>
                )}

                {/* Input novo comentário */}
                <div className="flex gap-2 items-end">
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-extrabold text-white"
                    style={{ backgroundColor: currentUser?.color || '#6eda2c' }}>
                    {(currentUser?.name || currentUser?.email || 'U')[0].toUpperCase()}
                  </div>
                  <div className="flex-1 relative">
                    <textarea
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePublishComment() }
                      }}
                      placeholder="Escreva um comentário... (Enter para publicar)"
                      rows={2}
                      className="w-full rounded-xl px-3 py-2 text-xs border resize-none outline-none pr-8"
                      style={{ background: '#f8f9fc', borderColor: newComment ? '#60a5fa60' : '#e0e3f0', color: '#1a1d2e' }}
                    />
                    <button
                      onClick={handlePublishComment}
                      disabled={!newComment.trim() || publishing}
                      className="absolute right-2 bottom-2 transition-all"
                      style={{ color: newComment.trim() ? '#60a5fa' : '#d1d5e8' }}>
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </div>

            <div className="h-2" />
          </div>

          {/* FOOTER */}
          <div className="flex-shrink-0 px-5 py-4 border-t flex gap-3" style={{ borderColor: '#e0e3f0' }}>
            {/* Botao excluir — so aparece em edicao */}
            {isEdit && onDelete && !confirmDel && (
              <motion.button
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={() => setConfirmDel(true)}
                className="p-2.5 rounded-xl border transition-colors flex items-center gap-1.5"
                style={{ color: '#ef4444', borderColor: '#ef444430', background: '#ef444408' }}
                title="Excluir tarefa">
                <Trash2 size={14} />
              </motion.button>
            )}

            {/* Confirmacao de exclusao */}
            <AnimatePresence>
              {confirmDel && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
                  style={{ borderColor: '#ef444440', background: '#ef444408' }}>
                  <AlertTriangle size={13} style={{ color: '#ef4444', flexShrink: 0 }} />
                  <span className="text-xs font-bold flex-1" style={{ color: '#ef4444' }}>Excluir tarefa?</span>
                  <button onClick={async () => { setDeleting(true); await onDelete(task.id); setDeleting(false); onClose() }}
                    disabled={deleting}
                    className="text-xs font-extrabold px-3 py-1 rounded-lg"
                    style={{ background: '#ef4444', color: 'white' }}>
                    {deleting ? '...' : 'Sim'}
                  </button>
                  <button onClick={() => setConfirmDel(false)}
                    className="text-xs font-bold px-3 py-1 rounded-lg"
                    style={{ background: '#f0f2fb', color: '#8890b5' }}>
                    Nao
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {!confirmDel && (
              <>
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
                  {saved
                    ? <><Check size={14} /> {isEdit ? 'Salvo!' : 'Criada!'}</>
                    : saving
                      ? 'Salvando...'
                      : isEdit ? 'Salvar alteracoes' : 'Criar tarefa'}
                </motion.button>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </>
  )
}
