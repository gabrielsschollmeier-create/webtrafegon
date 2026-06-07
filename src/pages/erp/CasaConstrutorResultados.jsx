import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle, Zap, Target } from 'lucide-react'

const R2     = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const fmtNum = n => new Intl.NumberFormat('pt-BR').format(n)

const META = {
  leads:        58,
  investimento: 1208.08,
  cpl:          20.83,
  impressoes:   120976,
  convRate:     0.36,
  pctInvest:    34.3,
  pctLeads:     34.1,
  lojas: [
    { nome: 'Tubarão',   leads: 9,  cpl: 33.31 },
    { nome: 'Araranguá', leads: 17, cpl: 17.71 },
    { nome: 'Içara',     leads: 15, cpl: 20.22 },
    { nome: 'Criciúma',  leads: 17, cpl: 17.88 },
  ],
}

const GOOGLE = {
  leads:        112,
  investimento: 2315.84,
  cpl:          20.68,
  impressoes:   6278,
  convRate:     16.26,
  pctInvest:    65.7,
  pctLeads:     65.9,
}

const TOTAL = {
  leads:        170,
  investimento: 3523.92,
  cpl:          20.73,
}

/* ── mini componentes ── */
function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

function KpiCard({ icon, label, value, sub, color }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${color}20` }}>
      <span className="text-xl mb-2">{icon}</span>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted mt-0.5">{sub}</p>}
    </div>
  )
}

function PlatformCard({ name, logo, color, data }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <div className="h-1" style={{ background: color }} />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-base"
            style={{ background: color + '15' }}>{logo}</div>
          <p className="text-sm font-extrabold text-text">{name}</p>
        </div>
        <div className="space-y-0">
          {[
            { label: 'Leads gerados',    value: String(data.leads),      color },
            { label: 'Investimento',     value: R2(data.investimento),   color: '#1a1d2e' },
            { label: 'CPL',              value: R2(data.cpl),            color: '#6eda2c' },
            { label: 'Impressões',       value: fmtNum(data.impressoes), color: '#8890b5' },
            { label: 'Taxa conversão',   value: data.convRate + '%',     color: data.convRate >= 5 ? '#6eda2c' : '#ea8a29' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2.5"
              style={{ borderBottom: '1px solid #f1f3f9' }}>
              <span className="text-[11px] text-muted">{row.label}</span>
              <span className="text-sm font-extrabold" style={{ color: row.color }}>{row.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── Hero compartilhado ── */
function Hero({ color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1c1000 0%, #2d1a00 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}25 0%, transparent 60%)` }} />
      <div className="relative z-10 flex flex-wrap gap-8 items-center">
        <div className="flex flex-col items-center justify-center rounded-2xl px-6 py-4"
          style={{ background: color + '20', border: `1px solid ${color}40` }}>
          <span className="text-5xl font-black" style={{ color }}>{TOTAL.leads}</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Leads Totais</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Meta Ads + Google Ads · 4 lojas
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>Investimento Total</p>
              <p className="text-2xl font-black text-white">{R2(TOTAL.investimento)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>CPL Médio</p>
              <p className="text-2xl font-black" style={{ color }}>{R2(TOTAL.cpl)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>Google Ads</p>
              <p className="text-2xl font-black text-white">66%</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>dos leads gerados</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════
   ABA 1 — VISÃO GERAL
══════════════════════════════════════════════ */
function VisaoGeral({ color }) {
  const maxLeads = Math.max(...META.lojas.map(l => l.leads))

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="🎯" label="Total de Leads"     value={TOTAL.leads}           sub="Meta + Google"             color={color}    />
        <KpiCard icon="💰" label="Investimento Total"  value={R2(TOTAL.investimento)} sub="Período analisado"        color="#60a5fa"  />
        <KpiCard icon="📊" label="CPL Médio Geral"    value={R2(TOTAL.cpl)}          sub="Custo por lead unificado" color="#6eda2c"  />
        <KpiCard icon="🔴" label="Leads Google"        value={`${GOOGLE.leads} (66%)`} sub="Maior volume do período" color="#ea8a29"  />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlatformCard name="Meta Ads — Facebook & Instagram" logo="📘" color="#1877f2" data={META}   />
        <PlatformCard name="Google Ads — Pesquisa"           logo="🔍" color="#ea8a29" data={GOOGLE} />
      </div>

      {/* Barras de volume */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-5">📊 Distribuição por Canal</p>
        <div className="space-y-4">
          {[
            { label: 'Volume de Leads',   meta: META.pctLeads,   google: GOOGLE.pctLeads,   metaVal: `${META.leads} leads`,   googleVal: `${GOOGLE.leads} leads`  },
            { label: 'Distribuição Verba', meta: META.pctInvest,  google: GOOGLE.pctInvest,  metaVal: R2(META.investimento),   googleVal: R2(GOOGLE.investimento)  },
          ].map(row => (
            <div key={row.label}>
              <div className="flex items-center justify-between text-[10px] mb-1.5">
                <span className="font-bold text-text">{row.label}</span>
                <div className="flex items-center gap-3 text-muted">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-[#1877f2]" /> {row.metaVal}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm inline-block bg-[#ea8a29]" /> {row.googleVal}</span>
                </div>
              </div>
              <div className="h-6 rounded-xl overflow-hidden flex">
                <motion.div className="h-full flex items-center justify-center text-[10px] font-extrabold text-white"
                  style={{ background: '#1877f2', minWidth: 36 }}
                  initial={{ width: 0 }} animate={{ width: `${row.meta}%` }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                  {Math.round(row.meta)}%
                </motion.div>
                <motion.div className="h-full flex items-center justify-center text-[10px] font-extrabold text-white"
                  style={{ background: '#ea8a29', minWidth: 36 }}
                  initial={{ width: 0 }} animate={{ width: `${row.google}%` }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
                  {Math.round(row.google)}%
                </motion.div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lojas Meta */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📍 Performance por Loja — Meta Ads</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ background: '#1877f218', color: '#1877f2' }}>4 lojas</span>
        </div>
        <div className="p-5 space-y-4">
          {[...META.lojas].sort((a, b) => b.leads - a.leads).map((loja, i) => {
            const pct      = Math.round((loja.leads / maxLeads) * 100)
            const cplColor = loja.cpl <= 20 ? '#6eda2c' : loja.cpl <= 25 ? '#ea8a29' : '#ef4444'
            return (
              <motion.div key={loja.nome} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-text">📍 {loja.nome}</span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      style={{ background: cplColor + '18', color: cplColor }}>CPL {R2(loja.cpl)}</span>
                  </div>
                  <span className="text-sm font-extrabold" style={{ color }}>{loja.leads} leads</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: '#1877f210' }}>
                  <motion.div className="h-full rounded-full" style={{ background: '#1877f2' }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </motion.div>
            )
          })}
        </div>
        <div className="px-5 pb-4">
          <div className="rounded-xl p-3 flex items-start gap-2"
            style={{ background: '#ea8a2909', border: '1px solid #ea8a2925' }}>
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-[11px] text-muted">
              <strong className="text-text">Tubarão</strong> com CPL mais elevado (R$33,31).
              Araranguá e Criciúma lideram em volume com CPL abaixo da média.
            </p>
          </div>
        </div>
      </div>

      {/* Marcos do Mês */}
      <div>
        <p className="text-sm font-extrabold text-text mb-3">🏁 O que entregamos no 1º mês</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { icon: '🎬', label: 'Vídeos Humanizados', desc: 'Produção de vídeos com rosto e voz das lojas para as campanhas Meta', color: '#60a5fa' },
            { icon: '🖥️', label: 'Nova Landing Page', desc: 'LP criada do zero, otimizada para conversão com rastreamento completo', color: '#1877f2' },
            { icon: '📈', label: 'Conv. 12,41% → 16,26%', desc: '+31% de eficiência — mais leads sem aumentar o investimento', color: '#6eda2c' },
            { icon: '🏆', label: 'CPL R$28,23 → R$20,73', desc: '-26,6% no custo por lead em relação ao início da operação', color: '#ea8a29' },
          ].map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-2"
              style={{ background: m.color + '0d', border: `1.5px solid ${m.color}30` }}>
              <span className="text-2xl">{m.icon}</span>
              <p className="text-xs font-extrabold text-text leading-tight">{m.label}</p>
              <p className="text-[11px] leading-relaxed" style={{ color: m.color + 'cc' }}>{m.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Alertas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '✅', titulo: 'CPL equilibrado entre canais',         acao: 'Meta (R$20,83) e Google (R$20,68) com custo quase idêntico — boa distribuição de verba.', color: '#6eda2c', badge: 'SAUDÁVEL'     },
          { icon: '📈', titulo: 'Google gera 66% dos leads',            acao: 'Canal de maior volume e taxa 45× maior. Considere ampliar o orçamento.',                  color: '#ea8a29', badge: 'OPORTUNIDADE' },
          { icon: '📍', titulo: 'Tubarão — CPL R$33,31 acima da média', acao: 'Revisar segmentação e criativos. Meta: CPL abaixo de R$25.',                             color: '#ef4444', badge: 'AJUSTAR'      },
          { icon: '🏆', titulo: 'Araranguá + Criciúma com melhor CPL',  acao: 'CPL abaixo de R$18. Aumentar verba nestas lojas para escalar volume.',                    color: '#60a5fa', badge: 'ESCALAR'      },
        ].map((a, i) => (
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

/* ══════════════════════════════════════════════
   ABA 2 — ANÁLISE META vs GOOGLE
══════════════════════════════════════════════ */
function Analise({ color }) {
  const pctDiff = (a, b, menor) => {
    const diff = Math.abs(((a - b) / b) * 100)
    if (diff < 1) return '≈ igual'
    const wins = menor ? (a < b ? 'meta' : 'google') : (a > b ? 'meta' : 'google')
    return `${wins === 'meta' ? 'Meta' : 'Google'} +${diff.toFixed(0)}%`
  }

  const rows = [
    { metrica: 'Leads gerados',     meta: META.leads,        google: GOOGLE.leads,        vencedor: 'google', fmt: v => String(v),   nota: 'Volume total gerado'           },
    { metrica: 'Investimento',      meta: META.investimento, google: GOOGLE.investimento, vencedor: 'meta',   fmt: v => R2(v),        nota: 'Menor = mais eficiente', menor: true },
    { metrica: 'CPL',               meta: META.cpl,          google: GOOGLE.cpl,          vencedor: 'google', fmt: v => R2(v),        nota: 'Custo por lead', menor: true   },
    { metrica: '% dos leads',       meta: META.pctLeads,     google: GOOGLE.pctLeads,     vencedor: 'google', fmt: v => v + '%',      nota: 'Participação no total'         },
    { metrica: '% do investimento', meta: META.pctInvest,    google: GOOGLE.pctInvest,    vencedor: 'meta',   fmt: v => v + '%',      nota: 'Fatia do orçamento', menor: true },
  ]

  return (
    <div className="space-y-5">

      {/* Papel de cada canal */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Meta */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
          className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <div className="h-1.5" style={{ background: '#1877f2' }} />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: '#1877f215' }}>📘</div>
              <div>
                <p className="text-sm font-extrabold text-text">Meta Ads</p>
                <p className="text-[10px] text-muted">Facebook & Instagram</p>
              </div>
              <span className="ml-auto text-[10px] font-extrabold px-2 py-1 rounded-full"
                style={{ background: '#1877f215', color: '#1877f2' }}>ALCANCE</span>
            </div>

            <div className="rounded-xl p-4 mb-4"
              style={{ background: '#1877f208', border: '1px solid #1877f220' }}>
              <p className="text-xs font-extrabold text-text mb-1">O que faz:</p>
              <p className="text-[12px] text-muted leading-relaxed">
                Aparece para quem <strong className="text-text">ainda não estava buscando</strong> mas tem o perfil de comprador. Cria o desejo e gera reconhecimento de marca nas 4 lojas.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Leads gerados</span>
                <span className="text-sm font-extrabold" style={{ color: '#1877f2' }}>{META.leads} <span className="text-[10px] font-bold text-muted">({META.pctLeads}%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Investimento</span>
                <span className="text-sm font-extrabold text-text">{R2(META.investimento)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">CPL</span>
                <span className="text-sm font-extrabold" style={{ color: '#6eda2c' }}>{R2(META.cpl)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Exibições do anúncio</span>
                <span className="text-sm font-extrabold" style={{ color: '#1877f2' }}>{fmtNum(META.impressoes)}</span>
              </div>
            </div>

            <div className="mt-4 rounded-xl p-3" style={{ background: '#1877f20a', border: '1px solid #1877f220' }}>
              <p className="text-[11px] font-bold" style={{ color: '#1877f2' }}>
                💡 O anúncio foi exibido 120k vezes — aumenta a lembrança de marca e gera reconhecimento das lojas antes da decisão de compra.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Google */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <div className="h-1.5" style={{ background: '#ea8a29' }} />
          <div className="p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                style={{ background: '#ea8a2915' }}>🔍</div>
              <div>
                <p className="text-sm font-extrabold text-text">Google Ads</p>
                <p className="text-[10px] text-muted">Rede de Pesquisa</p>
              </div>
              <span className="ml-auto text-[10px] font-extrabold px-2 py-1 rounded-full"
                style={{ background: '#ea8a2915', color: '#ea8a29' }}>INTENÇÃO</span>
            </div>

            <div className="rounded-xl p-4 mb-4"
              style={{ background: '#ea8a2908', border: '1px solid #ea8a2920' }}>
              <p className="text-xs font-extrabold text-text mb-1">O que faz:</p>
              <p className="text-[12px] text-muted leading-relaxed">
                Captura quem já <strong className="text-text">está buscando ativamente</strong> por materiais de construção. Lead com intenção de compra — por isso a taxa de conversão é muito maior.
              </p>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Leads gerados</span>
                <span className="text-sm font-extrabold" style={{ color: '#ea8a29' }}>{GOOGLE.leads} <span className="text-[10px] font-bold text-muted">({GOOGLE.pctLeads}%)</span></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Investimento</span>
                <span className="text-sm font-extrabold text-text">{R2(GOOGLE.investimento)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">CPL</span>
                <span className="text-sm font-extrabold" style={{ color: '#6eda2c' }}>{R2(GOOGLE.cpl)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Impressões</span>
                <span className="text-sm font-extrabold text-muted">{fmtNum(GOOGLE.impressoes)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-muted">Taxa de conversão</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold" style={{ color: '#6eda2c' }}>{GOOGLE.convRate}%</span>
                  <span className="text-[10px] text-muted font-medium">— alta intenção ✓</span>
                </div>
              </div>
            </div>

            <div className="mt-4 rounded-xl p-3" style={{ background: '#6eda2c0a', border: '1px solid #6eda2c20' }}>
              <p className="text-[11px] font-bold" style={{ color: '#6eda2c' }}>
                ✅ Lead com intenção declarada — quem clica no Google já estava procurando. Volume limitado pela demanda local de busca.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Tabela comparativa */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">🆚 Comparativo Direto</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Métrica</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#1877f2' }}>📘 Meta</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: '#ea8a29' }}>🔍 Google</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Diferença</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const metaWins   = row.vencedor === 'meta'
                const googleWins = row.vencedor === 'google'
                const diff = pctDiff(row.meta, row.google, row.menor)
                const diffColor = metaWins ? '#1877f2' : '#ea8a29'
                return (
                  <motion.tr key={row.metrica} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{ borderBottom: '1px solid #f1f3f9' }}
                    className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-[12px] font-semibold text-text">{row.metrica}</p>
                      <p className="text-[10px] text-muted mt-0.5">{row.nota}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-extrabold" style={{ color: metaWins ? '#1877f2' : '#8890b5' }}>
                        {row.fmt(row.meta)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-sm font-extrabold" style={{ color: googleWins ? '#ea8a29' : '#8890b5' }}>
                        {row.fmt(row.google)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="text-[11px] font-extrabold px-2 py-1 rounded-full"
                        style={{ background: diffColor + '15', color: diffColor }}>
                        {diff}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* O que isso significa */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">📖 O que os números significam na prática</p>
        <div className="space-y-3">
          {[
            {
              icon: '🔁',
              titulo: 'Os dois canais se complementam',
              texto: 'Meta aumenta a lembrança de marca — o anúncio foi exibido 120k vezes, gerando reconhecimento das lojas antes da decisão de compra. Google captura quem já tem intenção de compra. Os dois juntos fecham o ciclo.',
              color: color,
            },
            {
              icon: '⚖️',
              titulo: 'CPL quase idêntico — eficiência equilibrada',
              texto: `A diferença de R$0,15 entre Meta (${R2(META.cpl)}) e Google (${R2(GOOGLE.cpl)}) mostra que os investimentos estão bem calibrados. Nenhum canal está desperdiçando verba.`,
              color: '#6eda2c',
            },
            {
              icon: '🎯',
              titulo: 'Por que não comparar taxa de conversão entre canais',
              texto: 'Meta e Google medem conversão de formas diferentes — o funil de cada um passa por etapas distintas. O que vale comparar é o CPL: ambos chegaram em R$20,73, mostrando eficiência equivalente apesar dos caminhos diferentes.',
              color: '#60a5fa',
            },
            {
              icon: '📈',
              titulo: 'Próximo passo para escalar',
              texto: 'O Google tem demanda limitada pela quantidade de buscas locais. Para crescer em volume, o Meta é o caminho — especialmente nas lojas de Araranguá e Criciúma, que já têm CPL abaixo de R$18.',
              color: '#ea8a29',
            },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-xl p-4 flex gap-3"
              style={{ background: item.color + '07', border: `1px solid ${item.color}20` }}>
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div>
                <p className="text-xs font-extrabold text-text mb-1">{item.titulo}</p>
                <p className="text-[12px] text-muted leading-relaxed">{item.texto}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Recomendações priorizadas */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🎯 Próximos Passos Recomendados</p>
        <div className="space-y-3">
          {[
            {
              n: 1, prioridade: 'ALTA', color: '#ef4444',
              titulo: 'Otimizar Tubarão no Meta Ads',
              acao: `CPL de ${R2(META.lojas[0].cpl)} está 60% acima da média. Revisar públicos e criativos desta loja com foco em reduzir para abaixo de R$25.`,
              icon: <AlertTriangle size={14} />,
            },
            {
              n: 2, prioridade: 'ALTA', color: '#6eda2c',
              titulo: 'Aumentar verba no Google Ads',
              acao: `Taxa de conversão de ${GOOGLE.convRate}% comprova alta intenção de compra. Ampliar o orçamento neste canal tende a gerar mais leads qualificados sem elevar o CPL.`,
              icon: <TrendingUp size={14} />,
            },
            {
              n: 3, prioridade: 'MÉDIA', color: '#ea8a29',
              titulo: 'Escalar Araranguá e Criciúma no Meta',
              acao: `As duas lojas têm CPL abaixo de R$18 — espaço claro para aumentar verba. Duplicar conjuntos vencedores para estas praças antes de testar novos criativos.`,
              icon: <Zap size={14} />,
            },
            {
              n: 4, prioridade: 'MÉDIA', color: '#60a5fa',
              titulo: 'Manter estratégia combinada Meta + Google',
              acao: 'Os dois canais têm CPL idêntico e papéis distintos. Continuar com investimento nos dois — concentrar verba em apenas um canal reduziria alcance ou volume de leads.',
              icon: <CheckCircle2 size={14} />,
            },
            {
              n: 5, prioridade: 'BAIXA', color: '#a78bfa',
              titulo: 'Rastrear origem dos leads por loja no Google',
              acao: 'Hoje o Google não tem breakdown por loja como o Meta. Implementar extensões de local e campanhas separadas por cidade para ter visibilidade granular.',
              icon: <Target size={14} />,
            },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex gap-3 rounded-xl p-4"
              style={{ background: item.color + '08', border: `1px solid ${item.color}25` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-white font-extrabold text-xs flex-shrink-0 mt-0.5"
                style={{ background: item.color }}>{item.n}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-xs font-extrabold text-text">{item.titulo}</p>
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full flex items-center gap-1"
                    style={{ background: item.color + '18', color: item.color }}>
                    {item.icon} {item.prioridade}
                  </span>
                </div>
                <p className="text-[12px] text-muted leading-relaxed">{item.acao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Conclusão */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1e0a 0%, #112211 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #6eda2c15 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: '#6eda2c80' }}>
            Conclusão Estratégica
          </p>
          <p className="text-sm font-extrabold text-white mb-2">
            Campanha saudável com oportunidade clara de escala
          </p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            Com <strong style={{ color: 'white' }}>{TOTAL.leads} leads gerados</strong> a um{' '}
            <strong style={{ color: '#6eda2c' }}>CPL médio de {R2(TOTAL.cpl)}</strong> e dois canais operando em sinergia,
            a estrutura está validada. O passo seguinte é otimizar Tubarão e ampliar o Google Ads para
            extrair mais volume sem aumentar o custo por lead.
          </p>
        </div>
      </motion.div>

      {/* Resultados do 1º mês — contextualiza a análise */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">🏁 O que conquistamos no 1º Mês</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ background: '#6eda2c18', color: '#6eda2c' }}>Mar–Abr 2026</span>
        </div>
        <div className="divide-y" style={{ borderColor: '#f1f3f9' }}>
          {[
            { icon: '🎬', label: 'Vídeos humanizados criados',      detail: 'Conteúdo com rosto e voz das lojas — aumenta confiança e melhora taxa de clique.',  color: '#60a5fa', badge: 'CONCLUÍDO' },
            { icon: '✅', label: 'Nova landing page publicada',      detail: 'Design, copy e rastreamento otimizados para conversão.',                             color: '#1877f2', badge: 'CONCLUÍDO' },
            { icon: '📈', label: 'Taxa de conversão: 12,41% → 16,26%', detail: '+31% de eficiência na LP — mais leads com o mesmo tráfego.',                     color: '#6eda2c', badge: '+31%'      },
            { icon: '🏆', label: 'CPL: R$28,23 → R$20,73',          detail: '-26,6% no custo por lead em relação ao início da operação.',                        color: '#ea8a29', badge: '-26,6%'    },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className="flex items-center gap-4 px-5 py-3.5">
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-extrabold text-text">{item.label}</p>
                <p className="text-[11px] text-muted mt-0.5">{item.detail}</p>
              </div>
              <span className="text-[9px] font-extrabold px-2 py-1 rounded-full flex-shrink-0"
                style={{ background: item.color + '15', color: item.color }}>{item.badge}</span>
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════ */
export default function CasaConstrutorResultados({ color = '#d97706' }) {
  const [subTab, setSubTab] = useState('geral')

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🏆 Resultados de Tráfego
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '18', color }}>Casa do Construtor</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Performance consolidada · Meta Ads + Google Ads · 4 lojas</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {[
            { key: 'geral',  label: '📊 Visão Geral', sub: 'Consolidado'       },
            { key: 'analise',label: '🆚 Meta vs Google', sub: 'Análise comparativa' },
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

      <Hero color={color} />

      <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {subTab === 'geral'   && <VisaoGeral color={color} />}
        {subTab === 'analise' && <Analise    color={color} />}
      </motion.div>

    </div>
  )
}
