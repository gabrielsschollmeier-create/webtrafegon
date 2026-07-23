import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, CheckCircle2, Circle, Clock } from 'lucide-react'

/* ── Formatadores ─────────────────────────────── */
const R  = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const R2 = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

/* ── Fases do projeto ─────────────────────────── */
const FASES = [
  {
    n: 1, nome: 'Lançamento', periodo: 'Fev/2026', status: 'done', icon: '🚀',
    contratos: 7, mrr: 2146,
    destaque: 'Primeiros 7 contratos. Estrutura de campanha montada e validada.',
  },
  {
    n: 2, nome: 'Crescimento', periodo: 'Mar–Abr/2026', status: 'done', icon: '📈',
    contratos: 21, mrr: 5288,
    destaque: '+14 contratos. MRR recorrente consolidado acima de R$5k.',
  },
  {
    n: 3, nome: 'Consolidação', periodo: 'Mai/2026', status: 'done', icon: '🏗️',
    contratos: 26, mrr: 6425,
    destaque: '26 contratos. 92,4% do investimento recuperado. Base estável.',
  },
  {
    n: 4, nome: 'Breakeven', periodo: 'Jul/2026', status: 'current', icon: '⚡',
    contratos: 39, mrr: 9391,
    destaque: '39 contratos e R$9.391/mês — meta de 36 superada. Operação positiva no mês.',
  },
  {
    n: 5, nome: 'Escala', periodo: 'Nov/2026', status: 'future', icon: '🎯',
    contratos: 53, mrr: 13078,
    destaque: '+R$3.665/mês de resultado. Base autossustentável em escala.',
  },
]

/* ── Dados consolidados ───────────────────────── */
const G = {
  totalInvestido:  31547,
  receitaBruta:    29162,
  receitaLiquida:  24788,
  saldoRecuperar:  6759,
  pctRecuperado:   92.4,
  contratos:       26,
  contractsMeta:   36,
  mrr:             6425,
  mrrMeta:         8766,
  arr:             77100,
  ticketMedio:     247,
  setupTotal:      11471,
  cacLiquido:      772,
  payback:         3.7,
  ltv:             1566,
  ltvCac:          2.03,
  churn:           4,
  custoFixo:       7451,
  gapBreakeven:    2341,
  sobra:           2164,
  breakeven:       'Julho/2026',
  porMes: [
    { mes: 'Fev', contratos: 7, ticket: 306.57, setup: 731.57, receita: 7267,  investido: 7336.12, resultado: -1159.17 },
    { mes: 'Mar', contratos: 7, ticket: 240.86, setup: 361.43, receita: 6362,  investido: 8495.70, resultado: -3088.00 },
    { mes: 'Abr', contratos: 7, ticket: 208.00, setup: 430.00, receita: 8298,  investido: 8263.89, resultado: -1210.59 },
    { mes: 'Mai', contratos: 5, ticket: 227.40, setup: 162.00, receita: 7235,  investido: 7451.29, resultado: -1301.54 },
  ],
}

/* ── Dados Temoos ─────────────────────────────── */
const T = {
  leads:        683,
  mqls:         209,
  opos:          42,
  vendas:        16,
  ticket:       157.81,
  mrr:          2525,
  ltv:          1006,
  ltvCac:       1.56,
  cac:          644.45,
  payback:      4.8,
  cpl:          13.78,
  cplMql:       45.04,
  convLeadMql:  30.60,
  convMqlOpo:    6.15,
  convOpoVenda: 38.10,
  metaAds:      9412.72,
  googleAds:     898.44,
  totalAds:    10311.16,
  bkClientes:    13,
  bkAtingido:  'Abr/2026',
  expectativa:  16058,
  cenarios: [
    { icon: '🔴', nome: 'Pessimista', vendas: 3, churn: '6%',  bk: 'Não atinge', mrrNov: 3800, isMeta: false },
    { icon: '🟡', nome: 'Regular',    vendas: 5, churn: '4%',  bk: 'Ago/2026',   mrrNov: 5900, isMeta: true  },
    { icon: '🟢', nome: 'Otimista',   vendas: 7, churn: '2%',  bk: 'Jul/2026',   mrrNov: 8200, isMeta: false },
  ],
  acoes: [
    { n: 1, titulo: 'Gargalo MQL → OPO (6,15%)',   acao: 'Investigar por que MQLs não chegam à reunião. Follow-up estruturado.',      tag: 'CRÍTICO',    color: '#ef4444' },
    { n: 2, titulo: 'Aumentar Ticket Médio',         acao: 'Meta: R$302+. Cada R$50 eleva LTV/CAC em +0,5x',                            tag: 'PRICING',    color: '#6eda2c' },
    { n: 3, titulo: 'Retenção → Aumentar LTV',       acao: 'Churn de 2% → LTV sobe de 7,5 para 12 meses. Onboarding estruturado.',      tag: 'RETENÇÃO',   color: '#ea8a29' },
    { n: 4, titulo: 'Estabilizar Volume de Vendas',  acao: 'Mínimo 4/mês p/ breakeven. Meta ideal: 6–7/mês.',                           tag: 'ESCALA',     color: '#60a5fa' },
  ],
}

/* ── Dados Intime ERP ─────────────────────────── */
const I = {
  investimento:   6217.37,
  impressoes:    190948,
  cliques:          824,
  cpm:            30.57,
  ctr:             0.43,
  cpc:             7.08,
  leads:            322,
  cpl:            19.31,
  mqls:             209,
  cplMql:         29.75,
  convLeadMql:    64.91,
  demos:             67,
  convMqlDemo:    20.81,
  vendas:            10,
  cac:           621.74,
  convDemoVenda:  14.93,
  mrr:             3900,
  ticket:           390,
  setup:          11471,
  ltv:             2486,
  ltvCac:          4.00,
  payback:          1.9,
}

/* ── Retorno x Investimento (fev–jul/2026) ─────
   Fonte: mídia Temoos auditada (CSV Meta + API Google), Intime conforme
   relatório, agência R$3.297/mês. No consolidado a agência entra cheia;
   nas visões individuais entra rateada em 50%. ── */
