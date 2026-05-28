import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Zap, TrendingUp, Star, Target, ChevronDown } from 'lucide-react'
import { taskTypes } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'

// ── Gamification Engine ────────────────────────────────────────

const LEVELS = [
  { level: 1, min: 0,     xpToNext: 500,   rank: 'Aprendiz'  },
  { level: 2, min: 500,   xpToNext: 1500,  rank: 'Junior'    },
  { level: 3, min: 1500,  xpToNext: 3500,  rank: 'Sênior'    },
  { level: 4, min: 3500,  xpToNext: 6500,  rank: 'Expert'    },
  { level: 5, min: 6500,  xpToNext: 10000, rank: 'Elite'     },
  { level: 6, min: 10000, xpToNext: 15000, rank: 'Lenda ✦'   },
]

const PRIORITY_MULT = { high: 1.25, medium: 1.0, low: 0.75 }

function getLvl(xp) {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].min) return LEVELS[i]
  }
  return LEVELS[0]
}

function calcStreak(doneTasks) {
  if (!doneTasks.length) return 0
  const now = Date.now()
  let streak = 0
  for (let w = 0; w < 12; w++) {
    const end   = now - w     * 7 * 86400000
    const start = now - (w+1) * 7 * 86400000
    const active = doneTasks.some(t => {
      if (!t.dueDate) return false
      const d = new Date(t.dueDate + 'T12:00:00').getTime()
      return d >= start && d < end
    })
    if (active) streak++
    else if (w > 0) break
  }
  return Math.max(streak, 1)
}

function calcBadges(tasksCompleted, xp, streak, del) {
  const b = []
  if (tasksCompleted >= 1)         b.push('🎯')
  if (tasksCompleted >= 5)         b.push('🚀')
  if (tasksCompleted >= 10)        b.push('⚡')
  if (tasksCompleted >= 25)        b.push('🏆')
  if (streak >= 3)                 b.push('🔥')
  if (xp >= 1500)                  b.push('💎')
  if ((del.lp       || 0) >= 3)   b.push('🖥️')
  if ((del.criativo || 0) >= 5)   b.push('🎨')
  if ((del.campanha || 0) >= 3)   b.push('📢')
  return b.slice(0, 6)
}

function computeStats(collab, allTasks) {
  const myAll  = allTasks.filter(t => t.assignee === collab.id)
  const done   = myAll.filter(t => t.status === 'done')
  const doing  = myAll.filter(t => t.status === 'doing' || t.status === 'review')

  // XP: legacy (histórico mock) + XP real de tarefas concluídas
  const legacyXp = Number(collab.xp) || 0
  const newXp = done.reduce((sum, t) => {
    const base = taskTypes[t.type]?.xp || 50
    const mult = PRIORITY_MULT[t.priority] || 1.0
    return sum + Math.round(base * mult)
  }, 0)
  const xp = legacyXp + newXp

  const lvl = getLvl(xp)

  // Deliveries: legacy + novas tarefas concluídas
  const baseD = collab.deliveriesByType || {}
  const deliveriesByType = Object.fromEntries(
    Object.keys(taskTypes).map(type => [
      type,
      (Number(baseD[type]) || 0) + done.filter(t => t.type === type).length,
    ])
  )

  // Tarefas totais e deste mês
  const ym = new Date().toISOString().slice(0, 7)
  const newThisMonth    = done.filter(t => t.dueDate?.startsWith(ym)).length
  const tasksCompleted  = (Number(collab.tasksCompleted) || 0) + done.length
  const tasksThisMonth  = (Number(collab.tasksThisMonth) || 0) + newThisMonth

  // Streak: melhor entre legado e calculado
  const streak = Math.max(Number(collab.streak) || 0, done.length ? calcStreak(done) : 0)

  // Badges dinâmicos
  const badges = calcBadges(tasksCompleted, xp, streak, deliveriesByType)

  return {
    ...collab,
    xp, xpToNext: lvl.xpToNext, level: lvl.level, rank: lvl.rank,
    tasksCompleted, tasksThisMonth,
    streak, deliveriesByType, badges,
    doingCount: doing.length,
    newXp,
  }
}

