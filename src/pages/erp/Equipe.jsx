import { useMemo, useState, memo, useEffect } from 'react'
import { fetchRemoteScores, mergeScores, migrateLocalOnly, pushScore, clearRemoteMember } from '../../lib/scorecard-sync'
import { getAvatarComponent } from '../../data/avatars'
import { OnsToken, OnsDisplay, OnsGain } from '../../components/OnsToken'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Trophy, Zap, TrendingUp, Star, Target, ChevronDown } from 'lucide-react'
import { taskTypes } from '../../data/erp-mock'
import { ROLE_MISSIONS, CAT_COLORS } from '../../data/missions'
import { useData } from '../../contexts/DataContext'
import { getBeltInfo } from '../../data/belt-system'
import BeltBadge from '../../components/BeltBadge'
import { RESTRICTED_EMAILS } from '../../data/users-store'

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

function calcBadges(tasksCompleted, ons, streak, del) {
  const b = []
  if (tasksCompleted >= 1)         b.push('🎯')
  if (tasksCompleted >= 5)         b.push('🚀')
  if (tasksCompleted >= 10)        b.push('⚡')
  if (tasksCompleted >= 25)        b.push('🏆')
  if (tasksCompleted >= 50)        b.push('👑')
  if (streak >= 3)                 b.push('🔥')
  if (streak >= 6)                 b.push('💥')
  if (streak >= 12)                b.push('🌟')
  if (ons >= 100)                  b.push('🥉')
  if (ons >= 300)                  b.push('💎')
  if (ons >= 600)                  b.push('🔮')
  if (ons >= 1000)                 b.push('⚜️')
  if (ons >= 2000)                 b.push('🦅')
  if ((del.lp       || 0) >= 3)   b.push('🖥️')
  if ((del.criativo || 0) >= 5)   b.push('🎨')
  if ((del.campanha || 0) >= 3)   b.push('📢')
  if ((del.copy     || 0) >= 5)   b.push('✍️')
  if ((del.video    || 0) >= 3)   b.push('🎬')
  return b.slice(0, 8)
}

