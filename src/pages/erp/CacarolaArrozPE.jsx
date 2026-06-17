import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#f59e0b'

const HIST = {
  cpm:     5.90,   // CPM médio blended da conta (histórico real)
  cpmFrio: 4.90,   // estimativa frio: público amplo → CPM ~17% abaixo da média
  cpmRmkt: 7.40,   // estimativa rmkt: público quente, leilão acirrado → CPM ~25% acima
  cpma: 30.63,     // CPMA blended histórico (cpm × freq histórica)
  freq: parseFloat((30.63 / 5.90).toFixed(2)), // 5,19×
}

// Audiência estimada cidade a cidade — IBGE 2022 × penetração Meta por porte
// 97 municípios do Agreste + Sertão + Vale do São Francisco (PE)
// >100k (70%): Caruaru ~362k, Petrolina ~343k, Garanhuns ~140k → 591.500
// 50-100k (65%): Serra Talhada, Araripina, Gravatá, Arcoverde, Ouricuri, Pesqueira,
//   Salgueiro, Bezerros, Belo Jardim, São Bento do Una → 457.600
// 20-50k (60%): 31 cidades (Bom Conselho, Sertânia, Belém de SF, etc.) → 574.800
// 5-20k (53%): 53 cidades pequenas → 368.880
// Total pop ~3,17M hab → ~1,99M contas Meta estimadas
// Rmkt: estimativa de pool ativo da conta em PE
const CAMP = { budget: 1000, days: 60, audiencia: 1990000, rmktAudiencia: 600000, cidades: 97, estado: 'PE', freqMeta: 7 }
const daily          = CAMP.budget / CAMP.days
const totalImp       = Math.round(CAMP.budget / HIST.cpm * 1000)
const cpmaFreq7      = parseFloat((HIST.cpm     * CAMP.freqMeta).toFixed(2))  // blended: 41,30
const cpmaFrioFreq7  = parseFloat((HIST.cpmFrio * CAMP.freqMeta).toFixed(2))  // frio: 34,30
const cpmaRmktFreq7  = parseFloat((HIST.cpmRmkt * CAMP.freqMeta).toFixed(2))  // rmkt: 51,80

// Impressões separadas por audiência — CPMs distintos
const _impFrio     = Math.round(CAMP.budget / 2 / HIST.cpmFrio * 1000)
const _impRmkt     = Math.round(CAMP.budget / 2 / HIST.cpmRmkt * 1000)
const _alcanceFrio = Math.round(_impFrio / HIST.freq)
const _alcanceRmkt = Math.round(_impRmkt / CAMP.freqMeta)

const REAL = {
  frio:  { budget: CAMP.budget / 2, impressoes: _impFrio,  alcance: _alcanceFrio, freq: HIST.freq,     cobertura: _alcanceFrio / CAMP.audiencia },
  rmkt:  { budget: CAMP.budget / 2, impressoes: _impRmkt,  alcance: _alcanceRmkt, freq: CAMP.freqMeta, cobertura: _alcanceRmkt / CAMP.rmktAudiencia },
  total: { alcance: _alcanceFrio + _alcanceRmkt, cobertura: (_alcanceFrio + _alcanceRmkt) / CAMP.audiencia },
}

