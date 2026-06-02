import { useState, useMemo, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LogOut, Zap, Calendar, Package, CheckCircle2, Plus, X,
  Phone, TrendingUp, Users, DollarSign, BarChart2,
  Target, MousePointer, Eye, ArrowUpRight, ArrowDownRight,
  Megaphone, Search, ChevronRight, ChevronLeft, Award, Gift, Lock,
  ExternalLink, LayoutGrid, List, Filter, Pencil, ArrowUpDown,
} from 'lucide-react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { erpClients, meetings, milestoneTypes, taskTypes, statusConfig } from '../data/erp-mock'
import { DEFAULT_PORTAL_MODULES } from '../data/users-store'
import { useData } from '../contexts/DataContext'

/* ── Fases de parceria ──────────────────────────────────── */
const PARTNERSHIP_PHASES = [
  {
    id: 'inicio',
    label: 'Início',
    months: 0,
    color: '#60a5fa',
    icon: '🚀',
    desc: 'Onboarding e primeiras campanhas',
    benefits: ['Acesso ao portal do cliente', 'Relatórios mensais', 'Suporte por e-mail'],
  },
  {
    id: 'otimizacao',
    label: 'Otimização',
    months: 3,
    color: '#ea8a29',
    icon: '⚡',
    desc: 'Ajustes e aprendizado do algoritmo',
    benefits: ['Relatórios quinzenais', 'Reunião mensal de resultados', 'Suporte prioritário'],
  },
  {
    id: 'crescimento',
    label: 'Crescimento',
    months: 6,
    color: '#6eda2c',
    icon: '📈',
    desc: 'Resultados consistentes e escala',
    benefits: ['Análise de concorrência trimestral', 'Reuniões quinzenais', 'Desconto de 5%'],
  },
  {
    id: 'parceria',
    label: 'Parceria',
    months: 12,
    color: '#be29ec',
    icon: '🏆',
    desc: 'Estratégia co-criada e atendimento premium',
    benefits: ['Consultoria estratégica mensal', 'Desconto de 10%', 'WhatsApp direto com o gestor', 'Playbook personalizado'],
  },
  {
    id: 'elite',
    label: 'Elite',
    months: 24,
    color: '#f59e0b',
    icon: '👑',
    desc: 'VIP — parceiro de longo prazo',
    benefits: ['Atendimento VIP dedicado', 'Desconto de 15%', 'Co-criação de estratégia', 'Acesso a betas exclusivos'],
  },
]

