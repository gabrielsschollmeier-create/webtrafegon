import { motion } from 'framer-motion'
import { Wallet, TrendingUp, Rocket, Ticket, Target, Users, Megaphone, Info } from 'lucide-react'

const BRL = (n, dec = 2) => new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', minimumFractionDigits: dec, maximumFractionDigits: dec,
}).format(n)
const K = n => 'R$ ' + new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n)

const MESES = [
  { m: 'Jan', full: 'Janeiro',   vendas: 22119.41,  deals: 32 },
  { m: 'Fev', full: 'Fevereiro', vendas: 38518.00,  deals: 41 },
  { m: 'Mar', full: 'Março',     vendas: 64355.63,  deals: 51 },
  { m: 'Abr', full: 'Abril',     vendas: 70806.92,  deals: 62 },
  { m: 'Mai', full: 'Maio',      vendas: 71269.00,  deals: 71 },
  { m: 'Jun', full: 'Junho',     vendas: 110708.20, deals: 77, pico: true },
  { m: 'Jul', full: 'Julho',     vendas: 85007.25,  deals: 80 },
]

const TOTAL = {
  vendas: 462784.41, deals: 414, investido: 9286.03, leads: 621,
  roas: 49.8, ticket: 1117.84, cpl: 14.95, cac: 22.43, conversao: 66,
}

const CAMPANHAS = [
  { nome: 'Ofertas — Mat. Construção', ativa: true,  inv: 5784.98, cpl: 15.10 },
  { nome: 'Ofertas de Janeiro — Mat. Construção', ativa: false, inv: 1502.62, cpl: 11.74 },
  { nome: 'Ofertas — Mat. Construção + Tintas', ativa: false, inv: 1687.29, cpl: 19.62 },
  { nome: 'Ofertas — Mat. Construção + Tintas (2)', ativa: false, inv: 263.82, cpl: 23.98 },
  { nome: 'Vaga de emprego — Vendedor', ativa: false, inv: 47.32, cpl: 3.64 },
]

const MAX = Math.max(...MESES.map(m => m.vendas))
const shadow = '0 2px 14px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.05)'

function Kpi({ icon: Icon, label, value, sub, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl p-4 flex flex-col gap-1.5" style={{ boxShadow: shadow }}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: color + '18', color }}>
          <Icon size={15} strokeWidth={2.4} />
        </div>
        <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{label}</span>
      </div>
      <p className="text-2xl font-black tracking-tight" style={{ color }}>{value}</p>
      {sub && <p className="text-[11px] text-muted leading-tight">{sub}</p>}
    </motion.div>
  )
}

