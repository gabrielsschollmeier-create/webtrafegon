import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp } from 'lucide-react'

/* ── Formatadores ─────────────────────────────── */
const R = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const R2 = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

/* ── Dados consolidados ───────────────────────── */
const G = {
  totalInvestido:  30615.08,
  receitaBruta:    28713,
  receitaLiquida:  24406.05,
  saldoRecuperar:  6209.03,
  pctRecuperado:   93.8,
  contratos:       22,
  contractsMeta:   28,
  mrr:             5976,
  mrrMeta:         12282,
  arr:             71712,
  ticketMedio:     267,
  setupTotal:      11471,
  cacLiquido:      870,
  payback:         3.8,
  ltv:             1701,
  ltvCac:          1.96,
  churn:           0,
  custoFixo:       6500,
  gapBreakeven:    1524,
  sobra:           1782.60,
  breakeven:       'Setembro/2026',
  porMes: [
    { mes: 'Fev', contratos: 7, ticket: 306.57, setup: 731.57, receita: 7267, investido: 7336.12, resultado: -1159.17 },
    { mes: 'Mar', contratos: 7, ticket: 240.86, setup: 361.43, receita: 6362, investido: 8495.70, resultado: -3088.00 },
    { mes: 'Abr', contratos: 5, ticket: 291.20, setup: 602.00, receita: 8298, investido: 8263.89, resultado: -1210.59 },
    { mes: 'Mai', contratos: 3, ticket: 229.33, setup: 270.00, receita: 6786, investido: 6519.37, resultado: -751.27  },
  ],
}

const T = {
  leads:       649,
  mqls:        204,
  demos:       42,
  vendas:      16,
  ticket:      155.07,
  ticketMens:  145.37,
  mrr:         2326,
  mrrGrowth:   290,
  ltv:         927,
  ltvCac:      1.52,
  cac:         608.88,
  payback:     4,
  bkClientes:  13,
  bkAtingido:  'Abr/2026',
  expectativa: 17520,
  cenarios: [
    { icon: '🔴', nome: 'Pessimista', vendas: 3, churn: '4%',  bk: 'Não atinge', mrrNov: 4335, isMeta: false },
    { icon: '🟡', nome: 'Regular',    vendas: 5, churn: '~2%', bk: 'Set/2026',   mrrNov: 6505, isMeta: true  },
    { icon: '🟢', nome: 'Otimista',   vendas: 7, churn: '0%',  bk: 'Ago/2026',   mrrNov: 8990, isMeta: false },
  ],
  acoes: [
    { n: 1, titulo: 'Conversão Demo → Venda', acao: 'Padronizar pitch, objeções e follow-up',      tag: 'COMERCIAL',   color: '#a78bfa' },
    { n: 2, titulo: 'Aumentar Ticket Médio',   acao: 'Meta: ~R$299. Cada R$50 move muito o LTV',   tag: 'PRICING',     color: '#6eda2c' },
    { n: 3, titulo: 'Qualificação de Leads',   acao: 'CPL MQL volátil (R$26–87). Validar públicos', tag: 'SEGMENTAÇÃO', color: '#ea8a29' },
    { n: 4, titulo: 'Estabilizar Vendas',      acao: 'Mínimo 5/mês. Meta ideal: 7–9/mês',          tag: 'ESCALA',      color: '#60a5fa' },
  ],
}