function getPhaseIdx(sinceDate) {
  const since  = new Date(sinceDate + 'T00:00:00')
  const months = Math.floor((Date.now() - since.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  let idx = 0
  for (let i = PARTNERSHIP_PHASES.length - 1; i >= 0; i--) {
    if (months >= PARTNERSHIP_PHASES[i].months) { idx = i; break }
  }
  return { months, phaseIdx: idx }
}

/* ── Linha do Tempo de Parceria — gamificada ────────────── */
function PartnershipTimeline({ client }) {
  const { months, phaseIdx } = getPhaseIdx(client.since)
  const currentPhase = PARTNERSHIP_PHASES[phaseIdx]
  const nextPhase    = PARTNERSHIP_PHASES[phaseIdx + 1]
  const pct = nextPhase
    ? Math.min(100, Math.round(((months - currentPhase.months) / (nextPhase.months - currentPhase.months)) * 100))
    : 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}
    >
      <div className="h-1.5" style={{ background: `linear-gradient(90deg, ${currentPhase.color}, ${nextPhase?.color ?? currentPhase.color}80)` }} />
      <div className="p-5">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
              style={{
                background: `linear-gradient(135deg, ${currentPhase.color}30, ${currentPhase.color}12)`,
                border: `2px solid ${currentPhase.color}50`,
                boxShadow: `0 0 16px ${currentPhase.color}30`,
              }}>
              {currentPhase.icon}
            </motion.div>
            <div>
              <p className="text-[10px] font-extrabold tracking-widest uppercase" style={{ color: currentPhase.color }}>
                Nível {phaseIdx + 1} · Jornada de Parceria
              </p>
              <p className="text-base font-extrabold text-text">{currentPhase.label}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black" style={{ color: currentPhase.color }}>{months}</p>
            <p className="text-[9px] font-bold text-muted uppercase tracking-widest">{months === 1 ? 'mês' : 'meses'} juntos</p>
          </div>
        </div>

        {/* Level path */}
        <div className="flex items-center mb-5 overflow-x-auto pb-1">
          {PARTNERSHIP_PHASES.map((phase, i) => {
            const done   = i < phaseIdx
            const active = i === phaseIdx
            const locked = i > phaseIdx
            return (
              <div key={phase.id} className="flex items-center flex-1 min-w-0">
                <div className="flex flex-col items-center flex-shrink-0" style={{ minWidth: 52 }}>
                  <motion.div
                    animate={active ? { boxShadow: [`0 0 0px ${phase.color}00`, `0 0 14px ${phase.color}60`, `0 0 0px ${phase.color}00`] } : {}}
                    transition={active ? { repeat: Infinity, duration: 2.5 } : {}}
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1 relative"
                    style={{
                      backgroundColor: done ? phase.color + '25' : active ? phase.color + '20' : '#f0f2f8',
                      border: `2px solid ${done || active ? phase.color : '#dde1f0'}`,
                    }}>
                    {locked
                      ? <Lock size={12} style={{ color: '#b0b8d0' }} />
                      : done
                        ? <span className="text-sm">⭐</span>
                        : <span className="text-sm">{phase.icon}</span>
                    }
                  </motion.div>
                  <p className="text-[9px] font-extrabold text-center" style={{ color: done || active ? phase.color : '#b0b8d0' }}>
                    N{i + 1}
                  </p>
                  <p className="text-[8px] text-muted text-center whitespace-nowrap">{phase.label}</p>
                </div>
                {i < PARTNERSHIP_PHASES.length - 1 && (
                  <div className="flex-1 h-1.5 rounded-full mx-1 overflow-hidden flex-shrink-0" style={{ backgroundColor: '#e8eaf2', minWidth: 16 }}>
                    {done && (
                      <motion.div className="h-full rounded-full"
                        style={{ backgroundColor: PARTNERSHIP_PHASES[i + 1].color }}
                        initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 0.8, delay: i * 0.15 }} />
                    )}
                    {active && (
                      <motion.div className="h-full rounded-full"
                        style={{ background: `linear-gradient(90deg, ${phase.color}, ${nextPhase?.color ?? phase.color})` }}
                        initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }} />
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Current phase card */}
        <div className="rounded-2xl p-4 mb-4"
          style={{ background: `linear-gradient(135deg, ${currentPhase.color}10, ${currentPhase.color}05)`, border: `1px solid ${currentPhase.color}25` }}>
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentPhase.icon}</span>
              <div>
                <p className="text-xs font-extrabold" style={{ color: currentPhase.color }}>Nível {phaseIdx + 1} — {currentPhase.label}</p>
                <p className="text-[11px] text-muted">{currentPhase.desc}</p>
              </div>
            </div>
            <span className="text-[9px] font-extrabold px-2 py-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: currentPhase.color + '20', color: currentPhase.color }}>
              DESBLOQUEADO ✓
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {currentPhase.benefits.map(b => (
              <div key={b} className="flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 text-[10px]"
                  style={{ backgroundColor: currentPhase.color + '25', color: currentPhase.color }}>✓</div>
                <span className="text-[11px] text-text font-medium leading-snug">{b}</span>
              </div>
            ))}
          </div>
        </div>

        {/* XP progress */}
        {nextPhase ? (
          <div>
            <div className="flex items-center justify-between text-[10px] mb-1.5 font-bold">
              <div className="flex items-center gap-1.5">
                <span style={{ color: currentPhase.color }}>N{phaseIdx + 1}</span>
                <ChevronRight size={10} className="text-muted" />
                <span style={{ color: nextPhase.color }}>{nextPhase.icon} N{phaseIdx + 2} {nextPhase.label}</span>
              </div>
              <span className="text-muted">{pct}%</span>
            </div>
            <div className="relative h-3 rounded-full overflow-hidden mb-1.5" style={{ background: nextPhase.color + '18' }}>
              <motion.div className="h-full rounded-full overflow-hidden"
                style={{ background: `linear-gradient(90deg, ${currentPhase.color}, ${nextPhase.color})` }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
                <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)' }} />
              </motion.div>
              {[25, 50, 75].map(m => (
                <div key={m} className="absolute top-0 bottom-0 w-px" style={{ left: `${m}%`, backgroundColor: 'white', opacity: 0.3 }} />
              ))}
            </div>
            <div className="flex justify-between text-[10px] mb-3">
              <span className="text-muted">{months} {months === 1 ? 'mês' : 'meses'}</span>
              <span style={{ color: nextPhase.color }} className="font-bold">
                {nextPhase.months - months} {nextPhase.months - months === 1 ? 'mês' : 'meses'} para {nextPhase.label}
              </span>
            </div>
            <div className="flex items-start gap-2.5 p-3 rounded-xl"
              style={{ backgroundColor: nextPhase.color + '0d', border: `1px solid ${nextPhase.color}20` }}>
              <span className="text-base flex-shrink-0">🎁</span>
              <div>
                <p className="text-[10px] font-extrabold mb-0.5" style={{ color: nextPhase.color }}>
                  Desbloqueie em {nextPhase.label}:
                </p>
                <p className="text-[11px] text-muted leading-snug">
                  {nextPhase.benefits.slice(0, 2).join(' · ')}
                  {nextPhase.benefits.length > 2 && ` · +${nextPhase.benefits.length - 2} benefícios`}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3 p-3 rounded-2xl"
            style={{ background: 'linear-gradient(135deg, #f59e0b18, #f59e0b08)', border: '1px solid #f59e0b30' }}>
            <span className="text-2xl">👑</span>
            <div>
              <p className="text-sm font-extrabold text-[#f59e0b]">Parceiro Elite — Nível Máximo!</p>
              <p className="text-xs text-muted">Você atingiu o mais alto nível de parceria com a TráfegOn.</p>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  )
}

/* ── Linha do Tempo do Projeto — vertical, gamificada ───── */
function TimelineView({ clientMilestones }) {
  const today = new Date().toISOString().split('T')[0]
  const sorted = [...clientMilestones].sort((a, b) => a.date.localeCompare(b.date))
  const todayIdx = sorted.findIndex(m => m.date >= today)

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-extrabold text-text">Linha do tempo do projeto</p>
          <p className="text-xs text-muted mt-0.5">Marcos e entregas da sua jornada</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(milestoneTypes).slice(0, 3).map(([key, cfg]) => (
            <div key={key} className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cfg.color }} />
              <span className="text-[10px] text-muted">{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center">
          <span className="text-4xl mb-3">🗺️</span>
          <p className="text-sm font-bold text-text">Nenhum marco registrado ainda</p>
          <p className="text-xs text-muted mt-1">Os marcos serão adicionados conforme a jornada evolui</p>
        </div>
      ) : (
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-5 top-0 bottom-0 w-0.5 rounded-full" style={{ backgroundColor: '#e0e3f0' }} />

          <div className="space-y-1">
            {sorted.map((m, i) => {
              const cfg    = milestoneTypes[m.type] || { icon: '📌', color: '#8890b5', label: 'Marco' }
              const isPast = m.date < today
              const isToday = m.date === today

              return (
                <div key={m.id}>
                  {/* "HOJE" separator */}
                  {todayIdx === i && i > 0 && (
                    <div className="flex items-center gap-3 my-4 pl-10">
                      <div className="flex-1 h-px" style={{ backgroundColor: '#6eda2c40' }} />
                      <span className="text-[10px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">HOJE</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: '#6eda2c40' }} />
                    </div>
                  )}
                  {todayIdx === 0 && i === 0 && (
                    <div className="flex items-center gap-3 mb-4 pl-10">
                      <span className="text-[10px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">HOJE</span>
                      <div className="flex-1 h-px" style={{ backgroundColor: '#6eda2c40' }} />
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className="flex items-start gap-4 pl-0 py-2 group"
                  >
                    {/* Node */}
                    <div className="relative flex-shrink-0" style={{ width: 40 }}>
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-lg z-10 relative"
                        style={{
                          backgroundColor: isPast ? cfg.color + '20' : cfg.color + '12',
                          border: `2px solid ${isPast ? cfg.color : cfg.color + '40'}`,
                          boxShadow: isPast ? `0 0 10px ${cfg.color}30` : 'none',
                        }}>
                        {isPast ? cfg.icon : <Lock size={13} style={{ color: cfg.color + '80' }} />}
                      </div>
                    </div>

                    {/* Card */}
                    <div className="flex-1 pb-2">
                      <div className="bg-white rounded-2xl px-4 py-3 border transition-shadow group-hover:shadow-md"
                        style={{
                          borderColor: isPast ? cfg.color + '25' : '#e8eaf2',
                          boxShadow: '0 1px 4px rgba(26,29,46,0.06)',
                        }}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-0.5">
                              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-md"
                                style={{ backgroundColor: cfg.color + '18', color: cfg.color }}>
                                {cfg.label}
                              </span>
                              {!isPast && (
                                <span className="text-[9px] font-bold text-muted bg-surface-2 px-1.5 py-0.5 rounded-md">
                                  🔒 Em breve
                                </span>
                              )}
                            </div>
                            <p className={`text-sm font-bold leading-snug ${isPast ? 'text-text' : 'text-muted'}`}>{m.title}</p>
                            {m.description && <p className="text-[11px] text-muted mt-0.5 leading-snug">{m.description}</p>}
                          </div>
                          <div className="flex-shrink-0 text-right">
                            <p className="text-[10px] font-bold text-muted whitespace-nowrap">
                              {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                            </p>
                            <p className="text-[9px] text-muted">
                              {new Date(m.date + 'T00:00:00').getFullYear()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              )
            })}

            {/* Future marker at end */}
            {todayIdx === -1 && sorted.length > 0 && (
              <div className="flex items-center gap-3 mt-4 pl-10">
                <div className="flex-1 h-px" style={{ backgroundColor: '#6eda2c40' }} />
                <span className="text-[10px] font-extrabold text-accent bg-accent/10 px-2 py-0.5 rounded-full">HOJE</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Mock de marketing ──────────────────────────────────── */
function getMarketingData(clientId) {
  const seed = clientId.charCodeAt(0) + (clientId.charCodeAt(1) || 0)
  const r = (base, variance) => Math.round(base + (seed % variance))
  const metaInvest   = r(1200, 800)
  const googleInvest = r(800, 600)
  const metaLeads    = r(18, 14)
  const googleLeads  = r(12, 8)
  const totalLeads   = metaLeads + googleLeads
  const totalInvest  = metaInvest + googleInvest
  const cpl          = totalLeads > 0 ? Math.round(totalInvest / totalLeads) : 0
  const roas         = (totalInvest > 0 ? ((totalInvest * (2.2 + (seed % 10) / 10)) / totalInvest).toFixed(1) : '0.0')
  const months = ['Dez', 'Jan', 'Fev', 'Mar', 'Abr', 'Mai']
  const chartData = months.map((m, i) => ({
    mes: m,
    meta:   Math.round(metaLeads   * (0.6 + i * 0.1 + (seed % 3) * 0.05)),
    google: Math.round(googleLeads * (0.5 + i * 0.12 + (seed % 2) * 0.06)),
  }))
  return {
    totalInvest, totalLeads, cpl, roas,
    meta: {
      invest: metaInvest, alcance: r(22000, 18000), impressoes: r(58000, 42000),
      cliques: r(820, 480), leads: metaLeads,
      cpl: metaLeads > 0 ? Math.round(metaInvest / metaLeads) : 0,
      ctr: ((r(820, 480) / r(58000, 42000)) * 100).toFixed(2),
      cpc: r(820, 480) > 0 ? (metaInvest / r(820, 480)).toFixed(2) : '0',
    },
    google: {
      invest: googleInvest, impressoes: r(31000, 22000), cliques: r(540, 320),
      conversoes: googleLeads,
      cpl: googleLeads > 0 ? Math.round(googleInvest / googleLeads) : 0,
      ctr: ((r(540, 320) / r(31000, 22000)) * 100).toFixed(2),
      cpc: r(540, 320) > 0 ? (googleInvest / r(540, 320)).toFixed(2) : '0',
    },
    chartData,
  }
}

const fmtBRL = v => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)
const fmtNum = v => new Intl.NumberFormat('pt-BR').format(v)

function MetricCard({ label, value, sub, color, icon: Icon, trend }) {
  const up = trend > 0
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: color + '18' }}>
            <Icon size={15} style={{ color }} />
          </div>
          {trend !== undefined && (
            <div className={`flex items-center gap-0.5 text-[10px] font-bold ${up ? 'text-[#6eda2c]' : 'text-[#ef4444]'}`}>
              {up ? <ArrowUpRight size={11} /> : <ArrowDownRight size={11} />}
              {Math.abs(trend)}%
            </div>
          )}
        </div>
        <p className="text-xl font-black text-text">{value}</p>
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{label}</p>
        {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}

function PlatformPanel({ name, color, logo, metrics }) {
  const rows = Object.entries(metrics).map(([key, val]) => {
    const labels = { invest: 'Investimento', alcance: 'Alcance', impressoes: 'Impressões', cliques: 'Cliques',
      leads: 'Leads gerados', conversoes: 'Conversões', cpl: 'CPL', ctr: 'CTR (%)', cpc: 'CPC (R$)' }
    const isValue = ['invest', 'cpl'].includes(key)
    return { key, label: labels[key] || key, display: isValue ? fmtBRL(val) : ['alcance','impressoes','cliques','conversoes'].includes(key) ? fmtNum(val) : val }
  })
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
      <div className="h-1" style={{ background: color }} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg" style={{ backgroundColor: color + '15' }}>{logo}</div>
          <p className="text-sm font-extrabold text-text">{name}</p>
          <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6eda2c]/15 text-[#6eda2c] flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-[#6eda2c] animate-pulse" /> Ativo
          </span>
        </div>
        <div className="space-y-2">
          {rows.map(row => (
            <div key={row.key} className="flex items-center justify-between py-1.5 border-b border-border/40 last:border-0">
              <span className="text-xs text-muted">{row.label}</span>
              <span className="text-sm font-bold text-text">{row.display}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function MarketingDashboard({ client }) {
  const [period, setPeriod] = useState('mes')
  const d = getMarketingData(client.id)
  const PERIODS = [{ id: 'mes', label: 'Este mês' }, { id: 'trim', label: 'Trimestre' }, { id: 'sem', label: 'Semestre' }]
  const multiply = period === 'trim' ? 3 : period === 'sem' ? 6 : 1

  return (
    <motion.div key="metricas" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl font-extrabold text-text">Dashboard de Métricas</h1>
          <p className="text-sm text-muted mt-0.5">Performance das campanhas · {client.name}</p>
        </div>
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-border">
          {PERIODS.map(p => (
            <button key={p.id} onClick={() => setPeriod(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${period === p.id ? 'bg-accent text-[#15172a]' : 'text-muted hover:text-text-2'}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Investimento total" value={fmtBRL(d.totalInvest * multiply)} color="#60a5fa" icon={DollarSign} trend={12} />
        <MetricCard label="Leads gerados"       value={d.totalLeads * multiply}           color="#6eda2c" icon={Users}      trend={18} />
        <MetricCard label="Custo por lead"      value={fmtBRL(d.cpl)}                     color="#ea8a29" icon={Target}     trend={-8} sub="vs mês anterior" />
        <MetricCard label="ROAS estimado"       value={`${d.roas}x`}                      color="#be29ec" icon={TrendingUp} trend={5}  sub="retorno sobre invest." />
      </div>
      <div className="bg-white rounded-2xl p-5 mb-6" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-extrabold text-text">Leads por plataforma</p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[11px] text-muted font-semibold"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#4f6ef7' }} /> Meta Ads</div>
            <div className="flex items-center gap-1.5 text-[11px] text-muted font-semibold"><div className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#ea8a29' }} /> Google Ads</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={d.chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="meta" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f6ef7" stopOpacity={0.3} /><stop offset="95%" stopColor="#4f6ef7" stopOpacity={0} /></linearGradient>
              <linearGradient id="google" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#ea8a29" stopOpacity={0.3} /><stop offset="95%" stopColor="#ea8a29" stopOpacity={0} /></linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e8eaf2" />
            <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#8890b5' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#8890b5' }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #e0e3f0', fontSize: 12 }} />
            <Area type="monotone" dataKey="meta"   name="Meta Ads"   stroke="#4f6ef7" fill="url(#meta)"   strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="google" name="Google Ads" stroke="#ea8a29" fill="url(#google)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <PlatformPanel name="Meta Ads — Facebook & Instagram" logo="📘" color="#4f6ef7"
          metrics={{ invest: d.meta.invest*multiply, alcance: d.meta.alcance*multiply, impressoes: d.meta.impressoes*multiply, cliques: d.meta.cliques*multiply, leads: d.meta.leads*multiply, cpl: d.meta.cpl, ctr: d.meta.ctr }} />
        <PlatformPanel name="Google Ads — Pesquisa & Display" logo="🔍" color="#ea8a29"
          metrics={{ invest: d.google.invest*multiply, impressoes: d.google.impressoes*multiply, cliques: d.google.cliques*multiply, conversoes: d.google.conversoes*multiply, cpl: d.google.cpl, ctr: d.google.ctr, cpc: d.google.cpc }} />
      </div>
      <div className="bg-white border border-border rounded-xl p-4 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-[#6eda2c]/15 flex items-center justify-center flex-shrink-0"><Zap size={14} className="text-[#6eda2c]" /></div>
        <p className="text-xs text-muted flex-1">
          <span className="font-bold text-text">Dados atualizados em tempo real.</span>{' '}
          Métricas extraídas diretamente das contas de anúncios. Dúvidas?{' '}
          <span className="text-accent font-bold cursor-pointer">Fale com seu gestor.</span>
        </p>
      </div>
    </motion.div>
  )
}

/* ── CRM do cliente — Kanban / Funil / Lista ────────────── */
const CRM_STAGES = [
  { id: 'novo',     label: 'Novo Lead',       color: '#8890b5', emoji: '🆕' },
  { id: 'contato',  label: 'Em Contato',      color: '#60a5fa', emoji: '💬' },
  { id: 'proposta', label: 'Proposta Enviada', color: '#ea8a29', emoji: '📄' },
  { id: 'fechado',  label: 'Fechado',          color: '#6eda2c', emoji: '🏆' },
]
const CRM_SOURCES = ['WhatsApp', 'Indicação', 'Instagram', 'Google', 'Site', 'Outro']
const fmtCRM = v => v > 0 ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v) : '—'

function getClientLeads(clientId) {
  try { return JSON.parse(localStorage.getItem(`crm_${clientId}`)) || [] } catch { return [] }
}
function saveClientLeads(clientId, leads) {
  try { localStorage.setItem(`crm_${clientId}`, JSON.stringify(leads)) } catch {}
}

function NewLeadModal({ onClose, onCreate }) {
  const [form, setForm] = useState({ name: '', phone: '', email: '', source: 'WhatsApp', stage: 'novo', value: 0 })
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
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
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
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">E-mail</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="lead@email.com"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Origem</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none">
                {CRM_SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Valor (R$)</label>
              <input type="number" min="0" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Etapa</label>
            <div className="flex gap-1.5 flex-wrap">
              {CRM_STAGES.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, stage: s.id }))}
                  className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all"
                  style={{ backgroundColor: form.stage === s.id ? s.color + '22' : 'transparent', borderColor: form.stage === s.id ? s.color + '70' : '#e0e3f0', color: form.stage === s.id ? s.color : '#8890b5' }}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2">Cancelar</button>
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

function EditLeadModal({ lead, onClose, onUpdate }) {
  const [form, setForm] = useState({
    name:   lead.name   || '',
    phone:  lead.phone  || '',
    email:  lead.email  || '',
    source: lead.source || 'WhatsApp',
    stage:  lead.stage  || 'novo',
    value:  lead.value  || 0,
  })
  function handleSubmit() {
    if (!form.name.trim()) return
    onUpdate(lead.id, form)
    onClose()
  }
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.96, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
        className="relative bg-white rounded-2xl w-full max-w-sm"
        style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <p className="text-sm font-extrabold text-text">Editar Lead</p>
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
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">E-mail</label>
            <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="lead@email.com"
              className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none focus:border-accent/50" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Origem</label>
              <select value={form.source} onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none">
                {CRM_SOURCES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1">Valor (R$)</label>
              <input type="number" min="0" value={form.value}
                onChange={e => setForm(f => ({ ...f, value: Number(e.target.value) }))}
                className="w-full bg-surface-2 border border-border rounded-xl px-3 py-2.5 text-sm text-text focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="text-[10px] font-bold text-muted uppercase tracking-wider block mb-1.5">Etapa</label>
            <div className="flex gap-1.5 flex-wrap">
              {CRM_STAGES.map(s => (
                <button key={s.id} onClick={() => setForm(f => ({ ...f, stage: s.id }))}
                  className="px-2.5 py-1.5 rounded-xl text-[10px] font-bold border transition-all"
                  style={{ backgroundColor: form.stage === s.id ? s.color + '22' : 'transparent', borderColor: form.stage === s.id ? s.color + '70' : '#e0e3f0', color: form.stage === s.id ? s.color : '#8890b5' }}>
                  {s.emoji} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-border">
          <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold text-muted bg-surface-2">Cancelar</button>
          <button onClick={handleSubmit} disabled={!form.name.trim()}
            className="flex-1 py-2.5 rounded-xl text-sm font-extrabold text-[#0f1117] disabled:opacity-40"
            style={{ background: '#6eda2c' }}>
            Salvar
          </button>
        </div>
      </motion.div>
    </div>
  )
}

function KanbanView({ leads, clientColor, moveStage, removeLead, editLead }) {
  const dragRef   = useRef(null)
  const [dragOver, setDragOver] = useState(null)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {CRM_STAGES.map(stage => {
        const stageLeads = leads.filter(l => l.stage === stage.id)
        const stageIdx   = CRM_STAGES.findIndex(s => s.id === stage.id)
        const isOver     = dragOver === stage.id
        return (
          <div key={stage.id} className="flex flex-col min-h-40"
            onDragOver={e => { e.preventDefault(); if (dragOver !== stage.id) setDragOver(stage.id) }}
            onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null) }}
            onDrop={e => { e.preventDefault(); if (dragRef.current !== null) moveStage(dragRef.current, stage.id); dragRef.current = null; setDragOver(null) }}>

            <div className="flex items-center justify-between px-3 py-2 rounded-xl mb-2 transition-all"
              style={{ backgroundColor: stage.color + (isOver ? '25' : '12'), border: `1px solid ${stage.color}${isOver ? '60' : '30'}` }}>
              <div className="flex items-center gap-1.5">
                <span className="text-sm">{stage.emoji}</span>
                <span className="text-[11px] font-extrabold" style={{ color: stage.color }}>{stage.label}</span>
              </div>
              <span className="text-[11px] font-bold text-muted w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: stage.color + '20' }}>
                {stageLeads.length}
              </span>
            </div>

            <div className="flex-1 space-y-2 rounded-xl p-1 transition-all"
              style={{
                backgroundColor: isOver ? stage.color + '08' : 'transparent',
                border: `2px dashed ${isOver ? stage.color + '50' : 'transparent'}`,
                minHeight: 80,
              }}>
              <AnimatePresence>
                {stageLeads.map(lead => (
                  <motion.div key={lead.id} layout
                    draggable
                    onDragStart={() => { dragRef.current = lead.id }}
                    onDragEnd={() => { dragRef.current = null }}
                    initial={{ opacity: 0, scale: 0.95, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-white rounded-xl p-3 border border-border/50 group transition-shadow hover:shadow-md cursor-grab active:cursor-grabbing"
                    style={{ boxShadow: '0 1px 6px rgba(26,29,46,0.07)' }}>

                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white flex-shrink-0"
                          style={{ backgroundColor: clientColor }}>
                          {lead.name[0]}
                        </div>
                        <span className="text-xs font-bold text-text truncate">{lead.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 ml-1">
                        <button onClick={() => editLead(lead)}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-all">
                          <Pencil size={10} />
                        </button>
                        <button onClick={() => removeLead(lead.id)}
                          className="w-5 h-5 rounded-md flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-all">
                          <X size={10} />
                        </button>
                      </div>
                    </div>

                    {lead.email && (
                      <p className="text-[10px] text-muted truncate mb-1 pl-[30px]">{lead.email}</p>
                    )}

                    {Number(lead.value) > 0 && (
                      <p className="text-[11px] font-extrabold mb-1.5" style={{ color: stage.color }}>{fmtCRM(lead.value)}</p>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-muted bg-surface-2 px-1.5 py-0.5 rounded-md">{lead.source}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {stageIdx > 0 && (
                          <button onClick={() => moveStage(lead.id, CRM_STAGES[stageIdx - 1].id)}
                            className="w-5 h-5 rounded-md flex items-center justify-center transition-colors hover:bg-black/[0.06]"
                            title={CRM_STAGES[stageIdx - 1].label}>
                            <ChevronLeft size={11} className="text-muted" />
                          </button>
                        )}
                        {stageIdx < CRM_STAGES.length - 1 && (
                          <button onClick={() => moveStage(lead.id, CRM_STAGES[stageIdx + 1].id)}
                            className="w-5 h-5 rounded-md flex items-center justify-center transition-colors text-white"
                            style={{ backgroundColor: CRM_STAGES[stageIdx + 1].color }}
                            title={CRM_STAGES[stageIdx + 1].label}>
                            <ChevronRight size={11} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {stageLeads.length === 0 && !isOver && (
                <div className="rounded-xl p-4 text-center" style={{ border: `2px dashed ${stage.color}25` }}>
                  <p className="text-[10px] text-muted">Sem leads</p>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function FunilView({ leads }) {
  const WIDTHS = [100, 78, 58, 40]
  const totalLeads = leads.length

  return (
    <div className="py-2">
      {totalLeads === 0 ? (
        <div className="flex flex-col items-center py-14 text-center">
          <span className="text-4xl mb-3">🎯</span>
          <p className="text-sm font-bold text-text">Funil vazio</p>
          <p className="text-xs text-muted mt-1">Adicione leads para ver o funil</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {CRM_STAGES.map((stage, i) => {
            const stageLeads = leads.filter(l => l.stage === stage.id)
            const count    = stageLeads.length
            const value    = stageLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)
            const prevCount  = i > 0 ? leads.filter(l => l.stage === CRM_STAGES[i - 1].id).length : count
            const convRate   = i > 0 && prevCount > 0 ? Math.round((count / prevCount) * 100) : null
            const pctTotal   = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0

            return (
              <div key={stage.id} className="w-full flex flex-col items-center">
                <motion.div
                  className="rounded-2xl overflow-hidden"
                  style={{ width: `${WIDTHS[i]}%`, minWidth: 220 }}
                  initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                  <div className="flex items-center justify-between px-5 py-3.5"
                    style={{ background: `linear-gradient(90deg, ${stage.color}e8, ${stage.color}b0)` }}>
                    <div className="flex items-center gap-2">
                      <span className="text-base">{stage.emoji}</span>
                      <span className="text-sm font-extrabold text-white">{stage.label}</span>
                      {convRate !== null && (
                        <span className="text-[10px] font-bold bg-white/20 text-white px-1.5 py-0.5 rounded-full ml-1">
                          {convRate}% conv.
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-white">
                        {count} lead{count !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[10px] font-bold text-white/60">{pctTotal}% do total</span>
                      {value > 0 && <span className="text-xs text-white/80 ml-1">{fmtCRM(value)}</span>}
                    </div>
                  </div>
                </motion.div>
                {i < CRM_STAGES.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 + 0.15 }}
                    style={{ width: 0, height: 0, borderLeft: '18px solid transparent', borderRight: '18px solid transparent', borderTop: `14px solid ${stage.color}b0`, marginTop: -1 }} />
                )}
              </div>
            )
          })}
          {/* Summary */}
          <div className="mt-5 w-full max-w-md flex items-center justify-between px-4 py-3 bg-white rounded-2xl border border-border"
            style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.07)' }}>
            <div className="text-center">
              <p className="text-lg font-black text-text">{totalLeads}</p>
              <p className="text-[10px] text-muted">total de leads</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-lg font-black" style={{ color: '#6eda2c' }}>
                {leads.filter(l => l.stage === 'fechado').length}
              </p>
              <p className="text-[10px] text-muted">fechamentos</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-lg font-black text-accent">
                {totalLeads > 0 ? Math.round((leads.filter(l => l.stage === 'fechado').length / totalLeads) * 100) : 0}%
              </p>
              <p className="text-[10px] text-muted">conversão</p>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <p className="text-sm font-black text-[#be29ec]">
                {fmtCRM(leads.filter(l => l.stage === 'fechado').reduce((s, l) => s + (Number(l.value) || 0), 0))}
              </p>
              <p className="text-[10px] text-muted">receita fechada</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const TOP_STAGES = CRM_STAGES.slice(0, 2)
const BOT_STAGES = CRM_STAGES.slice(2)

function HourglassCRMView({ leads }) {
  const topMax = Math.max(...TOP_STAGES.map(s => leads.filter(l => l.stage === s.id).length), 1)
  const botMax = Math.max(...BOT_STAGES.map(s => leads.filter(l => l.stage === s.id).length), 1)

  const topFirst = leads.filter(l => l.stage === TOP_STAGES[0].id).length
  const topLast  = leads.filter(l => l.stage === TOP_STAGES[TOP_STAGES.length - 1].id).length
  const topConv  = topFirst > 0 ? Math.round((topLast / topFirst) * 100) : 0
  const totalValue  = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const closedValue = leads.filter(l => l.stage === 'fechado').reduce((s, l) => s + (Number(l.value) || 0), 0)

  if (leads.length === 0) return (
    <div className="flex flex-col items-center py-14 text-center">
      <span className="text-4xl mb-3">⏳</span>
      <p className="text-sm font-bold text-text">Funil vazio</p>
      <p className="text-xs text-muted mt-1">Adicione leads para ver o funil ampulheta</p>
    </div>
  )

  return (
    <div className="flex flex-col items-center py-2">
      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Topo do Funil</p>
      {TOP_STAGES.map((stage, i) => {
        const count = leads.filter(l => l.stage === stage.id).length
        const prev  = i > 0 ? leads.filter(l => l.stage === TOP_STAGES[i - 1].id).length : count
        const conv  = i > 0 && prev > 0 ? Math.round((count / prev) * 100) : null
        const pct   = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
        const width = 40 + (count / topMax) * 60
        return (
          <div key={stage.id} className="w-full flex flex-col items-center">
            <motion.div className="rounded-2xl overflow-hidden"
              style={{ width: `${width}%`, minWidth: 200 }}
              initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: `linear-gradient(90deg, ${stage.color}e8, ${stage.color}b0)` }}>
                <div className="flex items-center gap-2">
                  <span>{stage.emoji}</span>
                  <span className="text-sm font-extrabold text-white">{stage.label}</span>
                  {conv !== null && <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">{conv}% conv.</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">{count}</span>
                  <span className="text-[10px] text-white/60">{pct}% do total</span>
                </div>
              </div>
            </motion.div>
            {i < TOP_STAGES.length - 1 && (
              <div style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderTop: `11px solid ${stage.color}b0`, marginTop: -1 }} />
            )}
          </div>
        )
      })}

      {/* Waist */}
      <div className="flex items-center gap-0 my-3 w-full max-w-xs">
        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-l-xl bg-surface-2 border border-r-0 border-border">
          <div className="text-center">
            <p className="text-xs font-extrabold text-text">{leads.length}</p>
            <p className="text-[9px] text-muted uppercase">Total</p>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center w-16 py-2.5 bg-surface-2 border-y border-border">
          <p className="text-sm font-extrabold text-accent">{topConv}%</p>
          <p className="text-[8px] text-muted uppercase">Conv.</p>
        </div>
        <div className="flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-r-xl bg-surface-2 border border-l-0 border-border">
          <div className="text-center">
            <p className="text-xs font-extrabold text-accent">{fmtCRM(totalValue)}</p>
            <p className="text-[9px] text-muted uppercase">Pipeline</p>
          </div>
        </div>
      </div>

      <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Fundo do Funil</p>
      {[...BOT_STAGES].reverse().map((stage, i) => {
        const count   = leads.filter(l => l.stage === stage.id).length
        const origIdx = BOT_STAGES.length - 1 - i
        const next    = origIdx < BOT_STAGES.length - 1 ? BOT_STAGES[origIdx + 1] : null
        const prev    = next ? leads.filter(l => l.stage === next.id).length : count
        const conv    = i > 0 && prev > 0 ? Math.round((count / prev) * 100) : null
        const pct     = leads.length > 0 ? Math.round((count / leads.length) * 100) : 0
        const width   = 40 + (count / botMax) * 60
        return (
          <div key={stage.id} className="w-full flex flex-col items-center">
            {i > 0 && (
              <div style={{ width: 0, height: 0, borderLeft: '14px solid transparent', borderRight: '14px solid transparent', borderBottom: `11px solid ${stage.color}b0`, marginBottom: -1 }} />
            )}
            <motion.div className="rounded-2xl overflow-hidden"
              style={{ width: `${width}%`, minWidth: 200 }}
              initial={{ opacity: 0, scaleX: 0.6 }} animate={{ opacity: 1, scaleX: 1 }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <div className="flex items-center justify-between px-4 py-3"
                style={{ background: `linear-gradient(90deg, ${stage.color}e8, ${stage.color}b0)` }}>
                <div className="flex items-center gap-2">
                  <span>{stage.emoji}</span>
                  <span className="text-sm font-extrabold text-white">{stage.label}</span>
                  {conv !== null && <span className="text-[10px] bg-white/20 text-white px-1.5 py-0.5 rounded-full">{conv}% conv.</span>}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-white">{count}</span>
                  <span className="text-[10px] text-white/60">{pct}% do total</span>
                </div>
              </div>
            </motion.div>
          </div>
        )
      })}

      <div className="mt-4 flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm font-black text-accent">{leads.filter(l => l.stage === 'fechado').length}</p>
          <p className="text-[9px] text-muted uppercase tracking-wide">Fechamentos</p>
        </div>
        <div className="w-px h-8 bg-border" />
        <div className="text-center">
          <p className="text-sm font-black" style={{ color: '#6eda2c' }}>{fmtCRM(closedValue)}</p>
          <p className="text-[9px] text-muted uppercase tracking-wide">Receita fechada</p>
        </div>
      </div>
    </div>
  )
}

function ClientCRM({ clientId, clientColor }) {
  const [leads,      setLeads]      = useState(() => getClientLeads(clientId))
  const [showNew,    setShowNew]    = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [view,       setView]       = useState('kanban')

  function addLead(lead)              { const n = [...leads, lead]; setLeads(n); saveClientLeads(clientId, n) }
  function moveStage(id, stage)       { const n = leads.map(l => l.id === id ? { ...l, stage } : l); setLeads(n); saveClientLeads(clientId, n) }
  function removeLead(id)             { const n = leads.filter(l => l.id !== id); setLeads(n); saveClientLeads(clientId, n) }
  function updateLead(id, data)       { const n = leads.map(l => l.id === id ? { ...l, ...data } : l); setLeads(n); saveClientLeads(clientId, n) }

  const totalValue  = leads.reduce((s, l) => s + (Number(l.value) || 0), 0)
  const closedLeads = leads.filter(l => l.stage === 'fechado')
  const closedValue = closedLeads.reduce((s, l) => s + (Number(l.value) || 0), 0)

  const VIEWS = [
    { id: 'kanban',     label: 'Kanban',    icon: LayoutGrid  },
    { id: 'funil',      label: 'Funil',     icon: Filter      },
    { id: 'ampulheta',  label: 'Ampulheta', icon: ArrowUpDown },
    { id: 'lista',      label: 'Lista',     icon: List        },
  ]

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-5">
        {[
          { label: 'Total de leads',    value: leads.length,       color: '#60a5fa', icon: Users },
          { label: 'Fechamentos',       value: closedLeads.length, color: '#6eda2c', icon: CheckCircle2 },
          { label: 'Valor em pipeline', value: fmtCRM(totalValue), color: '#be29ec', icon: DollarSign },
          { label: 'Receita fechada',   value: fmtCRM(closedValue),color: clientColor, icon: TrendingUp },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <div className="h-1" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}60)` }} />
            <div className="p-4">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-2.5" style={{ backgroundColor: s.color + '18' }}>
                <s.icon size={16} style={{ color: s.color }} />
              </div>
              <p className="text-xl font-black" style={{ color: s.color }}>{s.value}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-border">
          {VIEWS.map(v => {
            const Icon = v.icon
            return (
              <button key={v.id} onClick={() => setView(v.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  view === v.id ? 'bg-text text-white shadow-sm' : 'text-muted hover:text-text-2'
                }`}>
                <Icon size={12} /> {v.label}
              </button>
            )
          })}
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={() => setShowNew(true)}
          className="flex items-center gap-1.5 text-sm font-extrabold px-3 py-2 rounded-xl text-[#0f1117]"
          style={{ background: '#6eda2c' }}>
          <Plus size={14} /> Novo lead
        </motion.button>
      </div>

      {/* Views */}
      <AnimatePresence mode="wait">
        {view === 'kanban' && (
          <motion.div key="kanban" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <KanbanView leads={leads} clientColor={clientColor} moveStage={moveStage} removeLead={removeLead} editLead={setEditTarget} />
          </motion.div>
        )}
        {view === 'funil' && (
          <motion.div key="funil" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <FunilView leads={leads} />
          </motion.div>
        )}
        {view === 'ampulheta' && (
          <motion.div key="ampulheta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl p-6" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
            <HourglassCRMView leads={leads} />
          </motion.div>
        )}
        {view === 'lista' && (
          <motion.div key="lista" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            {leads.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                <p className="text-4xl mb-3">🎯</p>
                <p className="text-sm font-bold text-text">Nenhum lead</p>
                <p className="text-xs text-muted mt-1">Clique em "Novo lead" para começar</p>
              </div>
            ) : (
              <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                <table className="w-full">
                  <thead><tr className="border-b border-border">
                    {['Nome','Telefone','E-mail','Origem','Etapa','Valor',''].map((col, i) => (
                      <th key={i} className="text-left text-[10px] font-bold text-muted uppercase tracking-wider px-5 py-3">{col}</th>
                    ))}
                  </tr></thead>
                  <tbody>
                    <AnimatePresence>
                      {leads.map(lead => {
                        const stage = CRM_STAGES.find(s => s.id === lead.stage)
                        return (
                          <motion.tr key={lead.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="border-b border-border/40 hover:bg-black/[0.02] transition-colors group">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0" style={{ backgroundColor: clientColor }}>
                                  {lead.name[0]}
                                </div>
                                <span className="text-sm font-semibold text-text">{lead.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3">
                              {lead.phone && <a href={`tel:${lead.phone}`} className="text-xs font-mono text-muted hover:text-accent transition-colors flex items-center gap-1"><Phone size={10} />{lead.phone}</a>}
                            </td>
                            <td className="px-5 py-3">
                              {lead.email && <a href={`mailto:${lead.email}`} className="text-xs text-muted hover:text-accent transition-colors truncate max-w-[160px] block">{lead.email}</a>}
                            </td>
                            <td className="px-5 py-3"><span className="text-[11px] px-2 py-0.5 rounded-md font-semibold bg-surface-2 text-muted">{lead.source}</span></td>
                            <td className="px-5 py-3">
                              <select value={lead.stage} onChange={e => moveStage(lead.id, e.target.value)}
                                className="text-[11px] font-bold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none"
                                style={{ color: stage?.color, backgroundColor: stage?.color + '12', borderColor: stage?.color + '40' }}>
                                {CRM_STAGES.map(s => <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>)}
                              </select>
                            </td>
                            <td className="px-5 py-3"><span className={`text-sm font-semibold ${lead.value > 0 ? 'text-accent' : 'text-muted'}`}>{fmtCRM(Number(lead.value) || 0)}</span></td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
                                <button onClick={() => setEditTarget(lead)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-accent hover:bg-accent/10 transition-all">
                                  <Pencil size={11} />
                                </button>
                                <button onClick={() => removeLead(lead.id)}
                                  className="w-6 h-6 rounded-lg flex items-center justify-center text-muted hover:text-danger hover:bg-danger/10 transition-all">
                                  <X size={12} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        )
                      })}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>{showNew    && <NewLeadModal  onClose={() => setShowNew(false)}    onCreate={addLead} />}</AnimatePresence>
      <AnimatePresence>{editTarget && <EditLeadModal onClose={() => setEditTarget(null)} lead={editTarget} onUpdate={updateLead} />}</AnimatePresence>
    </div>
  )
}

/* ── Portal principal ───────────────────────────────────── */
const MODULES = [
  { id: 'projeto',  label: 'Projeto',   icon: '🏗️' },
  { id: 'metricas', label: 'Métricas',  icon: '📊' },
  { id: 'crm',      label: 'Meu CRM',   icon: '🎯' },
]

export default function ClientPortal({ user, onLogout }) {
  const [activeModule, setActiveModule] = useState('projeto')
  const { tasks: allTasks, milestones: allMilestones } = useData()
  const portalModules   = { ...DEFAULT_PORTAL_MODULES, ...(user.portalModules ?? {}) }
  const client          = erpClients.find(c => c.id === user.clientId)
  const clientTasks     = allTasks.filter(t => t.clientId === user.clientId && t.level !== 'interno')
  const clientMeetings  = meetings.filter(m => m.clientId === user.clientId)
  const clientMilestones = allMilestones.filter(m => m.clientId === user.clientId)

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
      <div className="fixed top-0 left-0 right-0 bg-white z-40 flex items-center px-6 justify-between"
        style={{ boxShadow: '0 1px 0 #e0e3f0', height: 56 }}>
        <div className="flex items-center gap-3 overflow-x-auto">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Zap size={15} className="text-accent" fill="currentColor" />
            <span className="text-sm font-extrabold text-text">TráfegOn</span>
          </div>
          <div className="w-px h-5 bg-border flex-shrink-0" />
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold text-white"
              style={{ backgroundColor: client.color }}>
              {client.name[0]}
            </div>
            <p className="text-sm font-bold text-text">{client.name}</p>
          </div>
          <div className="w-px h-5 bg-border flex-shrink-0" />
          <div className="flex items-center gap-1">
            {MODULES.filter(m => m.id !== 'crm' || (portalModules.crm ?? true)).map(m => (
              <button key={m.id} onClick={() => setActiveModule(m.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap"
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
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full hidden sm:inline"
            style={{ backgroundColor: '#be29ec12', color: '#be29ec' }}>
            Portal do Cliente
          </span>
          <button onClick={onLogout} className="flex items-center gap-1.5 text-sm text-muted hover:text-danger transition-colors font-medium">
            <LogOut size={14} />
          </button>
        </div>
      </div>

      <div className="pt-14">
        <AnimatePresence mode="wait">

          {/* ── MÓDULO PROJETO ── */}
          {activeModule === 'projeto' && (
            <motion.div key="projeto" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-6 max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-xl font-extrabold text-text">Projeto — {client.name}</h1>
                <p className="text-sm text-muted mt-0.5">
                  {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </p>
              </div>

              {portalModules.indicadores && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {[
                    { label: 'Em andamento',    value: inProgress,               color: '#60a5fa', icon: Package },
                    { label: 'Concluídos',      value: done,                     color: '#6eda2c', icon: CheckCircle2 },
                    { label: 'Conclusão geral', value: `${pct}%`,                color: client.color, icon: Zap },
                    { label: 'Próx. reunião',   value: upcoming[0]?.time ?? '—', color: '#8890b5', icon: Calendar },
                  ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                      className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                      <div className="h-1" style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}60)` }} />
                      <div className="p-4">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center mb-3" style={{ backgroundColor: s.color + '18' }}>
                          <s.icon size={16} style={{ color: s.color }} />
                        </div>
                        <p className="text-2xl font-black" style={{ color: s.color }}>{s.value}</p>
                        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mt-0.5">{s.label}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              <div className={`grid gap-5 mb-6 ${portalModules.entregaveis && portalModules.reunioes ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
                {portalModules.entregaveis && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className={`${portalModules.reunioes ? 'lg:col-span-2' : ''} bg-white rounded-2xl p-5`}
                    style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                    <p className="text-sm font-extrabold text-text mb-4">Marcos e rotinas do projeto</p>
                    <div className="space-y-2">
                      {clientTasks.filter(t => t.status !== 'done').length > 0
                        ? clientTasks.filter(t => t.status !== 'done').map(task => {
                            const type   = taskTypes[task.type]
                            const status = statusConfig[task.status]
                            const overdue = new Date(task.dueDate) < new Date()
                            return (
                              <div key={task.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2">
                                <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                                  style={{ backgroundColor: type.color + '18' }}>{type.icon}</div>
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
                        : <div className="text-center py-8"><CheckCircle2 size={28} className="text-accent mx-auto mb-2" /><p className="text-sm font-bold text-text">Tudo entregue!</p></div>
                      }
                    </div>
                  </motion.div>
                )}

                {portalModules.reunioes && (
                  <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                    <p className="text-sm font-extrabold text-text mb-4">Próximas reuniões</p>
                    {upcoming.length > 0
                      ? <div className="space-y-3">
                          {upcoming.map(m => (
                            <div key={m.id} className="flex items-start gap-3 p-3 rounded-xl"
                              style={{ backgroundColor: '#8890b510', border: '1px solid #8890b520' }}>
                              <div className="text-xl flex-shrink-0">📅</div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs font-bold text-text">{m.title}</p>
                                <p className="text-[10px] text-muted mt-0.5">
                                  {new Date(m.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })} · {m.time}
                                </p>
                                {m.link ? (
                                  <a href={m.link} target="_blank" rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold text-accent hover:text-accent/80 transition-colors">
                                    <ExternalLink size={10} /> Abrir pauta da reunião
                                  </a>
                                ) : (
                                  <p className="text-[10px] text-muted/60 mt-1 italic">pauta não definida ainda</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      : <div className="text-center py-8"><Calendar size={24} className="text-muted mx-auto mb-2" /><p className="text-xs text-muted">Nenhuma reunião agendada.</p></div>
                    }
                  </motion.div>
                )}
              </div>

              {/* Partnership Timeline */}
              <div className="mb-6">
                <PartnershipTimeline client={client} />
              </div>

              {portalModules.timeline && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                  className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.09)' }}>
                  <TimelineView clientMilestones={clientMilestones} />
                </motion.div>
              )}
            </motion.div>
          )}

          {/* ── MÓDULO MÉTRICAS ── */}
          {activeModule === 'metricas' && (
            <MarketingDashboard key="metricas" client={client} />
          )}

          {/* ── MÓDULO CRM ── */}
          {activeModule === 'crm' && (
            <motion.div key="crm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="p-6 max-w-6xl mx-auto">
              <div className="mb-6">
                <h1 className="text-xl font-extrabold text-text">Meu CRM — {client.name}</h1>
                <p className="text-sm text-muted mt-0.5">Pipeline de vendas com kanban, funil e lista</p>
              </div>
              <ClientCRM clientId={user.clientId} clientColor={client.color} />
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  )
}
