import { useMemo, useState } from 'react'
import { getAvatarComponent } from '../../data/avatars'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Zap, TrendingUp, Star, Target, ChevronDown } from 'lucide-react'
import { taskTypes } from '../../data/erp-mock'
import { useData } from '../../contexts/DataContext'

// ── Gamification Engine ────────────────────────────────────────

const LEVELS = [
  { level: 1, min: 0,     xpToNext: 500,   rank: 'Aprendiz' },
  { level: 2, min: 500,   xpToNext: 1500,  rank: 'Trainee'  },
  { level: 3, min: 1500,  xpToNext: 3500,  rank: 'Junior'   },
  { level: 4, min: 3500,  xpToNext: 6500,  rank: 'Pleno'    },
  { level: 5, min: 6500,  xpToNext: 11000, rank: 'Sênior'   },
  { level: 6, min: 11000, xpToNext: 17000, rank: 'Expert'   },
  { level: 7, min: 17000, xpToNext: 25000, rank: 'Elite'    },
  { level: 8, min: 25000, xpToNext: 25000, rank: 'Lenda ✦'  },
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
  if (tasksCompleted >= 50)        b.push('👑')
  if (streak >= 3)                 b.push('🔥')
  if (streak >= 6)                 b.push('💥')
  if (streak >= 12)                b.push('🌟')
  if (xp >= 500)                   b.push('🥉')
  if (xp >= 1500)                  b.push('💎')
  if (xp >= 6500)                  b.push('🔮')
  if (xp >= 11000)                 b.push('⚜️')
  if (xp >= 25000)                 b.push('🦅')
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

  // XP: apenas tarefas concluídas após xpResetAt — legacy ignorado
  const newXp = done.reduce((sum, t) => {
    const base = taskTypes[t.type]?.xp || 50
    const mult = PRIORITY_MULT[t.priority] || 1.0
    return sum + Math.round(base * mult)
  }, 0)

  const streakMult = newXp > 0 ? (done.length >= 14 ? 1.2 : done.length >= 7 ? 1.1 : 1.0) : 1.0
  const xp = Math.round(newXp * streakMult)

  const lvl     = getLvl(xp)
  const nextLvl = LEVELS.find(l => l.level === lvl.level + 1)
  const xpInLevel   = xp - lvl.min
  const xpLevelSpan = nextLvl ? nextLvl.min - lvl.min : 1
  const xpRemaining = nextLvl ? nextLvl.min - xp : 0
  const nextRank    = nextLvl?.rank || null

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
  const tasksCompleted = done.length
  const tasksThisMonth = done.filter(t => (t.dueDate || t.createdAt || '').startsWith(ym)).length

  // Streak: calculado apenas a partir das tarefas após reset
  const streak = done.length ? calcStreak(done) : 0

  // Badges dinâmicos
  const badges = calcBadges(tasksCompleted, xp, streak, deliveriesByType)

  return {
    ...collab,
    xp, level: lvl.level, rank: lvl.rank,
    xpInLevel, xpLevelSpan, xpRemaining, nextRank, streakMult,
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
                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-muted">3 semanas seguidas</span>
                  </div>
                  {RECOMPENSAS.map((r, i) => (
                    <div key={r.range} className={`grid grid-cols-3 px-3 py-2.5 gap-2 ${i % 2 === 0 ? '' : 'bg-surface/40'}`}>
                      <span className="text-[11px] font-extrabold" style={{ color: r.color }}>{r.range}</span>
                      <span className="text-[10px] text-text">{r.semanal}</span>
                      <span className="text-[10px] text-text">{r.mensal}</span>
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




// ── Missões Semanais ───────────────────────────────────────────

const MISSOES = [
  { id: 'm1', icon: '📋', titulo: 'Relatório na semana',       desc: 'Entregar pelo menos 1 relatório de cliente',         xp: 100, tipo: 'entrega'   },
  { id: 'm2', icon: '⚙️', titulo: '3 otimizações registradas', desc: 'Registrar 3 ou mais otimizações de campanha no hub', xp: 90,  tipo: 'operacao'  },
  { id: 'm3', icon: '🎨', titulo: '2 criativos concluídos',    desc: 'Entregar 2 tarefas do tipo Criativo como done',      xp: 80,  tipo: 'criativo'  },
  { id: 'm4', icon: '🔥', titulo: 'Manter streak ativo',       desc: 'Ter entregado algo nas últimas 2 semanas',           xp: 60,  tipo: 'streak'    },
  { id: 'm5', icon: '🏆', titulo: 'Mês sem falhas',            desc: 'Zero tarefas em atraso no período',                 xp: 150, tipo: 'perfeito'  },
]

const MISSAO_COLORS = { entrega: '#6eda2c', operacao: '#60a5fa', criativo: '#be29ec', streak: '#ea8a29', perfeito: '#f59e0b' }
const MISSOES_KEY = 'trafegon_missoes_v1'
function loadMissoes() { try { return JSON.parse(localStorage.getItem(MISSOES_KEY)) || {} } catch { return {} } }
function saveMissoes(d) { localStorage.setItem(MISSOES_KEY, JSON.stringify(d)) }

function MissoesSemanais() {
  const weekKey = getWeekKeyFromDate(new Date())
  const [checks, setChecks] = useState(() => loadMissoes())
  const weekChecks = checks[weekKey] || {}
  const xpGanho = MISSOES.filter(m => weekChecks[m.id]).reduce((s, m) => s + m.xp, 0)
  const concluidas = MISSOES.filter(m => weekChecks[m.id]).length

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
        <span className="ml-auto text-[10px] font-extrabold px-2 py-0.5 rounded-full"
          style={{ background: '#6eda2c18', color: '#6eda2c' }}>
          {concluidas}/{MISSOES.length} · +{xpGanho} XP
        </span>
      </div>
      <p className="text-[10px] text-muted mb-4">Semana {weekKey} · Marque ao concluir — XP bônus acumulado no perfil</p>
      <div className="space-y-2">
        {MISSOES.map(m => {
          const done = !!weekChecks[m.id]
          const color = MISSAO_COLORS[m.tipo]
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
              <span className="text-[10px] font-extrabold flex-shrink-0" style={{ color: done ? color : '#8890b5' }}>
                +{m.xp} XP
              </span>
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

// ── Como Ganhar XP ─────────────────────────────────────────────

function ComoGanharXP() {
  const [open, setOpen] = useState(false)
  const fontes = [
    { icon: '🖥️', label: 'Landing Page',    xp: '150 XP base', mult: true  },
    { icon: '🎬', label: 'Vídeo',            xp: '130 XP base', mult: true  },
    { icon: '📢', label: 'Campanha',         xp: '120 XP base', mult: true  },
    { icon: '✍️', label: 'Copy',             xp: '100 XP base', mult: true  },
    { icon: '🎨', label: 'Criativo',         xp: '80 XP base',  mult: true  },
    { icon: '📅', label: 'Reunião',          xp: '50 XP base',  mult: true  },
    { icon: '📋', label: 'Missão semanal',   xp: '60–150 XP',   mult: false },
  ]
  return (
    <div className="mb-6">
      <button onClick={() => setOpen(p => !p)}
        className="w-full flex items-center justify-between px-4 py-3 rounded-2xl bg-white text-left hover:shadow-sm transition-all"
        style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.06)' }}>
        <div className="flex items-center gap-2">
          <Zap size={14} style={{ color: '#be29ec' }} />
          <span className="text-sm font-extrabold text-text">Como ganhar XP</span>
        </div>
        <ChevronDown size={15} className="text-muted transition-transform" style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden">
            <div className="bg-white rounded-2xl mt-2 p-5"
              style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.05)' }}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                {fontes.map(f => (
                  <div key={f.label} className="flex items-center gap-3 px-3 py-2 rounded-xl" style={{ background: '#f7f8fc' }}>
                    <span className="text-base">{f.icon}</span>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-text">{f.label}</p>
                      {f.mult && <p className="text-[10px] text-muted">× prioridade: Alta 1,25 · Média 1,0 · Baixa 0,75</p>}
                    </div>
                    <span className="text-[11px] font-extrabold" style={{ color: '#be29ec' }}>{f.xp}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-xl p-3 space-y-1" style={{ background: '#ea8a2910', border: '1px solid #ea8a2930' }}>
                <p className="text-[10px] font-extrabold text-text">🔥 Bônus de Streak</p>
                <p className="text-[10px] text-muted">7+ semanas consecutivas → XP das tarefas ×1,1</p>
                <p className="text-[10px] text-muted">14+ semanas consecutivas → XP das tarefas ×1,2</p>
              </div>
              <div className="rounded-xl p-3 mt-2 space-y-1" style={{ background: '#6eda2c10', border: '1px solid #6eda2c30' }}>
                <p className="text-[10px] font-extrabold text-text">🏅 Badges desbloqueáveis</p>
                <div className="flex flex-wrap gap-2 mt-1">
                  {[['🎯','1ª tarefa'],['🚀','5 tarefas'],['⚡','10 tarefas'],['🏆','25 tarefas'],['👑','50 tarefas'],
                    ['🔥','3 sem. streak'],['💥','6 sem.'],['🌟','12 sem.'],
                    ['🥉','Trainee'],['💎','Junior'],['🔮','Sênior'],['⚜️','Expert'],['🦅','Lenda'],
                    ['🖥️','3 LPs'],['🎨','5 criativos'],['📢','3 campanhas'],['✍️','5 copies'],['🎬','3 vídeos'],
                  ].map(([icon, label]) => (
                    <div key={label} className="flex items-center gap-1 px-2 py-1 rounded-lg" style={{ background: '#f0f1f7' }}>
                      <span className="text-sm">{icon}</span>
                      <span className="text-[9px] text-muted font-medium">{label}</span>
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

// ── Leaderboard completo ────────────────────────────────────────

function LeaderboardList({ sorted }) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl p-6 mb-6"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Flame size={16} style={{ color: '#ef4444' }} />
        <p className="text-sm font-extrabold text-text">Leaderboard XP</p>
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
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-text">{c.name}</span>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: c.color + '18', color: c.color }}>{c.rank}</span>
                    {streakBonus && (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                        style={{ background: '#ea8a2918', color: '#ea8a29' }}>🔥 {streakBonus}</span>
                    )}
                  </div>
                  <span className="text-xs font-extrabold" style={{ color: c.color }}>
                    {c.xp.toLocaleString('pt-BR')} XP
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

function XpBar({ xp, xpInLevel, xpLevelSpan, xpRemaining, nextRank, color }) {
  const pct = Math.min(100, Math.round((xpInLevel / xpLevelSpan) * 100))
  return (
    <div>
      <div className="flex justify-between text-[10px] mb-1">
        <span className="text-muted font-medium">{xp.toLocaleString('pt-BR')} XP total</span>
        <span className="font-bold" style={{ color }}>
          {nextRank
            ? `${xpRemaining.toLocaleString('pt-BR')} XP → ${nextRank}`
            : '🦅 Nível máximo'}
        </span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: color + '20' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}cc)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <div className="flex justify-between text-[9px] mt-0.5">
        <span className="text-muted/60">{xpInLevel.toLocaleString('pt-BR')} XP neste nível</span>
        <span className="text-muted/60">{pct}%</span>
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
        <Avatar collab={collab}
          className={`${sizes[position]} rounded-2xl flex items-center justify-center font-extrabold text-white overflow-hidden`}
          style={{ background: `linear-gradient(135deg, ${collab.color}, ${collab.color}80)`, boxShadow: `0 8px 24px ${collab.color}40` }}
        />
        <div className="absolute -top-2 -right-2 text-lg">{medals[position]}</div>
      </div>
      <p className="text-xs font-bold text-text">{collab.name}</p>
      <p className="text-[10px] text-muted">{collab.rank}</p>
      <p className="text-sm font-extrabold" style={{ color: collab.color }}>
        {collab.xp.toLocaleString('pt-BR')} XP
      </p>
      <div className="flex gap-1 flex-wrap justify-center">
        {collab.streakMult > 1 && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#ea8a2918', color: '#ea8a29' }}>
            🔥 ×{collab.streakMult.toFixed(1)}
          </span>
        )}
        {collab.nextRank && (
          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md" style={{ background: '#6eda2c15', color: '#6eda2c' }}>
            {collab.xpRemaining.toLocaleString('pt-BR')} → {collab.nextRank}
          </span>
        )}
      </div>
      <div className={`${heights[position]} w-full rounded-t-xl opacity-30`} style={{ backgroundColor: collab.color }} />
    </motion.div>
  )
}

function CollabCard({ collab, index }) {
  const pctXp = Math.min(100, Math.round((collab.xpInLevel / collab.xpLevelSpan) * 100))

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
          <p className="text-xs font-extrabold" style={{ color: collab.color }}>{collab.rank}</p>
          <p className="text-[10px] text-muted">Nível {collab.level}</p>
        </div>
      </div>

      {/* Level pips */}
      <div className="flex gap-1 mb-2">
        {LEVELS.map(l => (
          <LevelPip key={l.level} level={l.level} current={collab.level} color={collab.color} />
        ))}
        <span className="text-[9px] text-muted ml-auto">
          {collab.nextRank ? `→ ${collab.xpRemaining.toLocaleString('pt-BR')} XP para ${collab.nextRank}` : '🦅 Máximo'}
        </span>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <XpBar xp={collab.xp} xpInLevel={collab.xpInLevel} xpLevelSpan={collab.xpLevelSpan}
          xpRemaining={collab.xpRemaining} nextRank={collab.nextRank} color={collab.color} />
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

      {/* Como ganhar XP */}
      <ComoGanharXP />

      {/* Missões da semana */}
      <MissoesSemanais />

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

      {/* Leaderboard completo */}
      <LeaderboardList sorted={sorted} />

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
                <Avatar collab={c}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0 overflow-hidden"
                  style={{ backgroundColor: c.color }} />
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
