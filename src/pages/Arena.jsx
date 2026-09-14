import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ChevronRight, ChevronDown, Flame } from 'lucide-react'
import { useData } from '../contexts/DataContext'
import { allTimeOns, monthlyOns, isThisMonth } from '../lib/ons'
import { getBeltInfo } from '../data/belt-system'
import { getAvatarComponent } from '../data/avatars'
import { RESTRICTED_EMAILS } from '../data/users-store'
import { ROLE_MISSIONS, CAT_COLORS } from '../data/missions'

/* ══════════════════════════════════════════════════
   CONFIGURAÇÃO
══════════════════════════════════════════════════ */

const COPA_ATIVO = false

const ROLE_CARGO = {
  'Marketing Trainee':    { track: 'Performance 📈', beltReq: 'branca', nextCargo: 'Traffic Analyst',          nextBelt: 'branca',  criteria: ['Planilhas atualizadas sem ser cobrada', 'Zero WhatsApp sem resposta por mais de 2h', 'Cliente oculto positivo por 2 meses consecutivos'] },
  'Traffic Analyst':      { track: 'Performance 📈', beltReq: 'branca', nextCargo: 'Media Buyer',              nextBelt: 'roxa',    criteria: ['Gerencia múltiplas contas com autonomia', 'CPL dentro da meta por 2 meses', 'CRM atualizado semanalmente'] },
  'Traffic Analyst Meta': { track: 'Performance 📈', beltReq: 'branca', nextCargo: 'Media Buyer',              nextBelt: 'roxa',    criteria: ['Gerencia múltiplas contas com autonomia', 'CPL dentro da meta por 2 meses', 'CRM atualizado semanalmente'] },
  'Media Buyer':          { track: 'Performance 📈', beltReq: 'roxa',   nextCargo: 'Performance Strategist',   nextBelt: 'marrom',  criteria: ['ROAS dentro da meta por 2 meses', 'Propõe otimizações sem ser pedido', 'Ensina alguém da trilha'] },
  'Content Creator':      { track: 'Conteúdo ✍️',   beltReq: 'branca', nextCargo: 'Content Strategist',       nextBelt: 'azul',    criteria: ['Grade 100% executada por 2 meses', 'Planejamento com 7 dias de antecedência', 'Propõe pauta com base em performance'] },
  'Creative Producer':    { track: 'Criativo 🎬',   beltReq: 'branca', nextCargo: 'Creative Strategist',      nextBelt: 'azul',    criteria: ['Entrega vídeos e copy sem supervisão', 'Zero reclamação de cliente em 2 meses', 'Propõe abordagem criativa sem ser pedida'] },
  'Marketing Assistant':  { track: 'Criativo 🎬',   beltReq: 'branca', nextCargo: 'Creative Strategist',      nextBelt: 'azul',    criteria: ['Entrega vídeos e copy sem supervisão', 'Zero reclamação de cliente em 2 meses', 'Propõe abordagem criativa sem ser pedida'] },
  'Gestor de Dados':      { track: 'Analytics 📊',  beltReq: 'azul',   nextCargo: 'Analytics Specialist',     nextBelt: 'roxa',    criteria: ['Identifica oportunidades nos dados proativamente', 'Configura rastreamentos e pixels sem supervisão', 'Apresenta insights em reunião de resultado'] },
  'Web Designer':         { track: 'Web 💻',        beltReq: 'roxa',   nextCargo: 'Head of Web & Digital',    nextBelt: 'preta',   criteria: ['Responsável por todas as LPs ativas da agência', 'Define padrões de UX e conversão', 'Propõe melhorias com base em dados'] },
  'Gestor de Tráfego':    { track: 'Performance 📈', beltReq: 'preta',  nextCargo: 'Head of Performance',      nextBelt: 'preta',   criteria: ['Dono do resultado da área', 'Gere orçamento de mídia', 'Desenvolve líderes da trilha'] },
}

const BELT_ORDER    = ['branca', 'azul', 'roxa', 'marrom', 'preta']
const BELT_LABEL_PT  = { branca: 'Branca', azul: 'Azul', roxa: 'Roxa', marrom: 'Marrom', preta: 'Preta' }
const BELT_COLOR_HEX = { branca: '#94a3b8', azul: '#3b82f6', roxa: '#7c3aed', marrom: '#92400e', preta: '#1e293b' }
const BELT_EMOJI_MAP = { branca: '🤍', azul: '💙', roxa: '💜', marrom: '🤎', preta: '🖤' }

