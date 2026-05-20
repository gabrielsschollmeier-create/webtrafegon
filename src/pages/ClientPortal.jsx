import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogOut, Zap, Calendar, Package, CheckCircle2, Plus, X, Phone, TrendingUp, Users, DollarSign, Star, Trophy } from 'lucide-react'
import { erpClients, tasks, meetings, milestones, milestoneTypes, taskTypes, statusConfig } from '../data/erp-mock'
import { DEFAULT_PORTAL_MODULES } from '../data/users-store'

/* ── Gamificação de parceria ────────────────────────────────── */
const LEVELS = [
  { min: 0,   max: 3,   label: 'Iniciante',        icon: '🌱', color: '#8890b5', benefits: ['Acesso ao portal', 'Relatórios mensais', 'Suporte padrão'] },
  { min: 3,   max: 6,   label: 'Em Crescimento',   icon: '🚀', color: '#60a5fa', benefits: ['Relatórios quinzenais', 'Reuniões mensais', 'Prioridade no suporte'] },
  { min: 6,   max: 12,  label: 'Estabelecido',     icon: '⭐', color: '#ea8a29', benefits: ['Reuniões quinzenais', 'Análise de concorrência', 'Acesso ao CRM'] },
  { min: 12,  max: 24,  label: 'Parceiro',         icon: '🏆', color: '#6eda2c', benefits: ['Reuniões semanais', 'Playbook personalizado', 'Desconto de 5%', 'Consultoria mensal'] },
  { min: 24,  max: 36,  label: 'Parceiro Premium', icon: '💎', color: '#be29ec', benefits: ['Reuniões semanais', 'Desconto de 10%', 'WhatsApp direto com gerente', 'Relatório executivo'] },
  { min: 36,  max: 999, label: 'Parceiro Elite',   icon: '👑', color: '#f59e0b', benefits: ['Atendimento VIP', 'Desconto de 15%', 'Estratégia co-criada', 'Acesso a betas exclusivos'] },
]

