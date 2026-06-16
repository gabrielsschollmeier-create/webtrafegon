import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#f87171'

const HIST = { cpm: 1.50, cpma: 5.50, freq: parseFloat((5.50 / 1.50).toFixed(2)) }
const CAMP = { budget: 4000, days: 60, audiencia: 2800000, rmktAudiencia: 1340000, cidades: 97, freqMeta: 7 }
const daily = CAMP.budget / CAMP.days
const totalImp = Math.round(CAMP.budget / HIST.cpm * 1000)
const cpmaFreq7 = HIST.cpm * CAMP.freqMeta

const REAL = {
  frio:       { budget: 2000, alcance: 190000, freq: 7, cobertura: 190000 / CAMP.audiencia },
  rmkt:       { budget: 2000, alcance: 190000, freq: 7, cobertura: 190000 / CAMP.rmktAudiencia },
  total:      { alcance: 380000, cobertura: 380000 / CAMP.audiencia },
}
const GOAL = {
  frio:       { budget: 29400, alcance: CAMP.audiencia, freq: 7 },
  rmkt:       { budget: 14070, alcance: CAMP.rmktAudiencia, freq: 7 },
  total:      { budget: 43470, daily: Math.round(43470 / CAMP.days) },
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      <p className="text-sm font-extrabold text-text mb-4">{title}</p>
      {children}
    </div>
  )
}

function GaugeMini({ pct, color, label, sub }) {
  const r = 32, c = 2 * Math.PI * r
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="relative w-20 h-20">
        <svg viewBox="0 0 80 80" className="w-full h-full" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="40" cy="40" r={r} fill="none" stroke="rgba(26,29,46,0.06)" strokeWidth="7" />
          <motion.circle cx="40" cy="40" r={r} fill="none" stroke={color} strokeWidth="7"
            strokeLinecap="round" strokeDasharray={c}
            initial={{ strokeDashoffset: c }}
            animate={{ strokeDashoffset: c * (1 - Math.min(pct, 1)) }}
            transition={{ duration: 1.2, ease: 'easeOut' }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-extrabold text-text leading-none">{Math.round(pct * 100)}%</span>
        </div>
      </div>
      <p className="text-[11px] font-extrabold text-text text-center">{label}</p>
      {sub && <p className="text-[10px] text-muted text-center leading-tight">{sub}</p>}
    </div>
  )
}