export default function KamyResultados2026({ color = '#be29ec' }) {
  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden rounded-3xl p-6 lg:p-7 text-white"
        style={{ background: `linear-gradient(135deg, ${color}, #7a1bb0 55%, #2a1250)` }}
      >
        <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #fff6, transparent 70%)' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">
              Kamy · Materiais de Construção &amp; Tintas
            </p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">Resultados 2026</h2>
            <p className="text-xs text-white/70 mt-1">Janeiro a julho · Meta Ads + funil de vendas (GHL)</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Vendas fechadas</p>
            <p className="text-3xl lg:text-4xl font-black tabular-nums">{K(TOTAL.vendas)}</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          {[
            ['ROAS', `${TOTAL.roas.toFixed(1)}×`],
            ['Investido', K(TOTAL.investido)],
            ['Negócios', `${TOTAL.deals}`],
            ['Leads', `${TOTAL.leads}`],
            ['Ticket médio', K(TOTAL.ticket)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl px-3 py-1.5 bg-white/12 backdrop-blur flex items-baseline gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{l}</span>
              <span className="text-sm font-black tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Kpi icon={Wallet}     label="Investido"  value={K(TOTAL.investido)} sub="mídia · jan–ago" color="#3b82f6" delay={0.05} />
        <Kpi icon={TrendingUp} label="Vendas"     value={K(TOTAL.vendas)}    sub={`${TOTAL.deals} negócios ganhos`} color="#6eda2c" delay={0.10} />
        <Kpi icon={Rocket}     label="ROAS"       value={`${TOTAL.roas.toFixed(1)}×`} sub="R$ 1 → R$ 49,80" color="#ea8a29" delay={0.15} />
        <Kpi icon={Ticket}     label="Ticket méd." value={K(TOTAL.ticket)}   sub={`${TOTAL.leads} leads gerados`} color={color} delay={0.20} />
      </div>

      {/* Evolução mensal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-text">Evolução das vendas fechadas</h3>
            <p className="text-xs text-muted">Valor de negócios ganhos por mês · nº de negócios à direita</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ color, background: color + '14' }}>+5× de jan a jun</span>
        </div>

        <div className="flex flex-col gap-3">
          {MESES.map((mo, i) => {
            const pct = (mo.vendas / MAX) * 100
            return (
              <div key={mo.m} className="flex items-center gap-3">
                <span className="w-8 text-xs font-bold text-muted">{mo.m}</span>
                <div className="flex-1 h-8 rounded-lg relative overflow-hidden" style={{ background: '#eceef8' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                    transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-lg flex items-center justify-end pr-2.5 min-w-[86px]"
                    style={{
                      background: mo.pico
                        ? 'linear-gradient(90deg, #ea8a29, #f5a94e)'
                        : `linear-gradient(90deg, ${color}, ${color}bb)`,
                    }}
                  >
                    <span className="text-[12px] font-black text-white tabular-nums whitespace-nowrap">{K(mo.vendas)}</span>
                  </motion.div>
                </div>
                <span className="w-8 text-[11px] font-bold text-muted tabular-nums text-right">{mo.deals}</span>
              </div>
            )
          })}
        </div>
        <p className="text-[11px] text-muted mt-4 leading-relaxed">
          <span className="font-bold" style={{ color: '#ea8a29' }}>◆ Junho</span> foi o pico ({K(110708)}).
          Julho teve o maior volume de negócios (80), mas ticket médio menor.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-4">
        {/* Investimento x retorno */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
        >
          <h3 className="text-base font-extrabold text-text mb-1">Investimento × Retorno</h3>
          <p className="text-xs text-muted mb-4">A escala real entre mídia e vendas</p>

          <div className="flex flex-col gap-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted font-bold">Investido</span>
                <span className="font-black text-text tabular-nums">{K(TOTAL.investido)}</span>
              </div>
              <div className="h-5 rounded-lg" style={{ background: '#eceef8' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '2%' }} transition={{ delay: 0.5, duration: 0.6 }}
                  className="h-full rounded-lg" style={{ background: 'linear-gradient(90deg,#ea8a29,#f5a94e)' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted font-bold">Vendas fechadas</span>
                <span className="font-black text-text tabular-nums">{K(TOTAL.vendas)}</span>
              </div>
              <div className="h-5 rounded-lg" style={{ background: '#eceef8' }}>
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.55, duration: 0.7 }}
                  className="h-full rounded-lg" style={{ background: `linear-gradient(90deg,${color},${color}bb)` }} />
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl p-4 flex items-center gap-3" style={{ background: '#ea8a290d', border: '1px solid #ea8a2926' }}>
            <p className="text-4xl font-black tabular-nums" style={{ color: '#ea8a29' }}>49,8×</p>
            <p className="text-[11px] text-muted leading-relaxed">
              A mídia foi só <b className="text-text-2">2%</b> do valor vendido. Cada <b className="text-text-2">R$ 1</b> investido
              devolveu <b style={{ color: '#ea8a29' }}>~R$ 49,80</b> em negócios fechados.
            </p>
          </div>
        </motion.div>

        {/* Eficiência */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
        >
          <h3 className="text-base font-extrabold text-text mb-1">Eficiência de mídia</h3>
          <p className="text-xs text-muted mb-4">Do clique ao negócio ganho</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: Target, l: 'Custo por lead', v: BRL(TOTAL.cpl), c: '#3b82f6' },
              { icon: Target, l: 'Custo por venda', v: BRL(TOTAL.cac), c: color },
              { icon: TrendingUp, l: 'Lead → venda', v: `${TOTAL.conversao}%`, c: '#6eda2c' },
              { icon: Users, l: 'Leads (conversas)', v: `${TOTAL.leads}`, c: '#ea8a29' },
            ].map((x, i) => (
              <div key={i} className="rounded-2xl p-3.5 flex flex-col gap-1" style={{ background: '#f6f7fc' }}>
                <div className="flex items-center gap-1.5" style={{ color: x.c }}>
                  <x.icon size={13} strokeWidth={2.6} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted">{x.l}</span>
                </div>
                <p className="text-xl font-black tabular-nums" style={{ color: x.c }}>{x.v}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Campanhas */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
        className="bg-white rounded-3xl overflow-hidden" style={{ boxShadow: shadow }}
      >
        <div className="px-5 lg:px-6 py-4 border-b border-border flex items-center gap-2">
          <Megaphone size={15} style={{ color }} />
          <div>
            <h3 className="text-sm font-extrabold text-text">Campanhas Meta — investido no período</h3>
            <p className="text-[11px] text-muted">01/jan → 02/ago · custo por lead à direita</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <tbody>
              {CAMPANHAS.map((c, i) => (
                <tr key={i} style={{ borderTop: i ? '1px solid #f0f2fb' : 'none' }}>
                  <td className="px-5 lg:px-6 py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: c.ativa ? '#6eda2c' : '#c3c8de' }} />
                      <span className="font-semibold text-text">{c.nome}</span>
                      {c.ativa && <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                        style={{ color: '#6eda2c', background: '#6eda2c18' }}>ATIVA</span>}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-right font-black text-text tabular-nums whitespace-nowrap">{BRL(c.inv)}</td>
                  <td className="px-5 lg:px-6 py-3 text-right text-muted tabular-nums whitespace-nowrap">{BRL(c.cpl)}<span className="text-[9px] ml-0.5">/lead</span></td>
                </tr>
              ))}
              <tr style={{ borderTop: '2px solid #e0e3f0', background: '#f6f7fc' }}>
                <td className="px-5 lg:px-6 py-3 font-black text-text">Total</td>
                <td className="px-3 py-3 text-right font-black tabular-nums" style={{ color }}>{BRL(TOTAL.investido)}</td>
                <td className="px-5 lg:px-6 py-3 text-right font-bold text-muted tabular-nums">{BRL(TOTAL.cpl)}<span className="text-[9px] ml-0.5">/lead</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Nota */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}
        className="px-4 py-3 rounded-2xl flex items-start gap-2.5"
        style={{ background: '#ea8a290a', border: '1px solid #ea8a2925' }}
      >
        <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#ea8a29' }} />
        <p className="text-[11px] text-muted leading-relaxed">
          <b className="text-text-2">Ponto de atenção:</b> o investimento do Meta veio agregado no período — ainda sem quebra por mês.
          As barras de investimento por mês entram assim que houver o export mensal do Gerenciador.
          <br />
          <b className="text-text-2">Método:</b> vendas = oportunidades com status <b>ganho</b> no GHL, somadas pela data de fechamento.
          ROAS é direcional — nem todo negócio veio 100% desses anúncios (há orgânico e WhatsApp direto no funil).
        </p>
      </motion.div>

    </div>
  )
}
