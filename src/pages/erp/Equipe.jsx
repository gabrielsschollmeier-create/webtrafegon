import { motion } from 'framer-motion'
import { Flame, Trophy, Zap, TrendingUp, DollarSign, Clock, Star } from 'lucide-react'
import { collaborators, tasks, taskTypes, erpClients } from '../../data/erp-mock'

function monthsSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr + 'T00:00:00').getTime()) / (1000 * 60 * 60 * 24 * 30.44))
}

function getCollabScore(collab) {
  const months = monthsSince(collab.since || '2025-01-01')
  const carteira = erpClients
    .filter(c => c.manager === collab.id)
    .reduce((s, c) => s + c.monthlyValue, 0)
  return { months, carteira, score: carteira * months }
}

function XpBar({ xp, xpToNext, color }) {
  const pct = Math.round((xp / xpToNext) * 100)
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

function PodiumCard({ collab, position, delay }) {
  const heights = { 1: 'h-24', 2: 'h-16', 3: 'h-10' }
  const medals = { 1: '🥇', 2: '🥈', 3: '🥉' }
  const sizes = { 1: 'w-14 h-14 text-base', 2: 'w-12 h-12 text-sm', 3: 'w-10 h-10 text-xs' }

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
      <p className="text-[10px] text-muted text-center">{collab.role}</p>
      <p className="text-sm font-extrabold" style={{ color: collab.color }}>{collab.xp.toLocaleString('pt-BR')} XP</p>
      <div className={`${heights[position]} w-full rounded-t-xl opacity-30`} style={{ backgroundColor: collab.color }} />
    </motion.div>
  )
}

function CollabCard({ collab, index }) {
  const collabTasks = tasks.filter(t => t.assignee === collab.id)
  const done = collabTasks.filter(t => t.status === 'done').length
  const doing = collabTasks.filter(t => t.status === 'doing').length
  const pctXp = Math.round((collab.xp / collab.xpToNext) * 100)

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
          <div className="flex items-center gap-2">
            <p className="text-sm font-extrabold text-text">{collab.name}</p>
            <div className="flex gap-1">
              {collab.badges.map((b, i) => <span key={i} className="text-xs">{b}</span>)}
            </div>
          </div>
          <p className="text-[11px] text-muted">{collab.role}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-extrabold" style={{ color: collab.color }}>{collab.rank}</p>
          <p className="text-[10px] text-muted">Nível {collab.level}</p>
        </div>
      </div>

      {/* XP Bar */}
      <div className="mb-4">
        <XpBar xp={collab.xp} xpToNext={collab.xpToNext} color={collab.color} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Trophy, label: 'Concluídas', value: done,              color: '#6eda2c' },
          { icon: TrendingUp, label: 'Em andamento', value: doing,       color: '#60a5fa' },
          { icon: Flame,  label: 'Streak',     value: `${collab.streak}d`, color: '#ea8a29' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="rounded-xl p-2.5 text-center" style={{ backgroundColor: color + '10' }}>
            <Icon size={13} style={{ color }} className="mx-auto mb-1" />
            <p className="text-sm font-extrabold" style={{ color }}>{value}</p>
            <p className="text-[9px] text-muted font-semibold uppercase tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {/* Tipos de entrega */}
      <div>
        <p className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2">Especialidades</p>
        <div className="flex flex-wrap gap-1.5">
          {Object.entries(taskTypes).map(([key, cfg]) => {
            const count = collab.deliveriesByType[key]
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
        </div>
      </div>
    </motion.div>
  )
}

export default function Equipe() {
  const sorted = [...collaborators].sort((a, b) => b.xp - a.xp)
  const [first, second, third, ...rest] = sorted
  const podium = [second, first, third].filter(Boolean)
  const podiumPos = [2, 1, 3]

  const totalTasks = tasks.length
  const doneTasks = tasks.filter(t => t.status === 'done').length
  const totalXP = collaborators.reduce((s, c) => s + c.xp, 0)
  const avgStreak = Math.round(collaborators.reduce((s, c) => s + c.streak, 0) / collaborators.length)

  return (
    <div className="p-8">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-extrabold text-text">Equipe</h1>
        <p className="text-sm text-muted mt-0.5">Performance e gamificação da equipe TráfegOn</p>

        {/* Métricas da equipe */}
        <div className="grid grid-cols-4 gap-3 mt-6">
          {[
            { label: 'Membros ativos',     value: collaborators.length, color: '#6eda2c', emoji: '👥' },
            { label: 'Tarefas concluídas', value: `${doneTasks}/${totalTasks}`, color: '#60a5fa', emoji: '✅' },
            { label: 'XP total da equipe', value: `${(totalXP/1000).toFixed(1)}k`, color: '#be29ec', emoji: '⚡' },
            { label: 'Streak médio',       value: `${avgStreak} dias`, color: '#ea8a29', emoji: '🔥' },
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

      {/* Pódio */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-2xl p-8 mb-8"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={16} className="text-accent" />
          <p className="text-sm font-extrabold text-text">Ranking XP — Este mês</p>
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
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className="bg-white rounded-2xl p-6 mb-8"
        style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09), 0 0 0 1px rgba(26,29,46,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Star size={16} style={{ color: '#ea8a29' }} />
          <p className="text-sm font-extrabold text-text">Índice de Carteira × Tempo de Casa</p>
          <span className="ml-auto text-[10px] text-muted font-medium">(R$ carteira gerenciada × meses na agência)</span>
        </div>
        <div className="space-y-3">
          {[...collaborators]
            .map(c => ({ ...c, ...getCollabScore(c) }))
            .sort((a, b) => b.score - a.score)
            .map((c, i) => {
              const fmt = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
              const maxScore = collaborators.map(x => getCollabScore(x).score).reduce((a, b) => Math.max(a, b), 1)
              const pct = Math.round((c.score / maxScore) * 100)
              return (
                <div key={c.id} className="flex items-center gap-4">
                  <span className="w-5 text-center text-sm font-extrabold" style={{ color: ['#f59e0b','#94a3b8','#b45309'][i] || '#8890b5' }}>
                    {['🥇','🥈','🥉'][i] || `#${i+1}`}
                  </span>
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                    style={{ backgroundColor: c.color }}>
                    {c.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-text">{c.name}</span>
                      <span className="text-[10px] font-bold text-muted">{fmt(c.carteira)}/mês × {c.months}m = <span style={{ color: c.color }}>{(c.score/1000).toFixed(0)}k pts</span></span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: c.color + '20' }}>
                      <motion.div className="h-full rounded-full" style={{ background: c.color }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.9, delay: 0.4 + i * 0.1, ease: [0.22,1,0.36,1] }} />
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </motion.div>

      {/* Cards individuais */}
      <div className="grid grid-cols-2 gap-4">
        {sorted.map((c, i) => (
          <CollabCard key={c.id} collab={c} index={i} />
        ))}
      </div>
    </div>
  )
}
