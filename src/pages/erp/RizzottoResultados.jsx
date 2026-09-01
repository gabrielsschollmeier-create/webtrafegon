import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Eye, Users, Repeat, MousePointerClick, Wallet, PlayCircle, Heart, Target, Lightbulb, AlertTriangle, CheckCircle2, MessageCircle, Smartphone, Monitor } from 'lucide-react'

const Instagram = Smartphone
const Youtube   = Monitor

const R2     = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const fmtNum = n => new Intl.NumberFormat('pt-BR').format(Math.round(n))
const pct    = (n, d = 2) => `${n.toFixed(d).replace('.', ',')}%`
const dec    = (n, d = 2) => n.toFixed(d).replace('.', ',')
const milhoes = n => n >= 1e6 ? `${dec(n / 1e6, 2)} milhões` : n >= 1e3 ? `${fmtNum(n / 1e3)} mil` : fmtNum(n)

/* ── Dados brutos — export Meta Ads (campanha + anúncio) e Google Ads · jul/25 a ago/26 ── */
const MESES = [
  { key: '2025-07', label: 'Julho', ano: '2025', badge: 'Jul/25',
    meta:   { investimento: 917.65, impressoes: 194342, alcance: 79964, frequencia: 2.43, cliques: 2768, ctr: 1.42, cpc: 0.33, cpm: 4.72, resultados: null, criativos: 88 },
    google: { investimento: 958.68, impressoes: 250336, usuarios: 152154, frequencia: 1.65, cliques: 405, ctr: 0.162, cpm: 3.83, views: 43391, viewRate: 17.33, cpv: 0.022, conversoes: 0, likes: 0, shares: 0 } },
  { key: '2025-08', label: 'Agosto', ano: '2025', badge: 'Ago/25',
    meta:   { investimento: 927.43, impressoes: 164668, alcance: 58997, frequencia: 2.79, cliques: 2822, ctr: 1.71, cpc: 0.33, cpm: 5.63, resultados: 2953, criativos: 71 },
    google: { investimento: 913.21, impressoes: 269452, usuarios: 109823, frequencia: 2.45, cliques: 238, ctr: 0.088, cpm: 3.39, views: 38410, viewRate: 14.25, cpv: 0.024, conversoes: 0, likes: 0, shares: 0 } },
  { key: '2025-09', label: 'Setembro', ano: '2025', badge: 'Set/25',
    meta:   { investimento: 743.59, impressoes: 128794, alcance: 48210, frequencia: 2.67, cliques: 2294, ctr: 1.78, cpc: 0.32, cpm: 5.77, resultados: 2324, criativos: 61 },
    google: { investimento: 1166.56, impressoes: 274385, usuarios: 114026, frequencia: 2.41, cliques: 300, ctr: 0.109, cpm: 4.25, views: 44231, viewRate: 16.12, cpv: 0.026, conversoes: 0, likes: 0, shares: 0 } },
  { key: '2025-10', label: 'Outubro', ano: '2025', badge: 'Out/25',
    meta:   { investimento: 740.39, impressoes: 129768, alcance: 47809, frequencia: 2.71, cliques: 2415, ctr: 1.86, cpc: 0.31, cpm: 5.71, resultados: 2495, criativos: 56 },
    google: { investimento: 1217.10, impressoes: 470318, usuarios: 121605, frequencia: 3.87, cliques: 474, ctr: 0.101, cpm: 2.59, views: 41700, viewRate: 8.87, cpv: 0.029, conversoes: 0, likes: 0, shares: 0 } },
  { key: '2025-11', label: 'Novembro', ano: '2025', badge: 'Nov/25',
    meta:   { investimento: 720.98, impressoes: 110288, alcance: 49545, frequencia: 2.23, cliques: 2509, ctr: 2.27, cpc: 0.29, cpm: 6.54, resultados: 2512, criativos: 97 },
    google: { investimento: 1217.19, impressoes: 443996, usuarios: 123342, frequencia: 3.60, cliques: 452, ctr: 0.102, cpm: 2.74, views: 56954, viewRate: 12.83, cpv: 0.021, conversoes: 0, likes: 0, shares: 0 } },
  { key: '2025-12', label: 'Dezembro', ano: '2025', badge: 'Dez/25',
    meta:   { investimento: 604.57, impressoes: 114274, alcance: 58559, frequencia: 1.95, cliques: 1727, ctr: 1.51, cpc: 0.35, cpm: 5.29, resultados: 1783, criativos: 54 },
    google: { investimento: 1248.74, impressoes: 426033, usuarios: 150858, frequencia: 2.82, cliques: 1064, ctr: 0.250, cpm: 2.93, views: 58203, viewRate: 13.66, cpv: 0.021, conversoes: 582, likes: 0, shares: 0 } },
  { key: '2026-01', label: 'Janeiro', ano: '2026', badge: 'Jan/26',
    meta:   { investimento: 671.41, impressoes: 127172, alcance: 63564, frequencia: 2.00, cliques: 2977, ctr: 2.34, cpc: 0.23, cpm: 5.28, resultados: 2989, criativos: 90 },
    google: { investimento: 1216.96, impressoes: 391010, usuarios: 182474, frequencia: 2.14, cliques: 1611, ctr: 0.412, cpm: 3.11, views: 52761, viewRate: 13.49, cpv: 0.023, conversoes: 975, likes: 166, shares: 1 } },
  { key: '2026-02', label: 'Fevereiro', ano: '2026', badge: 'Fev/26',
    meta:   { investimento: 617.91, impressoes: 131021, alcance: 56785, frequencia: 2.31, cliques: 2465, ctr: 1.88, cpc: 0.25, cpm: 4.72, resultados: 2424, criativos: 39 },
    google: { investimento: 1189.22, impressoes: 365306, usuarios: 136557, frequencia: 2.68, cliques: 1123, ctr: 0.307, cpm: 3.26, views: 58854, viewRate: 16.11, cpv: 0.020, conversoes: 782, likes: 228, shares: 17 } },
  { key: '2026-03', label: 'Março', ano: '2026', badge: 'Mar/26',
    meta:   { investimento: 817.21, impressoes: 163092, alcance: 73317, frequencia: 2.22, cliques: 2742, ctr: 1.68, cpc: 0.30, cpm: 5.01, resultados: 2761, criativos: 45 },
    google: { investimento: 912.49, impressoes: 341534, usuarios: 98922, frequencia: 3.45, cliques: 320, ctr: 0.094, cpm: 2.67, views: 53740, viewRate: 15.73, cpv: 0.017, conversoes: 0, likes: 188, shares: 30 } },
  { key: '2026-04', label: 'Abril', ano: '2026', badge: 'Abr/26',
    meta:   { investimento: 574.54, impressoes: 105619, alcance: 56688, frequencia: 1.86, cliques: 1656, ctr: 1.57, cpc: 0.35, cpm: 5.44, resultados: 1688, criativos: 35 },
    google: { investimento: 1158.37, impressoes: 430741, usuarios: 103295, frequencia: 4.17, cliques: 375, ctr: 0.087, cpm: 2.69, views: 64778, viewRate: 15.04, cpv: 0.018, conversoes: 0, likes: 238, shares: 55 } },
  { key: '2026-05', label: 'Maio', ano: '2026', badge: 'Mai/26',
    meta:   { investimento: 992.10, impressoes: 189815, alcance: 90173, frequencia: 2.11, cliques: 2093, ctr: 1.10, cpc: 0.47, cpm: 5.23, resultados: 2171, criativos: 68 },
    google: { investimento: 1248.60, impressoes: 408375, usuarios: 153001, frequencia: 2.67, cliques: 347, ctr: 0.085, cpm: 3.06, views: 46390, viewRate: 11.36, cpv: 0.027, conversoes: 0, likes: 196, shares: 48 } },
  { key: '2026-06', label: 'Junho', ano: '2026', badge: 'Jun/26',
    meta:   { investimento: 720.26, impressoes: 116681, alcance: 76192, frequencia: 1.53, cliques: 1556, ctr: 1.33, cpc: 0.46, cpm: 6.17, resultados: 1589, criativos: 79 },
    google: { investimento: 1218.15, impressoes: 348505, usuarios: 145763, frequencia: 2.39, cliques: 266, ctr: 0.076, cpm: 3.50, views: 32948, viewRate: 9.45, cpv: 0.037, conversoes: 0, likes: 163, shares: 44 } },
  { key: '2026-07', label: 'Julho', ano: '2026', badge: 'Jul/26',
    meta:   { investimento: 704.17, impressoes: 116551, alcance: 62784, frequencia: 1.86, cliques: 2868, ctr: 2.46, cpc: 0.25, cpm: 6.04, resultados: 2896, criativos: 15 },
    google: { investimento: 1217.30, impressoes: 351213, usuarios: 161788, frequencia: 2.17, cliques: 203, ctr: 0.058, cpm: 3.47, views: 35594, viewRate: 10.13, cpv: 0.034, conversoes: 0, likes: 143, shares: 41 } },
  { key: '2026-08', label: 'Agosto', ano: '2026', badge: 'Ago/26',
    meta:   { investimento: 858.32, impressoes: 134962, alcance: 79755, frequencia: 1.69, cliques: 3750, ctr: 2.78, cpc: 0.23, cpm: 6.36, resultados: 3942, criativos: 27 },
    google: { investimento: 1138.77, impressoes: 333712, usuarios: 159287, frequencia: 2.10, cliques: 185, ctr: 0.055, cpm: 3.41, views: 33557, viewRate: 10.06, cpv: 0.034, conversoes: 0, likes: 118, shares: 29 } },
]

