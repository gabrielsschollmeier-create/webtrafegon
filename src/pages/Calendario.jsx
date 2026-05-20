import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Plus, Phone, MessageSquare, Users, Check, Clock } from 'lucide-react'
import { activities, leads } from '../data/mock'

const leadMap = Object.fromEntries(leads.map(l => [l.id, l]))

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

function MiniCalendar({ year, month, selected, onSelect }) {
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

function ActivityCard({ act, onClick }) {
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

function WeekView({ weekStart, activities: acts }) {
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
                    className="flex items-center gap-1.5 p-1.5 rounded-lg cursor-pointer"
                    style={{ backgroundColor: cfg.bg }}
                  >
                    <Icon size={10} style={{ color: cfg.color }} className="flex-shrink-0" />
                    <span className="text-[10px] font-semibold truncate" style={{ color: cfg.color }}>
                      {act.time} · {leadMap[act.leadId]?.name?.split(' ')[0]}
                    </span>
                  </motion.div>
                )
              })}
              {dayActs.length === 0 && (
                <button className="w-full flex items-center justify-center gap-1 py-2 rounded-lg border border-dashed border-border/50 text-muted text-[10px] hover:border-accent/30 hover:text-accent/60 transition-colors">
                  <Plus size={10} /> Adicionar
                </button>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export default function Calendario() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [selected, setSelected] = useState(today.toISOString().split('T')[0])
  const [view, setView] = useState('week')

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
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
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
          <button className="flex items-center gap-1.5 text-sm bg-accent hover:bg-accent-hover text-[#15172a] font-bold px-3 py-2 rounded-lg transition-all">
            <Plus size={14} /> Nova atividade
          </button>
        </div>
      </motion.div>

      <div className="flex gap-5">
        {/* Left sidebar */}
        <div className="w-64 flex-shrink-0 space-y-4">
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
            <MiniCalendar year={year} month={month} selected={selected} onSelect={setSelected} />
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
                <WeekView weekStart={weekStart} activities={activities} />
              </motion.div>
            ) : (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-2">
                <p className="text-xs font-bold text-muted uppercase tracking-wider mb-3">Pendentes · {pendingActs.length}</p>
                {pendingActs.map((act, i) => (
                  <motion.div key={act.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <ActivityCard act={act} onClick={() => {}} />
                  </motion.div>
                ))}
                {doneActs.length > 0 && (
                  <>
                    <p className="text-xs font-bold text-muted uppercase tracking-wider mt-5 mb-3">Concluídas · {doneActs.length}</p>
                    {doneActs.map((act, i) => (
                      <motion.div key={act.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <ActivityCard act={act} onClick={() => {}} />
                      </motion.div>
                    ))}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
