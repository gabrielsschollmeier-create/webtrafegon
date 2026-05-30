import { useMemo, useState } from 'react'
import { getAvatarComponent } from '../../data/avatars'
import { OnsToken, OnsDisplay, OnsGain } from '../../components/OnsToken'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Zap, TrendingUp, Star, Target, ChevronDown } from 'lucide-react'
import { taskTypes } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'
import { BELTS, getBeltInfo } from '../../data/belt-system'
import BeltBadge from '../../components/BeltBadge'

// ── Gamification Engine ────────────────────────────────────────

const PRIORITY_MULT = { high: 1.25, medium: 1.0, low: 0.75 }

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
  if (tasksCompleted >= 50)        b.push('👑')
  if (streak >= 3)                 b.push('🔥')
  if (streak >= 6)                 b.push('💥')
  if (streak >= 12)                b.push('🌟')
  if (xp >= 700)                   b.push('🥉')
  if (xp >= 2500)                  b.push('💎')
  if (xp >= 5500)                  b.push('🔮')
  if (xp >= 7500)                  b.push('⚜️')
  if (xp >= 18000)                 b.push('🦅')
  if ((del.lp       || 0) >= 3)   b.push('🖥️')
  if ((del.criativo || 0) >= 5)   b.push('🎨')
  if ((del.campanha || 0) >= 3)   b.push('📢')
  if ((del.copy     || 0) >= 5)   b.push('✍️')
  if ((del.video    || 0) >= 3)   b.push('🎬')
  return b.slice(0, 8)
}