function computeStats(collab, allTasks) {
  const myAll = allTasks.filter(t => t.assignee === collab.id)
  const done  = myAll.filter(t => t.status === 'done')
  const doing = myAll.filter(t => t.status === 'doing' || t.status === 'review')

  // ONS é a única forma de pontuação — soma direta das tasks concluídas
  const ons = done.reduce((sum, t) => sum + (taskTypes[t.type]?.ons ?? 1), 0)

  const months = monthsSince(collab.since || '2026-05-28')

  // Performance
  const today        = new Date().toISOString().split('T')[0]
  const overdueCount = myAll.filter(t => t.status !== 'done' && t.dueDate && t.dueDate < today).length
  const performancePct = (done.length + overdueCount) > 0
    ? Math.round((done.length / (done.length + overdueCount)) * 100)
    : 100

  // Belt usa ons como única métrica
  const bi = getBeltInfo(ons, months, performancePct, collab.belt || 'branca', collab.grau ?? 0)

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
  const doneThisMonth  = myAll.filter(t =>
    t.status === 'done' &&
    (t.completedAt || t.dueDate || t.createdAt || '').startsWith(ym)
  )
  const tasksThisMonth = doneThisMonth.length
  const onsThisMonth   = doneThisMonth.reduce((s, t) => s + (taskTypes[t.type]?.ons ?? 1), 0)
  const streak         = done.length ? calcStreak(done) : 0
  const badges         = calcBadges(tasksCompleted, ons, streak, deliveriesByType)

  // Histórico mensal de ons — últimos 6 meses, contagem contínua
  const onsHistory = Array.from({ length: 6 }, (_, i) => {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const ymH = d.toISOString().slice(0, 7)
    const label = d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '').toUpperCase()
    const monthOns = myAll.filter(t =>
      t.status === 'done' &&
      (t.completedAt || t.dueDate || t.createdAt || '').startsWith(ymH)
    ).reduce((s, t) => s + (taskTypes[t.type]?.ons ?? 1), 0)
    return { ym: ymH, label, ons: monthOns }
  }).reverse()

  return {
    ...collab,
    _scoreTasks: done, // tarefas concluídas do membro — usadas no auto-scoring do scorecard
    ons, months, onsHistory,
    belt: bi.belt, grau: bi.grau,
    rank: bi.belt.label,
    onsInGrau: bi.xpInGrau, onsGrauSpan: bi.grauSpan,
    onsRemaining: Math.max(0, bi.grauEnd - ons),
    nextRank: bi.nextBelt?.label || null,
    tasksCompleted, tasksThisMonth, onsThisMonth,
    streak, deliveriesByType, badges,
    doingCount: doing.length,
    canLevelUp: bi.canAdvance,
    onsNeeded: bi.xpNeeded,
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
  // Critérios AUTO: cada um liga a tipos de tarefa reais + limite semanal (ok/partial).
  // No modo mensal os limites são multiplicados por ~4. Sem `types` = subjetivo (manual).
  'Media Buyer': [
    { id: 'gestao_diaria', label: 'Gestão diária das contas em dia', icon: '🔄', weight: 2, types: ['gestao_diaria'], ok: 5, partial: 1 },
    { id: 'campanhas',     label: 'Campanhas criadas/ajustadas',     icon: '📡', weight: 3, types: ['criar_campanha', 'campanha'], ok: 2, partial: 1 },
    { id: 'otimizacoes',   label: 'Otimização registrada no Hub',    icon: '⚙️', weight: 3, types: ['analise_conv'], ok: 1, partial: 0 },
    { id: 'grupos',        label: 'Presença nos grupos (3x)',        icon: '💬', weight: 1, types: ['whats_grupos'], ok: 3, partial: 1 },
  ],
  'Marketing Trainee': [
    { id: 'video',    label: 'Edição/entrega de vídeo',       icon: '🎬', weight: 3, types: ['edicao_video'], ok: 3, partial: 1 },
    { id: 'setup',    label: 'Setup de conta nova',           icon: '🛠️', weight: 2, types: ['setup_conta'], ok: 2, partial: 1 },
    { id: 'gmb',      label: 'Google Meu Negócio atualizado', icon: '📍', weight: 2, types: ['atualizar_gmn'], ok: 1, partial: 0 },
    { id: 'criativo', label: 'Captação/criativo',             icon: '🎨', weight: 2, types: ['captacao_video', 'criativo'], ok: 3, partial: 1 },
  ],
  'Marketing Assistant': [
    { id: 'criativos', label: 'Criativos/artes entregues', icon: '🎨', weight: 3, types: ['criativo', 'criar_artes'], ok: 4, partial: 1 },
    { id: 'video',     label: 'Edição de vídeo',           icon: '🎬', weight: 2, types: ['edicao_video'], ok: 1, partial: 0 },
    { id: 'copy',      label: 'Copy criada',               icon: '✍️', weight: 2, types: ['criacao_copy'], ok: 1, partial: 0 },
    { id: 'grupos',    label: 'Presença nos grupos',       icon: '💬', weight: 1, types: ['whats_grupos'], ok: 1, partial: 0 },
  ],
  'Content Creator': [
    { id: 'criativos',    label: 'Criativos entregues',      icon: '🎨', weight: 3, types: ['criativo', 'criar_artes'], ok: 3, partial: 1 },
    { id: 'posts',        label: 'Publicação de posts',      icon: '📱', weight: 2, types: ['publicar_posts'], ok: 2, partial: 1 },
    { id: 'perfil',       label: 'Organização de perfil',    icon: '✅', weight: 2, types: ['org_perfil'], ok: 1, partial: 0 },
    { id: 'planejamento', label: 'Planejamento de conteúdo', icon: '📆', weight: 2, types: ['plan_estrategico', 'calendario_post'], ok: 1, partial: 0 },
  ],
  'Creative Producer': [
    { id: 'calendario', label: 'Calendário de posts entregue', icon: '📆', weight: 2, types: ['calendario_post'], ok: 1, partial: 0 },
    { id: 'copy',       label: 'Copy criada',                  icon: '✍️', weight: 2, types: ['criacao_copy'], ok: 3, partial: 1 },
    { id: 'producao',   label: 'Vídeo/artes entregues',        icon: '🎬', weight: 3, types: ['edicao_video', 'criar_artes', 'captacao_video'], ok: 3, partial: 1 },
    { id: 'grupos',     label: 'Atendimento nos grupos',       icon: '💬', weight: 1, types: ['whats_grupos'], ok: 1, partial: 0 },
  ],
  'SDR': [
    { id: 'reunioes',  label: 'Reunioes agendadas dentro da meta',    icon: '📅', weight: 3 },
    { id: 'followup',  label: 'Follow-up com todos os leads quentes', icon: '🔥', weight: 3 },
    { id: 'propostas', label: 'Proposta enviada no mesmo dia',        icon: '📤', weight: 2 },
    { id: 'crm',       label: 'CRM: pipeline atualizado',             icon: '🗂️', weight: 1 },
  ],
  'Administrador': [
    { id: 'tarefas',     label: 'Tarefas administrativas no prazo',     icon: '✅', weight: 2 },
    { id: 'comunicacao', label: 'Comunicacao centralizada e registrada', icon: '📋', weight: 2 },
    { id: 'financeiro',  label: 'Financeiro atualizado sem pendencias',  icon: '💰', weight: 3 },
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

// ── Auto-scoring: deriva ok/partial/miss das tarefas reais do membro ──────
function taskDate(t) { return t.completedAt || t.dueDate || t.createdAt || '' }

function taskCycleKey(t, mode) {
  const d = taskDate(t)
  if (!d) return null
  return mode === 'month' ? String(d).slice(0, 7) : getWeekKeyFromDate(new Date(d))
}

// Estado automático de um critério, contando as tarefas do tipo no ciclo.
// Retorna undefined para critério subjetivo (sem `types`) — esse fica manual.
function autoState(collab, criterion, cycleKey, mode) {
  if (!criterion.types) return undefined
  const n = (collab._scoreTasks || []).filter(t =>
    criterion.types.includes(t.type) && taskCycleKey(t, mode) === cycleKey
  ).length
  const factor  = mode === 'month' ? 4 : 1
  const ok      = (criterion.ok ?? 1) * factor
  const partial = (criterion.partial ?? 0) * factor
  if (n >= ok) return 'ok'
  if (partial > 0 ? n >= partial : n >= 1) return 'partial'
  return 'miss'
}

// Junta manual (override do gestor) + automático. Manual sempre vence.
function effectiveScores(collab, criteria, cycleKey, mode, manual) {
  const out = {}
  for (const c of criteria || []) {
    out[c.id] = manual?.[c.id] || autoState(collab, c, cycleKey, mode)
  }
  return out
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

function rankMembers(members, scores, cycle, mode) {
  return [...members]
    .filter(c => SCORECARD_CRITERIA[c.role])
    .map(c => {
      const criteria     = SCORECARD_CRITERIA[c.role]
      const manual       = scores?.[cycle]?.[c.id] || {}
      const memberScores = effectiveScores(c, criteria, cycle, mode, manual)
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

  // Sincroniza com o Supabase (espelho durável). O localStorage segue como base:
  // se o Supabase falhar, tudo continua funcionando local e nada é perdido.
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const remote = await fetchRemoteScores()
        const local  = loadScores()
        const merged = mergeScores(local, remote)
        if (!cancelled) { setScores(merged); saveScores(merged) }
        await migrateLocalOnly(local, remote) // sobe ao Supabase o que só existia local
      } catch { /* offline / sem tabela ainda: segue com localStorage, nada perdido */ }
    })()
    return () => { cancelled = true }
  }, [])

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
    pushScore(selectedCycle, memberId, criteriaId, next).catch(() => {}) // espelho Supabase
  }

  function clearMember(memberId) {
    const updated = { ...scores, [selectedCycle]: { ...(scores[selectedCycle] || {}), [memberId]: {} } }
    setScores(updated)
    saveScores(updated)
    clearRemoteMember(selectedCycle, memberId).catch(() => {}) // espelho Supabase
  }

  function getMemberHistory(collab, criteria) {
    if (!criteria) return []
    return getPastCycles(mode, 4).reverse().map(c => ({
      key:   c.key,
      label: c.label,
      score: calcScore(criteria, effectiveScores(collab, criteria, c.key, mode, scores?.[c.key]?.[collab.id] || {})),
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
  const ranking       = rankMembers(enriched, scores, selectedCycle, mode)
  const leader        = ranking[0] || null
  const avgScore      = ranking.length ? Math.round(ranking.reduce((s, c) => s + c.score, 0) / ranking.length) : null
  const needsAtt      = ranking.filter(c => c.score < 50)
  const avgColor      = avgScore == null ? '#8890b5' : avgScore >= 75 ? '#6eda2c' : avgScore >= 50 ? '#ea8a29' : '#ef4444'

  // Destaque sempre da semana atual
  const weekRanking    = rankMembers(enriched, scores, currentWeekKey, 'week')
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
          const manual       = scores?.[selectedCycle]?.[collab.id] || {}
          const memberScores = effectiveScores(collab, criteria, selectedCycle, mode, manual)
          const score        = calcScore(criteria, memberScores)
          const isOpen       = open[collab.id]
          const scoreColor   = score == null ? '#8890b5' : score >= 80 ? '#6eda2c' : score >= 50 ? '#ea8a29' : '#ef4444'
          const doneCount    = criteria.filter(c => memberScores[c.id] === 'ok').length
          const history      = getMemberHistory(collab, criteria)
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




// ── Trilhas de Carreira ─────────────────────────────────────────

const BELT_COLORS_MAP = {
  branca: '#94a3b8',
  azul:   '#3b82f6',
  roxa:   '#7c3aed',
  marrom: '#92400e',
  preta:  '#0f172a',
}

const BELT_LABEL_MAP = {
  branca: 'Branca',
  azul:   'Azul',
  roxa:   'Roxa',
  marrom: 'Marrom',
  preta:  'Preta',
}

const CAREER_TRACKS = [
  {
    id: 'performance', label: 'Performance', icon: '📈', color: '#6eda2c',
    memberIds: ['tochiro', 'ana_sm'],
    levels: [
      {
        id: 'marketing_trainee', title: 'Marketing Trainee', beltRequired: 'branca', memberIds: ['ana_sm'],
        criteria: ['Sobe campanha sozinha sem supervisão', 'Zero erros críticos por 2 meses', 'Relatório semanal sem ser cobrada'],
      },
      {
        id: 'traffic_analyst', title: 'Traffic Analyst', beltRequired: 'azul', memberIds: ['tochiro'],
        criteria: ['Gerencia múltiplas contas com autonomia', 'CPL dentro da meta por 2 meses', 'CRM atualizado semanalmente'],
      },
      {
        id: 'media_buyer', title: 'Media Buyer', beltRequired: 'roxa', memberIds: [],
        criteria: ['ROAS dentro da meta por 2 meses', 'Propõe otimizações sem ser pedido', 'Ensina alguém da trilha'],
      },
      {
        id: 'performance_strategist', title: 'Performance Strategist', beltRequired: 'marrom', memberIds: [],
        criteria: ['Responsável pelo resultado da área', 'Desenvolve e documenta processos', 'Define metas com o CEO'],
      },
      {
        id: 'head_performance', title: 'Head of Performance', beltRequired: 'preta', memberIds: [],
        criteria: ['Dono do resultado da área', 'Gere orçamento de mídia', 'Desenvolve líderes da trilha'],
      },
    ],
  },
  {
    id: 'content', label: 'Conteúdo', icon: '✍️', color: '#be29ec',
    memberIds: ['mariana'],
    levels: [
      {
        id: 'content_creator', title: 'Content Creator', beltRequired: 'branca', memberIds: ['mariana'],
        criteria: ['Grade 100% executada por 2 meses', 'Planejamento com 7 dias de antecedência', 'Propõe pauta com base em performance'],
      },
      {
        id: 'content_strategist', title: 'Content Strategist', beltRequired: 'azul', memberIds: [],
        criteria: ['Engajamento crescendo no período', 'Testa formatos novos e registra resultado', 'Planeja conteúdo com visão de 30 dias'],
      },
      {
        id: 'brand_strategist', title: 'Brand Strategist', beltRequired: 'roxa', memberIds: [],
        criteria: ['Define identidade de conteúdo da marca', 'Orienta outros criadores', 'Resultado de conteúdo conectado ao negócio'],
      },
      {
        id: 'head_content', title: 'Head of Content', beltRequired: 'preta', memberIds: [],
        criteria: ['Dona da estratégia de conteúdo', 'Lidera e desenvolve a trilha', 'Resultado impacta receita da empresa'],
      },
    ],
  },
  {
    id: 'creative', label: 'Criativo & Cliente', icon: '🎬', color: '#f97316',
    memberIds: ['beatriz'],
    levels: [
      {
        id: 'creative_producer', title: 'Creative Producer', beltRequired: 'branca', memberIds: ['beatriz'],
        criteria: ['Entrega vídeos e copy sem supervisão', 'Zero reclamação de cliente em 2 meses', 'Propõe abordagem criativa sem ser pedida'],
      },
      {
        id: 'creative_strategist', title: 'Creative Strategist', beltRequired: 'azul', memberIds: [],
        criteria: ['Antecipa problemas antes de virarem crise', 'Clientes satisfeitos por 2 meses seguidos', 'Propõe melhorias no processo criativo'],
      },
      {
        id: 'creative_lead', title: 'Creative Lead', beltRequired: 'roxa', memberIds: [],
        criteria: ['Organiza o fluxo do squad sem ser pedida', 'Resultado criativo impacta conversão', 'Forma outros membros da área'],
      },
      {
        id: 'head_creative', title: 'Head of Creative & Client', beltRequired: 'preta', memberIds: [],
        criteria: ['Dona do processo criativo e de atendimento', 'Define padrão de qualidade da área', 'Resultado conectado ao negócio'],
      },
    ],
  },
  {
    id: 'commercial', label: 'Comercial', icon: '💼', color: '#a78bfa',
    memberIds: [],
    levels: [
      {
        id: 'sdr', title: 'SDR', beltRequired: 'branca', memberIds: [],
        criteria: ['Reuniões agendadas dentro da meta mensal', 'Follow-up com todos os leads quentes', 'Proposta no mesmo dia do contato'],
      },
      {
        id: 'account_executive', title: 'Account Executive', beltRequired: 'azul', memberIds: [],
        criteria: ['Fecha contratos com autonomia', 'Taxa de conversão acima da meta', 'Ciclo de vendas previsível e documentado'],
      },
      {
        id: 'sales_manager', title: 'Sales Manager', beltRequired: 'roxa', memberIds: [],
        criteria: ['Receita dentro da meta por 2 meses', 'Pipeline atualizado no CRM', 'Processo de vendas replicável'],
      },
      {
        id: 'head_commercial', title: 'Head of Commercial', beltRequired: 'preta', memberIds: [],
        criteria: ['Define estratégia comercial da empresa', 'Lidera e desenvolve o time de vendas', 'Receita dentro da meta trimestral'],
      },
    ],
  },
  {
    id: 'design', label: 'Design', icon: '🎨', color: '#f43f5e',
    memberIds: [],
    levels: [
      {
        id: 'design_trainee', title: 'Design Trainee', beltRequired: 'branca', memberIds: [],
        criteria: ['Entrega artes no prazo com zero retrabalho', 'Segue o brandbook sem precisar de orientação', 'Propõe variações criativas sem ser pedida'],
      },
      {
        id: 'visual_designer', title: 'Visual Designer', beltRequired: 'azul', memberIds: [],
        criteria: ['Produz criativos para múltiplos clientes com autonomia', 'Identidade visual consistente em todos os formatos', 'Propõe melhorias visuais baseadas em performance'],
      },
      {
        id: 'brand_designer', title: 'Brand Designer', beltRequired: 'roxa', memberIds: [],
        criteria: ['Desenvolve identidade de marca do zero', 'Cria guia de marca e brandbook completo', 'Orienta outro designer na trilha'],
      },
      {
        id: 'creative_director', title: 'Creative Director', beltRequired: 'marrom', memberIds: [],
        criteria: ['Define direção criativa da agência', 'Cria processos de produção escaláveis', 'Valida entregas com CEO e clientes estratégicos'],
      },
      {
        id: 'head_design', title: 'Head of Design', beltRequired: 'preta', memberIds: [],
        criteria: ['Dona da identidade visual de todos os clientes', 'Gere e desenvolve equipe de design', 'Define padrão de qualidade da área'],
      },
    ],
  },
  {
    id: 'analytics', label: 'Analytics & Dados', icon: '📊', color: '#0ea5e9',
    memberIds: ['elieser'],
    levels: [
      {
        id: 'data_trainee', title: 'Data Trainee', beltRequired: 'branca', memberIds: [],
        criteria: ['Atualiza dashboards sem supervisão', 'Zero erro em dados enviados a clientes', 'Relatório de performance entregue no prazo'],
      },
      {
        id: 'data_analyst', title: 'Data Analyst', beltRequired: 'azul', memberIds: ['elieser'],
        criteria: ['Identifica oportunidades nos dados proativamente', 'Configura rastreamentos e pixels sem supervisão', 'Apresenta insights em reunião de resultado'],
      },
      {
        id: 'analytics_specialist', title: 'Analytics Specialist', beltRequired: 'roxa', memberIds: [],
        criteria: ['Responsável pelo BI de múltiplos clientes', 'Cria relatórios avançados no Looker/GA4', 'Treina alguém na área de dados'],
      },
      {
        id: 'data_strategist', title: 'Data Strategist', beltRequired: 'marrom', memberIds: [],
        criteria: ['Define KPIs e metas com o CEO', 'Conecta dados a decisões de negócio', 'Cria processos de análise replicáveis'],
      },
      {
        id: 'head_analytics', title: 'Head of Analytics', beltRequired: 'preta', memberIds: [],
        criteria: ['Dona da inteligência de dados da agência', 'Define stack de analytics e ferramentas', 'Desenvolve líderes na trilha'],
      },
    ],
  },
  {
    id: 'web', label: 'Web & Digital', icon: '💻', color: '#818cf8',
    memberIds: ['deivisson'],
    levels: [
      {
        id: 'web_trainee', title: 'Web Trainee', beltRequired: 'branca', memberIds: [],
        criteria: ['Publica landing page sem supervisão', 'Zero bug em produção por 2 meses', 'Segue checklist de qualidade completo'],
      },
      {
        id: 'web_designer', title: 'Web Designer', beltRequired: 'azul', memberIds: [],
        criteria: ['Cria LP do zero com design e copy próprios', 'Taxa de conversão dentro da meta', 'Entrega com rastreamento configurado'],
      },
      {
        id: 'digital_experience_lead', title: 'Digital Experience Lead', beltRequired: 'roxa', memberIds: ['deivisson'],
        criteria: ['Responsável por todas as LPs ativas da agência', 'Define padrões de UX e conversão', 'Propõe melhorias com base em dados'],
      },
      {
        id: 'head_web', title: 'Head of Web & Digital', beltRequired: 'preta', memberIds: [],
        criteria: ['Dono do stack digital da agência', 'Gere infra, domínios e ferramentas', 'Desenvolve líderes na trilha'],
      },
    ],
  },
]

function TrilhasCarreira({ enriched }) {
  const [openLevel, setOpenLevel] = useState(null)
  const memberById = Object.fromEntries(enriched.map(c => [c.id, c]))

  function getLevelState(track, levelIdx) {
    const occupied = track.levels.map((l, i) => l.memberIds.length > 0 ? i : -1).filter(i => i >= 0)
    const maxOcc   = occupied.length > 0 ? Math.max(...occupied) : -1
    const level    = track.levels[levelIdx]
    if (level.memberIds.length > 0)   return 'active'
    if (levelIdx < maxOcc)            return 'passed'
    if (levelIdx === maxOcc + 1)      return 'next'
    return 'locked'
  }

  function getConnState(track, fromIdx) {
    const s0 = getLevelState(track, fromIdx)
    const s1 = getLevelState(track, fromIdx + 1)
    if ((s0 === 'active' || s0 === 'passed') && s1 === 'next')    return 'dashed'
    if ((s0 === 'active' || s0 === 'passed') && (s1 === 'active' || s1 === 'passed')) return 'solid'
    return 'grey'
  }

  const BELT_TIMELINE = [
    { id: 'branca', label: 'Branca', time: '0m',    desc: 'Entrada' },
    { id: 'azul',   label: 'Azul',   time: '6m',    desc: '≈6 meses' },
    { id: 'roxa',   label: 'Roxa',   time: '18m',   desc: '≈1,5 ano' },
    { id: 'marrom', label: 'Marrom', time: '3 anos', desc: '≈36 meses' },
    { id: 'preta',  label: 'Preta',  time: '5 anos', desc: '≈60 meses' },
  ]

  return (
    <div className="mt-10">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-extrabold text-text">🗺️ Trilhas de Carreira</h2>
          <p className="text-[11px] text-muted mt-0.5">Jornada de evolução · clique em um nível para ver critérios</p>
        </div>
        <span className="text-[9px] font-extrabold px-2.5 py-1.5 rounded-xl"
          style={{ background: '#ef444412', color: '#ef4444', border: '1px solid #ef444420' }}>
          🔒 Admin only
        </span>
      </div>

      {/* Belt timeline legend */}
      <div className="rounded-2xl overflow-hidden mb-6" style={{ background: '#0d0f1c', border: '1px solid #ffffff08' }}>
        <div className="px-4 pt-3 pb-1 border-b" style={{ borderColor: '#ffffff06' }}>
          <p className="text-[8px] font-extrabold uppercase tracking-widest" style={{ color: '#3d4466' }}>
            Sistema de graduação · baseado em tempo de empresa
          </p>
        </div>
        <div className="px-4 pt-4 pb-3">
          <div className="relative flex items-start">
            <div className="absolute left-4 right-4 top-[14px] h-px pointer-events-none"
              style={{ background: 'linear-gradient(90deg,#ffffff06,#ffffff12,#ffffff06)' }} />
            {BELT_TIMELINE.map(({ id, label, time, desc }, i) => {
              const color = BELT_COLORS_MAP[id]
              const isLast = i === BELT_TIMELINE.length - 1
              return (
                <div key={id} className="flex flex-col items-center" style={{ flex: isLast ? 'none' : 1 }}>
                  <div className="relative z-10 w-7 h-7 rounded-full flex items-center justify-center"
                    style={{
                      background: id === 'preta' ? `linear-gradient(135deg,${color}cc,#1e293b)` : `${color}18`,
                      border: `1.5px solid ${color}`,
                      boxShadow: id !== 'branca' ? `0 0 10px ${color}50, 0 0 3px ${color}80` : 'none',
                    }}>
                    <div className="w-2.5 h-2.5 rounded-full"
                      style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
                  </div>
                  <p className="text-[9px] font-extrabold mt-1.5 text-center" style={{ color }}>{label}</p>
                  <p className="text-[8px] font-bold mt-0.5 text-center" style={{ color: '#4b5580' }}>{time}</p>
                  <p className="text-[7px] mt-0.5 text-center" style={{ color: '#2d3252' }}>{desc}</p>
                </div>
              )
            })}
          </div>
          <p className="text-[8px] mt-3 text-center" style={{ color: '#2d3252' }}>
            ⚡ Performance ≥95% acelera em 40% · ≥85% acelera em 25%
          </p>
        </div>
      </div>

      {/* Trilhas */}
      <div className="space-y-4">
        {CAREER_TRACKS.map(track => {
          const occupiedIdxs = track.levels.map((l, i) => l.memberIds.length > 0 ? i : -1).filter(i => i >= 0)
          const maxOcc = occupiedIdxs.length > 0 ? Math.max(...occupiedIdxs) : -1
          const unlockedCount = maxOcc + 2

          return (
            <div key={track.id} className="rounded-3xl overflow-hidden"
              style={{ background: '#090b11', boxShadow: `0 2px 32px ${track.color}12, 0 0 0 1px ${track.color}12` }}>

              {/* Track header */}
              <div className="px-5 py-4 flex items-center gap-3 relative overflow-hidden"
                style={{ borderBottom: `1px solid ${track.color}12` }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at 0% 60%, ${track.color}10 0%, transparent 55%)` }} />

                <div className="relative w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `${track.color}12`, border: `1px solid ${track.color}25`,
                    boxShadow: `0 0 16px ${track.color}18` }}>
                  <span style={{ fontSize: 20 }}>{track.icon}</span>
                </div>

                <div className="relative flex-1 min-w-0">
                  <p className="text-sm font-extrabold text-white">{track.label}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[9px] font-bold" style={{ color: track.color + '80' }}>
                      {track.memberIds.length} membro{track.memberIds.length !== 1 ? 's' : ''}
                    </span>
                    <span style={{ color: '#ffffff10' }}>·</span>
                    <span className="text-[9px]" style={{ color: '#3d4466' }}>
                      fase {Math.min(unlockedCount, track.levels.length)} de {track.levels.length}
                    </span>
                  </div>
                  <div className="flex gap-0.5 mt-2" style={{ maxWidth: 120 }}>
                    {track.levels.map((_, i) => {
                      const s = getLevelState(track, i)
                      return (
                        <div key={i} className="h-1 flex-1 rounded-full transition-all duration-500"
                          style={{
                            background: s === 'active' ? track.color
                              : s === 'passed' ? track.color + '50'
                              : '#ffffff0a',
                            boxShadow: s === 'active' ? `0 0 6px ${track.color}` : 'none',
                          }} />
                      )
                    })}
                  </div>
                </div>

                <div className="relative flex gap-2 flex-shrink-0">
                  {track.memberIds.map(id => {
                    const m = memberById[id]
                    if (!m) return null
                    return (
                      <div key={id} className="flex flex-col items-center gap-0.5">
                        <div className="w-8 h-8 rounded-xl overflow-hidden"
                          style={{ boxShadow: `0 0 0 2px ${m.color}55, 0 0 10px ${m.color}28` }}>
                          <Avatar collab={m} className="w-full h-full" style={{}} />
                        </div>
                        <span className="text-[7px] font-extrabold" style={{ color: m.color }}>
                          {m.name.split(' ')[0]}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Journey levels */}
              <div className="p-4 overflow-x-auto" style={{ background: '#0a0c14' }}>
                <div className="flex items-start" style={{ minWidth: 'max-content', gap: 0 }}>
                  {track.levels.map((level, idx) => {
                    const state     = getLevelState(track, idx)
                    const beltColor = BELT_COLORS_MAP[level.beltRequired]
                    const members   = level.memberIds.map(id => memberById[id]).filter(Boolean)
                    const isOpen    = openLevel === `${track.id}-${level.id}`
                    const isLast    = idx === track.levels.length - 1
                    const connState = !isLast ? getConnState(track, idx) : null
                    const stepNum   = String(idx + 1).padStart(2, '0')

                    return (
                      <div key={level.id} className="flex items-start">
                        <div className="flex flex-col">

                          {/* Level card */}
                          <motion.button
                            whileHover={state !== 'locked' ? { y: -3 } : {}}
                            whileTap={state !== 'locked' ? { scale: 0.97 } : {}}
                            onClick={() => state !== 'locked' && setOpenLevel(isOpen ? null : `${track.id}-${level.id}`)}
                            className="w-48 rounded-2xl p-4 text-left relative overflow-hidden"
                            style={{
                              cursor: state === 'locked' ? 'default' : 'pointer',
                              background: state === 'active'
                                ? `linear-gradient(145deg,#12141f,${track.color}18)`
                                : state === 'locked' ? '#0d0f1c' : '#0f111c',
                              border: state === 'active' ? `1.5px solid ${track.color}55`
                                : state === 'next'   ? `1.5px dashed ${track.color}30`
                                : state === 'passed' ? '1.5px solid #6eda2c20'
                                : '1px solid #ffffff06',
                              boxShadow: state === 'active'
                                ? `0 0 0 3px ${track.color}10, 0 8px 32px ${track.color}18` : 'none',
                            }}>

                            {/* Step number background */}
                            <span className="absolute right-1.5 top-0 text-[40px] font-extrabold leading-none pointer-events-none select-none"
                              style={{ color: state === 'locked' ? '#ffffff03' : track.color + (state === 'active' ? '14' : '07') }}>
                              {stepNum}
                            </span>

                            {/* Active ambient glow */}
                            {state === 'active' && (
                              <>
                                <div className="absolute inset-0 pointer-events-none"
                                  style={{ background: `radial-gradient(ellipse at 50% 0%,${track.color}14 0%,transparent 65%)` }} />
                                <motion.div className="absolute inset-0 rounded-2xl pointer-events-none"
                                  animate={{ opacity: [0, 0.25, 0] }}
                                  transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut' }}
                                  style={{ background: `radial-gradient(ellipse at 50% 100%,${track.color}18 0%,transparent 60%)` }} />
                              </>
                            )}

                            {/* Belt pill + state badge row */}
                            <div className="relative flex items-center gap-1.5 mb-3">
                              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md flex-shrink-0"
                                style={{
                                  background: state === 'locked' ? '#ffffff05' : beltColor + '18',
                                  border: `1px solid ${state === 'locked' ? '#ffffff08' : beltColor + '30'}`,
                                }}>
                                <div className="w-1.5 h-1.5 rounded-full"
                                  style={{
                                    background: state === 'locked' ? '#2d3252' : beltColor,
                                    boxShadow: state !== 'locked' ? `0 0 4px ${beltColor}` : 'none',
                                  }} />
                                <span className="text-[7px] font-extrabold uppercase tracking-wider"
                                  style={{ color: state === 'locked' ? '#2d3252' : beltColor }}>
                                  {BELT_LABEL_MAP[level.beltRequired]}
                                </span>
                              </div>

                              <div className="ml-auto flex-shrink-0">
                                {state === 'active' && (
                                  <motion.div
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-5 h-5 rounded-full flex items-center justify-center"
                                    style={{ background: track.color + '22', border: `1px solid ${track.color}50`,
                                      boxShadow: `0 0 8px ${track.color}40` }}>
                                    <span style={{ fontSize: 8, color: track.color }}>★</span>
                                  </motion.div>
                                )}
                                {state === 'next' && (
                                  <motion.span
                                    animate={{ opacity: [0.6, 1, 0.6] }}
                                    transition={{ repeat: Infinity, duration: 1.6 }}
                                    className="text-[7px] font-extrabold px-1.5 py-0.5 rounded"
                                    style={{ background: track.color + '18', color: track.color, border: `1px solid ${track.color}35` }}>
                                    NEXT
                                  </motion.span>
                                )}
                                {state === 'passed' && (
                                  <div className="w-4 h-4 rounded-full flex items-center justify-center"
                                    style={{ background: '#6eda2c15', border: '1px solid #6eda2c35' }}>
                                    <span style={{ fontSize: 9, color: '#6eda2c' }}>✓</span>
                                  </div>
                                )}
                                {state === 'locked' && (
                                  <span style={{ fontSize: 11, opacity: 0.25 }}>🔒</span>
                                )}
                              </div>
                            </div>

                            {/* Title */}
                            <p className="relative text-[13px] font-extrabold leading-snug mb-3 pr-2"
                              style={{
                                color: state === 'locked' ? '#2d3252'
                                  : state === 'active' ? track.color
                                  : state === 'passed' ? '#6eda2c'
                                  : '#6b7494',
                              }}>
                              {level.title}
                            </p>

                            {/* Active member — circular SVG progress ring */}
                            {members.map(m => {
                              const mBeltId    = m.belt?.id || 'branca'
                              const mBeltStart = BELT_MONTHS_MAP[mBeltId] ?? 0
                              const mNextMths  = BELT_NEXT_MONTHS[mBeltId]
                              const mInBelt    = Math.max(0, (m.months || 0) - mBeltStart)
                              const mTimePct   = mNextMths
                                ? Math.min(100, Math.round((mInBelt / (mNextMths - mBeltStart)) * 100))
                                : 100
                              const mColor     = m.belt?.color || m.color
                              const circ       = 2 * Math.PI * 14
                              return (
                                <div key={m.id} className="relative mt-1">
                                  <div className="flex items-center gap-2.5 mb-2">
                                    <div className="relative w-10 h-10 flex-shrink-0">
                                      <svg className="absolute inset-0 w-full h-full"
                                        style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 36 36">
                                        <circle cx="18" cy="18" r="14" fill="none"
                                          stroke={mColor + '18'} strokeWidth="2.5" />
                                        <motion.circle cx="18" cy="18" r="14" fill="none"
                                          stroke={mColor} strokeWidth="2.5" strokeLinecap="round"
                                          style={{ strokeDasharray: circ, filter: `drop-shadow(0 0 3px ${mColor}aa)` }}
                                          initial={{ strokeDashoffset: circ }}
                                          animate={{ strokeDashoffset: circ - (mTimePct / 100) * circ }}
                                          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
                                      </svg>
                                      <div className="absolute inset-1 rounded-full overflow-hidden">
                                        <Avatar collab={m} className="w-full h-full" style={{}} />
                                      </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-[10px] font-extrabold text-white truncate">
                                        {m.name.split(' ')[0]}
                                      </p>
                                      <BeltBadge beltId={m.belt?.id} grau={m.grau} size="xs" />
                                    </div>
                                  </div>
                                  <div className="flex justify-between text-[7px] font-bold mb-1.5">
                                    <span style={{ color: mColor }}>{mInBelt}m na faixa</span>
                                    <span style={{ color: '#3d4466' }}>
                                      {m.mthsNeeded > 0 ? `−${m.mthsNeeded}m` : '✓ pronto'}
                                    </span>
                                  </div>
                                  {m.canLevelUp && (
                                    <motion.div
                                      animate={{ opacity: [0.7, 1, 0.7] }}
                                      transition={{ repeat: Infinity, duration: 1.8 }}
                                      className="flex items-center gap-1 px-2 py-1 rounded-lg"
                                      style={{ background: '#6eda2c10', border: '1px solid #6eda2c28' }}>
                                      <span style={{ fontSize: 8 }}>🚀</span>
                                      <span className="text-[8px] font-extrabold" style={{ color: '#6eda2c' }}>Pronto p/ avançar!</span>
                                    </motion.div>
                                  )}
                                </div>
                              )
                            })}

                            {/* Next target placeholder */}
                            {state === 'next' && (
                              <div className="flex items-center gap-1.5 mt-1 px-2 py-1.5 rounded-xl"
                                style={{ background: track.color + '0c', border: `1px dashed ${track.color}25` }}>
                                <span style={{ fontSize: 10 }}>🎯</span>
                                <span className="text-[8px] font-bold" style={{ color: track.color + '80' }}>Próximo alvo</span>
                              </div>
                            )}

                            {/* Locked skeleton */}
                            {state === 'locked' && (
                              <div className="flex flex-col gap-2 mt-2">
                                <div className="h-1.5 rounded-full" style={{ background: '#ffffff05', width: '65%' }} />
                                <div className="h-1.5 rounded-full" style={{ background: '#ffffff03', width: '45%' }} />
                              </div>
                            )}

                            {state !== 'locked' && (
                              <ChevronDown size={10} className="absolute bottom-3 right-3 transition-transform"
                                style={{ color: track.color + '50', transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                            )}
                          </motion.button>

                          {/* Criteria dropdown */}
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden w-48">
                                <div className="mt-2 rounded-2xl p-3.5"
                                  style={{ background: '#0d0f1c', border: `1.5px solid ${track.color}22`,
                                    boxShadow: `0 4px 20px ${track.color}12` }}>
                                  <p className="text-[8px] font-extrabold uppercase tracking-wider mb-2.5"
                                    style={{ color: track.color + '70' }}>Para chegar aqui:</p>
                                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl mb-2.5"
                                    style={{ background: beltColor + '12', border: `1px solid ${beltColor}22` }}>
                                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                      style={{ background: beltColor, boxShadow: `0 0 4px ${beltColor}` }} />
                                    <span className="text-[8px] font-extrabold" style={{ color: beltColor }}>
                                      Faixa {BELT_LABEL_MAP[level.beltRequired]}
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    {level.criteria.map((c, i) => (
                                      <div key={i} className="flex items-start gap-2">
                                        <div className="w-3.5 h-3.5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                                          style={{ background: track.color + '15' }}>
                                          <span style={{ fontSize: 7, color: track.color }}>▸</span>
                                        </div>
                                        <p className="text-[9px] leading-snug" style={{ color: '#8891b4' }}>{c}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        {/* Connector */}
                        {!isLast && (
                          <div className="flex items-center flex-shrink-0 px-1.5" style={{ height: 92, paddingTop: 34 }}>
                            <div style={{ width: 24, position: 'relative', height: 2 }}>
                              {connState === 'solid' && (
                                <div style={{ position: 'absolute', inset: 0, borderRadius: 4,
                                  background: `linear-gradient(90deg,${track.color}70,${track.color}20)`,
                                  boxShadow: `0 0 6px ${track.color}35` }} />
                              )}
                              {connState === 'dashed' && (
                                <div style={{ position: 'absolute', inset: 0,
                                  background: `repeating-linear-gradient(90deg,${track.color}55 0,${track.color}55 4px,transparent 4px,transparent 8px)` }} />
                              )}
                              {connState === 'grey' && (
                                <div style={{ position: 'absolute', inset: 0, borderRadius: 4, background: '#ffffff08' }} />
                              )}
                            </div>
                            <span style={{ fontSize: 12, marginLeft: 2,
                              color: connState === 'grey' ? '#ffffff12' : track.color + '55' }}>›</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-center text-[10px] mt-5" style={{ color: '#2d3252' }}>
        🥋 Faixa + ✅ Critérios = promoção liberada · avaliação mínima trimestral
      </p>
    </div>
  )
}

// ── Missões de Função ───────────────────────────────────────────

const MISSIONS_STORAGE = 'trafegon_missions_v1_'

function MissoesSection({ enriched }) {
  const ym  = new Date().toISOString().slice(0, 7)
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MISSIONS_STORAGE + ym)) || {} } catch { return {} }
  })
  const [openCard, setOpenCard] = useState(null)

  function toggle(collabId, mId) {
    setDone(prev => {
      const k    = `${collabId}::${mId}`
      const next = { ...prev, [k]: !prev[k] }
      localStorage.setItem(MISSIONS_STORAGE + ym, JSON.stringify(next))
      return next
    })
  }
  const isDone = (cid, mid) => !!done[`${cid}::${mid}`]

  const members = enriched.filter(c => ROLE_MISSIONS[c.role])

  const totalMissions = members.reduce((s, c) => s + (ROLE_MISSIONS[c.role]?.missions.length || 0), 0)
  const totalDone     = members.reduce((s, c) => {
    const def = ROLE_MISSIONS[c.role]
    return s + (def?.missions.filter(m => isDone(c.id, m.id)).length || 0)
  }, 0)
  const teamPct = totalMissions ? Math.round((totalDone / totalMissions) * 100) : 0

  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-extrabold text-text">🎯 Missões de Função</h2>
          <p className="text-[11px] text-muted mt-0.5">Atividades recorrentes por cargo · {mes}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold" style={{ color: teamPct >= 80 ? '#6eda2c' : teamPct >= 50 ? '#f59e0b' : '#8890b5' }}>
            {teamPct}% equipe
          </p>
          <p className="text-[9px] text-muted">{totalDone}/{totalMissions} concluídas</p>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-6" style={{ background: '#edeef6' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: teamPct >= 80 ? 'linear-gradient(90deg,#6eda2c,#a8f040)' : 'linear-gradient(90deg,#60a5fa,#a78bfa)' }}
          initial={{ width: 0 }} animate={{ width: `${teamPct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {members.map((collab, ci) => {
          const def       = ROLE_MISSIONS[collab.role]
          const mList     = def.missions
          const doneCount = mList.filter(m => isDone(collab.id, m.id)).length
          const pct       = mList.length ? Math.round((doneCount / mList.length) * 100) : 0
          const onsEarned = mList.filter(m => isDone(collab.id, m.id)).reduce((s, m) => s + m.ons, 0)
          const isOpen    = openCard === collab.id
          const circ      = 2 * Math.PI * 18
          const cats      = [...new Set(mList.map(m => m.cat))]

          const badge = pct === 100 ? { label: '🔥 COMPLETO', color: '#6eda2c' }
            : pct >= 70  ? { label: '⚡ NO RITMO',     color: '#f59e0b' }
            : pct >= 30  ? { label: '🚀 EM ANDAMENTO', color: '#60a5fa' }
            : null

          return (
            <motion.div key={collab.id}
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ci * 0.05 }}
              className="rounded-2xl overflow-hidden"
              style={{ background: '#fff', border: `1px solid ${pct === 100 ? '#6eda2c20' : '#edeef6'}`,
                boxShadow: pct === 100 ? '0 4px 20px #6eda2c12' : '0 2px 10px rgba(26,29,46,0.07)' }}>

              <button className="w-full text-left p-4 flex items-center gap-3"
                onClick={() => setOpenCard(isOpen ? null : collab.id)}>
                <div className="relative w-12 h-12 flex-shrink-0">
                  <svg className="absolute inset-0 w-full h-full" style={{ transform: 'rotate(-90deg)' }} viewBox="0 0 44 44">
                    <circle cx="22" cy="22" r="18" fill="none" stroke={def.areaColor + '18'} strokeWidth="3"/>
                    <motion.circle cx="22" cy="22" r="18" fill="none" stroke={pct === 100 ? '#6eda2c' : def.areaColor}
                      strokeWidth="3" strokeLinecap="round"
                      style={{ strokeDasharray: circ, filter: `drop-shadow(0 0 4px ${pct === 100 ? '#6eda2c' : def.areaColor}80)` }}
                      initial={{ strokeDashoffset: circ }}
                      animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
                      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
                  </svg>
                  <div className="absolute inset-1.5 rounded-full overflow-hidden">
                    <Avatar collab={collab} className="w-full h-full" style={{}} />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <p className="text-sm font-extrabold text-text">{collab.name.split(' ')[0]}</p>
                    {badge && (
                      <motion.span
                        animate={pct === 100 ? { scale: [1, 1.08, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="text-[7px] font-extrabold px-1.5 py-0.5 rounded-full"
                        style={{ background: badge.color + '15', color: badge.color, border: `1px solid ${badge.color}30` }}>
                        {badge.label}
                      </motion.span>
                    )}
                  </div>
                  <p className="text-[10px] font-bold" style={{ color: def.areaColor }}>{collab.role}</p>
                  <p className="text-[9px] text-muted">{def.icon} {def.area}</p>
                </div>

                <div className="text-right flex-shrink-0 mr-1">
                  <p className="text-xl font-extrabold leading-none"
                    style={{ color: pct === 100 ? '#6eda2c' : pct >= 50 ? def.areaColor : '#c0c4d8' }}>
                    {pct}<span className="text-[10px] font-bold">%</span>
                  </p>
                  <p className="text-[8px] text-muted">{doneCount}/{mList.length}</p>
                  {onsEarned > 0 && <p className="text-[8px] font-extrabold" style={{ color: '#ea8a29' }}>+{onsEarned} ons</p>}
                </div>

                <ChevronDown size={14} className="text-muted flex-shrink-0 transition-transform"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
              </button>

              <div className="h-1 mx-4 rounded-full overflow-hidden" style={{ background: def.areaColor + '12' }}>
                <motion.div className="h-full rounded-full"
                  style={{ background: pct === 100 ? 'linear-gradient(90deg,#6eda2c,#a8f040)' : `linear-gradient(90deg,${def.areaColor}88,${def.areaColor})` }}
                  initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.9, delay: ci * 0.05 + 0.15, ease: [0.22, 1, 0.36, 1] }} />
              </div>

              <div className="flex flex-wrap gap-1 px-4 py-2.5">
                {cats.map(cat => (
                  <span key={cat} className="text-[7px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: (CAT_COLORS[cat] || '#8890b5') + '15', color: CAT_COLORS[cat] || '#8890b5' }}>
                    {cat}
                  </span>
                ))}
              </div>

              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                    <div className="border-t px-4 pt-3 pb-4 space-y-4" style={{ borderColor: '#edeef6' }}>

                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-2">
                          Missões · clique para marcar concluído
                        </p>
                        <div className="space-y-1.5">
                          {mList.map(m => {
                            const checked  = isDone(collab.id, m.id)
                            const catColor = CAT_COLORS[m.cat] || '#8890b5'
                            return (
                              <motion.button key={m.id} whileTap={{ scale: 0.97 }}
                                onClick={() => toggle(collab.id, m.id)}
                                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left"
                                style={{
                                  background: checked ? def.areaColor + '0d' : '#f8f9fc',
                                  border: `1px solid ${checked ? def.areaColor + '28' : '#edeef6'}`,
                                  transition: 'background 0.15s, border 0.15s',
                                }}>
                                <div className="w-4 h-4 rounded-md flex-shrink-0 flex items-center justify-center"
                                  style={{
                                    background: checked ? def.areaColor : 'white',
                                    border: `1.5px solid ${checked ? def.areaColor : '#d0d3e0'}`,
                                    boxShadow: checked ? `0 0 6px ${def.areaColor}50` : 'none',
                                    transition: 'all 0.15s',
                                  }}>
                                  {checked && (
                                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }}
                                      style={{ fontSize: 8, color: '#fff', lineHeight: 1 }}>✓</motion.span>
                                  )}
                                </div>
                                <p className="flex-1 text-[10px] font-semibold leading-snug"
                                  style={{ color: checked ? '#3d4466' : '#555b7a',
                                    textDecoration: checked ? 'line-through' : 'none', opacity: checked ? 0.65 : 1 }}>
                                  {m.title}
                                </p>
                                <span className="text-[7px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0"
                                  style={{ background: catColor + '12', color: catColor }}>{m.cat}</span>
                                <span className="text-[7px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-md"
                                  style={{ background: '#f0f1f7', color: '#8890b5' }}>{m.freq}</span>
                                <span className="text-[8px] font-extrabold flex-shrink-0 w-7 text-right"
                                  style={{ color: checked ? '#ea8a29' : '#c0c4d8' }}>+{m.ons}</span>
                              </motion.button>
                            )
                          })}
                        </div>
                      </div>

                      <div>
                        <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-2">Metas do mês</p>
                        <div className="space-y-1">
                          {def.goals.map(g => (
                            <div key={g.id} className="flex items-start gap-2 px-3 py-2 rounded-xl"
                              style={{ background: '#f8f9fc', border: '1px solid #edeef6' }}>
                              <span className="flex-shrink-0" style={{ fontSize: 13 }}>{g.icon}</span>
                              <p className="text-[9px] text-text leading-snug">{g.title}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {onsEarned > 0 && (
                        <div className="flex items-center justify-between px-3 py-2 rounded-xl"
                          style={{ background: '#ea8a2910', border: '1px solid #ea8a2922' }}>
                          <span className="text-[9px] font-bold" style={{ color: '#ea8a29' }}>⚡ Ons de missões este mês</span>
                          <span className="text-sm font-extrabold" style={{ color: '#ea8a29' }}>+{onsEarned}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>

      {members.length === 0 && (
        <p className="text-center text-muted text-sm py-12">Nenhum membro com missões definidas</p>
      )}
    </div>
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
    { id:'azul',   label:'Azul',   cor:'#3b82f6', texto:'#fff',    tempo:'6 meses',  req:'1.200 ons · 6 meses',
      significado:'Você tem consistência. Já se prova no campo.',
      desbloqueia:'Missões avançadas · Cartas incomuns na Arena · Trilha de especialização' },
    { id:'roxa',   label:'Roxa',   cor:'#7c3aed', texto:'#fff',    tempo:'18 meses', req:'3.500 ons · 18 meses',
      significado:'Você é referência. Outros aprendem com você.',
      desbloqueia:'Cartas raras na Arena · Placar especial · Missões de liderança' },
    { id:'marrom', label:'Marrom', cor:'#92400e', texto:'#fff',    tempo:'3 anos',   req:'7.500 ons · 36 meses',
      significado:'Você molda o time. Sua voz muda decisões.',
      desbloqueia:'Cartas épicas · Mentor status · Bônus de performance' },
    { id:'preta',  label:'Preta',  cor:'#0f172a', texto:'#e2e8f0', tempo:'5+ anos',  req:'12.000 ons · 60 meses',
      significado:'Você é a TráfegOn. Seu legado é o padrão.',
      desbloqueia:'Tudo desbloqueado · Cartas lendárias · Faixa permanente vitalícia' },
  ]

  const FONTES = [
    { icon:'📍', label:'Google Meu Negócio',    ons:'1', mult:true  },
    { icon:'📤', label:'Enviar Dashboard',       ons:'1', mult:true  },
    { icon:'💬', label:'Grupos WhatsApp',        ons:'1', mult:true  },
    { icon:'🔄', label:'Gestão Diária',          ons:'1', mult:true  },
    { icon:'📋', label:'Planilha Indicadores',   ons:'1', mult:true  },
    { icon:'🎨', label:'Criação de Artes',       ons:'1', mult:true  },
    { icon:'🔎', label:'Pesquisa de Mercado',    ons:'1', mult:true  },
    { icon:'📱', label:'Publicar/Agendar Posts', ons:'1', mult:true  },
    { icon:'💰', label:'Boletos e Notificações', ons:'1', mult:true  },
    { icon:'✨', label:'Organizar Perfil Social',ons:'2', mult:true  },
    { icon:'✍️', label:'Planej. Roteiro',        ons:'2', mult:true  },
    { icon:'📆', label:'Calendário de Post',     ons:'2', mult:true  },
    { icon:'🎯', label:'Rastreamento',           ons:'2', mult:true  },
    { icon:'📊', label:'Analisar CRM',           ons:'2', mult:true  },
    { icon:'🎬', label:'Edição de Vídeo',        ons:'2', mult:true  },
    { icon:'🎥', label:'Captação de Vídeo',      ons:'2', mult:true  },
    { icon:'📑', label:'Planilhas Clientes',     ons:'2', mult:true  },
    { icon:'🖥️', label:'Design de Landing Page', ons:'2', mult:true  },
    { icon:'✏️', label:'Criação de Copy',        ons:'2', mult:true  },
    { icon:'📈', label:'Relatório de Performance',ons:'2', mult:true  },
    { icon:'🔧', label:'Configurar Pixel',       ons:'2', mult:true  },
    { icon:'🕵️', label:'Analisar Concorrentes', ons:'2', mult:true  },
    { icon:'⚙️', label:'Setup de Conta',         ons:'3', mult:true  },
    { icon:'📢', label:'Criar Campanha do Zero', ons:'3', mult:true  },
    { icon:'🎓', label:'Treinamento de Vendas',  ons:'3', mult:true  },
    { icon:'📅', label:'Reunião de Acomp.',      ons:'3', mult:true  },
    { icon:'🚀', label:'Onboarding de Cliente', ons:'3', mult:true  },
    { icon:'🔍', label:'Auditoria de Conta',     ons:'3', mult:true  },
    { icon:'🗺️', label:'Planej. Estratégico',    ons:'3', mult:true  },
    { icon:'🎯', label:'Metas e KPIs',           ons:'3', mult:true  },
    { icon:'👥', label:'Trein. Equipe Cliente',  ons:'3', mult:true  },
    { icon:'📋', label:'Missão semanal',         ons:'60–120', mult:false },
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
                  As cartas da Arena não substituem a jornada — elas a <strong style={{ color:'rgba(255,255,255,0.8)' }}>aceleram e destacam</strong>.
                  Cada carta representa um aspecto específico em que o membro se destacou.
                  Ter uma carta rara é reconhecimento público de uma competência real.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { icon:'⚔️', label:'Arena (cartas de missão)',   desc:'Ganhas completando tarefas da Arena · desbloqueiam com ons', cor:'#60a5fa' },
                    { icon:'🌟', label:'Benefício das cartas',        desc:'Cartas épicas e lendárias aceleram progresso de faixa e multiplicam ons em áreas específicas', cor:'#be29ec' },
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

const META_BRANCA_ONS = 200

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
            <p className="text-sm font-extrabold text-text leading-tight">Meta do Mês — Equipe</p>
            <p className="text-[10px] text-muted">{mesLabel} · objetivo: 200 ons por membro</p>
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
    <div className="bg-white rounded-2xl p-5 mb-5"
      style={{ boxShadow: '0 2px 10px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.04)' }}>
      <div className="flex items-center gap-2 mb-4">
        <Trophy size={14} style={{ color: '#f59e0b' }} />
        <p className="text-sm font-extrabold text-text">Ranking ons</p>
        <span className="text-[10px] text-muted ml-auto">tarefas × tipo × prioridade</span>
      </div>
      <div className="space-y-1">
        {sorted.map((c, i) => {
          const medals    = ['🥇','🥈','🥉']
          const pct       = Math.min(100, Math.round((c.ons / (sorted[0]?.ons || 1)) * 100))
          const isTop3    = i < 3
          const streakBonus = c.streak >= 14 ? '×1,2' : c.streak >= 7 ? '×1,1' : null
          const podColors = ['#f59e0b','#94a3b8','#b45309']
          return (
            <div key={c.id} className="flex items-center gap-2.5 px-3 py-2 rounded-xl transition-colors"
              style={isTop3 ? { background: c.color + '09', border: `1px solid ${c.color}18` } : {}}>
              <span className="w-5 text-center text-sm font-extrabold flex-shrink-0"
                style={{ color: podColors[i] || '#c0c4d8' }}>
                {medals[i] || `#${i+1}`}
              </span>
              <Avatar collab={c}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white flex-shrink-0 overflow-hidden"
                style={{ background: c.color }} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                  <span className="text-xs font-bold text-text">{c.name}</span>
                  <BeltBadge beltId={c.belt?.id} grau={c.grau} size="xs" />
                  {streakBonus && (
                    <span className="text-[8px] font-bold px-1 py-0.5 rounded"
                      style={{ background: '#ea8a2912', color: '#ea8a29' }}>🔥 {streakBonus}</span>
                  )}
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: c.color + '18' }}>
                  <motion.div className="h-full rounded-full" style={{ background: c.color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.7, delay: 0.05 + i * 0.04, ease: [0.22,1,0.36,1] }} />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <OnsDisplay value={c.ons} size="sm" />
                <p className="text-[8px] text-muted">{c.tasksCompleted}t · {c.streak}sem🔥</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
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
        <OnsDisplay value={collab.ons} size="sm" />
      </p>
      <div className={`${heights[position]} w-full rounded-t-xl opacity-30`} style={{ backgroundColor: collab.color }} />
    </motion.div>
  )
}

const BELT_MONTHS_MAP = { branca: 0, azul: 6, roxa: 18, marrom: 36, preta: 60 }
const BELT_NEXT_MONTHS  = { branca: 6, azul: 18, roxa: 36, marrom: 60, preta: null }

const CollabCard = memo(function CollabCard({ collab, index }) {
  const beltColor      = collab.belt?.color || collab.color
  const beltId         = collab.belt?.id || 'branca'
  const beltStart      = BELT_MONTHS_MAP[beltId] ?? 0
  const nextMths       = BELT_NEXT_MONTHS[beltId]
  const monthsInBelt   = Math.max(0, (collab.months || 0) - beltStart)
  const timePct        = nextMths
    ? Math.min(100, Math.round((monthsInBelt / (nextMths - beltStart)) * 100))
    : 100
  const hasSpecialties = Object.values(collab.deliveriesByType).some(v => v > 0)

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.04 + index * 0.04, duration: 0.28 }}
      className="bg-white rounded-2xl p-4 flex flex-col gap-3"
      style={{ boxShadow: '0 2px 10px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.04)' }}>

      {/* Identidade */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0"
          style={{ boxShadow: `0 0 0 2px ${collab.color}30, 0 2px 8px ${collab.color}20` }}>
          <Avatar collab={collab} className="w-full h-full" style={{}} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-sm font-extrabold text-text leading-tight">{collab.name}</p>
            {collab.badges.slice(0, 5).map((b, i) => <span key={i} className="text-[11px]">{b}</span>)}
          </div>
          <p className="text-[10px] text-muted mt-0.5">{collab.role}</p>
        </div>
        <BeltBadge beltId={collab.belt?.id} grau={collab.grau} size="sm" />
      </div>

      {/* Progresso de faixa — baseado em tempo */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <GrauPips belt={collab.belt} grau={collab.grau} color={collab.color} />
          <span className="text-[9px] font-bold" style={{ color: collab.canLevelUp ? '#6eda2c' : collab.nextRank ? '#8890b5' : '#6eda2c' }}>
            {collab.canLevelUp && collab.nextRank
              ? `✓ Pronto p/ ${collab.nextRank}`
              : collab.mthsNeeded > 0
                ? `${collab.mthsNeeded}m → ${collab.nextRank}`
                : '⚫ Faixa máxima'}
          </span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: beltColor + '20' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: collab.canLevelUp ? '#6eda2c' : `linear-gradient(90deg,${beltColor}aa,${beltColor})` }}
            initial={{ width: 0 }} animate={{ width: `${timePct}%` }}
            transition={{ duration: 0.9, delay: 0.05 + index * 0.04, ease: [0.22, 1, 0.36, 1] }} />
        </div>
        <div className="flex justify-between mt-0.5">
          <span className="text-[8px] text-muted">
            {monthsInBelt}m na faixa · {timePct}% do período
          </span>
          <span className="text-[8px] text-muted">
            <OnsDisplay value={collab.ons} size="xs" color="#8890b5" /> ons
          </span>
        </div>
      </div>

      {/* Stats compacto */}
      <div className="flex items-center gap-0 text-[10px] rounded-xl overflow-hidden"
        style={{ background: '#f4f5fb', border: '1px solid #e8eaf2' }}>
        {[
          { icon: '✅', val: collab.tasksCompleted, label: 'feitas',    color: '#6eda2c' },
          { icon: '📌', val: collab.doingCount,     label: 'fazendo',   color: '#60a5fa' },
          { icon: '🔥', val: `${collab.streak}sem`, label: 'streak',    color: '#ea8a29' },
          { icon: '⚡', val: collab.ons,            label: 'ons total', color: collab.color, isOns: true },
        ].map((s, i) => (
          <div key={i} className="flex-1 text-center py-2.5 border-r last:border-r-0" style={{ borderColor: '#e8eaf2' }}>
            <p className="font-extrabold leading-tight" style={{ color: s.color }}>
              {s.isOns ? <OnsDisplay value={s.val} size="xs" /> : s.val}
            </p>
            <p className="text-[8px] text-muted leading-tight mt-0.5">{s.label}</p>
          </div>
        ))}
        {collab.tasksThisMonth > 0 && (
          <div className="flex-1 text-center py-2.5">
            <p className="font-extrabold leading-tight" style={{ color: '#6eda2c' }}>+{collab.onsThisMonth}</p>
            <p className="text-[8px] text-muted leading-tight mt-0.5">ons/mês</p>
          </div>
        )}
      </div>

      {/* Especialidades */}
      {hasSpecialties ? (
        <div className="flex flex-wrap gap-1">
          {Object.entries(taskTypes).map(([key, cfg]) => {
            const count = collab.deliveriesByType[key] || 0
            if (!count) return null
            return (
              <span key={key} className="text-[9px] font-bold px-1.5 py-0.5 rounded-md"
                style={{ color: cfg.color, background: cfg.color + '12' }}>
                {cfg.icon} {count}
              </span>
            )
          })}
        </div>
      ) : (
        <p className="text-[9px] text-muted">Nenhuma entrega registrada</p>
      )}

      {/* Histórico mensal de ons — contagem contínua */}
      {collab.onsHistory && collab.onsHistory.some(m => m.ons > 0) && (() => {
        const maxOns = Math.max(...collab.onsHistory.map(x => x.ons), 1)
        return (
          <div style={{ borderTop: '1px solid #f0f1f8', paddingTop: 10 }}>
            <p className="text-[8px] font-extrabold uppercase tracking-widest mb-2"
              style={{ color: '#8890b5' }}>
              📈 Ons mensais
            </p>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 44 }}>
              {collab.onsHistory.map((m, i) => {
                const isCurrent = i === collab.onsHistory.length - 1
                const barH = Math.max(4, Math.round((m.ons / maxOns) * 36))
                return (
                  <div key={m.ym} style={{ flex: 1, display: 'flex', flexDirection: 'column',
                    alignItems: 'center', gap: 2, justifyContent: 'flex-end' }}>
                    {m.ons > 0 && (
                      <span style={{ fontSize: 7, fontWeight: 800,
                        color: isCurrent ? beltColor : '#8890b5' }}>
                        {m.ons}
                      </span>
                    )}
                    <motion.div
                      initial={{ height: 0 }} animate={{ height: barH }}
                      transition={{ duration: 0.6, delay: 0.05 + i * 0.07, ease: [0.22,1,0.36,1] }}
                      style={{
                        width: '100%', borderRadius: 3,
                        background: isCurrent
                          ? `linear-gradient(180deg,${beltColor},${beltColor}99)`
                          : m.ons > 0 ? '#e2e4f0' : '#f4f5fb',
                        boxShadow: isCurrent && m.ons > 0 ? `0 0 6px ${beltColor}50` : 'none',
                      }} />
                    <span style={{ fontSize: 6.5, color: isCurrent ? beltColor : '#c0c4d8',
                      fontWeight: isCurrent ? 800 : 400, lineHeight: 1 }}>
                      {m.label}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}
    </motion.div>
  )
})

// ── Main ──────────────────────────────────────────────────────

export default function Equipe() {
  const { collaborators, tasks, erpClients, loading } = useData()

  const currentUser = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2') || '{}') } catch { return {} }
  }, [])

  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'gestor'

  // Aplica o motor de gamificação em todos os colaboradores
  const enriched = useMemo(
    () => collaborators.map(c => computeStats(c, tasks)),
    [collaborators, tasks]
  )

  // Não-admin vê apenas a si mesmo na estrutura de equipe (match por email)
  const visibleEnriched = useMemo(() => {
    if (isAdmin) return enriched
    const email = (currentUser.email || '').toLowerCase()
    return enriched.filter(c =>
      (c.email || '').toLowerCase() === email || c.id === currentUser.id
    )
  }, [enriched, isAdmin, currentUser])

  const sorted  = [...enriched].sort((a, b) => b.ons - a.ons)
  const [first, second, third, ...rest] = sorted
  const podium    = [second, first, third].filter(Boolean)
  const podiumPos = [2, 1, 3]

  const META_MEMBER_IDS = ['tochiro', 'ana_sm', 'beatriz', 'mariana', 'elieser', 'deivisson', 'gs', 'carol']
  const brancaMembers = enriched
    .filter(c => META_MEMBER_IDS.includes(c.id))
    .sort((a, b) => (b.onsThisMonth || 0) - (a.onsThisMonth || 0))

  // Métricas do cabeçalho — escopadas ao que o usuário pode ver
  const visibleIds = new Set(visibleEnriched.map(c => c.id))
  const visibleTasks = isAdmin ? tasks : tasks.filter(t => visibleIds.has(t.assignee))
  const totalXP    = visibleEnriched.reduce((s, c) => s + c.ons, 0)
  const doneTasks  = visibleTasks.filter(t => t.status === 'done').length
  const avgStreak  = visibleEnriched.length
    ? Math.round(visibleEnriched.reduce((s, c) => s + c.streak, 0) / visibleEnriched.length)
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

  const TABS_ADMIN = [
    { key: 'ranking',   label: 'Ranking',   icon: '🏆' },
    { key: 'scorecard', label: 'Scorecard', icon: '📋' },
    { key: 'carreira',  label: 'Carreira',  icon: '🗺️' },
    { key: 'missoes',   label: 'Missões',   icon: '🎯' },
  ]
  const TABS_COLLAB = [
    { key: 'scorecard', label: 'Scorecard', icon: '📋' },
    { key: 'missoes',   label: 'Missões',   icon: '🎯' },
  ]
  const TABS    = isAdmin ? TABS_ADMIN : TABS_COLLAB
  const [tab, setTab] = useState(isAdmin ? 'ranking' : 'scorecard')

  if (loading) return (
    <div className="p-4 lg:p-8 animate-pulse space-y-5">
      <div className="h-8 w-48 bg-surface rounded-xl" />
      <div className="flex gap-4">
        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex-1 h-40 bg-surface rounded-2xl" />)}
      </div>
      <div className="h-64 bg-surface rounded-2xl" />
    </div>
  )

  return (
    <div className="p-4 lg:p-8">

      {/* Header — sempre visível */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <div className="flex items-end justify-between gap-4 mb-5">
          <div>
            <h1 className="text-2xl font-extrabold text-text leading-tight">Equipe</h1>
            <p className="text-[11px] text-muted mt-0.5">Performance e gamificação · TráfegOn</p>
          </div>
          <div className="flex gap-2">
            {[
              { val: visibleEnriched.length,           label: 'membros',  color: '#6eda2c' },
              { val: `${doneTasks}/${visibleTasks.length}`, label: 'tarefas', color: '#60a5fa' },
              { val: `${(totalXP/1000).toFixed(1)}k`,  label: 'ons',      color: '#6eda2c', ons: true },
              { val: `${avgStreak}sem`,                label: 'streak',   color: '#ea8a29' },
            ].map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 + i * 0.04 }}
                className="hidden sm:flex flex-col items-center px-3 py-2 rounded-xl bg-white min-w-[60px]"
                style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.05)' }}>
                <p className="text-sm font-extrabold leading-tight flex items-center gap-1" style={{ color: m.color }}>
                  {m.ons && <OnsToken size="sm" />}{m.val}
                </p>
                <p className="text-[8px] text-muted font-semibold uppercase tracking-wide mt-0.5">{m.label}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-2xl" style={{ background: '#edeef6' }}>
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-extrabold transition-all"
              style={tab === t.key
                ? { background: '#1a1d2e', color: 'white', boxShadow: '0 2px 8px rgba(26,29,46,0.22)' }
                : { color: '#8890b5' }}>
              <span>{t.icon}</span>
              <span>{t.label}</span>
              {t.key === 'carreira' && isAdmin && (
                <span className="text-[8px] px-1 py-0.5 rounded font-extrabold"
                  style={{ background: '#ef444418', color: '#ef4444' }}>ADM</span>
              )}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Tab: Ranking ── */}
      <AnimatePresence mode="wait">
        {tab === 'ranking' && (
          <motion.div key="ranking" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            <LeaderboardList sorted={sorted} />
            <MetaMensalBranca members={brancaMembers} />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sorted.map((c, i) => (
                <CollabCard key={c.id} collab={c} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* ── Tab: Scorecard ── */}
        {tab === 'scorecard' && (
          <motion.div key="scorecard" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            <ScorecardSection enriched={visibleEnriched} />
          </motion.div>
        )}

        {/* ── Tab: Carreira ── */}
        {tab === 'carreira' && (
          <motion.div key="carreira" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            <TrilhasCarreira enriched={visibleEnriched} />
          </motion.div>
        )}

        {/* ── Tab: Missões ── */}
        {tab === 'missoes' && (
          <motion.div key="missoes" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.22 }}>
            <MissoesSection enriched={visibleEnriched} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
