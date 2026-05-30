import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Users, DollarSign, Activity, ArrowUpRight, ArrowDownRight, ChevronRight, Zap, Target, CheckCircle2, Circle } from 'lucide-react'
import { userStats } from '../data/mock'
import { useData } from '../contexts/DataContext'

const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

/* ── Contador animado ─────────────────────────── */
function AnimatedNumber({ value, prefix = '', suffix = '' }) {
  const [display, setDisplay] = useState(0)
  const frame = useRef(null)
  useEffect(() => {
    const target = parseFloat(String(value).replace(/\D/g, '')) || 0
    const start = performance.now()
    const duration = 900
    const run = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(Math.round(eased * target))
      if (p < 1) frame.current = requestAnimationFrame(run)
    }
    frame.current = requestAnimationFrame(run)
    return () => cancelAnimationFrame(frame.current)
  }, [value])
  return <>{prefix}{display.toLocaleString('pt-BR')}{suffix}</>
}

/* ── KPI Card — número colorido, barra de topo ── */
function KpiCard({ icon: Icon, label, value, rawValue, prefix = '', suffix = '', change, positive, accent, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="bg-white rounded-2xl overflow-hidden cursor-default"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      {/* Barra de cor no topo */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80)` }} />

      <div className="p-5">
        <div className="flex items-start justify-between mb-4">
          <motion.div
            whileHover={{ scale: 1.08, rotate: 4 }}
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: accent + '18' }}
          >
            <Icon size={18} style={{ color: accent }} />
          </motion.div>
          {change && (
            <span
              className="flex items-center gap-0.5 text-[11px] font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: positive ? '#6eda2c18' : '#ef444418',
                color: positive ? '#6eda2c' : '#ef4444',
              }}
            >
              {positive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
              {change}
            </span>
          )}
        </div>

        <p className="text-3xl font-black tracking-tight leading-none mb-1.5" style={{ color: accent }}>
          {prefix}<AnimatedNumber value={rawValue} />{suffix}
        </p>
        <p className="text-[11px] font-bold text-muted uppercase tracking-widest">{label}</p>
      </div>
    </motion.div>
  )
}

/* ── Funil rápido (só pipeline Aquisição) ─────── */
function QuickFunnel() {
  const { leads, stages } = useData()
  const acqStages = stages.filter(s => s.pipelineId === 1)
  const acqLeads = leads.filter(l => l.pipelineId === 1)
  const total = acqLeads.length || 1

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm font-bold text-text">Funil de Aquisição</p>
        <span className="text-[10px] font-bold text-muted bg-surface-2 px-2 py-0.5 rounded-full uppercase tracking-wider">
          {acqLeads.length} leads
        </span>
      </div>
      <div className="space-y-3">
        {acqStages.map((stage, i) => {
          const count = acqLeads.filter(l => l.stage === stage.id).length
          const pct = Math.round((count / total) * 100)
          const prevCount = i > 0 ? acqLeads.filter(l => l.stage === acqStages[i - 1].id).length : count
          const conv = prevCount > 0 ? Math.round((count / prevCount) * 100) : 100
          return (
            <div key={stage.id}>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: stage.color }} />
                  <span className="text-text-2 font-semibold">{stage.label}</span>
                </div>
                <div className="flex items-center gap-3">
                  {i > 0 && <span className="text-muted text-[10px]">↓{conv}%</span>}
                  <span className="font-extrabold text-sm" style={{ color: stage.color }}>{count}</span>
                </div>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: stage.color + '18' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ backgroundColor: stage.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.7 }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Leads recentes ───────────────────────────── */
function RecentLeads() {
  const { leads, stages } = useData()
  const navigate = useNavigate()
  const recent = [...leads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)
  const stageMap = Object.fromEntries(stages.map(s => [s.id, s]))

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.4 }}
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-text">Leads recentes</p>
        <button onClick={() => navigate('/contatos')} className="text-xs text-accent hover:text-accent-hover flex items-center gap-0.5 font-bold transition-colors">
          Ver todos <ChevronRight size={12} />
        </button>
      </div>
      <div className="space-y-1">
        {recent.map((lead, i) => {
          const stage = stageMap[lead.stage]
          return (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.06 }}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 py-2.5 rounded-xl px-2.5 -mx-2.5 hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ backgroundColor: stage?.color + '18', color: stage?.color }}
              >
                {lead.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text font-semibold truncate">{lead.name}</p>
                <p className="text-[11px] text-muted">{lead.source}</p>
              </div>
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold flex-shrink-0"
                style={{ backgroundColor: stage?.color + '18', color: stage?.color }}
              >
                {stage?.label}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Atividades pendentes ─────────────────────── */
function ActivitiesCard() {
  const { activities, leads } = useData()
  const pending = activities.filter(a => !a.done).slice(0, 4)
  const leadMap = Object.fromEntries(leads.map(l => [l.id, l]))
  const typeColor = { call: '#6eda2c', meeting: '#be29ec', follow: '#ea8a29' }
  const typeLabel = { call: 'Ligação', meeting: 'Reunião', follow: 'Follow-up' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-bold text-text">Atividades pendentes</p>
        <motion.span
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
          style={{ backgroundColor: '#ea8a2918', color: '#ea8a29' }}
        >
          {pending.length} hoje
        </motion.span>
      </div>
      <div className="space-y-1">
        {pending.map((act, i) => {
          const lead = leadMap[act.leadId]
          const color = typeColor[act.type]
          return (
            <motion.div
              key={act.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 + i * 0.07 }}
              whileHover={{ x: 3 }}
              className="flex items-center gap-3 py-2.5 rounded-xl px-2.5 -mx-2.5 hover:bg-surface-2 cursor-pointer transition-colors"
            >
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: color + '18' }}
              >
                <motion.div
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-text font-semibold truncate">{act.description}</p>
                <p className="text-[11px] text-muted">{lead?.name}</p>
              </div>
              <span
                className="text-[10px] font-bold flex-shrink-0 px-2 py-0.5 rounded-full"
                style={{ backgroundColor: color + '18', color }}
              >
                {typeLabel[act.type]}
              </span>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}

/* ── Nível & XP ───────────────────────────────── */
function LevelCard() {
  const { level, rank, xp, xpToNext, streak, achievements } = userStats
  const pct = Math.round((xp / xpToNext) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, duration: 0.4 }}
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="flex items-center gap-3 mb-5">
        <motion.div
          animate={{ rotate: [0, -5, 5, -5, 0] }}
          transition={{ delay: 1, duration: 0.5, repeat: Infinity, repeatDelay: 4 }}
          className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl"
          style={{ background: 'linear-gradient(135deg, #6eda2c18, #be29ec18)' }}
        >
          🏅
        </motion.div>
        <div>
          <p className="text-base font-extrabold text-text">{rank}</p>
          <p className="text-xs text-muted">{rank} · {xp.toLocaleString('pt-BR')} ons</p>
        </div>
        <div
          className="ml-auto flex items-center gap-1.5 rounded-xl px-3 py-1.5"
          style={{ background: '#ea8a2912', border: '1px solid #ea8a2928' }}
        >
          <motion.span
            animate={{ scale: [1, 1.15, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5 }}
          >🔥</motion.span>
          <span className="text-sm font-extrabold" style={{ color: '#ea8a29' }}>{streak}</span>
          <span className="text-xs text-muted">dias</span>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-5">
        <div className="flex justify-between text-xs mb-2">
          <span className="text-muted font-medium">Progresso para Nível {level + 1}</span>
          <span className="font-extrabold text-accent">{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e3f0' }}>
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ background: 'linear-gradient(90deg, #6eda2c, #be29ec)' }}
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ delay: 0.6, duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 shimmer" />
          </motion.div>
        </div>
        <p className="text-[10px] text-muted mt-1 text-right">{xp.toLocaleString('pt-BR')} / {xpToNext.toLocaleString('pt-BR')} ons</p>
      </div>

      {/* Como ganhar ons */}
      <div className="mb-5 p-3.5 rounded-xl" style={{ background: '#f7f8fc', border: '1px solid #e0e3f0' }}>
        <p className="text-[10px] font-extrabold text-text-2 uppercase tracking-widest mb-2.5">Como ganhar ons</p>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { icon: '🤝', label: 'Fechar negócio',       xp: '+200 ons', color: '#6eda2c' },
            { icon: '📦', label: 'Entregar tarefa',       xp: '+100 ons', color: '#60a5fa' },
            { icon: '✅', label: 'Concluir atividade',    xp: '+50 ons',  color: '#be29ec' },
            { icon: '🔥', label: 'Streak 7 dias',         xp: '+300 ons', color: '#ea8a29' },
            { icon: '🖥️', label: 'Entregar landing page', xp: '+150 ons', color: '#6eda2c' },
            { icon: '🎨', label: 'Entregar criativo',     xp: '+80 ons',  color: '#be29ec' },
          ].map(r => (
            <div key={r.label} className="flex items-center gap-2 px-2 py-1.5 rounded-lg" style={{ background: r.color + '0d' }}>
              <span className="text-sm flex-shrink-0">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-text-2 truncate">{r.label}</p>
              </div>
              <span className="text-[10px] font-extrabold flex-shrink-0" style={{ color: r.color }}>{r.xp}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <p className="text-[11px] font-extrabold text-text-2 uppercase tracking-widest mb-3">Conquistas</p>
      <div className="grid grid-cols-3 gap-2">
        {achievements.map((ach, i) => (
          <motion.div
            key={ach.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + i * 0.06 }}
            whileHover={ach.earned ? { scale: 1.05, y: -2 } : {}}
            className="flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all cursor-default"
            style={{
              background: ach.earned ? '#6eda2c10' : '#f2f4fb',
              border: `1px solid ${ach.earned ? '#6eda2c25' : '#e0e3f0'}`,
              opacity: ach.earned ? 1 : 0.45,
            }}
            title={ach.desc}
          >
            <span className="text-xl">{ach.earned ? ach.icon : '🔒'}</span>
            <span className="text-[10px] font-semibold text-center leading-tight text-text-2">{ach.name}</span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

/* ── Metas do dia ─────────────────────────────── */
function GoalsCard() {
  const { dailyGoal, weeklyDeals } = userStats
  const dailyPct = Math.round((dailyGoal.contacted / dailyGoal.target) * 100)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.4 }}
      className="bg-white rounded-2xl p-5 flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#6eda2c18' }}>
          <Target size={14} className="text-accent" />
        </div>
        <p className="text-sm font-bold text-text">Metas do dia</p>
      </div>

      {/* Meta diária */}
      <div className="mb-5">
        <div className="flex justify-between items-end mb-2">
          <div>
            <p className="text-xs font-bold text-text-2">Contatos hoje</p>
            <p className="text-[11px] text-muted mt-0.5">{dailyGoal.contacted} de {dailyGoal.target} feitos</p>
          </div>
          <span className="text-2xl font-black" style={{ color: dailyPct >= 100 ? '#6eda2c' : '#111827' }}>
            {dailyPct}%
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: '#e0e3f0' }}>
          <motion.div
            className="h-full rounded-full relative overflow-hidden"
            style={{ backgroundColor: '#6eda2c' }}
            initial={{ width: 0 }}
            animate={{ width: `${dailyPct}%` }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 shimmer" />
          </motion.div>
        </div>
        <div className="flex justify-between mt-2">
          {Array.from({ length: dailyGoal.target }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 + i * 0.05 }}
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: i < dailyGoal.contacted ? '#6eda2c' : '#e0e3f0' }}
            />
          ))}
        </div>
      </div>

      {/* Fechamentos semanais */}
      <div className="pt-4 border-t border-border mb-5">
        <p className="text-xs font-bold text-text-2 mb-2">Fechamentos na semana</p>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted">{weeklyDeals.done} de {weeklyDeals.target} meta</p>
          <div className="flex gap-1.5">
            {Array.from({ length: weeklyDeals.target }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 + i * 0.08 }}
                className="w-6 h-6 rounded-lg flex items-center justify-center text-xs"
                style={{
                  backgroundColor: i < weeklyDeals.done ? '#6eda2c20' : '#f2f4fb',
                  border: `1px solid ${i < weeklyDeals.done ? '#6eda2c40' : '#e0e3f0'}`,
                  color: i < weeklyDeals.done ? '#6eda2c' : '#8890b5',
                }}
              >
                {i < weeklyDeals.done ? <CheckCircle2 size={13} /> : <Circle size={13} />}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Missão */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="mt-auto p-3.5 rounded-xl"
        style={{ background: 'linear-gradient(135deg, #6eda2c12, #be29ec12)', border: '1px solid #6eda2c20' }}
      >
        <p className="text-xs font-extrabold text-accent flex items-center gap-1.5">
          <Zap size={11} fill="currentColor" />
          Missão TráfegOn
        </p>
        <p className="text-[11px] text-text-2 mt-1 leading-relaxed">
          Feche mais <strong className="text-accent">{weeklyDeals.target - weeklyDeals.done} deals</strong> para alcançar Gold Closer 🏆
        </p>
      </motion.div>
    </motion.div>
  )
}

/* ── Barra de saúde dos clientes ─────────────── */
function ClientHealthBar({ erpClients }) {
  const active  = erpClients.filter(c => c.status === 'active')
  const atRisk  = erpClients.filter(c => c.status === 'at_risk')
  const mrr     = erpClients.reduce((s, c) => s + (c.monthlyValue || 0), 0)
  const mrrGoal = 25000

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.02 }}
      className="bg-white rounded-2xl p-5 mb-4"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* MRR principal */}
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-0.5">Faturamento Recorrente Mensal</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-black text-text">{fmt(mrr)}</p>
              <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <ArrowUpRight size={10} /> +4%
              </span>
            </div>
            <p className="text-xs text-muted mt-0.5">Meta mensal: {fmt(mrrGoal)}</p>
          </div>
        </div>

        {/* Divisor */}
        <div className="hidden sm:block w-px h-12 bg-border" />

        {/* Stats rápidos */}
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-2xl font-extrabold text-accent">{active.length}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Clientes Ativos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#ef4444]">{atRisk.length}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Em Risco</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-extrabold text-[#ea8a29]">{fmt(mrr / (erpClients.length || 1))}</p>
            <p className="text-[10px] font-bold text-muted uppercase tracking-wider">Ticket Médio</p>
          </div>
        </div>

        {/* Barra meta */}
        <div className="hidden lg:block w-48">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted font-medium">Meta {new Date().toLocaleDateString('pt-BR',{month:'short'})}</span>
            <span className="font-extrabold text-accent">{Math.round((mrr/mrrGoal)*100)}%</span>
          </div>
          <div className="h-2.5 rounded-full overflow-hidden bg-border">
            <motion.div className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #6eda2c, #be29ec)' }}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((mrr/mrrGoal)*100, 100)}%` }}
              transition={{ delay: 0.4, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-muted mt-1">
            <span>{fmt(mrr)}</span><span>{fmt(mrrGoal)}</span>
          </div>
        </div>
      </div>

      {/* Clientes em risco */}
      {atRisk.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-bold text-[#ef4444] uppercase tracking-wider">⚠️ Em risco:</span>
          {atRisk.map(c => (
            <span key={c.id} className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
              style={{ backgroundColor: c.color + '18', color: c.color }}>
              {c.name} · {fmt(c.monthlyValue)}/mês
            </span>
          ))}
        </div>
      )}
    </motion.div>
  )
}

