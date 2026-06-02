import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const R  = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const R2 = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const COR = '#6eda2c'

/* ── Dados da agência ─────────────────────────── */
const AG = {
  clientesAtivos: 25,
  clientesJuridico: 7,
  clientesGeral: 18,
  mrrBruto: 0,
  investimentoMidia: 4000,
  cplAtual: 18,
  perfilSeguidores: 2250,
  perfilJuridicoSeguidores: 0,
  metaClientesJuridico2sem: 12,
  metaMrr2sem: 0,

  splitMidia: [
    { label: 'Lead gen jurídico qualificado', valor: 2200, color: COR,       desc: '@trafegon · criativo + formulário ajustados' },
    { label: 'Branding regional',             valor: 1000, color: '#60a5fa', desc: '@trafegon awareness · empresários locais' },
    { label: 'Remarketing jurídico',          valor: 800,  color: '#a78bfa', desc: 'Perfil jurídico · segundo toque pós-anúncio' },
  ],

  fases: [
    { n: 1, nome: 'Estrutura',    periodo: 'Jun/2026',      status: 'current', icon: '🏗️', desc: 'Ajuste de formulário, criativos qualificadores e base de conteúdo do perfil jurídico.' },
    { n: 2, nome: 'Aceleração',   periodo: 'Jul–Ago/2026',  status: 'next',    icon: '🚀', desc: 'Ativar remarketing jurídico. Perfil com 6–9 posts. Meta: 30% leads qualificados.' },
    { n: 3, nome: 'Conversão',    periodo: 'Set–Out/2026',  status: 'future',  icon: '🎯', desc: 'Nutrição via broadcast. Reativação de leads não-fechados com Destrava Digital.' },
    { n: 4, nome: 'Escala',       periodo: 'Nov–Dez/2026',  status: 'future',  icon: '📈', desc: 'Ampliar jurídico para assessoria. LinkedIn ativo. Canal jurídico com autoridade.' },
  ],

  alertas: [
    { icon: '⚠️', titulo: 'Qualificação de lead',       acao: 'CPL R$18 com 90% advogados mas poucos com budget. Ajuste de formulário e criativo é prioridade #1.', color: '#ef4444', badge: 'GARGALO' },
    { icon: '💡', titulo: 'Destrava Digital subutilizado', acao: 'Leads não-fechados não recebem oferta do Destrava. Implementar sequência de reativação.', color: '#ea8a29', badge: 'OPORTUNIDADE' },
    { icon: '📱', titulo: 'Perfil jurídico — zero posts', acao: 'Não ativar remarketing antes de 6–9 posts publicados. Taxa de conversão será muito baixa.', color: '#60a5fa', badge: 'ATENÇÃO' },
    { icon: '🔗', titulo: 'Processo comercial',          acao: 'Broadcast WhatsApp e CRM estruturado para leads quentes. Não perder volume que já existe.', color: COR,      badge: 'ALAVANCA' },
  ],
}

/* ── Mini componentes ─────────────────────────── */
function BigKpi({ icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${color}20` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        {trend === 'up'   && <TrendingUp  size={14} style={{ color: '#6eda2c' }} />}
        {trend === 'down' && <TrendingDown size={14} style={{ color: '#ef4444' }} />}
      </div>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

function Bar({ value, max, color, label, subLeft, subRight }) {
  const pct = Math.min(100, Math.round((value / max) * 100))
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs font-bold text-text">{label}</span>
        <span className="text-sm font-extrabold" style={{ color }}>{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: color + '18' }}>
        <motion.div className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${color}cc, ${color})` }}
          initial={{ width: 0 }} animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[10px] text-muted">{subLeft}</span>
        <span className="text-[10px] text-muted">{subRight}</span>
      </div>
    </div>
  )
}