const RANKS = [
  { min: 0,   label: 'Iniciante',    icon: '🌱', color: '#8890b5' },
  { min: 15,  label: 'Executor',     icon: '⚡', color: '#60a5fa' },
  { min: 50,  label: 'Velocista',    icon: '🚀', color: '#ea8a29' },
  { min: 120, label: 'Especialista', icon: '🏆', color: '#6eda2c' },
  { min: 250, label: 'Elite',        icon: '👑', color: '#f59e0b' },
]

const MISSIONS_STORAGE = 'trafegon_missions_v1_'

function getRank(ons) {
  let rank = RANKS[0], idx = 0
  RANKS.forEach((r, i) => { if (ons >= r.min) { rank = r; idx = i } })
  const next = RANKS[idx + 1]
  const pct  = next ? Math.min(100, Math.round(((ons - rank.min) / (next.min - rank.min)) * 100)) : 100
  return { ...rank, next, pct }
}

/* ══════════════════════════════════════════════════
   COMPONENTES
══════════════════════════════════════════════════ */

const RANK_AURAS = {
  '🌱': { rings: 1, pulse: '#6eda2c', particles: false, crown: false },
  '⚡': { rings: 2, pulse: '#60a5fa', particles: false, crown: false },
  '🚀': { rings: 2, pulse: '#ea8a29', particles: true,  crown: false },
  '🏆': { rings: 3, pulse: '#6eda2c', particles: true,  crown: false },
  '👑': { rings: 3, pulse: '#f59e0b', particles: true,  crown: true  },
}

