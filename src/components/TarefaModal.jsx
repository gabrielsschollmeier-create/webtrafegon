import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, Flag, Calendar, User, Tag, FileText, Link, Building2, Trash2, AlertTriangle, ExternalLink, Send, MessageSquare, Plus, Copy, RefreshCw, ChevronDown, ChevronUp, History, Image, ZoomIn } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { taskTypes, TASK_FLAGS } from '../data/erp-mock'
import UserAvatar from './UserAvatar'
import { TASK_LEVELS } from '../data/tasks-store'
import { getAllUsers, TEAM_ROLES } from '../data/users-store'
import { useData } from '../contexts/DataContext'

function renderWithLinks(text) {
  const urlPattern = /https?:\/\/[^\s]+/g
  const parts = []
  let lastIndex = 0
  let match
  while ((match = urlPattern.exec(text)) !== null) {
    if (match.index > lastIndex) parts.push(text.slice(lastIndex, match.index))
    parts.push(
      <a key={match.index} href={match[0]} target="_blank" rel="noopener noreferrer"
        style={{ color: '#60a5fa', textDecoration: 'underline', wordBreak: 'break-all' }}>
        {match[0]}
      </a>
    )
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < text.length) parts.push(text.slice(lastIndex))
  return parts.length ? parts : text
}

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

const TYPE_GROUPS = [
  {
    label: 'Rotina', dot: '#8890b5',
    keys: ['atendimento'],
  },
  {
    label: 'Execução', dot: '#60a5fa',
    keys: ['copy', 'criativo', 'social_media', 'relatorio', 'reuniao'],
  },
  {
    label: 'Estratégico', dot: '#f59e0b',
    keys: ['campanha', 'video', 'lp', 'onboarding'],
  },
]

const FLAG_OPTIONS = [
  { key: null,              dot: '⚪', label: 'Nenhum',              color: '#8890b5' },
  { key: 'pending_internal',dot: '🔵', label: 'Aguarda revisão interna', color: '#60a5fa' },
  { key: 'pending_client',  dot: '🟡', label: 'Aguarda cliente',     color: '#f59e0b' },
  { key: 'revision',        dot: '🔴', label: 'Alteração solicitada', color: '#ef4444' },
  { key: 'approved_ad',     dot: '🟢', label: 'Aprovado p/ anúncio', color: '#6eda2c' },
]

function FlagSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = FLAG_OPTIONS.find(f => f.key === value) || FLAG_OPTIONS[0]

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
        <Flag size={11} /> Status de aprovação
      </label>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all"
        style={{
          background:   value ? current.color + '10' : '#f8f9fc',
          borderColor:  value ? current.color + '50' : '#e0e3f0',
        }}
      >
        <span className="text-base leading-none">{current.dot}</span>
        <span className="flex-1 font-semibold text-sm" style={{ color: value ? current.color : '#8890b5' }}>
          {current.label}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill={value ? current.color : '#8890b5'}
          style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M0 0l5 6 5-6z"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl overflow-hidden p-1.5"
            style={{ boxShadow: '0 8px 32px rgba(26,29,46,0.14), 0 0 0 1px rgba(26,29,46,0.06)' }}
          >
            {FLAG_OPTIONS.map(opt => (
              <button
                key={String(opt.key)}
                type="button"
                onClick={() => { onChange(opt.key); setOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all"
                style={{ backgroundColor: value === opt.key ? opt.color + '12' : 'transparent' }}
              >
                <span className="text-base leading-none">{opt.dot}</span>
                <span className="flex-1 text-xs font-semibold" style={{ color: value === opt.key ? opt.color : '#4b5068' }}>
                  {opt.label}
                </span>
                {value === opt.key && <Check size={12} style={{ color: opt.color, flexShrink: 0 }} />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CoAssigneePicker({ members, selected, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const selectedMembers = members.filter(m => selected.includes(m.id))

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  function toggle(id) {
    onChange(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  return (
    <div ref={ref} className="relative">
      <label className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#4b5068' }}>
        <User size={11} /> Também nessa tarefa
      </label>

      <div className="flex items-center gap-2">
        {/* Avatares selecionados */}
        <div className="flex items-center -space-x-1.5">
          {selectedMembers.slice(0, 4).map(m => (
            <div key={m.id} className="relative group">
              <div className="rounded-full ring-2 ring-white" title={m.name}>
                <UserAvatar user={m} size={28} />
              </div>
              <button
                onClick={() => toggle(m.id)}
                className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-white hidden group-hover:flex items-center justify-center shadow-sm"
                style={{ border: '1px solid #e0e3f0' }}
              >
                <X size={8} style={{ color: '#8890b5' }} />
              </button>
            </div>
          ))}
          {selectedMembers.length > 4 && (
            <div className="w-7 h-7 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-[10px] font-bold" style={{ color: '#8890b5' }}>
              +{selectedMembers.length - 4}
            </div>
          )}
        </div>

        {/* Botão para abrir */}
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all"
          style={{
            background: open ? '#f8f9fc' : 'white',
            borderColor: open ? '#6eda2c50' : '#e0e3f0',
            color: '#8890b5',
          }}
        >
          <span style={{ fontSize: 14 }}>+</span>
          {selectedMembers.length === 0 ? 'Adicionar' : 'Editar'}
        </button>

        {selectedMembers.length > 0 && (
          <span className="text-[10px]" style={{ color: '#8890b5' }}>
            {selectedMembers.length} pessoa{selectedMembers.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full mt-1.5 z-30 bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(26,29,46,0.14), 0 0 0 1px rgba(26,29,46,0.06)', minWidth: 200 }}
          >
            <div className="p-1.5">
              {members.map(m => {
                const isSelected = selected.includes(m.id)
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => toggle(m.id)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left transition-all"
                    style={{ backgroundColor: isSelected ? (m.color || '#6eda2c') + '12' : 'transparent' }}
                  >
                    <UserAvatar user={m} size={24} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate" style={{ color: isSelected ? (m.color || '#6eda2c') : '#1a1d2e' }}>
                        {m.name}
                      </p>
                      <p className="text-[10px]" style={{ color: '#8890b5' }}>{m.role}</p>
                    </div>
                    {isSelected && <Check size={12} style={{ color: m.color || '#6eda2c', flexShrink: 0 }} />}
                  </button>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TypeSelector({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  const current = taskTypes[value]

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border text-sm text-left transition-all"
        style={{
          background: current ? current.color + '10' : '#f8f9fc',
          borderColor: current ? current.color + '50' : '#e0e3f0',
        }}
      >
        <span className="text-base leading-none">{current?.icon || '📌'}</span>
        <span className="flex-1 font-semibold" style={{ color: current?.color || '#8890b5' }}>
          {current?.label || 'Selecionar tipo...'}
        </span>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
          style={{ background: current?.color + '20' || '#f0f2fb', color: current?.color || '#8890b5' }}>
          {current ? `${current.ons} on${current.ons > 1 ? 's' : ''}` : ''}
        </span>
        <svg width="10" height="6" viewBox="0 0 10 6" fill={current?.color || '#8890b5'}
          style={{ transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)', flexShrink: 0 }}>
          <path d="M0 0l5 6 5-6z"/>
        </svg>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 8px 32px rgba(26,29,46,0.14), 0 0 0 1px rgba(26,29,46,0.06)', maxHeight: 300, overflowY: 'auto' }}
          >
            {TYPE_GROUPS.map(group => (
              <div key={group.label}>
                <div className="flex items-center gap-1.5 px-3.5 pt-3 pb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: group.dot }} />
                  <span className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: group.dot }}>
                    {group.label}
                  </span>
                </div>
                <div className="px-2 pb-2 grid grid-cols-2 gap-1">
                  {group.keys.filter(k => taskTypes[k]).map(key => {
                    const t = taskTypes[key]
                    const selected = value === key
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => { onChange(key); setOpen(false) }}
                        className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left transition-all text-xs font-semibold"
                        style={{
                          backgroundColor: selected ? t.color + '18' : 'transparent',
                          color: selected ? t.color : '#4b5068',
                        }}
                      >
                        <span className="text-sm leading-none flex-shrink-0">{t.icon}</span>
                        <span className="truncate">{t.label}</span>
                        {selected && <Check size={10} style={{ color: t.color, flexShrink: 0, marginLeft: 'auto' }} />}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function formatBytes(b) {
  if (b < 1024) return b + ' B'
  if (b < 1048576) return (b / 1024).toFixed(1) + ' KB'
  return (b / 1048576).toFixed(1) + ' MB'
}

export default function TarefaModal({ clientId: clientIdProp, clientName, onSave, onClose, onDelete, task, initialStatus = 'todo' }) {
  const { erpClients, updateTask, addTask } = useData()
  const teamMembers = getAllUsers().filter(u => TEAM_ROLES.includes(u.role))

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}') } catch { return {} }
  }, [])

  const isEdit     = !!task
  const showSelector = !clientIdProp

  // Responsável padrão por tipo de tarefa
  const TYPE_DEFAULT_ASSIGNEE = {
    gestao_diaria:   'tochiro',
    criar_campanha:  'tochiro',
    campanha:        'tochiro',
    rastreamento:    'tochiro',
    setup_conta:     'tochiro',
    atualizar_gmn:   'tochiro',
    planilha_ind:    'tochiro',
    enviar_dash:     'tochiro',
    criar_artes:     null,
    criativo:        null,
    edicao_video:    null,
    roteiro:         null,
    calendario_post: null,
    org_perfil:      null,
    captacao_video:  null,
    lp:              'deivisson',
    pipeline_crm:    'gs',
    reuniao:         'gs',
    analise_conv:    'gs',
    pesquisa_merc:   'gs',
    whats_grupos:    'gs',
    treinamento:     'gs',
  }

  const [selectedClientId, setSelectedClientId] = useState(
    clientIdProp || task?.clientId || erpClients[0]?.id || ''
  )
  const [title,       setTitle]       = useState(task?.title       || '')
  const [type,        setType]        = useState(task?.type        || 'criativo')
  const [assignee,    setAssignee]    = useState(task?.assignee    || TYPE_DEFAULT_ASSIGNEE['criativo'] || teamMembers[0]?.id || 'gs')
  const [coResponsaveis, setCoResponsaveis] = useState(() => {
    if (!task?.coResponsaveis) return []
    if (Array.isArray(task.coResponsaveis)) return task.coResponsaveis
    try { return JSON.parse(task.coResponsaveis) } catch { return [] }
  })
  const [dueDate,     setDueDate]     = useState(task?.dueDate     || '')
  const [startDate,   setStartDate]   = useState(task?.startDate   || '')
  const [priority,    setPriority]    = useState(task?.priority    || 'medium')
  const [level,       setLevel]       = useState(task?.level || 'operacao')
  const [flag,        setFlag]        = useState(task?.flag  || null)

  // Auto-sugestão: ao mudar o tipo em tarefas NOVAS, preenche o responsável padrão
  useEffect(() => {
    if (isEdit) return
    const suggested = TYPE_DEFAULT_ASSIGNEE[type]
    if (suggested) setAssignee(suggested)
  }, [type]) // eslint-disable-line react-hooks/exhaustive-deps

  // Comentários — timeline
  const initComments = useMemo(() => {
    if (!task?.comments) return []
    if (Array.isArray(task.comments)) return task.comments
    try { return JSON.parse(task.comments) } catch { return [] }
  }, [task])
  const [commentList,   setCommentList]  = useState(initComments)
  const [newComment,    setNewComment]   = useState('')
  const [publishing,    setPublishing]   = useState(false)
  const [pendingImage,  setPendingImage] = useState(null)
  const [lightboxUrl,   setLightboxUrl]  = useState(null)
  const commentsEndRef  = useRef(null)

  useEffect(() => {
    return () => { if (pendingImage?.preview) URL.revokeObjectURL(pendingImage.preview) }
  }, [pendingImage])
  const imageInputRef   = useRef(null)
  const [steps,        setSteps]        = useState(() => task?.steps || [])
  const [newStep,      setNewStep]      = useState('')
  const [status,       setStatus]       = useState(task?.status || initialStatus || 'todo')
  const [recurring,    setRecurring]    = useState(() => task?.recurring || null)
  const [checklist,    setChecklist]    = useState(() => task?.checklist || [])
  const [showHistory,  setShowHistory]  = useState(false)

  const dateRef  = useRef(null)
  const startRef = useRef(null)

  const [saving,       setSaving]       = useState(false)
  const [saved,        setSaved]        = useState(false)
  const [confirmDel,   setConfirmDel]   = useState(false)
  const [deleting,     setDeleting]     = useState(false)
  const [delErr,       setDelErr]       = useState('')

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
      const cId = clientIdProp || clientId
      if (isEdit && task?.id) {
        // Monta comments mesclando: user comments + checklist + etapas atuais + meta
        const userAndHistory    = commentList.filter(c => !c._type || c._type === 'history')
        const checklistEntries  = checklist.map(c => ({ _type: 'checklist_item', item: c }))
        const stepEntries       = steps.map(s => ({ _type: 'step', step: s }))
        const existingMeta      = commentList.find(c => c._type === 'meta')
        const mergedMeta        = { ...(existingMeta || {}), _type: 'meta', recurring: recurring || null }
        const mergedComments    = [...userAndHistory, ...checklistEntries, ...stepEntries, mergedMeta]
        await updateTask(task.id, {
          title:    title.trim(),
          type,
          clientId: cId,
          assignee,
          coResponsaveis: coResponsaveis.length ? coResponsaveis : null,
          dueDate:   dueDate   || null,
          startDate: startDate || null,
          priority,
          level,
          flag:     flag || null,
          status,
          comments: mergedComments,
        })
      } else {
        // Nova tarefa: passa pelo onSave (trata milestone etc.)
        await onSave({
          title:    title.trim(),
          type,
          clientId: cId,
          assignee,
          coResponsaveis: coResponsaveis.length ? coResponsaveis : null,
          dueDate:   dueDate   || null,
          startDate: startDate || null,
          priority,
          level,
          flag:     flag || null,
          status:   initialStatus || 'todo',
          steps,
          recurring: recurring || null,
          // Comentários digitados antes de salvar pela 1ª vez entram junto na criação.
          comments: commentList.filter(c => !c._type || c._type === 'history'),
        })
      }
      setSaved(true)
      setTimeout(onClose, 800)
    } catch (err) {
      console.error('[modal] erro ao salvar:', err)
      setSaving(false)
    }
  }

  function handleImagePick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const preview = URL.createObjectURL(file)
    setPendingImage({ file, preview })
    e.target.value = ''
  }

  async function uploadImage(file) {
    if (!supabase) return null
    try { await supabase.storage.createBucket('task-images', { public: true }) } catch {}
    try { await supabase.storage.updateBucket('task-images', { public: true }) } catch {}
    const ext  = file.name.split('.').pop() || 'png'
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
    const { error } = await supabase.storage.from('task-images').upload(path, file, { contentType: file.type })
    if (error) { console.error('[upload]', error); return null }
    const { data } = supabase.storage.from('task-images').getPublicUrl(path)
    return data.publicUrl
  }

  async function toggleChecklistItem(itemId) {
    const updated = checklist.map(c => c.id === itemId ? { ...c, done: !c.done } : c)
    setChecklist(updated)
    if (task?.id) {
      const userAndHistory   = commentList.filter(c => !c._type || c._type === 'history')
      const checklistEntries = updated.map(c => ({ _type: 'checklist_item', item: c }))
      const stepEntries      = steps.map(s => ({ _type: 'step', step: s }))
      const existingMeta     = commentList.find(c => c._type === 'meta')
      try { await updateTask(task.id, { comments: [...userAndHistory, ...checklistEntries, ...stepEntries, ...(existingMeta ? [existingMeta] : [])] }) } catch {}
    }
  }

  async function handlePublishComment() {
    if (!newComment.trim() && !pendingImage) return
    setPublishing(true)
    let imageUrl = null
    if (pendingImage) {
      imageUrl = await uploadImage(pendingImage.file)
      URL.revokeObjectURL(pendingImage.preview)
      setPendingImage(null)
    }
    const comment = {
      id:       Date.now().toString(),
      author:   currentUser?.name || currentUser?.email || 'Usuário',
      authorId: currentUser?.id   || 'unknown',
      color:    currentUser?.color || '#8890b5',
      text:     newComment.trim(),
      ts:       new Date().toISOString(),
      ...(imageUrl ? { image: imageUrl } : {}),
    }
    const updated = [...commentList, comment]
    setCommentList(updated)
    setNewComment('')
    setTimeout(() => commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
    // Tarefa existente: grava já. Tarefa nova (sem id): o comentário fica no estado
    // e é salvo junto na criação (handleSave inclui os comentários no payload).
    if (task?.id) { try { await updateTask(task.id, { comments: updated }) } catch {} }
    setPublishing(false)
  }

  return (
    <>
      {/* Lightbox de imagem */}
      <AnimatePresence>
        {lightboxUrl && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)' }}
            onClick={() => setLightboxUrl(null)}>
            <motion.img src={lightboxUrl} alt="print"
              initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
              className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain"
              onClick={e => e.stopPropagation()} />
            <button onClick={() => setLightboxUrl(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}>
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

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

            {/* Mensagem padrão (do playbook) */}
            {task?.description && (
              <div className="rounded-xl p-3.5" style={{ background: '#f59e0b0a', border: '1px solid #f59e0b30' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#f59e0b' }}>📋 Mensagem padrão</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(task.description)}
                    className="flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg transition-colors hover:opacity-80"
                    style={{ background: '#f59e0b20', color: '#f59e0b' }}>
                    <Copy size={10} /> Copiar
                  </button>
                </div>
                <p className="text-xs leading-relaxed whitespace-pre-wrap" style={{ color: '#5a4018' }}>{task.description}</p>
              </div>
            )}

            {/* Passo a passo (checklist do playbook) */}
            {checklist.length > 0 && (
              <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #6eda2c30', background: '#6eda2c05' }}>
                <div className="flex items-center justify-between px-3.5 py-2.5" style={{ borderBottom: '1px solid #6eda2c18' }}>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#6eda2c' }}>
                    ✅ Passo a passo
                  </span>
                  <span className="text-[10px] font-bold" style={{ color: '#6eda2c' }}>
                    {checklist.filter(c => c.done).length}/{checklist.length}
                  </span>
                </div>
                <div className="flex flex-col divide-y" style={{ divideColor: '#6eda2c10' }}>
                  {checklist.map((item, idx) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => toggleChecklistItem(item.id)}
                      className="flex items-start gap-2.5 px-3.5 py-2 text-left transition-colors hover:bg-black/[0.02]"
                    >
                      <div className="mt-0.5 w-4 h-4 rounded flex items-center justify-center flex-shrink-0 transition-all"
                        style={{ background: item.done ? '#6eda2c' : 'transparent', border: `1.5px solid ${item.done ? '#6eda2c' : '#c8ccdc'}` }}>
                        {item.done && <Check size={9} color="white" strokeWidth={3} />}
                      </div>
                      <span className="text-[11px] leading-snug flex-1 font-medium"
                        style={{ color: item.done ? '#8890b5' : '#1a1d2e', textDecoration: item.done ? 'line-through' : 'none' }}>
                        <span className="text-[9px] font-bold mr-1" style={{ color: '#b0b5cc' }}>{idx + 1}.</span>
                        {item.title || item.text}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tipo */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                <Tag size={11} /> Tipo de entregável
              </label>
              <TypeSelector value={type} onChange={setType} />
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
                  <User size={11} /> Responsável principal
                </label>
                <select value={assignee} onChange={e => setAssignee(e.target.value)}
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none"
                  style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }}>
                  {teamMembers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
                {member && (
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <UserAvatar user={member} size={16} />
                    <span className="text-[10px]" style={{ color: '#8890b5' }}>{member.role || 'Colaborador'}</span>
                  </div>
                )}
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                  <Calendar size={11} /> Início
                </label>
                <div
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none cursor-pointer"
                  style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e', position: 'relative' }}
                  onClick={() => startRef.current?.showPicker?.()}
                >
                  <input
                    ref={startRef}
                    type="date"
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full bg-transparent outline-none cursor-pointer"
                    style={{ color: startDate ? '#1a1d2e' : '#8890b5' }}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 text-xs font-bold mb-1.5" style={{ color: '#4b5068' }}>
                  <Calendar size={11} /> Entrega
                </label>
                <div
                  className="w-full rounded-xl px-3 py-2.5 text-sm border outline-none cursor-pointer"
                  style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e', position: 'relative' }}
                  onClick={() => dateRef.current?.showPicker?.()}
                >
                  <input
                    ref={dateRef}
                    type="date"
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full bg-transparent outline-none cursor-pointer"
                    style={{ color: dueDate ? '#1a1d2e' : '#8890b5' }}
                  />
                </div>
              </div>
            </div>

            {/* Co-responsáveis */}
            <CoAssigneePicker
              members={teamMembers.filter(m => m.id !== assignee)}
              selected={coResponsaveis}
              onChange={setCoResponsaveis}
            />

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
            <FlagSelector value={flag} onChange={setFlag} />

            {/* Comentários — timeline */}
            <div>
                {(() => {
                  const userComments = commentList.filter(c => !c._type)
                  return (<>
                  <label className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#4b5068' }}>
                    <MessageSquare size={11} /> Comentários
                    {userComments.length > 0 && (
                      <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ background: '#60a5fa20', color: '#60a5fa' }}>
                        {userComments.length}
                      </span>
                    )}
                  </label>

                  {/* Lista de comentários (apenas entradas de usuário) */}
                  {userComments.length > 0 && (
                    <div className="mb-3 space-y-2 max-h-48 overflow-y-auto pr-1"
                      style={{ scrollbarWidth: 'thin' }}>
                      {userComments.map(c => (
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
                            {c.text && <p className="text-xs mt-0.5 leading-relaxed break-words" style={{ color: '#4b5068' }}>{renderWithLinks(c.text)}</p>}
                            {c.image && (
                              <button onClick={() => setLightboxUrl(c.image)} className="mt-1.5 block group relative">
                                <img src={c.image} alt="print" className="max-w-[200px] rounded-lg border object-cover"
                                  style={{ borderColor: '#e0e3f0', maxHeight: 120 }} />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 rounded-lg flex items-center justify-center transition-all">
                                  <ZoomIn size={16} className="text-white opacity-0 group-hover:opacity-100 drop-shadow" />
                                </div>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                      <div ref={commentsEndRef} />
                    </div>
                  )}
                  </>)
                })()}

                {/* Preview da imagem pendente */}
                {pendingImage && (
                  <div className="mb-2 ml-8 flex items-start gap-2">
                    <div className="relative">
                      <img src={pendingImage.preview} alt="preview" className="h-16 rounded-lg border object-cover"
                        style={{ borderColor: '#60a5fa40', maxWidth: 120 }} />
                      <button onClick={() => setPendingImage(null)}
                        className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                        style={{ background: '#ef4444', color: '#fff' }}>
                        <X size={9} />
                      </button>
                    </div>
                    <p className="text-[9px] text-muted mt-1">Imagem pronta para enviar</p>
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
                      onPaste={e => {
                        const file = Array.from(e.clipboardData.items || [])
                          .find(i => i.kind === 'file' && i.type.startsWith('image/'))
                          ?.getAsFile()
                        if (!file) return
                        e.preventDefault()
                        const preview = URL.createObjectURL(file)
                        setPendingImage({ file, preview })
                      }}
                      placeholder="Escreva um comentário, cole um print (Ctrl+V) ou use 📎..."
                      rows={2}
                      className="w-full rounded-xl px-3 py-2 text-xs border resize-none outline-none pr-16"
                      style={{ background: '#f8f9fc', borderColor: (newComment || pendingImage) ? '#60a5fa60' : '#e0e3f0', color: '#1a1d2e' }}
                    />
                    <div className="absolute right-2 bottom-2 flex items-center gap-1.5">
                      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleImagePick} />
                      <button onClick={() => imageInputRef.current?.click()}
                        className="transition-all"
                        style={{ color: pendingImage ? '#6eda2c' : '#b0b5cc' }}
                        title="Anexar imagem / print">
                        <Image size={14} />
                      </button>
                      <button
                        onClick={handlePublishComment}
                        disabled={(!newComment.trim() && !pendingImage) || publishing}
                        className="transition-all"
                        style={{ color: (newComment.trim() || pendingImage) ? '#60a5fa' : '#d1d5e8' }}>
                        <Send size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            {/* Meta info (criador + data de criação) */}
            {isEdit && (task?.createdBy || task?.createdAt) && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background: '#f8f9fc' }}>
                <User size={10} style={{ color: '#b0b5cc', flexShrink: 0 }} />
                <span className="text-[10px]" style={{ color: '#b0b5cc' }}>
                  Criado {task.createdBy ? `por ${task.createdBy}` : ''}{task.createdAt ? ` em ${new Date(task.createdAt).toLocaleDateString('pt-BR')}` : ''}
                </span>
              </div>
            )}

            {/* Etapas — colunas do kanban */}
            {(() => {
              const KANBAN_STEPS = [
                { key: 'todo',     label: 'A Fazer',              color: '#60a5fa', emoji: '📋' },
                { key: 'doing',    label: 'Em Andamento',         color: '#f59e0b', emoji: '🔄' },
                { key: 'review',   label: 'Em Revisão',           color: '#be29ec', emoji: '👁️' },
                { key: 'aprovado', label: 'Aprovado p/ anúncio',  color: '#ea8a29', emoji: '🚀' },
                { key: 'done',     label: 'Concluído',            color: '#6eda2c', emoji: '✅' },
              ]
              return (
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#4b5068' }}>
                    <Check size={11} /> Fase atual do kanban
                  </label>
                  <div className="flex flex-col gap-1.5">
                    {KANBAN_STEPS.map(col => {
                      const isActive = status === col.key
                      return (
                        <button
                          key={col.key}
                          type="button"
                          onClick={() => setStatus(col.key)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl border text-left transition-all"
                          style={{
                            background:  isActive ? col.color + '18' : '#f8f9fc',
                            borderColor: isActive ? col.color + '70' : '#e0e3f0',
                          }}
                        >
                          <div className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all"
                            style={{ background: isActive ? col.color : '#e0e3f0' }}>
                            {isActive
                              ? <Check size={11} color="white" />
                              : <span className="text-[10px]">{col.emoji}</span>
                            }
                          </div>
                          <span className="flex-1 text-xs font-semibold" style={{ color: isActive ? col.color : '#4b5068' }}>
                            {col.label}
                          </span>
                          {isActive && (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: col.color + '20', color: col.color }}>atual</span>
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Recorrência */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-bold mb-2" style={{ color: '#4b5068' }}>
                <RefreshCw size={11} /> Tarefa recorrente
              </label>
              <div className="flex items-center gap-2 mb-2">
                <button
                  onClick={() => setRecurring(recurring ? null : { type: 'weekly', interval: 1 })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all"
                  style={{
                    background: recurring ? '#60a5fa15' : 'white',
                    borderColor: recurring ? '#60a5fa50' : '#e0e3f0',
                    color: recurring ? '#60a5fa' : '#8890b5',
                  }}>
                  <RefreshCw size={10} />
                  {recurring ? 'Ativada' : 'Desativada'}
                </button>
                {recurring && (
                  <span className="text-[10px]" style={{ color: '#8890b5' }}>
                    Repete a cada {recurring.interval} {recurring.type === 'daily' ? 'dia(s)' : recurring.type === 'weekly' ? 'semana(s)' : 'mês(es)'}
                  </span>
                )}
              </div>
              {recurring && (
                <div className="flex gap-2">
                  <select
                    value={recurring.type}
                    onChange={e => setRecurring(r => ({ ...r, type: e.target.value }))}
                    className="flex-1 rounded-xl px-3 py-2 text-xs border outline-none"
                    style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }}>
                    <option value="daily">Diária</option>
                    <option value="weekly">Semanal</option>
                    <option value="monthly">Mensal</option>
                  </select>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px]" style={{ color: '#8890b5' }}>a cada</span>
                    <input
                      type="number" min="1" max="12"
                      value={recurring.interval || 1}
                      onChange={e => setRecurring(r => ({ ...r, interval: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="w-14 rounded-xl px-2 py-2 text-xs border outline-none text-center"
                      style={{ background: '#f8f9fc', borderColor: '#e0e3f0', color: '#1a1d2e' }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Histórico de alterações */}
            {isEdit && task?.taskHistory?.length > 0 && (
              <div>
                <button
                  onClick={() => setShowHistory(v => !v)}
                  className="flex items-center gap-1.5 text-xs font-bold mb-2 w-full text-left"
                  style={{ color: '#4b5068' }}>
                  <History size={11} /> Histórico
                  <span className="ml-1 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#f0f2fb', color: '#8890b5' }}>
                    {task.taskHistory.length}
                  </span>
                  {showHistory ? <ChevronUp size={10} style={{ marginLeft: 'auto' }} /> : <ChevronDown size={10} style={{ marginLeft: 'auto' }} />}
                </button>
                {showHistory && (
                  <div className="space-y-1.5 pl-3 border-l-2" style={{ borderColor: '#e0e3f0' }}>
                    {[...task.taskHistory].reverse().map((h, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: '#8890b5' }} />
                        <div>
                          <span className="text-[10px]" style={{ color: '#1a1d2e' }}>
                            <strong>{h.by}</strong> moveu de <em>{h.from}</em> para <em>{h.to}</em>
                          </span>
                          <span className="text-[9px] block" style={{ color: '#b0b5cc' }}>
                            {new Date(h.at).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="h-2" />
          </div>

          {/* FOOTER */}
          {/* Erro de exclusao — a tarefa permanece; o banco recusou */}
          {delErr && (
            <div className="flex-shrink-0 mx-5 mb-2 px-3 py-2 rounded-xl border flex items-start gap-2"
              style={{ borderColor: '#ef444440', background: '#ef444408' }}>
              <AlertTriangle size={13} style={{ color: '#ef4444', flexShrink: 0, marginTop: 2 }} />
              <span className="text-xs font-bold flex-1" style={{ color: '#ef4444' }}>
                Nao foi possivel excluir: {delErr}
              </span>
              <button onClick={() => setDelErr('')} className="text-xs font-bold" style={{ color: '#8890b5' }}>x</button>
            </div>
          )}

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

            {/* Botao duplicar — so aparece em edicao */}
            {isEdit && !confirmDel && (
              <motion.button
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                onClick={async () => {
                  await addTask({
                    clientId: task.clientId, title: task.title + ' (cópia)',
                    type: task.type, status: 'todo', priority: task.priority,
                    assignee: task.assignee, dueDate: task.dueDate,
                    description: task.description, materialLink: task.materialLink,
                    flag: task.flag, level: task.level,
                    coResponsaveis: task.coResponsaveis,
                    steps, recurring: recurring || null,
                  })
                  onClose()
                }}
                className="p-2.5 rounded-xl border transition-colors flex items-center gap-1.5"
                style={{ color: '#60a5fa', borderColor: '#60a5fa30', background: '#60a5fa08' }}
                title="Duplicar tarefa">
                <Copy size={14} />
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
                  <button onClick={async () => {
                      setDeleting(true); setDelErr('')
                      const res = await onDelete(task.id)
                      setDeleting(false)
                      // Só fecha se o banco confirmou. Senão, mostra o motivo e mantém a tarefa.
                      if (res && res.ok === false) { setDelErr(res.error || 'Falha ao excluir'); setConfirmDel(false); return }
                      onClose()
                    }}
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