function StatusPill({ ok, label }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full"
      style={{ background: ok ? '#6eda2c20' : '#ef444420', color: ok ? '#6eda2c' : '#ef4444' }}>
      {ok ? '✅' : '❌'} {label}
    </span>
  )
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
  const derivados = [
    { label: 'Impressões disponíveis', formula: `${brl(CAMP.budget)} ÷ CPM R$ 1,50`, value: fmt(totalImp), color: color },
    { label: 'CPMA projetado (freq 7×)', formula: `R$ 1,50 × 7`, value: 'R$ 10,50', color: '#ea8a29' },
    { label: 'Diária da campanha', formula: `${brl(CAMP.budget)} ÷ ${CAMP.days} dias`, value: brl(daily), color: '#60a5fa' },
  ]

  return (
    <div className="space-y-4">

      {/* Hero indicadores */}
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #1a0808 0%, #2d1010 100%)', boxShadow: '0 8px 32px rgba(248,113,113,0.15)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-3" style={{ color: color + 'aa' }}>
            Caçarola · Base histórica da conta Meta Ads
          </p>
          <div className="grid grid-cols-3 gap-6">
            {[
              { label: 'CPM médio', value: 'R$ 1,50', sub: 'Custo por 1.000 impressões', color: '#6eda2c' },
              { label: 'CPMA', value: 'R$ 4,57', sub: 'Custo por 1.000 contas alcançadas', color: color },
              { label: 'Frequência média', value: '3,37×', sub: 'Exibições por pessoa (histórico)', color: '#60a5fa' },
            ].map((item, i) => (
              <div key={i}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>{item.label}</p>
                <p className="text-3xl font-black leading-none" style={{ color: item.color }}>{item.value}</p>
                <p className="text-[10px] mt-1" style={{ color: 'rgba(255,255,255,0.3)' }}>{item.sub}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-[11px] font-bold text-white/60">
              📌 O CPMA de <strong className="text-white">R$ 4,57</strong> é o custo real para atingir 1.000 pessoas únicas na conta.
              A frequência histórica de <strong className="text-white">3,37×</strong> confirma: cada pessoa viu os anúncios em média 3,37 vezes.
              Aumentar a frequência meta para <strong className="text-white">7×</strong> dobra o CPMA para <strong className="text-white">R$ 10,50</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Derivados */}
      <Section title="🔢 Derivados da campanha atual">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {derivados.map((d, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4" style={{ background: d.color + '08', border: `1px solid ${d.color}25` }}>
              <p className="text-[10px] text-muted mb-2">{d.formula}</p>
              <p className="text-xl font-extrabold" style={{ color: d.color }}>{d.value}</p>
              <p className="text-[11px] font-bold text-text mt-1">{d.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Relação CPM → CPMA → Freq */}
      <Section title="📐 Como CPM, CPMA e Frequência se relacionam">
        <div className="space-y-3">
          {[
            { eq: 'CPMA = CPM × Frequência', ex: 'R$ 4,57 = R$ 1,50 × 3,04×', note: '(histórico conta — ligeira variação por arredondamento)' },
            { eq: 'Alcance = Impressões ÷ Frequência', ex: `${fmt(totalImp)} ÷ 7 = 380K pessoas`, note: 'quanto maior a frequência, menor o alcance' },
            { eq: 'Impressões = Budget ÷ CPM × 1.000', ex: `${brl(CAMP.budget)} ÷ 1,50 × 1.000 = ${fmt(totalImp)}`, note: 'fixo — não muda com a frequência' },
          ].map((r, i) => (
            <div key={i} className="rounded-xl p-4" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
              <p className="text-sm font-extrabold text-text mb-0.5">{r.eq}</p>
              <p className="text-xs font-bold" style={{ color }}>{r.ex}</p>
              <p className="text-[10px] text-muted mt-0.5">{r.note}</p>
            </div>
          ))}
        </div>
      </Section>

    </div>
  )
}

/* ══════════════════════════════════════════
   ABA: CENÁRIOS
══════════════════════════════════════════ */
function Cenarios({ color }) {
  // Cenário 1 — Realista: budget atual, freq histórica
  const C1 = {
    id: 'realista', emoji: '📊', label: 'Realista',
    tag: 'Orçamento atual', tagColor: '#6eda2c', dark: false,
    budget: 4000, daily: 66.67,
    alcance: Math.round(CAMP.budget / HIST.cpma * 1000),
    freq: HIST.freq,
    cpma: HIST.cpma,
    descricao: 'O que R$ 4.000 entrega com o comportamento histórico da conta.',
  }
  C1.cobertura = parseFloat((C1.alcance / CAMP.audiencia * 100).toFixed(1))

  // Cenário 2 — Otimista: budget maior, mais cobertura com freq histórica
  const C2_budget = 10000
  const C2 = {
    id: 'otimista', emoji: '🚀', label: 'Otimista',
    tag: 'Crescimento', tagColor: '#60a5fa', dark: false,
    budget: C2_budget, daily: parseFloat((C2_budget / CAMP.days).toFixed(2)),
    alcance: Math.round(C2_budget / HIST.cpma * 1000),
    freq: HIST.freq,
    cpma: HIST.cpma,
    descricao: 'Aumentar o investimento para cobrir a maioria do público com a frequência histórica.',
  }
  C2.cobertura = parseFloat((C2.alcance / CAMP.audiencia * 100).toFixed(1))

  // Cenário 3 — Investimento para 100% + freq 7×
  const C3_budget = GOAL.total.budget
  const C3 = {
    id: 'total', emoji: '🎯', label: 'Cobertura total',
    tag: 'Meta ideal', tagColor: color, dark: true,
    budget: C3_budget, daily: GOAL.total.daily,
    alcance: CAMP.audiencia + CAMP.rmktAudiencia,
    freq: CAMP.freqMeta,
    cpma: HIST.cpm * CAMP.freqMeta,
    descricao: `Freq ${CAMP.freqMeta}× para 100% do público frio + 100% do pool de remarketing.`,
  }
  C3.cobertura = 100

  const cenarios = [C1, C2, C3]
  const [ativo, setAtivo] = useState('realista')
  const c = cenarios.find(x => x.id === ativo)

  return (
    <div className="space-y-4">

      {/* Base */}
      <div className="rounded-2xl px-5 py-4 flex flex-wrap gap-6 items-center"
        style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
        <span className="text-[11px] text-muted font-bold">📌 Base</span>
        {[
          { label: 'CPM',        value: 'R$ 1,50'    },
          { label: 'CPMA',       value: 'R$ 5,50'    },
          { label: 'Freq hist.', value: `${HIST.freq}×` },
          { label: 'Público',    value: '~2,8M'      },
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
            <div className="flex items-center gap-3 mb-5 flex-wrap">
              <span className="text-2xl">{c.emoji}</span>
              <div>
                <p className="text-lg font-extrabold" style={{ color: c.dark ? 'white' : '#1a1d2e' }}>{c.label}</p>
                <p className="text-[11px]" style={{ color: c.tagColor }}>{c.descricao}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Investimento',    value: brl(c.budget),                             sub: `${brl(c.daily)}/dia`, icon: '💰' },
                { label: 'Pessoas alcançadas', value: fmt(c.alcance),                          sub: `${c.cobertura}% dos 2,8M`, icon: '👥' },
                { label: 'Frequência',      value: `${c.freq}×`,                              sub: 'exibições por pessoa', icon: '🔁' },
                { label: 'CPMA estimado',   value: `R$ ${c.cpma.toFixed(2).replace('.', ',')}`, sub: 'por 1.000 alcançadas', icon: '📊' },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-4 text-center"
                  style={{
                    background: c.dark ? 'rgba(255,255,255,0.05)' : c.tagColor + '08',
                    border: `1px solid ${c.tagColor}${c.dark ? '30' : '20'}`,
                  }}>
                  <p className="text-xl mb-1">{item.icon}</p>
                  <p className="text-xl font-extrabold" style={{ color: c.dark ? 'white' : c.tagColor }}>{item.value}</p>
                  <p className="text-[10px] font-bold mt-0.5" style={{ color: c.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>{item.label}</p>
                  <p className="text-[9px]" style={{ color: c.tagColor }}>{item.sub}</p>
                </div>
              ))}
            </div>

            <div>
              <div className="flex justify-between text-[10px] font-bold mb-2"
                style={{ color: c.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>
                <span>Cobertura do público (2,8M)</span>
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

      {/* Comparativo rápido */}
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
                { label: 'Investimento',  v: [brl(C1.budget), brl(C2.budget), brl(C3.budget)] },
                { label: 'Diária',        v: [`${brl(C1.daily)}`, `${brl(C2.daily)}`, `${brl(C3.daily)}`] },
                { label: 'Alcance',       v: [fmt(C1.alcance), fmt(C2.alcance), '~' + fmt(C3.alcance)] },
                { label: 'Cobertura',     v: [`${C1.cobertura}%`, `${C2.cobertura}%`, '~100%'] },
                { label: 'Frequência',    v: [`${C1.freq}×`, `${C2.freq}×`, `${C3.freq}×`] },
                { label: 'CPMA',          v: [`R$ ${C1.cpma.toFixed(2).replace('.', ',')}`, `R$ ${C2.cpma.toFixed(2).replace('.', ',')}`, `R$ ${C3.cpma.toFixed(2).replace('.', ',')}`] },
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
            Funil de impacto — 97 cidades SC · {CAMP.days} dias
          </p>
          <p className="text-xl font-black text-white mb-5">Do desconhecido ao lembrado</p>

          <div className="flex flex-col items-center gap-3">
            {[
              { icon: '👥', label: 'Público total das 97 cidades', value: fmt(CAMP.audiencia), sub: 'Meta audience estimada', color: 'rgba(255,255,255,0.3)', bg: 'rgba(255,255,255,0.04)' },
              { icon: '🔵', label: 'Alcance frio (atual)', value: `${fmt(REAL.frio.alcance)} pessoas`, sub: `${(REAL.frio.cobertura*100).toFixed(1)}% do público · freq 7× · ${brl(REAL.frio.budget)}`, color: '#60a5fa', bg: '#60a5fa10' },
              { icon: '↓', label: '', value: '', sub: 'engajam e entram no remarketing', color: 'rgba(255,255,255,0.2)', bg: 'transparent' },
              { icon: '🟠', label: 'Remarketing (atual)', value: `${fmt(REAL.rmkt.alcance)} pessoas`, sub: `${(REAL.rmkt.cobertura*100).toFixed(1)}% do pool · freq 7× · ${brl(REAL.rmkt.budget)}`, color: '#ea8a29', bg: '#ea8a2910' },
              { icon: '↓', label: '', value: '', sub: 'reconhecem, engajam, convertem', color: 'rgba(255,255,255,0.2)', bg: 'transparent' },
              { icon: '🏆', label: 'Lembrança de marca', value: '7× de exposição', sub: 'frequência ideal para recall e consideração', color: color, bg: color + '10' },
            ].map((item, i) => item.icon === '↓' ? (
              <div key={i} className="flex flex-col items-center gap-0.5" style={{ color: item.color }}>
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
                <span className="text-xs">↓</span>
                <p className="text-[10px] italic" style={{ color: item.color }}>{item.sub}</p>
                <div className="w-px h-4" style={{ background: 'rgba(255,255,255,0.1)' }} />
              </div>
            ) : (
              <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                className="w-full rounded-2xl px-5 py-4 flex items-center gap-4"
                style={{ background: item.bg, border: `1px solid ${item.color}25` }}>
                <span className="text-2xl">{item.icon}</span>
                <div className="flex-1">
                  <p className="text-xs font-extrabold" style={{ color: item.color }}>{item.label}</p>
                  {item.sub && <p className="text-[10px] text-white/40 mt-0.5">{item.sub}</p>}
                </div>
                {item.value && <p className="text-lg font-extrabold text-white flex-shrink-0">{item.value}</p>}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* O que falta para a meta */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-4">🚀 Para cobrir 100% da região</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Investimento adicional', value: brl(GOAL.total.budget - CAMP.budget), sub: 'além dos R$ 4.000 atuais', color: '#ef4444', icon: '💰' },
            { label: 'Total necessário', value: brl(GOAL.total.budget), sub: `${brl(GOAL.total.daily)}/dia por ${CAMP.days} dias`, color: color, icon: '🎯' },
            { label: 'Pessoas adicionais', value: `+${fmt(CAMP.audiencia + CAMP.rmktAudiencia - REAL.total.alcance)}`, sub: 'que ainda não serão alcançadas', color: '#ea8a29', icon: '👤' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
              className="rounded-2xl p-4 flex flex-col gap-2" style={{ background: item.color + '06', border: `1px solid ${item.color}20` }}>
              <span className="text-xl">{item.icon}</span>
              <p className="text-xl font-extrabold" style={{ color: item.color }}>{item.value}</p>
              <p className="text-xs font-bold text-text">{item.label}</p>
              <p className="text-[10px] text-muted">{item.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Distribuição das impressões */}
      <Section title="📊 Como as impressões são distribuídas">
        <div className="space-y-3">
          {[
            { label: 'Público frio', impressoes: 1333333, budget: 2000, alcance: 190000, color: '#60a5fa' },
            { label: 'Remarketing', impressoes: 1333333, budget: 2000, alcance: 190000, color: '#ea8a29' },
          ].map((item, i) => (
            <div key={i} className="rounded-xl overflow-hidden" style={{ border: `1px solid ${item.color}25` }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ background: item.color + '08' }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                  <p className="text-sm font-extrabold text-text">{item.label}</p>
                </div>
                <div className="flex gap-6 text-xs">
                  <div className="text-right">
                    <p className="font-extrabold" style={{ color: item.color }}>{fmt(item.impressoes)}</p>
                    <p className="text-muted">impressões</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-text">{fmt(item.alcance)}</p>
                    <p className="text-muted">pessoas</p>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-text">{brl(item.budget)}</p>
                    <p className="text-muted">verba</p>
                  </div>
                </div>
              </div>
              <div className="px-4 py-2.5">
                <div className="h-2 rounded-full overflow-hidden" style={{ background: item.color + '12' }}>
                  <motion.div className="h-full rounded-full" style={{ background: item.color }}
                    initial={{ width: 0 }} animate={{ width: '50%' }} transition={{ duration: 0.8, delay: i * 0.15 }} />
                </div>
                <p className="text-[10px] text-muted mt-1">50% do orçamento total</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl px-4 py-3" style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
          <p className="text-[11px] font-bold text-text">
            Total: <span style={{ color: COR }}>{fmt(totalImp)} impressões</span> com
            <span style={{ color: '#60a5fa' }}> {fmt(REAL.total.alcance)} pessoas únicas</span> a
            <span style={{ color: '#ea8a29' }}> frequência 7×</span>
          </p>
        </div>
      </Section>

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
