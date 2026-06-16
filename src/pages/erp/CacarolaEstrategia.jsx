import { useState } from 'react'
import { motion } from 'framer-motion'

const COR = '#f87171'

const HIST = { cpm: 1.50, cpma: 4.57, freq: 3.37 }
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
   ABA: CENÁRIOS META VS REALIDADE
══════════════════════════════════════════ */
function Cenarios({ color }) {
  const [view, setView] = useState('comparativo')

  const rows = [
    { label: 'Orçamento total',      real: brl(CAMP.budget),              meta: brl(GOAL.total.budget),  gap: `− ${brl(GOAL.total.budget - CAMP.budget)}`, ok: false },
    { label: 'Diária',               real: brl(daily),                    meta: `${brl(GOAL.total.daily)}/dia`, gap: `− ${brl(GOAL.total.daily - daily)}`, ok: false },
    { label: 'Frequência (frio)',     real: `${CAMP.freqMeta}×`,           meta: `${CAMP.freqMeta}×`,     gap: '—',                                        ok: true  },
    { label: 'Frequência (rmkt)',     real: `${CAMP.freqMeta}×`,           meta: `${CAMP.freqMeta}×`,     gap: '—',                                        ok: true  },
    { label: 'Pessoas impactadas',   real: fmt(REAL.total.alcance),        meta: `~${fmt(CAMP.audiencia + CAMP.rmktAudiencia)}`, gap: `− ${fmt(CAMP.audiencia + CAMP.rmktAudiencia - REAL.total.alcance)}`, ok: false },
    { label: 'Cobertura da base',    real: `${(REAL.total.cobertura * 100).toFixed(1)}%`, meta: '~100%',  gap: `− ${(100 - REAL.total.cobertura * 100).toFixed(0)}%`, ok: false },
    { label: 'CPMA (freq 7×)',       real: 'R$ 10,50',                    meta: 'R$ 10,50',              gap: '—',                                        ok: true  },
  ]

  return (
    <div className="space-y-4">

      {/* Hero comparativo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Realidade */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #0f1a0f 0%, #1a2a1a 100%)', border: '1.5px solid #6eda2c30' }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse at 20% 80%, #6eda2c12 0%, transparent 60%)' }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: '#6eda2c20', color: '#6eda2c' }}>Realidade Atual</span>
            </div>
            <p className="text-3xl font-black text-white mb-1">{brl(CAMP.budget)}</p>
            <p className="text-[10px] text-white/30 mb-4">R$ {daily.toFixed(2).replace('.', ',')}/dia · {CAMP.days} dias</p>
            <div className="space-y-2">
              {[
                { icon: '🔵', label: 'Público frio', value: `${fmt(REAL.frio.alcance)} pessoas`, pct: `${(REAL.frio.cobertura * 100).toFixed(1)}% da base` },
                { icon: '🟠', label: 'Remarketing',  value: `${fmt(REAL.rmkt.alcance)} pessoas`, pct: `${(REAL.rmkt.cobertura * 100).toFixed(1)}% do pool` },
                { icon: '📊', label: 'Total único',  value: `${fmt(REAL.total.alcance)} pessoas`, pct: `${(REAL.total.cobertura * 100).toFixed(1)}% dos 2,8M` },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <span className="text-[11px] font-bold text-white/70">{r.icon} {r.label}</span>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-white">{r.value}</p>
                    <p className="text-[10px]" style={{ color: '#6eda2c' }}>{r.pct}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meta */}
        <div className="rounded-3xl p-5 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1a0a0a 0%, #2a1010 100%)', border: `1.5px solid ${color}30` }}>
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}12 0%, transparent 60%)` }} />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: color + '20', color }}>Meta — Cobertura Total</span>
            </div>
            <p className="text-3xl font-black text-white mb-1">{brl(GOAL.total.budget)}</p>
            <p className="text-[10px] text-white/30 mb-4">{brl(GOAL.total.daily)}/dia · {CAMP.days} dias</p>
            <div className="space-y-2">
              {[
                { icon: '🔵', label: 'Público frio', value: `${fmt(GOAL.frio.alcance)} pessoas`, pct: '100% da base' },
                { icon: '🟠', label: 'Remarketing',  value: `${fmt(GOAL.rmkt.alcance)} pessoas`, pct: '100% do pool' },
                { icon: '📊', label: 'Total único',  value: `~${fmt(CAMP.audiencia + CAMP.rmktAudiencia)} pessoas`, pct: 'cobertura completa' },
              ].map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl px-3 py-2"
                  style={{ background: 'rgba(255,255,255,0.04)' }}>
                  <span className="text-[11px] font-bold text-white/70">{r.icon} {r.label}</span>
                  <div className="text-right">
                    <p className="text-xs font-extrabold text-white">{r.value}</p>
                    <p className="text-[10px]" style={{ color }}>{r.pct}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Gauges de cobertura */}
      <div className="bg-white rounded-2xl p-5" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-sm font-extrabold text-text mb-5">📡 Cobertura atual do público</p>
        <div className="flex items-center justify-around flex-wrap gap-6">
          <GaugeMini pct={REAL.frio.cobertura}   color="#60a5fa" label="Frio alcançado"   sub={`${fmt(REAL.frio.alcance)} de ${fmt(CAMP.audiencia)}`} />
          <GaugeMini pct={REAL.rmkt.cobertura}   color="#ea8a29" label="Rmkt alcançado"   sub={`${fmt(REAL.rmkt.alcance)} de ${fmt(CAMP.rmktAudiencia)}`} />
          <GaugeMini pct={REAL.total.cobertura}  color={color}   label="Cobertura total"  sub={`${fmt(REAL.total.alcance)} de ${fmt(CAMP.audiencia)}`} />
          <div className="w-px h-16 bg-border hidden md:block" />
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: '#6eda2c15', border: '2px solid #6eda2c30' }}>
              <span className="text-2xl font-black" style={{ color: '#6eda2c' }}>7×</span>
            </div>
            <p className="text-[11px] font-extrabold text-text text-center">Frequência</p>
            <StatusPill ok label="Meta atingida" />
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: '#ea8a2915', border: '2px solid #ea8a2930' }}>
              <span className="text-xl font-black" style={{ color: '#ea8a29' }}>R$10,50</span>
            </div>
            <p className="text-[11px] font-extrabold text-text text-center">CPMA (freq 7×)</p>
            <StatusPill ok label="Projetado" />
          </div>
        </div>
      </div>

      {/* Tabela comparativa completa */}
      <Section title="📋 Comparativo completo">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {['Indicador', 'Realidade (R$ 4k)', 'Meta (100%)', 'Gap', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} className="hover:bg-gray-50" style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <td className="px-4 py-2.5 font-bold text-text text-[11px]">{r.label}</td>
                  <td className="px-4 py-2.5 font-bold" style={{ color: r.ok ? '#6eda2c' : '#1a1d2e' }}>{r.real}</td>
                  <td className="px-4 py-2.5 text-muted">{r.meta}</td>
                  <td className="px-4 py-2.5 text-[11px]" style={{ color: r.ok ? 'transparent' : '#ef4444' }}>{r.gap}</td>
                  <td className="px-4 py-2.5"><StatusPill ok={r.ok} label={r.ok ? 'OK' : 'Gap'} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* Detalhe por frente */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          {
            titulo: '🔵 Público Frio',
            color: '#60a5fa',
            rows: [
              { label: 'Verba',             real: brl(REAL.frio.budget),   meta: brl(GOAL.frio.budget) },
              { label: 'Alcance',           real: fmt(REAL.frio.alcance),  meta: fmt(GOAL.frio.alcance) },
              { label: 'Cobertura',         real: `${(REAL.frio.cobertura*100).toFixed(1)}%`, meta: '100%' },
              { label: 'Frequência',        real: `${CAMP.freqMeta}×`,     meta: `${CAMP.freqMeta}×` },
              { label: 'Impressões',        real: fmt(1333333),            meta: fmt(CAMP.audiencia * CAMP.freqMeta) },
            ],
          },
          {
            titulo: '🟠 Remarketing',
            color: '#ea8a29',
            rows: [
              { label: 'Verba',             real: brl(REAL.rmkt.budget),   meta: brl(GOAL.rmkt.budget) },
              { label: 'Alcance',           real: fmt(REAL.rmkt.alcance),  meta: fmt(GOAL.rmkt.alcance) },
              { label: 'Cobertura do pool', real: `${(REAL.rmkt.cobertura*100).toFixed(1)}%`, meta: '100%' },
              { label: 'Frequência',        real: `${CAMP.freqMeta}×`,     meta: `${CAMP.freqMeta}×` },
              { label: 'Pool de remarketing', real: fmt(CAMP.rmktAudiencia), meta: fmt(CAMP.rmktAudiencia) },
            ],
          },
        ].map((bloco, i) => (
          <div key={i} className="bg-white rounded-2xl overflow-hidden" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${bloco.color}20` }}>
            <div className="px-5 py-3" style={{ background: bloco.color + '08', borderBottom: `1px solid ${bloco.color}18` }}>
              <p className="text-sm font-extrabold text-text">{bloco.titulo}</p>
              <div className="flex gap-3 mt-1">
                <StatusPill ok={false} label="Cobertura parcial" />
                <StatusPill ok label="Freq OK" />
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2 px-1">
                <span>Indicador</span>
                <div className="flex gap-8">
                  <span>Atual</span>
                  <span>Meta</span>
                </div>
              </div>
              {bloco.rows.map((r, j) => (
                <div key={j} className="flex items-center justify-between py-2" style={{ borderBottom: '1px solid #f1f3f9' }}>
                  <span className="text-[11px] text-muted">{r.label}</span>
                  <div className="flex gap-8">
                    <span className="text-xs font-bold text-text w-16 text-right">{r.real}</span>
                    <span className="text-xs text-muted w-16 text-right">{r.meta}</span>
                  </div>
                </div>
              ))}
            </div>
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