// GOAL usa CPMAs separados por tipo de audiência
const _goalFrioBudget = Math.round(CAMP.audiencia     / 1000 * cpmaFrioFreq7)
const _goalRmktBudget = Math.round(CAMP.rmktAudiencia / 1000 * cpmaRmktFreq7)
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
      nota: `Cada ${cpmFmt} garante 1.000 exibições do anúncio. Histórico real da conta Caçarola — é o preço que o mercado cobrou para aparecer nas ${CAMP.cidades} cidades do ${CAMP.estado}.`,
    },
    {
      label: 'CPMA (derivado)',
      value: cpmaFmt,
      sub: 'Custo por 1.000 pessoas únicas alcançadas',
      color: color,
      nota: `CPMA = CPM × frequência = ${cpmFmt} × ${freqFmt}. Quanto mais vezes mostramos para a mesma pessoa, mais caro fica alcançar alguém novo. Esse é o custo real de impacto.`,
    },
    {
      label: 'Frequência média',
      value: freqFmt,
      sub: 'Exibições por pessoa no histórico',
      color: '#60a5fa',
      nota: `Cada pessoa viu o anúncio ${freqFmt} no período histórico. A meta é ${CAMP.freqMeta}×, limiar de recall espontâneo de marca. Abaixo disso, o impacto não consolida.`,
    },
  ]

  const derivados = [
    {
      label: 'Impressões disponíveis',
      formula: `${brl(CAMP.budget)} ÷ CPM ${cpmFmt}`,
      value: fmt(totalImp),
      color,
      nota: `Com ${brl(CAMP.budget)}, compramos ${fmt(totalImp)} exibições totais. Esse número é fixo — o que muda é para quantas pessoas distintas esse volume é distribuído.`,
    },
    {
      label: `CPMA projetado (freq ${CAMP.freqMeta}×)`,
      formula: `${cpmFmt} × ${CAMP.freqMeta}`,
      value: cpma7Fmt,
      color: '#ea8a29',
      nota: `Para que cada pessoa veja ${CAMP.freqMeta} vezes, o custo por 1.000 pessoas únicas sobe para ${cpma7Fmt}. Mais frequência = mais lembrança, mas menos alcance.`,
    },
    {
      label: 'Diária da campanha',
      formula: `${brl(CAMP.budget)} ÷ ${CAMP.days} dias`,
      value: brl(daily),
      color: '#60a5fa',
      nota: `Orçamento distribuído uniformemente ao longo dos ${CAMP.days} dias. Presença constante é o que mantém a Caçarola no feed da região.`,
    },
  ]

  return (
    <div className="space-y-4">

      {/* Hero */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a1200 0%, #2d1f00 100%)', boxShadow: '0 8px 32px rgba(245,158,11,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-1" style={{ color: color + 'aa' }}>
            Caçarola · Dupla de Arroz · Base histórica Meta Ads
          </p>
          <p className="text-[10px] mb-5" style={{ color: 'rgba(255,255,255,0.3)' }}>
            {CAMP.cidades} municípios · <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Pernambuco</strong> · Objetivo: <strong style={{ color: 'rgba(255,255,255,0.55)' }}>Reconhecimento de marca</strong>
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
            { eq: 'Alcance frio = Impressões ÷ freq histórica', ex: `${fmt(_impFrio)} ÷ ${HIST.freq}× = ${fmt(_alcanceFrio)} pessoas`, note: `CPM frio estimado: R$ ${HIST.cpmFrio.toFixed(2).replace('.', ',')} — maximiza alcance` },
            { eq: 'Alcance rmkt = Impressões ÷ freq meta', ex: `${fmt(_impRmkt)} ÷ ${CAMP.freqMeta}× = ${fmt(_alcanceRmkt)} pessoas`, note: `CPM rmkt estimado: R$ ${HIST.cpmRmkt.toFixed(2).replace('.', ',')} — maior recall por pessoa` },
            { eq: 'Impressões = Budget ÷ CPM × 1.000', ex: `${brl(CAMP.budget / 2)} ÷ R$ ${HIST.cpmFrio.toFixed(2).replace('.', ',')} = ${fmt(_impFrio)} (frio) · ${brl(CAMP.budget / 2)} ÷ R$ ${HIST.cpmRmkt.toFixed(2).replace('.', ',')} = ${fmt(_impRmkt)} (rmkt)`, note: 'CPMs distintos resultam em volumes de impressões diferentes por R$ 500 investidos' },
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

  const C2_budget = 2500
  const C2 = {
    id: 'otimista', emoji: '🚀', label: 'Otimista',
    tag: 'Crescimento', tagColor: '#60a5fa', dark: false,
    budget: C2_budget, daily: parseFloat((C2_budget / CAMP.days).toFixed(2)),
    alcance: Math.round(C2_budget / HIST.cpma * 1000),
    freq: HIST.freq, cpma: HIST.cpma,
    descricao: `2,5× o investimento atual para ampliar alcance com a frequência histórica.`,
    obs: `Aumentando para ${brl(C2_budget)}, o alcance cresce proporcionalmente. A frequência se mantém no histórico — mais verba compra mais pessoas novas, não mais repetições.`,
    audienciaRef: CAMP.audiencia,
  }
  C2.cobertura = parseFloat((C2.alcance / CAMP.audiencia * 100).toFixed(1))

  const C3_budget = GOAL.total.budget
  const C3 = {
    id: 'total', emoji: '🎯', label: 'Cobertura total',
    tag: 'Meta ideal', tagColor: color, dark: true,
    budget: C3_budget, daily: GOAL.total.daily,
    alcance: CAMP.audiencia + CAMP.rmktAudiencia,
    freq: CAMP.freqMeta, cpma: parseFloat((HIST.cpm * CAMP.freqMeta).toFixed(2)),
    descricao: `Investimento para saturar 100% do público das ${CAMP.cidades} cidades em ${CAMP.days} dias com freq ${CAMP.freqMeta}×.`,
    obs: `É o investimento para que ninguém no ${CAMP.estado} passe os ${CAMP.days} dias sem ver a Caçarola pelo menos ${CAMP.freqMeta} vezes. O CPMA sobe para ${brl(HIST.cpm * CAMP.freqMeta)} porque compramos mais exposição por pessoa.`,
    audienciaRef: CAMP.audiencia + CAMP.rmktAudiencia,
  }
  C3.cobertura = 100

  const cenarios = [C1, C2, C3]
  const [selected, setSelected] = useState('realista')
  const active = cenarios.find(c => c.id === selected)

  return (
    <div className="space-y-4">

      {/* Base dos cálculos */}
      <div className="bg-white rounded-2xl p-4 flex flex-wrap gap-4" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        {[
          { label: 'Público PE estimado', value: fmt(CAMP.audiencia), color: '#60a5fa', nota: `${CAMP.cidades} municípios × penetração Meta por porte` },
          { label: 'Pool de remarketing', value: fmt(CAMP.rmktAudiencia), color: '#ea8a29', nota: 'Estimativa — atualizar com dado real da conta' },
          { label: 'Período', value: `${CAMP.days} dias`, color: '#6eda2c', nota: 'Duração base da campanha' },
          { label: 'CPM histórico', value: `R$ ${HIST.cpm.toFixed(2).replace('.', ',')}`, color, nota: 'Base de todos os cenários' },
        ].map((item, i) => (
          <div key={i} className="flex-1 min-w-[120px] rounded-xl p-3" style={{ background: item.color + '08', border: `1px solid ${item.color}20` }}>
            <p className="text-lg font-extrabold" style={{ color: item.color }}>{item.value}</p>
            <p className="text-[11px] font-bold text-text mt-0.5">{item.label}</p>
            <p className="text-[10px] text-muted mt-0.5">{item.nota}</p>
          </div>
        ))}
      </div>

      {/* Cards dos cenários */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {cenarios.map((c, i) => (
          <motion.button key={c.id} onClick={() => setSelected(c.id)}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="text-left rounded-2xl p-5 transition-all"
            style={{
              background:   selected === c.id ? (c.dark ? 'linear-gradient(135deg, #0a0f1a 0%, #101828 100%)' : color + '12') : c.dark ? 'linear-gradient(135deg, #0a0f1a 0%, #101828 100%)' : 'white',
              border:       `2px solid ${selected === c.id ? color : c.dark ? color + '25' : '#edf0f7'}`,
              boxShadow:    selected === c.id ? `0 4px 20px ${color}25` : '0 2px 8px rgba(26,29,46,0.07)',
            }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{c.emoji}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: c.tagColor + '20', color: c.tagColor }}>{c.tag}</span>
            </div>
            <p className="text-base font-extrabold mb-0.5" style={{ color: c.dark ? 'white' : '#1a1d2e' }}>{c.label}</p>
            <p className="text-[11px] mb-4" style={{ color: c.dark ? 'rgba(255,255,255,0.45)' : '#8890b5' }}>{c.descricao}</p>
            <p className="text-2xl font-black" style={{ color }}>{brl(c.budget)}</p>
            <p className="text-[10px] font-bold" style={{ color: c.dark ? 'rgba(255,255,255,0.3)' : '#8890b5' }}>{brl(c.daily)}/dia</p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {[
                { label: 'Alcance', value: fmt(c.alcance) },
                { label: 'Cobertura', value: `${c.cobertura}%` },
              ].map((m, j) => (
                <div key={j} className="rounded-xl p-2 text-center"
                  style={{ background: color + (c.dark ? '20' : '10'), border: `1px solid ${color}25` }}>
                  <p className="text-sm font-extrabold" style={{ color }}>{m.value}</p>
                  <p className="text-[9px] font-bold" style={{ color: c.dark ? 'rgba(255,255,255,0.35)' : '#8890b5' }}>{m.label}</p>
                </div>
              ))}
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detalhe expandido */}
      {active && (
        <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <div className="px-5 py-4 border-b border-border" style={{ background: color + '06' }}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{active.emoji}</span>
              <div>
                <p className="text-sm font-extrabold text-text">{active.label}</p>
                <p className="text-[11px] text-muted">{`${active.cobertura}% dos ${fmt(active.audienciaRef)}`}</p>
              </div>
            </div>
          </div>
          <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4 border-b border-border">
            {[
              { label: 'Investimento', value: brl(active.budget), color: '#6eda2c' },
              { label: 'Diária', value: brl(active.daily), color: '#60a5fa' },
              { label: 'Alcance', value: fmt(active.alcance), color },
              { label: 'Frequência', value: `${active.freq}×`, color: '#ea8a29' },
            ].map((m, i) => (
              <div key={i}>
                <p className="text-[10px] font-bold text-muted mb-0.5">{m.label}</p>
                <p className="text-xl font-extrabold" style={{ color: m.color }}>{m.value}</p>
              </div>
            ))}
          </div>
          <div className="p-5">
            <p className="text-[11px] text-muted leading-relaxed mb-4">{active.obs}</p>
            <div className="mb-1 flex justify-between text-[10px]">
              <span className="text-muted font-bold">Cobertura do público ({fmt(active.audienciaRef)})</span>
              <span className="font-extrabold" style={{ color }}>{active.cobertura}%</span>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden" style={{ background: color + '15' }}>
              <motion.div className="h-full rounded-full" style={{ background: color }}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(active.cobertura, 100)}%` }}
                transition={{ duration: 0.9, ease: 'easeOut' }} />
            </div>
          </div>
        </motion.div>
      )}

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

      {/* Tese dos cenários */}
      <div className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <div className="px-5 py-4 border-b border-border" style={{ background: 'linear-gradient(90deg, ' + color + '08 0%, transparent 100%)' }}>
          <p className="text-sm font-extrabold text-text">📋 Tese dos cenários</p>
          <p className="text-[11px] text-muted mt-0.5">O que fundamenta cada projeção</p>
        </div>

        <div className="p-5 border-b border-border">
          <p className="text-xs font-extrabold text-text mb-2">🔬 Premissas comuns</p>
          <div className="space-y-2">
            {[
              { label: 'CPM R$ 5,90', desc: 'Custo real por 1.000 impressões — histórico da conta. Não é estimativa.' },
              { label: 'CPMA R$ 30,63', desc: 'CPM × freq histórica 5,19×. Custo real para alcançar 1.000 pessoas únicas.' },
              { label: `Audiência ${fmt(CAMP.audiencia)} em ${CAMP.cidades} cidades do ${CAMP.estado}`, desc: 'Estimativa IBGE 2022 × penetração Meta por porte de município. Agreste + Sertão + Vale do São Francisco.' },
              { label: `Meta: freq ${CAMP.freqMeta}×`, desc: 'Limiar de recall espontâneo de marca. Abaixo disso, o impacto é fraco demais para gerar preferência no PDV.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: color }} />
                <div>
                  <span className="text-[11px] font-extrabold text-text">{item.label}</span>
                  <span className="text-[11px] text-muted"> — {item.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {[
          {
            emoji: '📊', label: 'Realista', tagColor: '#6eda2c',
            tese: `É o espelho fiel do investimento atual de ${brl(CAMP.budget)}. Com CPMA de R$ 30,63, esse orçamento alcança ${fmt(C1.alcance)} pessoas únicas — ${C1.cobertura}% do público das ${CAMP.cidades} cidades.`,
            calculo: `${brl(CAMP.budget)} ÷ CPMA R$ 30,63 × 1.000 = ${fmt(C1.alcance)} pessoas`,
            quando: 'Manutenção de presença com budget atual. Gera dados reais de CPM e frequência no mercado de PE.',
          },
          {
            emoji: '🚀', label: 'Otimista', tagColor: '#60a5fa',
            tese: `Representa 2,5× o orçamento atual. O alcance cresce proporcionalmente para ${fmt(C2.alcance)} pessoas (${C2.cobertura}% do público). A frequência se mantém histórica — mais verba compra mais pessoas novas.`,
            calculo: `${brl(C2.budget)} ÷ CPMA R$ 30,63 × 1.000 = ${fmt(C2.alcance)} pessoas`,
            quando: 'Lançamento formal da Dupla de Arroz em PE ou quando há disponibilidade para escalar cobertura rapidamente.',
          },
          {
            emoji: '🎯', label: 'Cobertura total', tagColor: color,
            tese: `É o investimento para que ninguém nas ${CAMP.cidades} cidades passe os ${CAMP.days} dias sem ver a Caçarola pelo menos ${CAMP.freqMeta} vezes. O CPMA sobe para R$ ${(HIST.cpm * CAMP.freqMeta).toFixed(2).replace('.', ',')} porque cada pessoa é impactada mais vezes.`,
            calculo: `(${fmt(CAMP.audiencia)} frio + ${fmt(CAMP.rmktAudiencia)} rmkt) × R$ ${(HIST.cpm * CAMP.freqMeta).toFixed(2).replace('.', ',')} ÷ 1.000 = ${brl(C3.budget)}`,
            quando: 'Meta estratégica de médio prazo. Saturação do mercado de PE para o produto Dupla de Arroz.',
          },
        ].map((c, i) => (
          <div key={i} className="p-5 border-b border-border last:border-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base">{c.emoji}</span>
              <p className="text-xs font-extrabold text-text">{c.label}</p>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full ml-auto"
                style={{ background: c.tagColor + '18', color: c.tagColor }}>tese</span>
            </div>
            <p className="text-[11px] text-muted leading-relaxed mb-2">{c.tese}</p>
            <div className="rounded-lg px-3 py-2 mb-2" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
              <p className="text-[10px] font-extrabold text-muted uppercase tracking-wide mb-0.5">Como calculamos</p>
              <p className="text-[11px] font-bold text-text">{c.calculo}</p>
            </div>
            <p className="text-[10px] text-muted"><span className="font-extrabold text-text">Quando usar: </span>{c.quando}</p>
          </div>
        ))}
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
            Funil de impacto — {CAMP.cidades} cidades {CAMP.estado} · {CAMP.days} dias
          </p>
          <p className="text-xl font-black text-white mb-5">Do desconhecido ao lembrado</p>

          <div className="flex flex-col items-center gap-3">
            {[
              {
                icon: '👥', label: `Público total das ${CAMP.cidades} cidades`, value: fmt(CAMP.audiencia),
                sub: 'Meta audience estimada — PE',
                obs: `Estimativa Meta para os ${CAMP.cidades} municípios selecionados em ${CAMP.estado}. É o universo máximo alcançável — a base de todos os cálculos.`,
                color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)',
              },
              {
                icon: '🔵', label: 'Alcance frio (atual)', value: `${fmt(REAL.frio.alcance)} pessoas`,
                sub: `${(REAL.frio.cobertura * 100).toFixed(1)}% do público · freq ${HIST.freq}× · ${brl(REAL.frio.budget)}`,
                obs: `Pessoas que ainda não conhecem a Caçarola em ${CAMP.estado}. CPM frio estimado R$ ${HIST.cpmFrio.toFixed(2).replace('.', ',')} → ${fmt(_impFrio)} impressões. A freq ${HIST.freq}× resulta em ${fmt(_alcanceFrio)} pessoas novas alcançadas.`,
                color: '#60a5fa', bg: '#60a5fa10',
              },
              { icon: '↓', label: '', value: '', sub: 'engajam e entram no remarketing', color: 'rgba(255,255,255,0.2)', bg: 'transparent' },
              {
                icon: '🟠', label: 'Remarketing (atual)', value: `${fmt(REAL.rmkt.alcance)} pessoas`,
                sub: `${(REAL.rmkt.cobertura * 100).toFixed(1)}% do pool · freq ${CAMP.freqMeta}× · ${brl(REAL.rmkt.budget)}`,
                obs: `Público mais quente — já interagiu com a Caçarola. Freq ${CAMP.freqMeta}× para criar lembrança real. Com ${brl(REAL.rmkt.budget)}, reforçamos ${fmt(_alcanceRmkt)} pessoas com mais pressão de exposição.`,
                color: '#ea8a29', bg: '#ea8a2910',
              },
              { icon: '↓', label: '', value: '', sub: 'reconhecem, engajam, buscam no ponto de venda', color: 'rgba(255,255,255,0.2)', bg: 'transparent' },
              {
                icon: '🏆', label: 'Lembrança de marca', value: `${CAMP.freqMeta}× de exposição`,
                sub: 'frequência ideal para recall e consideração',
                obs: `${CAMP.freqMeta} exposições é o patamar onde a Caçarola começa a ser lembrada espontaneamente. Abaixo disso, o impacto é fraco demais para gerar preferência no supermercado.`,
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
          Investimento para atingir freq {CAMP.freqMeta}× em toda a audiência das {CAMP.cidades} cidades do {CAMP.estado}.
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
              obs: `Frio: ${fmt(CAMP.audiencia)} × CPMA R$ ${cpmaFrioFreq7.toFixed(2).replace('.', ',')} ÷ 1.000 = ${brl(_goalFrioBudget)} · Rmkt: ${fmt(CAMP.rmktAudiencia)} × CPMA R$ ${cpmaRmktFreq7.toFixed(2).replace('.', ',')} ÷ 1.000 = ${brl(_goalRmktBudget)}`,
            },
            {
              label: 'Pessoas adicionais não alcançadas', value: `+${fmt(CAMP.audiencia + CAMP.rmktAudiencia - REAL.total.alcance)}`,
              sub: 'com o orçamento atual', color: '#ea8a29', icon: '👤',
              obs: `Do total de ${fmt(CAMP.audiencia + CAMP.rmktAudiencia)} no universo, ${fmt(REAL.total.alcance)} são alcançadas hoje.`,
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

      {/* Distribuição do orçamento */}
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
            Frio: {brl(CAMP.budget / 2)} → CPM R$ {HIST.cpmFrio.toFixed(2).replace('.', ',')} → {fmt(_impFrio)} impr. → {fmt(_alcanceFrio)} pessoas (freq {HIST.freq}×)&nbsp;&nbsp;·&nbsp;&nbsp;Rmkt: {brl(CAMP.budget / 2)} → CPM R$ {HIST.cpmRmkt.toFixed(2).replace('.', ',')} → {fmt(_impRmkt)} impr. → {fmt(_alcanceRmkt)} pessoas (freq {CAMP.freqMeta}×)
          </p>
        </div>

        {/* Cards lado a lado */}
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border">
          {[
            {
              label: 'Público Frio', icon: '🔵', color: '#60a5fa',
              objetivo: 'Reconhecimento de marca',
              impressoes: _impFrio, alcance: _alcanceFrio, budget: CAMP.budget / 2,
              freq: HIST.freq,
              cobertura: REAL.frio.cobertura, audienciaRef: CAMP.audiencia,
              coberturaLabel: `${(REAL.frio.cobertura * 100).toFixed(1)}% dos ${fmt(CAMP.audiencia)} do ${CAMP.estado}`,
              formulaImp: `${brl(CAMP.budget / 2)} ÷ CPM R$ ${HIST.cpmFrio.toFixed(2).replace('.', ',')} × 1.000`,
              formulaAlc: `${fmt(_impFrio)} impressões ÷ freq ${HIST.freq}×`,
              freqLabel: `${HIST.freq}× (freq histórica da conta)`,
              obs: `Pessoas que nunca viram a Caçarola em ${CAMP.estado}. Objetivo: apresentar o produto. Usamos freq histórica (${HIST.freq}×) para maximizar o alcance.`,
            },
            {
              label: 'Remarketing', icon: '🟠', color: '#ea8a29',
              objetivo: 'Reforço e lembrança',
              impressoes: _impRmkt, alcance: _alcanceRmkt, budget: CAMP.budget / 2,
              freq: CAMP.freqMeta,
              cobertura: REAL.rmkt.cobertura, audienciaRef: CAMP.rmktAudiencia,
              coberturaLabel: `${(REAL.rmkt.cobertura * 100).toFixed(1)}% do pool de ${fmt(CAMP.rmktAudiencia)}`,
              formulaImp: `${brl(CAMP.budget / 2)} ÷ CPM R$ ${HIST.cpmRmkt.toFixed(2).replace('.', ',')} × 1.000`,
              formulaAlc: `${fmt(_impRmkt)} impressões ÷ freq ${CAMP.freqMeta}×`,
              freqLabel: `${CAMP.freqMeta}× (meta de recall)`,
              obs: `Público já aquecido — interagiu com a Caçarola anteriormente. Freq ${CAMP.freqMeta}× para consolidar lembrança e empurrar para o PDV.`,
            },
          ].map((item, i) => (
            <div key={i} className="p-5">
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

              <p className="text-[11px] text-muted leading-relaxed">{item.obs}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: TESE METODOLÓGICA
══════════════════════════════════════════ */
function Tese({ color }) {
  const blocos = [
    {
      emoji: '📡',
      titulo: 'De onde vêm os dados',
      cor: '#6eda2c',
      linhas: [
        {
          label: 'Fonte principal',
          valor: 'Histórico real da conta Caçarola — campanha SC Mistura pra Bolo (Meta Ads)',
          detalhe: `CPM real: R$ ${HIST.cpm.toFixed(2).replace('.', ',')} · CPMA real: R$ ${HIST.cpma.toFixed(2).replace('.', ',')} · Frequência gerada: ${HIST.freq}×`,
        },
        {
          label: 'Por que usar o SC para projetar o PE?',
          valor: 'A campanha de PE é a primeira no estado — ainda não temos histórico próprio',
          detalhe: 'O SC é o mercado com dados reais mais próximo disponível. CPM e comportamento do algoritmo Meta em cidades de porte similar funcionam como referência conservadora.',
        },
        {
          label: 'Frequência histórica (5,19×)',
          valor: `Derivada da fórmula: CPMA ÷ CPM = R$ ${HIST.cpma.toFixed(2).replace('.', ',')} ÷ R$ ${HIST.cpm.toFixed(2).replace('.', ',')}`,
          detalhe: 'Não é uma meta — é o que a conta naturalmente gerou. Significa que, em média, cada pessoa viu o anúncio 5,19 vezes no período da campanha SC.',
        },
      ],
    },
    {
      emoji: '✂️',
      titulo: 'Por que CPMs diferentes por público',
      cor: color,
      linhas: [
        {
          label: `CPM frio estimado: R$ ${HIST.cpmFrio.toFixed(2).replace('.', ',')}`,
          valor: '~17% abaixo da média blended (R$ 5,90)',
          detalhe: 'Público amplo e inexplorado — o algoritmo tem espaço para otimizar e comprar impressões baratas. Validação: média harmônica de frio + rmkt resulta em R$ 5,90 ✓',
        },
        {
          label: `CPM rmkt estimado: R$ ${HIST.cpmRmkt.toFixed(2).replace('.', ',')}`,
          valor: '~25% acima da média blended (R$ 5,90)',
          detalhe: 'Pool menor (600 K pessoas) e mais disputado — múltiplos anunciantes segmentam o mesmo público quente simultaneamente, elevando o leilão.',
        },
        {
          label: 'Validação da divisão 50/50',
          valor: `Média harmônica: 2 ÷ (1/${HIST.cpmFrio.toFixed(2).replace('.', ',')} + 1/${HIST.cpmRmkt.toFixed(2).replace('.', ',')}) = R$ 5,90`,
          detalhe: 'A divisão é consistente — os dois CPMs estimados, combinados em partes iguais, reconstituem exatamente o CPM blended histórico.',
        },
      ],
    },
    {
      emoji: '🗺️',
      titulo: 'Como estimamos a audiência das 97 cidades',
      cor: '#60a5fa',
      linhas: [
        {
          label: 'Base populacional',
          valor: 'IBGE Censo 2022 — população residente por município',
          detalhe: 'Caruaru (362 K), Petrolina (343 K) e Garanhuns (140 K) concentram a maior fatia. Restante distribuído entre 94 cidades menores do Agreste, Sertão e Vale do São Francisco.',
        },
        {
          label: 'Penetração Meta por porte de cidade',
          valor: '>100K: 70% · 50–100K: 65% · 20–50K: 60% · 5–20K: 53%',
          detalhe: 'Cidades grandes têm maior acesso à internet e uso de redes sociais. A taxa de penetração decai com o porte — padrão observado em dados públicos de uso do Meta no Brasil.',
        },
        {
          label: `Total estimado: ${fmt(CAMP.audiencia)} contas ativas`,
          valor: `Pop. total das 97 cidades ≈ 3,17M hab → ~${fmt(CAMP.audiencia)} contas Meta`,
          detalhe: `Pool de remarketing: ~${fmt(CAMP.rmktAudiencia)} pessoas (estimativa de audiência que já interagiu com a Caçarola em PE via tráfego orgânico, visitas ao site ou engajamento).`,
        },
      ],
    },
    {
      emoji: '🎯',
      titulo: 'Como as projeções são calculadas',
      cor: '#ea8a29',
      linhas: [
        {
          label: 'Cenários C1/C2 — usam CPMA blended histórico',
          valor: `CPMA R$ ${HIST.cpma.toFixed(2).replace('.', ',')} (freq ${HIST.freq}×) — o que a conta realmente entregou`,
          detalhe: 'É o espelho do comportamento real. Não presume nenhuma otimização adicional — é conservador por definição.',
        },
        {
          label: 'Cenário C3 (cobertura total) — usa CPMA meta freq 7×',
          valor: `CPMA frio R$ ${cpmaFrioFreq7.toFixed(2).replace('.', ',')} · CPMA rmkt R$ ${cpmaRmktFreq7.toFixed(2).replace('.', ',')}`,
          detalhe: `Para cobrir ${fmt(CAMP.audiencia)} (frio) + ${fmt(CAMP.rmktAudiencia)} (rmkt) com freq ${CAMP.freqMeta}× seriam necessários R$ ${(GOAL.total.budget / 1000).toFixed(0)} K — investimento de escala.`,
        },
        {
          label: 'Distribuição atual: 50% frio / 50% rmkt',
          valor: `R$ 500 frio → ${fmt(_impFrio)} impressões (CPM ${HIST.cpmFrio.toFixed(2).replace('.', ',')}) · R$ 500 rmkt → ${fmt(_impRmkt)} impressões (CPM ${HIST.cpmRmkt.toFixed(2).replace('.', ',')})`,
          detalhe: `Frio alcança ${fmt(_alcanceFrio)} pessoas novas (freq ${HIST.freq}×). Rmkt reforça ${fmt(_alcanceRmkt)} pessoas já impactadas (freq ${CAMP.freqMeta}×). Total: ${fmt(REAL.total.alcance)} pessoas únicas.`,
        },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {/* Intro */}
      <div className="rounded-2xl p-5" style={{ background: color + '08', border: `1.5px solid ${color}25` }}>
        <p className="text-sm font-extrabold text-text mb-1">📋 Metodologia das projeções</p>
        <p className="text-[11px] text-muted leading-relaxed">
          Todas as projeções da campanha Dupla de Arroz PE partem de <strong>dados reais da conta Caçarola</strong> — não de benchmarks genéricos de mercado.
          O CPM de R$ {HIST.cpm.toFixed(2).replace('.', ',')} é o custo efetivo pago em {CAMP.cidades > 1 ? 'campanhas anteriores' : 'campanha anterior'} no SC.
          O que não existe ainda (histórico de PE, split por público) é estimado com critério explícito e validado matematicamente.
        </p>
      </div>

      {/* Blocos */}
      {blocos.map((b, i) => (
        <motion.div key={i}
          initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
          className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
          <div className="px-5 py-4 border-b border-border flex items-center gap-2"
            style={{ background: `linear-gradient(90deg, ${b.cor}08 0%, transparent 100%)` }}>
            <span>{b.emoji}</span>
            <p className="text-sm font-extrabold text-text">{b.titulo}</p>
          </div>
          <div className="divide-y divide-border">
            {b.linhas.map((l, j) => (
              <div key={j} className="px-5 py-4">
                <div className="flex items-start gap-2 mb-1">
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                    style={{ background: b.cor + '15', color: b.cor }}>{l.label}</span>
                </div>
                <p className="text-[12px] font-bold text-text mb-1">{l.valor}</p>
                <p className="text-[10px] text-muted leading-relaxed">{l.detalhe}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Rodapé */}
      <div className="rounded-xl p-4" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
        <p className="text-[10px] text-muted leading-relaxed">
          <strong>Grau de certeza por variável:</strong>{' '}
          CPM blended (R$ {HIST.cpm.toFixed(2).replace('.', ',')}) — <strong style={{ color: '#6eda2c' }}>real ✓</strong> ·{' '}
          CPMA blended (R$ {HIST.cpma.toFixed(2).replace('.', ',')}) — <strong style={{ color: '#6eda2c' }}>real ✓</strong> ·{' '}
          Freq histórica ({HIST.freq}×) — <strong style={{ color: '#6eda2c' }}>derivada ✓</strong> ·{' '}
          CPM frio/rmkt (R$ {HIST.cpmFrio.toFixed(2).replace('.', ',')} / R$ {HIST.cpmRmkt.toFixed(2).replace('.', ',')}) — <strong style={{ color: color }}>estimativa validada</strong> ·{' '}
          Audiência PE ({fmt(CAMP.audiencia)}) — <strong style={{ color: color }}>estimativa IBGE+Meta</strong>.{' '}
          Após os primeiros 15–30 dias de campanha no PE, o CPM real deve substituir todas as estimativas.
        </p>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════
   COMPONENTE PRINCIPAL
══════════════════════════════════════════ */
export default function CacarolaArrozPE({ color = COR }) {
  const TABS = ['📋 Tese', '📊 Indicadores', '🎯 Cenários', '📐 Funil']
  const [tab, setTab] = useState('📋 Tese')

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: color + '18', border: `1.5px solid ${color}35` }}>🍚</div>
          <div>
            <h2 className="text-xl font-extrabold text-text">Dupla de Arroz — {CAMP.estado}</h2>
            <p className="text-xs text-muted">{CAMP.cidades} municípios · {fmt(CAMP.audiencia)} audiência estimada · Orçamento {brl(CAMP.budget)}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-white rounded-2xl p-1.5 w-fit" style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.07)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
            style={tab === t
              ? { background: color + '18', color, boxShadow: `0 0 0 1.5px ${color}35` }
              : { color: '#8890b5' }}>
            {t}
          </button>
        ))}
      </div>

      {tab === '📋 Tese'         && <Tese        color={color} />}
      {tab === '📊 Indicadores' && <Indicadores color={color} />}
      {tab === '🎯 Cenários'    && <Cenarios    color={color} />}
      {tab === '📐 Funil'       && <Funil       color={color} />}
    </div>
  )
}
