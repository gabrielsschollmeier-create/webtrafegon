import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, CheckCircle2, Circle, Clock } from 'lucide-react'

/* ── Formatadores ─────────────────────────────── */
const R  = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const R2 = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const N  = n => new Intl.NumberFormat('pt-BR').format(n)

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
    n: 4, nome: 'Breakeven', periodo: 'Ago/2026', status: 'done', icon: '⚡',
    contratos: 45, mrr: 11280,
    destaque: '45 contratos e R$11.280/mês — meta de 36 superada. Operação positiva no mês (+R$3.450) e ciclo acumulado no positivo (+R$7.389).',
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
  meses: ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
  marcas: {
    juntos: {
      nome: 'Juntos', icon: '⚫', cor: '#a78bfa',
      clientes: 45, mediaMes: 6.4, mrr: 11280,
      setup: 20991, mensalidades: 48303, receita: 69294,
      midia: 31728, agencia: 19782, variavel: 10395, custo: 61905,
      acumulado: 7389,
      midiaMes: 4533, agenciaMesVal: 3297, custoMes: 9315, mensal: 3450,
      novos:      [8, 6, 10, 2, 3, 8, 8],
      mrrMes:     [2736, 3832, 6137, 6546, 7144, 9128, 11280],
      receitaAcc: [9577, 14219, 25266, 31812, 39956, 53537, 69294],
      investAcc:  [9075, 18267, 27448, 36229, 46180, 56277, 61905],
      resultMes:  [502, -4550, 1866, -2235, -1807, 3484, 10126],
    },
    intime: {
      nome: 'Intime ERP', icon: '🔵', cor: '#60a5fa',
      clientes: 17, mediaMes: 2.4, mrr: 6680,
      setup: 20991, mensalidades: 28790, receita: 49781,
      midia: 12167, agencia: 9891, variavel: 7468, custo: 29526,
      acumulado: 20255,
      midiaMes: 1738, agenciaMesVal: 1649, custoMes: 4454, mensal: 3293,
      novos:      [4, 1, 5, 0, 1, 3, 3],
      mrrMes:     [2140, 2390, 3960, 3960, 4260, 5400, 6680],
      receitaAcc: [8981, 12181, 21051, 25011, 30271, 39291, 49781],
      investAcc:  [4589, 8635, 13429, 17556, 21810, 26634, 29526],
      resultMes:  [4392, -846, 4076, -167, 1006, 4196, 7595],
    },
    temoos: {
      nome: 'Temoos', icon: '🟢', cor: '#6eda2c',
      clientes: 28, mediaMes: 4.0, mrr: 4600,
      setup: 0, mensalidades: 19513, receita: 19513,
      midia: 19561, agencia: 9891, variavel: 2927, custo: 32379,
      acumulado: -12866,
      midiaMes: 2794, agenciaMesVal: 1649, custoMes: 4443, mensal: 157,
      novos:      [4, 5, 5, 2, 2, 5, 5],
      mrrMes:     [596, 1442, 2177, 2586, 2884, 3728, 4600],
      receitaAcc: [596, 2038, 4215, 6801, 9685, 14246, 19513],
      investAcc:  [4486, 9632, 14019, 18673, 24370, 29643, 32379],
      resultMes:  [-3890, -3704, -2210, -2068, -2813, -712, 2531],
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
            Retorno x Investimento · Fev–Ago 2026
          </p>
          <p className="text-white text-xl font-black mb-1">A operação já se paga mês a mês.</p>
          <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 620 }}>
            O acumulado carrega o custo de construir a base do zero. O resultado mensal mostra como a operação está hoje —
            com {J.clientes} clientes e {R(J.mrr)}/mês de recorrência já ativa.
          </p>
          <div className="flex flex-wrap gap-8">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Resultado acumulado</p>
              <p className="text-3xl font-black" style={{ color: J.acumulado >= 0 ? '#8fd6a8' : '#f0a37f' }}>{J.acumulado >= 0 ? '+' : '−'}{R(Math.abs(J.acumulado))}</p>
              <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{J.acumulado >= 0 ? 'investimento recuperado — no positivo' : '98% do investido recuperado'}</p>
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
          O custo total de <strong className="text-text">{R(J.custo)}</strong> inclui <strong className="text-text">{R(J.variavel)} de custo variável</strong> (15% sobre o vendido)
          — despesa interna de operação e entrega, <strong className="text-text">não</strong> valor pago à agência ou às plataformas de mídia.
        </p>

        {(() => {
          const invMkt = J.midia + J.agencia
          const sobra = J.receita - invMkt
          const roi = (sobra / invMkt * 100)
          const pos = sobra >= 0
          return (
            <div className="rounded-xl p-4 mb-3" style={{ background: '#6eda2c0a', border: '1px solid #6eda2c30' }}>
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">Olhando apenas o investimento em marketing</p>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
                <div>
                  <p className="text-[10px] text-muted">Mídia + agência</p>
                  <p className="text-lg font-black text-text">{R(invMkt)}</p>
                  <p className="text-[9px] text-muted">{R(J.midia)} + {R(J.agencia)}</p>
                </div>
                <span className="text-xl text-muted font-black">→</span>
                <div>
                  <p className="text-[10px] text-muted">Receita gerada</p>
                  <p className="text-lg font-black" style={{ color: '#6eda2c' }}>{R(J.receita)}</p>
                  <p className="text-[9px] text-muted">setup + mensalidades</p>
                </div>
                <span className="text-xl text-muted font-black">=</span>
                <div>
                  <p className="text-[10px] text-muted">Sobra</p>
                  <p className="text-lg font-black" style={{ color: pos ? '#6eda2c' : '#ef4444' }}>{pos ? '+' : '−'}{R(Math.abs(sobra))}</p>
                  <p className="text-[9px] font-bold" style={{ color: pos ? '#6eda2c' : '#ef4444' }}>ROI de {pos ? '+' : '−'}{Math.abs(roi).toFixed(1)}%</p>
                </div>
              </div>
            </div>
          )
        })()}

        <p className="text-[12px] font-bold" style={{ color: '#16a34a' }}>
          Ou seja: o dinheiro colocado em tráfego e gestão já voltou — e ainda deixou uma base recorrente de {R(J.mrr)}/mês rodando.
        </p>
      </div>

      {/* TABELA MENSAL */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">📅 Mês a mês — {m.nome}</p>
          <p className="text-[10px] text-muted mt-0.5">O custo fica estável e a receita sobe, porque a mensalidade acumula: quem assinou continua pagando.</p>
          {m.provisorioAgo && (
            <p className="text-[10px] font-bold mt-1" style={{ color: '#ea8a29' }}>⚠️ Agosto provisório (repetido de julho) — dados reais do Intime serão lançados em breve.</p>
          )}
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
          <div className="rounded-xl p-3.5" style={{ background: (J.acumulado >= 0 ? '#6eda2c08' : '#ea8a2908'), border: `1px solid ${J.acumulado >= 0 ? '#6eda2c28' : '#ea8a2928'}` }}>
            <p className="text-xs font-extrabold text-text mb-1">{J.acumulado >= 0 ? '✅ No acumulado — já virou positivo' : '📉 No acumulado — falta pouco'}</p>
            <p className="text-[11px] text-muted">
              {R(J.receita)} de retorno contra {R(J.custo)} investidos = <strong style={{ color: J.acumulado >= 0 ? '#16a34a' : '#ea8a29' }}>{J.acumulado >= 0 ? '+' : '−'}{R(Math.abs(J.acumulado))}</strong>.
              {J.acumulado >= 0 ? ' Todo o investido já voltou e o saldo virou positivo.' : ' É 2% do investido: 98% já voltou.'}
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
            {J.acumulado >= 0
              ? '🎯 O projeto já pagou todo o investimento e virou positivo — daqui pra frente cada mês é lucro sobre uma estrutura já paga.'
              : '🎯 Mantendo o ritmo, o projeto inteiro vira positivo no próximo mês — e a partir daí cada mês é lucro sobre uma estrutura já paga.'}
          </p>
        </div>
        <p className="text-[10px] text-muted mt-3">
          Mídia total no período — Temoos {R(RI.marcas.temoos.midia)}, Intime {R(RI.marcas.intime.midia)}. Modelo sem churn. Ago parcial (até 20/08).
        </p>
      </div>
    </div>
  )
}