const I = {
  investimento: 5837.37,
  impressoes:   190948,
  cliques:      824,
  cpm:          30.57,
  ctr:          0.43,
  cpc:          7.08,
  leads:        311,
  cpl:          18.77,
  mqls:         208,
  cplMql:       28.06,
  convLeadMql:  66.88,
  demos:        63,
  cpo:          92.66,
  convMqlDemo:  20.26,
  vendas:       9,
  cac:          648.60,
  convDemoVenda:14.29,
  mrr:          3650,
  ticket:       405.56,
  setup:        11471,
  ltv:          2585,
  ltvCac:       3.99,
  payback:      2,
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

function Badge({ color, text }) {
  return (
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

/* ── ABA VISÃO GERAL ──────────────────────────── */
function VisaoGeral({ color }) {
  return (
    <div className="space-y-5">

      {/* HERO CARD */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)`,
        }} />
        <div className="relative z-10 flex flex-wrap gap-8 items-center">
          {/* Percentual */}
          <div className="flex flex-col items-center justify-center rounded-2xl px-6 py-4"
            style={{ background: color + '18', border: `1px solid ${color}35` }}>
            <span className="text-5xl font-black" style={{ color }}>{G.pctRecuperado}%</span>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Recuperado</span>
          </div>
          {/* Detalhe */}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>Fev–Mai 2026 · 4 meses · Fee R$3.297/mês</p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investimento</p>
                <p className="text-2xl font-black text-white">{R2(G.totalInvestido)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Receita Bruta</p>
                <p className="text-2xl font-black" style={{ color }}>{R(G.receitaBruta)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Saldo a Recuperar</p>
                <p className="text-2xl font-black" style={{ color: '#fb923c' }}>{R(G.saldoRecuperar)}</p>
              </div>
            </div>
            <p className="text-[11px] mt-3 max-w-md" style={{ color: 'rgba(255,255,255,0.5)' }}>
              O saldo negativo é o <strong style={{ color: 'rgba(255,255,255,0.75)' }}>custo de construção de um ativo</strong> — a base agora gera
              <strong style={{ color }}> {R2(G.sobra)}/mês</strong> de sobra sem novas vendas.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="📄" label="Contratos Ativos"  value={G.contratos}     sub="22 clientes fechados"        color={color}      trend="up" />
        <BigKpi icon="💵" label="MRR Atual (Mai)"    value={R(G.mrr)}        sub={`ARR: ${R(G.arr)}`}          color="#6eda2c"    trend="up" />
        <BigKpi icon="💰" label="Setup Acumulado"    value={R(G.setupTotal)} sub="Entrada única · 4 meses"     color="#60a5fa" />
        <BigKpi icon="🎯" label="Ticket Médio MRR"   value={R2(G.ticketMedio)} sub="Meta: manter R$267 mínimo" color="#ea8a29"    trend="down" />
      </div>

      {/* PROGRESSOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text">🎯 Progresso das Metas</p>
          <Bar value={G.receitaBruta}  max={G.totalInvestido} color="#ea8a29"   label="Investimento Recuperado"        subLeft="R$0"                    subRight={R2(G.totalInvestido)} />
          <Bar value={G.contratos}     max={G.contractsMeta}  color="#6eda2c"   label="Contratos → Breakeven (28)"     subLeft="Faltam 6 contratos"      subRight="28 meta" />
          <Bar value={G.mrr}           max={G.mrrMeta}        color={color}     label="MRR → Meta Set/26"              subLeft={R(G.mrr) + ' atual'}    subRight={R(G.mrrMeta) + ' meta'} />
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">⚡ Indicadores Financeiros</p>
          <div className="space-y-0">
            {[
              { label: 'CAC Líquido (descontado setup)', value: R(G.cacLiquido),    color: '#a78bfa' },
              { label: 'LTV estimado (7,5 meses)',        value: R(G.ltv),           color: '#6eda2c' },
              { label: 'LTV / CAC',                       value: `${G.ltvCac}x`,     color: G.ltvCac >= 3 ? '#6eda2c' : '#ea8a29', badge: G.ltvCac < 3 ? 'abaixo do ideal' : null, badgeColor: '#ea8a29' },
              { label: 'Payback por cliente',             value: `${G.payback}m`,    color: '#60a5fa' },
              { label: 'Churn (4 meses)',                  value: `${G.churn}%`,      color: '#6eda2c', badge: '✅ Zero', badgeColor: '#6eda2c' },
              { label: 'Breakeven do projeto',            value: G.breakeven,        color: '#6eda2c' },
              { label: 'Sobra mensal da base',            value: `+${R2(G.sobra)}/mês`, color: '#6eda2c' },
              { label: 'Custo fixo total operação',       value: R(G.custoFixo),     color: '#ef4444' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-[11px] text-muted">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && <Badge color={item.badgeColor} text={item.badge} />}
                  <span className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TABELA MENSAL */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📅 Evolução Mensal</p>
          <div className="flex items-center gap-3 text-[11px] text-muted">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-green-400" /> Bom</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-orange-400" /> Atenção</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block bg-red-400" /> Crítico</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Mês', 'Contratos', 'Ticket MRR', 'Ticket Setup', 'Receita', 'Investido', 'Resultado'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {G.porMes.map((row, i) => {
                const ticketColor = row.ticket >= 290 ? '#6eda2c' : row.ticket >= 250 ? '#ea8a29' : '#ef4444'
                const prev = G.porMes[i - 1]
                return (
                  <motion.tr key={row.mes} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f1f3f9' }}>
                    <td className="px-4 py-3 font-bold text-text">{row.mes}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <span className="text-sm font-extrabold" style={{ color }}>{row.contratos}</span>
                        {prev && row.contratos < prev.contratos && <TrendingDown size={11} className="text-red-400" />}
                        {prev && row.contratos > prev.contratos && <TrendingUp size={11} className="text-green-400" />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-extrabold text-sm" style={{ color: ticketColor }}>{R2(row.ticket)}</span>
                    </td>
                    <td className="px-4 py-3 text-muted font-medium text-xs">{R(row.setup)}</td>
                    <td className="px-4 py-3 font-bold text-text">{R(row.receita)}</td>
                    <td className="px-4 py-3 text-muted">{R2(row.investido)}</td>
                    <td className="px-4 py-3">
                      <span className="font-extrabold text-sm" style={{ color: row.resultado >= 0 ? '#6eda2c' : '#ef4444' }}>
                        {row.resultado >= 0 ? '+' : ''}{R2(row.resultado)}
                      </span>
                    </td>
                  </motion.tr>
                )
              })}
              {/* Totais */}
              <tr style={{ background: '#f7f8fc', borderTop: '2px solid #e2e5f0' }}>
                <td className="px-4 py-3 font-extrabold text-text">TOTAL</td>
                <td className="px-4 py-3 font-extrabold text-xl" style={{ color }}>22</td>
                <td className="px-4 py-3 font-extrabold text-text">{R2(G.ticketMedio)} <span className="text-[10px] text-muted font-normal">média</span></td>
                <td className="px-4 py-3 font-bold text-muted">{R(521.41)}</td>
                <td className="px-4 py-3 font-extrabold" style={{ color: '#6eda2c' }}>{R(G.receitaBruta)}</td>
                <td className="px-4 py-3 font-extrabold text-text">{R2(G.totalInvestido)}</td>
                <td className="px-4 py-3 font-extrabold text-red-500">-{R2(G.saldoRecuperar)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ALERTAS — compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '📉', titulo: 'Queda no Ticket Médio',   acao: 'Padronizar oferta com ticket mínimo definido',              color: '#ef4444', badge: 'PRIORIDADE MÁXIMA' },
          { icon: '📊', titulo: 'Queda no Volume de Vendas', acao: 'Auditar processo de vendas — leads chegando normalmente',  color: '#ea8a29', badge: 'ATENÇÃO' },
          { icon: '👁️', titulo: 'Monitoramento de Churn',   acao: 'Implementar tracking formal + meta de churn máximo',       color: '#ea8a29', badge: 'MONITORAR' },
          { icon: '📈', titulo: 'LTV/CAC Abaixo de 3x',    acao: 'Alavanca principal: aumentar ticket → 3x benchmark SaaS',   color: '#60a5fa', badge: 'MELHORAR' },
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

      {/* CONQUISTAS */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🏆 Conquistas</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: '💰', titulo: '93,8% recuperado',     sub: 'do investimento já em caixa',   done: true  },
            { icon: '📈', titulo: 'Base autossustentável', sub: '+R$1.782/mês sem novas vendas', done: true  },
            { icon: '📅', titulo: 'Breakeven set/26',      sub: 'payback em 3,5 meses',          done: true  },
            { icon: '🔒', titulo: '0% de Churn',           sub: '4 meses sem cancelamento',      done: true  },
            { icon: '🎯', titulo: 'Ticket R$267+',          sub: 'meta: manter R$267 mínimo',    done: false },
            { icon: '⚡', titulo: '28 contratos',           sub: 'breakeven operacional completo', done: false },
          ].map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: a.done ? 1 : 0.38, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                background: a.done ? color + '0d' : '#f7f8fc',
                border: `1px solid ${a.done ? color + '30' : '#e2e5f0'}`,
                filter: a.done ? 'none' : 'grayscale(100%)',
              }}>
              <span className="text-2xl flex-shrink-0">{a.icon}</span>
              <div>
                <p className="text-xs font-extrabold text-text">{a.titulo}</p>
                <p className="text-[10px] text-muted">{a.sub}</p>
                {!a.done && <p className="text-[9px] font-bold mt-0.5" style={{ color }}>🔒 Não desbloqueado</p>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── ABA TEMOOS ───────────────────────────────── */
function Temoos({ color }) {
  const convMqlDemo = ((T.demos / T.mqls) * 100).toFixed(1)
  const convLeadMql = ((T.mqls / T.leads) * 100).toFixed(1)
  const convDemoVenda = ((T.vendas / T.demos) * 100).toFixed(1)

  const funnel = [
    { label: 'Leads',              value: T.leads,  pct: 100,                                         color: '#a78bfa', gargalo: false },
    { label: 'MQL (Qualificados)', value: T.mqls,   pct: Math.round((T.mqls / T.leads) * 100),        color: '#60a5fa', gargalo: false },
    { label: 'Demo (Agendada)',    value: T.demos,  pct: Math.round((T.demos / T.mqls) * 100),        color: '#ef4444', gargalo: true  },
    { label: 'Venda Fechada',      value: T.vendas, pct: Math.round((T.vendas / T.demos) * 100),      color: '#6eda2c', gargalo: false },
  ]

  return (
    <div className="space-y-5">

      {/* HERO TEMOOS */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a2410 0%, #0f3318 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #6eda2c22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: '#6eda2caa' }}>
            Temoos · 13/02/2026 a 21/05/2026
          </p>
          <div className="flex flex-wrap gap-8 mb-3">
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">MRR Atual</p>
              <p className="text-3xl font-black" style={{ color: '#6eda2c' }}>{R(T.mrr)}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#6eda2c80' }}>+{T.mrrGrowth}% desde fev</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Expectativa 7,5 meses</p>
              <p className="text-3xl font-black text-white">{R(T.expectativa)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">valor futuro das 16 vendas</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Vendas Fechadas</p>
              <p className="text-3xl font-black text-white">{T.vendas}</p>
              <p className="text-[10px] text-white/30 mt-0.5">Ticket: {R2(T.ticket)}</p>
            </div>
            <div>
              <p className="text-white/40 text-[10px] uppercase tracking-wider">Breakeven Atingido</p>
              <p className="text-3xl font-black text-green-300">{T.bkAtingido}</p>
              <p className="text-[10px] text-white/30 mt-0.5">{T.bkClientes} clientes necessários</p>
            </div>
          </div>
          <div className="rounded-xl px-4 py-2 w-fit" style={{ background: '#ef444415', border: '1px solid #ef444430' }}>
            <p className="text-[11px] font-bold text-red-300">
              ⚠️ CAC {R2(T.cac)} = 4× o ticket mensal {R2(T.ticketMens)} — operação depende fortemente da retenção
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPIs Temoos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="👥" label="Leads Gerados"       value={T.leads}          sub="no período"           color="#a78bfa" />
        <BigKpi icon="✅" label="MQL Qualificados"     value={`${T.mqls}`}      sub={`${convLeadMql}% dos leads`} color="#60a5fa" />
        <BigKpi icon="📊" label="Demos Agendadas"      value={T.demos}          sub={`${convMqlDemo}% dos MQLs ⚠️`} color="#ef4444" trend="down" />
        <BigKpi icon="🛒" label="Vendas Fechadas"      value={T.vendas}         sub={`${convDemoVenda}% das demos`} color="#6eda2c" />
      </div>

      {/* FUNIL + SAÚDE FINANCEIRA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Funil visual */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-5">🔻 Funil de Conversão</p>
          <div className="space-y-2">
            {funnel.map((step, i) => {
              const width = Math.max(30, (step.value / T.leads) * 100)
              return (
                <div key={step.label} className="relative">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }} animate={{ width: `${width}%`, opacity: 1 }}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-xl px-4 py-2.5 flex items-center justify-between relative"
                    style={{
                      minWidth: 120,
                      background: step.gargalo ? '#ef444418' : step.color + '18',
                      border: `1.5px solid ${step.gargalo ? '#ef4444' : step.color}35`,
                    }}>
                    <span className="text-[11px] font-extrabold" style={{ color: step.gargalo ? '#ef4444' : step.color }}>{step.label}</span>
                    <span className="text-sm font-black ml-3" style={{ color: step.gargalo ? '#ef4444' : step.color }}>{step.value}</span>
                    {step.gargalo && (
                      <span className="absolute -top-2 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white whitespace-nowrap">
                        GARGALO ⚠️
                      </span>
                    )}
                  </motion.div>
                  {i < funnel.length - 1 && (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="w-3 h-px bg-border" />
                      <span className="text-[10px] font-bold"
                        style={{ color: funnel[i + 1].gargalo ? '#ef4444' : '#8890b5' }}>
                        {funnel[i + 1].pct}% conversão
                        {funnel[i + 1].gargalo ? ' ← perda crítica' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 rounded-xl p-3" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
            <p className="text-[11px] font-bold text-red-500">
              🎯 Se MQL→Demo subir de 20% para 35%, as vendas dobram sem mais investimento em mídia.
            </p>
          </div>
        </div>

        {/* Saúde Financeira */}
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">📐 Saúde Financeira</p>
          <div className="space-y-0 mb-5">
            {[
              { label: 'CAC (custo por venda)',     value: R2(T.cac),              color: '#ef4444' },
              { label: 'Ticket Mensal',             value: R2(T.ticketMens),       color: '#ea8a29' },
              { label: 'LTV (7,5 meses)',            value: R(T.ltv),               color: '#6eda2c' },
              { label: 'LTV / CAC',                 value: `${T.ltvCac}x`,          color: '#ea8a29', badge: '< 3x ideal', badgeColor: '#ea8a29' },
              { label: 'Payback por cliente',       value: `${T.payback} meses`,    color: '#60a5fa' },
              { label: 'Breakeven atingido em',     value: T.bkAtingido,            color: '#6eda2c', badge: '✅', badgeColor: '#6eda2c' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-[11px] text-muted">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && <Badge color={item.badgeColor} text={item.badge} />}
                  <span className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Gauge LTV/CAC */}
          <div>
            <div className="flex justify-between text-[10px] text-muted mb-1">
              <span>0x</span>
              <span className="font-extrabold" style={{ color: '#ea8a29' }}>atual {T.ltvCac}x</span>
              <span className="font-extrabold" style={{ color: '#6eda2c' }}>ideal 3x</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f1f3f9' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ef4444, #ea8a29)' }}
                initial={{ width: 0 }} animate={{ width: `${(T.ltvCac / 3) * 100}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            <p className="text-[10px] text-muted mt-1.5">
              Para atingir 3x: ticket ~R$299 ou retenção além de 7,5 meses
            </p>
          </div>
        </div>
      </div>

      {/* CENÁRIOS */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">🔮 Projeções Jun–Nov/2026</p>
          <Badge color="#60a5fa" text="Ads: R$2.400/mês · Agência: R$1.645/mês" />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Cenário', 'Vendas/mês', 'Churn', 'Breakeven', 'MRR Nov/26'].map(h => (
                  <th key={h} className="text-left px-5 py-3 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {T.cenarios.map((c, i) => {
                const rc = i === 0 ? '#ef4444' : i === 1 ? '#ea8a29' : '#6eda2c'
                return (
                  <motion.tr key={c.nome}
                    initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                    style={{ borderBottom: '1px solid #f1f3f9', background: c.isMeta ? '#ea8a2906' : 'transparent' }}>
                    <td className="px-5 py-3">
                      <span className="flex items-center gap-2">
                        <span className="text-base">{c.icon}</span>
                        <span className="font-extrabold" style={{ color: rc }}>{c.nome}</span>
                        {c.isMeta && <Badge color="#ea8a29" text="META MÍNIMA" />}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-bold text-text">{c.vendas}/mês</td>
                    <td className="px-5 py-3 text-muted text-xs">{c.churn}</td>
                    <td className="px-5 py-3 font-extrabold" style={{ color: rc }}>{c.bk}</td>
                    <td className="px-5 py-3 font-extrabold" style={{ color: rc }}>{R(c.mrrNov)}</td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* PLANO DE AÇÃO */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🎯 Onde Focar Agora</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {T.acoes.map((a, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className="rounded-xl p-3.5 flex gap-3"
              style={{ background: a.color + '08', border: `1px solid ${a.color}25` }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-extrabold text-white flex-shrink-0 mt-0.5"
                style={{ background: a.color }}>{a.n}</div>
              <div>
                <p className="text-xs font-extrabold text-text mb-0.5">{a.titulo}</p>
                <p className="text-[11px] text-muted mb-1.5">{a.acao}</p>
                <Badge color={a.color} text={a.tag} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── ABA META ADS — INTIME ───────────────────── */
function IntimeMetaAds({ color }) {
  const funnel = [
    { label: 'Leads',              value: I.leads,  pct: 100,              color: '#a78bfa', gargalo: false },
    { label: 'MQL (Qualificados)', value: I.mqls,   pct: I.convLeadMql,   color: '#60a5fa', gargalo: false },
    { label: 'Demo (Agendada)',    value: I.demos,  pct: I.convMqlDemo,   color: '#ef4444', gargalo: true  },
    { label: 'Venda Fechada',      value: I.vendas, pct: I.convDemoVenda, color: '#6eda2c', gargalo: false },
  ]

  return (
    <div className="space-y-5">

      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1729 0%, #142550 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #60a5fa22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3"
            style={{ color: '#60a5faaa' }}>Meta Ads · Intime Sistemas · Fev–Mai 2026</p>
          <div className="flex flex-wrap gap-8 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>MRR Adquirido</p>
              <p className="text-3xl font-black" style={{ color: '#60a5fa' }}>{R(I.mrr)}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#60a5fa80' }}>9 contratos ativos</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Setup (4 meses)</p>
              <p className="text-3xl font-black text-white">{R(I.setup)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">entrada única acumulada</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investimento Mídia</p>
              <p className="text-3xl font-black text-white">{R2(I.investimento)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">Meta Ads período</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>LTV / CAC</p>
              <p className="text-3xl font-black text-green-300">{I.ltvCac}x</p>
              <p className="text-[10px] text-white/30 mt-0.5">acima de 3x benchmark</p>
            </div>
          </div>
          <div className="rounded-xl px-4 py-2 w-fit" style={{ background: '#6eda2c15', border: '1px solid #6eda2c30' }}>
            <p className="text-[11px] font-bold text-green-300">
              ✅ LTV/CAC {I.ltvCac}x está acima do benchmark de 3x — operação saudável
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="👥" label="Leads Gerados"    value={I.leads}  sub={`CPL: ${R2(I.cpl)}`}              color="#a78bfa" />
        <BigKpi icon="✅"        label="MQL Qualificados" value={I.mqls}   sub={`${I.convLeadMql}% dos leads`}   color="#60a5fa" />
        <BigKpi icon="📊" label="Demos Agendadas"  value={I.demos}  sub={`${I.convMqlDemo}% dos MQLs ⚠️`} color="#ef4444" trend="down" />
        <BigKpi icon="🛒" label="Vendas Fechadas"  value={I.vendas} sub={`${I.convDemoVenda}% das demos`} color="#6eda2c" />
      </div>

      {/* FUNIL + SAUDE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-5">🔻 Funil de Conversão</p>
          <div className="space-y-2">
            {funnel.map((step, i) => {
              const width = Math.max(30, (step.value / I.leads) * 100)
              return (
                <div key={step.label} className="relative">
                  <motion.div
                    initial={{ width: 0, opacity: 0 }} animate={{ width: `${width}%`, opacity: 1 }}
                    transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-xl px-4 py-2.5 flex items-center justify-between relative"
                    style={{
                      minWidth: 120,
                      background: step.gargalo ? '#ef444418' : step.color + '18',
                      border: `1.5px solid ${step.gargalo ? '#ef4444' : step.color}35`,
                    }}>
                    <span className="text-[11px] font-extrabold" style={{ color: step.gargalo ? '#ef4444' : step.color }}>{step.label}</span>
                    <span className="text-sm font-black ml-3" style={{ color: step.gargalo ? '#ef4444' : step.color }}>{step.value}</span>
                    {step.gargalo && (
                      <span className="absolute -top-2 -right-1 text-[8px] font-black px-1.5 py-0.5 rounded-full bg-red-500 text-white whitespace-nowrap">
                        GARGALO ⚠️
                      </span>
                    )}
                  </motion.div>
                  {i < funnel.length - 1 && (
                    <div className="flex items-center gap-2 px-2 py-1">
                      <div className="w-3 h-px bg-border" />
                      <span className="text-[10px] font-bold"
                        style={{ color: funnel[i + 1].gargalo ? '#ef4444' : '#8890b5' }}>
                        {funnel[i + 1].pct}% conversão
                        {funnel[i + 1].gargalo ? ' ← perda crítica' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 rounded-xl p-3" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
            <p className="text-[11px] font-bold text-red-500">
              🎯 Se MQL→Demo subir de 20% para 35%, as vendas dobram sem mais investimento em mídia.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">⚡ Saúde Financeira</p>
          <div className="space-y-0 mb-5">
            {[
              { label: 'Investimento Meta Ads',   value: R2(I.investimento), color: '#60a5fa' },
              { label: 'CAC (custo por venda)',    value: R2(I.cac),          color: '#ef4444' },
              { label: 'Ticket Médio MRR',        value: R2(I.ticket),       color },
              { label: 'LTV (7,5 meses)',           value: R(I.ltv),           color: '#6eda2c' },
              { label: 'LTV / CAC',                value: `${I.ltvCac}x`,    color: '#6eda2c', badge: 'acima 3x ✅', badgeColor: '#6eda2c' },
              { label: 'Payback por cliente',      value: `${I.payback} meses`, color: '#60a5fa' },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: '1px solid #f1f3f9' }}>
                <span className="text-[11px] text-muted">{item.label}</span>
                <div className="flex items-center gap-2">
                  {item.badge && <Badge color={item.badgeColor} text={item.badge} />}
                  <span className="text-sm font-extrabold" style={{ color: item.color }}>{item.value}</span>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div className="flex justify-between text-[10px] text-muted mb-1">
              <span>0x</span>
              <span className="font-extrabold" style={{ color: '#6eda2c' }}>atual {I.ltvCac}x</span>
              <span className="font-extrabold" style={{ color: '#6eda2c' }}>ideal 3x</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f1f3f9' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ea8a29, #6eda2c)' }}
                initial={{ width: 0 }} animate={{ width: `${Math.min(100, (I.ltvCac / 5) * 100)}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            <p className="text-[10px] text-muted mt-1.5">
              Manter ticket acima de R$400 e zero churn para ampliar o LTV/CAC
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {[
              { label: 'CPM', value: R2(I.cpm) },
              { label: 'CTR', value: `${I.ctr}%` },
              { label: 'CPC', value: R2(I.cpc) },
              { label: 'Impressões', value: I.impressoes.toLocaleString('pt-BR') },
            ].map(m => (
              <div key={m.label} className="rounded-lg p-2.5 text-center" style={{ background: '#f7f8fc' }}>
                <p className="text-[9px] font-extrabold text-muted uppercase tracking-wider">{m.label}</p>
                <p className="text-sm font-black text-text mt-0.5">{m.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ALERTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '⚠️', titulo: 'Gargalo: MQL → Demo (20,26%)',        acao: 'Criar follow-up estruturado para MQLs: urgência + proposta de valor para agendar demo', color: '#ef4444', badge: 'CRÍTICO' },
          { icon: '📊', titulo: 'Demo → Venda: 14,29%',                acao: 'Auditar pitch da demo e follow-up pós-demo — cada 5 demos convertidas = R$2.027/mês extra', color: '#ea8a29', badge: 'ATENÇÃO' },
          { icon: '🖥️', titulo: 'CTR 0,43% — Criativo a melhorar',acao: 'Testar novos criativos com copy mais direto. Meta: CTR 0,8–1,2% (dobra volume de leads)', color: '#60a5fa', badge: 'OPORTUNIDADE' },
          { icon: '✅',       titulo: 'LTV/CAC 3,99x — Operação saudável', acao: 'Acima do benchmark de 3x para SaaS. Foco: manter ticket acima de R$400 e churn próximo de zero', color: '#6eda2c', badge: 'SAUDÁVEL' },
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


/* ── COMPONENTE PRINCIPAL ─────────────────────── */
export default function IntimeResultados({ color = '#a78bfa' }) {
  const [subTab, setSubTab] = useState('geral')

  return (
    <div className="space-y-5">

      {/* Header + subtabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🏆 Resultados Estratégicos
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>Intime Sistemas</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Análise de performance · Fev a Mai 2026 · 4 meses de operação</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {[
            { key: 'geral',   label: '📊 Visão Geral', sub: 'Fev–Mai 2026' },
            { key: 'metaads', label: '📱 Meta Ads',    sub: 'Intime · Fev–Mai' },
            { key: 'temoos',  label: '🟢 Temoos',      sub: '13/02 a 21/05' },
          ].map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              className="flex flex-col items-start px-4 py-2 rounded-xl text-left transition-all"
              style={subTab === t.key
                ? { background: color + '18', color }
                : { color: '#8890b5' }}>
              <span className="text-xs font-extrabold">{t.label}</span>
              <span className="text-[10px] opacity-60">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {subTab === 'geral'  && <VisaoGeral color={color} />}
        {subTab === 'metaads' && <IntimeMetaAds color={color} />}
        {subTab === 'temoos'  && <Temoos color={color} />}
      </motion.div>
    </div>
  )
}
