import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, CheckCircle2, AlertTriangle, Zap, Target } from 'lucide-react'

const R2     = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const fmtNum = n => new Intl.NumberFormat('pt-BR').format(n)

/* ── dados brutos por mês (fonte: Meta Ads CSV + Google Ads API) ── */
const buildMonth = m => {
  const totalLeads    = m.meta.leads + m.google.leads
  const totalInvest   = m.meta.investimento + m.google.investimento
  return {
    ...m,
    total: { leads: totalLeads, investimento: totalInvest, cpl: totalInvest / totalLeads },
    pctLeadsMeta:    +(m.meta.leads   / totalLeads  * 100).toFixed(1),
    pctLeadsGoogle:  +(m.google.leads / totalLeads  * 100).toFixed(1),
    pctInvestMeta:   +(m.meta.investimento   / totalInvest * 100).toFixed(1),
    pctInvestGoogle: +(m.google.investimento / totalInvest * 100).toFixed(1),
  }
}

const DATA = {
  maio: buildMonth({
    key: 'maio', label: 'Maio', badge: 'Mai 2026',
    meta: {
      leads: 58, investimento: 1208.08, cpl: 20.83, impressoes: 120976, alcance: 36301, frequencia: 3.33,
      lojas: [
        { nome: 'Araranguá', leads: 17, cpl: 17.71 },
        { nome: 'Criciúma',  leads: 17, cpl: 17.88 },
        { nome: 'Içara',     leads: 15, cpl: 20.22 },
        { nome: 'Tubarão',   leads: 9,  cpl: 33.31 },
      ],
      criativos: [
        { nome: 'AD04 · Acabamento e limpeza',        leads: 20 },
        { nome: 'AD03 · Alugar na Casa do Construtor', leads: 12 },
        { nome: 'AD02 · Precisa de equipamentos?',     leads: 9  },
      ],
    },
    google: { leads: 112, investimento: 2315.84, cpl: 20.68, impressoes: 6278, cliques: 689, ctr: 10.97, cpc: 3.36, convRate: 16.26 },
  }),
  junho: buildMonth({
    key: 'junho', label: 'Junho', badge: 'Jun 2026',
    meta: {
      leads: 42, investimento: 1150.86, cpl: 27.40, impressoes: 102490, alcance: 36543, frequencia: 2.80,
      lojas: [
        { nome: 'Criciúma',  leads: 15, cpl: 19.49 },
        { nome: 'Araranguá', leads: 13, cpl: 21.44 },
        { nome: 'Tubarão',   leads: 10, cpl: 29.66 },
        { nome: 'Içara',     leads: 4,  cpl: 70.77 },
      ],
      criativos: [
        { nome: 'AD03 · Alugar na Casa do Construtor', leads: 15 },
        { nome: 'AD02 · Precisa de equipamentos?',     leads: 6  },
        { nome: 'AD09 · Vídeo — obra/reforma',         leads: 5  },
        { nome: 'AD10 · Vídeo — equipamentos',         leads: 4  },
      ],
    },
    google: { leads: 131, investimento: 1824.04, cpl: 13.92, impressoes: 5061, cliques: 623, ctr: 12.31, cpc: 2.93, convRate: 21.0 },
  }),
}

/* ── mini componentes ── */
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

