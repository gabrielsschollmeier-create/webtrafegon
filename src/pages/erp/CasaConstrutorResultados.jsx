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
  julho: buildMonth({
    key: 'julho', label: 'Julho', badge: 'Jul 2026', parcial: true, periodo: '1–15 jul',
    meta: {
      leads: 38, investimento: 513.91, cpl: 13.52, impressoes: 48586, alcance: null, frequencia: null,
      lojas: [
        { nome: 'Criciúma',  leads: 13, cpl: 10.24 },
        { nome: 'Araranguá', leads: 13, cpl: 9.65  },
        { nome: 'Tubarão',   leads: 9,  cpl: 14.02 },
        { nome: 'Içara',     leads: 3,  cpl: 43.03 },
      ],
      criativos: [
        { nome: 'AD07 · Vídeo — Promoção de Julho (Dobro de Tempo)', leads: 26 },
        { nome: 'AD10 · Estático — Promoção de Julho',               leads: 5  },
      ],
    },
    google: { leads: 49, investimento: 804.94, cpl: 16.43, impressoes: 2261, cliques: 270, ctr: 11.94, cpc: 2.98, convRate: 18.1 },
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
        ...(data.alcance != null    ? [{ label: 'Alcance',    value: fmtNum(data.alcance),       color: '#8890b5' }] : []),
        ...(data.frequencia != null ? [{ label: 'Frequência', value: data.frequencia.toFixed(2), color: '#8890b5' }] : []),
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
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2 flex-wrap" style={{ color: 'rgba(255,255,255,0.5)' }}>
            <span>{m.badge} · Meta Ads + Google Ads · 4 lojas</span>
            {m.parcial && (
              <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full normal-case tracking-normal"
                style={{ background: '#ea8a2933', color: '#f0b978' }}>parcial · {m.periodo}</span>
            )}
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
   VISÃO DE UM MÊS (Maio, Junho ou Julho)
══════════════════════════════════════════════ */
function MonthView({ m, color }) {
  const maxLeads    = Math.max(...m.meta.lojas.map(l => l.leads))
  const maxCriativo = Math.max(...m.meta.criativos.map(c => c.leads))

  return (
    <div className="space-y-5">
      <Hero m={m} color={color} />

      {m.parcial && (
        <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#ea8a2909', border: '1px solid #ea8a2925' }}>
          <span className="text-base flex-shrink-0">⏳</span>
          <p className="text-[11px] text-muted">
            <strong className="text-text">Mês em curso.</strong> Números parciais de {m.periodo} — o volume (leads e investimento) ainda vai crescer até o fim do mês. O CPL, por ser média, já é comparável.
          </p>
        </div>
      )}

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
   EVOLUÇÃO — Maio · Junho · Julho
══════════════════════════════════════════════ */
function Evolucao() {
  const meses  = [DATA.maio, DATA.junho, DATA.julho]
  const maxCpl = Math.max(...meses.map(m => m.total.cpl))
  const lojas  = ['Criciúma', 'Araranguá', 'Içara', 'Tubarão']
  const leadsLoja = (m, nome) => m.meta.lojas.find(l => l.nome === nome)?.leads ?? 0
  const projLeads  = Math.round(DATA.julho.total.leads * 31 / 15)
  const projInvest = DATA.julho.total.investimento * 31 / 15

  const linhas = [
    { grupo: 'Consolidado', metrica: 'Leads',        get: m => String(m.total.leads),   destaque: false },
    { grupo: 'Consolidado', metrica: 'Investimento', get: m => R2(m.total.investimento), destaque: false },
    { grupo: 'Consolidado', metrica: 'CPL médio',    get: m => R2(m.total.cpl),          destaque: true  },
    { grupo: 'Meta Ads',    metrica: 'Leads',        get: m => String(m.meta.leads),     destaque: false },
    { grupo: 'Meta Ads',    metrica: 'CPL',          get: m => R2(m.meta.cpl),           destaque: false },
    { grupo: 'Google Ads',  metrica: 'Leads',        get: m => String(m.google.leads),   destaque: false },
    { grupo: 'Google Ads',  metrica: 'CPL',          get: m => R2(m.google.cpl),         destaque: false },
  ]

  return (
    <div className="space-y-5">

      {/* Resumo */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-5 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a1e0a 0%, #112211 100%)', boxShadow: '0 4px 20px rgba(0,0,0,0.25)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 30% 50%, #6eda2c15 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#6eda2c80' }}>Evolução · 3 meses</p>
          <p className="text-sm font-extrabold text-white mb-2">CPL em queda há 3 meses seguidos</p>
          <p className="text-[12px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
            O custo por lead consolidado caiu de <strong style={{ color: 'white' }}>{R2(DATA.maio.total.cpl)}</strong> em maio para{' '}
            <strong style={{ color: 'white' }}>{R2(DATA.junho.total.cpl)}</strong> em junho e <strong style={{ color: '#6eda2c' }}>{R2(DATA.julho.total.cpl)}</strong> em julho (parcial).
            O <strong style={{ color: '#ea8a29' }}>Google</strong> puxou a queda, e em julho o <strong style={{ color: '#60a5fa' }}>Meta se recuperou</strong> —
            a promoção de julho em vídeo trouxe leads a baixo custo. Estrutura validada e mais eficiente a cada mês.
          </p>
        </div>
      </motion.div>

      {/* Gráfico de CPL — 3 meses */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-1">📉 CPL médio consolidado</p>
        <p className="text-[11px] text-muted mb-5">Custo por lead (Meta + Google) mês a mês — quanto menor, melhor</p>
        <div className="flex items-end justify-around gap-4" style={{ height: 190 }}>
          {meses.map((m, i) => {
            const h = Math.round((m.total.cpl / maxCpl) * 140) + 22
            const ultimo = i === meses.length - 1
            return (
              <div key={m.key} className="flex flex-col items-center flex-1 h-full justify-end">
                <span className="text-sm font-black mb-1" style={{ color: ultimo ? '#6eda2c' : '#1a1d2e' }}>{R2(m.total.cpl)}</span>
                <motion.div className="w-full rounded-t-xl"
                  style={{ background: ultimo ? '#6eda2c' : '#6eda2c66', maxWidth: 90 }}
                  initial={{ height: 0 }} animate={{ height: h }}
                  transition={{ duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} />
                <span className="text-[11px] font-bold text-muted mt-2">{m.label}{m.parcial ? ' *' : ''}</span>
              </div>
            )
          })}
        </div>
        <p className="text-[10px] text-muted mt-3">* Julho parcial (1–15). O CPL é média — comparável mesmo com o mês em curso.</p>
      </div>

      {/* Tabela comparativa — 3 meses */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📈 Comparativo Mês a Mês</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Métrica</th>
                {meses.map(m => (
                  <th key={m.key} className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">
                    {m.label}{m.parcial && <span className="block text-[8px] font-bold" style={{ color: '#ea8a29' }}>parcial 1–15</span>}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {linhas.map((row, i) => (
                <motion.tr key={row.grupo + row.metrica} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #f1f3f9', background: row.destaque ? '#6eda2c08' : undefined }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="text-[12px] font-semibold text-text">{row.metrica}</p>
                    <p className="text-[10px] text-muted mt-0.5">{row.grupo}</p>
                  </td>
                  {meses.map((m, j) => (
                    <td key={m.key} className="px-4 py-3 text-center text-sm font-extrabold"
                      style={{ color: row.destaque ? '#4bb01e' : (j === meses.length - 1 ? '#1a1d2e' : '#8890b5') }}>
                      {row.get(m)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3" style={{ borderTop: '1px solid #f1f3f9' }}>
          <p className="text-[10px] text-muted">Julho é parcial (15 dias) — os volumes de leads e investimento ainda vão crescer. Comparar direto com meses fechados só no CPL.</p>
        </div>
      </div>

      {/* Projeção de julho */}
      <div className="rounded-2xl p-5 flex items-start gap-3" style={{ background: '#60a5fa0d', border: '1px solid #60a5fa30' }}>
        <span className="text-2xl flex-shrink-0">🔮</span>
        <div>
          <p className="text-xs font-extrabold text-text mb-1">Projeção de julho (se mantiver o ritmo)</p>
          <p className="text-[12px] text-muted leading-relaxed">
            No ritmo dos primeiros 15 dias, julho fecharia em torno de <strong className="text-text">{projLeads} leads</strong> e{' '}
            <strong className="text-text">{R2(projInvest)}</strong> de investimento, a um <strong style={{ color: '#4bb01e' }}>CPL de ~{R2(DATA.julho.total.cpl)}</strong> —
            o menor da série. É estimativa, não resultado fechado.
          </p>
        </div>
      </div>

      {/* Meta por loja — 3 meses */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📍 Leads por Loja — Meta Ads</p>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full ml-auto" style={{ background: '#1877f218', color: '#1877f2' }}>evolução</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">Loja</th>
                {meses.map(m => (
                  <th key={m.key} className="text-center px-4 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">{m.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lojas.map((nome, i) => (
                <motion.tr key={nome} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                  style={{ borderBottom: '1px solid #f1f3f9' }} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3 text-[12px] font-extrabold text-text">📍 {nome}</td>
                  {meses.map((m, j) => (
                    <td key={m.key} className="px-4 py-3 text-center text-sm font-extrabold"
                      style={{ color: j === meses.length - 1 ? '#1877f2' : '#8890b5' }}>
                      {leadsLoja(m, nome)}
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 pb-4 pt-1">
          <div className="rounded-xl p-3 flex items-start gap-2" style={{ background: '#6eda2c09', border: '1px solid #6eda2c25' }}>
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-[11px] text-muted">
              <strong className="text-text">Araranguá, Criciúma e Tubarão</strong> mantêm ritmo saudável e melhoraram o custo em julho.
              <strong className="text-text"> Içara</strong> segue como a praça a ajustar — é o foco do próximo ciclo no Meta.
            </p>
          </div>
        </div>
      </div>

      {/* Evolução dos criativos */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🔄 Evolução dos criativos campeões</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { mes: 'Maio',  cor: '#8890b5', nome: 'AD04 · Acabamento e limpeza',     desc: '20 leads — estático de acabamento liderou.' },
            { mes: 'Junho', cor: '#ea8a29', nome: 'AD03 · Alugar na Casa do Construtor', desc: '15 leads — e os primeiros vídeos ganharam tração.' },
            { mes: 'Julho', cor: '#6eda2c', nome: 'AD07 · Vídeo — Promoção de Julho',  desc: '26 leads a R$10,42 — o vídeo de promoção (dobro de tempo) foi o motor.' },
          ].map((c, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
              className="rounded-xl p-4" style={{ background: c.cor + '0d', border: `1px solid ${c.cor}30` }}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2" style={{ color: c.cor }}>Campeão · {c.mes}</p>
              <p className="text-sm font-extrabold text-text leading-tight">{c.nome}</p>
              <p className="text-[12px] text-muted mt-1 leading-relaxed">{c.desc}</p>
            </motion.div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">A leitura é clara: <strong className="text-text">o vídeo passou o estático</strong>. A linha de vídeo + promoção é a aposta a manter e escalar.</p>
      </div>

      {/* Recomendações estratégicas */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🎯 Recomendações Estratégicas</p>
        <div className="space-y-3">
          {[
            {
              n: 1, prioridade: 'ALTA', color: '#6eda2c',
              titulo: 'Seguir escalando o Google — agora por região',
              acao: 'O Google segue como principal motor de leads. Em julho a conta foi reestruturada em campanhas por região (Criciúma+Içara, Araranguá, Tubarão+Braço do Norte) — o que tende a melhorar a atribuição por loja e o CPL nas próximas semanas.',
              icon: <TrendingUp size={14} />,
            },
            {
              n: 2, prioridade: 'ALTA', color: '#1877f2',
              titulo: 'Manter a linha de vídeo + promoções no Meta',
              acao: 'O Meta se recuperou em julho (CPL R$13,52 vs R$27,40 em junho), puxado pelo vídeo da promoção "dobro de tempo". Manter o formato vídeo e o calendário de promoções mensais como motor de leads do Meta.',
              icon: <Zap size={14} />,
            },
            {
              n: 3, prioridade: 'MÉDIA', color: '#ea8a29',
              titulo: 'Ajustar a loja Içara no Meta',
              acao: 'Içara segue com volume abaixo das demais praças nos três meses. Revisar segmentação, criativos e roteamento das conversas — é o principal ponto de otimização do próximo ciclo.',
              icon: <AlertTriangle size={14} />,
            },
            {
              n: 4, prioridade: 'MÉDIA', color: '#a78bfa',
              titulo: 'Fechar o rastreamento por loja (WhatsApp)',
              acao: 'Rastrear o WhatsApp de cada loja como conversão separada no Google permite ler lead por cidade — hoje essa visibilidade só existe no Meta. É o que falta para o relatório ficar completo por praça.',
              icon: <Target size={14} />,
            },
            {
              n: 5, prioridade: 'BAIXA', color: '#60a5fa',
              titulo: 'Manter os dois canais em sinergia',
              acao: 'Google captura quem já busca; Meta cria demanda e lembrança. Os dois vêm baixando o CPL juntos — o ajuste é de proporção e criativo, não de corte.',
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
  const [tab, setTab] = useState('julho')

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
            { key: 'julho',   label: '📅 Julho',    sub: 'parcial 1–15'   },
            { key: 'analise', label: '📈 Evolução', sub: 'Mai · Jun · Jul' },
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
        {tab === 'julho'   && <MonthView m={DATA.julho} color={color} />}
        {tab === 'analise' && <Evolucao />}
      </motion.div>

    </div>
  )
}
