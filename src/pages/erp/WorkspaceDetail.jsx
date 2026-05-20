import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Plus, Calendar, ChevronDown, MoreHorizontal, Flag, Clock, ChevronUp, FileText, Save } from 'lucide-react'
import { erpClients, tasks as allTasks, collaborators, taskTypes, statusConfig, meetings, milestones, milestoneTypes } from '../../data/erp-mock'

const PAUTA_KEY    = 'trafegon_meeting_pautas_v1'
const CUSTOM_MTG_KEY = 'trafegon_custom_meetings_v1'
function loadPautas() { try { return JSON.parse(localStorage.getItem(PAUTA_KEY)) || {} } catch { return {} } }
function savePautas(d) { localStorage.setItem(PAUTA_KEY, JSON.stringify(d)) }
function loadCustomMeetings() { try { return JSON.parse(localStorage.getItem(CUSTOM_MTG_KEY)) || [] } catch { return [] } }
function saveCustomMeetings(d) { localStorage.setItem(CUSTOM_MTG_KEY, JSON.stringify(d)) }

const collabMap = Object.fromEntries(collaborators.map(c => [c.id, c]))

const COLUMNS = ['todo', 'doing', 'review', 'done']

const priorityConfig = {
  high:   { label: 'Alta',   color: '#ef4444' },
  medium: { label: 'Média',  color: '#ea8a29' },
  low:    { label: 'Baixa',  color: '#8890b5' },
}