const TOTAIS = {
  meta:   { investimento: 10610.53, impressoes: 1927047, alcance: 902342, frequencia: 2.14, cliques: 34642, ctr: 1.80, cpc: 0.31, cpm: 5.51, criativos: 312, visitasPerfil: 32527, custoVisita: 0.30 },
  google: { investimento: 16021.34, impressoes: 5104916, frequencia: 2.67, cliques: 7363, ctr: 0.144, cpm: 3.14, views: 661511, viewRate: 12.96, cpv: 0.024, conversoes: 2339, likes: 1440, shares: 265, comentarios: 0 },
}
const INVEST_TOTAL = TOTAIS.meta.investimento + TOTAIS.google.investimento
const IMPR_TOTAL   = TOTAIS.meta.impressoes + TOTAIS.google.impressoes

const META_COR   = '#60a5fa'
const GOOGLE_COR = '#f59e0b'
const VERDE      = '#6eda2c'
const LARANJA    = '#f59e0b'
const VERMELHO   = '#ef4444'

/* ── Semáforo: transforma número em "está bom?" ── */
const SEM = {
  bom:     { cor: VERDE,    label: 'Bom' },
  atencao: { cor: LARANJA,  label: 'Atenção' },
  ruim:    { cor: VERMELHO, label: 'Precisa melhorar' },
  neutro:  { cor: '#94a3b8', label: '' },
}
const avaliar = {
  frequenciaMeta: v => v >= 3 ? 'bom' : v >= 2 ? 'atencao' : 'ruim',
  ctrMeta:        v => v >= 2 ? 'bom' : v >= 1.5 ? 'atencao' : 'ruim',
  viewRate:       v => v >= 13 ? 'bom' : v >= 10 ? 'atencao' : 'ruim',
  criativos:      v => v <= 30 ? 'bom' : v <= 60 ? 'atencao' : 'ruim',
}

