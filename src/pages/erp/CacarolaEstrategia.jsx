import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#f87171'

const HIST = { cpm: 5.90, cpma: 30.63, freq: parseFloat((30.63 / 5.90).toFixed(2)) }

// Audiência estimada por cidade: pop. IBGE 2022 × penetração Meta por porte (70%/65%/60%/53%/45%)
// Total das 97 cidades: ~4,72M hab → ~3,14M contas Meta estimadas
const CAMP = { budget: 4000, days: 60, audiencia: 3140000, rmktAudiencia: 1340000, cidades: 97, freqMeta: 7 }
const daily     = CAMP.budget / CAMP.days
const totalImp  = Math.round(CAMP.budget / HIST.cpm * 1000)
const cpmaFreq7 = parseFloat((HIST.cpm * CAMP.freqMeta).toFixed(2))

const _impPorMetade = Math.round(CAMP.budget / 2 / HIST.cpm * 1000)
// Frio: freq histórica (apresentação de marca) → maior alcance
// Rmkt: freq meta 7× (reforço de lembrança) → menor alcance, maior impacto por pessoa
const _alcanceFrio  = Math.round(_impPorMetade / HIST.freq)
const _alcanceRmkt  = Math.round(_impPorMetade / CAMP.freqMeta)

const REAL = {
  frio:  { budget: CAMP.budget / 2, alcance: _alcanceFrio, freq: HIST.freq,       cobertura: _alcanceFrio / CAMP.audiencia },
  rmkt:  { budget: CAMP.budget / 2, alcance: _alcanceRmkt, freq: CAMP.freqMeta,   cobertura: _alcanceRmkt / CAMP.rmktAudiencia },
  total: { alcance: _alcanceFrio + _alcanceRmkt, cobertura: (_alcanceFrio + _alcanceRmkt) / CAMP.audiencia },
}

const _goalFrioBudget = Math.round(CAMP.audiencia     / 1000 * cpmaFreq7)
const _goalRmktBudget = Math.round(CAMP.rmktAudiencia / 1000 * cpmaFreq7)
const GOAL = {
  frio:  { budget: _goalFrioBudget, alcance: CAMP.audiencia,     freq: CAMP.freqMeta },
  rmkt:  { budget: _goalRmktBudget, alcance: CAMP.rmktAudiencia, freq: CAMP.freqMeta },
  total: { budget: _goalFrioBudget + _goalRmktBudget, daily: Math.round((_goalFrioBudget + _goalRmktBudget) / CAMP.days) },
}

function fmt(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.', ',') + 'M'
  if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
  return String(n)
}
function brl(n) {
  return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 })
}