/* ── ABA: 1º CICLO TEMOOS (fev–ago 2026) ───────── */
const CICLO = {
  meses: ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
  fechamentos: [4, 5, 5, 2, 2, 5, 5],
  mrrAcum: [596, 1442, 2177, 2586, 2884, 3728, 4600],
  ticketMes: [149, 169, 147, 205, 149, 169, 175],
  // mídia (planilhas Meta)
  gasto: 19561, impressoes: 747105, alcance: 440877, cpm: 26.18, freq: 1.69,
  contatos: 1378, cpl: 14.20,
  // funil
  mql: 144, vendas: 28,
  // vendas
  ticket: 164, mrr: 4600, faturamento: 19513, avista: 2000,
  // financeiro
  cac: 699, payback: 4.3, ltvcac: 2.8,
  // macro (com custo da agência = metade de R$3.297/mês × 6 meses)
  agencia: 9891, variavel: 2927, custoTotal: 32379, resultadoCiclo: -12866,
  agenciaMes: 1649, variavelMes: 690, recorrenteMes: 2261,
}

function GraficoCiclo({ dados }) {
  const W = 820, H = 260, P = { l: 54, r: 16, t: 16, b: 28 }
  const maxMrr = Math.max(...dados.mrrAcum) * 1.12
  const maxVend = Math.max(...dados.fechamentos)
  const px = i => P.l + (W - P.l - P.r) * (i / (dados.meses.length - 1))
  const py = v => H - P.b - (H - P.t - P.b) * (v / maxMrr)
  const bw = 30
  const linha = dados.mrrAcum.map((v, i) => `${px(i)},${py(v)}`).join(' ')
  const area = `${px(0)},${py(0)} ${linha} ${px(dados.meses.length - 1)},${py(0)}`
  return (
    <div style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', minWidth: 480, height: 'auto', display: 'block' }} role="img" aria-label="MRR acumulado e vendas por mês">
        {[0, 1, 2, 3].map(g => {
          const v = maxMrr * g / 3, y = py(v)
          return (<g key={g}>
            <line x1={P.l} y1={y} x2={W - P.r} y2={y} stroke="#eef0f7" strokeWidth="1" />
            <text x={P.l - 7} y={y + 4} textAnchor="end" fontSize="10" fill="#8890b5" fontFamily="ui-monospace,monospace">{`R$${Math.round(v / 1000)}k`}</text>
          </g>)
        })}
        {dados.meses.map((m, i) => {
          const bh = (H - P.t - P.b) * 0.4 * (dados.fechamentos[i] / maxVend)
          return (<g key={m}>
            <rect x={px(i) - bw / 2} y={H - P.b - bh} width={bw} height={bh} rx="3" fill="#6eda2c" opacity="0.32" />
            <text x={px(i)} y={H - P.b - bh - 4} textAnchor="middle" fontSize="10" fontWeight="700" fill="#4a9e1f" fontFamily="ui-monospace,monospace">{dados.fechamentos[i]}</text>
            <text x={px(i)} y={H - P.b + 17} textAnchor="middle" fontSize="10" fill="#8890b5" fontFamily="ui-monospace,monospace">{m}</text>
          </g>)
        })}
        <polygon points={area} fill="#6eda2c" opacity="0.10" />
        <polyline points={linha} fill="none" stroke="#2c7d52" strokeWidth="3" strokeLinejoin="round" />
        {dados.mrrAcum.map((v, i) => <circle key={i} cx={px(i)} cy={py(v)} r="4" fill="#2c7d52" stroke="#fff" strokeWidth="2" />)}
        <text x={W - P.r} y={py(dados.mrrAcum[dados.meses.length - 1]) - 9} textAnchor="end" fontSize="12" fontWeight="700" fill="#2c7d52" fontFamily="ui-monospace,monospace">{R(dados.mrr)}/mês</text>
      </svg>
    </div>
  )
}