function monthsSince(dateStr) {
  return Math.max(1, Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24 * 30.44)))
}

function getCarteira(collab, erpClients) {
  return erpClients
    .filter(c => c.manager === collab.id)
    .reduce((s, c) => s + (c.monthlyValue || 0), 0)
}

// ── Scorecard Operacional ─────────────────────────────────────

const SCORECARD_CRITERIA = {
  'Gestor de Tráfego': [
    { id: 'cpl_meta',    label: 'CPL dentro da meta no período',           icon: '📊' },
    { id: 'sem_erro',    label: 'Zero interrupções de campanha',           icon: '🛡️' },
    { id: 'relatorio',   label: 'Relatório enviado proativamente',         icon: '📋' },
    { id: 'otimizacoes', label: 'Otimizações semanais registradas',        icon: '⚙️' },
    { id: 'pauta',       label: 'Pauta enviada com 24h+ de antecedência', icon: '📅' },
    { id: 'grupos',      label: 'Interagiu em grupos 3x no período',       icon: '💬' },
    { id: 'crm',         label: 'CRM: leads atualizados + ação definida',  icon: '🗂️' },
  ],
  'Social Media': [
    { id: 'planejamento', label: 'Planejamento entregue com 7+ dias',       icon: '📆' },
    { id: 'volume',       label: '15+ posts no período',                    icon: '📱' },
    { id: 'grade',        label: 'Grade 100% executada, zero furos',        icon: '✅' },
    { id: 'copy',         label: 'Copy com gancho + CTA em todos os posts', icon: '✍️' },
  ],
  'Atendimento': [
    { id: 'tempo_resp',     label: 'Leads respondidos em até 30 minutos', icon: '⚡' },
    { id: 'followup_crm',   label: 'Follow-ups registrados no CRM',       icon: '🗂️' },
    { id: 'sem_reclamacao', label: 'Zero reclamação de demora',           icon: '🤝' },
  ],
  'Vendas': [
    { id: 'propostas', label: 'Propostas enviadas no mesmo dia',       icon: '📤' },
    { id: 'followup',  label: 'Follow-up com todos os leads quentes',  icon: '🔥' },
    { id: 'reunioes',  label: 'Reuniões agendadas no período',         icon: '📅' },
  ],
  'Administrador': [
    { id: 'tarefas',      label: 'Tarefas administrativas no prazo',      icon: '✅' },
    { id: 'comunicacao',  label: 'Comunicação centralizada e registrada', icon: '📋' },
    { id: 'financeiro',   label: 'Financeiro atualizado sem pendências',  icon: '💰' },
  ],
}

const SCORE_STATES = {
  ok:      { label: 'Bateu',     color: '#6eda2c', bg: '#6eda2c12', icon: '✅', value: 1   },
  partial: { label: 'Parcial',   color: '#ea8a29', bg: '#ea8a2912', icon: '⚠️', value: 0.5 },
  miss:    { label: 'Não bateu', color: '#ef4444', bg: '#ef444412', icon: '❌', value: 0   },
}

const SC_KEY = 'trafegon_scorecard_v2'
function loadScores() { try { return JSON.parse(localStorage.getItem(SC_KEY)) || {} } catch { return {} } }
function saveScores(d) { localStorage.setItem(SC_KEY, JSON.stringify(d)) }

function getWeekKeyFromDate(date) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()))
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() + 4 - day)
  const year = d.getUTCFullYear()
  const week = Math.ceil((((d - new Date(Date.UTC(year, 0, 1))) / 86400000) + 1) / 7)
  return `${year}-W${String(week).padStart(2, '0')}`
}

function getCycleKey(mode) {
  const now = new Date()
  return mode === 'month' ? now.toISOString().slice(0, 7) : getWeekKeyFromDate(now)
}

function getPastCycles(mode, count) {
  const now = new Date()
  const cycles = []
  for (let i = 0; i < count; i++) {
    if (mode === 'month') {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      cycles.push({ key: d.toISOString().slice(0, 7), label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }) })
    } else {
      const d = new Date(now)
      d.setDate(d.getDate() - i * 7)
      const key = getWeekKeyFromDate(d)
      cycles.push({ key, label: `Sem ${key.split('-W')[1]}` })
    }
  }
  return cycles
}