/* ══════════════════════════════════════════
   ABA: INDICADORES HISTÓRICOS
══════════════════════════════════════════ */
function Indicadores({ color }) {
  const cpmFmt   = `R$ ${HIST.cpm.toFixed(2).replace('.', ',')}`
  const cpmaFmt  = `R$ ${HIST.cpma.toFixed(2).replace('.', ',')}`
  const freqFmt  = `${HIST.freq.toFixed(2).replace('.', ',')}×`
  const cpma7Fmt = `R$ ${cpmaFreq7.toFixed(2).replace('.', ',')}`

  const metricas = [
    {
      label: 'CPM',
      value: cpmFmt,
      sub: 'Custo por 1.000 impressões',
      color: '#6eda2c',
      nota: `Cada ${cpmFmt} garante 1.000 exibições do anúncio. Esse número vem do histórico real da conta — é o preço que o mercado cobrou para aparecer nas ${CAMP.cidades} cidades.`,
    },
    {
      label: 'CPMA (derivado)',
      value: cpmaFmt,
      sub: 'Custo por 1.000 pessoas únicas alcançadas',
      color: color,
      nota: `Diferente do CPM, o CPMA conta pessoas, não exibições. Como cada pessoa viu em média ${freqFmt}, temos: CPMA = CPM × frequência = ${cpmFmt} × ${freqFmt}. Quanto mais vezes mostramos para a mesma pessoa, mais caro fica alcançar alguém novo.`,
    },
    {
      label: 'Frequência média',
      value: freqFmt,
      sub: 'Exibições por pessoa no histórico',
      color: '#60a5fa',
      nota: `Em média, cada pessoa viu o anúncio da Caçarola ${freqFmt} no período histórico. Nossa meta é chegar em ${CAMP.freqMeta}×, que é o patamar onde a marca começa a ser lembrada espontaneamente — o limiar do recall.`,
    },
  ]

  const derivados = [
    {
      label: 'Impressões disponíveis',
      formula: `${brl(CAMP.budget)} ÷ CPM ${cpmFmt}`,
      value: fmt(totalImp),
      color,
      nota: `Com ${brl(CAMP.budget)}, compramos ${fmt(totalImp)} exibições totais. Esse número é fixo — não muda com a frequência. O que muda é para quantas pessoas distintas esse volume é distribuído.`,
    },
    {
      label: `CPMA projetado (freq ${CAMP.freqMeta}×)`,
      formula: `${cpmFmt} × ${CAMP.freqMeta}`,
      value: cpma7Fmt,
      color: '#ea8a29',
      nota: `Para que cada pessoa veja ${CAMP.freqMeta} vezes, o custo por 1.000 pessoas únicas sobe para ${cpma7Fmt}. Mais frequência = mais lembrança, mas menos alcance com o mesmo orçamento.`,
    },
    {
      label: 'Diária da campanha',
      formula: `${brl(CAMP.budget)} ÷ ${CAMP.days} dias`,
      value: brl(daily),
      color: '#60a5fa',
      nota: `Orçamento distribuído uniformemente ao longo dos ${CAMP.days} dias. Presença constante é o que mantém a Caçarola no feed da região sem interrupção.`,
    },
  ]

  return (
    <div className="space-y-4">

      {/* Hero */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0808 0%, #2d1010 100%)', boxShadow: '0 8px 32px rgba(248,113,113,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: color + 'aa' }}>
            Caçarola · Base histórica da conta Meta Ads
          </p>
          <p className="text-[10px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            Objetivo de campanha: <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Engajamento</strong>
          </p>
          <div className="grid grid-cols-3 gap-5">
            {metricas.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</p>
                <p className="text-3xl font-black leading-none" style={{ color: item.color }}>{item.value}</p>
                <p className="text-[10px] mt-1 mb-3" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.sub}</p>
                <div className="rounded-xl px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${item.color}25` }}>
                  <p className="text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>{item.nota}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Derivados */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🔢 Derivados da campanha atual</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {derivados.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4" style={{ background: d.color + '08', border: `1px solid ${d.color}25` }}>
              <p className="text-[10px] text-muted mb-2">{d.formula}</p>
              <p className="text-xl font-extrabold" style={{ color: d.color }}>{d.value}</p>
              <p className="text-[11px] font-bold text-text mt-1 mb-2">{d.label}</p>
              <p className="text-[10px] text-muted leading-relaxed">{d.nota}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Fórmulas */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">📐 Como CPM, CPMA e Frequência se relacionam</p>
        <div className="space-y-3">
          {[
            { eq: 'CPMA = CPM × Frequência', ex: `${cpmaFmt} = ${cpmFmt} × ${freqFmt}`, note: 'derivado do histórico de engajamento' },
            { eq: 'Alcance = Impressões ÷ Frequência', ex: `${fmt(totalImp)} ÷ ${CAMP.freqMeta} = ${fmt(REAL.total.alcance)} pessoas`, note: 'quanto maior a frequência, menor o alcance' },
            { eq: 'Impressões = Budget ÷ CPM × 1.000', ex: `${brl(CAMP.budget)} ÷ ${cpmFmt} × 1.000 = ${fmt(totalImp)}`, note: 'fixo — não muda com a frequência' },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
              <p className="text-sm font-extrabold text-text mb-0.5">{r.eq}</p>
              <p className="text-xs font-bold" style={{ color }}>{r.ex}</p>
              <p className="text-[10px] text-muted mt-0.5">{r.note}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: CENÁRIOS
══════════════════════════════════════════ */
function Cenarios({ color }) {
  const C1 = {
    id: 'realista', emoji: '📊', label: 'Realista',
    tag: 'Orçamento atual', tagColor: '#6eda2c', dark: false,
    budget: CAMP.budget, daily,
    alcance: Math.round(CAMP.budget / HIST.cpma * 1000),
    freq: HIST.freq, cpma: HIST.cpma,
    descricao: `O que ${brl(CAMP.budget)} entrega com o comportamento histórico da conta.`,
    obs: `Com o orçamento atual e a frequência que a conta naturalmente gera (${HIST.freq}×), chegamos a esse alcance. É o cenário base — o que já está sendo entregue hoje.`,
    audienciaRef: CAMP.audiencia,
  }
  C1.cobertura = parseFloat((C1.alcance / CAMP.audiencia * 100).toFixed(1))

  const C2_budget = 10000
  const C2 = {
    id: 'otimista', emoji: '🚀', label: 'Otimista',
    tag: 'Crescimento', tagColor: '#60a5fa', dark: false,
    budget: C2_budget, daily: parseFloat((C2_budget / CAMP.days).toFixed(2)),
    alcance: Math.round(C2_budget / HIST.cpma * 1000),
    freq: HIST.freq, cpma: HIST.cpma,
    descricao: 'Triplicar o investimento para cobrir mais público com a frequência histórica.',
    obs: `Aumentando para ${brl(C2_budget)}, o alcance cresce proporcionalmente. A frequência se mantém no histórico — mais verba compra mais pessoas novas, não mais repetições para as mesmas.`,
    audienciaRef: CAMP.audiencia,
  }
  C2.cobertura = parseFloat((C2.alcance / CAMP.audiencia * 100).toFixed(1))

  const C3_budget = GOAL.total.budget
  const C3 = {
    id: 'total', emoji: '🎯', label: 'Cobertura total',
    tag: 'Meta ideal', tagColor: color, dark: true,
    budget: C3_budget, daily: GOAL.total.daily,
    alcance: CAMP.audiencia + CAMP.rmktAudiencia,
    freq: CAMP.freqMeta, cpma: HIST.cpm * CAMP.freqMeta,
    descricao: `Freq ${CAMP.freqMeta}× para 100% do público frio + 100% do pool de remarketing.`,
    obs: `É o investimento para que ninguém nas ${CAMP.cidades} cidades passe os ${CAMP.days} dias sem ver a Caçarola pelo menos ${CAMP.freqMeta} vezes — o limiar onde a marca começa a ser lembrada espontaneamente.`,
    audienciaRef: CAMP.audiencia + CAMP.rmktAudiencia,
  }
  C3.cobertura = 100

  const cenarios = [C1, C2, C3]
  const [ativo, setAtivo] = useState('realista')
  const c = cenarios.find(x => x.id === ativo)

  return (
    <div className="space-y-4">

      {/* Barra de base */}
      <div className="rounded-2xl px-5 py-4 flex flex-wrap gap-6 items-center"
        style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
        <span className="text-[11px] text-muted font-bold">📌 Base dos cálculos</span>
        {[
          { label: 'CPM',        value: `R$ ${HIST.cpm.toFixed(2).replace('.', ',')}` },
          { label: 'CPMA',       value: `R$ ${HIST.cpma.toFixed(2).replace('.', ',')}` },
          { label: 'Freq hist.', value: `${HIST.freq}×` },
          { label: 'Público',    value: fmt(CAMP.audiencia) },
          { label: 'Cidades',    value: `${CAMP.cidades} SC` },
          { label: 'Período',    value: `${CAMP.days} dias` },
        ].map((item, i) => (
          <div key={i}>
            <p className="text-[10px] text-muted">{item.label}</p>
            <p className="text-sm font-extrabold text-text">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Cards dos 3 cenários */}
      <div className="grid grid-cols-3 gap-3">
        {cenarios.map(cn => (
          <motion.button key={cn.id} whileHover={{ y: -2 }} onClick={() => setAtivo(cn.id)}
            className="rounded-2xl p-4 text-left transition-all"
            style={{
              background: ativo === cn.id
                ? (cn.dark ? 'linear-gradient(135deg, #1a0808 0%, #2d1010 100%)' : cn.tagColor + '12')
                : 'white',
              border: `2px solid ${ativo === cn.id ? cn.tagColor : '#e2e5f0'}`,
              boxShadow: ativo === cn.id ? `0 4px 20px ${cn.tagColor}25` : '0 2px 8px rgba(26,29,46,0.06)',
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{cn.emoji}</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-full"
                style={{ background: cn.tagColor + '20', color: cn.tagColor }}>{cn.tag}</span>
            </div>
            <p className="text-sm font-extrabold mb-3"
              style={{ color: ativo === cn.id && cn.dark ? 'white' : '#1a1d2e' }}>{cn.label}</p>
            <div className="space-y-1.5">
              {[
                { label: 'Investimento', value: brl(cn.budget) },
                { label: 'Alcance',      value: fmt(cn.alcance) + ' pessoas' },
                { label: 'Cobertura',    value: cn.cobertura + '%' },
                { label: 'Frequência',   value: cn.freq + '×' },
              ].map((row, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-[10px]"
                    style={{ color: ativo === cn.id && cn.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>{row.label}</span>
                  <span className="text-[11px] font-extrabold"
                    style={{ color: i === 0 ? cn.tagColor : ativo === cn.id && cn.dark ? 'white' : '#1a1d2e' }}>{row.value}</span>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detalhe expandido */}
      <motion.div key={ativo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: c.dark ? 'linear-gradient(135deg, #0a0f1a 0%, #141728 100%)' : 'white',
            boxShadow: `0 8px 32px ${c.tagColor}20`,
            border: `1.5px solid ${c.tagColor}30`,
          }}>
          {c.dark && (
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: `radial-gradient(ellipse at 80% 20%, ${c.tagColor}18 0%, transparent 60%)` }} />
          )}
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="text-lg font-extrabold" style={{ color: c.dark ? 'white' : '#1a1d2e' }}>{c.label}</p>
                <p className="text-[11px]" style={{ color: c.tagColor }}>{c.descricao}</p>
              </div>
            </div>

            {/* Obs do cenário */}
            <div className="rounded-xl px-4 py-3 mb-5"
              style={{ background: c.dark ? 'rgba(255,255,255,0.05)' : c.tagColor + '08', border: `1px solid ${c.tagColor}25` }}>
              <p className="text-[11px] leading-relaxed" style={{ color: c.dark ? 'rgba(255,255,255,0.6)' : '#4a5580' }}>
                💡 {c.obs}
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                {
                  label: 'Investimento', value: brl(c.budget), sub: `${brl(c.daily)}/dia`, icon: '💰',
                  obs: 'Valor total aplicado na campanha no período.',
                },
                {
                  label: 'Pessoas alcançadas', value: fmt(c.alcance), sub: `${c.cobertura}% dos ${fmt(c.audienciaRef)}`, icon: '👥',
                  obs: `Estimativa de pessoas únicas que verão o anúncio. Calculado como: orçamento ÷ CPMA × 1.000.`,
                },
                {
                  label: 'Frequência', value: `${c.freq}×`, sub: 'exibições por pessoa', icon: '🔁',
                  obs: `Quantas vezes, em média, cada pessoa verá o anúncio. ${CAMP.freqMeta}× é o alvo para lembrança real de marca.`,
                },
                {
                  label: 'CPMA estimado', value: `R$ ${c.cpma.toFixed(2).replace('.', ',')}`, sub: 'por 1.000 alcançadas', icon: '📊',
                  obs: `Custo para alcançar 1.000 pessoas únicas. Fórmula: CPM × Frequência = ${HIST.cpm.toFixed(2)} × ${c.freq}.`,
                },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-4"
                  style={{
                    background: c.dark ? 'rgba(255,255,255,0.05)' : c.tagColor + '08',
                    border: `1px solid ${c.tagColor}${c.dark ? '30' : '20'}`,
                  }}>
                  <p className="text-xl mb-1">{item.icon}</p>
                  <p className="text-xl font-extrabold" style={{ color: c.dark ? 'white' : c.tagColor }}>{item.value}</p>
                  <p className="text-[10px] font-bold mt-0.5" style={{ color: c.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>{item.label}</p>
                  <p className="text-[9px] mt-0.5 mb-2" style={{ color: c.tagColor }}>{item.sub}</p>
                  <p className="text-[9px] leading-relaxed" style={{ color: c.dark ? 'rgba(255,255,255,0.3)' : '#8890b5' }}>{item.obs}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold mb-2"
                style={{ color: c.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>
                <span>Cobertura do público ({fmt(c.audienciaRef)})</span>
                <span style={{ color: c.tagColor }}>{c.cobertura}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden"
                style={{ background: c.dark ? 'rgba(255,255,255,0.06)' : c.tagColor + '15' }}>
                <motion.div className="h-full rounded-full" style={{ background: c.tagColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(c.cobertura, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Comparativo */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-3 border-b border-border">
          <p className="text-sm font-extrabold text-text">⚡ Comparativo dos 3 cenários</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['', '📊 Realista', '🚀 Otimista', '🎯 Cobertura total'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { label: 'Investimento', v: [brl(C1.budget),  brl(C2.budget),  brl(C3.budget)] },
                { label: 'Diária',       v: [brl(C1.daily),   brl(C2.daily),   brl(C3.daily)] },
                { label: 'Alcance',      v: [fmt(C1.alcance), fmt(C2.alcance), '~' + fmt(C3.alcance)] },
                { label: 'Cobertura',    v: [`${C1.cobertura}%`, `${C2.cobertura}%`, '~100%'] },
                { label: 'Frequência',   v: [`${C1.freq}×`, `${C2.freq}×`, `${C3.freq}×`] },
                { label: 'CPMA',         v: [`R$ ${C1.cpma.toFixed(2).replace('.', ',')}`, `R$ ${C2.cpma.toFixed(2).replace('.', ',')}`, `R$ ${C3.cpma.toFixed(2).replace('.', ',')}`] },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-4 py-2.5 text-[11px] font-bold text-muted">{row.label}</td>
                  {row.v.map((v, j) => (
                    <td key={j} className="px-4 py-2.5 text-[11px] font-extrabold"
                      style={{ color: ['#6eda2c', '#60a5fa', color][j] }}>{v}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: FUNIL ESTRATÉGICO
══════════════════════════════════════════ */
function Funil({ color }) {
  return (
    <div className="space-y-4">

      {/* Fluxo visual */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #101828 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}15 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: color + 'aa' }}>
            Funil de impacto — {CAMP.cidades} cidades SC · {CAMP.days} dias
          </p>
          <p className="text-xl font-black text-white mb-5">Do desconhecido ao lembrado</p>

          <div className="flex flex-col items-center gap-3">
            {[
              {
                icon: '👥', label: 'Público total das 97 cidades', value: fmt(CAMP.audiencia),
                sub: 'Meta audience estimada',
                obs: `Estimativa da Meta para os ${CAMP.cidades} municípios selecionados em SC. É o universo máximo que a campanha pode alcançar — a base de tudo que calculamos.`,
                color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)',
              },
              {
                icon: '🔵', label: 'Alcance frio (atual)', value: `${fmt(REAL.frio.alcance)} pessoas`,
                sub: `${(REAL.frio.cobertura * 100).toFixed(1)}% do público · freq ${HIST.freq}× · ${brl(REAL.frio.budget)}`,
                obs: `Pessoas que ainda não conhecem a Caçarola. O objetivo aqui é apresentar a marca — máximo alcance com a frequência histórica de ${HIST.freq}×. Com ${brl(REAL.frio.budget)}, compramos ${fmt(_impPorMetade)} impressões que, divididas por freq ${HIST.freq}×, alcançam ${fmt(_alcanceFrio)} pessoas novas.`,
                color: '#60a5fa', bg: '#60a5fa10',
              },
              { icon: '↓', label: '', value: '', sub: 'engajam e entram no remarketing', color: 'rgba(255,255,255,0.2)', bg: 'transparent' },
              {
                icon: '🟠', label: 'Remarketing (atual)', value: `${fmt(REAL.rmkt.alcance)} pessoas`,
                sub: `${(REAL.rmkt.cobertura * 100).toFixed(1)}% do pool · freq ${CAMP.freqMeta}× · ${brl(REAL.rmkt.budget)}`,
                obs: `Pessoas que já interagiram com a Caçarola (perfil, vídeo, anúncio anterior). Público menor e mais quente — aplicamos freq ${CAMP.freqMeta}× para criar lembrança real. Com ${brl(REAL.rmkt.budget)}, reforçamos ${fmt(_alcanceRmkt)} pessoas com maior intensidade de exposição.`,
                color: '#ea8a29', bg: '#ea8a2910',
              },
              { icon: '↓', label: '', value: '', sub: 'reconhecem, engajam, buscam no ponto de venda', color: 'rgba(255,255,255,0.2)', bg: 'transparent' },
              {
                icon: '🏆', label: 'Lembrança de marca', value: `${CAMP.freqMeta}× de exposição`,
                sub: 'frequência ideal para recall e consideração',
                obs: `Estudos de neuromarketing indicam que ${CAMP.freqMeta} exposições é o patamar onde a marca começa a ser lembrada espontaneamente. Abaixo disso, o impacto é fraco demais para gerar preferência no momento da compra no supermercado.`,
                color, bg: color + '10',
              },
            ].map((item, i) => item.icon === '↓' ? (
              <div key={i} className="flex flex-col items-center gap-0.5" style={{ color: item.color }}>
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <span className="text-xs">↓</span>
                <p className="text-[10px] italic" style={{ color: item.color }}>{item.sub}</p>
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="w-full rounded-2xl px-5 py-4 flex items-start gap-4"
                style={{ background: item.bg, border: `1px solid ${item.color}25` }}>
                <span className="text-2xl flex-shrink-0 mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-extrabold" style={{ color: item.color }}>{item.label}</p>
                  {item.sub && <p className="text-[10px] mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.sub}</p>}
                  {item.obs && (
                    <p className="text-[11px] leading-relaxed mt-2 pr-2" style={{ color: 'rgba(255,255,255,0.55)' }}>
                      {item.obs}
                    </p>
                  )}
                </div>
                {item.value && <p className="text-lg font-extrabold text-white flex-shrink-0 mt-0.5">{item.value}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Para cobrir 100% */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-1">🚀 Para cobrir 100% da região</p>
        <p className="text-[11px] text-muted mb-4">
          Investimento necessário para atingir frequência {CAMP.freqMeta}× em toda a audiência das {CAMP.cidades} cidades.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: 'Investimento adicional', value: brl(GOAL.total.budget - CAMP.budget),
              sub: `além dos ${brl(CAMP.budget)} atuais`, color: '#ef4444', icon: '💰',
              obs: `Diferença entre o ideal (${brl(GOAL.total.budget)}) e o atual (${brl(CAMP.budget)}). É o gap de verba para cobertura total.`,
            },
            {
              label: 'Total necessário', value: brl(GOAL.total.budget),
              sub: `${brl(GOAL.total.daily)}/dia por ${CAMP.days} dias`, color, icon: '🎯',
              obs: `Calculado: (${fmt(CAMP.audiencia)} + ${fmt(CAMP.rmktAudiencia)}) × CPMA ${brl(cpmaFreq7)} ÷ 1.000.`,
            },
            {
              label: 'Pessoas adicionais não alcançadas', value: `+${fmt(CAMP.audiencia + CAMP.rmktAudiencia - REAL.total.alcance)}`,
              sub: 'com o orçamento atual', color: '#ea8a29', icon: '👤',
              obs: `Do total de ${fmt(CAMP.audiencia + CAMP.rmktAudiencia)} pessoas no universo, ${fmt(REAL.total.alcance)} são alcançadas hoje. Esse é o gap de cobertura.`,
            },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-1.5" style={{ background: item.color + '06', border: `1px solid ${item.color}20` }}>
              <span className="text-xl">{item.icon}</span>
              <p className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs font-bold text-text">{item.label}</p>
              <p className="text-[10px] text-muted">{item.sub}</p>
              <p className="text-[10px] leading-relaxed mt-1" style={{ color: '#8890b5' }}>{item.obs}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Distribuição — redesign */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 pt-5 pb-4 border-b border-border">
          <p className="text-sm font-extrabold text-text">📊 Distribuição do orçamento</p>
          <p className="text-[11px] text-muted mt-0.5">
            O orçamento é dividido igualmente entre dois públicos com objetivos distintos.
          </p>
        </div>

        {/* Barra 50/50 */}
        <div className="px-5 py-4 border-b border-border">
          <div className="flex h-11 rounded-xl overflow-hidden mb-2.5">
            <motion.div className="flex items-center justify-center gap-1.5"
              style={{ background: '#60a5fa', width: '50%' }}
              initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ duration: 0.9, ease: 'easeOut' }}>
              <span className="text-[11px] font-extrabold text-white">🔵 50% · Público Frio</span>
            </motion.div>
            <motion.div className="flex items-center justify-center gap-1.5"
              style={{ background: '#ea8a29', width: '50%' }}
              initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}>
              <span className="text-[11px] font-extrabold text-white">🟠 50% · Remarketing</span>
            </motion.div>
          </div>
          <p className="text-[10px] text-muted text-center">
            {brl(CAMP.budget / 2)} por frente · {fmt(_impPorMetade)} impressões cada · {fmt(_alcanceFrio)} pessoas (frio, freq {HIST.freq}×) · {fmt(_alcanceRmkt)} pessoas (rmkt, freq {CAMP.freqMeta}×)
          </p>
        </div>

        {/* Cards lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            {
              label: 'Público Frio', icon: '🔵', color: '#60a5fa',
              objetivo: 'Reconhecimento de marca',
              impressoes: _impPorMetade, alcance: _alcanceFrio, budget: CAMP.budget / 2,
              freq: HIST.freq,
              cobertura: REAL.frio.cobertura, audienciaRef: CAMP.audiencia,
              coberturaLabel: `${(REAL.frio.cobertura * 100).toFixed(1)}% dos ${fmt(CAMP.audiencia)} da região`,
              formulaImp: `${brl(CAMP.budget / 2)} ÷ CPM R$ ${HIST.cpm.toFixed(2).replace('.', ',')} × 1.000`,
              formulaAlc: `${fmt(_impPorMetade)} impressões ÷ freq ${HIST.freq}×`,
              freqLabel: `${HIST.freq}× (freq histórica da conta)`,
              obs: 'Pessoas que nunca interagiram com a Caçarola. Objetivo: apresentar a marca, máximo alcance. Usamos a freq histórica da conta (5.19×) — quanto mais gente atingirmos, mais o remarketing cresce no próximo ciclo.',
            },
            {
              label: 'Remarketing', icon: '🟠', color: '#ea8a29',
              objetivo: 'Reforço e lembrança',
              impressoes: _impPorMetade, alcance: _alcanceRmkt, budget: CAMP.budget / 2,
              freq: CAMP.freqMeta,
              cobertura: REAL.rmkt.cobertura, audienciaRef: CAMP.rmktAudiencia,
              coberturaLabel: `${(REAL.rmkt.cobertura * 100).toFixed(1)}% do pool de ${fmt(CAMP.rmktAudiencia)}`,
              formulaImp: `${brl(CAMP.budget / 2)} ÷ CPM R$ ${HIST.cpm.toFixed(2).replace('.', ',')} × 1.000`,
              formulaAlc: `${fmt(_impPorMetade)} impressões ÷ freq ${CAMP.freqMeta}×`,
              freqLabel: `${CAMP.freqMeta}× (meta de recall)`,
              obs: 'Pessoas que já viram ou interagiram com a Caçarola. Público mais quente e menor — aplicamos freq mais alta (7×) para criar lembrança real e empurrar para o ponto de venda.',
            },
          ].map((item, i) => (
            <div key={i} className="p-5">

              {/* Header */}
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                  style={{ background: item.color + '15', border: `1.5px solid ${item.color}30` }}>
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-extrabold text-text">{item.label}</p>
                  <p className="text-[10px] font-bold" style={{ color: item.color }}>{item.objetivo}</p>
                </div>
              </div>

              {/* Métricas */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {[
                  { label: 'Verba',       value: brl(item.budget) },
                  { label: 'Impressões',  value: fmt(item.impressoes) },
                  { label: 'Pessoas',     value: fmt(item.alcance) },
                ].map((m, j) => (
                  <div key={j} className="rounded-xl p-2.5 text-center"
                    style={{ background: item.color + '08', border: `1px solid ${item.color}20` }}>
                    <p className="text-sm font-extrabold" style={{ color: item.color }}>{m.value}</p>
                    <p className="text-[9px] text-muted mt-0.5">{m.label}</p>
                  </div>
                ))}
              </div>

              {/* Barra de cobertura */}
              <div className="mb-4">
                <div className="flex justify-between text-[10px] mb-1.5">
                  <span className="text-muted font-bold">Cobertura</span>
                  <span className="font-extrabold" style={{ color: item.color }}>{item.coberturaLabel}</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: item.color + '15' }}>
                  <motion.div className="h-full rounded-full" style={{ background: item.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(item.cobertura * 100, 100)}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: i * 0.15 }} />
                </div>
              </div>

              {/* Como chegamos aqui */}
              <div className="rounded-xl p-3.5 mb-4" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
                <p className="text-[9px] font-extrabold text-muted uppercase tracking-wide mb-2">Como chegamos nesses números</p>
                <div className="space-y-1.5">
                  {[
                    { label: 'Impressões:', value: item.formulaImp },
                    { label: 'Alcance:',    value: item.formulaAlc },
                    { label: 'Frequência:', value: item.freqLabel },
                  ].map((row, j) => (
                    <div key={j} className="flex justify-between gap-2 text-[10px]">
                      <span className="text-muted flex-shrink-0">{row.label}</span>
                      <span className="font-bold text-text text-right">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Observação */}
              <div className="rounded-xl px-3.5 py-3" style={{ background: item.color + '07', border: `1px solid ${item.color}18` }}>
                <p className="text-[10px] leading-relaxed" style={{ color: '#4a5580' }}>{item.obs}</p>
              </div>

            </div>
          ))}
        </div>

        {/* Rodapé */}
        <div className="px-5 py-4 border-t border-border" style={{ background: '#f7f8fc' }}>
          <div className="flex flex-wrap gap-6 items-start justify-between">
            <div>
              <p className="text-[10px] text-muted font-bold mb-1">Totais da campanha</p>
              <p className="text-sm font-extrabold text-text">
                <span style={{ color: COR }}>{fmt(totalImp)} impressões</span>
                {' · '}
                <span style={{ color: '#60a5fa' }}>{fmt(REAL.total.alcance)} pessoas únicas</span>
                {' · '}
                <span style={{ color: '#ea8a29' }}>freq {CAMP.freqMeta}×</span>
                {' · '}
                <span style={{ color: '#6eda2c' }}>{brl(CAMP.budget)}</span>
              </p>
            </div>
            <div className="max-w-xs">
              <p className="text-[10px] text-muted font-bold mb-1">Por que dividir 50/50?</p>
              <p className="text-[10px] text-muted leading-relaxed">
                Enquanto o público frio alimenta novos consumidores, o remarketing consolida quem já conhece. O equilíbrio garante que a marca cresça em alcance e em profundidade ao mesmo tempo.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════ */
export default function CacarolaEstrategia({ color = COR }) {
  const [subTab, setSubTab] = useState('cenarios')

  const tabs = [
    { key: 'indicadores', label: '📊 Indicadores', sub: 'Base histórica' },
    { key: 'cenarios',    label: '🎯 Cenários',    sub: 'Meta vs realidade' },
    { key: 'funil',       label: '🔄 Funil',       sub: 'Frio → Remarketing' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🧠 Estratégia de Mídia
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>Caçarola · Meta Ads</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">{CAMP.cidades} cidades SC · {CAMP.days} dias · {brl(CAMP.budget)} · Freq meta {CAMP.freqMeta}×</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {tabs.map(t => (
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
        {subTab === 'indicadores' && <Indicadores color={color} />}
        {subTab === 'cenarios'    && <Cenarios    color={color} />}
        {subTab === 'funil'       && <Funil       color={color} />}
      </motion.div>
    </div>
  )
}