const RI = {
  agenciaMes: 3297,
  meses: ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'],
  marcas: {
    juntos: {
      nome: 'Juntos', icon: '⚫', cor: '#a78bfa',
      clientes: 39, mediaMes: 6.5, mrr: 9391,
      setup: 15291, mensalidades: 35108, receita: 50399,
      midia: 27198, agencia: 16485, variavel: 7560, custo: 51243,
      acumulado: -844,
      midiaMes: 4533, agenciaMesVal: 3297, custoMes: 7830, mensal: 1561,
      novos:      [9, 8, 5, 6, 4, 7],
      mrrMes:     [2318, 4170, 5305, 6424, 7502, 9391],
      receitaAcc: [7439, 13709, 21114, 29688, 38190, 50399],
      investAcc:  [5649, 14420, 23362, 32479, 41585, 51243],
      resultMes:  [1790, -2501, -1537, -543, -604, 2548],
    },
    intime: {
      nome: 'Intime ERP', icon: '🔵', cor: '#60a5fa',
      clientes: 14, mediaMes: 2.3, mrr: 5090,
      setup: 15291, mensalidades: 21158, receita: 36449,
      midia: 9450, agencia: 8243, variavel: 5467, custo: 23160,
      acumulado: 13289,
      midiaMes: 1575, agenciaMesVal: 1649, custoMes: 3224, mensal: 1866,
      novos:      [5, 3, 2, 1, 1, 2],
      mrrMes:     [1778, 2741, 3452, 3899, 4199, 5089],
      receitaAcc: [6899, 11740, 17292, 23341, 28540, 36449],
      investAcc:  [2610, 6560, 10617, 14748, 18752, 23160],
      resultMes:  [4289, 891, 1495, 1918, 1195, 3499],
    },
    temoos: {
      nome: 'Temoos', icon: '🟢', cor: '#6eda2c',
      clientes: 25, mediaMes: 4.2, mrr: 4301,
      setup: 0, mensalidades: 13950, receita: 13950,
      midia: 17748, agencia: 8243, variavel: 2093, custo: 28083,
      acumulado: -14133,
      midiaMes: 2958, agenciaMesVal: 1649, custoMes: 4607, mensal: -306,
      novos:      [4, 5, 3, 5, 3, 5],
      mrrMes:     [540, 1429, 1853, 2525, 3303, 4301],
      receitaAcc: [540, 1969, 3822, 6347, 9650, 13950],
      investAcc:  [3039, 7860, 12745, 17731, 22833, 28083],
      resultMes:  [-2499, -3392, -3032, -2461, -1799, -951],
    },
  },
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

/* ── TIMELINE DE FASES ────────────────────────── */
function FasesTimeline({ color }) {
  const [hover, setHover] = useState(null)

  const statusStyle = (status) => ({
    done:    { bg: '#f0fdf4', border: '#4ade80', text: '#16a34a', fill: true  },
    current: { bg: color + '15', border: color,    text: color,    fill: true  },
    next:    { bg: '#fff7ed', border: '#fb923c',  text: '#ea580c', fill: false },
    future:  { bg: '#f8f9ff', border: '#c8cce6',  text: '#8890b5', fill: false },
  })[status]

  return (
    <div className="bg-white rounded-2xl p-5 mb-1"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid rgba(26,29,46,0.06)' }}>

      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-extrabold text-text">🗺️ Jornada do Projeto</p>
          <p className="text-[10px] text-muted mt-0.5">Fev/2026 → Nov/2026 · 5 fases estratégicas</p>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-muted">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400 inline-block" /> Concluída</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: color }} /> Atual</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400 inline-block" /> Próxima</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-300 inline-block" /> Projetada</span>
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-start">
        {FASES.map((fase, i) => {
          const s = statusStyle(fase.status)
          const isLast = i === FASES.length - 1
          const isHovered = hover === fase.n
          return (
            <div key={fase.n} className="flex items-start flex-1 min-w-0">
              {/* Step */}
              <div className="flex flex-col items-center flex-1 min-w-0 cursor-pointer"
                onMouseEnter={() => setHover(fase.n)}
                onMouseLeave={() => setHover(null)}>

                {/* Circle */}
                <motion.div
                  animate={{ scale: fase.status === 'current' ? [1, 1.06, 1] : 1 }}
                  transition={{ repeat: fase.status === 'current' ? Infinity : 0, duration: 2 }}
                  className="w-11 h-11 rounded-full flex items-center justify-center text-base font-extrabold border-2 flex-shrink-0 relative"
                  style={{ background: s.bg, borderColor: s.border, color: s.text }}>
                  {fase.status === 'done'
                    ? <CheckCircle2 size={18} style={{ color: '#22c55e' }} />
                    : fase.status === 'current'
                    ? <span className="text-base">{fase.icon}</span>
                    : fase.status === 'next'
                    ? <Clock size={16} style={{ color: s.text }} />
                    : <span className="text-sm opacity-50">{fase.n}</span>}
                  {fase.status === 'current' && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                      style={{ background: color }} />
                  )}
                </motion.div>

                {/* Label */}
                <p className="text-[10px] font-extrabold text-center mt-2 leading-tight px-1"
                  style={{ color: fase.status === 'future' ? '#c8cce6' : s.text }}>
                  {fase.nome}
                </p>
                <p className="text-[9px] text-muted text-center">{fase.periodo}</p>
                {/* Fases projetadas não exibem meta numérica — a projeção existe no dado,
                    mas mostrá-la como número fechado passa uma precisão que ela não tem. */}
                {fase.status === 'future' ? (
                  <p className="text-[9px] text-center mt-1 italic" style={{ color: '#c8cce6' }}>meta a definir</p>
                ) : (
                  <>
                    <p className="text-[10px] font-bold text-center mt-1" style={{ color: s.text }}>
                      {R(fase.mrr)}/mês
                    </p>
                    <p className="text-[9px] text-muted text-center">{fase.contratos} contratos</p>
                  </>
                )}

                {fase.status === 'current' && (
                  <span className="mt-1.5 text-[8px] font-extrabold px-2 py-0.5 rounded-full"
                    style={{ background: color + '20', color }}>ATUAL</span>
                )}

                {/* Tooltip */}
                {isHovered && (
                  <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                    className="absolute z-20 mt-2 w-48 rounded-xl p-3 text-left shadow-xl"
                    style={{ background: '#1c1f35', top: '100%', marginTop: 8 }}>
                    <p className="text-[9px] font-extrabold uppercase tracking-wider mb-1"
                      style={{ color: s.border }}>{fase.nome} · {fase.periodo}</p>
                    <p className="text-[11px] text-white/70 leading-snug">{fase.destaque}</p>
                  </motion.div>
                )}
              </div>

              {/* Connector */}
              {!isLast && (
                <div className="flex-none flex items-center pt-5 px-1" style={{ minWidth: 24 }}>
                  <div className="h-0.5 w-full rounded-full"
                    style={{
                      background: fase.status === 'done' ? '#4ade80'
                        : fase.status === 'current' ? color
                        : '#e2e5f0',
                    }} />
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
function VisaoGeral({ color }) {
  return (
    <div className="space-y-5">

      {/* HERO CARD */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10 flex flex-wrap gap-8 items-center">
          <div className="flex flex-col items-center justify-center rounded-2xl px-6 py-4"
            style={{ background: color + '18', border: `1px solid ${color}35` }}>
            <span className="text-5xl font-black" style={{ color }}>{G.pctRecuperado}%</span>
            <span className="text-[10px] font-bold mt-1 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.7)' }}>Recuperado</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Fev–Mai 2026 · 4 meses · 26 contratos · Fee R$3.297/mês
            </p>
            <div className="flex flex-wrap gap-8">
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investimento</p>
                <p className="text-2xl font-black text-white">{R(G.totalInvestido)}</p>
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
              O saldo negativo é o <strong style={{ color: 'rgba(255,255,255,0.75)' }}>custo de construção de um ativo</strong> — a base já gera
              <strong style={{ color }}> {R(G.sobra)}/mês</strong> acima do fee de agência sem novas vendas.
            </p>
          </div>
        </div>
      </motion.div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="📄" label="Contratos Ativos"  value={G.contratos}       sub="10 Intime + 16 Temoos"       color={color}      trend="up" />
        <BigKpi icon="💵" label="MRR Atual (Mai)"    value={R(G.mrr)}          sub={`ARR projetado: ${R(G.arr)}`} color="#6eda2c"    trend="up" />
        <BigKpi icon="💰" label="Setup Acumulado"    value={R(G.setupTotal)}   sub="Entrada única · 4 meses"     color="#60a5fa" />
        <BigKpi icon="🎯" label="Ticket Médio MRR"   value={R2(G.ticketMedio)} sub="Intime R$390 · Temoos R$158" color="#ea8a29" />
      </div>

      {/* PROGRESSOS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5 space-y-4" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text">🎯 Progresso das Metas</p>
          <Bar value={G.receitaBruta}  max={G.totalInvestido} color="#ea8a29"   label="Investimento Recuperado (bruto)"   subLeft="R$0"            subRight={R(G.totalInvestido)} />
          <Bar value={G.contratos}     max={G.contractsMeta}  color="#6eda2c"   label="Contratos → Breakeven Jul/26 (36)" subLeft="Faltam 10"      subRight="36 meta" />
          <Bar value={G.mrr}           max={G.mrrMeta}        color={color}     label="MRR → Breakeven (R$8.766)"         subLeft={R(G.mrr) + ' atual'} subRight={R(G.mrrMeta) + ' meta'} />
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">⚡ Indicadores Financeiros</p>
          <div className="space-y-0">
            {[
              { label: 'CPV líquido combinado',            value: R(G.cacLiquido),       color: '#a78bfa' },
              { label: 'LTV médio (7,5 meses)',             value: R(G.ltv),              color: '#6eda2c' },
              { label: 'LTV / CPV combinado',               value: `${G.ltvCac}x`,        color: '#ea8a29', badge: 'abaixo de 3x', badgeColor: '#ea8a29' },
              { label: 'LTV/CPV Intime ERP',                value: '4,00x',               color: '#6eda2c', badge: '✅ Saudável', badgeColor: '#6eda2c' },
              { label: 'LTV/CPV Temoos',                    value: '1,56x',               color: '#ef4444', badge: '⚠ Atenção', badgeColor: '#ef4444' },
              { label: 'Churn estimado',                    value: `${G.churn}%/mês`,     color: '#ea8a29' },
              { label: 'Breakeven do projeto',              value: G.breakeven,           color: '#6eda2c' },
              { label: 'Sobra vs fee agência (sem ads)',    value: `+${R(G.sobra)}/mês`, color: '#6eda2c' },
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
          <p className="text-sm font-extrabold text-text">📅 Evolução Mensal — Fase 1 a 3</p>
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
                {['Mês', 'Fase', 'Contratos', 'Ticket MRR', 'Setup', 'Receita', 'Investido', 'Resultado'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {G.porMes.map((row, i) => {
                const fase = i < 1 ? { n: 1, nome: 'Lançamento', color: '#a78bfa' }
                           : i < 3 ? { n: 2, nome: 'Crescimento', color: '#60a5fa' }
                           :          { n: 3, nome: 'Consolidação', color: '#ea8a29' }
                const ticketColor = row.ticket >= 290 ? '#6eda2c' : row.ticket >= 220 ? '#ea8a29' : '#ef4444'
                const prev = G.porMes[i - 1]
                return (
                  <motion.tr key={row.mes} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="hover:bg-gray-50 transition-colors" style={{ borderBottom: '1px solid #f1f3f9' }}>
                    <td className="px-4 py-3 font-bold text-text">{row.mes}</td>
                    <td className="px-4 py-3">
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full"
                        style={{ background: fase.color + '18', color: fase.color }}>
                        F{fase.n} {fase.nome}
                      </span>
                    </td>
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
                    <td className="px-4 py-3 text-muted font-medium text-xs">{R(row.setup * row.contratos)}</td>
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
              <tr style={{ background: '#f7f8fc', borderTop: '2px solid #e2e5f0' }}>
                <td className="px-4 py-3 font-extrabold text-text">TOTAL</td>
                <td className="px-4 py-3 text-muted text-xs">Fases 1–3</td>
                <td className="px-4 py-3 font-extrabold text-xl" style={{ color }}>26</td>
                <td className="px-4 py-3 font-extrabold text-text">{R2(G.ticketMedio)} <span className="text-[10px] text-muted font-normal">média</span></td>
                <td className="px-4 py-3 font-bold text-muted">{R(G.setupTotal)}</td>
                <td className="px-4 py-3 font-extrabold" style={{ color: '#6eda2c' }}>{R(G.receitaBruta)}</td>
                <td className="px-4 py-3 font-extrabold text-text">{R(G.totalInvestido)}</td>
                <td className="px-4 py-3 font-extrabold text-red-500">-{R(G.saldoRecuperar)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ALERTAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '🏆', titulo: 'Intime ERP — LTV/CAC 4,0x',     acao: 'Produto saudável acima do benchmark SaaS. Escalar com segurança.',        color: '#6eda2c', badge: 'SAUDÁVEL' },
          { icon: '⚠️', titulo: 'Temoos — LTV/CAC 1,56x',         acao: 'Ticket (R$158) vs CAC (R$644): payback de 4,8 meses. Ajuste necessário.', color: '#ef4444', badge: 'ATENÇÃO' },
          { icon: '📈', titulo: 'MRR Faltam R$2.341 p/ Breakeven', acao: 'Breakeven em Julho/2026 com 6 novos contratos/mês e churn ≤4%.',          color: '#ea8a29', badge: 'PRÓXIMO' },
          { icon: '💡', titulo: 'Gargalo: MQL → Demo/OPO',         acao: 'Ambos os produtos perdem muito nesta etapa. Follow-up é a alavanca #1.',  color: '#60a5fa', badge: 'MELHORAR' },
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
        <p className="text-sm font-extrabold text-text mb-4">🏆 Conquistas Desbloqueadas</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: '🚀', titulo: 'Fase 1 Concluída',        sub: 'Lançamento · Fev/2026',         done: true  },
            { icon: '📈', titulo: 'Fase 2 Concluída',        sub: 'Crescimento · Mar–Abr/2026',     done: true  },
            { icon: '🏗️', titulo: 'Fase 3 em andamento',    sub: 'Consolidação · Mai/2026',         done: true  },
            { icon: '💰', titulo: '92,4% recuperado',        sub: 'do investimento já em caixa',    done: true  },
            { icon: '🔒', titulo: 'Churn < 5%',              sub: '4 meses de operação estável',    done: true  },
            { icon: '⚡', titulo: 'Fase 4 — Breakeven',      sub: 'Julho/2026 · MRR R$8.826',       done: false },
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
                {!a.done && <p className="text-[9px] font-bold mt-0.5" style={{ color }}>🔒 Em progresso</p>}
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
  const funnel = [
    { label: 'Leads',              value: T.leads,  pctBar: 100,                                         color: '#a78bfa', gargalo: false },
    { label: 'MQL (Qualificados)', value: T.mqls,   pctBar: Math.round((T.mqls / T.leads) * 100),        color: '#60a5fa', gargalo: false },
    { label: 'OPO (Reunião)',      value: T.opos,   pctBar: Math.round((T.opos / T.leads) * 100),        color: '#ef4444', gargalo: true  },
    { label: 'Venda Fechada',      value: T.vendas, pctBar: Math.round((T.vendas / T.leads) * 100),      color: '#6eda2c', gargalo: false },
  ]

  return (
    <div className="space-y-5">

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a2410 0%, #0f3318 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #6eda2c22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3"
            style={{ color: '#ea8a29aa' }}>Meta Ads · Temoos · Fev–Mai 2026 · Fase 1–3</p>
          <div className="flex flex-wrap gap-8 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>MRR Adquirido</p>
              <p className="text-3xl font-black" style={{ color: '#ea8a29' }}>{R(T.mrr)}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#ea8a2980' }}>16 contratos</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investimento Mídia</p>
              <p className="text-3xl font-black text-white">{R2(T.totalAds)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">Meta Ads + Google · 4 meses</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Ticket Mensal</p>
              <p className="text-3xl font-black text-white">{R2(T.ticket)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">MRR por contrato</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>LTV / CPV</p>
              <p className="text-3xl font-black text-red-300">{T.ltvCac}x</p>
              <p className="text-[10px] text-white/30 mt-0.5">⚠ abaixo de 3x benchmark</p>
            </div>
          </div>
          <div className="rounded-xl px-4 py-2 w-fit" style={{ background: '#ef444415', border: '1px solid #ef444430' }}>
            <p className="text-[11px] font-bold text-red-300">
              ⚠️ LTV/CPV {T.ltvCac}x está abaixo do benchmark de 3x — produto em otimização
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="👥" label="Leads Gerados"       value={T.leads}    sub={`CPL: ${R2(T.cpl)} ✓ baixo`}      color="#a78bfa" />
        <BigKpi icon="✅" label="MQL Qualificados"     value={T.mqls}     sub={`${T.convLeadMql}% dos leads`}    color="#60a5fa" />
        <BigKpi icon="🔴" label="OPO (Gargalo)"       value={T.opos}     sub={`${T.convMqlOpo}% dos MQLs ⚠️`}  color="#ef4444" trend="down" />
        <BigKpi icon="🛒" label="Vendas Fechadas"      value={T.vendas}   sub={`${T.convOpoVenda}% das OPOs ✓`} color="#6eda2c" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-5">🔻 Funil de Conversão</p>
          <div className="space-y-2">
            {funnel.map((step, i) => {
              const width = Math.max(18, step.pctBar)
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
                        {i === 0 ? `${T.convLeadMql}%` : i === 1 ? `${T.convMqlOpo}%` : `${T.convOpoVenda}%`} conversão
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
              🎯 Se MQL→OPO subir de 6% para 12%, as vendas dobram sem custo de mídia adicional.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">📐 Saúde Financeira</p>
          <div className="space-y-0 mb-5">
            {[
              { label: 'Meta Ads',                  value: R2(T.metaAds),         color: '#a78bfa' },
              { label: 'Google Ads',                value: R2(T.googleAds),       color: '#60a5fa' },
              { label: 'CPV',                          value: R2(T.cac),             color: '#ef4444' },
              { label: 'Ticket Mensal',             value: R2(T.ticket),          color: '#ea8a29' },
              { label: 'LTV (7,5 meses)',            value: R(T.ltv),              color: '#6eda2c' },
              { label: 'LTV / CAC',                 value: `${T.ltvCac}x`,        color: '#ef4444', badge: '< 3x ideal', badgeColor: '#ea8a29' },
              { label: 'Payback por cliente',       value: `${T.payback} meses`,  color: '#60a5fa' },
              { label: 'Ticket p/ LTV/CAC = 3x',   value: 'R$ 302/mês',          color: '#ea8a29', badge: 'meta', badgeColor: '#ea8a29' },
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
              <span className="font-extrabold" style={{ color: '#ef4444' }}>atual {T.ltvCac}x</span>
              <span className="font-extrabold" style={{ color: '#6eda2c' }}>ideal 3x</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#f1f3f9' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #ef4444, #ea8a29)' }}
                initial={{ width: 0 }} animate={{ width: `${(T.ltvCac / 3) * 100}%` }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 flex items-center gap-2" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">🔮 Projeções Jun–Nov/2026</p>
          <Badge color="#60a5fa" text="Churn 4%/mês · 6 contratos novos/mês" />
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

/* ── ABA INTIME ERP ───────────────────────────── */
function IntimeMetaAds({ color }) {
  const funnel = [
    { label: 'Leads',              value: I.leads,  pct: 100,              color: '#a78bfa', gargalo: false },
    { label: 'MQL (Qualificados)', value: I.mqls,   pct: I.convLeadMql,   color: '#60a5fa', gargalo: false },
    { label: 'Demo (Agendada)',    value: I.demos,  pct: I.convMqlDemo,   color: '#ef4444', gargalo: true  },
    { label: 'Venda Fechada',      value: I.vendas, pct: I.convDemoVenda, color: '#6eda2c', gargalo: false },
  ]

  return (
    <div className="space-y-5">

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1729 0%, #142550 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 80% 20%, #60a5fa22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3"
            style={{ color: '#60a5faaa' }}>Meta Ads · Intime ERP · Fev–Mai 2026 · Fase 1–3</p>
          <div className="flex flex-wrap gap-8 mb-3">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>MRR Adquirido</p>
              <p className="text-3xl font-black" style={{ color: '#60a5fa' }}>{R(I.mrr)}</p>
              <p className="text-[10px] mt-0.5" style={{ color: '#60a5fa80' }}>10 contratos</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investimento Mídia</p>
              <p className="text-3xl font-black text-white">{R2(I.investimento)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">Meta Ads · 4 meses</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Ticket Mensal</p>
              <p className="text-3xl font-black text-white">{R2(I.ticket)}</p>
              <p className="text-[10px] text-white/30 mt-0.5">MRR por contrato</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>LTV / CAC</p>
              <p className="text-3xl font-black text-green-300">{I.ltvCac}x</p>
              <p className="text-[10px] text-white/30 mt-0.5">✅ acima de 3x benchmark</p>
            </div>
          </div>
          <div className="rounded-xl px-4 py-2 w-fit" style={{ background: '#6eda2c15', border: '1px solid #6eda2c30' }}>
            <p className="text-[11px] font-bold text-green-300">
              ✅ LTV/CAC {I.ltvCac}x está acima do benchmark de 3x — produto financeiramente saudável
            </p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="👥" label="Leads Gerados"    value={I.leads}  sub={`CPL: ${R2(I.cpl)}`}               color="#a78bfa" />
        <BigKpi icon="✅" label="MQL Qualificados"  value={I.mqls}   sub={`${I.convLeadMql}% dos leads ✓`}  color="#60a5fa" />
        <BigKpi icon="📊" label="Demos Agendadas"   value={I.demos}  sub={`${I.convMqlDemo}% dos MQLs ⚠️`} color="#ef4444" trend="down" />
        <BigKpi icon="🛒" label="Vendas Fechadas"   value={I.vendas} sub={`${I.convDemoVenda}% das demos`}  color="#6eda2c" />
      </div>

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
                        {step.pct !== 100 ? `${step.pct}%` : `${I.convLeadMql}%`} conversão
                        {funnel[i + 1].gargalo ? ' ← gargalo principal' : ''}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          <div className="mt-4 rounded-xl p-3" style={{ background: '#ef444408', border: '1px solid #ef444425' }}>
            <p className="text-[11px] font-bold text-red-500">
              🎯 Se MQL→Demo subir de 20,81% para 35%, as vendas dobram sem mais investimento.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <p className="text-sm font-extrabold text-text mb-4">⚡ Saúde Financeira</p>
          <div className="space-y-0 mb-5">
            {[
              { label: 'Investimento Meta Ads',   value: R2(I.investimento), color: '#60a5fa' },
              { label: 'CPV',                      value: R2(I.cac),          color: '#ef4444' },
              { label: 'Ticket Médio MRR',        value: R2(I.ticket),       color },
              { label: 'LTV (7,5 meses)',           value: R(I.ltv),           color: '#6eda2c' },
              { label: 'LTV / CAC',                value: `${I.ltvCac}x`,    color: '#6eda2c', badge: '✅ acima 3x', badgeColor: '#6eda2c' },
              { label: 'Payback por cliente',      value: `~${I.payback} meses`, color: '#60a5fa' },
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

          <div style={{ background: '#1c1f35', borderRadius: 12, padding: '16px 20px', textAlign: 'center' }}>
            <p className="text-[9px] font-extrabold uppercase tracking-widest mb-1" style={{ color: 'rgba(255,255,255,0.3)' }}>LTV / CAC — Intime ERP</p>
            <p className="text-4xl font-black" style={{ color: '#6eda2c' }}>{I.ltvCac}x</p>
            <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>✓ acima do benchmark de 3x para SaaS</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {[
          { icon: '⚠️', titulo: 'Gargalo: MQL → Demo (20,81%)', acao: 'Follow-up estruturado para MQLs: urgência + proposta de valor clara', color: '#ef4444', badge: 'GARGALO' },
          { icon: '📊', titulo: 'Demo → Venda: 14,93%',          acao: 'Auditar pitch e follow-up pós-demo — cada 5 demos convertidas = +R$1.650/mês MRR', color: '#ea8a29', badge: 'ATENÇÃO' },
          { icon: '🖥️', titulo: 'CTR 0,43% — Criativo a otimizar', acao: 'Meta: CTR 0,8–1,2%. Dobra leads sem aumentar orçamento.', color: '#60a5fa', badge: 'OPORTUNIDADE' },
          { icon: '✅', titulo: 'LTV/CAC 4,0x — Produto saudável', acao: 'Acima do benchmark SaaS. Manter ticket ≥R$390 e churn baixo.', color: '#6eda2c', badge: 'SAUDÁVEL' },
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

/* ── ABA RETORNO x INVESTIMENTO ───────────────── */
function LinhaDoTempo({ marca }) {
  const W = 820, H = 300, P = { l: 62, r: 20, t: 18, b: 30 }
  const max = Math.max(...marca.investAcc, ...marca.receitaAcc) * 1.08
  const px = i => P.l + (W - P.l - P.r) * (i / (RI.meses.length - 1))
  const py = v => H - P.b - (H - P.t - P.b) * (v / max)
  const linha = arr => arr.map((v, i) => `${px(i)},${py(v)}`).join(' ')
  const area = `${linha(marca.investAcc)} ${marca.receitaAcc.map((v, i) => `${px(marca.receitaAcc.length - 1 - i)},${py(marca.receitaAcc[marca.receitaAcc.length - 1 - i])}`).join(' ')}`
  const fim = RI.meses.length - 1
  const positivo = marca.acumulado >= 0

  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <p className="text-sm font-extrabold text-text">📈 Linha do Tempo — Retorno x Investimento</p>
        <div className="flex items-center gap-3 text-[10px] text-muted">
          <span className="flex items-center gap-1"><span style={{ width: 14, height: 3, background: '#ef4444', display: 'inline-block', borderRadius: 2 }} /> Investimento acumulado</span>
          <span className="flex items-center gap-1"><span style={{ width: 14, height: 3, background: '#6eda2c', display: 'inline-block', borderRadius: 2 }} /> Retorno acumulado</span>
        </div>
      </div>
      <p className="text-[10px] text-muted mb-3">A área entre as linhas é o que ainda falta recuperar — quando a verde cruza a vermelha, o projeto se paga.</p>

      <div style={{ overflowX: 'auto' }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 520, height: 'auto', display: 'block' }} role="img"
          aria-label={`Retorno versus investimento acumulado — ${marca.nome}`}>
          {[0, 1, 2, 3, 4].map(g => {
            const v = max * g / 4, y = py(v)
            return (
              <g key={g}>
                <line x1={P.l} y1={y} x2={W - P.r} y2={y} stroke="#eef0f7" strokeWidth="1" />
                <text x={P.l - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#8890b5" fontFamily="ui-monospace,monospace">
                  {`R$${Math.round(v / 1000)}k`}
                </text>
              </g>
            )
          })}
          {RI.meses.map((m, i) => (
            <text key={m} x={px(i)} y={H - P.b + 17} textAnchor="middle" fontSize="10" fill="#8890b5" fontFamily="ui-monospace,monospace">{m}</text>
          ))}
          <polygon points={area} fill={positivo ? '#6eda2c' : '#ef4444'} opacity="0.10" />
          <polyline points={linha(marca.investAcc)} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinejoin="round" />
          <polyline points={linha(marca.receitaAcc)} fill="none" stroke="#6eda2c" strokeWidth="3" strokeLinejoin="round" />
          <circle cx={px(fim)} cy={py(marca.investAcc[fim])} r="5" fill="#ef4444" stroke="#fff" strokeWidth="2" />
          <circle cx={px(fim)} cy={py(marca.receitaAcc[fim])} r="5" fill="#6eda2c" stroke="#fff" strokeWidth="2" />
          <text x={W - P.r} y={py(marca.investAcc[fim]) - 10} textAnchor="end" fontSize="11" fontWeight="700" fill="#ef4444" fontFamily="ui-monospace,monospace">{R(marca.investAcc[fim])}</text>
          <text x={W - P.r} y={py(marca.receitaAcc[fim]) + 17} textAnchor="end" fontSize="11" fontWeight="700" fill="#6eda2c" fontFamily="ui-monospace,monospace">{R(marca.receitaAcc[fim])}</text>
        </svg>
      </div>
    </div>
  )
}

function BlocoResultado({ marca, rateio }) {
  const pos = marca.acumulado >= 0
  const posMes = marca.mensal >= 0
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${marca.cor}25` }}>
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-extrabold text-text flex items-center gap-2">
          <span>{marca.icon}</span>{marca.nome}
        </p>
        <Badge color={marca.cor} text={`${marca.clientes} clientes · ${marca.mediaMes}/mês`} />
      </div>

      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Receita</p>
      <div className="space-y-0 mb-3">
        {[
          { k: 'Setup (adesão)', v: R(marca.setup) },
          { k: 'Mensalidades', v: R(marca.mensalidades) },
          { k: 'Receita total', v: R(marca.receita), forte: true, cor: '#6eda2c' },
        ].map(l => (
          <div key={l.k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
            <span className="text-[11px] text-muted">{l.k}</span>
            <span className={`text-${l.forte ? 'sm' : 'xs'} font-extrabold`} style={{ color: l.cor || '#1a1d2e' }}>{l.v}</span>
          </div>
        ))}
      </div>

      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-1">Custos</p>
      <div className="space-y-0 mb-3">
        {[
          { k: 'Mídia', v: R(marca.midia) },
          { k: `Agência${rateio ? ' (÷2)' : ' (integral)'}`, v: R(marca.agencia) },
          { k: 'Variável 15%', v: R(marca.variavel) },
          { k: 'Custo total', v: R(marca.custo), forte: true, cor: '#ef4444' },
        ].map(l => (
          <div key={l.k} className="flex justify-between py-1.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
            <span className="text-[11px] text-muted">{l.k}</span>
            <span className={`text-${l.forte ? 'sm' : 'xs'} font-extrabold`} style={{ color: l.cor || '#1a1d2e' }}>{l.v}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="rounded-xl p-3" style={{ background: (pos ? '#6eda2c' : '#ef4444') + '10', border: `1px solid ${(pos ? '#6eda2c' : '#ef4444')}30` }}>
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Acumulado</p>
          <p className="text-lg font-black" style={{ color: pos ? '#6eda2c' : '#ef4444' }}>
            {pos ? '+' : '−'}{R(Math.abs(marca.acumulado))}
          </p>
        </div>
        <div className="rounded-xl p-3" style={{ background: (posMes ? '#6eda2c' : '#ea8a29') + '10', border: `1px solid ${(posMes ? '#6eda2c' : '#ea8a29')}30` }}>
          <p className="text-[9px] font-extrabold uppercase tracking-wider text-muted">Mensal hoje</p>
          <p className="text-lg font-black" style={{ color: posMes ? '#6eda2c' : '#ea8a29' }}>
            {posMes ? '+' : '−'}{R(Math.abs(marca.mensal))}
          </p>
        </div>
      </div>
      <p className="text-[10px] text-muted mt-2">
        MRR {R(marca.mrr)} − mídia {R(marca.midiaMes)} − agência {R(marca.agenciaMesVal)} = <strong style={{ color: posMes ? '#6eda2c' : '#ea8a29' }}>{posMes ? '+' : '−'}{R(Math.abs(marca.mensal))}/mês</strong>
      </p>
    </div>
  )
}

function RetornoInvestimento({ color }) {
  const [sel, setSel] = useState('juntos')
  const m = RI.marcas[sel]
  const J = RI.marcas.juntos

  return (
    <div className="space-y-5">
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #10231a 0%, #16351f 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 82% 15%, #6eda2c22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#8fd6a8' }}>
            Retorno x Investimento · Fev–Jul 2026
          </p>
          <p className="text-white text-xl font-black mb-1">A operação já se paga mês a mês.</p>
          <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 620 }}>
            O acumulado carrega o custo de construir a base do zero. O resultado mensal mostra como a operação está hoje —
            com {J.clientes} clientes e {R(J.mrr)}/mês de recorrência já ativa.
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Resultado acumulado</p>
              <p className="text-3xl font-black" style={{ color: '#f0a37f' }}>−{R(Math.abs(J.acumulado))}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>98,4% do investido recuperado</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Sobra mensal hoje</p>
              <p className="text-3xl font-black" style={{ color: '#8fd6a8' }}>+{R(J.mensal)}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>MRR já cobre mídia + agência</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>MRR ativo</p>
              <p className="text-3xl font-black text-white">{R(J.mrr)}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{J.clientes} contratos · {J.mediaMes}/mês</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* SELETOR */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {Object.entries(RI.marcas).map(([k, v]) => (
          <button key={k} onClick={() => setSel(k)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2"
            style={sel === k
              ? { background: v.cor + '20', color: v.cor, border: `1px solid ${v.cor}55` }
              : { background: '#fff', color: '#8890b5', border: '1px solid #e2e5f0' }}>
            <span>{v.icon}</span>{v.nome}
          </button>
        ))}
      </div>

      {/* LINHA DO TEMPO */}
      <LinhaDoTempo marca={m} />

      {/* OBSERVAÇÃO — custo variável x investimento em marketing */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', borderLeft: '3px solid #ea8a29' }}>
        <p className="text-sm font-extrabold text-text mb-2">⚠️ Sobre o custo variável</p>
        <p className="text-[12px] text-muted mb-3">
          O custo total de <strong className="text-text">{R(51243)}</strong> inclui <strong className="text-text">{R(7560)} de custo variável</strong> (15% sobre o vendido)
          — despesa interna de operação e entrega, <strong className="text-text">não</strong> valor pago à agência ou às plataformas de mídia.
        </p>

        <div className="rounded-xl p-4 mb-3" style={{ background: '#6eda2c0a', border: '1px solid #6eda2c30' }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Olhando apenas o investimento em marketing</p>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <div>
              <p className="text-[10px] text-muted">Mídia + agência</p>
              <p className="text-lg font-black text-text">{R(43683)}</p>
              <p className="text-[9px] text-muted">{R(27198)} + {R(16485)}</p>
            </div>
            <span className="text-xl text-muted font-black">→</span>
            <div>
              <p className="text-[10px] text-muted">Receita gerada</p>
              <p className="text-lg font-black" style={{ color: '#6eda2c' }}>{R(50399)}</p>
              <p className="text-[9px] text-muted">setup + mensalidades</p>
            </div>
            <span className="text-xl text-muted font-black">=</span>
            <div>
              <p className="text-[10px] text-muted">Sobra</p>
              <p className="text-lg font-black" style={{ color: '#6eda2c' }}>+{R(6716)}</p>
              <p className="text-[9px] font-bold" style={{ color: '#6eda2c' }}>ROI de +15,4%</p>
            </div>
          </div>
        </div>

        <p className="text-[12px] font-bold" style={{ color: '#16a34a' }}>
          Ou seja: o dinheiro colocado em tráfego e gestão já voltou — e ainda deixou uma base recorrente de {R(9391)}/mês rodando.
        </p>
      </div>

      {/* TABELA MENSAL */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📅 Mês a mês — {m.nome}</p>
          <p className="text-[10px] text-muted mt-0.5">O custo fica estável e a receita sobe, porque a mensalidade acumula: quem assinou continua pagando.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Mês', 'Clientes novos', 'MRR ativo', 'Retorno acum.', 'Investido acum.', 'Resultado do mês'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RI.meses.map((mes, i) => (
                <motion.tr key={mes} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-4 py-3 font-bold text-text">{mes}</td>
                  <td className="px-4 py-3 font-extrabold" style={{ color: m.cor }}>+{m.novos[i]}</td>
                  <td className="px-4 py-3 font-bold text-text">{R(m.mrrMes[i])}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#6eda2c' }}>{R(m.receitaAcc[i])}</td>
                  <td className="px-4 py-3 text-muted">{R(m.investAcc[i])}</td>
                  <td className="px-4 py-3 font-extrabold" style={{ color: m.resultMes[i] >= 0 ? '#6eda2c' : '#ef4444' }}>
                    {m.resultMes[i] >= 0 ? '+' : '−'}{R(Math.abs(m.resultMes[i]))}
                  </td>
                </motion.tr>
              ))}
              <tr style={{ background: '#f7f8fc', borderTop: '2px solid #e2e5f0' }}>
                <td className="px-4 py-3 font-extrabold text-text">TOTAL</td>
                <td className="px-4 py-3 font-extrabold text-lg" style={{ color: m.cor }}>{m.clientes}</td>
                <td className="px-4 py-3 font-extrabold text-text">{R(m.mrr)}</td>
                <td className="px-4 py-3 font-extrabold" style={{ color: '#6eda2c' }}>{R(m.receita)}</td>
                <td className="px-4 py-3 font-extrabold text-text">{R(m.custo)}</td>
                <td className="px-4 py-3 font-extrabold" style={{ color: m.acumulado >= 0 ? '#6eda2c' : '#ef4444' }}>
                  {m.acumulado >= 0 ? '+' : '−'}{R(Math.abs(m.acumulado))}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* BLOCOS */}
      <div>
        <p className="text-sm font-extrabold text-text mb-1">🧾 Resultado por visão</p>
        <p className="text-[10px] text-muted mb-3">
          No consolidado a agência entra integral (R$ 3.297/mês). Nas visões individuais ela é rateada em 50% e a mídia é a específica de cada marca.
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <BlocoResultado marca={RI.marcas.juntos} rateio={false} />
          <BlocoResultado marca={RI.marcas.intime} rateio />
          <BlocoResultado marca={RI.marcas.temoos} rateio />
        </div>
      </div>

      {/* CONCLUSÃO */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', borderLeft: '3px solid #6eda2c' }}>
        <p className="text-sm font-extrabold text-text mb-3">✅ Estamos positivos?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
          <div className="rounded-xl p-3.5" style={{ background: '#ea8a2908', border: '1px solid #ea8a2928' }}>
            <p className="text-xs font-extrabold text-text mb-1">📉 No acumulado — falta pouco</p>
            <p className="text-[11px] text-muted">
              {R(J.receita)} de retorno contra {R(J.custo)} investidos = <strong style={{ color: '#ea8a29' }}>−{R(Math.abs(J.acumulado))}</strong>.
              É 1,6% do investido: <strong>98,4% já voltou</strong>.
            </p>
          </div>
          <div className="rounded-xl p-3.5" style={{ background: '#6eda2c08', border: '1px solid #6eda2c28' }}>
            <p className="text-xs font-extrabold text-text mb-1">📈 No mês — já é positivo</p>
            <p className="text-[11px] text-muted">
              MRR de {R(J.mrr)} cobre mídia ({R(J.midiaMes)}) e agência ({R(J.agenciaMesVal)}), sobrando
              <strong style={{ color: '#6eda2c' }}> +{R(J.mensal)}/mês</strong> — sem contar o setup.
            </p>
          </div>
        </div>
        <div className="rounded-xl p-3.5" style={{ background: '#6eda2c10', border: '1px solid #6eda2c35' }}>
          <p className="text-xs font-extrabold" style={{ color: '#16a34a' }}>
            🎯 Mantendo o ritmo, o projeto inteiro vira positivo no próximo mês — e a partir daí cada mês é lucro sobre uma estrutura já paga.
          </p>
        </div>
        <p className="text-[10px] text-muted mt-3">
          Mídia do Temoos auditada (Meta {R(16848)} + Google {R(900)}). Intime conforme relatório. Modelo sem churn.
        </p>
      </div>
    </div>
  )
}

/* ── COMPONENTE PRINCIPAL ─────────────────────── */
export default function IntimeResultados({ color = '#a78bfa' }) {
  const [subTab, setSubTab] = useState('geral')

  return (
    <div className="space-y-4">

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🏆 Resultados Estratégicos
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>Intime Sistemas</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Análise de performance · Fev–Mai 2026 · 4 meses · Intime ERP + Temoos</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {[
            { key: 'geral',    label: '📊 Visão Geral', sub: 'Consolidado' },
            { key: 'metaads',  label: '🔵 Intime ERP',  sub: 'Meta Ads' },
            { key: 'temoos',   label: '🟢 Temoos',       sub: 'Meta + Google' },
            { key: 'retorno',  label: '📈 Retorno x Investimento', sub: 'Fev–Jul 2026' },
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

      {/* Timeline de Fases — sempre visível */}
      <FasesTimeline color={color} />

      {/* Conteúdo da aba */}
      <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        {subTab === 'geral'   && <VisaoGeral color={color} />}
        {subTab === 'metaads' && <IntimeMetaAds color={color} />}
        {subTab === 'temoos'  && <Temoos color={color} />}
        {subTab === 'retorno' && <RetornoInvestimento color={color} />}
      </motion.div>
    </div>
  )
}