/* ── UI ── */
function Selo({ status }) {
  const s = SEM[status]
  if (!s.label) return null
  return (
    <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold shrink-0"
      style={{ background: `${s.cor}1f`, color: s.cor }}>
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.cor }} />{s.label}
    </span>
  )
}

/** Card de indicador: número grande + o que ele quer dizer em português. */
function Kpi({ icon: Icon, label, valor, leitura, cor, status = 'neutro' }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted">
          <Icon size={13} style={{ color: cor }} /> {label}
        </div>
        <Selo status={status} />
      </div>
      <div className="text-2xl font-semibold leading-none" style={{ color: cor }}>{valor}</div>
      {leitura && <p className="text-[12px] text-muted leading-snug">{leitura}</p>}
    </div>
  )
}

/** Frase de leitura destacada — o "então quer dizer que..." */
function Leitura({ children, cor, icone: Icone = Lightbulb }) {
  return (
    <div className="rounded-2xl p-4 flex gap-3 items-start" style={{ background: `${cor}12`, border: `1px solid ${cor}2e` }}>
      <Icone size={16} className="mt-0.5 shrink-0" style={{ color: cor }} />
      <p className="text-[13px] leading-relaxed">{children}</p>
    </div>
  )
}

/** Funil: mostra o caminho da pessoa, do anúncio até o perfil. */
function Funil({ etapas, cor }) {
  const base = etapas[0].valor
  return (
    <div className="space-y-2.5">
      {etapas.map((e, i) => {
        const w = Math.max(14, (e.valor / base) * 100)
        return (
          <div key={e.titulo} className="space-y-1">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-[12.5px] font-medium">
                <span className="text-muted mr-1.5">{i + 1}.</span>{e.titulo}
              </span>
              <span className="text-[13px] font-semibold tabular-nums" style={{ color: cor }}>{fmtNum(e.valor)}</span>
            </div>
            <div className="h-7 w-full rounded-lg bg-white/[0.04] overflow-hidden">
              <div className="h-full rounded-lg transition-all" style={{ width: `${w}%`, background: `linear-gradient(90deg, ${cor}, ${cor}66)` }} />
            </div>
            <p className="text-[11.5px] text-muted leading-snug">{e.desc}</p>
          </div>
        )
      })}
    </div>
  )
}