function computeStats(collab, allTasks) {
  const resetDate = collab.xpResetAt || '2026-05-28'
  const myAll  = allTasks.filter(t => t.assignee === collab.id)
  const done   = myAll.filter(t => {
    if (t.status !== 'done') return false
    const taskDate = t.completedAt || t.dueDate || t.createdAt || ''
    return taskDate >= resetDate
  })
  const doing  = myAll.filter(t => t.status === 'doing' || t.status === 'review')

  const newXp = done.reduce((sum, t) => {
    const base = taskTypes[t.type]?.ons ?? 1
    const mult = PRIORITY_MULT[t.priority] || 1.0
    return sum + Math.round(base * mult)
  }, 0)

  const streakMult = newXp > 0 ? (done.length >= 14 ? 1.2 : done.length >= 7 ? 1.1 : 1.0) : 1.0
  const taskXp     = Math.round(newXp * streakMult)

  // Bônus de tempo de casa: 15 ons/mês, cap 1500
  const months     = monthsSince(collab.since || resetDate)
  const tenureXp   = Math.min(months * 15, 1500)
  const xp         = taskXp + tenureXp

  // Performance
  const today       = new Date().toISOString().split('T')[0]
  const overdueCount   = myAll.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length
  const performancePct = (done.length + overdueCount) > 0
    ? Math.round((done.length / (done.length + overdueCount)) * 100)
    : 100

  // Belt (usa floor do campo `belt`/`grau` do colaborador)
  const bi = getBeltInfo(xp, months, performancePct, collab.belt || 'branca', collab.grau ?? 0)

  // Deliveries
  const baseD = collab.deliveriesByType || {}
  const deliveriesByType = Object.fromEntries(
    Object.keys(taskTypes).map(type => [
      type,
      (Number(baseD[type]) || 0) + done.filter(t => t.type === type).length,
    ])
  )

  const ym             = new Date().toISOString().slice(0, 7)
  const tasksCompleted = done.length
  const doneThisMonth  = done.filter(t => (t.dueDate || t.createdAt || '').startsWith(ym))
  const tasksThisMonth = doneThisMonth.length
  const onsThisMonth   = Math.round(doneThisMonth.reduce((s, t) => {
    const base = taskTypes[t.type]?.ons ?? 1
    const mult = PRIORITY_MULT[t.priority] || 1.0
    return s + Math.round(base * mult)
  }, 0) * streakMult)
  const streak         = done.length ? calcStreak(done) : 0
  const badges         = calcBadges(tasksCompleted, xp, streak, deliveriesByType)

  return {
    ...collab,
    xp, taskXp, tenureXp, months,
    belt: bi.belt, grau: bi.grau,
    rank: bi.belt.label,
    // alias para compat
    xpInLevel: bi.xpInGrau, xpLevelSpan: bi.grauSpan,
    xpRemaining: Math.max(0, bi.grauEnd - xp),
    nextRank: bi.nextBelt?.label || null,
    streakMult,
    tasksCompleted, tasksThisMonth, onsThisMonth,
    streak, deliveriesByType, badges,
    doingCount: doing.length,
    newXp,
    // Gate de faixa
    canLevelUp: bi.canAdvance,
    xpNeeded:   bi.xpNeeded,
    mthsNeeded: bi.mthsNeeded,
    performancePct, performanceOk: performancePct >= 80,
    nextBelt: bi.nextBelt,
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
  'Gestor de Trafego': [
    { id: 'cpl_meta',    label: 'CPL dentro da meta no periodo',            icon: '📊', weight: 3 },
    { id: 'sem_erro',    label: 'Zero interrupcoes de campanha',            icon: '🛡️', weight: 3 },
    { id: 'relatorio',   label: 'Relatorio enviado proativamente',          icon: '📋', weight: 2 },
    { id: 'otimizacoes', label: 'Otimizacoes semanais registradas',         icon: '⚙️', weight: 2 },
    { id: 'pauta',       label: 'Pauta enviada com 24h+ de antecedencia',  icon: '📅', weight: 1 },
    { id: 'grupos',      label: 'Interagiu em grupos 3x no periodo',        icon: '💬', weight: 1 },
    { id: 'crm',         label: 'CRM: leads atualizados + acao definida',   icon: '🗂️', weight: 2 },
  ],
  'Social Media': [
    { id: 'planejamento', label: 'Planejamento entregue com 7+ dias',        icon: '📆', weight: 2 },
    { id: 'volume',       label: '15+ posts no periodo',                     icon: '📱', weight: 2 },
    { id: 'grade',        label: 'Grade 100% executada, zero furos',         icon: '✅', weight: 3 },
    { id: 'copy',         label: 'Copy com gancho + CTA em todos os posts',  icon: '✍️', weight: 2 },
  ],
  'Atendimento': [
    { id: 'tempo_resp',     label: 'Leads respondidos em ate 30 minutos', icon: '⚡', weight: 3 },
    { id: 'followup_crm',   label: 'Follow-ups registrados no CRM',       icon: '🗂️', weight: 2 },
    { id: 'sem_reclamacao', label: 'Zero reclamacao de demora',           icon: '🤝', weight: 3 },
  ],
  'Vendas': [
    { id: 'propostas', label: 'Propostas enviadas no mesmo dia',       icon: '📤', weight: 2 },
    { id: 'followup',  label: 'Follow-up com todos os leads quentes',  icon: '🔥', weight: 3 },
    { id: 'reunioes',  label: 'Reunioes agendadas no periodo',         icon: '📅', weight: 2 },
  ],
  'Administrador': [
    { id: 'tarefas',      label: 'Tarefas administrativas no prazo',      icon: '✅', weight: 2 },
    { id: 'comunicacao',  label: 'Comunicacao centralizada e registrada', icon: '📋', weight: 2 },
    { id: 'financeiro',   label: 'Financeiro atualizado sem pendencias',  icon: '💰', weight: 3 },
  ],
}

const RECOMPENSAS = [
  { range: '90-100%', semanal: 'Mencao no grupo + escolha da proxima tarefa', mensal: 'Folga extra + elegivel para bonus trimestral', color: '#6eda2c' },
  { range: '75-89%',  semanal: 'Mencao no grupo',                             mensal: 'Elegivel para bonus',                            color: '#60a5fa' },
  { range: '50-74%',  semanal: 'Feedback de melhoria',                        mensal: 'Meta definida para proximo ciclo',               color: '#ea8a29' },
  { range: '< 50%',   semanal: 'Conversa individual',                         mensal: 'Revisao de processos e suporte',                 color: '#ef4444' },
]

const SCORE_STATES = {
  ok:      { label: 'Bateu',     color: '#6eda2c', bg: '#6eda2c12', icon: '✅', value: 1   },
  partial: { label: 'Parcial',   color: '#ea8a29', bg: '#ea8a2912', icon: '⚠️', value: 0.5 },
  miss:    { label: 'Nao bateu', color: '#ef4444', bg: '#ef444412', icon: '❌', value: 0   },
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

function getTiebreaker(criteria, memberScores) {
  if (!criteria || !memberScores) return { volume: 0, difficulty: 0 }
  const ok = criteria.filter(c => memberScores[c.id] === 'ok')
  return {
    volume:     ok.length,
    difficulty: ok.reduce((s, c) => s + (c.weight || 1), 0),
  }
}

function rankMembers(members, scores, cycle) {
  return [...members]
    .filter(c => SCORECARD_CRITERIA[c.role])
    .map(c => {
      const criteria     = SCORECARD_CRITERIA[c.role]
      const memberScores = scores?.[cycle]?.[c.id] || {}
      const score        = calcScore(criteria, memberScores)
      const tb           = getTiebreaker(criteria, memberScores)
      return { ...c, score, ...tb }
    })
    .filter(c => c.score != null)
    .sort((a, b) => {
      if (b.score     !== a.score)      return b.score      - a.score
      if (b.volume    !== a.volume)     return b.volume     - a.volume
      return b.difficulty - a.difficulty
    })
}

/* ── Destaque da Semana ────────────────────────────────────────── */
function DestaqueCard({ winner, isTied }) {
  if (!winner) return null
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-5 mb-6 flex items-center gap-5 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.25)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 50%, ${winner.color}28 0%, transparent 65%)` }} />
      <div className="relative flex-shrink-0">
        <Avatar collab={winner}
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-lg font-extrabold text-white"
          style={{ background: winner.color, boxShadow: `0 0 0 4px ${winner.color}40, 0 8px 24px ${winner.color}55` }} />
        <div className="absolute -top-3 -right-3 text-2xl">👑</div>
      </div>
      <div className="relative flex-1 min-w-0">
        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.38)' }}>
          Destaque da Semana
        </p>
        <p className="text-xl font-black text-white leading-none">{winner.name}</p>
        <p className="text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{winner.role}</p>
        {isTied && (
          <p className="text-[9px] mt-1 font-bold" style={{ color: winner.color + 'cc' }}>
            Desempate por volume ({winner.volume} crit.) e dificuldade ({winner.difficulty} pts)
          </p>
        )}
      </div>
      <div className="relative text-right flex-shrink-0">
        <p className="text-4xl font-black leading-none" style={{ color: winner.color }}>{winner.score}%</p>
        <p className="text-[10px] font-bold mt-1" style={{ color: 'rgba(255,255,255,0.38)' }}>score semanal</p>
      </div>
    </motion.div>
  )
}

/* ── Regras e Recompensas ─────────────────────────────────────── */
function RegrasRecompensas() {
  const [open, setOpen] = useState(false)
  return (
    <div className="mb-5">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white text-left transition-all hover:shadow-sm"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.06)' }}>
        <div className="flex items-center gap-2">
          <span className="text-base">📜</span>
          <span className="text-sm font-extrabold text-text">Regras e Recompensas</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#6eda2c18', color: '#6eda2c' }}>
            Como funciona
          </span>
        </div>
        <ChevronDown size={15} className="text-muted transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="bg-white rounded-2xl mt-2 p-5 space-y-5"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.05)' }}>

              {/* Como funciona */}
              <div>
                <p className="text-xs font-extrabold text-text mb-2">Como o score e calculado</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { icon: '✅', title: 'Bateu', desc: 'Criterio 100% cumprido', pts: '1.0 pt', color: '#6eda2c' },
                    { icon: '⚠️', title: 'Parcial', desc: 'Cumprido com ressalvas', pts: '0.5 pt', color: '#ea8a29' },
                    { icon: '❌', title: 'Nao bateu', desc: 'Criterio nao cumprido', pts: '0.0 pt', color: '#ef4444' },
                  ].map(s => (
                    <div key={s.title} className="rounded-xl p-3 flex items-start gap-3"
                      style={{ background: s.color + '0d', border: `1px solid ${s.color}25` }}>
                      <span className="text-lg">{s.icon}</span>
                      <div>
                        <p className="text-xs font-extrabold" style={{ color: s.color }}>{s.title}</p>
                        <p className="text-[10px] text-muted">{s.desc}</p>
                        <p className="text-[10px] font-bold mt-1" style={{ color: s.color }}>{s.pts}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-[10px] text-muted mt-3 p-3 rounded-xl" style={{ background: '#f7f8fc' }}>
                  <strong>Score % = </strong> soma dos pontos obtidos / total de criterios × 100<br/>
                  <strong>Desempate: </strong> 1° volume de criterios batidos — 2° grau de dificuldade (peso por criterio)
                </p>
              </div>

              {/* Pesos por dificuldade */}
              <div>
                <p className="text-xs font-extrabold text-text mb-2">Grau de dificuldade dos criterios</p>
                <div className="flex gap-3 flex-wrap">
                  {[{ pts: 3, label: 'Alta — resultado externo, mais variavel', color: '#ef4444' },
                    { pts: 2, label: 'Media — processo interno controlavel',     color: '#ea8a29' },
                    { pts: 1, label: 'Basica — habito simples de executar',      color: '#6eda2c' }].map(d => (
                    <div key={d.pts} className="flex items-center gap-2 text-[10px] font-semibold">
                      <span className="w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-extrabold text-white"
                        style={{ background: d.color }}>{d.pts}</span>
                      <span className="text-muted">{d.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tabela de recompensas */}
              <div>
                <p className="text-xs font-extrabold text-text mb-2">Tabela de recompensas</p>
                <div className="rounded-xl overflow-hidden border border-border">
                  <div className="grid grid-cols-3 bg-surface px-3 py-2">
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Score</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Semanal</span>
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">3 sem. seguidas</span>
                  </div>
                  {RECOMPENSAS.map((r, i) => (
                    <div key={r.range} className={`grid grid-cols-3 px-3 py-2 gap-1 ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                      <span className="text-[11px] font-extrabold" style={{ color: r.color }}>{r.range}</span>
                      <span className="text-[9px] text-text leading-snug">{r.semanal}</span>
                      <span className="text-[9px] text-text leading-snug">{r.mensal}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[10px] text-muted/60 text-center">
                Ciclos sempre de 7 em 7 dias (ISO week) · Destaque da semana definido automaticamente · Empate desfeito por volume e dificuldade
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── Scorecard Section ────────────────────────────────────────── */
function ScorecardSection({ enriched }) {
  const isAdmin = (() => {
    try { const u = JSON.parse(localStorage.getItem('authUser_v2') || '{}'); return u.role === 'admin' || u.role === 'gestor' } catch { return false }
  })()

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

  const pastCycles      = getPastCycles(mode, mode === 'week' ? 8 : 6)
  const currentCycleKey = getCycleKey(mode)
  const currentWeekKey  = getCycleKey('week')
  const isCurrentCycle  = selectedCycle === currentCycleKey

  const cycleLabel = mode === 'week'
    ? `Semana ${selectedCycle.split('-W')[1]} / ${selectedCycle.split('-W')[0]}`
    : new Date(selectedCycle + '-15').toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  // Ranking do ciclo selecionado (para resumo e cards)
  const ranking       = rankMembers(enriched, scores, selectedCycle)
  const leader        = ranking[0] || null
  const avgScore      = ranking.length ? Math.round(ranking.reduce((s, c) => s + c.score, 0) / ranking.length) : null
  const needsAtt      = ranking.filter(c => c.score < 50)
  const avgColor      = avgScore == null ? '#8890b5' : avgScore >= 75 ? '#6eda2c' : avgScore >= 50 ? '#ea8a29' : '#ef4444'

  // Destaque sempre da semana atual
  const weekRanking    = rankMembers(enriched, scores, currentWeekKey)
  const weekWinner     = weekRanking[0] || null
  const weekIsTied     = weekRanking.length >= 2 && weekRanking[0]?.score === weekRanking[1]?.score

  return (
    <div className="mt-10">

      {/* Destaque da Semana (sempre semana atual) */}
      <DestaqueCard winner={weekWinner} isTied={weekIsTied} />

      {/* Regras e Recompensas */}
      <RegrasRecompensas />

      {/* Header do scorecard */}
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
      <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5">
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
      {ranking.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
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
              sub:   `${ranking.length} avaliados`,
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
          const isWinner     = weekWinner?.id === collab.id && selectedCycle === currentWeekKey

          return (
            <motion.div key={collab.id} layout
              className="bg-white rounded-2xl overflow-hidden"
              style={{
                boxShadow: isWinner
                  ? `0 0 0 2px ${collab.color}, 0 8px 24px ${collab.color}30`
                  : '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)',
              }}>

              <button className="w-full flex items-center gap-3 p-4 text-left"
                onClick={() => setOpen(p => ({ ...p, [collab.id]: !p[collab.id] }))}>
                <div className="relative w-9 h-9 flex-shrink-0">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-extrabold text-white overflow-hidden"
                    style={{ background: collab.color }}>
                    <Avatar collab={collab} className="w-full h-full" style={{}} />
                  </div>
                  {isWinner && <span className="absolute -top-2 -right-2 text-sm">👑</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-text">{collab.name}
                    {isWinner && <span className="ml-2 text-[9px] font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: collab.color + '20', color: collab.color }}>Destaque</span>}
                  </p>
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

              {score != null && (
                <div className="px-4">
                  <div className="h-1 rounded-full overflow-hidden" style={{ background: scoreColor + '20' }}>
                    <motion.div className="h-full rounded-full" style={{ background: scoreColor }}
                      initial={{ width: 0 }} animate={{ width: `${score}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }} />
                  </div>
                </div>
              )}

              {hasHistory && (
                <div className="px-4 pt-3 pb-1 flex items-end gap-2">
                  <span className="text-[9px] text-muted font-semibold mb-0.5 flex-shrink-0">Historico</span>
                  {history.map(h => {
                    const hc = h.score == null ? '#e8eaf2' : h.score >= 80 ? '#6eda2c' : h.score >= 50 ? '#ea8a29' : '#ef4444'
                    const ht = h.score != null ? Math.max(4, Math.round(h.score * 0.26)) : 4
                    const isSel = h.key === selectedCycle
                    return (
                      <div key={h.key} className="flex flex-col items-center gap-0.5 cursor-pointer"
                        onClick={() => setSelectedCycle(h.key)}>
                        <span className="text-[8px] font-bold" style={{ color: hc }}>{h.score != null ? `${h.score}%` : '-'}</span>
                        <div className="w-6 rounded-t-sm"
                          style={{ height: ht, background: hc, opacity: isSel ? 1 : 0.55, outline: isSel ? `2px solid ${hc}` : 'none' }} />
                        <span className="text-[7px] text-muted">{h.label}</span>
                      </div>
                    )
                  })}
                </div>
              )}

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
                    className="overflow-hidden">
                    <div className="p-4 pt-3 space-y-2">
                      {!isAdmin && (
                        <div className="flex items-center gap-2 px-1 py-2 rounded-xl mb-1" style={{ background: '#f7f8fc', border: '1px solid #e8eaf2' }}>
                          <span className="text-sm">🔒</span>
                          <span className="text-[11px] text-muted">Apenas gestores podem preencher o scorecard</span>
                        </div>
                      )}
                      {criteria.map(c => {
                        const state = memberScores[c.id]
                        const cfg   = SCORE_STATES[state]
                        return (
                          <button key={c.id}
                            onClick={() => isAdmin && toggle(collab.id, c.id)}
                            disabled={!isAdmin}
                            className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all active:scale-[0.99]"
                            style={{
                              background: cfg ? cfg.bg : '#f7f8fc',
                              border: `1px solid ${cfg ? cfg.color + '30' : '#e8eaf2'}`,
                              cursor: isAdmin ? 'pointer' : 'default',
                              opacity: isAdmin ? 1 : 0.7,
                            }}>
                            <span className="text-sm flex-shrink-0">{c.icon}</span>
                            <span className="flex-1 text-xs font-semibold" style={{ color: cfg ? '#1a1d2e' : '#8890b5' }}>
                              {c.label}
                            </span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-[8px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: c.weight === 3 ? '#ef444420' : c.weight === 2 ? '#ea8a2920' : '#6eda2c20',
                                         color:      c.weight === 3 ? '#ef4444'   : c.weight === 2 ? '#ea8a29'   : '#6eda2c' }}>
                                P{c.weight}
                              </span>
                              <span className="text-xs" style={{ color: cfg?.color || '#d0d4e8' }}>
                                {cfg ? cfg.icon : '○'}
                              </span>
                            </div>
                          </button>
                        )
                      })}
                      {isAdmin && (
                        <button onClick={() => clearMember(collab.id)}
                          className="w-full text-[10px] text-muted/60 text-center py-1.5 rounded-lg hover:text-red-400 hover:bg-red-50 transition-colors mt-1">
                          🗑 Limpar avaliação
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      <div className="mt-4 flex items-center gap-4 flex-wrap">
        <span className="text-[10px] text-muted font-bold uppercase tracking-wider">Legenda:</span>
        {Object.entries(SCORE_STATES).map(([k, v]) => (
          <span key={k} className="text-[10px] font-bold flex items-center gap-1" style={{ color: v.color }}>
            {v.icon} {v.label}
          </span>
        ))}
        <span className="text-[10px] text-muted/60">· P1/P2/P3 = peso do criterio no desempate · salvo automaticamente</span>
      </div>
    </div>
  )
}




// ── Missões por função ─────────────────────────────────────────

const MISSAO_COLORS = { entrega:'#6eda2c', operacao:'#60a5fa', criativo:'#be29ec', streak:'#ea8a29', perfeito:'#f59e0b', crm:'#34d399', vendas:'#f97316' }

const MISSOES_POR_FUNCAO = {
  'Gestor de Trafego': [
    { id:'gt_dash',   icon:'📊', titulo:'Dashboard enviado',        desc:'Enviar relatório de performance para 1+ cliente na semana',  xp:100, tipo:'entrega'   },
    { id:'gt_otim',   icon:'⚙️', titulo:'3 otimizações registradas',desc:'Registrar 3 otimizações de campanha no hub',                xp:90,  tipo:'operacao'  },
    { id:'gt_crm',    icon:'🗂️', titulo:'CRM atualizado',           desc:'Leads do período com ação definida no CRM',                 xp:80,  tipo:'crm'       },
    { id:'gt_streak', icon:'🔥', titulo:'Streak ativo',             desc:'Entregou algo nas últimas 2 semanas',                       xp:60,  tipo:'streak'    },
    { id:'gt_clean',  icon:'🛡️', titulo:'Zero interrupções',        desc:'Nenhuma campanha parou por erro ou saldo no período',       xp:120, tipo:'perfeito'  },
  ],
  'SM_agencia': [
    { id:'sma_reel',   icon:'🎬', titulo:'2 Reels da agência',       desc:'Entregar 2 roteiros/vídeos para o Instagram da TráfegOn',  xp:100, tipo:'criativo'  },
    { id:'sma_feed',   icon:'📆', titulo:'Feed planejado',           desc:'Calendário de posts da agência pronto com 7+ dias',        xp:90,  tipo:'entrega'   },
    { id:'sma_trend',  icon:'📈', titulo:'Trend mapeado',            desc:'Identificar e propor 1 trend/notícia para conteúdo',       xp:70,  tipo:'criativo'  },
    { id:'sma_streak', icon:'🔥', titulo:'Streak ativo',             desc:'Entregou algo nas últimas 2 semanas',                      xp:60,  tipo:'streak'    },
    { id:'sma_perfil', icon:'✨', titulo:'Perfil da agência ok',     desc:'Bio, destaques e fixados do Instagram da agência atualizados', xp:80, tipo:'operacao' },
  ],
  'SM_clientes': [
    { id:'smc_cal',    icon:'📆', titulo:'Calendário de cliente',    desc:'Planejamento de 1+ cliente entregue com 7 dias de antecedência', xp:100, tipo:'entrega' },
    { id:'smc_post',   icon:'📱', titulo:'5 posts publicados',       desc:'Publicar 5+ posts para clientes na semana',                xp:90,  tipo:'criativo'  },
    { id:'smc_copy',   icon:'✍️', titulo:'Copy com gancho em tudo',  desc:'Todo post com hook + CTA no período',                      xp:80,  tipo:'criativo'  },
    { id:'smc_streak', icon:'🔥', titulo:'Streak ativo',             desc:'Entregou algo nas últimas 2 semanas',                      xp:60,  tipo:'streak'    },
    { id:'smc_grade',  icon:'✅', titulo:'Zero furos na grade',      desc:'Todos os posts do período publicados sem falha de horário', xp:120, tipo:'perfeito'  },
  ],
  'SDR': [
    { id:'sdr_prop',   icon:'📤', titulo:'Proposta no mesmo dia',    desc:'Enviar proposta comercial no mesmo dia do lead quente',     xp:100, tipo:'vendas'    },
    { id:'sdr_follow', icon:'🔄', titulo:'5 follow-ups feitos',      desc:'Realizar 5 follow-ups com leads na semana',                xp:90,  tipo:'operacao'  },
    { id:'sdr_reun',   icon:'📅', titulo:'1 reunião agendada',       desc:'Agendar 1+ reunião com prospect na semana',                xp:80,  tipo:'entrega'   },
    { id:'sdr_streak', icon:'🔥', titulo:'Streak ativo',             desc:'Entregou algo nas últimas 2 semanas',                      xp:60,  tipo:'streak'    },
    { id:'sdr_crm',    icon:'🗂️', titulo:'Pipeline sem pendência',   desc:'Todos os leads com status e próximo passo definidos',      xp:80,  tipo:'crm'       },
  ],
  'Administrador': [
    { id:'adm_fin',    icon:'💰', titulo:'Financeiro atualizado',    desc:'Contas e recebimentos do período sem pendência',           xp:100, tipo:'entrega'   },
    { id:'adm_com',    icon:'📋', titulo:'Comunicação registrada',   desc:'Atas e decisões importantes documentadas',                 xp:80,  tipo:'operacao'  },
    { id:'adm_task',   icon:'✅', titulo:'Tarefas no prazo',         desc:'Zero tarefas administrativas atrasadas',                   xp:90,  tipo:'perfeito'  },
    { id:'adm_streak', icon:'🔥', titulo:'Streak ativo',             desc:'Entregou algo nas últimas 2 semanas',                      xp:60,  tipo:'streak'    },
    { id:'adm_report', icon:'📊', titulo:'Relatório de equipe',      desc:'Resumo semanal da situação do time produzido',             xp:70,  tipo:'entrega'   },
  ],
  'Designer': [
    { id:'des_arte',   icon:'🎨', titulo:'2 artes entregues',         desc:'Concluir 2 tarefas criativas como done na semana',          xp:100, tipo:'criativo'  },
    { id:'des_brief',  icon:'📋', titulo:'Brief de campanha',         desc:'Criar ou revisar brief visual para 1+ cliente',             xp:90,  tipo:'entrega'   },
    { id:'des_feed',   icon:'✨', titulo:'Visual do feed planejado',  desc:'Planejar identidade visual do feed de 1+ cliente',          xp:80,  tipo:'criativo'  },
    { id:'des_streak', icon:'🔥', titulo:'Streak ativo',              desc:'Entregou algo nas últimas 2 semanas',                       xp:60,  tipo:'streak'    },
    { id:'des_revisao',icon:'✅', titulo:'Zero artes reprovadas',     desc:'Todas as artes entregues aprovadas sem retrabalho',         xp:120, tipo:'perfeito'  },
  ],
  'Gestor de Dados': [
    { id:'dad_dash',   icon:'📊', titulo:'Dashboard entregue',        desc:'Enviar 1 dashboard de performance para 1+ cliente',         xp:100, tipo:'entrega'   },
    { id:'dad_insight',icon:'💡', titulo:'3 insights documentados',   desc:'Registrar 3 insights de dados com recomendação de ação',    xp:90,  tipo:'operacao'  },
    { id:'dad_bench',  icon:'🎯', titulo:'Benchmarks atualizados',    desc:'Atualizar benchmarks de performance de 1+ cliente',         xp:80,  tipo:'operacao'  },
    { id:'dad_streak', icon:'🔥', titulo:'Streak ativo',              desc:'Entregou algo nas últimas 2 semanas',                       xp:60,  tipo:'streak'    },
    { id:'dad_sem_err',icon:'🛡️', titulo:'Sem dados desatualizados', desc:'Todos os indicadores da semana atualizados no prazo',       xp:110, tipo:'perfeito'  },
  ],
  'Web Designer': [
    { id:'web_lp',     icon:'🖥️', titulo:'1 LP criada/atualizada',   desc:'Entregar ou atualizar 1 landing page como done',            xp:100, tipo:'entrega'   },
    { id:'web_mobile', icon:'📱', titulo:'Responsividade testada',    desc:'Testar e validar mobile de 1+ página entregue',             xp:90,  tipo:'operacao'  },
    { id:'web_speed',  icon:'⚡', titulo:'Performance otimizada',     desc:'Otimizar carregamento de 1+ página (PageSpeed/Lighthouse)', xp:80,  tipo:'operacao'  },
    { id:'web_streak', icon:'🔥', titulo:'Streak ativo',              desc:'Entregou algo nas últimas 2 semanas',                       xp:60,  tipo:'streak'    },
    { id:'web_bug',    icon:'🧹', titulo:'Zero bugs em produção',     desc:'Nenhum bug ou quebra reportado nas páginas entregues',      xp:120, tipo:'perfeito'  },
  ],
  default: [
    { id:'def_ent',    icon:'📋', titulo:'Entrega da semana',        desc:'Concluir 1+ tarefa na semana',                             xp:80,  tipo:'entrega'   },
    { id:'def_col',    icon:'🤝', titulo:'Colaboração com o time',   desc:'Auxiliar ou interagir com outro membro',                   xp:70,  tipo:'operacao'  },
    { id:'def_streak', icon:'🔥', titulo:'Streak ativo',             desc:'Entregou algo nas últimas 2 semanas',                      xp:60,  tipo:'streak'    },
    { id:'def_perf',   icon:'🏆', titulo:'Sem atrasos',              desc:'Zero tarefas em atraso no período',                        xp:100, tipo:'perfeito'  },
  ],
}

function getMissoesForUser(userId, role) {
  if (userId === 'beatriz')   return MISSOES_POR_FUNCAO['SM_agencia']
  if (userId === 'ana_sm')    return MISSOES_POR_FUNCAO['SM_clientes']
  if (userId === 'geovana')   return MISSOES_POR_FUNCAO['Designer']
  if (userId === 'elieser')   return MISSOES_POR_FUNCAO['Gestor de Dados']
  if (userId === 'deivisson') return MISSOES_POR_FUNCAO['Web Designer']
  if (role === 'Gestor de Trafego' || role === 'Gestor de Tráfego') return MISSOES_POR_FUNCAO['Gestor de Trafego']
  if (role === 'Designer')          return MISSOES_POR_FUNCAO['Designer']
  if (role === 'Gestor de Dados')   return MISSOES_POR_FUNCAO['Gestor de Dados']
  if (role === 'Web Designer')      return MISSOES_POR_FUNCAO['Web Designer']
  if (role === 'SDR' || role === 'Vendas') return MISSOES_POR_FUNCAO['SDR']
  if (role === 'Administrador' || role === 'Admin' || role === 'Social Media') return MISSOES_POR_FUNCAO['Administrador']
  return MISSOES_POR_FUNCAO['default']
}

const MISSOES_KEY = 'trafegon_missoes_v2'
function loadMissoes() { try { return JSON.parse(localStorage.getItem(MISSOES_KEY)) || {} } catch { return {} } }
function saveMissoes(d) { localStorage.setItem(MISSOES_KEY, JSON.stringify(d)) }

function MissoesSemanais({ currentUser }) {
  const weekKey   = getWeekKeyFromDate(new Date())
  const missoes   = getMissoesForUser(currentUser?.id, currentUser?.role)
  const [checks, setChecks] = useState(() => loadMissoes())
  const weekChecks = checks[weekKey] || {}
  const xpGanho   = missoes.filter(m => weekChecks[m.id]).reduce((s, m) => s + m.xp, 0)
  const concluidas = missoes.filter(m => weekChecks[m.id]).length

  const funcaoLabel = (() => {
    if (currentUser?.id === 'beatriz') return 'Social Media — Agência'
    if (currentUser?.id === 'ana_sm')  return 'Social Media — Clientes'
    return currentUser?.role || 'Colaborador'
  })()

  function toggle(id) {
    const next = { ...checks, [weekKey]: { ...weekChecks, [id]: !weekChecks[id] } }
    setChecks(next)
    saveMissoes(next)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
      className="bg-white rounded-2xl p-6 mb-6"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
      <div className="flex items-center gap-2 mb-1">
        <Target size={16} style={{ color: '#ea8a29' }} />
        <p className="text-sm font-extrabold text-text">Missões da Semana</p>
        <span className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full"
          style={{ background: '#60a5fa18', color: '#60a5fa', border:'1px solid #60a5fa30' }}>
          {funcaoLabel}
        </span>
        <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-full"
          style={{ background: '#6eda2c18', color: '#6eda2c' }}>
          {concluidas}/{missoes.length} · <OnsToken size="xs" /> +{xpGanho} ons
        </span>
      </div>
      <p className="text-[10px] text-muted mb-4">Semana {weekKey} · Marque ao concluir — ons bônus acumulados no perfil</p>
      <div className="space-y-2">
        {missoes.map(m => {
          const done  = !!weekChecks[m.id]
          const color = MISSAO_COLORS[m.tipo] || '#8890b5'
          return (
            <button key={m.id} onClick={() => toggle(m.id)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all"
              style={{ background: done ? color + '12' : '#f7f8fc', border: `1px solid ${done ? color + '40' : 'transparent'}` }}>
              <span className="text-lg flex-shrink-0">{m.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold" style={{ color: done ? color : '#1c1f35', textDecoration: done ? 'line-through' : 'none' }}>
                  {m.titulo}
                </p>
                <p className="text-[10px] text-muted">{m.desc}</p>
              </div>
              <OnsDisplay value={m.xp} size="xs" className="flex-shrink-0" />
              <div className="w-5 h-5 rounded-md flex-shrink-0 flex items-center justify-center"
                style={{ background: done ? color : 'transparent', border: `2px solid ${done ? color : '#c8cde0'}` }}>
                {done && <span className="text-white text-[10px] font-extrabold">✓</span>}
              </div>
            </button>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Jornada de Graduação ────────────────────────────────────────

function JornadaGraduacao() {
  const [open, setOpen] = useState(false)

  const PILARES = [
    {
      icon: '🧠', titulo: 'Intelectual', cor: '#60a5fa',
      desc: 'Crescimento técnico por entregas',
      itens: ['Tarefa concluída → ons direto', 'Prioridade alta rende 25% mais', 'Variedade de tipos constrói especialidade', 'Badges por volume e qualidade'],
    },
    {
      icon: '❤️', titulo: 'Emocional', cor: '#f97316',
      desc: 'Resiliência medida pela consistência',
      itens: ['Streak 7+ semanas → ×1,1 ons', 'Streak 14+ semanas → ×1,2 ons', 'Performance ≥85% → avança faixa mais rápido', 'Zero atrasos → missão "perfeito" ativa'],
    },
    {
      icon: '🤝', titulo: 'Social', cor: '#6eda2c',
      desc: 'Legado construído com o tempo',
      itens: ['50 ons/mês de casa (bônus de tenure)', 'Missões de equipe e relacionamento', 'Tempo de serviço abre gates de faixa', 'Experientes iniciam em faixa superior'],
    },
  ]

  const FAIXAS_INFO = [
    { id:'branca', label:'Branca', cor:'#94a3b8', texto:'#1e293b', tempo:'Início',    req:'0 ons · 0 meses',
      significado:'Você começou. Cada entrega conta. Construa o hábito.',
      desbloqueia:'Missões semanais · Dashboard pessoal · Badges iniciais' },
    { id:'azul',   label:'Azul',   cor:'#3b82f6', texto:'#fff',    tempo:'6 meses',  req:'700 ons · 6 meses',
      significado:'Você tem consistência. Já se prova no campo.',
      desbloqueia:'Missões avançadas · Cartas incomuns na Arena · Trilha de especialização' },
    { id:'roxa',   label:'Roxa',   cor:'#7c3aed', texto:'#fff',    tempo:'18 meses', req:'2.500 ons · 18 meses',
      significado:'Você é referência. Outros aprendem com você.',
      desbloqueia:'Cartas raras na Arena · Placar especial · Missões de liderança' },
    { id:'marrom', label:'Marrom', cor:'#92400e', texto:'#fff',    tempo:'3 anos',   req:'5.500 ons · 36 meses',
      significado:'Você molda o time. Sua voz muda decisões.',
      desbloqueia:'Cartas épicas · Mentor status · Bônus de performance' },
    { id:'preta',  label:'Preta',  cor:'#0f172a', texto:'#e2e8f0', tempo:'5+ anos',  req:'7.500 ons · 60 meses',
      significado:'Você é a TráfegOn. Seu legado é o padrão.',
      desbloqueia:'Tudo desbloqueado · Cartas lendárias · Faixa permanente vitalícia' },
  ]

  const FONTES = [
    { icon:'🖥️', label:'Landing Page',   ons:'3', mult:true  },
    { icon:'🎬', label:'Vídeo',           ons:'3', mult:true  },
    { icon:'📢', label:'Campanha',        ons:'3', mult:true  },
    { icon:'✍️', label:'Copy',            ons:'2', mult:true  },
    { icon:'🎨', label:'Criativo',        ons:'2', mult:true  },
    { icon:'📅', label:'Reunião',         ons:'2', mult:true  },
    { icon:'🔄', label:'Rotina diária',   ons:'1', mult:true  },
    { icon:'📋', label:'Missão semanal',  ons:'60–120', mult:false },
  ]

  return (
    <div className="mb-6">
      {/* Botão toggle */}
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-left transition-all"
        style={{ background:'linear-gradient(135deg,#12141e,#1e1250)', boxShadow:'0 4px 20px rgba(10,10,30,0.2)', border:'1px solid rgba(110,218,44,0.2)' }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize:20 }}>🥋</span>
          <div>
            <p className="text-sm font-extrabold text-white leading-tight">Jornada de Graduação TráfegOn</p>
            <p className="text-[10px] font-medium" style={{ color:'rgba(255,255,255,0.4)' }}>
              Como ons, faixas, missões e cartas se conectam
            </p>
          </div>
        </div>
        <ChevronDown size={16} style={{ color:'#6eda2c', flexShrink:0, transform: open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ height:0, opacity:0 }} animate={{ height:'auto', opacity:1 }} exit={{ height:0, opacity:0 }}
            className="overflow-hidden">
            <div className="mt-3 space-y-4">

              {/* ── MANIFESTO ── */}
              <div className="rounded-2xl px-5 py-4"
                style={{ background:'linear-gradient(135deg,#0d0f1a,#161b35)', border:'1px solid rgba(110,218,44,0.15)' }}>
                <p className="text-xs font-extrabold text-white mb-1">
                  "Aqui o crescimento é real, visível e conquistado."
                </p>
                <p className="text-[10px] leading-relaxed" style={{ color:'rgba(255,255,255,0.45)' }}>
                  Na TráfegOn, sua evolução tem cor, peso e história. Cada tarefa concluída,
                  cada semana consistente, cada mês de casa — tudo vira Ons. Os Ons se transformam
                  em faixa, a faixa reflete quem você é. As cartas colecionáveis são o reconhecimento
                  do destaque em aspectos específicos — e podem acelerar sua jornada.
                </p>
              </div>

              {/* ── FLUXO CENTRAL ── */}
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow:'0 2px 12px rgba(26,29,46,0.08)' }}>
                <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-4">Como tudo se conecta</p>
                <div className="flex items-start gap-1 overflow-x-auto pb-1">
                  {[
                    { icon:'⚡', label:'Atividades', sub:'tarefas · missões · consistência', cor:'#6eda2c' },
                    { arrow:true },
                    { icon:'🪙', label:'Ons', sub:'moeda universal de evolução', cor:'#fbbf24' },
                    { arrow:true },
                    { icon:'🥋', label:'Graduação', sub:'faixa reflete desenvolvimento real', cor:'#be29ec' },
                    { arrow:true, branch:true },
                  ].map((item, i) => item.arrow ? (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center pt-3 gap-1">
                      <span style={{ fontSize:16, color:'#c8cde0' }}>{item.branch ? '⇒' : '→'}</span>
                    </div>
                  ) : (
                    <div key={i} className="flex-shrink-0 flex flex-col items-center gap-1 min-w-[70px] text-center">
                      <div style={{ width:40, height:40, borderRadius:12, background:item.cor+'18', border:`1.5px solid ${item.cor}40`,
                        display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>
                        {item.icon}
                      </div>
                      <p style={{ fontSize:10, fontWeight:800, color:item.cor }}>{item.label}</p>
                      <p style={{ fontSize:7.5, color:'#8890b5', lineHeight:1.3 }}>{item.sub}</p>
                    </div>
                  ))}
                  {/* Ramificações */}
                  <div className="flex-shrink-0 flex flex-col gap-2 pt-1">
                    {[
                      { icon:'🎯', label:'Missões', sub:'bônus semanais por role', cor:'#ea8a29' },
                      { icon:'⚔️', label:'Arena', sub:'cartas que aceleram progresso', cor:'#60a5fa' },
                      { icon:'🏆', label:'Copa 2026', sub:'100k ons → cartas permanentes', cor:'#fbbf24' },
                    ].map(b => (
                      <div key={b.label} className="flex items-center gap-2 px-3 py-1.5 rounded-xl"
                        style={{ background:b.cor+'10', border:`1px solid ${b.cor}25` }}>
                        <span style={{ fontSize:13 }}>{b.icon}</span>
                        <div>
                          <p style={{ fontSize:10, fontWeight:800, color:b.cor, lineHeight:1.1 }}>{b.label}</p>
                          <p style={{ fontSize:7.5, color:'#8890b5' }}>{b.sub}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── 3 PILARES ── */}
              <div>
                <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-3 px-1">
                  Os 3 pilares do desenvolvimento
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {PILARES.map(p => (
                    <div key={p.titulo} className="rounded-2xl p-4"
                      style={{ background:p.cor+'0d', border:`1.5px solid ${p.cor}30` }}>
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ fontSize:20 }}>{p.icon}</span>
                        <div>
                          <p style={{ fontSize:11, fontWeight:900, color:p.cor, lineHeight:1 }}>{p.titulo}</p>
                          <p style={{ fontSize:8.5, color:'#8890b5', lineHeight:1.2 }}>{p.desc}</p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {p.itens.map(item => (
                          <div key={item} className="flex items-start gap-1.5">
                            <span style={{ fontSize:7, color:p.cor, marginTop:2, flexShrink:0 }}>▸</span>
                            <p style={{ fontSize:9, color:'#555b7a', lineHeight:1.4 }}>{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── COMO GANHAR ONS ── */}
              <div className="bg-white rounded-2xl p-5" style={{ boxShadow:'0 2px 12px rgba(26,29,46,0.08)' }}>
                <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-3">Como ganhar ons</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-3">
                  {FONTES.map(f => (
                    <div key={f.label} className="flex items-center gap-2 px-3 py-2 rounded-xl" style={{ background:'#f7f8fc' }}>
                      <span className="text-sm flex-shrink-0">{f.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p style={{ fontSize:10, fontWeight:700, color:'#1c1f35' }}>{f.label}</p>
                        {f.mult && <p style={{ fontSize:7.5, color:'#8890b5' }}>× prioridade</p>}
                      </div>
                      <span style={{ fontSize:10, fontWeight:900, color:'#be29ec', flexShrink:0 }}>{f.ons}</span>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="rounded-xl px-3 py-2" style={{ background:'#ea8a2910', border:'1px solid #ea8a2925' }}>
                    <p style={{ fontSize:9, fontWeight:800, color:'#ea8a29' }}>🔥 Multiplicador de Streak</p>
                    <p style={{ fontSize:8.5, color:'#6b7a9a', marginTop:2 }}>7+ semanas → ×1,1 · 14+ semanas → ×1,2 em todas as tarefas</p>
                  </div>
                  <div className="rounded-xl px-3 py-2" style={{ background:'#6eda2c10', border:'1px solid #6eda2c25' }}>
                    <p style={{ fontSize:9, fontWeight:800, color:'#6eda2c' }}>📅 Bônus de Tempo de Casa</p>
                    <p style={{ fontSize:8.5, color:'#6b7a9a', marginTop:2 }}>50 ons por mês de agência · abre gates de faixa automaticamente</p>
                  </div>
                </div>
              </div>

              {/* ── TIMELINE DE FAIXAS ── */}
              <div>
                <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-3 px-1">
                  Linha do tempo das faixas
                </p>
                <div className="space-y-2">
                  {FAIXAS_INFO.map((f, i) => (
                    <div key={f.id} className="rounded-2xl overflow-hidden"
                      style={{ border:`1.5px solid ${f.cor}35` }}>
                      {/* Header colorido */}
                      <div className="flex items-center gap-3 px-4 py-3"
                        style={{ background: f.id === 'preta'
                          ? 'linear-gradient(135deg,#0f172a,#1e293b)'
                          : `linear-gradient(135deg,${f.cor}22,${f.cor}10)` }}>
                        <span style={{
                          background: f.cor, color: f.texto,
                          padding:'2px 10px', borderRadius:4,
                          fontSize:10, fontWeight:900, letterSpacing:'0.05em',
                          border: f.id === 'branca' ? '1px solid #cbd5e1' : 'none',
                          flexShrink:0,
                        }}>
                          {f.label.toUpperCase()}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p style={{ fontSize:11, fontWeight:800,
                            color: f.id === 'preta' ? '#e2e8f0' : '#1a1d2e',
                            lineHeight:1.1 }}>
                            {f.significado}
                          </p>
                        </div>
                        <div className="text-right flex-shrink-0 hidden sm:block">
                          <p style={{ fontSize:8, fontWeight:800, color:f.cor, opacity:0.85 }}>{f.tempo}</p>
                        </div>
                      </div>
                      {/* Body */}
                      <div className="px-4 py-2.5 bg-white flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="flex-1">
                          <p style={{ fontSize:8.5, color:'#6b7a9a' }}>
                            <span style={{ fontWeight:700, color:'#8890b5' }}>Requisito: </span>
                            {f.req}
                          </p>
                        </div>
                        <div style={{ borderLeft:'1px solid #e0e3f0', paddingLeft:12 }} className="hidden sm:block">
                          <p style={{ fontSize:8, fontWeight:700, color:'#6b7a9a' }}>
                            <span style={{ color:f.cor }}>✦ </span>{f.desbloqueia}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── CARTAS: O PARALELO ── */}
              <div className="rounded-2xl p-5"
                style={{ background:'linear-gradient(135deg,#0a0700,#1a1200)', border:'1.5px solid rgba(200,154,0,0.3)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <span style={{ fontSize:18 }}>⚔️</span>
                  <p style={{ fontSize:12, fontWeight:900, color:'#fde68a' }}>Cartas — o caminho paralelo</p>
                </div>
                <p style={{ fontSize:9.5, color:'rgba(255,255,255,0.55)', lineHeight:1.6, marginBottom:12 }}>
                  As cartas da Arena e da Copa não substituem a jornada — elas a <strong style={{ color:'rgba(255,255,255,0.8)' }}>aceleram e destacam</strong>.
                  Cada carta representa um aspecto específico em que o membro se destacou.
                  Ter uma carta rara é reconhecimento público de uma competência real.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { icon:'⚔️', label:'Arena (cartas de missão)',   desc:'Ganhas completando tarefas da Arena · desbloqueiam com ons', cor:'#60a5fa' },
                    { icon:'🌟', label:'Benefício das cartas',        desc:'Cartas épicas e lendárias aceleram progresso de faixa e multiplicam ons em áreas específicas', cor:'#be29ec' },
                    { icon:'⚽', label:'Copa 2026 (edição limitada)', desc:'100k ons · permanentes · holográficas · escassas · uma por membro da equipe', cor:'#fbbf24' },
                  ].map(c => (
                    <div key={c.label} className="rounded-xl p-3" style={{ background:`${c.cor}12`, border:`1px solid ${c.cor}25` }}>
                      <p style={{ fontSize:10, fontWeight:800, color:c.cor, marginBottom:4 }}>{c.icon} {c.label}</p>
                      <p style={{ fontSize:8.5, color:'rgba(255,255,255,0.45)', lineHeight:1.45 }}>{c.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── BADGES ── */}
              <div className="bg-white rounded-2xl p-4" style={{ boxShadow:'0 2px 12px rgba(26,29,46,0.08)' }}>
                <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-3">Badges desbloqueáveis</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    ['🎯','1ª entrega'],['🚀','5 entregas'],['⚡','10 entregas'],['🏆','25 entregas'],['👑','50 entregas'],
                    ['🔥','3 sem.'],['💥','6 sem.'],['🌟','12 sem. streak'],
                    ['🥉','Faixa Azul'],['💎','Faixa Roxa'],['🔮','Faixa Marrom'],['⚜️','Faixa Preta'],['🦅','Preta 4 graus'],
                    ['🖥️','3 LPs'],['🎨','5 criativos'],['📢','3 campanhas'],['✍️','5 copies'],['🎬','3 vídeos'],
                  ].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background:'#f0f1f7', border:'1px solid #e0e3f0' }}>
                      <span style={{ fontSize:12 }}>{icon}</span>
                      <span style={{ fontSize:8.5, color:'#8890b5', fontWeight:600 }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ── Meta Mensal — Faixa Branca ─────────────────────────────────

const META_BRANCA_ONS = 5000

function MetaMensalBranca({ members }) {
  if (!members.length) return null

  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
  const mesLabel = mes.charAt(0).toUpperCase() + mes.slice(1)
  const totalEquipe = members.reduce((s, m) => s + (m.onsThisMonth || 0), 0)
  const pctEquipe   = Math.min(100, Math.round((totalEquipe / (META_BRANCA_ONS * members.length)) * 100))

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
      className="bg-white rounded-2xl p-5 mb-6"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: '#94a3b818', border: '1.5px solid #94a3b840' }}>
            <span style={{ fontSize: 16 }}>🎯</span>
          </div>
          <div>
            <p className="text-sm font-extrabold text-text leading-tight">Meta do Mês — Faixa Branca</p>
            <p className="text-[10px] text-muted">{mesLabel} · objetivo: 5.000 ons por membro</p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="text-xs font-extrabold" style={{ color: pctEquipe >= 100 ? '#6eda2c' : pctEquipe >= 50 ? '#f59e0b' : '#8890b5' }}>
            {pctEquipe}% da equipe
          </p>
          <p className="text-[9px] text-muted">{totalEquipe.toLocaleString('pt-BR')} / {(META_BRANCA_ONS * members.length).toLocaleString('pt-BR')} ons</p>
        </div>
      </div>

      {/* Membros */}
      <div className="space-y-3">
        {members.map((m, i) => {
          const ons  = m.onsThisMonth || 0
          const pct  = Math.min(100, Math.round((ons / META_BRANCA_ONS) * 100))
          const done = pct >= 100
          const barColor = done ? '#6eda2c' : pct >= 60 ? '#f59e0b' : pct >= 30 ? '#60a5fa' : '#94a3b8'

          return (
            <div key={m.id}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg overflow-hidden flex-shrink-0"
                    style={{ background: `linear-gradient(135deg,${m.color},${m.color}80)` }}>
                    <Avatar collab={m} className="w-full h-full" style={{}} />
                  </div>
                  <span className="text-xs font-bold text-text">{m.name}</span>
                  {done && <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                    style={{ background: '#6eda2c18', color: '#6eda2c' }}>✓ Meta batida!</span>}
                </div>
                <div className="flex items-center gap-2 text-right">
                  <span className="text-[10px] font-extrabold" style={{ color: barColor }}>
                    {ons.toLocaleString('pt-BR')} ons
                  </span>
                  <span className="text-[9px] text-muted w-8 text-right">{pct}%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: barColor + '20' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: done
                    ? 'linear-gradient(90deg,#6eda2c,#a8f040)'
                    : `linear-gradient(90deg,${barColor}aa,${barColor})` }}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: 0.3 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Rodapé motivacional */}
      <p className="text-[9px] text-muted text-center mt-4 italic">
        {pctEquipe === 0
          ? 'O mês começa agora. Cada entrega conta. 💪'
          : pctEquipe >= 100
            ? '🏆 Equipe com meta batida este mês!'
            : `${members.filter(m => (m.onsThisMonth || 0) >= META_BRANCA_ONS).length} de ${members.length} membros bateram a meta · continue entregando`}
      </p>
    </motion.div>
  )
}

// ── Leaderboard completo ────────────────────────────────────────

function LeaderboardList({ sorted }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 mb-6"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} style={{ color: '#ef4444' }} />
        <p className="text-sm font-extrabold text-text">Leaderboard ons</p>
        <span className="text-[10px] text-muted ml-1">ranking completo</span>
      </div>
      <div className="space-y-2">
        {sorted.map((c, i) => {
          const medals = ['🥇','🥈','🥉']
          const pct = Math.min(100, Math.round((c.xp / (sorted[0]?.xp || 1)) * 100))
          const streakBonus = c.streak >= 14 ? '×1,2' : c.streak >= 7 ? '×1,1' : null
          return (
            <div key={c.id} className="flex items-center gap-3">
              <span className="w-6 text-center text-sm font-extrabold flex-shrink-0"
                style={{ color: ['#f59e0b','#94a3b8','#b45309'][i] || '#8890b5' }}>
                {medals[i] || `#${i+1}`}
              </span>
              <Avatar collab={c}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 overflow-hidden"
                style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-text">{c.name}</span>
                    <BeltBadge beltId={c.belt?.id} grau={c.grau} size="xs" />
                    {streakBonus && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: '#ea8a2918', color: '#ea8a29' }}>🔥 {streakBonus}</span>
                    )}
                  </div>
                  <span className="text-xs font-extrabold" style={{ color: c.color }}>
                    <OnsDisplay value={c.xp} size="sm" />
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.color + '20' }}>
                  <motion.div className="h-full rounded-full" style={{ background: c.color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: 0.1 + i * 0.07, ease: [0.22,1,0.36,1] }} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-[10px] font-bold text-muted">{c.streak} sem 🔥</p>
                <p className="text-[9px] text-muted/60">{c.tasksCompleted} tarefas</p>
              </div>
            </div>
          )
        })}
      </div>
    </motion.div>
  )
}