function getClientLevel(sinceDate) {
  const since = new Date(sinceDate + 'T00:00:00')
  const months = Math.floor((Date.now() - since.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  const level = LEVELS.findIndex(l => months >= l.min && months < l.max)
  return { months, level: level >= 0 ? level : LEVELS.length - 1 }
}

function ClientLevelCard({ client }) {
  const { months, level: levelIdx } = getClientLevel(client.since)
  const level = LEVELS[levelIdx]
  const next  = LEVELS[levelIdx + 1]
  const pct   = next ? Math.round(((months - level.min) / (next.min - level.min)) * 100) : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
    >
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${level.color}, ${level.color}60)` }} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-1">Nível de Parceria</p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{level.icon}</span>
              <span className="text-lg font-black" style={{ color: level.color }}>{level.label}</span>
            </div>
            <p className="text-xs text-muted mt-1">{months} {months === 1 ? 'mês' : 'meses'} de parceria</p>
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
            style={{ background: level.color + '15' }}>
            {level.icon}
          </div>
        </div>

        {next && (
          <div className="mb-4">
            <div className="flex justify-between text-[10px] mb-1.5 font-bold">
              <span className="text-muted">{level.label}</span>
              <span style={{ color: next.color }}>{next.label} em {next.min - months} {next.min - months === 1 ? 'mês' : 'meses'}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: level.color + '20' }}>
              <motion.div className="h-full rounded-full" style={{ background: level.color }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1, ease: [0.22,1,0.36,1] }} />
            </div>
          </div>
        )}

        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-2">Benefícios ativos</p>
          <div className="grid grid-cols-2 gap-1.5">
            {level.benefits.map(b => (
              <div key={b} className="flex items-center gap-1.5 text-xs text-text font-medium">
                <CheckCircle2 size={11} style={{ color: level.color, flexShrink: 0 }} />
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const MONTH_WIDTH = 180
const CENTER_Y    = 120

/* ── Timeline (Projeto) ─────────────────────────────────── */
function TimelineView({ clientMilestones }) {
  const [view, setView] = useState('semestral')
  const today = new Date()

  const startDate = useMemo(() => {
    if (view === 'anual') return new Date(today.getFullYear(), 0, 1)
    return new Date(today.getFullYear(), today.getMonth() - 2, 1)
  }, [view])

  const totalMonths = view === 'anual' ? 12 : 6

  const months = useMemo(() =>
    Array.from({ length: totalMonths }, (_, i) =>
      new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
    ), [startDate, totalMonths])

  const endDate = useMemo(() => {
    const d = new Date(months[months.length - 1])
    d.setMonth(d.getMonth() + 1)
    return d
  }, [months])

  function dateToX(dateStr) {
    const d = new Date(dateStr + 'T00:00:00')
    const monthIdx = (d.getFullYear() - startDate.getFullYear()) * 12 + d.getMonth() - startDate.getMonth()
    const dayFrac  = (d.getDate() - 1) / 31
    return Math.max(20, monthIdx * MONTH_WIDTH + dayFrac * MONTH_WIDTH + 20)
  }

  const visible = useMemo(() =>
    clientMilestones
      .filter(m => { const d = new Date(m.date + 'T00:00:00'); return d >= startDate && d < endDate })
      .sort((a, b) => a.date.localeCompare(b.date))
  , [clientMilestones, startDate, endDate])

  const totalWidth = totalMonths * MONTH_WIDTH
  const todayStr   = today.toISOString().split('T')[0]
  const todayX     = dateToX(todayStr)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-extrabold text-text">Linha do tempo do projeto</p>
          <div className="flex items-center gap-3 mt-1.5">
            {Object.entries(milestoneTypes).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
                <span className="text-[10px] text-muted">{cfg.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl">
          {[['semestral', 'Semestral'], ['anual', 'Anual']].map(([v, label]) => (
            <button key={v} onClick={() => setView(v)}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                view === v ? 'bg-white text-text shadow-sm' : 'text-muted hover:text-text-2'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl" style={{ background: '#f8f9fc', border: '1px solid #e8eaf2' }}>
        <div style={{ width: Math.max(totalWidth, 500), height: 280, position: 'relative' }}>
          {months.map((month, i) => (
            <div key={i} style={{ position: 'absolute', left: i * MONTH_WIDTH, top: 0, bottom: 0, width: MONTH_WIDTH }}>
              {i > 0 && <div style={{ position: 'absolute', left: 0, top: 16, bottom: 28, width: 1, backgroundColor: '#e0e3f0' }} />}
              <p style={{ position: 'absolute', bottom: 8, left: 0, width: MONTH_WIDTH, textAlign: 'center' }}
                className="text-[10px] font-semibold text-muted uppercase tracking-wide">
                {month.toLocaleDateString('pt-BR', { month: 'short' })}
                {(month.getMonth() === 0 || view === 'anual') ? ` ${month.getFullYear()}` : ''}
              </p>
            </div>
          ))}
          <div style={{ position: 'absolute', left: 0, right: 0, top: CENTER_Y, height: 2, backgroundColor: '#e0e3f0' }} />
          {todayX >= 0 && todayX <= totalWidth && (
            <div style={{ position: 'absolute', left: todayX, top: CENTER_Y - 65, height: 85, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span className="text-[9px] font-extrabold text-accent mb-1 whitespace-nowrap">HOJE</span>
              <div style={{ flex: 1, width: 2, backgroundColor: '#6eda2c', opacity: 0.7 }} />
              <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#6eda2c' }} />
            </div>
          )}
          {visible.map((m, i) => {
            const x   = dateToX(m.date)
            const cfg = milestoneTypes[m.type] || { icon: '📌', color: '#8890b5', label: 'Marco' }
            const above = i % 2 === 0
            return (
              <div key={m.id} style={{ position: 'absolute', left: x }}>
                <div style={{ position: 'absolute', top: CENTER_Y - 8, left: -8, width: 16, height: 16, borderRadius: '50%', backgroundColor: cfg.color, border: '3px solid white', boxShadow: `0 0 0 2px ${cfg.color}40`, zIndex: 2 }} />
                <div style={{ position: 'absolute', left: 0, width: 1, backgroundColor: cfg.color + '60', ...(above ? { top: CENTER_Y - 70, height: 62 } : { top: CENTER_Y + 8, height: 50 }) }} />
                <div style={{ position: 'absolute', left: -60, width: 120, zIndex: 1, ...(above ? { top: CENTER_Y - 74 } : { top: CENTER_Y + 22 }), backgroundColor: 'white', borderRadius: 12, padding: '7px 10px', boxShadow: '0 2px 8px rgba(26,29,46,0.10), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <p className="text-[10px] font-extrabold" style={{ color: cfg.color }}>{cfg.icon} {cfg.label}</p>
                  <p className="text-[11px] font-semibold text-text mt-0.5 line-clamp-2 leading-snug">{m.title}</p>
                  <p className="text-[9px] text-muted mt-1">
                    {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              </div>
            )
          })}
          {visible.length === 0 && (
            <div style={{ position: 'absolute', top: CENTER_Y - 10, left: 0, right: 0 }} className="text-center">
              <p className="text-xs text-muted">Nenhum marco neste período</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/* ── CRM do cliente (mini) ──────────────────────────────── */
const CRM_STAGES = [
  { id: 'novo',      label: 'Novo Lead',       color: '#8890b5' },
  { id: 'contato',   label: 'Em Contato',      color: '#60a5fa' },
  { id: 'proposta',  label: 'Proposta Enviada', color: '#ea8a29' },
  { id: 'fechado',   label: 'Fechado',          color: '#6eda2c' },
]

const CRM_SOURCES = ['WhatsApp', 'Indicação', 'Instagram', 'Google', 'Site', 'Outro']
const fmt = v => v > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v) : '—'

function getClientLeads(clientId) {
  try { return JSON.parse(localStorage.getItem(`crm_${clientId}`)) || [] } catch { return [] }
}
function saveClientLeads(clientId, leads) {
  try { localStorage.setItem(`crm_${clientId}`, JSON.stringify(leads)) } catch {}
}

function NewLeadModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', phone: '', source: 'WhatsApp', stage: 'novo', value: 0 })
  function handleSubmit() {
    if (!form.name.trim()) return
    onCreate({ ...form, id: Date.now(), createdAt: new Date().toISOString().split('T')[0] })
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-sm"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-extrabold text-text">Novo Lead</p>
          <button onClick={onClose} className="w-7 h-7 rounded-xl flex items-center justify-center text-muted hover:bg-black/[0.04]"><X size={14} /></button>
        </div>
        <div className="p-5 space-y-3">
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Nome *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="Nome do lead" autoFocus
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50" />
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Telefone</label>
            <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
              placeholder="+55 47 9 9999-0000"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Origem</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50 cursor-pointer">
                {CRM_SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Valor (R$)</label>
              <input type="number" min="0" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Etapa</label>
            <div className="flex gap-1.5 flex-wrap">
              {CRM_STAGES.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, stage: s.id }))}
                  className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all"
                  style={{ backgroundColor: form.stage === s.id ? s.color + '22' : 'transparent', borderColor: form.stage === s.id ? s.color + '70' : '#e0e3f0', color: form.stage === s.id ? s.color : '#8890b5' }}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2 hover:bg-border transition-colors">Cancelar</button>
          <button onClick={handleSubmit} disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] disabled:opacity-40"
            style={{ background: '#6eda2c' }}>
            Criar Lead
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function ClientCRM({ clientId, clientColor }) {
  const [leads,       setLeads]       = useState(() => getClientLeads(clientId))
  const [showNew,     setShowNew]     = useState(false)
  const [activeStage, setActiveStage] = useState('all')

  function addLead(lead) {
    const next = [...leads, lead]
    setLeads(next)
    saveClientLeads(clientId, next)
  }

  function moveStage(leadId, stageId) {
    const next = leads.map(l => l.id === leadId ? { ...l, stage: stageId } : l)
    setLeads(next)
    saveClientLeads(clientId, next)
  }

  function removeLead(leadId) {
    const next = leads.filter(l => l.id !== leadId)
    setLeads(next)
    saveClientLeads(clientId, next)
  }

  const totalValue  = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const closedLeads = leads.filter(l => l.stage === 'fechado')
  const closedValue = closedLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)

  const visibleLeads = activeStage === 'all' ? leads : leads.filter(l => l.stage === activeStage)

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total de leads',     value: leads.length,         color: '#60a5fa', icon: Users },
          { label: 'Fechamentos',        value: closedLeads.length,   color: '#6eda2c', icon: CheckCircle2 },
          { label: 'Valor em pipeline',  value: fmt(totalValue),      color: '#be29ec', icon: DollarSign },
          { label: 'Receita fechada',    value: fmt(closedValue),     color: clientColor, icon: TrendingUp },
        ].map((s, i) => (
          <motion.div key={s.label}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}60)` }} />
            <div className="p-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5"
                style={{ backgroundColor: s.color + '18' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Stage filter + Add */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-border">
          <button onClick={() => setActiveStage('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeStage === 'all' ? 'bg-text text-white' : 'text-muted hover:text-text-2'}`}>
            Todos ({leads.length})
          </button>
          {CRM_STAGES.map(s => (
            <button key={s.id} onClick={() => setActiveStage(s.id)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all border"
              style={{
                backgroundColor: activeStage === s.id ? s.color : 'transparent',
                color:           activeStage === s.id ? '#fff'   : s.color,
                borderColor:     activeStage === s.id ? s.color  : s.color + '40',
              }}>
              {s.label} ({leads.filter(l => l.stage === s.id).length})
            </button>
          ))}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 text-sm font-extrabold px-3 py-2 rounded-xl text-[#0f1117]"
          style={{ background: '#6eda2c', boxShadow: '0 4px 14px #6eda2c30' }}>
          <Plus size={14} /> Novo lead
        </motion.button>
      </div>

      {/* Leads list */}
      {visibleLeads.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
          <p className="text-4xl mb-3">🎯</p>
          <p className="text-sm font-bold text-text">Nenhum lead ainda</p>
          <p className="text-xs text-muted mt-1">Clique em "Novo lead" para começar seu pipeline</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                {['Nome', 'Telefone', 'Origem', 'Etapa', 'Valor', ''].map((col, i) => (
                  <th key={i} className="text-left text-[10px] font-bold text-muted uppercase tracking-wider px-5 py-3">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {visibleLeads.map(lead => {
                  const stage = CRM_STAGES.find(s => s.id === lead.stage)
                  return (
                    <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="border-b border-border/40 hover:bg-black/[0.02] transition-colors group">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ backgroundColor: clientColor }}>
                            {lead.name[0]}
                          </div>
                          <span className="text-sm font-semibold text-text">{lead.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          {lead.phone && <a href={`tel:${lead.phone}`} className="text-xs font-mono text-muted hover:text-accent transition-colors flex items-center gap-1">
                            <Phone size={10} />{lead.phone}
                          </a>}
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-surface-2 text-muted">{lead.source}</span>
                      </td>
                      <td className="px-5 py-3">
                        <select value={lead.stage} onChange={e => moveStage(lead.id, e.target.value)}
                          className="text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none transition-all"
                          style={{ color: stage?.color, backgroundColor: stage?.color + '12', borderColor: stage?.color + '40' }}
                          onClick={e => e.stopPropagation()}>
                          {CRM_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-semibold ${lead.value > 0 ? 'text-accent' : 'text-muted'}`}>
                          {fmt(Number(lead.value) || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => removeLead(lead.id)}
                          className="opacity-0 group-hover:opacity-100 w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-all">
                          <X size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showNew && <NewLeadModal onClose={() => setShowNew(false)} onCreate={addLead} />}
      </AnimatePresence>
    </div>
  )
}

/* ── Portal principal ───────────────────────────────────── */
const MODULES = [
  { id: 'projeto', label: 'Projeto',     icon: '🏗️' },
  { id: 'crm',     label: 'CRM',         icon: '📊' },
]

export default function ClientPortal({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('projeto')
  const portalModules  = { ...DEFAULT_PORTAL_MODULES, ...(user.portalModules ?? {}) }
  const client         = erpClients.find(c => c.id === user.clientId)
  const clientTasks    = tasks.filter(t => t.clientId === user.clientId)
  const clientMeetings = meetings.filter(m => m.clientId === user.clientId)
  const clientMilestones = milestones.filter(m => m.clientId === user.clientId)

  const done       = clientTasks.filter(t => t.status === 'done').length
  const inProgress = clientTasks.filter(t => t.status === 'doing' || t.status === 'review').length
  const pct        = clientTasks.length > 0 ? Math.round((done / clientTasks.length) * 100) : 0
  const today      = new Date().toISOString().split('T')[0]
  const upcoming   = clientMeetings.filter(m => m.date >= today)

  if (!client) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#edf0f7' }}>
      <p className="text-muted">Workspace não encontrado. Entre em contato com a agência.</p>
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: '#edf0f7' }}>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-white z-40 flex items-center px-8 justify-between"
        style={{ boxShadow: '0 1px 0 #e0e3f0', height: 56 }}>
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <Zap size={15} className="text-accent" fill="currentColor" />
            <span className="text-sm font-extrabold text-text">TráfegOn</span>
          </div>
          <div className="w-px h-5 bg-border" />
          {/* Client */}
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ backgroundColor: client.color }}>
              {client.name[0]}
            </div>
            <p className="text-sm font-bold text-text">{client.name}</p>
          </div>
          <div className="w-px h-5 bg-border" />
          {/* Module switcher */}
          <div className="flex items-center gap-1">
            {MODULES.map(m => (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                style={{
                  backgroundColor: activeModule === m.id ? client.color + '15' : 'transparent',
                  color:           activeModule === m.id ? client.color         : '#8890b5',
                  border: `1px solid ${activeModule === m.id ? client.color + '40' : 'transparent'}`,
                }}>
                {m.icon} {m.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full"
            style={{ backgroundColor: '#be29ec12', color: '#be29ec' }}>
            Portal do Cliente
          </span>
          <button onClick={onLogout}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors font-medium">
            <LogOut size={14} /> Sair
          </button>
        </div>
      </div>

      <div className="pt-14">
        <AnimatePresence mode="wait">
          {/* ── MÓDULO PROJETO ── */}
          {activeModule === 'projeto' && (
            <motion.div key="projeto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8 max-w-6xl mx-auto">
              <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
                <h1 className="text-xl font-extrabold text-text">Projeto — {client.name}</h1>
                <p className="text-sm text-muted mt-0.5">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </motion.div>

              {/* Stats */}
              {portalModules.indicadores && (
                <div className="grid grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Em andamento',    value: inProgress,              color: '#60a5fa', icon: Package },
                    { label: 'Concluídos',      value: done,                    color: '#6eda2c', icon: CheckCircle2 },
                    { label: 'Conclusão geral', value: `${pct}%`,               color: client.color, icon: Zap },
                    { label: 'Próx. reunião',   value: upcoming[0]?.time ?? '—', color: '#8890b5', icon: Calendar },
                  ].map((s, i) => (
                    <motion.div key={s.label}
                      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-2xl overflow-hidden"
                      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                      <div className="h-1" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}60)` }} />
                      <div className="p-4">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3"
                          style={{ backgroundColor: s.color + '18' }}>
                          <s.icon size={16} style={{ color: s.color }} />
                        </div>
                        <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{s.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Gamificação + Entregáveis/Reuniões */}
              {(portalModules.entregaveis || portalModules.reunioes) && (
                <div className={`grid gap-5 mb-6 ${portalModules.entregaveis && portalModules.reunioes ? 'grid-cols-3' : 'grid-cols-1'}`}>
                  {portalModules.entregaveis && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                      className={`${portalModules.reunioes ? 'col-span-2' : ''} bg-white rounded-2xl p-5`}
                      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                      <p className="text-sm font-extrabold text-text mb-4">Entregáveis em andamento</p>
                      <div className="space-y-2">
                        {clientTasks.filter(t => t.status !== 'done').length > 0 ? (
                          clientTasks.filter(t => t.status !== 'done').map(task => {
                            const type   = taskTypes[task.type]
                            const status = statusConfig[task.status]
                            const overdue = new Date(task.dueDate) < new Date()
                            return (
                              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                  style={{ backgroundColor: type.color + '18' }}>
                                  {type.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-semibold text-text truncate">{task.title}</p>
                                  <p className="text-[10px] mt-0.5">
                                    <span className="text-muted">Prazo: </span>
                                    <span className={overdue ? 'text-danger font-bold' : 'text-muted'}>
                                      {new Date(task.dueDate + 'T00:00:00').toLocaleDateString('pt-BR')}
                                      {overdue ? ' · Atrasado' : ''}
                                    </span>
                                  </p>
                                </div>
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0"
                                  style={{ color: status.color, backgroundColor: status.color + '18' }}>
                                  {status.label}
                                </span>
                              </div>
                            )
                          })
                        ) : (
                          <div className="text-center py-8">
                            <CheckCircle2 size={28} className="text-accent mx-auto mb-2" />
                            <p className="text-sm font-bold text-text">Tudo entregue!</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}

                  {portalModules.reunioes && (
                    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                      className="bg-white rounded-2xl p-5"
                      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                      <p className="text-sm font-extrabold text-text mb-4">Próximas reuniões</p>
                      {upcoming.length > 0 ? (
                        <div className="space-y-3">
                          {upcoming.map(m => (
                            <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl"
                              style={{ backgroundColor: '#8890b512', border: '1px solid #8890b520' }}>
                              <div className="text-xl flex-shrink-0">📅</div>
                              <div className="min-w-0">
                                <p className="text-xs font-bold text-text">{m.title}</p>
                                <p className="text-[10px] text-muted mt-0.5">
                                  {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} · {m.time}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Calendar size={24} className="text-muted mx-auto mb-2" />
                          <p className="text-xs text-muted">Nenhuma reunião agendada.</p>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              )}

              {/* Nível de parceria */}
              <div className="mb-6">
                <ClientLevelCard client={client} />
              </div>

              {portalModules.timeline && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-white rounded-2xl p-5"
                  style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
                  <TimelineView clientMilestones={clientMilestones} />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── MÓDULO CRM ── */}
          {activeModule === 'crm' && (
            <motion.div key="crm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-8 max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-xl font-extrabold text-text">CRM — {client.name}</h1>
                <p className="text-sm text-muted mt-0.5">Gerencie seus próprios leads e pipeline de vendas</p>
              </div>
              <ClientCRM clientId={user.clientId} clientColor={client.color} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
