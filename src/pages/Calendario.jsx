import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Phone, MessageSquare, Users, Check, Clock, Video, X, ExternalLink } from 'lucide-react'
import { useData } from '../contexts/DataContext'

// Gera link do Google Agenda pré-preenchido
function buildGCalLink({ title, date, time, duration = 60, description = '', guests = [] }) {
  function pad(n) { return String(n).padStart(2, '0') }
  const [y, m, d] = date.split('-').map(Number)
  const [h, min]  = time.split(':').map(Number)
  const start = new Date(y, m - 1, d, h, min)
  const end   = new Date(start.getTime() + duration * 60000)

  function fmt(dt) {
    return `${dt.getFullYear()}${pad(dt.getMonth()+1)}${pad(dt.getDate())}T${pad(dt.getHours())}${pad(dt.getMinutes())}00`
  }

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${fmt(start)}/${fmt(end)}`,
    details: description,
  })
  if (guests.length) params.set('add', guests.join(','))

  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

const typeConfig = {
  call:    { icon: Phone,          label: 'Ligação',   color: '#6eda2c', bg: '#6eda2c15' },
  meeting: { icon: Users,          label: 'Reunião',   color: '#be29ec', bg: '#be29ec15' },
  follow:  { icon: MessageSquare,  label: 'Follow-up', color: '#ea8a29', bg: '#ea8a2915' },
}

const DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay()
}

function MiniCalendar({ year, month, selected, onSelect, activities }) {
  const days = getDaysInMonth(year, month)
  const first = getFirstDayOfMonth(year, month)
  const today = new Date()
  const actDates = new Set(activities.map(a => a.dueDate))

  const cells = []
  for (let i = 0; i < first; i++) cells.push(null)
  for (let d = 1; d <= days; d++) cells.push(d)

  return (
    <div className="bg-white border border-border rounded-xl card-shadow p-4">
      <div className="grid grid-cols-7 gap-0.5 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-[10px] text-muted text-center font-semibold py-1">{d[0]}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isToday = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
          const hasAct = actDates.has(dateStr)
          const isSel = selected === dateStr
          return (
            <button
              key={i}
              onClick={() => onSelect(dateStr)}
              className={`relative h-7 w-7 rounded-lg text-xs font-medium transition-all flex items-center justify-center mx-auto ${
                isSel ? 'bg-accent text-[#15172a] font-bold' :
                isToday ? 'border border-accent/40 text-accent' :
                'text-text-2 hover:bg-black/[0.04]'
              }`}
            >
              {d}
              {hasAct && !isSel && (
                <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-accent" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ActivityCard({ act, onClick, leadMap }) {
  const lead = leadMap[act.leadId]
  const cfg = typeConfig[act.type]
  const Icon = cfg.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 3 }}
      onClick={() => onClick(act)}
      className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
        act.done
          ? 'border-border/30 opacity-50'
          : 'border-border hover:border-opacity-70'
      }`}
      style={!act.done ? { borderLeftColor: cfg.color, borderLeftWidth: 3 } : {}}
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: cfg.bg }}>
        <Icon size={15} style={{ color: cfg.color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${act.done ? 'line-through text-muted' : 'text-text'}`}>
          {act.description}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-xs text-muted">{lead?.name}</span>
          <span className="text-muted">·</span>
          <div className="flex items-center gap-1 text-xs text-muted">
            <Clock size={10} />
            {act.time}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
        {act.done && <Check size={14} className="text-accent" />}
      </div>
    </motion.div>
  )
}

function WeekView({ weekStart, activities: acts, leadMap, onToggle, onAddForDate }) {
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })
  const today = new Date()

  return (
    <div className="grid grid-cols-7 gap-3">
      {days.map((day, i) => {
        const dateStr = day.toISOString().split('T')[0]
        const dayActs = acts.filter(a => a.dueDate === dateStr)
        const isToday = day.toDateString() === today.toDateString()
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={`rounded-xl border p-3 min-h-[160px] ${
              isToday ? 'border-accent/40 bg-accent/5' : 'border-border bg-white card-shadow'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-[10px] text-muted font-semibold uppercase">{DAYS[day.getDay()]}</p>
                <p className={`text-lg font-extrabold ${isToday ? 'text-accent' : 'text-text'}`}>
                  {day.getDate()}
                </p>
              </div>
              {isToday && (
                <span className="text-[9px] bg-accent text-[#15172a] font-extrabold px-1.5 py-0.5 rounded-full">HOJE</span>
              )}
            </div>
            <div className="space-y-1.5">
              {dayActs.map(act => {
                const cfg = typeConfig[act.type]
                const Icon = cfg.icon
                return (
                  <motion.div
                    key={act.id}
                    whileHover={{ scale: 1.02 }}
                    className="flex items-center gap-1 p-1.5 rounded-lg group"
                    style={{ backgroundColor: cfg.bg, opacity: act.done ? 0.5 : 1 }}
                  >
                    <button onClick={() => onToggle(act.id)} className="flex items-center gap-1 flex-1 min-w-0">
                      <Icon size={10} style={{ color: cfg.color }} className="flex-shrink-0" />
                      <span className={`text-[10px] font-semibold truncate ${act.done ? 'line-through' : ''}`} style={{ color: cfg.color }}>
                        {act.time} · {leadMap[act.leadId]?.name?.split(' ')[0] || act.description?.split(' ')[0]}
                      </span>
                    </button>
                    <a
                      href={buildGCalLink({ title: act.description || cfg.label, date: act.dueDate, time: act.time || '10:00', duration: 60 })}
                      target="_blank" rel="noopener noreferrer"
                      title="Abrir no Google Agenda"
                      onClick={e => e.stopPropagation()}
                      className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: cfg.color }}
                    >
                      <ExternalLink size={9} />
                    </a>
                  </motion.div>
                )
              })}
              <button
                onClick={() => onAddForDate(dateStr)}
                className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-border/50 text-muted text-[10px] hover:border-accent/30 hover:text-accent/60 transition-colors"
              >
                <Plus size={10} /> Adicionar
              </button>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

function NewActivityModal({ onClose, onSave, leads, defaultDate }) {
  const today = defaultDate || new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({
    type: 'meeting',
    description: '',
    leadId: leads[0]?.id || '',
    dueDate: today,
    time: '10:00',
    duration: 60,
    guests: '',
    meet: false,
  })
  const [saved, setSaved] = useState(null) // { gcalLink }

  function handleSave() {
    if (!form.description.trim()) return
    const activity = {
      id: 'act_' + Date.now(),
      type: form.type,
      description: form.description.trim() + (form.meet ? ' · Google Meet' : ''),
      leadId: form.leadId,
      dueDate: form.dueDate,
      time: form.time,
      done: false,
    }
    onSave(activity)

    const lead = leads.find(l => l.id === form.leadId)
    const guestList = form.guests.split(/[\s,;]+/).filter(g => g.includes('@'))
    const gcalLink = buildGCalLink({
      title:       form.description.trim(),
      date:        form.dueDate,
      time:        form.time,
      duration:    form.duration,
      description: lead ? `Cliente: ${lead.name}${lead.company ? ` — ${lead.company}` : ''}` : '',
      guests:      guestList,
    })
    setSaved({ gcalLink, guestList })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-md"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <p className="text-base font-extrabold text-gray-900">{saved ? 'Atividade criada! ✓' : 'Nova Atividade'}</p>
          <button onClick={onClose} className="w-8 h-8 rounded-xl flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors">
            <X size={15} />
          </button>
        </div>

        {saved ? (
          /* ── Estado de sucesso com link Google Agenda ── */
          <div className="p-6 space-y-4">
            <div className="rounded-2xl p-4 text-center" style={{ background: '#6eda2c10', border: '1px solid #6eda2c30' }}>
              <p className="text-2xl mb-1">📅</p>
              <p className="text-sm font-extrabold text-text">Atividade salva no sistema</p>
              <p className="text-[11px] text-muted mt-0.5">Agora adicione ao Google Agenda para aparecer para todos</p>
            </div>

            <a href={saved.gcalLink} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-extrabold text-white transition-all hover:opacity-90"
              style={{ background: 'linear-gradient(135deg,#4285f4,#34a853)', boxShadow: '0 4px 16px rgba(66,133,244,0.35)' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Abrir no Google Agenda
              <ExternalLink size={13} />
            </a>

            {saved.guestList.length > 0 && (
              <p className="text-[10px] text-center text-muted">
                Convidados incluídos: {saved.guestList.join(', ')}
              </p>
            )}

            <p className="text-[10px] text-center text-muted">
              O link abre o Google Agenda já com todos os dados preenchidos.<br/>
              Cada convidado receberá o convite pelo Google.
            </p>

            <button onClick={onClose}
              className="w-full py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Tipo</label>
                <div className="flex gap-2">
                  {Object.entries(typeConfig).map(([key, cfg]) => {
                    const Icon = cfg.icon
                    return (
                      <button key={key} onClick={() => setForm(f => ({ ...f, type: key }))}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-bold transition-all"
                        style={{
                          backgroundColor: form.type === key ? cfg.color + '18' : 'transparent',
                          borderColor: form.type === key ? cfg.color + '60' : '#e5e7eb',
                          color: form.type === key ? cfg.color : '#9ca3af',
                        }}>
                        <Icon size={12} /> {cfg.label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Descrição *</label>
                <input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="Ex: Apresentar proposta comercial"
                  autoFocus
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Lead</label>
                <select value={form.leadId} onChange={e => setForm(f => ({ ...f, leadId: e.target.value }))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                  {leads.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Data</label>
                  <input type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Horário</label>
                  <input type="time" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Duração</label>
                  <select value={form.duration} onChange={e => setForm(f => ({ ...f, duration: Number(e.target.value) }))}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-accent/50 transition-colors cursor-pointer">
                    <option value={30}>30 min</option>
                    <option value={60}>1h</option>
                    <option value={90}>1h30</option>
                    <option value={120}>2h</option>
                  </select>
                </div>
              </div>

              {/* Convidados */}
              <div>
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                  Convidados (e-mails separados por vírgula)
                </label>
                <input value={form.guests} onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                  placeholder="cliente@email.com, colega@trafegon.com"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:border-accent/50 transition-colors" />
                <p className="text-[10px] text-gray-400 mt-1">Os convidados recebem o convite direto no Google Agenda deles</p>
              </div>

              {form.type === 'meeting' && (
                <button
                  onClick={() => setForm(f => ({ ...f, meet: !f.meet }))}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border transition-all"
                  style={{
                    backgroundColor: form.meet ? 'rgba(66,133,244,0.08)' : '#f9fafb',
                    borderColor: form.meet ? 'rgba(66,133,244,0.4)' : '#e5e7eb',
                  }}>
                  <Video size={16} style={{ color: '#4285f4' }} />
                  <span className="text-sm font-semibold flex-1 text-left" style={{ color: form.meet ? '#4285f4' : '#6b7280' }}>
                    {form.meet ? 'Google Meet incluído' : 'Adicionar Google Meet'}
                  </span>
                  <div className="w-4 h-4 rounded border-2 flex items-center justify-center"
                    style={{ borderColor: form.meet ? '#4285f4' : '#d1d5db', backgroundColor: form.meet ? '#4285f4' : 'transparent' }}>
                    {form.meet && <Check size={10} className="text-white" />}
                  </div>
                </button>
              )}
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-gray-100">
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors">
                Cancelar
              </button>
              <button onClick={handleSave} disabled={!form.description.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] disabled:opacity-40 transition-all"
                style={{ background: '#6eda2c', boxShadow: '0 4px 16px #6eda2c30' }}>
                Criar + Abrir Google Agenda
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  )
}

export default function Calendario() {
  const { activities, leads, addActivity, toggleActivity } = useData()
  const leadMap = Object.fromEntries(leads.map(l => [l.id, l]))
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(today.toISOString().split('T')[0])
  const [view, setView] = useState('week')
  const [showNewActivity, setShowNewActivity] = useState(false)
  const [newActivityDate, setNewActivityDate] = useState(null)

  const [weekOffset, setWeekOffset] = useState(0)
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay() + 1 + weekOffset * 7)

  const selectedActs = activities.filter(a => a.dueDate === selected)
  const pendingActs = activities.filter(a => !a.done)
  const doneActs = activities.filter(a => a.done)

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-bold text-text">Calendário</h1>
          <p className="text-sm text-muted mt-0.5">{pendingActs.length} atividades pendentes</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-surface border border-border rounded-lg p-0.5">
            {['week', 'list'].map(v => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  view === v ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2'
                }`}
              >
                {v === 'week' ? 'Semana' : 'Lista'}
              </button>
            ))}
          </div>
          <a href="https://meet.google.com/new" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm border border-border bg-white text-muted hover:text-text-2 font-semibold px-3 py-2 rounded-lg transition-all">
            <Video size={14} className="text-[#4285f4]" /> Google Meet
          </a>
          <button onClick={() => setShowNewActivity(true)} className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-2 rounded-lg transition-all">
            <Plus size={14} /> Nova atividade
          </button>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left sidebar */}
        <div className="w-full lg:w-64 lg:flex-shrink-0 space-y-4">
          {/* Mini calendar */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
            <div className="flex items-center justify-between mb-3 px-1">
              <button onClick={prevMonth} className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                <ChevronLeft size={14} />
              </button>
              <p className="text-xs font-bold text-text">{MONTHS[month]} {year}</p>
              <button onClick={nextMonth} className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                <ChevronRight size={14} />
              </button>
            </div>
            <MiniCalendar year={year} month={month} selected={selected} onSelect={setSelected} activities={activities} />
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
            className="bg-white border border-border rounded-xl card-shadow p-4 space-y-3"
          >
            <p className="text-xs font-bold text-text-2 uppercase tracking-wider">Esta semana</p>
            {[
              { label: 'Ligações', count: activities.filter(a => a.type === 'call').length,    color: '#6eda2c' },
              { label: 'Reuniões', count: activities.filter(a => a.type === 'meeting').length, color: '#be29ec' },
              { label: 'Follow-ups', count: activities.filter(a => a.type === 'follow').length, color: '#ea8a29' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }} />
                  <span className="text-xs text-text-2">{s.label}</span>
                </div>
                <span className="text-sm font-extrabold" style={{ color: s.color }}>{s.count}</span>
              </div>
            ))}
          </motion.div>

          {/* Selected day activities */}
          {selectedActs.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-border rounded-xl card-shadow p-4">
              <p className="text-xs font-bold text-text mb-3">
                {new Date(selected + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
              </p>
              <div className="space-y-2">
                {selectedActs.map(act => {
                  const cfg = typeConfig[act.type]
                  const Icon = cfg.icon
                  return (
                    <div key={act.id} className="flex items-center gap-2 text-xs">
                      <Icon size={11} style={{ color: cfg.color }} />
                      <span className="text-text-2 truncate">{act.description}</span>
                    </div>
                  )
                })}
              </div>
            </motion.div>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            {view === 'week' ? (
              <motion.div key="week" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-center gap-2 mb-4">
                  <button onClick={() => setWeekOffset(o => o - 1)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-sm font-bold text-text min-w-[220px] text-center">
                    {weekStart.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} — {new Date(weekStart.getTime() + 6 * 86400000).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                  </span>
                  <button onClick={() => setWeekOffset(o => o + 1)} className="w-7 h-7 rounded-lg flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] transition-colors">
                    <ChevronRight size={16} />
                  </button>
                  {weekOffset !== 0 && (
                    <button onClick={() => setWeekOffset(0)} className="text-xs font-bold text-accent hover:text-accent-hover transition-colors px-2 py-1 rounded-lg hover:bg-accent/10">
                      Hoje
                    </button>
                  )}
                </div>
                <WeekView
                  weekStart={weekStart}
                  activities={activities}
                  leadMap={leadMap}
                  onToggle={toggleActivity}
                  onAddForDate={date => { setNewActivityDate(date); setShowNewActivity(true) }}
                />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Pendentes · {pendingActs.length}</p>
                {pendingActs.map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ActivityCard act={act} onClick={() => toggleActivity(act.id)} leadMap={leadMap} />
                  </motion.div>
                ))}
                {doneActs.length > 0 && (
                  <>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mt-5 mb-3">Concluídas · {doneActs.length}</p>
                    {doneActs.map((act, i) => (
                      <motion.div key={act.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <ActivityCard act={act} onClick={() => toggleActivity(act.id)} leadMap={leadMap} />
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showNewActivity && (
          <NewActivityModal
            onClose={() => { setShowNewActivity(false); setNewActivityDate(null) }}
            onSave={act => addActivity(act)}
            leads={leads}
            defaultDate={newActivityDate || selected}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