function CicloTemoos({ color }) {
  const c = CICLO
  const box = { boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }
  const Sec = ({ n, t, sub }) => (
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-[11px] font-black text-white rounded-md px-2 py-0.5" style={{ background: '#2c7d52' }}>{n}</span>
      <p className="text-sm font-extrabold text-text">{t}</p>
      {sub && <p className="text-[10px] text-muted">{sub}</p>}
    </div>
  )
  return (
    <div className="space-y-5">
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #10281a 0%, #17381f 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 82% 15%, #6eda2c22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#8fd6a8' }}>Temoos · 1º Ciclo · Fev → Ago 2026</p>
          <p className="text-white text-xl font-black mb-1" style={{ maxWidth: 620 }}>A mídia se pagou e deixou R$ 4.600/mês de recorrência.</p>
          <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 620 }}>
            Investimos R$ 19.561 em anúncio e fechamos 28 clientes. O caixa gerado empatou o investido — e ficou uma base recorrente crescendo todo mês.
          </p>
          <div className="flex flex-wrap gap-8">
            {[['28', 'clientes fechados', '#fff'], [R(c.mrr) + '/mês', 'recorrência ativa', '#8fd6a8'], [R(c.faturamento), 'faturamento', '#fff'], ['2,0%', 'lead → venda', '#8fd6a8']].map(([v, l, col]) => (
              <div key={l}><p className="text-3xl font-black" style={{ color: col }}>{v}</p><p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 1. CAMPANHAS */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="1" t="As campanhas" sub="o que o investimento em anúncio gerou" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
          {[['💵', 'Investido', R(c.gasto), '#ef4444'], ['👁️', 'Impressões', (c.impressoes / 1000).toFixed(0) + 'k', '#a78bfa'], ['📡', 'Alcance', (c.alcance / 1000).toFixed(0) + 'k', '#60a5fa'], ['📊', 'CPM', R2(c.cpm), '#ea8a29'], ['💬', 'Leads', N(c.contatos), '#6eda2c'], ['🎯', 'Custo/lead', R2(c.cpl), '#2c7d52']].map(([ic, l, v, col]) => (
            <div key={l} className="rounded-xl p-3" style={{ background: col + '0d', border: `1px solid ${col}22` }}>
              <span className="text-base">{ic}</span>
              <p className="text-lg font-black leading-none mt-1" style={{ color: col }}>{v}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted mt-1">{l}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">Cada lead custou <strong className="text-text">{R2(c.cpl)}</strong> — barato. O anúncio entregou <strong className="text-text">{N(c.contatos)} pessoas</strong> conversando no WhatsApp em 7 meses.</p>
      </div>

      {/* 2. FUNIL */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="2" t="O funil — do contato à venda" sub="como o lead vira cliente" />
        <div className="space-y-2 mt-3">
          {[['Leads', c.contatos, 100, '#a78bfa', 'pessoas que responderam ao anúncio'], ['Qualificados (MQL)', c.mql, 60, '#ea8a29', 'passaram pela qualificação'], ['Vendas', c.vendas, 32, '#6eda2c', 'fecharam contrato']].map(([l, val, w, col, desc], i) => (
            <div key={l}>
              <div className="rounded-xl px-4 py-2.5 flex items-center justify-between" style={{ width: `${w}%`, minWidth: 200, background: col + '18', border: `1.5px solid ${col}44` }}>
                <span className="text-[11px] font-extrabold" style={{ color: col }}>{l}</span>
                <span className="text-base font-black" style={{ color: col }}>{N(val)}</span>
              </div>
              {i < 2 && <p className="text-[10px] text-muted px-2 py-1">{i === 0 ? '↓ 10,5% qualificam' : '↓ 19,4% dos qualificados fecham'} · {desc}</p>}
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 mt-3" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
          <p className="text-[11px] text-muted">⚠️ <strong className="text-text">A fase de qualificação (MQL) só começou a ser medida corretamente nos últimos 2 meses</strong> — antes essa etapa não existia no processo. Por isso a taxa acumulada (10,5%) está subestimada: em jul (21,7%) e ago (25,6%), com a medição certa, ela já é bem maior.</p>
        </div>
      </div>

      {/* 3. VENDAS */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="3" t="As vendas" sub="28 clientes, faturamento crescendo mês a mês" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
          {[['Fechamentos', '28', '#6eda2c'], ['Ticket médio', R(c.ticket), '#ea8a29'], ['MRR ativo', R(c.mrr) + '/mês', '#2c7d52'], ['À vista (caixa)', R(c.avista), '#60a5fa']].map(([l, v, col]) => (
            <div key={l} className="rounded-xl p-3" style={{ background: col + '0d', border: `1px solid ${col}22` }}>
              <p className="text-xl font-black" style={{ color: col }}>{v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-0.5">{l}</p>
            </div>
          ))}
        </div>
        <GraficoCiclo dados={c} />
        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#6eda2c' }} /> vendas no mês</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: '#2c7d52' }} /> faturamento recorrente acumulado</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <div className="rounded-xl p-3" style={{ background: '#6eda2c08', border: '1px solid #6eda2c25' }}>
            <p className="text-[11px] text-muted">🏆 <strong className="text-text">Melhores meses em volume:</strong> julho e agosto (5 vendas cada) — os mais recentes, mostrando aceleração.</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
            <p className="text-[11px] text-muted">💎 <strong className="text-text">Melhor ticket médio:</strong> agosto (R$ 175) entre os meses de alto volume. O MRR cresceu 7,7× (R$ 596 → R$ 4.600).</p>
          </div>
        </div>
      </div>

      {/* 4. VISÃO MACRO (com custo da agência) */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="4" t="Visão macro — o ciclo completo" sub="somando mídia + agência (metade) + custo variável" />
        <div className="rounded-xl p-3 mt-3 mb-3" style={{ background: '#60a5fa08', border: '1px solid #60a5fa22' }}>
          <p className="text-[11px] text-muted">Até aqui olhamos só a mídia. Aqui entra o <strong className="text-text">custo real da operação</strong>: além do anúncio, a agência custa R$ 3.297/mês — <strong className="text-text">metade (R$ 1.649)</strong> é alocada ao Temoos — mais 15% de custo variável sobre o vendido.</p>
        </div>
        {/* Retrovisor: o que foi investido para montar a operação */}
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">🔙 O ciclo até hoje (retrovisor)</p>
        <div className="space-y-1.5">
          {[['Mídia (anúncios)', c.gasto, '#ef4444'], ['Agência — metade (6 meses)', c.agencia, '#ea8a29'], ['Custo variável (15%)', c.variavel, '#a78bfa']].map(([l, v, col]) => (
            <div key={l} className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: col + '0c' }}>
              <span className="text-muted">{l}</span><span className="font-bold" style={{ color: col }}>− {R(v)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#1a1d2e08' }}>
            <span className="font-bold text-text">Custo total do ciclo</span><span className="font-black text-text">− {R(c.custoTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#6eda2c12' }}>
            <span className="text-muted">Receita em caixa (mensalidades + à vista)</span><span className="font-bold" style={{ color: '#2c7d52' }}>+ {R(c.faturamento)}</span>
          </div>
          <div className="flex items-center justify-between text-sm px-3 py-2 rounded-lg" style={{ background: '#ef444412', border: '1px solid #ef444430' }}>
            <span className="font-extrabold text-text">Resultado acumulado do ciclo</span><span className="font-black" style={{ color: '#dc2626' }}>{R(c.resultadoCiclo)}</span>
          </div>
        </div>
        {/* Para-brisa: a base recorrente daqui pra frente */}
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-4 mb-2">🔜 A base já instalada se sustenta (para-brisa)</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#6eda2c12' }}>
            <span className="text-muted">MRR ativo (recorrência instalada)</span><span className="font-bold" style={{ color: '#2c7d52' }}>+ {R(c.mrr)}/mês</span>
          </div>
          {[['Agência — metade', c.agenciaMes], ['Custo variável (15% do MRR)', c.variavelMes]].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#ea8a290c' }}>
              <span className="text-muted">{l}</span><span className="font-bold" style={{ color: '#ea8a29' }}>− {R(v)}/mês</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm px-3 py-2 rounded-lg" style={{ background: '#6eda2c14', border: '1px solid #6eda2c40' }}>
            <span className="font-extrabold text-text">Resultado recorrente</span><span className="font-black" style={{ color: '#2c7d52' }}>+ {R(c.recorrenteMes)}/mês</span>
          </div>
        </div>
        <div className="rounded-xl p-3 mt-3" style={{ background: '#6eda2c08', border: '1px solid #6eda2c25' }}>
          <p className="text-[11px] text-muted">📌 <strong className="text-text">Como ler:</strong> os {R(Math.abs(c.resultadoCiclo))} foram o <strong className="text-text">investimento único para validar o produto e montar a operação do zero</strong> — não se repete. A partir daqui a base recorrente <strong className="text-text">já se sustenta sozinha</strong> (cobre agência + variável e ainda sobra ~{R(c.recorrenteMes)}/mês). E o mais importante: com o <strong className="text-text">funil validado</strong> (lead a {R2(c.cpl)}, 2% de conversão), <strong className="text-text">seguir investindo em mídia agora é crescimento previsível</strong> — cada novo cliente se paga em ~{c.payback} meses e depois vira margem recorrente sobre uma estrutura já paga. É a hora de acelerar a mídia, não de frear.</p>
        </div>
      </div>

      {/* 5. MERCADO */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="5" t="Como estamos vs. o mercado" sub="benchmarks de SaaS B2B" />
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm" style={{ minWidth: 460 }}>
            <thead><tr style={{ background: '#f7f8fc' }}>
              {['Métrica', 'Temoos', 'Mercado', ''].map(h => <th key={h} className="text-left px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>)}
            </tr></thead>
            <tbody>
              {[['Lead → Venda (geral)', '2,0%', '1% – 5% (méd. ~2,4%)', '✅ na média'], ['Canal paid social', '2,0%', '0,9% (B2B)', '🟢 2× acima'], ['MQL → Venda', '19,4%', '5% – 15%', '🟢 acima'], ['Payback do CAC', '4,3 meses', '< 12 meses', '✅ bom']].map(([m, t, mk, v]) => (
                <tr key={m} style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-3 py-2.5 font-bold text-text text-[13px]">{m}</td>
                  <td className="px-3 py-2.5 font-extrabold text-[13px]" style={{ color }}>{t}</td>
                  <td className="px-3 py-2.5 text-muted text-[13px]">{mk}</td>
                  <td className="px-3 py-2.5 font-bold text-[12px]" style={{ color: '#16a34a' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted mt-3">Paid social é o canal que <strong className="text-text">menos converte</strong> no mercado (0,9% no B2B) — e o Temoos está <strong className="text-text">acima do dobro</strong>. Quando o lead qualifica, o time fecha quase 1 em 5, <strong className="text-text">acima do benchmark</strong>.</p>
        <div className="rounded-lg p-2.5 mt-2" style={{ background: '#ea8a2908', border: '1px solid #ea8a2920' }}>
          <p className="text-[10px] text-muted">⚠️ <strong className="text-text">Ressalva:</strong> são benchmarks <strong className="text-text">EUA/globais</strong> — não há base pública de SaaS específica do Brasil. O Temoos é ticket baixo e vende no WhatsApp (motion diferente do B2B SaaS americano típico), então servem como <strong className="text-text">norte direcional</strong>, não parâmetro exato. O achado estrutural (paid social = canal mais fraco) vale globalmente.</p>
        </div>
        <p className="text-[9px] text-muted mt-2">
          fontes:{' '}
          <a href="https://martal.ca/conversion-rate-statistics-lb/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>Martal</a>{' · '}
          <a href="https://thedigitalbloom.com/learn/pipeline-performance-benchmarks-2025/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>The Digital Bloom</a>{' · '}
          <a href="https://firstpagesage.com/reports/conversion-rate-by-channel/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>First Page Sage (canal)</a>{' · '}
          <a href="https://pixelswithin.com/b2b-saas-conversion-benchmarks-2026/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>PixelsWithin</a>{' · 2025-2026'}
        </p>
      </div>

      {/* 6. DORES DOS CLIENTES */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="6" t="Dores dos clientes que fecharam" sub="por que buscaram um sistema — nas palavras deles (34 de 42 conversas lidas)" />

        {/* Perfil de quem compra */}
        <div className="rounded-xl p-3 mt-3" style={{ background: '#f7f8fc', border: '1px solid #eef0f7' }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">👥 Perfil de quem compra</p>
          <div className="flex h-6 rounded-lg overflow-hidden mb-1.5" style={{ maxWidth: 340 }}>
            <div className="flex items-center justify-center text-[10px] font-black text-white" style={{ width: '77%', background: '#60a5fa' }}>77% homens</div>
            <div className="flex items-center justify-center text-[10px] font-black text-white" style={{ width: '23%', background: '#ec4899' }}>23%</div>
          </div>
          <p className="text-[10px] text-muted">23 homens · 7 mulheres (dos 30 identificáveis; 12 são nº de telefone ou nome de negócio). Público majoritariamente masculino — donos de bar/restaurante.</p>
        </div>

        <div className="space-y-2.5 mt-3">
          {[
            ['1', '🍽️', 'Não consigo tirar pedido na mesa', '≈8', 'QR Code / garçom — usam só o caixa ou anotam à mão', '“Meu forte é mesas… pra mim seria melhor QR code… feita a mãos” — Reginaldo', 'QR Code na mesa, sem garçom parado', '#6eda2c'],
            ['2', '🔧', 'Meu sistema atual falha e eu perco venda', '3', 'a dor mais quente — está perdendo dinheiro agora', '“se as coisas não funcionarem… não posso ter esse transtorno! Não faturo…” — Jéssica Rosa', 'Estável, não te deixa na mão no movimento', '#ef4444'],
            ['3', '🔄', 'Já uso um concorrente e quero trocar', '≈4', 'medo de perder função na troca', '“se vc oferece tudo o que tenho hj e mais o pedido de garçom, vou fechar” — lead migração', 'Tudo que você já tem + pedido na mesa', '#60a5fa'],
            ['4', '🚀', 'Estou abrindo / expandindo agora', '3', 'negócio novo — suporte pesa mais que preço', '“vamos abrir sexta… tem suporte? Vocês ensinam mexer?” — Deka', 'A gente implanta e treina sua equipe', '#ea8a29'],
            ['5', '🧾', 'Cresci e preciso de nota / CPF', '1', 'saiu do MEI — nicho específico', '“não é mais MEI. Clientes pedindo CPF na nota. Quero um sistema completo” — Jandilene', 'Sistema completo com emissão de nota', '#a78bfa'],
          ].map(([n, ic, t, qtd, ctx, fala, bater, col]) => (
            <div key={n} className="rounded-xl p-3.5" style={{ background: col + '08', border: `1px solid ${col}22` }}>
              <div className="flex items-start gap-3">
                <span className="text-[11px] font-black text-white rounded-md px-1.5 py-0.5 mt-0.5 shrink-0" style={{ background: col }}>{n}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-extrabold text-text">{ic} {t}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: col + '18', color: col }}>{qtd} clientes</span>
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">{ctx}</p>
                  <p className="text-[11px] italic text-muted mt-1.5 pl-2" style={{ borderLeft: `2px solid ${col}55` }}>{fala}</p>
                  <p className="text-[11px] mt-1.5"><span className="font-bold" style={{ color: col }}>🎯 Como bater:</span> <span className="text-text">{bater}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 mt-3" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
          <p className="text-[11px] text-muted">⚠️ <strong className="text-text">Alerta (motivo de perda):</strong> 1 cliente desistiu por rigidez de processo — <span className="italic">“altíssima sistemática de vcs… sem levar em conta minha disponibilidade”</span>. Vale flexibilizar a agenda de implantação.</p>
        </div>
      </div>

      {/* 7. INSIGHTS */}
      <div>
        <p className="text-sm font-extrabold text-text mb-1">💡 Insights do ciclo</p>
        <p className="text-[10px] text-muted mb-3">o que aprendemos e para onde ir</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['💰', 'A mídia se pagou', 'R$ 19.561 investidos → R$ 19.513 de caixa em 7 meses. Empatou e deixou R$ 4.600/mês rodando. Daqui pra frente é lucro.', '#6eda2c'],
            ['🎯', 'O gargalo é a entrada, não o time', 'Só ~10% dos contatos qualificam (muito lead fora do perfil), mas o time fecha 19% dos qualificados. Melhorar a segmentação sobe tudo.', '#ea8a29'],
            ['🏷️', 'Ticket é a alavanca #1', 'CAC R$ 699 vs ticket R$ 164 = payback 4,3 meses. Subir para ~R$ 220 melhora a conta sem gastar mais mídia.', '#60a5fa'],
            ['⚡', 'Pagamento à vista acelera caixa', 'Patrick e Marga trouxeram R$ 2.000 antecipados. Plano anual à vista com desconto adianta o fluxo de caixa.', '#a78bfa'],
            ['📈', 'Trajetória de aceleração', 'MRR cresceu 7,7× sem queda em nenhum mês. Vale de mai/jun (2 vendas) recuperado forte em jul/ago (5/mês).', '#2c7d52'],
            ['🔧', 'Processo sendo estruturado agora', 'A qualificação (MQL) e o registro do funil passaram a ser medidos direito nos últimos 2 meses. O 1º ciclo validou o produto; agora estruturamos para escalar.', '#8b5cf6'],
          ].map(([ic, t, p, col]) => (
            <div key={t} className="rounded-xl p-3.5" style={{ background: '#fff', border: `1px solid ${col}28`, borderTop: `3px solid ${col}`, boxShadow: '0 2px 8px rgba(26,29,46,0.05)' }}>
              <p className="text-xs font-extrabold text-text mb-1 flex items-center gap-2"><span>{ic}</span>{t}</p>
              <p className="text-[11px] text-muted">{p}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-muted px-1">
        Fontes: mídia = planilhas Meta Ads do Temoos · vendas = lista oficial de fechamentos de anúncio (28) · funil = CRM on360 · à vista contabilizado como R$ 167/mês de MRR + caixa · faturamento assume retenção 100% · agência = R$ 3.297/mês ÷ 2 (6 meses) alocada ao Temoos · ago parcial (até 20/08).
      </p>
    </div>
  )
}

/* ── ABA: 1º CICLO INTIME (fev–ago 2026) ───────── */
const CICLO_INTIME = {
  meses: ['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago'],
  fechamentos: [4, 1, 5, 0, 1, 3, 3],
  mrrAcum: [2140, 2390, 3960, 3960, 4260, 5400, 6680],
  ticketMes: [535, 250, 314, 0, 300, 380, 427],
  // mídia (planilhas Meta Ads da Intime)
  gasto: 12167, impressoes: 362863, alcance: 193826, cpm: 33.53, freq: 1.87,
  contatos: 615, cpl: 19.78,
  // funil (CRM on360 — todas as origens)
  crmLeads: 690, crmQualif: 183, crmVenda: 47,
  // vendas (tráfego)
  vendas: 17, ticket: 393, mrr: 6680, faturamento: 49781, setup: 20991,
  // financeiro — só mídia (comparável com o ciclo Temoos)
  cac: 716, payback: 1.8, ltvcac: 3.8,
  // financeiro — com metade da agência (custo real)
  cacAg: 1395, paybackAg: 3.5, ltvcacAg: 2.0,
  // macro (mídia + metade da agência 6 meses + 15% variável)
  agencia: 9891, variavel: 7468, custoTotal: 29526, resultadoCiclo: 20255,
  agenciaMes: 1649, variavelMes: 1002, recorrenteMes: 4029,
}

function CicloIntime({ color = '#2563eb' }) {
  const c = CICLO_INTIME
  const box = { boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }
  const Sec = ({ n, t, sub }) => (
    <div className="flex items-baseline gap-2 mt-1">
      <span className="text-[11px] font-black text-white rounded-md px-2 py-0.5" style={{ background: color }}>{n}</span>
      <p className="text-sm font-extrabold text-text">{t}</p>
      {sub && <p className="text-[10px] text-muted">{sub}</p>}
    </div>
  )
  return (
    <div className="space-y-5">
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d1729 0%, #14245a 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 82% 15%, #60a5fa22 0%, transparent 60%)' }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: '#9dc0f7' }}>Intime · 1º Ciclo · Fev → Ago 2026</p>
          <p className="text-white text-xl font-black mb-1" style={{ maxWidth: 640 }}>A mídia se pagou, o ciclo virou positivo e deixou R$ 6.680/mês de recorrência.</p>
          <p className="text-[11px] mb-4" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 640 }}>
            R$ 12.167 em anúncio → 17 clientes de tráfego. O caixa gerado já superou tudo que foi investido (mídia + agência) — e ficou uma base recorrente crescendo mês a mês.
          </p>
          <div className="flex flex-wrap gap-8">
            {[['17', 'clientes de tráfego', '#fff'], [R(c.mrr) + '/mês', 'recorrência ativa', '#9dc0f7'], [R(c.faturamento), 'faturamento do ciclo', '#fff'], ['2,76%', 'lead → venda (tráfego)', '#9dc0f7']].map(([v, l, col]) => (
              <div key={l}><p className="text-3xl font-black" style={{ color: col }}>{v}</p><p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.5)' }}>{l}</p></div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 1. CAMPANHAS */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="1" t="As campanhas" sub="o que o investimento em anúncio gerou" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
          {[['💵', 'Investido', R(c.gasto), '#ef4444'], ['👁️', 'Impressões', (c.impressoes / 1000).toFixed(0) + 'k', '#a78bfa'], ['📡', 'Alcance', (c.alcance / 1000).toFixed(0) + 'k', '#60a5fa'], ['🔁', 'Frequência', c.freq.toFixed(2), '#ea8a29'], ['💬', 'Leads', N(c.contatos), '#6eda2c'], ['🎯', 'Custo/lead', R2(c.cpl), '#2563eb']].map(([ic, l, v, col]) => (
            <div key={l} className="rounded-xl p-3" style={{ background: col + '0d', border: `1px solid ${col}22` }}>
              <span className="text-base">{ic}</span>
              <p className="text-lg font-black leading-none mt-1" style={{ color: col }}>{v}</p>
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted mt-1">{l}</p>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted mt-3">Cada lead custou <strong className="text-text">{R2(c.cpl)}</strong> — barato e estável em 7 meses. ⚠️ A <strong className="text-text">frequência subiu (1,68 → 2,11)</strong>: sinal de saturação de público — hora de renovar criativo e/ou ampliar público.</p>
      </div>

      {/* 2. FUNIL */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="2" t="O funil — do lead à venda" sub="CRM (todas as origens) + o recorte do tráfego" />
        <div className="space-y-2 mt-3">
          {[['Leads', c.crmLeads, 100, '#a78bfa'], ['Qualificados', c.crmQualif, 42, '#ea8a29'], ['Vendas', c.crmVenda, 22, '#6eda2c']].map(([l, val, w, col], i) => (
            <div key={l}>
              <div className="rounded-xl px-4 py-2.5 flex items-center justify-between" style={{ width: `${w}%`, minWidth: 200, background: col + '18', border: `1.5px solid ${col}44` }}>
                <span className="text-[11px] font-extrabold" style={{ color: col }}>{l}</span>
                <span className="text-base font-black" style={{ color: col }}>{N(val)}</span>
              </div>
              {i < 2 && <p className="text-[10px] text-muted px-2 py-1">{i === 0 ? '↓ 26,5% qualificam' : '↓ 25,7% dos qualificados fecham'}</p>}
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 mt-3" style={{ background: '#2563eb08', border: '1px solid #2563eb25' }}>
          <p className="text-[11px] text-muted">🎯 <strong className="text-text">Recorte só do tráfego:</strong> os {N(c.contatos)} leads de Meta geraram as {c.vendas} vendas de anúncio = <strong className="text-text">2,76% de lead→venda</strong>. O CRM acima soma todas as origens (inclui indicação). As taxas de qualificação e fechamento estão <strong className="text-text">acima da média do mercado</strong> (ver seção 5).</p>
        </div>
      </div>

      {/* 3. VENDAS */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="3" t="As vendas" sub="17 clientes de tráfego, faturamento crescendo mês a mês" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 my-3">
          {[['Fechamentos', '17', '#6eda2c'], ['Ticket médio', R(c.ticket), '#ea8a29'], ['MRR ativo', R(c.mrr) + '/mês', '#2563eb'], ['Setup (caixa)', R(c.setup), '#60a5fa']].map(([l, v, col]) => (
            <div key={l} className="rounded-xl p-3" style={{ background: col + '0d', border: `1px solid ${col}22` }}>
              <p className="text-xl font-black" style={{ color: col }}>{v}</p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted mt-0.5">{l}</p>
            </div>
          ))}
        </div>
        <GraficoCiclo dados={c} />
        <div className="flex items-center gap-4 mt-2 text-[10px] text-muted">
          <span className="flex items-center gap-1"><span className="w-3 h-2 rounded-sm inline-block" style={{ background: '#60a5fa' }} /> vendas no mês</span>
          <span className="flex items-center gap-1"><span className="w-3 h-0.5 inline-block" style={{ background: '#2563eb' }} /> recorrência acumulada</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-3">
          <div className="rounded-xl p-3" style={{ background: '#6eda2c08', border: '1px solid #6eda2c25' }}>
            <p className="text-[11px] text-muted">🏆 <strong className="text-text">Aceleração recente:</strong> Jun+Jul+Ago = 7 vendas (40% de todo o setup e MRR do ciclo nos últimos 90 dias). Maio foi o único mês zerado — coincide com o colapso do atendimento.</p>
          </div>
          <div className="rounded-xl p-3" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
            <p className="text-[11px] text-muted">💎 <strong className="text-text">Ticket em alta:</strong> agosto trouxe os maiores (Ricardo R$490, Antonio R$540). Ticket médio R$ 393 — acima da média da carteira.</p>
          </div>
        </div>
      </div>

      {/* 4. VISÃO MACRO */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="4" t="Visão macro — o ciclo completo" sub="mídia + agência (metade) + custo variável" />
        <div className="rounded-xl p-3 mt-3 mb-3" style={{ background: '#60a5fa08', border: '1px solid #60a5fa22' }}>
          <p className="text-[11px] text-muted">Além do anúncio, a agência custa R$ 3.297/mês — <strong className="text-text">metade (R$ 1.649)</strong> é alocada à Intime — mais 15% de custo variável sobre o vendido.</p>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">🔙 O ciclo até hoje (retrovisor)</p>
        <div className="space-y-1.5">
          {[['Mídia (anúncios)', c.gasto, '#ef4444'], ['Agência — metade (6 meses)', c.agencia, '#ea8a29'], ['Custo variável (15%)', c.variavel, '#a78bfa']].map(([l, v, col]) => (
            <div key={l} className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: col + '0c' }}>
              <span className="text-muted">{l}</span><span className="font-bold" style={{ color: col }}>− {R(v)}</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#1a1d2e08' }}>
            <span className="font-bold text-text">Custo total do ciclo</span><span className="font-black text-text">− {R(c.custoTotal)}</span>
          </div>
          <div className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#6eda2c12' }}>
            <span className="text-muted">Receita em caixa (setup + mensalidades)</span><span className="font-bold" style={{ color: '#2c7d52' }}>+ {R(c.faturamento)}</span>
          </div>
          <div className="flex items-center justify-between text-sm px-3 py-2 rounded-lg" style={{ background: '#6eda2c12', border: '1px solid #6eda2c40' }}>
            <span className="font-extrabold text-text">Resultado acumulado do ciclo</span><span className="font-black" style={{ color: '#16a34a' }}>+ {R(c.resultadoCiclo)}</span>
          </div>
        </div>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-4 mb-2">🔜 A base já instalada se sustenta (para-brisa)</p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#6eda2c12' }}>
            <span className="text-muted">MRR ativo (recorrência instalada)</span><span className="font-bold" style={{ color: '#2c7d52' }}>+ {R(c.mrr)}/mês</span>
          </div>
          {[['Agência — metade', c.agenciaMes], ['Custo variável (15% do MRR)', c.variavelMes]].map(([l, v]) => (
            <div key={l} className="flex items-center justify-between text-[13px] px-3 py-1.5 rounded-lg" style={{ background: '#ea8a290c' }}>
              <span className="text-muted">{l}</span><span className="font-bold" style={{ color: '#ea8a29' }}>− {R(v)}/mês</span>
            </div>
          ))}
          <div className="flex items-center justify-between text-sm px-3 py-2 rounded-lg" style={{ background: '#6eda2c14', border: '1px solid #6eda2c40' }}>
            <span className="font-extrabold text-text">Resultado recorrente</span><span className="font-black" style={{ color: '#2c7d52' }}>+ {R(c.recorrenteMes)}/mês</span>
          </div>
        </div>
        <div className="rounded-xl p-3 mt-3" style={{ background: '#6eda2c08', border: '1px solid #6eda2c25' }}>
          <p className="text-[11px] text-muted">📌 <strong className="text-text">Como ler:</strong> diferente do Temoos, a Intime <strong className="text-text">já fechou o ciclo no positivo (+{R(c.resultadoCiclo)})</strong> — a mídia e a agência já se pagaram e ainda sobrou. Com o funil validado (lead a {R2(c.cpl)}, taxas acima do mercado) e o <strong className="text-text">setup cobrindo 89% do CAC no dia 1</strong>, seguir investindo agora é crescimento previsível. É a hora de acelerar mídia e abrir canal (Google).</p>
        </div>
      </div>

      {/* 5. BENCHMARKS — TEMOOS x INTIME x MERCADO */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <Sec n="5" t="Benchmarks — Temoos x Intime x Mercado" sub="parâmetro de SaaS B2B no Brasil" />
        <div className="overflow-x-auto mt-3">
          <table className="w-full text-sm" style={{ minWidth: 560 }}>
            <thead><tr style={{ background: '#f7f8fc' }}>
              {['Métrica', 'Temoos', 'Intime', 'Mercado (Brasil)', ''].map(h => <th key={h} className="text-left px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>)}
            </tr></thead>
            <tbody>
              {[
                ['CPL', 'R$ 14,20', 'R$ 19,78', '—', ''],
                ['Ticket médio (MRR)', 'R$ 164', 'R$ 393', '—', '🔵 Intime 2,4×'],
                ['Lead → Venda (tráfego)', '2,0%', '2,76%', '2% – 5%', '✅ ambos na faixa'],
                ['Qualificado → Venda', '19,4%', '25,7%', '15% – 25%', '🟢 acima'],
                ['LTV / CAC (só mídia)', '2,8x', '3,8x', '> 3x saudável', '🟢 Intime saudável'],
                ['Payback do CAC (só mídia)', '4,3 meses', '1,8 mês', '< 12 meses', '✅ bom'],
              ].map(([m, t, it, mk, v]) => (
                <tr key={m} style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-3 py-2.5 font-bold text-text text-[13px]">{m}</td>
                  <td className="px-3 py-2.5 font-extrabold text-[13px]" style={{ color: '#6eda2c' }}>{t}</td>
                  <td className="px-3 py-2.5 font-extrabold text-[13px]" style={{ color: '#2563eb' }}>{it}</td>
                  <td className="px-3 py-2.5 text-muted text-[13px]">{mk}</td>
                  <td className="px-3 py-2.5 font-bold text-[12px]" style={{ color: '#16a34a' }}>{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted mt-3">As <strong className="text-text">duas marcas convertem acima do mercado</strong> — o time comercial é bom. A diferença é a <strong className="text-text">economia unitária</strong>: o Temoos traz lead barato mas o ticket baixo deixa o LTV/CAC apertado; a Intime tem lead um pouco mais caro, mas o ticket 2,4× maior deixa a conta saudável. <strong className="text-text">Leitura: Intime = acelerar; Temoos = subir ticket antes de acelerar.</strong></p>
        <div className="rounded-lg p-2.5 mt-2" style={{ background: '#ea8a2908', border: '1px solid #ea8a2920' }}>
          <p className="text-[10px] text-muted">⚠️ <strong className="text-text">Comparação justa:</strong> aqui o CAC das duas é <strong className="text-text">só mídia</strong>. Com a metade da agência dentro, o CAC da Intime sobe pra R$ 1.395 e o LTV/CAC fica em 2,0x — ainda assim, o setup médio (R$ 1.235) cobre 89% do CAC já na entrada.</p>
        </div>
        <p className="text-[9px] text-muted mt-2">
          fontes (Brasil):{' '}
          <a href="https://blog.datastone.com.br/blog/2025/09/04/benchmark-conversao-saas-b2b/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>Data Stone</a>{' · '}
          <a href="https://base.ohub.com.br/mkt/demanda-vendas-lifecycle/geracao-demanda/artigos/taxa-conversao-funil" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>oHub</a>{' · '}
          <a href="https://reev.co/flipchart-friday-benchmark-de-metricas-de-vendas/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color }}>Reev</a>{' · 2025'}
        </p>
      </div>

      {/* 6. INSIGHTS */}
      <div>
        <p className="text-sm font-extrabold text-text mb-1">💡 Insights do ciclo</p>
        <p className="text-[10px] text-muted mb-3">o que aprendemos e para onde ir</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            ['💰', 'A mídia já se pagou — com folga', 'R$ 12.167 de mídia → ciclo fechou em +R$ 20.255 (já descontada a metade da agência). Daqui pra frente é lucro sobre estrutura paga.', '#6eda2c'],
            ['🎯', 'O gargalo é a entrada, não o time', 'As taxas de qualificação e fechamento estão acima do mercado. Só 26,5% dos leads qualificam — melhorar velocidade e cadência sobe tudo.', '#ea8a29'],
            ['🏷️', 'Ticket alto é a força da Intime', 'R$ 393 de ticket (2,4× o Temoos) e setup cobrindo 89% do CAC no dia 1. Economia unitária saudável (LTV/CAC 3,8x só mídia).', '#2563eb'],
            ['📈', 'Aceleração real nos últimos 90 dias', 'Jun+Jul+Ago = 7 vendas e 40% do faturamento do ciclo. Saímos do MVP; a máquina está ligando.', '#2c7d52'],
            ['⚡', 'Frequência subindo pede criativo novo', 'Freq 1,68 → 2,11 = público saturando. Renovar criativo (novos roteiros) e abrir canal (Google) antes do CPL subir.', '#a78bfa'],
            ['🔧', 'Processo em estruturação', 'O 1º ciclo validou o produto e a conta fecha. Agora é documentar (cadência, SLA, fechamento) para escalar sem quebrar.', '#8b5cf6'],
          ].map(([ic, t, p, col]) => (
            <div key={t} className="rounded-xl p-3.5" style={{ background: '#fff', border: `1px solid ${col}28`, borderTop: `3px solid ${col}`, boxShadow: '0 2px 8px rgba(26,29,46,0.05)' }}>
              <p className="text-xs font-extrabold text-text mb-1 flex items-center gap-2"><span>{ic}</span>{t}</p>
              <p className="text-[11px] text-muted">{p}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-muted px-1">
        Fontes: mídia = planilhas Meta Ads da Intime (7 CSVs, fev–ago) · vendas = lista oficial de fechamentos de anúncio (17) · funil = CRM on360 · faturamento assume retenção 7 meses · agência = R$ 3.297/mês ÷ 2 (6 meses) alocada à Intime · ago parcial (até 20/08).
      </p>
    </div>
  )
}

/* ── ABA: PÚBLICO (dores + perfil, Intime e Temoos) ── */
const PUBLICO = {
  intime: {
    nome: 'Intime ERP', icon: '🔵', cor: '#2563eb',
    genM: 59, genF: 41,
    genTxt: '22 homens · 15 mulheres (dos 37 identificáveis; 10 são nome de empresa ou telefone). Público misto — varejo diverso: construção, autopeças, adega, mercado e cosméticos.',
    sub: 'por que buscaram um sistema — nas palavras de quem comprou',
    dores: [
      ['1', '🧾', 'Emitir nota fiscal é uma dor de cabeça', '≈6', 'NFC-e que trava, sistema que não reconhece o pagamento', '“problemas recorrentes com a emissão de NFC-e, falha ao reconhecer os pagamentos” — Mateus (Adega)', 'Emissão de NFC-e/NF-e integrada ao PDV', '#a78bfa'],
      ['2', '🔧', 'Meu sistema trava e não me entrega o que preciso', '≈5', 'a dor mais quente — perde venda no movimento', '“meu sistema hoje é muito ruim, não me entrega o que preciso” — Soraya · “quero um sistema rápido, que não trave” — Olívia', 'Rápido e estável, do PDV ao financeiro', '#ef4444'],
      ['3', '📦', 'Preciso controlar o estoque de verdade', '≈8', 'custo, lote, validade, o que vale a pena comprar', '“produtos de saúde/hospitalar… lote, validade, análise de compra” — Fabio', 'Estoque com custo, histórico e sugestão de compra', '#6eda2c'],
      ['4', '🛵', 'Preciso de link de delivery / iFood', '≈4', 'varejo com venda online e delivery próprio', '“catálogo — link de delivery” — Olívia · “PDV que converse com delivery” — Carlos', 'Catálogo + delivery integrados à venda', '#ea8a29'],
      ['5', '🏬', 'Tenho mais de uma loja / CNPJ', '≈4', 'os maiores tickets — precisam interligar unidades', '“são dois CNPJs, restaurante/padaria e conveniência” — Michele · “duas lojas, transferência entre elas” — Eduardo', 'Lojas interligadas com transferência de estoque', '#60a5fa'],
      ['6', '🔄', 'Quero trocar do meu sistema atual', '≈5', 'saíram de concorrente fraco / sem suporte', '“usava Inovar, tive problemas de suporte” — João (JC Auto Peças) · “usam Omie, não é prático” — Chimenes', 'Migração tranquila + suporte que te atende de verdade', '#8b5cf6'],
    ],
    alerta: '⚠️ Objeções de produto reais: 1 cliente precisava de um recurso de delivery que não temos (Carlos) e 1 de acesso pelo celular (Soraya). Vale avaliar no roadmap.',
  },
  temoos: {
    nome: 'Temoos', icon: '🟢', cor: '#6eda2c',
    genM: 77, genF: 23,
    genTxt: '23 homens · 7 mulheres (dos 30 identificáveis; 12 são nº de telefone ou nome de negócio). Público majoritariamente masculino — donos de bar/restaurante.',
    sub: 'por que buscaram um sistema — nas palavras deles (34 de 42 conversas lidas)',
    dores: [
      ['1', '🍽️', 'Não consigo tirar pedido na mesa', '≈8', 'QR Code / garçom — usam só o caixa ou anotam à mão', '“Meu forte é mesas… pra mim seria melhor QR code… feita a mãos” — Reginaldo', 'QR Code na mesa, sem garçom parado', '#6eda2c'],
      ['2', '🔧', 'Meu sistema atual falha e eu perco venda', '3', 'a dor mais quente — está perdendo dinheiro agora', '“se as coisas não funcionarem… não posso ter esse transtorno! Não faturo…” — Jéssica Rosa', 'Estável, não te deixa na mão no movimento', '#ef4444'],
      ['3', '🔄', 'Já uso um concorrente e quero trocar', '≈4', 'medo de perder função na troca', '“se vc oferece tudo o que tenho hj e mais o pedido de garçom, vou fechar” — lead migração', 'Tudo que você já tem + pedido na mesa', '#60a5fa'],
      ['4', '🚀', 'Estou abrindo / expandindo agora', '3', 'negócio novo — suporte pesa mais que preço', '“vamos abrir sexta… tem suporte? Vocês ensinam mexer?” — Deka', 'A gente implanta e treina sua equipe', '#ea8a29'],
      ['5', '🧾', 'Cresci e preciso de nota / CPF', '1', 'saiu do MEI — nicho específico', '“não é mais MEI. Clientes pedindo CPF na nota. Quero um sistema completo” — Jandilene', 'Sistema completo com emissão de nota', '#a78bfa'],
    ],
    alerta: '⚠️ 1 cliente desistiu por rigidez de processo — “altíssima sistemática de vcs… sem levar em conta minha disponibilidade”. Vale flexibilizar a agenda de implantação.',
  },
}

function Publico() {
  const [marca, setMarca] = useState('intime')
  const d = PUBLICO[marca]
  const box = { boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }
  return (
    <div className="space-y-5">
      {/* HERO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at 82% 15%, ${d.cor}33 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.55)' }}>Público · quem compra e por quê</p>
          <p className="text-white text-xl font-black mb-1" style={{ maxWidth: 640 }}>As dores reais dos clientes — tiradas das conversas de quem fechou.</p>
          <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.55)', maxWidth: 640 }}>
            O que faz um dono de negócio procurar um sistema, nas palavras dele. É a matéria-prima do criativo, da abordagem e do pitch.
          </p>
        </div>
      </motion.div>

      {/* SELETOR DE MARCA */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {Object.entries(PUBLICO).map(([k, v]) => (
          <button key={k} onClick={() => setMarca(k)}
            className="px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2"
            style={marca === k
              ? { background: v.cor + '20', color: v.cor, border: `1px solid ${v.cor}55` }
              : { background: '#fff', color: '#8890b5', border: '1px solid #e2e5f0' }}>
            <span>{v.icon}</span>{v.nome}
          </button>
        ))}
      </div>

      {/* PERFIL DE GÊNERO */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2">👥 Perfil de quem compra — {d.nome}</p>
        <div className="flex h-6 rounded-lg overflow-hidden mb-1.5" style={{ maxWidth: 360 }}>
          <div className="flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${d.genM}%`, background: '#60a5fa' }}>{d.genM}% homens</div>
          <div className="flex items-center justify-center text-[10px] font-black text-white" style={{ width: `${d.genF}%`, background: '#ec4899' }}>{d.genF}%</div>
        </div>
        <p className="text-[10px] text-muted">{d.genTxt}</p>
      </div>

      {/* DORES */}
      <div className="bg-white rounded-2xl p-5" style={box}>
        <p className="text-sm font-extrabold text-text">💬 Dores dos clientes que fecharam</p>
        <p className="text-[10px] text-muted mb-1">{d.sub}</p>
        <div className="space-y-2.5 mt-3">
          {d.dores.map(([n, ic, t, qtd, ctx, fala, bater, col]) => (
            <div key={n} className="rounded-xl p-3.5" style={{ background: col + '08', border: `1px solid ${col}22` }}>
              <div className="flex items-start gap-3">
                <span className="text-[11px] font-black text-white rounded-md px-1.5 py-0.5 mt-0.5 shrink-0" style={{ background: col }}>{n}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[13px] font-extrabold text-text">{ic} {t}</p>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: col + '18', color: col }}>{qtd} clientes</span>
                  </div>
                  <p className="text-[10px] text-muted mt-0.5">{ctx}</p>
                  <p className="text-[11px] italic text-muted mt-1.5 pl-2" style={{ borderLeft: `2px solid ${col}55` }}>{fala}</p>
                  <p className="text-[11px] mt-1.5"><span className="font-bold" style={{ color: col }}>🎯 Como bater:</span> <span className="text-text">{bater}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="rounded-xl p-3 mt-3" style={{ background: '#ea8a2908', border: '1px solid #ea8a2925' }}>
          <p className="text-[11px] text-muted"><strong className="text-text">Alerta (motivo de perda):</strong> {d.alerta.replace('⚠️ ', '')}</p>
        </div>
      </div>

      {/* METODOLOGIA — de onde vêm os dados */}
      <div className="bg-white rounded-2xl p-4" style={box}>
        <p className="text-[11px] font-extrabold text-text mb-2.5">📋 De onde vêm esses dados</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {[
            ['💬', 'As dores', 'Lidas nas conversas reais do CRM on360 — nas duas marcas.'],
            ['🎯', 'O recorte', 'Clientes que vieram de anúncio (tráfego pago) e fecharam.'],
            ['👥', 'O gênero', 'Inferido pelo primeiro nome. A parte não-identificável é nome de empresa ou telefone.'],
          ].map(([ic, t, p]) => (
            <div key={t} className="rounded-xl p-3" style={{ background: '#f7f8fc', border: '1px solid #eef0f7' }}>
              <p className="text-[11px] font-extrabold text-text flex items-center gap-1.5"><span>{ic}</span>{t}</p>
              <p className="text-[10px] text-muted mt-1 leading-snug">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── COMPONENTE PRINCIPAL ─────────────────────── */
export default function IntimeResultados({ color = '#a78bfa' }) {
  const [aba, setAba] = useState('retorno')
  const abas = [
    { id: 'retorno', label: '📈 Retorno x Investimento' },
    { id: 'intime', label: '🔵 1º Ciclo — Intime' },
    { id: 'ciclo', label: '🔄 1º Ciclo — Temoos' },
    { id: 'publico', label: '👥 Público' },
  ]
  return (
    <div className="space-y-4">

      {/* Header */}
      <div>
        <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
          Resultados
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: color + '15', color }}>Intime Sistemas</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">Fev–Ago 2026 · Intime ERP + Temoos</p>
      </div>

      {/* Seletor de abas */}
      <div className="flex gap-1.5 flex-wrap">
        {abas.map(a => (
          <button key={a.id} onClick={() => setAba(a.id)}
            className="text-xs font-bold px-3.5 py-2 rounded-xl transition"
            style={aba === a.id
              ? { background: color, color: '#fff', boxShadow: `0 2px 10px ${color}44` }
              : { background: color + '12', color }}>
            {a.label}
          </button>
        ))}
      </div>

      {aba === 'retorno' && (
        <div className="space-y-4">
          {/* Timeline de Fases — sempre visível */}
          <FasesTimeline color={color} />
          <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
            <RetornoInvestimento color={color} />
          </motion.div>
        </div>
      )}

      {aba === 'intime' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <CicloIntime color="#2563eb" />
        </motion.div>
      )}

      {aba === 'ciclo' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <CicloTemoos color={color} />
        </motion.div>
      )}

      {aba === 'publico' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          <Publico />
        </motion.div>
      )}
    </div>
  )
}