function AvatarEvolution({ user, rank }) {
  const aura = RANK_AURAS[rank.icon] || RANK_AURAS['🌱']
  const Svg  = getAvatarComponent(user?.email) || getAvatarComponent(user?.id)

  return (
    <div className="relative flex-shrink-0" style={{ width: 110, height: 110 }}>
      {Array.from({ length: aura.rings }).map((_, i) => (
        <motion.div key={i}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ border: `${i === 0 ? 2.5 : 1.5}px solid ${rank.color}${i === 0 ? 'cc' : '44'}` }}
          animate={{ scale: [1, 1.06 + i * 0.04, 1], opacity: [0.7, 0.3, 0.7] }}
          transition={{ duration: 2.2 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
        />
      ))}

      {aura.particles && Array.from({ length: 5 }).map((_, i) => (
        <motion.div key={i}
          className="absolute rounded-full pointer-events-none"
          style={{ width: 3, height: 3, background: rank.color,
                   left: `${15 + i * 18}%`, bottom: '8%' }}
          animate={{ y: [0, -35, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: 1.6 + i * 0.25, repeat: Infinity, delay: i * 0.4 }}
        />
      ))}

      {aura.crown && (
        <motion.div className="absolute -top-4 left-1/2 -translate-x-1/2 text-xl pointer-events-none z-20"
          animate={{ y: [0, -3, 0], rotate: [-5, 5, -5] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
          👑
        </motion.div>
      )}

      <motion.div
        className="w-full h-full rounded-2xl overflow-hidden relative z-10"
        style={{
          border: `3px solid ${rank.color}`,
          boxShadow: `0 0 28px ${rank.color}55`,
        }}
        animate={{ boxShadow: [`0 0 20px ${rank.color}40`, `0 0 45px ${rank.color}80`, `0 0 20px ${rank.color}40`] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      >
        {Svg
          ? <div className="w-full h-full"><Svg /></div>
          : <div className="w-full h-full flex items-center justify-center text-2xl font-black text-white"
              style={{ background: `linear-gradient(135deg,${rank.color}33,${rank.color}11)` }}>
              {(user?.name || '?')[0]}
            </div>
        }
        <div className="absolute top-0 left-0 right-0 h-1/3 pointer-events-none rounded-t-xl"
          style={{ background: `linear-gradient(180deg,${rank.color}25,transparent)` }} />
      </motion.div>

      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-0.5 z-20">
        {Array.from({ length: 5 }).map((_, i) => {
          const rankIdx = RANKS.findIndex(r => r.icon === rank.icon)
          const filled  = i <= rankIdx
          return (
            <motion.span key={i}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}
              style={{
                fontSize: filled ? 13 : 11,
                color: filled ? rank.color : 'rgba(255,255,255,0.12)',
                filter: filled ? `drop-shadow(0 0 5px ${rank.color}cc)` : 'none',
                lineHeight: 1,
              }}>★</motion.span>
          )
        })}
      </div>
    </div>
  )
}

/* ── Player Hero ─────────────────────────────────────────────────── */
function PlayerHero({ user, userOns, totalTasks }) {
  const rank = getRank(userOns)

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-3xl p-6"
      style={{
        background: 'linear-gradient(135deg,#0a0c14 0%,#111420 40%,#0d0f1c 100%)',
        boxShadow: `0 0 0 1px rgba(255,255,255,0.06), 0 24px 70px rgba(0,0,0,0.6), 0 0 100px ${rank.color}12`,
        border: `1px solid ${rank.color}20`,
      }}
    >
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 15% 40%, ${rank.color}10 0%, transparent 55%)` }} />
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 85% 60%, ${rank.color}07 0%, transparent 50%)` }} />

      <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">

        <div className="pb-6 flex-shrink-0">
          <AvatarEvolution user={user} rank={rank} />
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start mb-1">
            <h2 className="text-xl font-black text-white">{user?.name || 'Jogador'}</h2>
          </div>

          <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
            {user?.role || 'Colaborador'} · {totalTasks} tarefas concluídas
          </p>

          <div className="flex items-end gap-4 flex-wrap justify-center sm:justify-start">
            <div>
              <p className="text-4xl font-black leading-none"
                style={{ color: rank.color, textShadow: `0 0 30px ${rank.color}70` }}>
                {userOns}
                <span className="text-lg font-bold ml-1.5" style={{ color: rank.color + '99' }}>ons</span>
              </p>
              {rank.next && (
                <p className="text-[10px] font-bold mt-1" style={{ color: 'rgba(255,255,255,0.28)' }}>
                  {rank.next.min - userOns} ons para {rank.next.icon} {rank.next.label}
                </p>
              )}
            </div>

            <div className="flex-1 min-w-[160px]">
              <div className="flex justify-between text-[9px] font-bold mb-1.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
                <span>{rank.icon}</span><span>{rank.pct}%</span>
                {rank.next && <span>{rank.next.icon}</span>}
              </div>
              <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <motion.div className="h-full rounded-full relative overflow-hidden"
                  style={{ background: `linear-gradient(90deg,${rank.color}bb,${rank.color})` }}
                  initial={{ width: 0 }} animate={{ width: `${rank.pct}%` }}
                  transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}>
                  <motion.div className="absolute inset-0"
                    style={{ background: 'linear-gradient(90deg,transparent 30%,rgba(255,255,255,0.35) 55%,transparent 80%)' }}
                    animate={{ x: ['-100%', '200%'] }} transition={{ duration: 2.2, repeat: Infinity }} />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex sm:flex-col gap-2 flex-shrink-0">
          {[
            { label: 'Rank',    value: rank.icon,    color: rank.color },
            { label: 'Ons/mês', value: userOns,      color: '#fff' },
            { label: 'Tarefas', value: totalTasks,   color: '#6eda2c' },
          ].map(s => (
            <div key={s.label} className="text-center px-3 py-2 rounded-xl min-w-[64px]"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-sm font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

/* ── Faixa + Grau ────────────────────────────────────────────────── */
function BeltCard({ beltInfo, allTimeUserOns }) {
  if (!beltInfo) return null
  const { belt, grau, xpInGrau, grauSpan, nextBelt, mthsNeeded, canAdvance } = beltInfo
  const pct = Math.min(100, Math.round((xpInGrau / Math.max(1, grauSpan)) * 100))

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
      className="rounded-2xl p-5 mb-4"
      style={{ background: 'white', boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${belt.color}30` }}>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted">Faixa Atual</p>
          <div className="flex items-center gap-2 mt-1">
            <span style={{ fontSize: 22 }}>{BELT_EMOJI_MAP[belt.id] || '🤍'}</span>
            <p className="text-lg font-black" style={{ color: belt.color }}>{belt.label}</p>
            <span className="text-sm font-semibold text-muted">Grau {grau}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-black text-text">{allTimeUserOns}</p>
          <p className="text-[10px] font-bold text-muted">ONs acumulados</p>
        </div>
      </div>

      <div className="mb-2">
        <div className="flex justify-between text-[10px] font-bold mb-1.5">
          <span style={{ color: belt.color }}>Grau {grau}</span>
          <span className="text-muted">{Math.max(0, grauSpan - xpInGrau)} ons para Grau {Math.min(grau + 1, belt.grauXp.length)}</span>
          <span style={{ color: belt.color }}>{pct}%</span>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#f0f2fa' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: `linear-gradient(90deg,${belt.color}bb,${belt.color})` }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
        </div>
      </div>

      {nextBelt && (
        <div className="mt-3 rounded-xl px-3 py-2 flex items-center gap-2"
          style={{ background: canAdvance ? 'rgba(110,218,44,0.08)' : '#f7f8fc', border: `1px solid ${canAdvance ? 'rgba(110,218,44,0.2)' : '#e0e3f0'}` }}>
          <span style={{ fontSize: 14 }}>{BELT_EMOJI_MAP[nextBelt.id] || '🤍'}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold" style={{ color: canAdvance ? '#16a34a' : '#8890b5' }}>
              {canAdvance
                ? `✓ Elegível para Faixa ${nextBelt.label} — aguarda aprovação da liderança`
                : `Faixa ${nextBelt.label}: ainda ${mthsNeeded} ${mthsNeeded === 1 ? 'mês' : 'meses'} de empresa`}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  )
}

/* ── Cargo atual + próxima promoção ─────────────────────────────── */
function CargoCard({ user, beltInfo, userCollab }) {
  const role     = user?.role || userCollab?.role
  const roleInfo = ROLE_CARGO[role]
  if (!roleInfo || !beltInfo) return null

  const belt        = beltInfo.belt
  const beltIdx     = BELT_ORDER.indexOf(belt?.id || 'branca')
  const nextBeltIdx = BELT_ORDER.indexOf(roleInfo.nextBelt)
  const eligible    = beltIdx >= nextBeltIdx

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="rounded-2xl p-5 mb-4"
      style={{ background: 'white', boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>

      <p className="text-[10px] font-extrabold uppercase tracking-widest text-muted mb-4">Trilha de Carreira · {roleInfo.track}</p>

      <div className="flex items-start gap-3 mb-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${BELT_COLOR_HEX[roleInfo.beltReq]}15`, border: `1.5px solid ${BELT_COLOR_HEX[roleInfo.beltReq]}40` }}>
          <span style={{ fontSize: 16 }}>📍</span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted">Cargo atual</p>
          <p className="text-sm font-extrabold text-text">{role}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${BELT_COLOR_HEX[roleInfo.beltReq]}15`, color: BELT_COLOR_HEX[roleInfo.beltReq] }}>
            {BELT_EMOJI_MAP[roleInfo.beltReq]} Faixa {BELT_LABEL_PT[roleInfo.beltReq]}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 my-2">
        <div className="flex-1 h-px" style={{ background: '#e0e3f0' }} />
        <ChevronRight size={14} className="text-muted" />
        <div className="flex-1 h-px" style={{ background: '#e0e3f0' }} />
      </div>

      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${BELT_COLOR_HEX[roleInfo.nextBelt]}15`, border: `1.5px solid ${BELT_COLOR_HEX[roleInfo.nextBelt]}40` }}>
          <span style={{ fontSize: 16 }}>{eligible ? '🔓' : '🔒'}</span>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted">Próximo cargo</p>
          <p className={`text-sm font-extrabold ${eligible ? 'text-text' : 'text-muted'}`}>{roleInfo.nextCargo}</p>
          <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: `${BELT_COLOR_HEX[roleInfo.nextBelt]}15`, color: BELT_COLOR_HEX[roleInfo.nextBelt] }}>
            {BELT_EMOJI_MAP[roleInfo.nextBelt]} Faixa {BELT_LABEL_PT[roleInfo.nextBelt]}
          </span>
        </div>
      </div>

      <div className="rounded-xl p-3" style={{ background: '#f7f8fc' }}>
        <p className="text-[9px] font-extrabold uppercase tracking-widest text-muted mb-2">Para avançar</p>
        {roleInfo.criteria.map((c, i) => (
          <div key={i} className="flex items-start gap-2 mb-1.5 last:mb-0">
            <span className="text-[10px] flex-shrink-0 mt-0.5" style={{ color: '#b0b5cc' }}>○</span>
            <p className="text-[11px] font-medium text-muted leading-snug">{c}</p>
          </div>
        ))}
      </div>

      {eligible && (
        <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(110,218,44,0.08)', border: '1px solid rgba(110,218,44,0.2)' }}>
          <p className="text-[11px] font-bold" style={{ color: '#16a34a' }}>
            ✓ Faixa {BELT_LABEL_PT[belt?.id || 'branca']} elegível — cumpra os critérios acima e solicite avaliação à liderança
          </p>
        </div>
      )}
    </motion.div>
  )
}

