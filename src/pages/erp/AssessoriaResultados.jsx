import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

const R2 = n => n != null ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) : '—'
const N  = n => n != null ? new Intl.NumberFormat('pt-BR').format(n) : '0'

/* ── Dados por cliente ────────────────────────────────
   Preencher com os números reais de cada cliente.
   Clientes sem entrada aqui exibem estado vazio.
──────────────────────────────────────────────────── */
const CLIENTS_DATA = {
  ararastur: {
    periodo: 'Jan–Jun/2026',
    meta: {
      investimento: 3120,
      alcance:      92000,
      impressoes:   218000,
      cliques:      1380,
      ctr:          0.63,
      cpm:          14.31,
      cpc:          2.26,
      leads:        86,
      cpl:          36.28,
    },
    google: {
      investimento: 780,
      impressoes:   21500,
      cliques:      365,
      cpc:          2.14,
      leads:        26,
      cpl:          30.00,
    },
    porMes: [
      { mes: 'Jan', meta: 470, google: 120, leads: 15, conversoes: 1 },
      { mes: 'Fev', meta: 490, google: 125, leads: 17, conversoes: 2 },
      { mes: 'Mar', meta: 520, google: 135, leads: 19, conversoes: 2 },
      { mes: 'Abr', meta: 530, google: 130, leads: 18, conversoes: 1 },
      { mes: 'Mai', meta: 560, google: 135, leads: 22, conversoes: 2 },
      { mes: 'Jun', meta: 550, google: 135, leads: 21, conversoes: 2 },
    ],
    acoes: [
      { icon: '📸', titulo: 'Criativos para alta temporada', acao: 'Produzir peças para pacotes de julho/agosto antes do pico sazonal', color: '#6eda2c', tag: 'PRIORIDADE' },
      { icon: '⚠️', titulo: 'CPL acima de R$30 — otimizar', acao: 'Revisar segmentação e públicos — meta de CPL abaixo de R$30', color: '#ea8a29', tag: 'ATENÇÃO' },
      { icon: '🚀', titulo: 'Escalar em julho e agosto', acao: 'Aumentar orçamento para capturar demanda sazonal do turismo', color: '#60a5fa', tag: 'OPORTUNIDADE' },
    ],
  },
}

/* ── Helpers ────────────────────────────────────── */
function getClientData(clientId) {
  const d = CLIENTS_DATA[clientId]
  if (!d) return null
  const totalInvest = (d.meta?.investimento || 0) + (d.google?.investimento || 0)
  const totalLeads  = (d.meta?.leads || 0) + (d.google?.leads || 0)
  const cplMedio    = totalLeads > 0 ? totalInvest / totalLeads : 0
  const totalConv   = d.porMes.reduce((s, m) => s + (m.conversoes || 0), 0)
  return { ...d, totalInvest, totalLeads, cplMedio, totalConv }
}

/* ── Mini componentes ─────────────────────────── */
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

function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

/* ── Estado vazio ─────────────────────────────── */
function EmptyState({ color }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: color + '12', border: `1px solid ${color}30` }}>
        <span className="text-3xl">📊</span>
      </div>
      <p className="text-sm font-extrabold text-text mb-1">Resultados ainda não configurados</p>
      <p className="text-xs text-muted max-w-xs">
        Os indicadores de campanha deste cliente serão exibidos aqui assim que a equipe inserir os dados do período.
      </p>
    </div>
  )
}

/* ── KPIs por plataforma ──────────────────────── */
function KpisMeta({ d, color }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard icon="💸" label="Investimento"   value={R2(d.meta.investimento)} color={color} />
      <KpiCard icon="👁️"  label="Alcance"         value={N(d.meta.alcance)}       sub={`${N(d.meta.impressoes)} impressões`} color="#60a5fa" />
      <KpiCard icon="🖱️" label="Cliques"         value={N(d.meta.cliques)}        sub={`CTR ${d.meta.ctr}% · CPC ${R2(d.meta.cpc)}`} color="#a78bfa" />
      <KpiCard icon="👥" label="Leads"            value={d.meta.leads}             sub={`CPL ${R2(d.meta.cpl)}`} color="#ea8a29" />
    </div>
  )
}

function KpisGoogle({ d, color }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard icon="💸" label="Investimento"   value={R2(d.google.investimento)} color={color} />
      <KpiCard icon="👁️"  label="Impressões"      value={N(d.google.impressoes)}    color="#60a5fa" />
      <KpiCard icon="🖱️" label="Cliques"         value={N(d.google.cliques)}        sub={`CPC ${R2(d.google.cpc)}`} color="#a78bfa" />
      <KpiCard icon="👥" label="Leads"            value={d.google.leads}             sub={`CPL ${R2(d.google.cpl)}`} color="#ea8a29" />
    </div>
  )
}

function KpisTotal({ d, color }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <KpiCard icon="💸" label="Investimento Total" value={R2(d.totalInvest)}  sub={d.periodo}                                     color={color} />
      <KpiCard icon="👥" label="Leads Gerados"       value={N(d.totalLeads)}   sub={`Meta ${d.meta.leads} · Google ${d.google.leads}`} color="#60a5fa" />
      <KpiCard icon="📉" label="CPL Médio"           value={R2(d.cplMedio)}    sub="Custo por Lead combinado"                       color="#ea8a29" />
      <KpiCard icon="🛒" label="Conversões"          value={d.totalConv}       sub="Vendas / contatos qualificados"                 color="#a78bfa" />
    </div>
  )
}