// ── Avatar (SVG ilustrado, foto ou iniciais) ────────────────────
function Avatar({ collab, className = '', style = {} }) {
  const SvgComp = getAvatarComponent(collab.id) || getAvatarComponent(collab.email)
  if (SvgComp) {
    return (
      <div className={className} style={{ ...style, overflow: 'hidden', padding: 0 }}>
        <SvgComp />
      </div>
    )
  }
  if (collab.photoUrl) {
    return (
      <img src={collab.photoUrl} alt={collab.name} className={className}
        style={{ objectFit: 'cover', ...style }} />
    )
  }
  return (
    <div className={className} style={style}>
      {collab.avatar}
    </div>
  )
}

// ── Sub-componentes ────────────────────────────────────────────

function XpBar({ xp, xpInLevel, xpLevelSpan, xpRemaining, nextRank, color, belt, grau,
  canLevelUp, xpNeeded, mthsNeeded, performancePct, performanceOk }) {
  const pct    = Math.min(100, Math.round((xpInLevel / Math.max(1, xpLevelSpan)) * 100))
  const beltColor = belt?.color || color
  const ready  = canLevelUp

  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <OnsDisplay value={xp} size="sm" color="#8890b5" />
        <span className="font-bold" style={{ color: beltColor }}>
          {nextRank
            ? `${xpRemaining.toLocaleString('pt-BR')} ons → ${nextRank}`
            : '⚫ Faixa máxima'}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: beltColor + '25' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: ready
            ? `linear-gradient(90deg,#6eda2c,#a8f040)`
            : `linear-gradient(90deg,${beltColor},${beltColor}bb)` }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="text-[9px] mt-0.5 text-muted/60">{xpInLevel.toLocaleString('pt-BR')} ons neste grau · {pct}%</div>

      {nextRank && (xpNeeded > 0 || mthsNeeded > 0) && (
        <div className="mt-2 rounded-xl px-3 py-2 flex items-start gap-2"
          style={{ background: '#f59e0b10', border: '1px solid #f59e0b30' }}>
          <span className="text-sm flex-shrink-0">🔒</span>
          <div className="flex gap-3 mt-0.5 flex-wrap">
            {xpNeeded > 0 && (
              <span className="text-[9px] font-bold" style={{ color: '#f59e0b' }}>
                ○ {xpNeeded.toLocaleString('pt-BR')} ons para próxima faixa
              </span>
            )}
            {mthsNeeded > 0 && (
              <span className="text-[9px] font-bold" style={{ color: '#f59e0b' }}>
                ○ {mthsNeeded} mes{mthsNeeded > 1 ? 'es' : ''} restante{mthsNeeded > 1 ? 's' : ''}
              </span>
            )}
            <span className="text-[9px] font-bold" style={{ color: performanceOk ? '#6eda2c' : '#f59e0b' }}>
              {performanceOk ? '✓' : '○'} Performance: {performancePct}%
            </span>
          </div>
        </div>
      )}
      {ready && nextRank && (
        <div className="mt-2 rounded-xl px-3 py-2 flex items-center gap-2"
          style={{ background: '#6eda2c12', border: '1px solid #6eda2c40' }}>
          <span className="text-sm">🚀</span>
          <p className="text-[10px] font-extrabold" style={{ color: '#6eda2c' }}>Pronto para a próxima faixa!</p>
        </div>
      )}
    </div>
  )
}