function PlatformCard({ name, logo, color, data, platform }) {
  const rows = platform === 'meta'
    ? [
        { label: 'Leads gerados',    value: String(data.leads),      color },
        { label: 'Investimento',     value: R2(data.investimento),   color: '#1a1d2e' },
        { label: 'CPL',              value: R2(data.cpl),            color: data.cpl <= 22 ? '#6eda2c' : '#ea8a29' },
        { label: 'Impressões',       value: fmtNum(data.impressoes), color: '#8890b5' },
        { label: 'Alcance',          value: fmtNum(data.alcance),    color: '#8890b5' },
        { label: 'Frequência',       value: data.frequencia.toFixed(2), color: '#8890b5' },
      ]
    : [
        { label: 'Leads gerados',    value: String(data.leads),      color },
        { label: 'Investimento',     value: R2(data.investimento),   color: '#1a1d2e' },
        { label: 'CPL',              value: R2(data.cpl),            color: '#6eda2c' },
        { label: 'Impressões',       value: fmtNum(data.impressoes), color: '#8890b5' },
        { label: 'Cliques',          value: fmtNum(data.cliques),    color: '#8890b5' },
        { label: 'CTR',              value: data.ctr + '%',          color: '#8890b5' },
        { label: 'Taxa conversão',   value: data.convRate + '%',     color: data.convRate >= 5 ? '#6eda2c' : '#ea8a29' },
      ]
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
          {rows.map(row => (
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

/* ── Hero por mês ── */
function Hero({ m, color }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl p-6 relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg, #1c1000 0%, #2d1a00 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}25 0%, transparent 60%)` }} />
      <div className="relative z-10 flex flex-wrap gap-8 items-center">
        <div className="flex flex-col items-center justify-center rounded-2xl px-6 py-4"
          style={{ background: color + '20', border: `1px solid ${color}40` }}>
          <span className="text-5xl font-black" style={{ color }}>{m.total.leads}</span>
          <span className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Leads Totais</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
            {m.badge} · Meta Ads + Google Ads · 4 lojas
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>Investimento Total</p>
              <p className="text-2xl font-black text-white">{R2(m.total.investimento)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>CPL Médio</p>
              <p className="text-2xl font-black" style={{ color }}>{R2(m.total.cpl)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.55)' }}>Google Ads</p>
              <p className="text-2xl font-black text-white">{Math.round(m.pctLeadsGoogle)}%</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>dos leads gerados</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ══════════════════════════════════════════════
   VISÃO DE UM MÊS (Maio ou Junho)
══════════════════════════════════════════════ */
function MonthView({ m, color }) {
  const maxLeads    = Math.max(...m.meta.lojas.map(l => l.leads))
  const maxCriativo = Math.max(...m.meta.criativos.map(c => c.leads))

  return (
    <div className="space-y-5">
      <Hero m={m} color={color} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon="🎯" label="Total de Leads"      value={m.total.leads}            sub="Meta + Google"             color={color}   />
        <KpiCard icon="💰" label="Investimento Total"  value={R2(m.total.investimento)} sub={m.badge}                   color="#60a5fa" />
        <KpiCard icon="📊" label="CPL Médio Geral"     value={R2(m.total.cpl)}          sub="Custo por lead unificado" color="#6eda2c" />
        <KpiCard icon="🔴" label="Leads Google"        value={`${m.google.leads} (${Math.round(m.pctLeadsGoogle)}%)`} sub="Maior volume do mês" color="#ea8a29" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <PlatformCard name="Meta Ads — Facebook & Instagram" logo="📘" color="#1877f2" data={m.meta}   platform="meta"   />
        <PlatformCard name="Google Ads — Pesquisa"           logo="🔍" color="#ea8a29" data={m.google} platform="google" />
      </div>

      {/* Distribuição por canal */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-5">📊 Distribuição por Canal</p>
        <div className="space-y-4">
          {[
            { label: 'Volume de Leads',    meta: m.pctLeadsMeta,  google: m.pctLeadsGoogle,  metaVal: `${m.meta.leads} leads`, googleVal: `${m.google.leads} leads` },
            { label: 'Distribuição Verba', meta: m.pctInvestMeta, google: m.pctInvestGoogle, metaVal: R2(m.meta.investimento), googleVal: R2(m.google.investimento) },
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

      {/* Performance por loja — Meta */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📍 Performance por Loja — Meta Ads</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ background: '#1877f218', color: '#1877f2' }}>4 lojas</span>
        </div>
        <div className="p-5 space-y-4">
          {[...m.meta.lojas].sort((a, b) => b.leads - a.leads).map((loja, i) => {
            const pct = Math.round((loja.leads / maxLeads) * 100)
            return (
              <motion.div key={loja.nome} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-extrabold text-text">📍 {loja.nome}</span>
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
      </div>

      {/* Top criativos — Meta */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">🏅 Criativos que mais performaram — Meta Ads</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto"
            style={{ background: '#1877f218', color: '#1877f2' }}>por leads</span>
        </div>
        <div className="p-5 space-y-4">
          {m.meta.criativos.map((c, i) => {
            const pct = Math.round((c.leads / maxCriativo) * 100)
            return (
              <motion.div key={c.nome} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-text">{c.nome}</span>
                  <span className="text-sm font-extrabold" style={{ color }}>{c.leads} leads</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: color + '15' }}>
                  <motion.div className="h-full rounded-full" style={{ background: color }}
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════
   ANÁLISE — Junho vs Maio + estratégia
══════════════════════════════════════════════ */
function Delta({ cur, prev, lowerBetter = false }) {
  const diff = cur - prev
  const pct  = prev ? (diff / prev) * 100 : 0
  const flat = Math.abs(pct) < 0.5
  const improved = lowerBetter ? diff < 0 : diff > 0
  const color = flat ? '#8890b5' : improved ? '#6eda2c' : '#ef4444'
  const arrow = flat ? '■' : diff > 0 ? '▲' : '▼'
  return (
    <span className="text-[11px] font-extrabold px-2 py-1 rounded-full inline-flex items-center gap-1"
      style={{ background: color + '15', color }}>
      {arrow} {pct > 0 ? '+' : ''}{pct.toFixed(1)}%
    </span>
  )
}

function Analise() {
  const jun = DATA.junho, mai = DATA.maio

  const linhas = [
    { grupo: 'Consolidado', metrica: 'Leads totais',    mai: mai.total.leads,        jun: jun.total.leads,        fmt: v => String(v), lower: false },
    { grupo: 'Consolidado', metrica: 'Investimento',    mai: mai.total.investimento, jun: jun.total.investimento, fmt: R2,             lower: true  },
    { grupo: 'Consolidado', metrica: 'CPL médio',       mai: mai.total.cpl,          jun: jun.total.cpl,          fmt: R2,             lower: true  },
    { grupo: 'Meta Ads',    metrica: 'Leads',           mai: mai.meta.leads,         jun: jun.meta.leads,         fmt: v => String(v), lower: false },
    { grupo: 'Meta Ads',    metrica: 'CPL',             mai: mai.meta.cpl,           jun: jun.meta.cpl,           fmt: R2,             lower: true  },
    { grupo: 'Google Ads',  metrica: 'Leads',           mai: mai.google.leads,       jun: jun.google.leads,       fmt: v => String(v), lower: false },
    { grupo: 'Google Ads',  metrica: 'CPL',             mai: mai.google.cpl,         jun: jun.google.cpl,         fmt: R2,             lower: true  },
  ]

  const lojasCmp = jun.meta.lojas.map(lj => {
    const prev = mai.meta.lojas.find(x => x.nome === lj.nome)
    return { nome: lj.nome, leadsJun: lj.leads, leadsMai: prev?.leads ?? 0, cplJun: lj.cpl, cplMai: prev?.cpl ?? 0 }
  }).sort((a, b) => b.leadsJun - a.leadsJun)

  return (
    <div className="space-y-5">

      {/* Resumo do mês */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1e0a 0%, #112211 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #6eda2c15 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#6eda2c80' }}>Junho vs Maio · resumo</p>
          <p className="text-sm font-extrabold text-white mb-2">Mesmo volume de leads, gastando menos e com CPL mais baixo</p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            Junho fechou com <strong style={{ color: 'white' }}>{jun.total.leads} leads</strong> (vs {mai.total.leads} em maio) a um{' '}
            <strong style={{ color: '#6eda2c' }}>CPL de {R2(jun.total.cpl)}</strong> — 17% mais barato que maio ({R2(mai.total.cpl)}),{' '}
            investindo <strong style={{ color: 'white' }}>{R2(mai.total.investimento - jun.total.investimento)} a menos</strong>.
            O ganho veio do <strong style={{ color: '#ea8a29' }}>Google</strong>, que baixou o CPL em 33%; o Meta perdeu eficiência e é o ponto de ajuste.
          </p>
        </div>
      </motion.div>

      {/* Tabela comparativa */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📈 Comparativo Mês a Mês</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Métrica</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Maio</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Junho</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Variação</th>
              </tr>
            </thead>
            <tbody>
              {linhas.map((row, i) => (
                <motion.tr key={row.grupo + row.metrica} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #f1f3f9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-[12px] font-semibold text-text">{row.metrica}</p>
                    <p className="text-[10px] text-muted mt-0.5">{row.grupo}</p>
                  </td>
                  <td className="px-4 py-3 text-center text-sm font-extrabold text-muted">{row.fmt(row.mai)}</td>
                  <td className="px-4 py-3 text-center text-sm font-extrabold text-text">{row.fmt(row.jun)}</td>
                  <td className="px-4 py-3 text-center"><Delta cur={row.jun} prev={row.mai} lowerBetter={row.lower} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Meta por loja — jun vs mai */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📍 Meta por Loja — Junho vs Maio</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background: '#1877f218', color: '#1877f2' }}>leads</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Loja</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Leads Mai</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Leads Jun</th>
                <th className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Variação</th>
              </tr>
            </thead>
            <tbody>
              {lojasCmp.map((lj, i) => (
                <motion.tr key={lj.nome} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid #f1f3f9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-[12px] font-extrabold text-text">📍 {lj.nome}</td>
                  <td className="px-4 py-3 text-center text-sm font-bold text-muted">{lj.leadsMai}</td>
                  <td className="px-4 py-3 text-center text-sm font-extrabold text-text">{lj.leadsJun}</td>
                  <td className="px-4 py-3 text-center"><Delta cur={lj.leadsJun} prev={lj.leadsMai} /></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Virada dos criativos */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🔄 A virada dos criativos</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="rounded-xl p-4" style={{ background: '#8890b508', border: '1px solid #8890b520' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Campeão em Maio</p>
            <p className="text-sm font-extrabold text-text">AD04 · Acabamento e limpeza</p>
            <p className="text-[12px] text-muted mt-1">20 leads em maio → despencou para 4 em junho. Vale reativar/renovar essa linha.</p>
          </div>
          <div className="rounded-xl p-4" style={{ background: '#6eda2c0a', border: '1px solid #6eda2c25' }}>
            <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: '#6eda2c' }}>Campeão em Junho</p>
            <p className="text-sm font-extrabold text-text">AD03 · Alugar na Casa do Construtor</p>
            <p className="text-[12px] text-muted mt-1">15 leads (Criciúma puxou 10 a R$15,55). Os vídeos AD09/AD10 entraram somando 9 leads — nova frente a escalar.</p>
          </div>
        </div>
      </div>

      {/* Recomendações estratégicas */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🎯 Recomendações Estratégicas</p>
        <div className="space-y-3">
          {[
            {
              n: 1, prioridade: 'ALTA', color: '#6eda2c',
              titulo: 'Concentrar a captação de leads no Google',
              acao: `O Google entregou ${jun.google.leads} leads a ${R2(jun.google.cpl)} — o canal mais eficiente e com espaço para escalar. Direcionar mais orçamento para cá tende a gerar mais leads sem elevar o custo.`,
              icon: <TrendingUp size={14} />,
            },
            {
              n: 2, prioridade: 'ALTA', color: '#1877f2',
              titulo: 'Reposicionar o Meta: verba mínima + marca',
              acao: 'Manter um valor base no Meta focado em remarketing, reconhecimento de marca e crescimento de seguidores — e não como principal gerador de lead direto. O Meta sustenta o topo do funil que o Google converte.',
              icon: <Target size={14} />,
            },
            {
              n: 3, prioridade: 'MÉDIA', color: '#ea8a29',
              titulo: 'Ajustar a estratégia da loja Içara no Meta',
              acao: 'Içara teve um volume de conversas menor em junho. Revisar segmentação, criativos e roteamento das conversas para retomar o ritmo das demais praças.',
              icon: <AlertTriangle size={14} />,
            },
            {
              n: 4, prioridade: 'MÉDIA', color: '#ea8a29',
              titulo: 'Recuperar e escalar criativos vencedores',
              acao: 'Reativar/renovar o AD04 (campeão de maio), manter o AD03 no ar e ampliar os vídeos AD09/AD10, que ganharam tração em junho.',
              icon: <Zap size={14} />,
            },
            {
              n: 5, prioridade: 'BAIXA', color: '#a78bfa',
              titulo: 'Manter os dois canais em sinergia',
              acao: 'Google captura quem já busca; Meta cria demanda e lembrança. Zerar o Meta reduziria o alcance que alimenta o funil — o ajuste é de proporção, não de corte.',
              icon: <CheckCircle2 size={14} />,
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

    </div>
  )
}

/* ══════════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════════ */
export default function CasaConstrutorResultados({ color = '#d97706' }) {
  const [tab, setTab] = useState('junho')

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
            { key: 'maio',    label: '📅 Maio',     sub: 'Mai 2026'       },
            { key: 'junho',   label: '📅 Junho',    sub: 'Jun 2026'       },
            { key: 'analise', label: '📈 Análise',  sub: 'Jun vs Mai'     },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="flex flex-col items-start px-4 py-2 rounded-xl text-left transition-all"
              style={tab === t.key ? { background: color + '18', color } : { color: '#8890b5' }}>
              <span className="text-xs font-extrabold">{t.label}</span>
              <span className="text-[10px] opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <motion.div key={tab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {tab === 'maio'    && <MonthView m={DATA.maio}  color={color} />}
        {tab === 'junho'   && <MonthView m={DATA.junho} color={color} />}
        {tab === 'analise' && <Analise />}
      </motion.div>

    </div>
  )
}
