import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, Phone, MessageSquare, Mail, Calendar, Tag,
  MoreHorizontal, CheckCircle2, Clock, Circle,
  TrendingUp, DollarSign, Star, Plus, ChevronRight, X
} from 'lucide-react'
import { leads, stages, activities } from '../data/mock'

const stageMap = Object.fromEntries(stages.map(s => [s.id, s]))

const fmt = v => v > 0
  ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
  : 'Sem valor'

const sourceColors = {
  'WhatsApp':        { bg: '#25d36618', color: '#25d366' },
  'Meta Ads':        { bg: '#4f6ef718', color: '#4f6ef7' },
  'Meta Formulário': { bg: '#be29ec18', color: '#be29ec' },
  'Google Ads':      { bg: '#ea8a2918', color: '#ea8a29' },
  'Orgânico':        { bg: '#6eda2c18', color: '#6eda2c' },
  'Indicação':       { bg: '#ec489918', color: '#ec4899' },
  'Lista de leads':  { bg: '#8890b518', color: '#8890b5' },
}

const typeColor = { call: '#6eda2c', meeting: '#be29ec', follow: '#ea8a29' }
const typeLabel = { call: 'Ligação',  meeting: 'Reunião', follow: 'Follow-up' }
const typeIcon  = { call: '📞',       meeting: '🤝',      follow: '💬' }

const PIPELINE_STAGES_ACQ = ['novo', 'contato', 'qualificado', 'proposta', 'fechado']
const TABS = ['Visão Geral', 'Atividades', 'Anotações']