function GrauPips({ belt, grau, color }) {
  const maxGrau = belt?.grauXp?.length || 4
  return (
    <div className="flex gap-1 items-center">
      {Array.from({ length: maxGrau }).map((_, i) => {
        const filled = i < grau
        const beltColor = belt?.color || color
        return (
          <div key={i} className="w-3.5 h-1.5 rounded-full transition-all"
            style={{ backgroundColor: filled ? beltColor : beltColor + '25' }} />
        )
      })}
    </div>
  )
}

function PodiumCard({ collab, position, delay }) {
  const heights = { 1: 'h-16 lg:h-24', 2: 'h-12 lg:h-16', 3: 'h-8 lg:h-10' }
  const medals  = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const sizes   = { 1: 'w-12 h-12 lg:w-14 lg:h-14 text-sm lg:text-base', 2: 'w-10 h-10 lg:w-12 lg:h-12 text-xs lg:text-sm', 3: 'w-9 h-9 lg:w-10 lg:h-10 text-xs' }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center gap-1.5 lg:gap-2"
    >
      <div className="relative">
        <Avatar collab={collab}
          className={`${sizes[position]} rounded-2xl flex items-center justify-center font-extrabold text-white overflow-hidden`}
          style={{ background: `linear-gradient(135deg, ${collab.color}, ${collab.color}80)`, boxShadow: `0 8px 24px ${collab.color}40` }}
        />
        <div className="absolute -top-2 -right-2 text-base lg:text-lg">{medals[position]}</div>
      </div>
      <p className="text-[11px] lg:text-xs font-bold text-text text-center truncate w-full px-1">{collab.name.split(' ')[0]}</p>
      <BeltBadge beltId={collab.belt?.id} grau={collab.grau} size="xs" />
      <p className="text-xs lg:text-sm font-extrabold" style={{ color: collab.color }}>
        <OnsDisplay value={collab.xp} size="sm" />
      </p>
      <div className="flex gap-1 flex-wrap justify-center">
        {collab.streakMult > 1 && (
          <span className="text-[8px] lg:text-[9px] font-bold px-1 lg:px-1.5 py-0.5 rounded-md" style={{ background: '#ea8a2918', color: '#ea8a29' }}>
            🔥 ×{collab.streakMult.toFixed(1)}
          </span>
        )}
      </div>
      <div className={`${heights[position]} w-full rounded-t-xl opacity-30`} style={{ backgroundColor: collab.color }} />
    </motion.div>
  )
}