/* ── Timeline de fases ────────────────────────── */
function FasesTimeline() {
  const [hover, setHover] = useState(null)
  const statusStyle = s => ({
    current: { bg: COR + '15', border: COR,       text: COR       },
    next:    { bg: '#fff7ed',  border: '#fb923c',  text: '#ea580c' },
    future:  { bg: '#f8f9ff',  border: '#c8cce6',  text: '#8890b5' },
  })[s] || { bg: '#f0fdf4', border: '#4ade80', text: '#16a34a' }

  return (
    <div className="bg-white rounded-2xl p-5"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.06)' }}>
      <p className="text-sm font-extrabold text-text mb-1">🗺️ Plano de Crescimento — 2º Semestre 2026</p>
      <p className="text-[10px] text-muted mb-4">Jun → Dez/2026 · 4 fases estratégicas</p>
      <div className="flex items-start">
        {AG.fases.map((fase, i) => {
          const s = statusStyle(fase.status)
          const isLast = i === AG.fases.length - 1
          return (
            <div key={fase.n} className="flex items-start flex-1 min-w-0">
              <div className="flex flex-col items-center flex-1 min-w-0 cursor-pointer relative"
                onMouseEnter={() => setHover(fase.n)} onMouseLeave={() => setHover(null)}>
                <motion.div
                  animate={{ scale: fase.status === 'current' ? [1, 1.06, 1] : 1 }}
                  transition={{ repeat: fase.status === 'current' ? Infinity : 0, duration: 2 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-base border-2 flex-shrink-0 relative"
                  style={{ background: s.bg, borderColor: s.border, color: s.text }}>
                  {fase.status === 'current'
                    ? <span>{fase.icon}</span>
                    : fase.status === 'next'
                    ? <span className="text-sm opacity-70">{fase.icon}</span>
                    : <span className="text-sm opacity-30">{fase.n}</span>}
                  {fase.status === 'current' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white" style={{ background: COR }} />
                  )}
                </motion.div>
                <p className="text-[10px] font-extrabold text-center mt-2 leading-tight px-1" style={{ color: s.text }}>{fase.nome}</p>
                <p className="text-[9px] text-muted text-center">{fase.periodo}</p>
                {fase.status === 'current' && (
                  <span className="mt-1 text-[8px] font-extrabold px-2 py-0.5 rounded-full" style={{ background: COR + '20', color: COR }}>ATUAL</span>
                )}
                {hover === fase.n && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 w-48 rounded-xl p-3 text-left shadow-xl"
                    style={{ background: '#1c1f35', top: '100%', marginTop: 8, left: '50%', transform: 'translateX(-50%)' }}>
                    <p className="text-[9px] font-extrabold uppercase tracking-wider mb-1" style={{ color: s.border }}>{fase.nome} · {fase.periodo}</p>
                    <p className="text-[11px] text-white/70 leading-snug">{fase.desc}</p>
                  </motion.div>
                )}
              </div>
              {!isLast && (
                <div className="flex-none flex items-center pt-5 px-1" style={{ minWidth: 24 }}>
                  <div className="h-0.5 w-full rounded-full"
                    style={{ background: fase.status === 'current' ? COR : '#e2e5f0' }} />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

/* ── ABA VISÃO GERAL ──────────────────────────── */
function VisaoGeral() {
  const totalSplit = AG.splitMidia.reduce((s, x) => s + x.valor, 0)
  return (
    <div className="space-y-5">

      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1a05 0%, #0f2a08 100%)', boxShadow: '0 8px 32px rgba(10,26,5,0.5)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #6eda2c22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: '#6eda2caa' }}>
            TráfegOn · Performance Comercial · 2º Semestre 2026
          </p>
          <div className="flex flex-wrap gap-8 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Clientes Ativos</p>
              <p className="text-3xl font-black" style={{ color: COR }}>{AG.clientesAtivos}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#6eda2c80' }}>{AG.clientesJuridico} jurídico · {AG.clientesGeral} geral</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investimento Mídia/mês</p>
              <p className="text-3xl font-black text-white">{R(AG.investimentoMidia)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">@trafegon + perfil jurídico</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>CPL Atual</p>
              <p className="text-3xl font-black text-white">{R2(AG.cplAtual)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">90% advogados — qualificar</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>@trafegon Seguidores</p>
              <p className="text-3xl font-black text-white">{AG.perfilSeguidores.toLocaleString('pt-BR')}</p>
              <p className="text-[10px] text-white/30 mt-0.5">Perfil jurídico: em construção</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="👥" label="Clientes Ativos"         value={AG.clientesAtivos}       sub={`${AG.clientesJuridico} jurídico · ${AG.clientesGeral} geral`} color={COR}      trend="up" />
        <BigKpi icon="⚖️" label="Meta Jurídico 2º Sem."  value={AG.metaClientesJuridico2sem} sub="novos clientes jurídicos"                                  color="#a78bfa" />
        <BigKpi icon="💰" label="Mídia/mês"              value={R(AG.investimentoMidia)}  sub="3 objetivos distribuídos"                                      color="#60a5fa" />
        <BigKpi icon="🎯" label="CPL (@trafegon)"        value={R2(AG.cplAtual)}          sub="qualificação é o gargalo"                                      color="#ea8a29" />
      </div>

      <FasesTimeline />

      {/* Split de mídia */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">💸 Distribuição de Mídia — {R(totalSplit)}/mês</p>
          <div className="space-y-4">
            {AG.splitMidia.map(item => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-text">{item.label}</span>
                  <span className="text-sm font-extrabold" style={{ color: item.color }}>{R(item.valor)}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: item.color + '18' }}>
                  <motion.div className="h-full rounded-full" style={{ background: item.color }}
                    initial={{ width: 0 }} animate={{ width: `${(item.valor / totalSplit) * 100}%` }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                </div>
                <p className="text-[10px] text-muted mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">📊 Metas do 2º Semestre</p>
          <div className="space-y-4">
            <Bar value={AG.clientesJuridico} max={AG.metaClientesJuridico2sem}
              color="#a78bfa" label="Clientes jurídicos → meta 12"
              subLeft={`${AG.clientesJuridico} atual`} subRight="12 meta" />
            <Bar value={AG.perfilSeguidores} max={5000}
              color={COR} label="@trafegon seguidores → meta 5k"
              subLeft="2.250 atual" subRight="5.000 meta" />
            <Bar value={0} max={1000}
              color="#60a5fa" label="Perfil jurídico seguidores → meta 1k"
              subLeft="0 atual" subRight="1.000 meta" />
          </div>
        </div>
      </div>

      {/* Alertas / Prioridades */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {AG.alertas.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="rounded-xl p-3.5 flex gap-3 items-start"
            style={{ background: a.color + '08', border: `1px solid ${a.color}28` }}>
            <span className="text-xl flex-shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-xs font-extrabold text-text">{a.titulo}</p>
                <Badge color={a.color} text={a.badge} />
              </div>
              <p className="text-[11px] font-medium" style={{ color: a.color }}>→ {a.acao}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── ABA FUNIL COMERCIAL ──────────────────────── */
function FunilComercial() {
  const funil = [
    { label: 'Leads gerados',          value: '~220/mês', pctBar: 100, color: '#a78bfa', gargalo: false, desc: 'CPL R$18 · 90% advogados' },
    { label: 'Leads qualificados',      value: '~20–30',   pctBar: 13,  color: '#60a5fa', gargalo: false, desc: 'Com budget para assessoria' },
    { label: 'Avanço no comercial',     value: '?',        pctBar: 8,   color: '#ef4444', gargalo: true,  desc: 'Sem processo estruturado' },
    { label: 'Clientes fechados',       value: '?',        pctBar: 4,   color: COR,       gargalo: false, desc: 'Taxa de fechamento a mapear' },
  ]

  return (
    <div className="space-y-5">
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-5">🔻 Funil Comercial Jurídico — Estimado</p>
        <div className="space-y-2">
          {funil.map((step, i) => (
            <div key={step.label} className="relative">
              <motion.div
                initial={{ width: 0, opacity: 0 }} animate={{ width: `${step.pctBar}%`, opacity: 1 }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-xl px-4 py-3 relative"
                style={{
                  minWidth: 160,
                  background: step.gargalo ? '#ef444418' : step.color + '18',
                  border: `1.5px solid ${step.gargalo ? '#ef4444' : step.color}35`,
                }}>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold" style={{ color: step.gargalo ? '#ef4444' : step.color }}>{step.label}</span>
                  <span className="text-sm font-black ml-3" style={{ color: step.gargalo ? '#ef4444' : step.color }}>{step.value}</span>
                </div>
                <p className="text-[10px] mt-0.5" style={{ color: step.gargalo ? '#ef4444' : '#8890b5' }}>{step.desc}</p>
                {step.gargalo && (
                  <span className="absolute -top-2 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white whitespace-nowrap">
                    GARGALO ⚠️
                  </span>
                )}
              </motion.div>
              {i < funil.length - 1 && (
                <div className="px-2 py-1">
                  <span className="text-[10px] font-bold text-muted">▼</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl p-4" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
          <p className="text-xs font-bold text-red-500 mb-2">📋 O que precisamos mapear agora:</p>
          <ul className="space-y-1 text-[11px] text-muted">
            <li>• Quantos leads passam por atendimento comercial real?</li>
            <li>• Qual o tempo médio de resposta ao lead?</li>
            <li>• Qual a taxa de conversão de lead → proposta?</li>
            <li>• Quantos leads foram ofertados o Destrava Digital?</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">🛤️ Sequência de Nutrição (a implementar)</p>
          {[
            { step: '1', label: 'Lead entra', desc: 'Formulário com pergunta qualificadora', color: '#a78bfa' },
            { step: '2', label: 'Atendimento', desc: 'Resposta em até 2h · script comercial', color: '#60a5fa' },
            { step: '3', label: 'Não fechou?', desc: 'Oferta do Destrava Digital em 24h', color: '#ea8a29' },
            { step: '4', label: 'Broadcast', desc: 'Entra na lista WhatsApp semanal', color: COR },
            { step: '5', label: 'Reativação', desc: 'Follow-up em 30/60/90 dias', color: '#f59e0b' },
          ].map((s, i) => (
            <div key={i} className="flex items-start gap-3 py-2.5" style={{ borderBottom: i < 4 ? '1px solid #f1f3f9' : 'none' }}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-extrabold text-white flex-shrink-0"
                style={{ background: s.color }}>{s.step}</div>
              <div>
                <p className="text-xs font-bold text-text">{s.label}</p>
                <p className="text-[10px] text-muted">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">💼 Produtos e Ticket</p>
          {[
            { produto: 'Destrava Digital',   ticket: 'R$ 1.000–2.000', recorrencia: 'Avulso',      publico: 'Ana Paula (entrada)', color: '#60a5fa' },
            { produto: 'Landing Page',       ticket: 'R$ 800–1.500',   recorrencia: 'Avulso',      publico: 'Complementar',       color: '#a78bfa' },
            { produto: 'Assessoria Jurídico', ticket: 'R$ 3.500+/mês', recorrencia: 'Recorrente',  publico: 'Carlos (escritório)', color: COR       },
            { produto: 'Assessoria Geral',   ticket: 'R$ 2.000–3.500/mês', recorrencia: 'Recorrente', publico: 'Rejane (empresa)', color: '#ea8a29' },
          ].map((p, i) => (
            <div key={i} className="py-2.5" style={{ borderBottom: i < 3 ? '1px solid #f1f3f9' : 'none' }}>
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs font-bold text-text">{p.produto}</span>
                <span className="text-xs font-extrabold" style={{ color: p.color }}>{p.ticket}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                  style={{ background: p.color + '20', color: p.color }}>{p.recorrencia}</span>
                <span className="text-[10px] text-muted">{p.publico}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── COMPONENTE PRINCIPAL ─────────────────────── */
export default function TrafegonResultados({ color = COR }) {
  const [subTab, setSubTab] = useState('geral')

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🏆 Resultados & Métricas
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>TráfegOn Agência</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Visão estratégica · 2º Semestre 2026</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {[
            { key: 'geral',  label: '📊 Visão Geral', sub: 'Macro' },
            { key: 'funil',  label: '🔻 Funil',        sub: 'Comercial' },
          ].map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              className="flex flex-col items-start px-4 py-2 rounded-xl text-left transition-all"
              style={subTab === t.key ? { background: color + '18', color } : { color: '#8890b5' }}>
              <span className="text-xs font-extrabold">{t.label}</span>
              <span className="text-[10px] opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {subTab === 'geral' && <VisaoGeral />}
        {subTab === 'funil' && <FunilComercial />}
      </motion.div>
    </div>
  )
}