/* ── Tabela mensal ────────────────────────────── */
function TabelaMensal({ d, color }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f3f9' }}>
        <p className="text-sm font-extrabold text-text">📅 Evolução Mensal</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: '#f7f8fc' }}>
              {['Mês', 'Meta Ads', 'Google Ads', 'Total', 'Leads', 'CPL', 'Conversões'].map(h => (
                <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {d.porMes.map((row, i) => {
              const total  = row.meta + (row.google || 0)
              const cplRow = row.leads > 0 ? total / row.leads : 0
              const prev   = d.porMes[i - 1]
              const cplColor = cplRow === 0 ? '#8890b5' : cplRow < 30 ? '#6eda2c' : cplRow < 50 ? '#ea8a29' : '#ef4444'
              return (
                <tr key={row.mes} style={{ borderBottom: '1px solid #f1f3f9' }}
                  className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-bold text-text">{row.mes}</td>
                  <td className="px-4 py-3 text-muted text-xs">{R2(row.meta)}</td>
                  <td className="px-4 py-3 text-muted text-xs">{row.google ? R2(row.google) : '—'}</td>
                  <td className="px-4 py-3 font-bold text-text">{R2(total)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="font-extrabold" style={{ color }}>{row.leads}</span>
                      {prev && row.leads > prev.leads && <TrendingUp  size={11} className="text-green-400" />}
                      {prev && row.leads < prev.leads && <TrendingDown size={11} className="text-red-400"  />}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-extrabold text-sm" style={{ color: cplColor }}>{cplRow > 0 ? R2(cplRow) : '—'}</span>
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#a78bfa' }}>{row.conversoes ?? '—'}</td>
                </tr>
              )
            })}
            <tr style={{ background: '#f7f8fc', borderTop: '2px solid #e2e5f0' }}>
              <td className="px-4 py-3 font-extrabold text-text">TOTAL</td>
              <td className="px-4 py-3 font-bold text-muted">{R2(d.meta.investimento)}</td>
              <td className="px-4 py-3 font-bold text-muted">{R2(d.google.investimento)}</td>
              <td className="px-4 py-3 font-extrabold text-text">{R2(d.totalInvest)}</td>
              <td className="px-4 py-3 font-extrabold" style={{ color }}>{d.totalLeads}</td>
              <td className="px-4 py-3 font-extrabold" style={{ color: '#ea8a29' }}>{R2(d.cplMedio)}</td>
              <td className="px-4 py-3 font-extrabold" style={{ color: '#a78bfa' }}>{d.totalConv}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

/* ── Ações recomendadas ───────────────────────── */
function Acoes({ acoes }) {
  return (
    <div>
      <p className="text-sm font-extrabold text-text mb-3">🎯 Onde Focar Agora</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {acoes.map((a, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="bg-white rounded-xl p-3.5 flex gap-3 items-start"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.07)', border: `1px solid ${a.color}20` }}>
            <span className="text-xl flex-shrink-0">{a.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <p className="text-xs font-extrabold text-text">{a.titulo}</p>
                <Badge color={a.color} text={a.tag} />
              </div>
              <p className="text-[11px] text-muted">→ {a.acao}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ── COMPONENTE PRINCIPAL ─────────────────────── */
export default function AssessoriaResultados({ clientId, color = '#6eda2c' }) {
  const [plat, setPlat] = useState('total')
  const d = getClientData(clientId)

  if (!d) return <EmptyState color={color} />

  const heroInvest = plat === 'meta' ? d.meta.investimento : plat === 'google' ? d.google.investimento : d.totalInvest
  const heroLeads  = plat === 'meta' ? d.meta.leads        : plat === 'google' ? d.google.leads        : d.totalLeads
  const heroCpl    = plat === 'meta' ? d.meta.cpl          : plat === 'google' ? d.google.cpl          : d.cplMedio
  const heroLabel  = plat === 'meta' ? 'Meta Ads' : plat === 'google' ? 'Google Ads' : 'Meta Ads + Google Ads'

  return (
    <div className="space-y-5">

      {/* Seletor de plataforma */}
      <div className="flex items-center gap-1 rounded-2xl p-1 bg-white w-fit"
        style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
        {[
          { key: 'total',  label: '📊 Consolidado' },
          { key: 'meta',   label: '🔵 Meta Ads' },
          { key: 'google', label: '🟡 Google Ads' },
        ].map(t => (
          <button key={t.key} onClick={() => setPlat(t.key)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold transition-all"
            style={plat === t.key ? { background: color + '18', color } : { color: '#8890b5' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Hero card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1a0a 0%, #132010 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.35)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-4"
            style={{ color: color + 'aa' }}>
            {heroLabel} · {d.periodo}
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Investimento</p>
              <p className="text-3xl font-black text-white">{R2(heroInvest)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Leads Gerados</p>
              <p className="text-3xl font-black" style={{ color }}>{N(heroLeads)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">CPL Médio</p>
              <p className="text-3xl font-black text-white">{R2(heroCpl)}</p>
            </div>
            {plat === 'total' && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">Conversões</p>
                <p className="text-3xl font-black" style={{ color: '#a78bfa' }}>{d.totalConv}</p>
              </div>
            )}
            {plat === 'meta' && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">CTR</p>
                <p className="text-3xl font-black text-white">{d.meta.ctr}%</p>
              </div>
            )}
            {plat === 'google' && (
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">CPC</p>
                <p className="text-3xl font-black text-white">{R2(d.google.cpc)}</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div key={plat} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {plat === 'total'  && <KpisTotal  d={d} color={color} />}
        {plat === 'meta'   && <KpisMeta   d={d} color={color} />}
        {plat === 'google' && <KpisGoogle d={d} color={color} />}
      </motion.div>

      {/* Tabela mensal */}
      {d.porMes.length > 0 && <TabelaMensal d={d} color={color} />}

      {/* Ações */}
      {d.acoes?.length > 0 && <Acoes acoes={d.acoes} />}

    </div>
  )
}