function Barra({ valor, max, cor }) {
  const w = max > 0 ? Math.max(2, (valor / max) * 100) : 0
  return (
    <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${w}%`, background: cor }} />
    </div>
  )
}

function Secao({ icon: Icon, titulo, desc, children, cor }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          {Icon ? <Icon size={16} style={{ color: cor }} /> : <span className="inline-block h-4 w-1 rounded-full" style={{ background: cor }} />}
          {titulo}
        </h3>
        {desc && <p className="text-[12.5px] text-muted mt-1 leading-relaxed max-w-3xl">{desc}</p>}
      </div>
      {children}
    </section>
  )
}

/* Gera a frase-resumo do mês a partir dos próprios números. */
function resumoDoMes(m) {
  const partes = []
  if (m.meta.ctr >= 2)        partes.push(`o interesse pelos anúncios foi alto (CTR de ${pct(m.meta.ctr)}, acima da média do período)`)
  else if (m.meta.ctr < 1.5)  partes.push(`o interesse pelos anúncios ficou abaixo da média (CTR de ${pct(m.meta.ctr)})`)
  else                        partes.push(`o interesse pelos anúncios ficou na média (CTR de ${pct(m.meta.ctr)})`)

  if (m.meta.criativos <= 30) partes.push(`a verba ficou concentrada em poucas peças (${m.meta.criativos} anúncios), o que costuma render mais`)
  else if (m.meta.criativos >= 70) partes.push(`a verba se dividiu entre muitas peças (${m.meta.criativos} anúncios), o que dilui a mensagem`)

  if (m.google.conversoes > 0) partes.push(`e a campanha de rota gerou ${fmtNum(m.google.conversoes)} visitas ao posto`)
  else if (m.google.viewRate < 10) partes.push(`e a retenção do vídeo no YouTube ficou baixa (${pct(m.google.viewRate)})`)

  return `Em ${m.label.toLowerCase()}, ${partes.join(', ')}.`
}

export default function RizzottoResultados({ color = '#60a5fa' }) {
  const [visao, setVisao] = useState('agrupado')
  const [mesKey, setMesKey] = useState(MESES[MESES.length - 1].key)
  const mes = useMemo(() => MESES.find(m => m.key === mesKey), [mesKey])
  const idx = MESES.findIndex(m => m.key === mesKey)
  const anterior = idx > 0 ? MESES[idx - 1] : null

  const maxInvest     = Math.max(...MESES.map(m => m.meta.investimento + m.google.investimento))
  const maxFreqMeta   = Math.max(...MESES.map(m => m.meta.frequencia))
  const maxViewRate   = Math.max(...MESES.map(m => m.google.viewRate))

  const delta = (atual, ant, inverso = false) => {
    if (ant == null || ant === 0) return null
    const d = ((atual - ant) / ant) * 100
    return { valor: d, bom: inverso ? d < 0 : d > 0 }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-2xl">
            <div className="text-[11px] uppercase tracking-widest text-muted">Posto Rizzotto · Mídia paga</div>
            <h2 className="text-2xl font-semibold mt-1">Indicadores de julho/2025 a agosto/2026</h2>
            <p className="text-[13px] text-muted mt-2 leading-relaxed">
              São 14 meses de anúncios no <strong>Instagram/Facebook</strong> e no <strong>Google/YouTube</strong>.
              Cada número abaixo vem com a explicação do que ele quer dizer na prática.
            </p>
          </div>
          <div className="flex gap-2">
            {[['agrupado', 'Período todo'], ['mensal', 'Mês a mês']].map(([k, t]) => (
              <button key={k} onClick={() => setVisao(k)}
                className={`rounded-xl px-4 py-2 text-[12.5px] font-medium border transition ${
                  visao === k ? 'border-transparent text-black' : 'border-white/15 text-muted hover:text-white'
                }`}
                style={visao === k ? { background: color } : undefined}
              >{t}</button>
            ))}
          </div>
        </div>
      </div>

      {visao === 'agrupado' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-9">

          {/* Resumo em 3 frases */}
          <Secao titulo="O período em 3 frases" cor={color} icon={Lightbulb}
            desc="Se você só puder ler uma parte, leia esta.">
            <div className="grid gap-3 lg:grid-cols-3">
              {[
                { n: '1', txt: <>Foram investidos <strong>{R2(INVEST_TOTAL)}</strong> em 14 meses, e a marca apareceu <strong>{milhoes(IMPR_TOTAL)} de vezes</strong> na tela de alguém da região.</> },
                { n: '2', txt: <>No Instagram, <strong>{milhoes(TOTAIS.meta.alcance)} de pessoas</strong> viram os anúncios e <strong>{fmtNum(TOTAIS.meta.visitasPerfil)}</strong> foram até o perfil do posto — a {R2(TOTAIS.meta.custoVisita)} cada visita.</> },
                { n: '3', txt: <>Os melhores meses foram <strong>julho e agosto de 2026</strong>, justamente quando o número de anúncios no ar caiu de 79 para 15 e 27.</> },
              ].map(f => (
                <div key={f.n} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg text-[12px] font-semibold"
                    style={{ background: `${color}22`, color }}>{f.n}</span>
                  <p className="text-[12.5px] leading-relaxed">{f.txt}</p>
                </div>
              ))}
            </div>
          </Secao>

          {/* Tabela consolidada */}
          <Secao titulo="Os números do período, lado a lado" cor={color} icon={Target}
            desc="Tudo somado de julho/2025 a agosto/2026. Cada linha tem a explicação do que significa.">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="grid grid-cols-[1fr_auto_auto] gap-3 px-4 py-3 border-b border-white/10 text-[11px] uppercase tracking-wide text-muted">
                <span>Indicador</span>
                <span className="w-28 text-right" style={{ color: META_COR }}>Instagram</span>
                <span className="w-28 text-right" style={{ color: GOOGLE_COR }}>Google</span>
              </div>
              {[
                { nome: 'Investimento',        exp: 'Quanto foi aplicado em anúncios.',                          m: R2(TOTAIS.meta.investimento),        g: R2(TOTAIS.google.investimento) },
                { nome: 'Impressões',          exp: 'Vezes que o anúncio apareceu na tela de alguém.',           m: fmtNum(TOTAIS.meta.impressoes),      g: fmtNum(TOTAIS.google.impressoes) },
                { nome: 'Alcance',             exp: 'Pessoas diferentes que viram os anúncios.',                 m: fmtNum(TOTAIS.meta.alcance),         g: '1.912.895' },
                { nome: 'Frequência',          exp: 'Vezes que a mesma pessoa viu, por mês. Ideal: 3 a 4.',      m: `${dec(TOTAIS.meta.frequencia)}x`,   g: `${dec(TOTAIS.google.frequencia)}x` },
                { nome: 'Cliques',             exp: 'Pessoas que clicaram no anúncio.',                          m: fmtNum(TOTAIS.meta.cliques),         g: fmtNum(TOTAIS.google.cliques) },
                { nome: 'Visitas ao perfil',   exp: 'Chegaram no Instagram do posto (ago/25 a ago/26).',         m: fmtNum(TOTAIS.meta.visitasPerfil),   g: '—' },
                { nome: 'Custo por visita',    exp: 'Quanto custou cada visita ao perfil.',                      m: R2(TOTAIS.meta.custoVisita),         g: '—' },
                { nome: 'Assistiram ao vídeo', exp: 'Pessoas que assistiram ao vídeo no YouTube.',               m: '—',                                 g: fmtNum(TOTAIS.google.views) },
                { nome: 'Visitas ao posto',    exp: 'Pediram rota ou foram até a loja (dez/25 a fev/26).',       m: '—',                                 g: fmtNum(TOTAIS.google.conversoes) },
              ].map((l, n) => (
                <div key={l.nome} className={`grid grid-cols-[1fr_auto_auto] items-center gap-3 px-4 py-3 ${n > 0 ? 'border-t border-white/[0.06]' : ''}`}>
                  <div>
                    <div className="text-[13px] font-medium">{l.nome}</div>
                    <div className="text-[11.5px] text-muted leading-snug">{l.exp}</div>
                  </div>
                  <span className="w-28 text-right text-[14px] font-semibold tabular-nums" style={{ color: l.m === '—' ? '#64748b' : META_COR }}>{l.m}</span>
                  <span className="w-28 text-right text-[14px] font-semibold tabular-nums" style={{ color: l.g === '—' ? '#64748b' : GOOGLE_COR }}>{l.g}</span>
                </div>
              ))}
            </div>
            <p className="text-[11.5px] text-muted">
              O traço (—) indica indicador que só existe naquela plataforma. No Google, o alcance soma as pessoas de cada mês —
              quem foi atingido em meses diferentes é contado mais de uma vez.
            </p>
          </Secao>

          {/* Investimento */}
          <Secao titulo="Onde o dinheiro foi aplicado" cor={color} icon={Wallet}
            desc="A verba se divide entre as duas plataformas. Cada uma tem um papel diferente.">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { nome: 'Instagram e Facebook', papel: 'Levar gente até o perfil do posto', v: TOTAIS.meta.investimento, cor: META_COR, Icon: Instagram },
                { nome: 'Google e YouTube',     papel: 'Fazer a marca aparecer para a região', v: TOTAIS.google.investimento, cor: GOOGLE_COR, Icon: Youtube },
              ].map(c => (
                <div key={c.nome} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-[13px] font-medium flex items-center gap-2">
                      <c.Icon size={14} style={{ color: c.cor }} />{c.nome}
                    </span>
                    <span className="text-lg font-semibold" style={{ color: c.cor }}>{R2(c.v)}</span>
                  </div>
                  <Barra valor={c.v} max={INVEST_TOTAL} cor={c.cor} />
                  <div className="text-[11.5px] text-muted">
                    {pct(c.v / INVEST_TOTAL * 100, 0)} da verba · {c.papel}
                  </div>
                </div>
              ))}
            </div>
            <Leitura cor={color}>
              Dá uma média de <strong>R$ 1.900 por mês</strong> somando as duas plataformas — valor que se manteve estável o ano inteiro.
            </Leitura>
          </Secao>

          {/* Funil Meta */}
          <Secao titulo="O caminho da pessoa no Instagram" cor={META_COR} icon={Instagram}
            desc="Do momento em que o anúncio aparece até a pessoa chegar no perfil do posto. Cada degrau é menor que o anterior — isso é normal.">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <Funil cor={META_COR} etapas={[
                { titulo: 'O anúncio apareceu na tela',  valor: TOTAIS.meta.impressoes,    desc: 'Total de vezes que a peça foi exibida. A mesma pessoa pode ver várias vezes.' },
                { titulo: 'Pessoas diferentes viram',    valor: TOTAIS.meta.alcance,       desc: 'Quantas pessoas distintas foram atingidas na região.' },
                { titulo: 'Clicaram no anúncio',         valor: TOTAIS.meta.cliques,       desc: `De cada 100 que viram, ${dec(TOTAIS.meta.ctr, 1)} clicaram.` },
                { titulo: 'Chegaram no perfil do posto', valor: TOTAIS.meta.visitasPerfil, desc: `Custo de ${R2(TOTAIS.meta.custoVisita)} por visita ao perfil (medido de ago/25 a ago/26).` },
              ]} />
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi icon={Repeat} label="Frequência" valor={`${dec(TOTAIS.meta.frequencia)}x`} cor={META_COR}
                status={avaliar.frequenciaMeta(TOTAIS.meta.frequencia)}
                leitura="Quantas vezes por mês a mesma pessoa vê a marca. Para ser lembrada, o ideal fica entre 3 e 4." />
              <Kpi icon={MousePointerClick} label="Custo por clique" valor={R2(TOTAIS.meta.cpc)} cor={META_COR}
                leitura="Quanto se paga cada vez que alguém clica no anúncio." />
              <Kpi icon={Target} label="Peças diferentes" valor={fmtNum(TOTAIS.meta.criativos)} cor={META_COR}
                status="ruim"
                leitura="Anúncios distintos em 14 meses. Muitas peças com pouca verba cada — a mensagem não fixa." />
            </div>
          </Secao>

          {/* Google */}
          <Secao titulo="A marca aparecendo na região" cor={GOOGLE_COR} icon={Youtube}
            desc="No YouTube o objetivo é diferente: fazer a marca ser vista por muita gente de Araranguá e Arroio do Silva.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={Eye} label="Vezes que apareceu" valor={milhoes(TOTAIS.google.impressoes)} cor={GOOGLE_COR}
                leitura="O vídeo foi exibido 5,1 milhões de vezes no período." />
              <Kpi icon={PlayCircle} label="Pessoas que assistiram" valor={fmtNum(TOTAIS.google.views)} cor={GOOGLE_COR}
                status={avaliar.viewRate(TOTAIS.google.viewRate)}
                leitura={`${pct(TOTAIS.google.viewRate)} de quem viu o vídeo começar assistiu de fato.`} />
              <Kpi icon={Wallet} label="Custo por pessoa que assistiu" valor={R2(TOTAIS.google.cpv)} cor={GOOGLE_COR}
                leitura="Menos de 3 centavos por visualização — bem eficiente." />
              <Kpi icon={Target} label="Visitas ao posto" valor={fmtNum(TOTAIS.google.conversoes)} cor={GOOGLE_COR}
                leitura="Pessoas que pediram rota ou foram até o posto. Só em dez/25 a fev/26, quando a campanha esteve ativa." />
            </div>
            <Leitura cor={GOOGLE_COR} icone={AlertTriangle}>
              A campanha que gerava essas <strong>2.339 visitas ao posto</strong> custava cerca de <strong>R$ 0,32 por visita</strong> e está pausada desde março.
              É o único indicador que mostra a mídia levando gente até a loja física.
            </Leitura>
          </Secao>

          {/* Relacionamento */}
          <Secao titulo="As pessoas estão se envolvendo com a marca?" cor={color} icon={Heart}
            desc="Curtir, compartilhar e comentar mostra envolvimento de verdade — não só ver o anúncio passar.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi icon={Heart} label="Curtidas" valor={fmtNum(TOTAIS.google.likes)} cor={GOOGLE_COR}
                leitura="No YouTube, contabilizadas a partir de jan/26." />
              <Kpi icon={TrendingUp} label="Compartilhamentos" valor={fmtNum(TOTAIS.google.shares)} cor={GOOGLE_COR}
                leitura="Pessoas que enviaram o vídeo para alguém." />
              <Kpi icon={MessageCircle} label="Comentários" valor="0" cor={VERMELHO} status="ruim"
                leitura="Nenhum comentário em 5,1 milhões de exibições." />
            </div>
            <Leitura cor={LARANJA} icone={AlertTriangle}>
              As pessoas <strong>veem</strong> a marca, mas quase não <strong>interagem</strong> com ela.
              É o principal ponto a trabalhar para o objetivo de aproximar o posto do público.
            </Leitura>
          </Secao>

          {/* Leitura geral */}
          <Secao titulo="O que está funcionando e o que precisa de ajuste" cor={color} icon={CheckCircle2}>
            <div className="grid gap-3 lg:grid-cols-2">
              {[
                { ok: true, titulo: 'Menos anúncios rendeu mais',
                  txt: 'Em julho e agosto de 2026 o número de peças caiu de 79 para 15 e 27 — e o interesse subiu para o melhor patamar do período (2,46% e 2,78%).' },
                { ok: true, titulo: 'Falar de procedência funciona',
                  txt: 'A peça "Você sabe o que tem no tanque" teve o melhor resultado de todos: 3 vezes mais cliques que a média, a R$ 0,15 cada.' },
                { ok: true, titulo: 'A campanha de rota trazia gente à loja',
                  txt: '2.339 visitas ao posto por R$ 751 no total, entre dezembro e fevereiro.' },
                { ok: false, titulo: 'A marca está sendo vista menos vezes por pessoa',
                  txt: 'A frequência caiu de 2,43x para 1,69x por mês. Para a marca ficar na cabeça, o ideal é entre 3 e 4 vezes.' },
                { ok: false, titulo: 'A mensagem está espalhada demais',
                  txt: '312 peças diferentes em 14 meses, com R$ 34 em média cada uma. Nenhuma fica no ar tempo suficiente para ser lembrada.' },
                { ok: false, titulo: 'O vídeo do YouTube está prendendo menos',
                  txt: 'A retenção caiu de 17,33% para 10,06%. O vídeo institucional atual está em 1,5% — sinal de que os primeiros segundos não seguram.' },
              ].map(i => (
                <div key={i.titulo} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3">
                  {i.ok
                    ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: VERDE }} />
                    : <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: LARANJA }} />}
                  <div>
                    <div className="text-[13px] font-medium">{i.titulo}</div>
                    <p className="text-[12.5px] text-muted mt-1 leading-relaxed">{i.txt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Secao>

          {/* Glossário */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="text-[11px] uppercase tracking-wide text-muted mb-3 flex items-center gap-2">
              <Lightbulb size={13} /> Dicionário rápido
            </div>
            <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {[
                ['Impressões', 'Quantas vezes o anúncio apareceu na tela de alguém.'],
                ['Alcance', 'Quantas pessoas diferentes viram o anúncio.'],
                ['Frequência', 'Quantas vezes, em média, a mesma pessoa viu no mês.'],
                ['CTR', 'De cada 100 pessoas que viram, quantas clicaram.'],
                ['CPC', 'Quanto custou cada clique.'],
                ['CPM', 'Quanto custou para o anúncio aparecer 1.000 vezes.'],
                ['Visitas ao perfil', 'Pessoas que foram até o Instagram do posto depois de ver o anúncio.'],
                ['Retenção do vídeo', 'De cada 100 que viram o vídeo começar, quantas assistiram.'],
                ['Visitas ao local', 'Pessoas que pediram rota ou foram até o posto.'],
              ].map(([t, d]) => (
                <div key={t} className="text-[12.5px] leading-snug">
                  <dt className="font-medium">{t}</dt>
                  <dd className="text-muted">{d}</dd>
                </div>
              ))}
            </dl>
          </div>
        </motion.div>
      )}

      {visao === 'mensal' && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          {/* Seletor */}
          <div className="flex flex-wrap gap-2">
            {MESES.map(m => (
              <button key={m.key} onClick={() => setMesKey(m.key)}
                className={`rounded-xl px-3 py-2 text-[12px] font-medium border transition ${
                  mesKey === m.key ? 'border-transparent text-black' : 'border-white/15 text-muted hover:text-white'
                }`}
                style={mesKey === m.key ? { background: color } : undefined}
              >{m.badge}</button>
            ))}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-7">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold">{mes.label} de {mes.ano}</h3>
              <div className="text-[13px] text-muted">
                Investido no mês: <strong style={{ color }}>{R2(mes.meta.investimento + mes.google.investimento)}</strong>
              </div>
            </div>

            <Leitura cor={color}>{resumoDoMes(mes)}</Leitura>

            {/* Funil do mês */}
            <Secao titulo="Instagram e Facebook" cor={META_COR} icon={Instagram}
              desc="O caminho da pessoa, do anúncio até o perfil.">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                <Funil cor={META_COR} etapas={[
                  { titulo: 'O anúncio apareceu',       valor: mes.meta.impressoes, desc: 'Vezes que a peça foi exibida no mês.' },
                  { titulo: 'Pessoas diferentes viram', valor: mes.meta.alcance,    desc: `Cada uma viu, em média, ${dec(mes.meta.frequencia)} vezes.` },
                  { titulo: 'Clicaram',                 valor: mes.meta.cliques,    desc: `De cada 100 que viram, ${dec(mes.meta.ctr, 1)} clicaram. Custo de ${R2(mes.meta.cpc)} por clique.` },
                  ...(mes.meta.resultados ? [{ titulo: 'Chegaram no perfil', valor: mes.meta.resultados, desc: `${R2(mes.meta.investimento / mes.meta.resultados)} por visita ao perfil.` }] : []),
                ]} />
              </div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi icon={Wallet} label="Investimento" valor={R2(mes.meta.investimento)} cor={META_COR}
                  leitura={`CPM de ${R2(mes.meta.cpm)} para cada mil exibições.`} />
                <Kpi icon={Repeat} label="Frequência" valor={`${dec(mes.meta.frequencia)}x`} cor={META_COR}
                  status={avaliar.frequenciaMeta(mes.meta.frequencia)}
                  leitura="Vezes que a mesma pessoa viu no mês. Ideal: 3 a 4." />
                <Kpi icon={TrendingUp} label="Interesse (CTR)" valor={pct(mes.meta.ctr)} cor={META_COR}
                  status={avaliar.ctrMeta(mes.meta.ctr)}
                  leitura="De cada 100 pessoas que viram, quantas clicaram." />
                <Kpi icon={Target} label="Peças no ar" valor={fmtNum(mes.meta.criativos)} cor={META_COR}
                  status={avaliar.criativos(mes.meta.criativos)}
                  leitura={mes.meta.criativos <= 30 ? 'Verba concentrada — a mensagem fixa melhor.' : 'Verba dividida entre muitas peças.'} />
              </div>
            </Secao>

            {/* Google do mês */}
            <Secao titulo="Google e YouTube" cor={GOOGLE_COR} icon={Youtube}
              desc="Presença da marca na região.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi icon={Wallet} label="Investimento" valor={R2(mes.google.investimento)} cor={GOOGLE_COR}
                  leitura={`CPM de ${R2(mes.google.cpm)} para cada mil exibições.`} />
                <Kpi icon={Users} label="Pessoas alcançadas" valor={fmtNum(mes.google.usuarios)} cor={GOOGLE_COR}
                  leitura={`Cada uma viu, em média, ${dec(mes.google.frequencia)} vezes.`} />
                <Kpi icon={PlayCircle} label="Assistiram ao vídeo" valor={fmtNum(mes.google.views)} cor={GOOGLE_COR}
                  status={avaliar.viewRate(mes.google.viewRate)}
                  leitura={`${pct(mes.google.viewRate)} de quem viu o vídeo começar. Custo de ${R2(mes.google.cpv)} cada.`} />
                <Kpi icon={Target} label="Visitas ao posto" valor={fmtNum(mes.google.conversoes)} cor={GOOGLE_COR}
                  leitura={mes.google.conversoes > 0 ? 'Pessoas que pediram rota ou foram até a loja.' : 'Campanha de rota pausada neste mês.'} />
              </div>
            </Secao>

            {/* Comparativo */}
            {anterior && (
              <Secao titulo={`Comparado com ${anterior.label.toLowerCase()}`} cor={color} icon={TrendingUp}
                desc="Verde é melhora, vermelho é piora.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'Interesse (CTR)',   d: delta(mes.meta.ctr, anterior.meta.ctr),               ajuda: 'quanto mais gente clica, melhor' },
                    { label: 'Custo por clique',  d: delta(mes.meta.cpc, anterior.meta.cpc, true),         ajuda: 'quanto mais barato, melhor' },
                    { label: 'Frequência',        d: delta(mes.meta.frequencia, anterior.meta.frequencia), ajuda: 'quanto mais vezes vista, melhor' },
                    { label: 'Retenção do vídeo', d: delta(mes.google.viewRate, anterior.google.viewRate), ajuda: 'quanto mais gente assiste, melhor' },
                  ].map(i => (
                    <div key={i.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-wide text-muted">{i.label}</div>
                      {i.d ? (
                        <div className="mt-1 flex items-center gap-1.5 text-xl font-semibold"
                          style={{ color: i.d.bom ? VERDE : VERMELHO }}>
                          {i.d.bom ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {i.d.valor > 0 ? '+' : ''}{dec(i.d.valor, 1)}%
                        </div>
                      ) : <div className="mt-1 text-xl font-semibold text-muted">—</div>}
                      <p className="text-[11px] text-muted mt-1">{i.ajuda}</p>
                    </div>
                  ))}
                </div>
              </Secao>
            )}
          </div>

          {/* Evolução */}
          <Secao titulo="Como cada indicador evoluiu nos 14 meses" cor={color} icon={TrendingUp}
            desc="Barra maior significa número maior. Clique em um mês acima para ver o detalhe.">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-5">
              {[
                { titulo: 'Investimento por mês', sub: 'Somando as duas plataformas', get: m => m.meta.investimento + m.google.investimento, max: maxInvest, cor: color, fmt: R2 },
                { titulo: 'Frequência no Instagram', sub: 'Vezes que a mesma pessoa vê a marca no mês — ideal entre 3 e 4', get: m => m.meta.frequencia, max: maxFreqMeta, cor: META_COR, fmt: v => `${dec(v)}x` },
                { titulo: 'Retenção do vídeo no YouTube', sub: 'De cada 100 que viram o vídeo começar, quantas assistiram', get: m => m.google.viewRate, max: maxViewRate, cor: GOOGLE_COR, fmt: v => pct(v) },
              ].map(serie => (
                <div key={serie.titulo} className="space-y-2">
                  <div>
                    <div className="text-[13px] font-medium">{serie.titulo}</div>
                    <div className="text-[11.5px] text-muted">{serie.sub}</div>
                  </div>
                  <div className="space-y-1.5">
                    {MESES.map(m => (
                      <button key={m.key} onClick={() => setMesKey(m.key)}
                        className="flex w-full items-center gap-3 rounded-lg px-1 py-0.5 text-left transition hover:bg-white/[0.04]">
                        <span className="w-14 shrink-0 text-[11px] text-muted">{m.badge}</span>
                        <div className="flex-1"><Barra valor={serie.get(m)} max={serie.max} cor={serie.cor} /></div>
                        <span className="w-20 shrink-0 text-right text-[11px] tabular-nums text-muted">{serie.fmt(serie.get(m))}</span>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Secao>
        </motion.div>
      )}

      <p className="text-[11px] text-muted/70">
        Fonte: exportações do Meta Ads (nível campanha e anúncio) e do Google Ads, de 1º de julho de 2025 a 31 de agosto de 2026.
      </p>
    </div>
  )
}