/* ── Dashboard ────────────────────────────────── */
export default function Dashboard() {
  const { leads, activities, erpClients } = useData()
  const now          = new Date()
  const thisMonth    = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`
  const totalLeads   = leads.length
  const wonLeads       = leads.filter(l => l.stage === 'ganho')
  const lostLeads      = leads.filter(l => l.stage === 'perdido')
  const wonUnico       = wonLeads.filter(l => l.valueType !== 'recorrente')
  const wonRecorrente  = wonLeads.filter(l => l.valueType === 'recorrente')
  const wonValue       = wonLeads.reduce((s, l) => s + l.value, 0)
  const faturamentoUnico = wonUnico.reduce((s, l) => s + l.value, 0)
  const mrrAdquirido   = wonRecorrente.reduce((s, l) => s + l.value, 0)
  const pipelineLeads  = leads.filter(l => !['ganho','perdido'].includes(l.stage))
  const pipelineValue  = pipelineLeads.reduce((s, l) => s + l.value, 0)
  const newLeadsMonth  = leads.filter(l => l.createdAt?.startsWith(thisMonth)).length
  const wonMonth       = wonLeads.filter(l => l.createdAt?.startsWith(thisMonth))
  const pendingActs    = activities.filter(a => !a.done).length
  const mrr            = erpClients.reduce((s, c) => s + (c.monthlyValue || 0), 0)
  const ticketMedio    = erpClients.length > 0 ? Math.round(mrr / erpClients.length) : 0
  const convRate       = totalLeads > 0 ? Math.round((wonLeads.length / totalLeads) * 100) : 0

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="mb-4 lg:mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-text">Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </p>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl flex-shrink-0"
          style={{ background: '#12141e', border: '1px solid rgba(110,218,44,0.25)' }}>
          <Zap size={13} className="text-accent" fill="currentColor" />
          <p className="text-xs font-bold text-white/70">Acelerar negócios &</p>
          <p className="text-xs font-extrabold text-accent">impulsionar o empreendedorismo</p>
        </motion.div>
      </motion.div>

      {/* Faturamento / Saúde dos clientes */}
      <ClientHealthBar erpClients={erpClients} />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <KpiCard icon={DollarSign} label="Faturamento"
          rawValue={mrr} prefix="R$ " change="+4%" positive accent="#6eda2c" delay={0.05} />
        <KpiCard icon={Users} label="Novos leads (mês)"
          rawValue={newLeadsMonth} change="+12%" positive accent="#be29ec" delay={0.10} />
        <KpiCard icon={TrendingUp} label="Deals fechados (mês)"
          rawValue={wonMonth.length} suffix={wonMonth.length === 1 ? ' deal' : ' deals'}
          change={wonMonth.length > 0 ? '+' + fmt(wonMonth.reduce((s,l)=>s+l.value,0)) : undefined}
          positive accent="#ea8a29" delay={0.15} />
        <KpiCard icon={Activity} label="Taxa de conversão"
          rawValue={convRate} suffix="%" change="+3%" positive accent="#60a5fa" delay={0.20} />
      </div>

      {/* Pipeline summary */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6 bg-[#6eda2c]/5 border border-[#6eda2c]/20 rounded-2xl p-4">
        <div className="text-center">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Faturamento Único</p>
          <p className="text-2xl font-extrabold text-accent">{fmt(faturamentoUnico)}</p>
          <p className="text-xs font-bold text-accent/60">{wonUnico.length} {wonUnico.length === 1 ? 'deal' : 'deals'}</p>
        </div>
        <div className="text-center border-[#6eda2c]/20 lg:border-x">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">MRR Adquirido</p>
          <p className="text-2xl font-extrabold text-[#be29ec]">{fmt(mrrAdquirido)}<span className="text-sm font-bold">/mês</span></p>
          <p className="text-xs font-bold text-[#be29ec]/60">{wonRecorrente.length} recorrentes</p>
        </div>
        <div className="text-center border-[#6eda2c]/20 lg:border-r">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Em Negociação</p>
          <p className="text-2xl font-extrabold text-[#ea8a29]">{pipelineLeads.length}</p>
          <p className="text-xs font-bold text-[#ea8a29]/80">{fmt(pipelineValue)}</p>
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Ticket Médio/Cliente</p>
          <p className="text-2xl font-extrabold text-[#60a5fa]">{fmt(ticketMedio)}</p>
          <p className="text-xs font-bold text-[#60a5fa]/80">{erpClients.length} clientes</p>
        </div>
      </motion.div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <QuickFunnel />
        <RecentLeads />
        <ActivitiesCard />
      </div>

      {/* Grid gamificação */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <LevelCard />
        </div>
        <GoalsCard />
      </div>
    </div>
  )
}