function CollabCard({ collab, index }) {
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
          <Avatar collab={collab} className="w-full h-full" style={{}} />
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
          <BeltBadge beltId={collab.belt?.id} grau={collab.grau} size="sm" />
        </div>
      </div>

      {/* Grau pips + próximo */}
      <div className="flex items-center gap-2 mb-2">
        <GrauPips belt={collab.belt} grau={collab.grau} color={collab.color} />
        <span className="text-[9px] text-muted ml-auto">
          {collab.nextRank ? `→ ${collab.xpRemaining.toLocaleString('pt-BR')} ons para ${collab.nextRank}` : '⚫ Faixa máxima'}
        </span>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <XpBar xp={collab.xp} xpInLevel={collab.xpInLevel} xpLevelSpan={collab.xpLevelSpan}
          xpRemaining={collab.xpRemaining} nextRank={collab.nextRank} color={collab.color}
          belt={collab.belt} grau={collab.grau}
          canLevelUp={collab.canLevelUp} xpNeeded={collab.xpNeeded} mthsNeeded={collab.mthsNeeded}
          performancePct={collab.performancePct} performanceOk={collab.performanceOk} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Trophy,     label: 'Concluídas',   value: collab.tasksCompleted, color: '#6eda2c' },
          { icon: TrendingUp, label: 'Em andamento',  value: collab.doingCount,     color: '#60a5fa' },
          { icon: Flame,      label: collab.streakMult > 1 ? `Streak ×${collab.streakMult.toFixed(1)}` : 'Streak', value: `${collab.streak}sem`, color: '#ea8a29' },
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
            <OnsGain value={collab.newXp} className="ml-auto" />
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

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}') } catch { return {} }
  }, [])

  // Aplica o motor de gamificação em todos os colaboradores
  const enriched = useMemo(
    () => collaborators.map(c => computeStats(c, tasks)),
    [collaborators, tasks]
  )

  const sorted  = [...enriched].sort((a, b) => b.xp - a.xp)
  const [first, second, third, ...rest] = sorted
  const podium    = [second, first, third].filter(Boolean)
  const podiumPos = [2, 1, 3]

  const brancaMembers = enriched
    .filter(c => c.belt?.id === 'branca')
    .sort((a, b) => (b.onsThisMonth || 0) - (a.onsThisMonth || 0))

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
            { label: 'ons da equipe', value: `${(totalXP/1000).toFixed(1)}k`, color: '#6eda2c', emoji: null },
            { label: 'Streak médio',       value: `${avgStreak} sem`,              color: '#ea8a29', emoji: '🔥' },
          ].map((m, i) => (
            <motion.div key={m.label}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-xl px-4 py-3 flex items-center gap-3"
              style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.04)' }}
            >
              {m.emoji ? <span className="text-xl">{m.emoji}</span> : <OnsToken size="md" />}
              <div>
                <p className="text-base font-extrabold" style={{ color: m.color }}>{m.value}</p>
                <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">{m.label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Como ganhar ons */}
      <JornadaGraduacao />

      {/* Missões da semana */}
      <MissoesSemanais currentUser={currentUser} />

      {/* Legenda de níveis */}
      <motion.div
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="bg-white rounded-2xl px-4 py-3 mb-6 overflow-x-auto"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.04)' }}
      >
        <div className="flex items-center gap-3 flex-nowrap min-w-max">
          <span className="text-[10px] font-extrabold text-muted uppercase tracking-widest mr-1">Faixas</span>
          {BELTS.map((b, i) => (
            <div key={b.id} className="flex items-center gap-1.5 flex-shrink-0">
              <BeltBadge beltId={b.id} grau={0} size="xs" />
              <span className="text-[9px] text-muted/60 hidden sm:inline">{b.xpMin.toLocaleString()}+ ons · {b.monthsMin}m+</span>
              {i < BELTS.length - 1 && <span className="text-muted/30 text-xs ml-0.5">·</span>}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pódio */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-4 lg:p-8 mb-8 overflow-hidden"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Trophy size={16} className="text-accent" />
          <p className="text-sm font-extrabold text-text">Ranking ons</p>
          <span className="text-[10px] text-muted ml-2 hidden sm:inline">ons = tarefas × tipo × prioridade</span>
        </div>
        <div className="flex items-end justify-center gap-3 lg:gap-8 px-2 lg:px-8">
          {podium.map((c, i) => c && (
            <div key={c.id} className="flex-1 max-w-[110px] lg:max-w-[140px]">
              <PodiumCard collab={c} position={podiumPos[i]} delay={0.3 + i * 0.1} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Meta Mensal — Faixa Branca */}
      <MetaMensalBranca members={brancaMembers} />

      {/* Leaderboard completo */}
      <LeaderboardList sorted={sorted} />

      {/* Ranking Carteira × Tempo */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-6 mb-8"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <Star size={16} style={{ color: '#ea8a29' }} />
          <p className="text-sm font-extrabold text-text">Carteira × Tempo de Casa</p>
          <span className="text-[10px] text-muted hidden sm:inline">(R$ gerenciado × meses na agência)</span>
        </div>
        <div className="space-y-3">
          {carteiraRanking.map((c, i) => {
            const fmtV = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
            const pct = Math.round((c.score / maxScore) * 100)
            return (
              <div key={c.id} className="flex items-center gap-3">
                <span className="w-5 text-center text-sm font-extrabold flex-shrink-0"
                  style={{ color: ['#f59e0b','#94a3b8','#b45309'][i] || '#8890b5' }}>
                  {['🥇','🥈','🥉'][i] || `#${i+1}`}
                </span>
                <Avatar collab={c}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: c.color }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1 gap-2">
                    <span className="text-xs font-bold text-text truncate">{c.name}</span>
                    <span className="text-[9px] font-bold text-muted flex-shrink-0">
                      <span className="hidden sm:inline">{fmtV(c.carteira)}/mês × {c.months}m = </span>
                      <span style={{ color: c.color }}>{(c.score/1000).toFixed(0)}k pts</span>
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