function TaskCard({ task }) {
  const type = taskTypes[task.type]
  const assignee = collabMap[task.assignee]
  const priority = priorityConfig[task.priority]
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'done'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, boxShadow: '0 6px 20px rgba(26,29,46,0.12), 0 0 0 1px rgba(26,29,46,0.06)' }}
      className="bg-white rounded-xl p-3.5 cursor-pointer"
      style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)' }}
    >
      {/* Type badge */}
      <div className="flex items-center justify-between mb-2.5">
        <span
          className="text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
          style={{ color: type.color, backgroundColor: type.color + '15' }}
        >
          {type.icon} {type.label}
        </span>
        <div className="flex items-center gap-1">
          <Flag size={11} style={{ color: priority.color }} />
          <button className="text-muted hover:text-text-2 transition-colors">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* Title */}
      <p className="text-sm font-semibold text-text mb-1 leading-snug">{task.title}</p>
      {task.description && (
        <p className="text-[11px] text-muted leading-relaxed mb-3 line-clamp-2">{task.description}</p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        <div className="flex items-center gap-1.5">
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white"
            style={{ backgroundColor: assignee?.color }}
          >
            {assignee?.avatar}
          </div>
          <span className="text-[10px] text-muted">{assignee?.name}</span>
        </div>
        <div className={`flex items-center gap-1 text-[10px] font-semibold ${isOverdue ? 'text-danger' : 'text-muted'}`}>
          <Clock size={10} />
          {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
        </div>
      </div>
    </motion.div>
  )
}

function KanbanColumn({ status, tasks, clientColor }) {
  const cfg = statusConfig[status]
  return (
    <div className="flex flex-col w-64 flex-shrink-0">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
        <span className="text-xs font-bold text-text-2 flex-1">{cfg.label}</span>
        <span
          className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
          style={{ color: cfg.color, backgroundColor: cfg.color + '18' }}
        >
          {tasks.length}
        </span>
      </div>
      <div className="flex flex-col gap-2 min-h-16">
        <AnimatePresence>
          {tasks.map(task => <TaskCard key={task.id} task={task} />)}
        </AnimatePresence>
      </div>
      <button className="mt-2 flex items-center gap-1.5 text-xs text-muted hover:text-accent hover:bg-accent/5 rounded-xl px-2 py-2 transition-all w-full border border-transparent hover:border-accent/20">
        <Plus size={12} /> Adicionar tarefa
      </button>
    </div>
  )
}

const TABS = ['Visão Geral', 'Tarefas', 'Reuniões', 'Linha do Tempo']

function ClientTimeline({ clientId, clientColor, clientTasks: tasksProp = [] }) {
  const [range, setRange] = useState('semestral')

  const now = new Date()
  const startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const monthsCount = range === 'semestral' ? 7 : 13
  const endDate = new Date(startDate.getFullYear(), startDate.getMonth() + monthsCount, 0)

  const MONTH_WIDTH = 165
  const CENTER_Y = 112
  const TIMELINE_HEIGHT = 248

  const months = useMemo(() => {
    const result = []
    let cur = new Date(startDate)
    while (cur <= endDate) {
      result.push(new Date(cur))
      cur = new Date(cur.getFullYear(), cur.getMonth() + 1, 1)
    }
    return result
  }, [range])

  const totalWidth = months.length * MONTH_WIDTH

  function dateToX(dateStr) {
    const date = new Date(dateStr + 'T00:00:00')
    const diffDays = (date - startDate) / 86400000
    const totalDays = (endDate - startDate) / 86400000
    return Math.round((diffDays / totalDays) * totalWidth)
  }

  const todayX = dateToX(now.toISOString().split('T')[0])

  const milestoneEvents = milestones
    .filter(m => m.clientId === clientId)
    .filter(m => { const d = new Date(m.date + 'T00:00:00'); return d >= startDate && d <= endDate })
    .map(m => ({ ...m, isTask: false }))

  const taskEvents = tasksProp
    .filter(t => { const d = new Date(t.dueDate + 'T00:00:00'); return d >= startDate && d <= endDate })
    .map(t => ({
      id: 'task_' + t.id, date: t.dueDate, title: t.title,
      isTask: true, taskType: t.type, status: t.status,
    }))

  const clientMilestones = [...milestoneEvents, ...taskEvents]
    .sort((a, b) => a.date.localeCompare(b.date))

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-extrabold text-text">Linha do Tempo</p>
          <p className="text-xs text-muted mt-0.5">{clientMilestones.length} marcos no período</p>
        </div>
        <div className="flex items-center gap-1 bg-surface-2 rounded-xl p-1">
          {['semestral', 'anual'].map(r => (
            <button key={r} onClick={() => setRange(r)}
              className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${
                range === r ? 'bg-white text-accent shadow-sm' : 'text-muted hover:text-text-2'
              }`}
            >
              {r === 'semestral' ? '6 meses' : '1 ano'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4 flex-wrap">
        {Object.entries(milestoneTypes).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cfg.color }} />
            <span className="text-[10px] text-muted font-medium">{cfg.label}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
          <div className="w-2 h-2 flex-shrink-0" style={{ backgroundColor: '#60a5fa', transform: 'rotate(45deg)' }} />
          <span className="text-[10px] text-muted font-medium">Tarefa (prazo)</span>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl">
        <div style={{ position: 'relative', width: totalWidth + 40, height: TIMELINE_HEIGHT, background: '#f7f8fc' }}>
          {months.map((m, i) => (
            <div key={i} style={{ position: 'absolute', left: i * MONTH_WIDTH, top: 0, width: MONTH_WIDTH, height: TIMELINE_HEIGHT }}>
              <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 1, background: 'rgba(26,29,46,0.05)' }} />
              <p style={{ position: 'absolute', top: 10, left: 10, fontSize: 9, fontWeight: 700, color: 'rgba(26,29,46,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                {m.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}
                {m.getFullYear() !== now.getFullYear() ? ` ${m.getFullYear()}` : ''}
              </p>
            </div>
          ))}

          <div style={{ position: 'absolute', left: 0, width: totalWidth + 40, top: CENTER_Y, height: 2, background: clientColor + '40', borderRadius: 2 }} />

          {todayX >= 0 && todayX <= totalWidth && (
            <div style={{ position: 'absolute', left: todayX, top: 26, bottom: 10, width: 2, background: '#6eda2c', borderRadius: 2, zIndex: 20 }}>
              <div style={{ position: 'absolute', top: -7, left: '50%', transform: 'translateX(-50%)', background: '#6eda2c', color: '#0f1117', fontSize: 8, fontWeight: 800, padding: '2px 5px', borderRadius: 4, whiteSpace: 'nowrap' }}>
                HOJE
              </div>
            </div>
          )}

          {clientMilestones.map((m, i) => {
            const cfg = m.isTask
              ? { color: taskTypes[m.taskType]?.color ?? '#8890b5', icon: taskTypes[m.taskType]?.icon ?? '📌', label: taskTypes[m.taskType]?.label ?? 'Tarefa' }
              : (milestoneTypes[m.type] || { color: '#8890b5', icon: '●', label: m.type })
            const x = dateToX(m.date)
            const above = i % 2 === 0
            const isDone = m.isTask && m.status === 'done'
            return (
              <div key={m.id} style={{ position: 'absolute', left: x, top: 0, height: TIMELINE_HEIGHT }}>
                <div style={{ position: 'absolute', left: 0, top: above ? CENTER_Y - 36 : CENTER_Y + 6, width: 1, height: 32, background: cfg.color + '60' }} />
                {m.isTask ? (
                  <div style={{ position: 'absolute', top: CENTER_Y - 6, left: -6, width: 12, height: 12, transform: 'rotate(45deg)', background: isDone ? cfg.color + '60' : cfg.color, border: '2px solid white', boxShadow: `0 2px 6px ${cfg.color}50`, zIndex: 10 }} />
                ) : (
                  <div style={{ position: 'absolute', top: CENTER_Y - 6, left: -6, width: 12, height: 12, borderRadius: '50%', background: cfg.color, border: '2px solid white', boxShadow: `0 2px 6px ${cfg.color}50`, zIndex: 10 }} />
                )}
                <div style={{ position: 'absolute', top: above ? CENTER_Y - 82 : CENTER_Y + 18, left: -56, width: 112, background: 'white', borderRadius: 8, padding: '5px 7px', boxShadow: `0 2px 10px rgba(26,29,46,0.12), 0 0 0 1px ${cfg.color}30`, zIndex: 15, opacity: isDone ? 0.6 : 1 }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: cfg.color, lineHeight: 1.2 }}>
                    {cfg.icon} {cfg.label}{m.isTask ? (isDone ? ' ✓' : '') : ''}
                  </p>
                  <p style={{ fontSize: 10, fontWeight: 600, color: '#1a1d2e', marginTop: 2, lineHeight: 1.3 }}>{m.title}</p>
                  <p style={{ fontSize: 9, color: '#8890b5', marginTop: 2 }}>
                    {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            )
          })}

          {clientMilestones.length === 0 && (
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
              <p style={{ fontSize: 12, color: '#8890b5', fontWeight: 600 }}>Nenhum marco registrado neste período</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function NewMeetingModal({ clientId, onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10)
  const [form, setForm] = useState({
    title: '', date: today, time: '10:00', duration: 60, pauta: '',
    attendees: [],
  })

  const collabList = collaborators

  function toggleAttendee(id) {
    setForm(f => ({
      ...f,
      attendees: f.attendees.includes(id) ? f.attendees.filter(a => a !== id) : [...f.attendees, id],
    }))
  }

  function handleSave() {
    if (!form.title.trim()) return
    const meeting = {
      id: 'custom_' + Date.now(),
      clientId,
      title: form.title.trim(),
      date: form.date,
      time: form.time,
      duration: parseInt(form.duration) || 60,
      attendees: form.attendees,
      custom: true,
    }
    onSave(meeting, form.pauta)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(8,10,18,0.7)' }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden"
        style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.3)' }}
      >
        <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: '1px solid #edf0f7' }}>
          <h2 className="text-base font-extrabold text-text">Nova Reunião</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-surface text-muted transition-colors"><Plus size={15} className="rotate-45" /></button>
        </div>

        <div className="px-7 py-5 space-y-4">
          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Título</label>
            <input
              value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="Ex: Reunião mensal de performance"
              autoFocus
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
              style={{ background: '#f8f9fc' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Data</label>
              <input
                type="date" value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Horário</label>
              <input
                type="time" value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
            <div>
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Duração (min)</label>
              <input
                type="number" min={15} max={240} value={form.duration}
                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text outline-none focus:border-accent/60 transition-colors"
                style={{ background: '#f8f9fc' }}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Participantes</label>
            <div className="flex flex-wrap gap-2">
              {collabList.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => toggleAttendee(c.id)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all"
                  style={form.attendees.includes(c.id)
                    ? { background: c.color + '18', borderColor: c.color + '60', color: c.color }
                    : { background: '#f8f9fc', borderColor: '#e2e5f0', color: '#8890b5' }}
                >
                  <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white"
                    style={{ backgroundColor: c.color }}>{c.avatar}</div>
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1.5">Pauta (opcional)</label>
            <textarea
              value={form.pauta} onChange={e => setForm(f => ({ ...f, pauta: e.target.value }))}
              rows={3} placeholder="Tópicos da reunião, objetivos, pontos de discussão…"
              className="w-full border border-border rounded-xl px-4 py-2.5 text-sm text-text resize-none outline-none focus:border-accent/60 transition-colors"
              style={{ background: '#f8f9fc' }}
            />
          </div>
        </div>

        <div className="flex gap-3 px-7 py-5" style={{ borderTop: '1px solid #edf0f7' }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-border text-sm font-bold text-muted hover:bg-surface transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={!form.title.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-white disabled:opacity-50 transition-all"
            style={{ background: '#6eda2c', boxShadow: '0 4px 14px rgba(110,218,44,0.3)' }}
          >
            Criar Reunião
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function MeetingCard({ m, pautas, expanded, editingId, draft, setDraft, setExpanded, startEdit, savePauta, onDelete }) {
  const attendees = (m.attendees || []).map(a => collabMap[a]).filter(Boolean)
  const isOpen = expanded === m.id
  const pauta = pautas[m.id]

  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      <div className="p-5 flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: m.custom ? 'rgba(110,218,44,0.1)' : '#8890b518' }}>
          {m.custom ? '🗓️' : '📅'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold text-text">{m.title}</p>
            {m.custom && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(110,218,44,0.1)', color: '#6eda2c' }}>Nova</span>}
          </div>
          <p className="text-xs text-muted mt-0.5">
            {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })} · {m.time} · {m.duration}min
          </p>
          {pauta && !isOpen && (
            <p className="text-[11px] text-muted mt-1 line-clamp-1 italic">"{pauta.slice(0, 80)}{pauta.length > 80 ? '…' : ''}"</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex -space-x-1.5">
            {attendees.map(a => (
              <div key={a.id} className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[9px] font-extrabold text-white" style={{ backgroundColor: a.color }}>{a.avatar}</div>
            ))}
          </div>
          {m.custom && onDelete && (
            <button onClick={() => onDelete(m.id)} className="text-danger/40 hover:text-danger transition-colors ml-1">
              <Plus size={13} className="rotate-45" />
            </button>
          )}
          <button onClick={() => setExpanded(isOpen ? null : m.id)} className="text-muted hover:text-text transition-colors ml-1">
            {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5" style={{ borderTop: '1px solid #edf0f7' }}>
              <div className="flex items-center justify-between mb-2 mt-4">
                <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-muted">
                  <FileText size={12} /> Pauta / Resumo
                </div>
                {editingId !== m.id && (
                  <button onClick={() => startEdit(m.id)} className="text-xs font-bold text-accent hover:text-accent-hover transition-colors">
                    {pauta ? 'Editar' : '+ Adicionar pauta'}
                  </button>
                )}
              </div>
              {editingId === m.id ? (
                <div>
                  <textarea
                    value={draft} onChange={e => setDraft(e.target.value)}
                    rows={5} placeholder="Escreva a pauta, tópicos abordados, decisões e próximos passos…" autoFocus
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm text-text resize-none outline-none focus:border-accent/60 transition-colors"
                    style={{ background: '#f8f9fc' }}
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={() => startEdit(null)} className="px-3 py-1.5 text-xs font-bold text-muted border border-border rounded-lg hover:bg-surface transition-colors">Cancelar</button>
                    <button onClick={() => savePauta(m.id)} className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white rounded-lg" style={{ background: '#6eda2c' }}>
                      <Save size={12} /> Salvar
                    </button>
                  </div>
                </div>
              ) : pauta ? (
                <p className="text-sm text-text leading-relaxed whitespace-pre-wrap">{pauta}</p>
              ) : (
                <p className="text-xs text-muted italic">Nenhuma pauta registrada. Clique em "+ Adicionar pauta".</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function MeetingsPanel({ clientMeetings, clientId }) {
  const [pautas,      setPautas]      = useState(loadPautas)
  const [customMtgs,  setCustomMtgs]  = useState(() => loadCustomMeetings().filter(m => m.clientId === clientId))
  const [expanded,    setExpanded]    = useState(null)
  const [editingId,   setEditingId]   = useState(null)
  const [draft,       setDraft]       = useState('')
  const [showModal,   setShowModal]   = useState(false)

  const allMeetings = [...clientMeetings, ...customMtgs]
    .sort((a, b) => a.date.localeCompare(b.date))

  function startEdit(id) {
    if (id === null) { setEditingId(null); return }
    setEditingId(id)
    setDraft(pautas[id] || '')
    setExpanded(id)
  }

  function savePauta(id) {
    const updated = { ...pautas, [id]: draft }
    setPautas(updated)
    savePautas(updated)
    setEditingId(null)
  }

  function handleNewMeeting(meeting, pauta) {
    const allCustom = [...loadCustomMeetings(), meeting]
    saveCustomMeetings(allCustom)
    setCustomMtgs(prev => [...prev, meeting])
    if (pauta?.trim()) {
      const updated = { ...pautas, [meeting.id]: pauta }
      setPautas(updated)
      savePautas(updated)
    }
    setShowModal(false)
  }

  function handleDelete(id) {
    const allCustom = loadCustomMeetings().filter(m => m.id !== id)
    saveCustomMeetings(allCustom)
    setCustomMtgs(prev => prev.filter(m => m.id !== id))
  }

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-extrabold text-text">{allMeetings.length} reuniões</p>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
          style={{ background: '#6eda2c', boxShadow: '0 4px 12px rgba(110,218,44,0.3)' }}
        >
          <Plus size={13} /> Nova Reunião
        </button>
      </div>

      <div className="space-y-3">
        {allMeetings.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <span className="text-4xl block mb-3">📅</span>
            <p className="text-sm font-bold text-text mb-1">Nenhuma reunião agendada</p>
            <p className="text-xs text-muted mb-4">Clique em "Nova Reunião" para agendar.</p>
          </div>
        )}
        {allMeetings.map(m => (
          <MeetingCard
            key={m.id} m={m} pautas={pautas}
            expanded={expanded} editingId={editingId} draft={draft}
            setDraft={setDraft} setExpanded={setExpanded}
            startEdit={startEdit} savePauta={savePauta}
            onDelete={m.custom ? handleDelete : null}
          />
        ))}
      </div>

      <AnimatePresence>
        {showModal && (
          <NewMeetingModal
            clientId={clientId}
            onClose={() => setShowModal(false)}
            onSave={handleNewMeeting}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default function WorkspaceDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState('Visão Geral')
  const [typeFilter, setTypeFilter] = useState('all')

  const client = erpClients.find(c => c.id === id)
  if (!client) return (
    <div className="p-8 text-muted">Cliente não encontrado.</div>
  )

  const [clientTasks, setClientTasks] = useState(() => allTasks.filter(t => t.clientId === id))
  const clientMeetings = meetings.filter(m => m.clientId === id)
  const manager = collabMap[client.manager]
  const done = clientTasks.filter(t => t.status === 'done').length
  const pct = clientTasks.length > 0 ? Math.round((done / clientTasks.length) * 100) : 0

  const filteredTasks = typeFilter === 'all' ? clientTasks : clientTasks.filter(t => t.type === typeFilter)

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="px-8 py-5 bg-white border-b border-border flex-shrink-0"
        style={{ boxShadow: '0 1px 0 #e0e3f0' }}>
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate('/workspaces')}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-text-2 font-medium transition-colors"
          >
            <ArrowLeft size={14} /> Workspaces
          </button>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-3 flex-1">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold text-white"
              style={{ background: `linear-gradient(135deg, ${client.color}, ${client.color}99)` }}
            >
              {client.name[0]}
            </div>
            <div>
              <h1 className="text-lg font-extrabold text-text">{client.name}</h1>
              <p className="text-[11px] text-muted">{client.niche} · desde {new Date(client.since + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
            </div>
          </div>

          {/* Stats rápidas */}
          <div className="flex items-center gap-4">
            <div className="text-center">
              <p className="text-lg font-extrabold" style={{ color: client.color }}>{pct}%</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Concluído</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-text">{clientTasks.length}</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Tarefas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-extrabold text-text">R$ {(client.monthlyValue / 1000).toFixed(1)}k</p>
              <p className="text-[10px] text-muted uppercase tracking-wider">Mensalidade</p>
            </div>
            <div className="flex items-center gap-2 bg-surface-2 rounded-xl px-3 py-2">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-extrabold text-white" style={{ backgroundColor: manager?.color }}>{manager?.avatar}</div>
              <span className="text-xs font-semibold text-text-2">{manager?.name}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                tab === t ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2 hover:bg-surface-2'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <AnimatePresence mode="wait">
          {tab === 'Visão Geral' && (
            <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8"
            >
              <div className="grid grid-cols-3 gap-5">
                {/* Progresso por tipo */}
                <div className="col-span-2 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-sm font-extrabold text-text mb-5">Entregáveis por tipo</p>
                  <div className="space-y-4">
                    {Object.entries(taskTypes).map(([key, cfg]) => {
                      const typeTasks = clientTasks.filter(t => t.type === key)
                      if (typeTasks.length === 0) return null
                      const typeDone = typeTasks.filter(t => t.status === 'done').length
                      const typePct = Math.round((typeDone / typeTasks.length) * 100)
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-sm">{cfg.icon}</span>
                              <span className="text-sm font-semibold text-text-2">{cfg.label}</span>
                            </div>
                            <div className="flex items-center gap-3 text-xs">
                              <span className="text-muted">{typeDone}/{typeTasks.length}</span>
                              <span className="font-extrabold" style={{ color: cfg.color }}>{typePct}%</span>
                            </div>
                          </div>
                          <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: cfg.color + '18' }}>
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: cfg.color }}
                              initial={{ width: 0 }}
                              animate={{ width: `${typePct}%` }}
                              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Próximas reuniões */}
                <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-sm font-extrabold text-text mb-4">Próximas reuniões</p>
                  {clientMeetings.length > 0 ? (
                    <div className="space-y-3">
                      {clientMeetings.map(m => (
                        <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl" style={{ backgroundColor: '#8890b518' }}>
                          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#8890b528' }}>
                            <Calendar size={14} className="text-muted" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-text truncate">{m.title}</p>
                            <p className="text-[10px] text-muted mt-0.5">
                              {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })} às {m.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted text-center py-6">Nenhuma reunião agendada.</p>
                  )}
                  <button className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-accent transition-colors py-2 rounded-xl hover:bg-accent/5 font-semibold">
                    <Plus size={12} /> Agendar reunião
                  </button>
                </div>

                {/* Tarefas urgentes */}
                <div className="col-span-3 bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-sm font-extrabold text-text mb-4">Tarefas em destaque</p>
                  <div className="grid grid-cols-3 gap-3">
                    {clientTasks.filter(t => t.priority === 'high' && t.status !== 'done').slice(0, 3).map(task => {
                      const type = taskTypes[task.type]
                      const assignee = collabMap[task.assignee]
                      return (
                        <div key={task.id} className="rounded-xl p-3.5 border" style={{ borderColor: type.color + '30', backgroundColor: type.color + '08' }}>
                          <div className="flex items-center gap-1.5 mb-2">
                            <span className="text-sm">{type.icon}</span>
                            <span className="text-[10px] font-bold" style={{ color: type.color }}>{type.label}</span>
                            <span className="ml-auto text-[9px] text-danger font-bold">Alta prioridade</span>
                          </div>
                          <p className="text-sm font-bold text-text mb-2">{task.title}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-extrabold text-white" style={{ backgroundColor: assignee?.color }}>{assignee?.avatar}</div>
                              <span className="text-[10px] text-muted">{assignee?.name}</span>
                            </div>
                            <span className="text-[10px] text-muted">
                              {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'Tarefas' && (
            <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8"
            >
              {/* Filter by type */}
              <div className="flex items-center gap-2 mb-6">
                <button onClick={() => setTypeFilter('all')}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl transition-all ${typeFilter === 'all' ? 'bg-text text-white' : 'bg-white text-muted hover:text-text-2 border border-border'}`}
                >
                  Todos
                </button>
                {Object.entries(taskTypes).map(([key, cfg]) => (
                  <button key={key} onClick={() => setTypeFilter(key)}
                    className="text-xs font-bold px-3 py-1.5 rounded-xl transition-all border"
                    style={{
                      backgroundColor: typeFilter === key ? cfg.color : 'white',
                      color: typeFilter === key ? '#0f1117' : cfg.color,
                      borderColor: typeFilter === key ? cfg.color : cfg.color + '40',
                    }}
                  >
                    {cfg.icon} {cfg.label}
                  </button>
                ))}
              </div>

              {/* Kanban */}
              <div className="flex gap-4 pb-6">
                {COLUMNS.map(status => (
                  <KanbanColumn
                    key={status}
                    status={status}
                    tasks={filteredTasks.filter(t => t.status === status)}
                    clientColor={client.color}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {tab === 'Linha do Tempo' && (
            <motion.div key="timeline" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8"
            >
              <ClientTimeline clientId={id} clientColor={client.color} clientTasks={clientTasks} />
            </motion.div>
          )}

          {tab === 'Reuniões' && (
            <motion.div key="meetings" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8"
            >
              <MeetingsPanel clientMeetings={clientMeetings} clientId={id} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