function NewActivityModal({ onSave, onClose }) {
  const [type, setType]    = useState('call')
  const [desc, setDesc]    = useState('')
  const [date, setDate]    = useState(new Date().toISOString().split('T')[0])
  const [time, setTime]    = useState('09:00')

  function submit(e) {
    e.preventDefault()
    if (!desc.trim()) return
    onSave({ type, description: desc.trim(), dueDate: date, time, done: false })
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(15,17,23,0.5)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-2xl p-6 w-full max-w-md"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.25)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-base font-extrabold text-text">Nova atividade</p>
          <button onClick={onClose} className="text-muted hover:text-text-2 transition-colors"><X size={16} /></button>
        </div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Tipo</label>
            <div className="flex gap-2">
              {[['call', '📞 Ligação'], ['meeting', '🤝 Reunião'], ['follow', '💬 Follow-up']].map(([v, label]) => (
                <button key={v} type="button" onClick={() => setType(v)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold border transition-all"
                  style={{
                    backgroundColor: type === v ? typeColor[v] + '18' : 'transparent',
                    borderColor:      type === v ? typeColor[v] + '60' : '#e0e3f0',
                    color:            type === v ? typeColor[v] : '#7680a8',
                  }}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Descrição</label>
            <input value={desc} onChange={e => setDesc(e.target.value)} required
              placeholder="Ex: Ligar para apresentar proposta..."
              className="w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-text placeholder:text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Data</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-text-2 uppercase tracking-wider block mb-1.5">Hora</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded-xl px-3.5 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 transition-colors"
              />
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-muted border border-border hover:border-accent/30 transition-all">
              Cancelar
            </button>
            <button type="submit"
              className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] transition-all"
              style={{ background: '#6eda2c', boxShadow: '0 4px 12px #6eda2c35' }}>
              Salvar
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function ContatoDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [tab,  setTab]  = useState('Visão Geral')
  const [note, setNote] = useState('')
  const [notes, setNotes] = useState([
    { id: 1, text: 'Cliente muito interessado no pacote completo. Prefere reuniões às terças.', date: '2026-05-15', author: 'GS' },
  ])
  const [showModal, setShowModal] = useState(false)

  const lead = leads.find(l => l.id === Number(id))

  const [currentStage, setCurrentStage] = useState(lead?.stage ?? 'novo')
  const [localActs, setLocalActs] = useState([])

  if (!lead) return (
    <div className="p-8">
      <Link to="/contatos" className="text-sm text-muted hover:text-text-2 flex items-center gap-1">
        <ArrowLeft size={14} /> Contatos
      </Link>
      <p className="mt-8 text-muted">Contato não encontrado.</p>
    </div>
  )

  const stage      = stageMap[currentStage]
  const src        = sourceColors[lead.source] || { bg: '#8890b518', color: '#8890b5' }
  const leadActs   = [...activities.filter(a => a.leadId === lead.id), ...localActs]
  const stageIndex = PIPELINE_STAGES_ACQ.indexOf(currentStage)

  function advanceStage() {
    const next = PIPELINE_STAGES_ACQ[stageIndex + 1]
    if (next) setCurrentStage(next)
  }

  function addNote() {
    if (!note.trim()) return
    setNotes(prev => [...prev, { id: Date.now(), text: note.trim(), date: new Date().toISOString().split('T')[0], author: 'GS' }])
    setNote('')
  }

  function handleWhatsApp() {
    const phone = lead.phone.replace(/\D/g, '')
    window.open(`https://wa.me/55${phone}`, '_blank')
  }

  function handlePhone() {
    window.location.href = `tel:+55${lead.phone.replace(/\D/g, '')}`
  }

  function saveActivity(act) {
    setLocalActs(prev => [...prev, { id: Date.now(), leadId: lead.id, ...act }])
  }

  return (
    <div className="min-h-screen">
      <AnimatePresence>
        {showModal && (
          <NewActivityModal onSave={saveActivity} onClose={() => setShowModal(false)} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="bg-white border-b border-border sticky top-12 z-30"
        style={{ boxShadow: '0 1px 0 #e0e3f0' }}>
        <div className="px-8 py-4">
          <button onClick={() => navigate('/contatos')}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-text-2 font-medium transition-colors mb-4">
            <ArrowLeft size={14} /> Contatos
          </button>

          <div className="flex items-center gap-5">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-extrabold text-white flex-shrink-0"
              style={{ background: `linear-gradient(135deg, ${stage?.color ?? '#8890b5'}, ${stage?.color ?? '#8890b5'}80)`, boxShadow: `0 8px 24px ${stage?.color ?? '#8890b5'}35` }}
            >
              {lead.name[0]}
            </motion.div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-xl font-extrabold text-text">{lead.name}</h1>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg"
                  style={{ color: src.color, backgroundColor: src.bg }}>
                  {lead.source}
                </span>
                {lead.value > 0 && (
                  <span className="text-sm font-extrabold text-accent">{fmt(lead.value)}</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-sm text-muted font-mono">{lead.phone}</span>
                <span className="text-muted">·</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stage?.color }} />
                  <span className="text-sm text-text-2 font-medium">{stage?.label}</span>
                </div>
                <span className="text-muted">·</span>
                <span className="text-sm text-muted">
                  desde {new Date(lead.createdAt + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleWhatsApp}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: '#25d366', boxShadow: '0 4px 12px #25d36640' }}>
                <MessageSquare size={14} /> WhatsApp
              </button>
              <button onClick={handlePhone}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-semibold text-text-2 bg-white border border-border hover:border-accent/30 transition-all">
                <Phone size={14} /> Ligar
              </button>
              <button className="w-9 h-9 rounded-xl flex items-center justify-center text-muted hover:text-text-2 hover:bg-black/[0.04] border border-border transition-all">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-1 mt-4">
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  tab === t ? 'bg-accent/10 text-accent' : 'text-muted hover:text-text-2 hover:bg-surface-2'
                }`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {tab === 'Visão Geral' && (
          <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-8 grid grid-cols-3 gap-5">

            {/* Pipeline progress */}
            <div className="col-span-3 bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
              <p className="text-sm font-extrabold text-text mb-5">Jornada no Pipeline</p>
              <div className="flex items-center gap-0">
                {PIPELINE_STAGES_ACQ.map((sid, i) => {
                  const s        = stageMap[sid]
                  const isActive = sid === currentStage
                  const isPast   = i < stageIndex
                  const isLast   = i === PIPELINE_STAGES_ACQ.length - 1
                  return (
                    <div key={sid} className="flex items-center flex-1">
                      <div className="flex flex-col items-center flex-1">
                        <motion.div
                          animate={isActive ? { scale: [1, 1.08, 1] } : {}}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all"
                          style={{
                            backgroundColor: isActive ? s?.color : isPast ? s?.color + '30' : '#e0e3f0',
                            color:           isActive ? '#0f1117'  : isPast ? s?.color : '#8890b5',
                            boxShadow:       isActive ? `0 4px 14px ${s?.color}45` : 'none',
                          }}
                        >
                          {isPast ? '✓' : i + 1}
                        </motion.div>
                        <p className={`text-[10px] font-bold mt-1.5 text-center ${isActive ? 'text-text' : 'text-muted'}`}>
                          {s?.label}
                        </p>
                      </div>
                      {!isLast && (
                        <div className="h-0.5 flex-1 mx-1 rounded-full transition-all"
                          style={{ backgroundColor: isPast ? (s?.color + '50') : '#e0e3f0' }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Info */}
            <div className="bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
              <p className="text-sm font-extrabold text-text mb-4">Informações</p>
              <div className="space-y-3.5">
                {[
                  { icon: Phone,    label: 'Telefone',    value: lead.phone },
                  { icon: Tag,      label: 'Origem',      value: lead.source },
                  { icon: Calendar, label: 'Criado em',   value: new Date(lead.createdAt + 'T00:00:00').toLocaleDateString('pt-BR') },
                  { icon: Star,     label: 'Responsável', value: lead.assignee === 'GS' ? 'Gabriel S.' : 'João C.' },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#f2f4fb' }}>
                      <Icon size={13} className="text-muted" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] text-muted uppercase tracking-wider font-bold">{label}</p>
                      <p className="text-sm text-text font-medium truncate">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Negócio */}
            <div className="bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
              <p className="text-sm font-extrabold text-text mb-4">Negócio</p>
              <div className="text-center py-4">
                <p className="text-4xl font-black" style={{ color: lead.value > 0 ? '#6eda2c' : '#8890b5' }}>
                  {fmt(lead.value)}
                </p>
                <p className="text-xs text-muted uppercase tracking-wider mt-1">Valor estimado</p>
              </div>
              <div className="mt-2 p-3.5 rounded-xl" style={{ background: stage?.color + '10', border: `1px solid ${stage?.color}25` }}>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: stage?.color }} />
                  <span className="text-xs font-bold" style={{ color: stage?.color }}>{stage?.label}</span>
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {stageIndex < PIPELINE_STAGES_ACQ.length - 1 ? (
                  <button onClick={advanceStage}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-[#0f1117] transition-all"
                    style={{ background: '#6eda2c', boxShadow: '0 4px 12px #6eda2c35' }}>
                    <TrendingUp size={14} />
                    Avançar para {stageMap[PIPELINE_STAGES_ACQ[stageIndex + 1]]?.label}
                  </button>
                ) : (
                  <div className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-accent"
                    style={{ background: '#6eda2c15', border: '1px solid #6eda2c30' }}>
                    <CheckCircle2 size={14} /> Lead fechado 🎉
                  </div>
                )}
                <button onClick={() => setShowModal(true)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-text-2 border border-border hover:border-accent/30 transition-all">
                  <Calendar size={14} /> Agendar atividade
                </button>
              </div>
            </div>

            {/* Atividades */}
            <div className="bg-white rounded-2xl p-5"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-extrabold text-text">Atividades</p>
                <button onClick={() => setTab('Atividades')}
                  className="text-xs text-accent font-bold hover:text-accent-hover transition-colors flex items-center gap-0.5">
                  Ver todas <ChevronRight size={11} />
                </button>
              </div>
              {leadActs.length > 0 ? (
                <div className="space-y-2">
                  {leadActs.slice(0, 3).map(act => (
                    <div key={act.id} className="flex items-start gap-3 p-3 rounded-xl"
                      style={{ backgroundColor: typeColor[act.type] + '10' }}>
                      <span className="text-lg">{typeIcon[act.type]}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-text leading-snug">{act.description}</p>
                        <p className="text-[10px] text-muted mt-0.5">
                          {new Date(act.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')} às {act.time}
                        </p>
                      </div>
                      {act.done
                        ? <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                        : <Clock size={14} className="text-muted flex-shrink-0" />}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Circle size={28} className="text-border mx-auto mb-2" />
                  <p className="text-xs text-muted">Nenhuma atividade registrada</p>
                </div>
              )}
              <button onClick={() => setShowModal(true)}
                className="w-full mt-3 flex items-center justify-center gap-1.5 text-xs text-muted hover:text-accent py-2 rounded-xl hover:bg-accent/5 font-semibold transition-all">
                <Plus size={12} /> Nova atividade
              </button>
            </div>
          </motion.div>
        )}

        {tab === 'Atividades' && (
          <motion.div key="acts" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-8">
            <div className="max-w-2xl">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-extrabold text-text">Timeline de atividades</p>
                <button onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl text-[#0f1117] transition-all"
                  style={{ background: '#6eda2c' }}>
                  <Plus size={12} /> Nova atividade
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
                <div className="space-y-4">
                  {[
                    { icon: '📥', title: 'Lead capturado via ' + lead.source, date: lead.createdAt, color: '#8890b5' },
                    ...leadActs.map(a => ({ icon: typeIcon[a.type], title: a.description, date: a.dueDate, color: typeColor[a.type], done: a.done, time: a.time })),
                  ].map((item, i) => (
                    <motion.div key={i}
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                      className="flex items-start gap-4 relative">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 bg-white border border-border z-10"
                        style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.08)' }}>
                        {item.icon}
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-3.5 border border-border"
                        style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
                        <div className="flex items-start justify-between">
                          <p className="text-sm font-semibold text-text">{item.title}</p>
                          {'done' in item && (
                            item.done
                              ? <CheckCircle2 size={14} className="text-accent flex-shrink-0" />
                              : <Clock size={14} className="text-orange flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted mt-0.5">
                          {new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
                          {item.time ? ` às ${item.time}` : ''}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {tab === 'Anotações' && (
          <motion.div key="notes" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-8 max-w-2xl">
            <div className="bg-white rounded-2xl p-5 mb-4"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
              <textarea
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="Escreva uma anotação sobre este contato..."
                rows={3}
                className="w-full text-sm text-text placeholder:text-muted focus:outline-none resize-none bg-transparent"
              />
              <div className="flex justify-end mt-2 pt-2 border-t border-border">
                <button onClick={addNote}
                  className="text-xs font-bold px-4 py-2 rounded-xl text-[#0f1117] transition-all"
                  style={{ background: '#6eda2c', boxShadow: '0 2px 8px #6eda2c35' }}>
                  Salvar nota
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {notes.map(n => (
                <div key={n.id} className="bg-white rounded-xl p-4 border border-border">
                  <p className="text-sm text-text leading-relaxed">{n.text}</p>
                  <p className="text-[10px] text-muted mt-2">
                    {n.author} · {new Date(n.date + 'T00:00:00').toLocaleDateString('pt-BR')}
                  </p>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-sm text-muted text-center py-8">Nenhuma anotação ainda.</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