function calcScore(criteria, memberScores) {
  if (!criteria?.length) return null
  const filled = criteria.filter(c => memberScores?.[c.id])
  if (!filled.length) return null
  const earned = filled.reduce((s, c) => s + (SCORE_STATES[memberScores[c.id]]?.value ?? 0), 0)
  return Math.round((earned / criteria.length) * 100)
}

function ScorecardSection({ enriched }) {
  const [mode,          setMode]          = useState('week')
  const [scores,        setScores]        = useState(loadScores)
  const [open,          setOpen]          = useState({})
  const [selectedCycle, setSelectedCycle] = useState(() => getCycleKey('week'))

  function changeMode(m) {
    setMode(m)
    setSelectedCycle(getCycleKey(m))
  }

  function toggle(memberId, criteriaId) {
    const cur  = scores?.[selectedCycle]?.[memberId]?.[criteriaId]
    const next = cur === 'ok' ? 'partial' : cur === 'partial' ? 'miss' : 'ok'
    const updated = {
      ...scores,
      [selectedCycle]: { ...(scores[selectedCycle] || {}), [memberId]: { ...(scores[selectedCycle]?.[memberId] || {}), [criteriaId]: next } },
    }
    setScores(updated)
    saveScores(updated)
  }

  function clearMember(memberId) {
    const updated = { ...scores, [selectedCycle]: { ...(scores[selectedCycle] || {}), [memberId]: {} } }
    setScores(updated)
    saveScores(updated)
  }

  function getMemberHistory(memberId, criteria) {
    if (!criteria) return []
    return getPastCycles(mode, 4).reverse().map(c => ({
      key:   c.key,
      label: c.label,
      score: calcScore(criteria, scores?.[c.key]?.[memberId] || {}),
    }))
  }

  const pastCycles     = getPastCycles(mode, mode === 'week' ? 8 : 6)
  const currentCycleKey = getCycleKey(mode)
  const isCurrentCycle  = selectedCycle === currentCycleKey

  const cycleLabel = mode === 'week'
    ? `Semana ${selectedCycle.split('-W')[1]} / ${selectedCycle.split('-W')[0]}`
    : new Date(selectedCycle + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  // Summary stats for selected cycle
  const withScore = enriched
    .filter(c => SCORECARD_CRITERIA[c.role])
    .map(c => ({ ...c, score: calcScore(SCORECARD_CRITERIA[c.role], scores?.[selectedCycle]?.[c.id] || {}) }))
    .filter(c => c.score != null)
    .sort((a, b) => b.score - a.score)

  const leader        = withScore[0] || null
  const avgScore      = withScore.length ? Math.round(withScore.reduce((s, c) => s + c.score, 0) / withScore.length) : null
  const needsAtt      = withScore.filter(c => c.score < 50)
  const avgColor      = avgScore == null ? '#8890b5' : avgScore >= 75 ? '#6eda2c' : avgScore >= 50 ? '#ea8a29' : '#ef4444'

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div>
          <h2 className="text-base font-extrabold text-text">📋 Scorecard Operacional</h2>
          <p className="text-[11px] text-muted mt-0.5">
            {cycleLabel}{!isCurrentCycle && ' — ciclo passado'}
          </p>
        </div>
        <div className="flex gap-1 bg-white rounded-xl p-1" style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08)' }}>
          {[{ key: 'week', label: 'Semanal' }, { key: 'month', label: 'Mensal' }].map(m => (
            <button key={m.key} onClick={() => changeMode(m.key)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={mode === m.key ? { background: '#1a1d2e', color: 'white' } : { color: '#8890b5' }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* Seletor de ciclos */}
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-none">
        {pastCycles.map(c => (
          <button key={c.key} onClick={() => setSelectedCycle(c.key)}
            className="px-3 py-1.5 rounded-lg text-[11px] font-bold whitespace-nowrap flex-shrink-0 transition-all"
            style={
              selectedCycle === c.key
                ? { background: '#1a1d2e', color: 'white' }
                : c.key === currentCycleKey
                  ? { background: '#6eda2c20', color: '#6eda2c', border: '1px solid #6eda2c40' }
                  : { background: 'white', color: '#8890b5', boxShadow: '0 1px 4px rgba(26,29,46,0.08)' }
            }>
            {c.label}{c.key === currentCycleKey ? ' ●' : ''}
          </button>
        ))}
      </div>

      {/* Resumo automatico */}
      {withScore.length > 0 && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          {[
            leader && {
              icon: '🏆', title: 'Melhor do ciclo',
              value: leader.name.split(' ')[0],
              sub:   `${leader.score}% — ${leader.role}`,
              color: '#f59e0b', bg: '#f59e0b0d',
            },
            avgScore != null && {
              icon: '📊', title: 'Media da equipe',
              value: `${avgScore}%`,
              sub:   `${withScore.length} avaliados`,
              color: avgColor, bg: avgColor + '0d',
            },
            {
              icon: needsAtt.length === 0 ? '✅' : '⚠️',
              title: 'Atencao',
              value: needsAtt.length === 0 ? 'Todos ok' : needsAtt.map(c => c.name.split(' ')[0]).join(', '),
              sub:   needsAtt.length === 0 ? 'acima de 50%' : `${needsAtt.length} abaixo de 50%`,
              color: needsAtt.length === 0 ? '#6eda2c' : '#ef4444',
              bg:    needsAtt.length === 0 ? '#6eda2c0d' : '#ef44440d',
            },
          ].filter(Boolean).map((item, i) => (
            <div key={i} className="rounded-2xl p-4"
              style={{ background: item.bg, border: `1px solid ${item.color}20`, boxShadow: '0 1px 6px rgba(26,29,46,0.06)' }}>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">{item.icon} {item.title}</p>
              <p className="text-sm font-extrabold truncate" style={{ color: item.color }}>{item.value}</p>
              <p className="text-[10px] text-muted">{item.sub}</p>
            </div>
          ))}
        </div>
      )}

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {enriched.map(collab => {
          const criteria     = SCORECARD_CRITERIA[collab.role]
          if (!criteria) return null
          const memberScores = scores?.[selectedCycle]?.[collab.id] || {}
          const score        = calcScore(criteria, memberScores)
          const isOpen       = open[collab.id]
          const scoreColor   = score == null ? '#8890b5' : score >= 80 ? '#6eda2c' : score >= 50 ? '#ea8a29' : '#ef4444'
          const doneCount    = criteria.filter(c => memberScores[c.id] === 'ok').length
          const history      = getMemberHistory(collab.id, criteria)
          const hasHistory   = history.some(h => h.score != null)

          return (
            <motion.div key={collab.id} layout
              className="bg-white rounded-2xl overflow-hidden"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>

              {/* Header */}
              <button className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setOpen(p => ({ ...p, [collab.id]: !p[collab.id] }))}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                  style={{ background: collab.color }}>
                  {collab.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-text">{collab.name}</p>
                  <p className="text-[10px] text-muted">{collab.role}</p>
                </div>
                {score != null ? (
                  <div className="text-right mr-2 flex-shrink-0">
                    <p className="text-xl font-black leading-none" style={{ color: scoreColor }}>{score}%</p>
                    <p className="text-[9px] text-muted">{doneCount}/{criteria.length} criterios</p>
                  </div>
                ) : (
                  <span className="text-[10px] text-muted mr-2 flex-shrink-0">Nao avaliado</span>
                )}
                <ChevronDown size={14} className="text-muted flex-shrink-0 transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
              </button>

              {/* Barra de score */}
              {score != null && (
                <div className="px-4">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: scoreColor + '20' }}>
                    <motion.div className="h-full rounded-full" style={{ background: scoreColor }}
                      initial={{ width: 0 }} animate={{ width: `${score}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </div>
              )}

              {/* Mini historico */}
              {hasHistory && (
                <div className="px-4 pt-3 pb-1 flex items-end gap-2">
                  <span className="text-[9px] text-muted font-semibold mb-0.5 flex-shrink-0">Historico</span>
                  {history.map((h, i) => {
                    const hc = h.score == null ? '#e8eaf2' : h.score >= 80 ? '#6eda2c' : h.score >= 50 ? '#ea8a29' : '#ef4444'
                    const ht = h.score != null ? Math.max(4, Math.round(h.score * 0.26)) : 4
                    const isSelected = h.key === selectedCycle
                    return (
                      <div key={h.key} className="flex flex-col items-center gap-0.5 cursor-pointer"
                        onClick={() => setSelectedCycle(h.key)}>
                        <span className="text-[8px] font-bold" style={{ color: hc }}>{h.score != null ? `${h.score}%` : '-'}</span>
                        <div className="w-6 rounded-t-sm transition-all"
                          style={{ height: ht, background: hc, opacity: isSelected ? 1 : 0.55, outline: isSelected ? `2px solid ${hc}` : 'none' }} />
                        <span className="text-[7px] text-muted">{h.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Criterios */}
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden">
                    <div className="p-4 pt-3 space-y-2">
                      {criteria.map(c => {
                        const state = memberScores[c.id]
                        const cfg   = SCORE_STATES[state]
                        return (
                          <button key={c.id} onClick={() => toggle(collab.id, c.id)}
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.99]"
                            style={{ background: cfg ? cfg.bg : '#f7f8fc', border: `1px solid ${cfg ? cfg.color + '30' : '#e8eaf2'}` }}>
                            <span className="text-sm flex-shrink-0">{c.icon}</span>
                            <span className="flex-1 text-xs font-semibold" style={{ color: cfg ? '#1a1d2e' : '#8890b5' }}>
                              {c.label}
                            </span>
                            <span className="text-xs flex-shrink-0" style={{ color: cfg?.color || '#d0d4e8' }}>
                              {cfg ? cfg.icon : '○'}
                            </span>
                          </button>
                        )
                      })}
                      <button onClick={() => clearMember(collab.id)}
                        className="w-full text-[10px] text-muted/60 text-center py-1 hover:text-muted transition-colors mt-1">
                        Limpar avaliacao
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {/* Legenda */}
      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Legenda:</span>
        {Object.entries(SCORE_STATES).map(([k, v]) => (
          <span key={k} className="text-[10px] font-bold flex items-center gap-1" style={{ color: v.color }}>
            {v.icon} {v.label}
          </span>
        ))}
        <span className="text-[10px] text-muted/60">· salvo automaticamente</span>
      </div>
    </div>
  )
}


// ── Sub-componentes ────────────────────────────────────────────

function XpBar({ xp, xpToNext, color }) {
  const pct = Math.min(100, Math.round((xp / xpToNext) * 100))
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-muted font-medium">{xp.toLocaleString('pt-BR')} XP</span>
        <span className="font-bold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: color + '20' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  )
}

function LevelPip({ level, current, color }) {
  const filled = level <= current
  return (
    <div
      className="w-4 h-1.5 rounded-full transition-all"
      style={{ backgroundColor: filled ? color : color + '25' }}
    />
  )
}

function PodiumCard({ collab, position, delay }) {
  const heights = { 1: 'h-24', 2: 'h-16', 3: 'h-10' }
  const medals  = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const sizes   = { 1: 'w-14 h-14 text-base', 2: 'w-12 h-12 text-sm', 3: 'w-10 h-10 text-xs' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-2"
    >
      <div className="relative">
        <div
          className={`${sizes[position]} rounded-2xl flex items-center justify-center font-extrabold text-white`}
          style={{ background: `linear-gradient(135deg, ${collab.color}, ${collab.color}80)`, boxShadow: `0 8px 24px ${collab.color}40` }}
        >
          {collab.avatar}
        </div>
        <div className="absolute -top-2 -right-2 text-lg">{medals[position]}</div>
      </div>
      <p className="text-xs font-bold text-text">{collab.name}</p>
      <p className="text-[10px] text-muted">{collab.rank} Nv.{collab.level}</p>
      <p className="text-sm font-extrabold" style={{ color: collab.color }}>
        {collab.xp.toLocaleString('pt-BR')} XP
      </p>
      {collab.newXp > 0 && (
        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#6eda2c15', color: '#6eda2c' }}>
          +{collab.newXp} real
        </span>
      )}
      <div className={`${heights[position]} w-full rounded-t-xl opacity-30`} style={{ backgroundColor: collab.color }} />
    </motion.div>
  )
}

function CollabCard({ collab, index }) {
  const pctXp = Math.min(100, Math.round((collab.xp / collab.xpToNext) * 100))

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 + index * 0.07, duration: 0.35 }}
      className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0"
          style={{ background: `linear-gradient(135deg, ${collab.color}, ${collab.color}80)`, boxShadow: `0 4px 14px ${collab.color}35` }}
        >
          {collab.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="text-sm font-extrabold text-text">{collab.name}</p>
            <div className="flex gap-0.5 flex-wrap">
              {collab.badges.map((b, i) => <span key={i} className="text-xs">{b}</span>)}
            </div>
          </div>
          <p className="text-[11px] text-muted">{collab.role}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-extrabold" style={{ color: collab.color }}>{collab.rank}</p>
          <p className="text-[10px] text-muted">Nível {collab.level}</p>
        </div>
      </div>

      {/* Level pips */}
      <div className="flex gap-1 mb-2">
        {LEVELS.map(l => (
          <LevelPip key={l.level} level={l.level} current={collab.level} color={collab.color} />
        ))}
        <span className="text-[9px] text-muted ml-auto">→ {collab.xpToNext.toLocaleString()} XP</span>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <XpBar xp={collab.xp} xpToNext={collab.xpToNext} color={collab.color} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Trophy,     label: 'Concluídas',   value: collab.tasksCompleted, color: '#6eda2c' },
          { icon: TrendingUp, label: 'Em andamento',  value: collab.doingCount,     color: '#60a5fa' },
          { icon: Flame,      label: 'Streak',        value: `${collab.streak}sem`, color: '#ea8a29' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: color + '10' }}>
            <Icon size={13} style={{ color }} className="mx-auto mb-1" />
            <p className="text-sm font-extrabold" style={{ color }}>{value}</p>
            <p className="text-[9px] text-muted font-semibold uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Este mês */}
      {collab.tasksThisMonth > 0 && (
        <div className="mb-3 flex items-center gap-2 p-2 rounded-xl" style={{ background: '#6eda2c08', border: '1px solid #6eda2c20' }}>
          <Target size={11} style={{ color: '#6eda2c' }} />
          <span className="text-[10px] font-bold" style={{ color: '#6eda2c' }}>
            {collab.tasksThisMonth} entrega{collab.tasksThisMonth > 1 ? 's' : ''} este mês
          </span>
          {collab.newXp > 0 && (
            <span className="text-[10px] font-bold ml-auto" style={{ color: '#6eda2c' }}>+{collab.newXp} XP</span>
          )}
        </div>
      )}

      {/* Especialidades */}
      <div>
        <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2">Especialidades</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(taskTypes).map(([key, cfg]) => {
            const count = collab.deliveriesByType[key] || 0
            if (count === 0) return null
            return (
              <span key={key}
                className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                style={{ color: cfg.color, backgroundColor: cfg.color + '15' }}
              >
                {cfg.icon} {count}
              </span>
            )
          })}
          {Object.values(collab.deliveriesByType).every(v => !v) && (
            <span className="text-[10px] text-muted">Nenhuma entrega registrada</span>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Main ──────────────────────────────────────────────────────

export default function Equipe() {
  const { collaborators, tasks, erpClients } = useData()

  // Aplica o motor de gamificação em todos os colaboradores
  const enriched = useMemo(
    () => collaborators.map(c => computeStats(c, tasks)),
    [collaborators, tasks]
  )

  const sorted  = [...enriched].sort((a, b) => b.xp - a.xp)
  const [first, second, third, ...rest] = sorted
  const podium    = [second, first, third].filter(Boolean)
  const podiumPos = [2, 1, 3]

  const totalXP    = enriched.reduce((s, c) => s + c.xp, 0)
  const doneTasks  = tasks.filter(t => t.status === 'done').length
  const avgStreak  = enriched.length
    ? Math.round(enriched.reduce((s, c) => s + c.streak, 0) / enriched.length)
    : 0

  // Ranking Carteira × Tempo
  const carteiraRanking = enriched
    .map(c => {
      const months  = monthsSince(c.since || '2025-01-01')
      const carteira = getCarteira(c, erpClients)
      return { ...c, months, carteira, score: carteira * months }
    })
    .sort((a, b) => b.score - a.score)
  const maxScore = carteiraRanking[0]?.score || 1

  return (
    <div className="p-4 lg:p-8">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-4 lg:mb-8">
        <h1 className="text-2xl font-extrabold text-text">Equipe</h1>
        <p className="text-sm text-muted mt-0.5">Performance e gamificação da equipe TráfegOn</p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Membros ativos',     value: enriched.length,                 color: '#6eda2c', emoji: '👥' },
            { label: 'Tarefas concluídas', value: `${doneTasks}/${tasks.length}`,  color: '#60a5fa', emoji: '✅' },
            { label: 'XP total da equipe', value: `${(totalXP/1000).toFixed(1)}k`, color: '#be29ec', emoji: '⚡' },
            { label: 'Streak médio',       value: `${avgStreak} sem`,              color: '#ea8a29', emoji: '🔥' },
          ].map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.04)' }}
            >
              <span className="text-xl">{m.emoji}</span>
              <div>
                <p className="text-base font-extrabold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">{m.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Legenda de níveis */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl px-5 py-4 mb-6 flex flex-wrap items-center gap-3"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)' }}
      >
        <span className="text-[10px] font-extrabold text-muted uppercase tracking-widest mr-1">Níveis</span>
        {LEVELS.map((l, i) => (
          <div key={l.level} className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[9px] font-extrabold text-white"
              style={{ background: `hsl(${120 - i * 18}, 70%, 50%)` }}>
              {l.level}
            </div>
            <span className="text-[10px] font-bold text-muted">{l.rank}</span>
            <span className="text-[9px] text-muted/60">{l.min.toLocaleString()}+ XP</span>
            {i < LEVELS.length - 1 && <span className="text-muted/30 text-xs ml-1">·</span>}
          </div>
        ))}
      </motion.div>

      {/* Pódio */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 mb-8"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={16} className="text-accent" />
          <p className="text-sm font-extrabold text-text">Ranking XP</p>
          <span className="text-[10px] text-muted ml-2">XP = histórico + tarefas concluídas × tipo × prioridade</span>
        </div>
        <div className="flex items-end justify-center gap-8 px-8">
          {podium.map((c, i) => c && (
            <div key={c.id} className="flex-1 max-w-[140px]">
              <PodiumCard collab={c} position={podiumPos[i]} delay={0.3 + i * 0.1} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Ranking Carteira × Tempo */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-6 mb-8"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Star size={16} style={{ color: '#ea8a29' }} />
          <p className="text-sm font-extrabold text-text">Índice de Carteira × Tempo de Casa</p>
          <span className="ml-auto text-[10px] text-muted">(R$ gerenciado × meses na agência)</span>
        </div>
        <div className="space-y-3">
          {carteiraRanking.map((c, i) => {
            const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
            const pct = Math.round((c.score / maxScore) * 100)
            return (
              <div key={c.id} className="flex items-center gap-4">
                <span className="w-5 text-center text-sm font-extrabold"
                  style={{ color: ['#f59e0b','#94a3b8','#b45309'][i] || '#8890b5' }}>
                  {['🥇','🥈','🥉'][i] || `#${i+1}`}
                </span>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                  style={{ backgroundColor: c.color }}>
                  {c.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-text">{c.name}</span>
                    <span className="text-[10px] font-bold text-muted">
                      {fmt(c.carteira)}/mês × {c.months}m = <span style={{ color: c.color }}>{(c.score/1000).toFixed(0)}k pts</span>
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.color + '20' }}>
                    <motion.div className="h-full rounded-full" style={{ background: c.color }}
                      initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: [0.22,1,0.36,1] }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Cards individuais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {sorted.map((c, i) => (
          <CollabCard key={c.id} collab={c} index={i} />
        ))}
      </div>

      {/* Scorecard Operacional */}
      <ScorecardSection enriched={enriched} />
    </div>
  )
}