/* ── Missões do mês — visão individual ─────────────────────────── */
function MissoesSection({ userCollab }) {
  const ym  = new Date().toISOString().slice(0, 7)
  const mes = new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })

  const [done, setDone] = useState(() => {
    try { return JSON.parse(localStorage.getItem(MISSIONS_STORAGE + ym)) || {} } catch { return {} }
  })
  const [open, setOpen] = useState(false)

  const def = ROLE_MISSIONS[userCollab?.role]
  if (!def || !userCollab) return null

  function toggle(mId) {
    setDone(prev => {
      const k    = `${userCollab.id}::${mId}`
      const next = { ...prev, [k]: !prev[k] }
      localStorage.setItem(MISSIONS_STORAGE + ym, JSON.stringify(next))
      return next
    })
  }
  const isDone = mid => !!done[`${userCollab.id}::${mid}`]

  const mList     = def.missions
  const doneCount = mList.filter(m => isDone(m.id)).length
  const pct       = mList.length ? Math.round((doneCount / mList.length) * 100) : 0
  const onsEarned = mList.filter(m => isDone(m.id)).reduce((s, m) => s + m.ons, 0)
  const cats      = [...new Set(mList.map(m => m.cat))]
  const circ      = 2 * Math.PI * 18

  const badge = pct === 100 ? { label: '🔥 COMPLETO', color: '#6eda2c' }
    : pct >= 70  ? { label: '⚡ NO RITMO',     color: '#f59e0b' }
    : pct >= 30  ? { label: '🚀 EM ANDAMENTO', color: '#60a5fa' }
    : null

  const SvgAvatar = getAvatarComponent(userCollab.id) || getAvatarComponent(userCollab.email)

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
      className="mb-4">

      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-lg font-extrabold text-text">🎯 Missões do Mês</h2>
          <p className="text-[11px] text-muted mt-0.5">{def.icon} {def.area} · {mes}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-extrabold" style={{ color: pct >= 80 ? '#6eda2c' : pct >= 50 ? '#f59e0b' : '#8890b5' }}>
            {pct}%
          </p>
          <p className="text-[9px] text-muted">{doneCount}/{mList.length}</p>
        </div>
      </div>

      <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: '#edeef6' }}>
        <motion.div className="h-full rounded-full"
          style={{ background: pct >= 80 ? 'linear-gradient(90deg,#6eda2c,#a8f040)' : 'linear-gradient(90deg,#60a5fa,#a78bfa)' }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      </div>

      <motion.div
        className="rounded-2xl overflow-hidden"
        style={{ background: '#fff', border: `1px solid ${pct === 100 ? '#6eda2c20' : '#edeef6'}`,
          boxShadow: pct === 100 ? '0 4px 20px #6eda2c12' : '0 2px 10px rgba(26,29,46,0.07)' }}>

        <button className="w-full text-left p-4 flex items-center gap-3"
          onClick={() => setOpen(!open)}>

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
              {SvgAvatar
                ? <SvgAvatar />
                : <div className="w-full h-full flex items-center justify-center text-xs font-black"
                    style={{ background: def.areaColor + '20', color: def.areaColor }}>
                    {(userCollab.name || '?')[0]}
                  </div>
              }
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
              <p className="text-sm font-extrabold text-text">{userCollab.name?.split(' ')[0]}</p>
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
            <p className="text-[10px] font-bold" style={{ color: def.areaColor }}>{userCollab.role}</p>
          </div>

          <div className="text-right flex-shrink-0 mr-1">
            <p className="text-xl font-extrabold leading-none"
              style={{ color: pct === 100 ? '#6eda2c' : pct >= 50 ? def.areaColor : '#c0c4d8' }}>
              {pct}<span className="text-[10px] font-bold">%</span>
            </p>
            {onsEarned > 0 && <p className="text-[8px] font-extrabold" style={{ color: '#ea8a29' }}>+{onsEarned} ons</p>}
          </div>

          <ChevronDown size={14} className="text-muted flex-shrink-0 transition-transform"
            style={{ transform: open ? 'rotate(180deg)' : 'none' }} />
        </button>

        <div className="h-1 mx-4 rounded-full overflow-hidden" style={{ background: def.areaColor + '12' }}>
          <motion.div className="h-full rounded-full"
            style={{ background: pct === 100 ? 'linear-gradient(90deg,#6eda2c,#a8f040)' : `linear-gradient(90deg,${def.areaColor}88,${def.areaColor})` }}
            initial={{ width: 0 }} animate={{ width: `${pct}%` }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} />
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
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="border-t px-4 pt-3 pb-4 space-y-4" style={{ borderColor: '#edeef6' }}>

                <div>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted mb-2">
                    Missões · clique para marcar concluído
                  </p>
                  <div className="space-y-1.5">
                    {mList.map(m => {
                      const checked  = isDone(m.id)
                      const catColor = CAT_COLORS[m.cat] || '#8890b5'
                      return (
                        <motion.button key={m.id} whileTap={{ scale: 0.97 }}
                          onClick={() => toggle(m.id)}
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

                {def.goals?.length > 0 && (
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
                )}

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
    </motion.div>
  )
}

/* ══════════════════════════════════════════════════
   CARREIRA — PÁGINA PRINCIPAL
══════════════════════════════════════════════════ */

export default function Arena() {
  const { tasks, collaborators, loading } = useData()

  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('authUser_v2')) } catch { return null }
  }, [])

  const userOns = useMemo(() => monthlyOns(tasks, user?.id), [tasks, user])
  const allTimeUserOns = useMemo(() => allTimeOns(tasks, user?.id), [tasks, user])

  const totalTasks = useMemo(() =>
    tasks.filter(t => t.assignee === user?.id && t.status === 'done' && isThisMonth(t)).length
  , [tasks, user])

  const userCollab = useMemo(() =>
    (collaborators || []).find(c => c.id === user?.id),
    [collaborators, user]
  )

  const monthsInCompany = useMemo(() => {
    if (!userCollab?.since) return 0
    return Math.max(0, Math.floor((Date.now() - new Date(userCollab.since).getTime()) / (1000 * 60 * 60 * 24 * 30.5)))
  }, [userCollab])

  const beltInfo = useMemo(() =>
    getBeltInfo(allTimeUserOns, monthsInCompany, 85, userCollab?.belt || 'branca', userCollab?.grau || 0),
    [allTimeUserOns, monthsInCompany, userCollab]
  )

  const isRestricted = RESTRICTED_EMAILS.has(user?.email)

  if (loading) return (
    <div className="p-4 lg:p-8 animate-pulse space-y-5">
      <div className="h-8 w-48 bg-surface rounded-xl" />
      <div className="h-36 bg-surface rounded-2xl" />
      <div className="h-48 bg-surface rounded-2xl" />
      <div className="h-48 bg-surface rounded-2xl" />
    </div>
  )

  const header = (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 mb-6">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg,#1a1d2e,#2d3154)' }}>
        <Flame size={16} className="text-white" />
      </div>
      <div>
        <h1 className="text-xl font-extrabold text-text">Carreira</h1>
        <p className="text-xs text-muted">Scorecard · Faixa · Missões — sua evolução conectada</p>
      </div>
    </motion.div>
  )

  /* ── Visão restrita ── */
  if (isRestricted) {
    return (
      <div className="p-4 lg:p-8 min-h-screen" style={{ background: '#f4f6fd' }}>
        {header}
        <div className="mb-4">
          <PlayerHero user={user} userOns={userOns} totalTasks={totalTasks} />
        </div>
        <BeltCard beltInfo={beltInfo} allTimeUserOns={allTimeUserOns} />
        <CargoCard user={user} beltInfo={beltInfo} userCollab={userCollab} />
        <MissoesSection userCollab={userCollab} />
      </div>
    )
  }

  /* ── Visão completa ── */
  return (
    <div className="p-4 lg:p-8 min-h-screen" style={{ background: '#f4f6fd' }}>
      {header}

      <div className="mb-4">
        <PlayerHero user={user} userOns={userOns} totalTasks={totalTasks} />
      </div>

      <BeltCard beltInfo={beltInfo} allTimeUserOns={allTimeUserOns} />
      <CargoCard user={user} beltInfo={beltInfo} userCollab={userCollab} />
      <MissoesSection userCollab={userCollab} />
    </div>
  )
}
