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
   ABA: CENÁRIOS
══════════════════════════════════════════ */
function Cenarios({ color }) {
  const cenarios = [
    {
      id: 'alcance',
      emoji: '📡',
      label: 'Alto Alcance',
      tag: 'Público frio',
      tagColor: '#60a5fa',
      freq: 2,
      alcanceFrio: 666000,
      alcanceRmkt: 190000,
      totalAlcance: 856000,
      cobertura: 30.6,
      cpma: 3.00,
      quando: 'Público ainda não conhece a marca — prioridade é aparecer para o maior número possível.',
      dark: false,
    },
    {
      id: 'atual',
      emoji: '⚖️',
      label: 'Histórico da conta',
      tag: 'Referência',
      tagColor: '#6eda2c',
      freq: 3.37,
      alcanceFrio: 396000,
      alcanceRmkt: 190000,
      totalAlcance: 586000,
      cobertura: 20.9,
      cpma: 4.57,
      quando: 'Comportamento real da conta nos últimos períodos — base para todas as projeções.',
      dark: false,
    },
    {
      id: 'frequencia',
      emoji: '🎯',
      label: 'Alta Frequência',
      tag: 'Remarketing',
      tagColor: color,
      freq: 7,
      alcanceFrio: 190000,
      alcanceRmkt: 190000,
      totalAlcance: 380000,
      cobertura: 13.6,
      cpma: 10.50,
      quando: 'Público já impactado — prioridade é reforçar a mensagem e gerar lembrança de marca.',
      dark: true,
    },
  ]

  const [ativo, setAtivo] = useState('frequencia')
  const c = cenarios.find(x => x.id === ativo)

  return (
    <div className="space-y-4">

      {/* Base */}
      <div className="rounded-2xl px-5 py-4 flex flex-wrap gap-6 items-center"
        style={{ background: '#f7f8fc', border: '1px solid #edf0f7' }}>
        <div className="text-[11px] text-muted font-bold">📌 Base de cálculo</div>
        {[
          { label: 'Orçamento', value: 'R$ 4.000' },
          { label: 'Período', value: '60 dias' },
          { label: 'Diária', value: 'R$ 66,67' },
          { label: 'Impressões totais', value: '2.666.667' },
          { label: 'Divisão', value: '50% frio · 50% rmkt' },
          { label: 'CPM base', value: 'R$ 1,50' },
          { label: 'CPMA hist.', value: 'R$ 4,57' },
        ].map((item, i) => (
          <div key={i}>
            <p className="text-[10px] text-muted">{item.label}</p>
            <p className="text-sm font-extrabold text-text">{item.value}</p>
          </div>
        ))}
      </div>

      {/* Seletor de cenários */}
      <div className="grid grid-cols-3 gap-3">
        {cenarios.map(cn => (
          <motion.button key={cn.id} whileHover={{ y: -2 }} onClick={() => setAtivo(cn.id)}
            className="rounded-2xl p-4 text-left transition-all"
            style={{
              background: ativo === cn.id ? (cn.dark ? 'linear-gradient(135deg, #1a0808 0%, #2d1010 100%)' : cn.tagColor + '10') : 'white',
              border: `2px solid ${ativo === cn.id ? cn.tagColor : '#e2e5f0'}`,
              boxShadow: ativo === cn.id ? `0 4px 20px ${cn.tagColor}25` : '0 2px 8px rgba(26,29,46,0.06)',
            }}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{cn.emoji}</span>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full"
                style={{ background: cn.tagColor + '20', color: cn.tagColor }}>{cn.tag}</span>
            </div>
            <p className="text-sm font-extrabold mb-3"
              style={{ color: ativo === cn.id && cn.dark ? 'white' : '#1a1d2e' }}>{cn.label}</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-[10px]" style={{ color: ativo === cn.id && cn.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>Frequência</span>
                <span className="text-[11px] font-extrabold" style={{ color: cn.tagColor }}>{cn.freq}×</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px]" style={{ color: ativo === cn.id && cn.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>Alcance total</span>
                <span className="text-[11px] font-extrabold"
                  style={{ color: ativo === cn.id && cn.dark ? 'white' : '#1a1d2e' }}>{fmt(cn.totalAlcance)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[10px]" style={{ color: ativo === cn.id && cn.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>% do público</span>
                <span className="text-[11px] font-extrabold" style={{ color: cn.tagColor }}>{cn.cobertura}%</span>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {/* Detalhe do cenário selecionado */}
      <motion.div key={ativo} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
        <div className="rounded-3xl p-6 relative overflow-hidden"
          style={{
            background: c.dark
              ? 'linear-gradient(135deg, #0a0f1a 0%, #141728 100%)'
              : 'white',
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
                <p className="text-[11px]" style={{ color: c.tagColor }}>{c.quando}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-5">
              {[
                { label: 'Público frio', value: fmt(c.alcanceFrio), sub: 'pessoas', icon: '🔵' },
                { label: 'Remarketing', value: fmt(c.alcanceRmkt), sub: 'pessoas', icon: '🟠' },
                { label: 'Total alcançado', value: fmt(c.totalAlcance), sub: `${c.cobertura}% dos 2,8M`, icon: '📊' },
                { label: 'CPMA estimado', value: `R$ ${c.cpma.toFixed(2).replace('.', ',')}`, sub: `freq ${c.freq}×`, icon: '💰' },
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

            {/* Barra de cobertura */}
            <div>
              <div className="flex justify-between text-[10px] font-bold mb-2"
                style={{ color: c.dark ? 'rgba(255,255,255,0.4)' : '#8890b5' }}>
                <span>Cobertura do público (2,8M)</span>
                <span style={{ color: c.tagColor }}>{c.cobertura}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: c.dark ? 'rgba(255,255,255,0.06)' : c.tagColor + '15' }}>
                <motion.div className="h-full rounded-full" style={{ background: c.tagColor }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(c.cobertura, 100)}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }} />
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Meta vs realidade */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: '1px solid #6eda2c25' }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider mb-3" style={{ color: '#6eda2c' }}>✅ O que está alinhado</p>
          <div className="space-y-2">
            {[
              { icon: '🎯', text: 'Frequência 7× atingida em ambas as frentes' },
              { icon: '💰', text: 'CPMA R$ 10,50 dentro do projetado' },
              { icon: '📐', text: 'CPM base confirmado em R$ 1,50' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                style={{ background: '#6eda2c08' }}>
                <span>{item.icon}</span>
                <p className="text-[11px] font-bold text-text">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-5 bg-white" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${color}25` }}>
          <p className="text-[10px] font-extrabold uppercase tracking-wider mb-3" style={{ color }}>❌ O que o orçamento não cobre</p>
          <div className="space-y-2">
            {[
              { icon: '👥', text: `Frio: 6,8% dos 2,8M — faltam ${fmt(2800000 - 190000)} pessoas` },
              { icon: '🔁', text: `Rmkt: 14,2% do pool — faltam ${fmt(1340000 - 190000)} pessoas` },
              { icon: '💵', text: `Cobertura 100% exigiria ${brl(GOAL.total.budget)} (${brl(GOAL.total.daily)}/dia)` },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2.5 rounded-xl px-3 py-2"
                style={{ background: color + '08' }}>
                <span>{item.icon}</span>
                <p className="text-[11px] font-bold text-text">{item.text}</p>
              </div>
            ))}
          </div>
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
