import { useState } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, CheckCircle2, AlertTriangle } from 'lucide-react'

/* ── Formatadores ─────────────────────────────── */
const R  = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(n)
const R2 = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const N  = n => new Intl.NumberFormat('pt-BR').format(Math.round(n))
const P  = (n, d = 2) => `${n.toFixed(d).replace('.', ',')}%`
const D  = (n, d = 2) => n.toFixed(d).replace('.', ',')
const MI = n => n >= 1e6 ? `${D(n / 1e6, 1)} mi` : n >= 1e3 ? `${N(n / 1e3)} mil` : N(n)

const AZUL     = '#60a5fa'
const LARANJA  = '#ea8a29'
const VERDE    = '#6eda2c'
const VERMELHO = '#ef4444'
const ROXO     = '#a78bfa'

/* ── Dados · export Meta Ads (campanha + anúncio) e Google Ads · jul/25 a ago/26 ── */
const MESES = [
  { key: '2025-07', label: 'Jul/25', nome: 'Julho', ano: '2025',
    meta:   { inv: 917.65, impr: 194342, alc: 79964, freq: 2.43, cliq: 2768, ctr: 1.42, cpc: 0.33, cpm: 4.72, perfil: null, pecas: 88 },
    google: { inv: 958.68, impr: 250336, users: 152154, freq: 1.65, cliq: 405, ctr: 0.162, cpm: 3.83, views: 43391, vr: 17.33, cpv: 0.022, conv: 0, likes: 0, shares: 0 } },
  { key: '2025-08', label: 'Ago/25', nome: 'Agosto', ano: '2025',
    meta:   { inv: 927.43, impr: 164668, alc: 58997, freq: 2.79, cliq: 2822, ctr: 1.71, cpc: 0.33, cpm: 5.63, perfil: 2953, pecas: 71 },
    google: { inv: 913.21, impr: 269452, users: 109823, freq: 2.45, cliq: 238, ctr: 0.088, cpm: 3.39, views: 38410, vr: 14.25, cpv: 0.024, conv: 0, likes: 0, shares: 0 } },
  { key: '2025-09', label: 'Set/25', nome: 'Setembro', ano: '2025',
    meta:   { inv: 743.59, impr: 128794, alc: 48210, freq: 2.67, cliq: 2294, ctr: 1.78, cpc: 0.32, cpm: 5.77, perfil: 2324, pecas: 61 },
    google: { inv: 1166.56, impr: 274385, users: 114026, freq: 2.41, cliq: 300, ctr: 0.109, cpm: 4.25, views: 44231, vr: 16.12, cpv: 0.026, conv: 0, likes: 0, shares: 0 } },
  { key: '2025-10', label: 'Out/25', nome: 'Outubro', ano: '2025',
    meta:   { inv: 740.39, impr: 129768, alc: 47809, freq: 2.71, cliq: 2415, ctr: 1.86, cpc: 0.31, cpm: 5.71, perfil: 2495, pecas: 56 },
    google: { inv: 1217.10, impr: 470318, users: 121605, freq: 3.87, cliq: 474, ctr: 0.101, cpm: 2.59, views: 41700, vr: 8.87, cpv: 0.029, conv: 0, likes: 0, shares: 0 } },
  { key: '2025-11', label: 'Nov/25', nome: 'Novembro', ano: '2025',
    meta:   { inv: 720.98, impr: 110288, alc: 49545, freq: 2.23, cliq: 2509, ctr: 2.27, cpc: 0.29, cpm: 6.54, perfil: 2512, pecas: 97 },
    google: { inv: 1217.19, impr: 443996, users: 123342, freq: 3.60, cliq: 452, ctr: 0.102, cpm: 2.74, views: 56954, vr: 12.83, cpv: 0.021, conv: 0, likes: 0, shares: 0 } },
  { key: '2025-12', label: 'Dez/25', nome: 'Dezembro', ano: '2025',
    meta:   { inv: 604.57, impr: 114274, alc: 58559, freq: 1.95, cliq: 1727, ctr: 1.51, cpc: 0.35, cpm: 5.29, perfil: 1783, pecas: 54 },
    google: { inv: 1248.74, impr: 426033, users: 150858, freq: 2.82, cliq: 1064, ctr: 0.250, cpm: 2.93, views: 58203, vr: 13.66, cpv: 0.021, conv: 582, likes: 0, shares: 0 } },
  { key: '2026-01', label: 'Jan/26', nome: 'Janeiro', ano: '2026',
    meta:   { inv: 671.41, impr: 127172, alc: 63564, freq: 2.00, cliq: 2977, ctr: 2.34, cpc: 0.23, cpm: 5.28, perfil: 2989, pecas: 90 },
    google: { inv: 1216.96, impr: 391010, users: 182474, freq: 2.14, cliq: 1611, ctr: 0.412, cpm: 3.11, views: 52761, vr: 13.49, cpv: 0.023, conv: 975, likes: 166, shares: 1 } },
  { key: '2026-02', label: 'Fev/26', nome: 'Fevereiro', ano: '2026',
    meta:   { inv: 617.91, impr: 131021, alc: 56785, freq: 2.31, cliq: 2465, ctr: 1.88, cpc: 0.25, cpm: 4.72, perfil: 2424, pecas: 39 },
    google: { inv: 1189.22, impr: 365306, users: 136557, freq: 2.68, cliq: 1123, ctr: 0.307, cpm: 3.26, views: 58854, vr: 16.11, cpv: 0.020, conv: 782, likes: 228, shares: 17 } },
  { key: '2026-03', label: 'Mar/26', nome: 'Março', ano: '2026',
    meta:   { inv: 817.21, impr: 163092, alc: 73317, freq: 2.22, cliq: 2742, ctr: 1.68, cpc: 0.30, cpm: 5.01, perfil: 2761, pecas: 45 },
    google: { inv: 912.49, impr: 341534, users: 98922, freq: 3.45, cliq: 320, ctr: 0.094, cpm: 2.67, views: 53740, vr: 15.73, cpv: 0.017, conv: 0, likes: 188, shares: 30 } },
  { key: '2026-04', label: 'Abr/26', nome: 'Abril', ano: '2026',
    meta:   { inv: 574.54, impr: 105619, alc: 56688, freq: 1.86, cliq: 1656, ctr: 1.57, cpc: 0.35, cpm: 5.44, perfil: 1688, pecas: 35 },
    google: { inv: 1158.37, impr: 430741, users: 103295, freq: 4.17, cliq: 375, ctr: 0.087, cpm: 2.69, views: 64778, vr: 15.04, cpv: 0.018, conv: 0, likes: 238, shares: 55 } },
  { key: '2026-05', label: 'Mai/26', nome: 'Maio', ano: '2026',
    meta:   { inv: 992.10, impr: 189815, alc: 90173, freq: 2.11, cliq: 2093, ctr: 1.10, cpc: 0.47, cpm: 5.23, perfil: 2171, pecas: 68 },
    google: { inv: 1248.60, impr: 408375, users: 153001, freq: 2.67, cliq: 347, ctr: 0.085, cpm: 3.06, views: 46390, vr: 11.36, cpv: 0.027, conv: 0, likes: 196, shares: 48 } },
  { key: '2026-06', label: 'Jun/26', nome: 'Junho', ano: '2026',
    meta:   { inv: 720.26, impr: 116681, alc: 76192, freq: 1.53, cliq: 1556, ctr: 1.33, cpc: 0.46, cpm: 6.17, perfil: 1589, pecas: 79 },
    google: { inv: 1218.15, impr: 348505, users: 145763, freq: 2.39, cliq: 266, ctr: 0.076, cpm: 3.50, views: 32948, vr: 9.45, cpv: 0.037, conv: 0, likes: 163, shares: 44 } },
  { key: '2026-07', label: 'Jul/26', nome: 'Julho', ano: '2026',
    meta:   { inv: 704.17, impr: 116551, alc: 62784, freq: 1.86, cliq: 2868, ctr: 2.46, cpc: 0.25, cpm: 6.04, perfil: 2896, pecas: 15 },
    google: { inv: 1217.30, impr: 351213, users: 161788, freq: 2.17, cliq: 203, ctr: 0.058, cpm: 3.47, views: 35594, vr: 10.13, cpv: 0.034, conv: 0, likes: 143, shares: 41 } },
  { key: '2026-08', label: 'Ago/26', nome: 'Agosto', ano: '2026',
    meta:   { inv: 858.32, impr: 134962, alc: 79755, freq: 1.69, cliq: 3750, ctr: 2.78, cpc: 0.23, cpm: 6.36, perfil: 3942, pecas: 27 },
    google: { inv: 1138.77, impr: 333712, users: 159287, freq: 2.10, cliq: 185, ctr: 0.055, cpm: 3.41, views: 33557, vr: 10.06, cpv: 0.034, conv: 0, likes: 118, shares: 29 } },
]

const T = {
  meta:   { inv: 10610.53, impr: 1927047, alc: 902342, freq: 2.14, cliq: 34642, ctr: 1.80, cpc: 0.31, cpm: 5.51, pecas: 312, perfil: 32527, custoPerfil: 0.30 },
  google: { inv: 16021.34, impr: 5104916, users: 1912895, freq: 2.67, cliq: 7363, ctr: 0.144, cpm: 3.14, views: 661511, vr: 12.96, cpv: 0.024, conv: 2339, likes: 1440, shares: 265, coment: 0 },
}
const INV_TOTAL     = T.meta.inv + T.google.inv
const IMPR_TOTAL    = T.meta.impr + T.google.impr
const ALCANCE_TOTAL = T.meta.alc + T.google.users
const FREQ_MEDIA    = IMPR_TOTAL / ALCANCE_TOTAL
/* Engajamento = curtidas + compartilhamentos + comentários no YouTube
   + interações sociais no Meta (cliques totais menos cliques no link) */
const ENGAJAMENTO   = T.google.likes + T.google.shares + T.google.coment + 993

/* ── Componentes base (mesma linguagem do painel Intime) ── */
function BigKpi({ icon, label, value, sub, color, trend }) {
  return (
    <div className="bg-white rounded-2xl p-4 flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)', border: `1px solid ${color}20` }}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xl">{icon}</span>
        {trend === 'up'   && <TrendingUp  size={14} style={{ color: VERDE }} />}
        {trend === 'down' && <TrendingDown size={14} style={{ color: VERMELHO }} />}
      </div>
      <p className="text-2xl font-black leading-none" style={{ color }}>{value}</p>
      <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mt-1">{label}</p>
      {sub && <p className="text-[10px] text-muted mt-0.5 leading-snug">{sub}</p>}
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
    <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap"
      style={{ background: color + '20', color }}>{text}</span>
  )
}

function Card({ titulo, extra, children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl ${className}`} style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
      {titulo && (
        <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap" style={{ borderBottom: '1px solid #f1f3f9' }}>
          <p className="text-sm font-extrabold text-text">{titulo}</p>
          {extra}
        </div>
      )}
      {children}
    </div>
  )
}

/* Funil — cada degrau é uma etapa do caminho da pessoa */
function Funil({ etapas, color }) {
  const base = etapas[0].valor
  return (
    <div className="p-5 space-y-3">
      {etapas.map((e, i) => {
        const pct = Math.max(12, Math.round((e.valor / base) * 100))
        return (
          <div key={e.titulo}>
            <div className="flex justify-between items-baseline mb-1 gap-2">
              <span className="text-xs font-bold text-text">
                <span className="text-muted mr-1.5">{i + 1}.</span>{e.titulo}
              </span>
              <span className="text-sm font-extrabold whitespace-nowrap" style={{ color }}>{N(e.valor)}</span>
            </div>
            <div className="h-7 rounded-lg overflow-hidden" style={{ background: color + '14' }}>
              <motion.div className="h-full rounded-lg" style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
                initial={{ width: 0 }} animate={{ width: `${pct}%` }}
                transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }} />
            </div>
            <p className="text-[10px] text-muted mt-1">{e.desc}</p>
          </div>
        )
      })}
    </div>
  )
}

/* Semáforo */
const semFreq  = v => v >= 3 ? VERDE : v >= 2 ? LARANJA : VERMELHO
const semCtr   = v => v >= 2 ? VERDE : v >= 1.5 ? LARANJA : VERMELHO
const semVr    = v => v >= 13 ? VERDE : v >= 10 ? LARANJA : VERMELHO
const semPecas = v => v <= 30 ? VERDE : v <= 60 ? LARANJA : VERMELHO
const Dot = ({ color }) => <span className="w-2 h-2 rounded-full inline-block shrink-0" style={{ background: color }} />

function Legenda() {
  return (
    <div className="flex items-center gap-3 text-[10px] text-muted flex-wrap">
      <span className="flex items-center gap-1"><Dot color={VERDE} /> Bom</span>
      <span className="flex items-center gap-1"><Dot color={LARANJA} /> Atenção</span>
      <span className="flex items-center gap-1"><Dot color={VERMELHO} /> Precisa melhorar</span>
    </div>
  )
}

/* ═══════════ VISÃO GERAL ═══════════ */
function VisaoGeral({ color }) {
  return (
    <div className="space-y-5">

      {/* HERO — AWARENESS ACUMULADO */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 lg:p-7 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 85% 10%, ${color}2e 0%, transparent 55%), radial-gradient(ellipse at 10% 90%, ${ROXO}1c 0%, transparent 50%)` }} />
        <div className="relative z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: color + '22', color, border: `1px solid ${color}40` }}>
              📡 Awareness acumulado
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.45)' }}>
              14 meses · Jul/2025 – Ago/2026
            </span>
          </div>

          <p className="text-[13px] mt-3 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
            O objetivo desta operação é <strong style={{ color: 'rgba(255,255,255,0.9)' }}>presença de marca</strong>:
            fazer o Posto Rizzotto ser visto e lembrado pela região. Estes são os números que medem isso.
          </p>

          {/* Números gigantes */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              { icon: '📺', label: 'Impressões',   valor: MI(IMPR_TOTAL),    exato: N(IMPR_TOTAL),      desc: 'vezes que a marca apareceu na tela', cor: '#ffffff' },
              { icon: '🧍', label: 'Alcance',      valor: MI(ALCANCE_TOTAL), exato: N(ALCANCE_TOTAL),   desc: 'pessoas diferentes atingidas',       cor: color },
              { icon: '🔁', label: 'Frequência',   valor: `${D(FREQ_MEDIA)}x`, exato: 'ideal: 3 a 4x',  desc: 'vezes que cada pessoa viu, por mês', cor: semFreq(FREQ_MEDIA) },
              { icon: '💬', label: 'Engajamento',  valor: N(ENGAJAMENTO),    exato: `${N(T.google.likes)} curtidas · ${N(T.google.shares)} shares`, desc: 'interações com a marca', cor: ROXO },
            ].map((k, i) => (
              <motion.div key={k.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.09 }}
                className="rounded-2xl px-4 py-4"
                style={{ background: 'rgba(255,255,255,0.055)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{k.icon}</span>
                  <span className="text-[9.5px] font-extrabold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>{k.label}</span>
                </div>
                <p className="text-[34px] leading-none font-black mt-2" style={{ color: k.cor }}>{k.valor}</p>
                <p className="text-[10px] font-bold mt-1.5 tabular-nums" style={{ color: 'rgba(255,255,255,0.5)' }}>{k.exato}</p>
                <p className="text-[10px] mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.38)' }}>{k.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Rodapé do hero */}
          <div className="flex flex-wrap gap-x-7 gap-y-2 mt-5 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            {[
              ['Investimento total', R(INV_TOTAL), 'rgba(255,255,255,0.9)'],
              ['Visitas ao perfil',  N(T.meta.perfil), VERDE],
              ['Assistiram ao vídeo', N(T.google.views), LARANJA],
              ['Visitas ao posto',   N(T.google.conv), VERDE],
            ].map(([l, v, c]) => (
              <div key={l}>
                <p className="text-[9.5px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.45)' }}>{l}</p>
                <p className="text-lg font-black" style={{ color: c }}>{v}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Detalhe do awareness por plataforma */}
      <Card titulo="📡 De onde vem o awareness" extra={<Legenda />}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">Métrica de awareness</th>
                <th className="text-right px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: AZUL }}>📱 Instagram</th>
                <th className="text-right px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: LARANJA }}>▶️ YouTube</th>
                <th className="text-right px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-text">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                { n: 'Impressões',   d: 'vezes que a marca apareceu na tela',     m: T.meta.impr,  g: T.google.impr,  t: IMPR_TOTAL,    f: N },
                { n: 'Alcance',      d: 'pessoas diferentes atingidas',           m: T.meta.alc,   g: T.google.users, t: ALCANCE_TOTAL, f: N },
                { n: 'Frequência',   d: 'vezes que cada pessoa viu, por mês',     m: T.meta.freq,  g: T.google.freq,  t: FREQ_MEDIA,    f: v => `${D(v)}x`, sem: semFreq },
                { n: 'Cliques',      d: 'pessoas que clicaram no anúncio',        m: T.meta.cliq,  g: T.google.cliq,  t: T.meta.cliq + T.google.cliq, f: N },
                { n: 'Curtidas',     d: 'reações positivas às peças',             m: null,         g: T.google.likes, t: T.google.likes, f: N },
                { n: 'Compartilhamentos', d: 'quem enviou o conteúdo a alguém',   m: null,         g: T.google.shares, t: T.google.shares, f: N },
                { n: 'Comentários',  d: 'conversas geradas pelas peças',          m: null,         g: 0,              t: 0,             f: N, alerta: true },
              ].map((r, i) => (
                <motion.tr key={r.n} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}
                  style={{ borderTop: '1px solid #f1f3f9' }}>
                  <td className="px-5 py-3">
                    <p className="text-[12px] font-bold text-text flex items-center gap-1.5">
                      {r.sem && <Dot color={r.sem(r.t)} />}{r.alerta && <Dot color={VERMELHO} />}{r.n}
                    </p>
                    <p className="text-[10px] text-muted">{r.d}</p>
                  </td>
                  <td className="px-5 py-3 text-right text-[13px] font-extrabold tabular-nums" style={{ color: r.m == null ? '#c8cce6' : AZUL }}>
                    {r.m == null ? '—' : r.f(r.m)}
                  </td>
                  <td className="px-5 py-3 text-right text-[13px] font-extrabold tabular-nums" style={{ color: LARANJA }}>{r.f(r.g)}</td>
                  <td className="px-5 py-3 text-right text-[14px] font-black tabular-nums text-text">{r.f(r.t)}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 text-[10px] text-muted leading-relaxed" style={{ borderTop: '1px solid #f1f3f9' }}>
          Curtidas e compartilhamentos são reportados pelo YouTube a partir de jan/26. O alcance do Google soma as pessoas
          de cada mês — quem foi atingido em meses diferentes é contado mais de uma vez.
        </div>
      </Card>

      {/* KPIs de apoio */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="💰" label="Investimento total" value={R(INV_TOTAL)}       sub="≈ R$1.900 por mês"                 color={color} />
        <BigKpi icon="📲" label="Visitas ao perfil"  value={N(T.meta.perfil)}   sub={`${R2(T.meta.custoPerfil)} por visita`} color={VERDE} />
        <BigKpi icon="🎬" label="Assistiram ao vídeo" value={N(T.google.views)} sub={`${P(T.google.vr)} de quem começou a ver`} color={LARANJA} />
        <BigKpi icon="📍" label="Visitas ao posto"   value={N(T.google.conv)}   sub="pediram rota ou foram à loja" color={ROXO} />
      </div>

      {/* Divisão + Termômetro */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card titulo="💸 Como a verba foi dividida">
          <div className="p-5 space-y-4">
            <Bar value={T.meta.inv}   max={INV_TOTAL} color={AZUL}    label="Instagram e Facebook" subLeft="Levar gente ao perfil"        subRight={R(T.meta.inv)} />
            <Bar value={T.google.inv} max={INV_TOTAL} color={LARANJA} label="Google e YouTube"     subLeft="Marca aparecer na região"     subRight={R(T.google.inv)} />
            <p className="text-[11px] text-muted pt-1" style={{ borderTop: '1px solid #f1f3f9' }}>
              O investimento mensal ficou estável o ano inteiro, entre R$1.730 e R$2.240.
            </p>
          </div>
        </Card>

        <Card titulo="🌡️ Termômetro da marca" extra={<Legenda />}>
          <div className="p-5 space-y-0">
            {[
              { label: 'Frequência no Instagram', desc: 'vezes que a mesma pessoa vê por mês', value: `${D(T.meta.freq)}x`, cor: semFreq(T.meta.freq), badge: 'ideal 3 a 4x' },
              { label: 'Interesse (CTR)',          desc: 'de cada 100 que viram, quantas clicaram', value: P(T.meta.ctr), cor: semCtr(T.meta.ctr) },
              { label: 'Retenção do vídeo',        desc: 'quem assistiu depois de começar a ver', value: P(T.google.vr), cor: semVr(T.google.vr) },
              { label: 'Peças diferentes no ar',   desc: '312 anúncios em 14 meses, R$34 cada', value: N(T.meta.pecas), cor: VERMELHO, badge: 'mensagem diluída' },
              { label: 'Comentários no YouTube',   desc: 'em 5,1 milhões de exibições', value: '0', cor: VERMELHO },
              { label: 'Visitas ao posto',         desc: 'pediram rota ou foram à loja (dez–fev)', value: N(T.google.conv), cor: VERDE, badge: R2(0.32) + '/visita' },
            ].map(i => (
              <div key={i.label} className="flex items-center justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-text flex items-center gap-1.5"><Dot color={i.cor} />{i.label}</p>
                  <p className="text-[10px] text-muted mt-0.5">{i.desc}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {i.badge && <Badge color={i.cor} text={i.badge} />}
                  <span className="text-sm font-extrabold" style={{ color: i.cor }}>{i.value}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Funil */}
      <Card titulo="🚶 O caminho da pessoa no Instagram"
        extra={<span className="text-[10px] text-muted">cada degrau é menor que o anterior — isso é normal</span>}>
        <Funil color={AZUL} etapas={[
          { titulo: 'O anúncio apareceu na tela',  valor: T.meta.impr,   desc: 'Total de exibições. A mesma pessoa pode ver várias vezes.' },
          { titulo: 'Pessoas diferentes viram',    valor: T.meta.alc,    desc: `Cada uma viu, em média, ${D(T.meta.freq)} vezes por mês.` },
          { titulo: 'Clicaram no anúncio',         valor: T.meta.cliq,   desc: `De cada 100 que viram, ${D(T.meta.ctr, 1)} clicaram. ${R2(T.meta.cpc)} por clique.` },
          { titulo: 'Chegaram no perfil do posto', valor: T.meta.perfil, desc: `${R2(T.meta.custoPerfil)} por visita ao perfil (medido de ago/25 a ago/26).` },
        ]} />
      </Card>

      {/* Custos e resultados */}
      <Card titulo="💵 Custos e resultados por plataforma"
        extra={<span className="text-[10px] text-muted">o que cada real comprou</span>}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                <th className="text-left px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted">Indicador</th>
                <th className="text-right px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: AZUL }}>Instagram</th>
                <th className="text-right px-5 py-2.5 text-[10px] font-extrabold uppercase tracking-wider" style={{ color: LARANJA }}>Google</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Investimento',        'quanto foi aplicado em anúncios',              R2(T.meta.inv),        R2(T.google.inv)],
                ['CPM',                 'custo para aparecer mil vezes',                R2(T.meta.cpm),        R2(T.google.cpm)],
                ['Custo por clique',    'quanto custou cada clique',                    R2(T.meta.cpc),        '—'],
                ['Interesse (CTR)',     'de cada 100 que viram, quantas clicaram',      P(T.meta.ctr),         P(T.google.ctr, 3)],
                ['Visitas ao perfil',   'chegaram no Instagram do posto',               N(T.meta.perfil),      '—'],
                ['Custo por visita',    'quanto custou cada visita ao perfil',          R2(T.meta.custoPerfil),'—'],
                ['Assistiram ao vídeo', 'viram o vídeo no YouTube',                     '—',                   N(T.google.views)],
                ['Custo por visualização', 'cada pessoa que assistiu ao vídeo',         '—',                   R2(T.google.cpv)],
                ['Visitas ao posto',    'pediram rota ou foram até a loja',             '—',                   N(T.google.conv)],
                ['Peças diferentes',    'anúncios distintos veiculados',                N(T.meta.pecas),       '4'],
              ].map(([nome, exp, m, g], i) => (
                <motion.tr key={nome} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                  style={{ borderTop: '1px solid #f1f3f9' }}>
                  <td className="px-5 py-3">
                    <p className="text-[12px] font-bold text-text">{nome}</p>
                    <p className="text-[10px] text-muted">{exp}</p>
                  </td>
                  <td className="px-5 py-3 text-right text-[13px] font-extrabold tabular-nums" style={{ color: m === '—' ? '#c8cce6' : AZUL }}>{m}</td>
                  <td className="px-5 py-3 text-right text-[13px] font-extrabold tabular-nums" style={{ color: g === '—' ? '#c8cce6' : LARANJA }}>{g}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="px-5 py-3 text-[10px] text-muted" style={{ borderTop: '1px solid #f1f3f9' }}>
          O traço (—) indica indicador que só existe naquela plataforma. No Google, o alcance soma as pessoas de cada mês:
          quem foi atingido em meses diferentes é contado mais de uma vez.
        </p>
      </Card>

      {/* Destaques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {[
          { ok: true,  t: 'Menos anúncios rendeu mais',           d: 'Em julho e agosto de 2026 as peças no ar caíram de 79 para 15 e 27 — e o interesse subiu para o melhor patamar do período: 2,46% e 2,78%.' },
          { ok: true,  t: 'Falar de procedência funciona',        d: 'A peça "Você sabe o que tem no tanque" teve o melhor resultado de todos: 3x mais cliques que a média, a R$0,15 cada.' },
          { ok: true,  t: 'A campanha de rota trazia gente',      d: '2.339 visitas ao posto por R$751 no total, entre dezembro e fevereiro.' },
          { ok: false, t: 'A marca aparece menos vezes por pessoa', d: 'A frequência caiu de 2,43x para 1,69x por mês. Para a marca ficar na cabeça, o ideal é entre 3 e 4 vezes.' },
          { ok: false, t: 'A mensagem está espalhada demais',     d: '312 peças diferentes em 14 meses, com R$34 em média cada uma. Nenhuma fica no ar tempo suficiente para ser lembrada.' },
          { ok: false, t: 'O vídeo está prendendo menos',         d: 'A retenção caiu de 17,33% para 10,06%. Sinal de que os primeiros segundos não estão segurando quem assiste.' },
        ].map((i, n) => (
          <motion.div key={i.t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.06 }}
            className="rounded-xl p-3.5 flex gap-3 items-start"
            style={{ background: (i.ok ? VERDE : LARANJA) + '0f', border: `1px solid ${(i.ok ? VERDE : LARANJA)}30` }}>
            {i.ok
              ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: VERDE }} />
              : <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: LARANJA }} />}
            <div>
              <p className="text-[12px] font-extrabold text-text">{i.t}</p>
              <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{i.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ═══════════ MÊS A MÊS ═══════════ */
function MesAMes({ color }) {
  const [sel, setSel] = useState(MESES[MESES.length - 1].key)
  const [plat, setPlat] = useState('meta')
  const i = MESES.findIndex(m => m.key === sel)
  const m = MESES[i]
  const ant = i > 0 ? MESES[i - 1] : null

  const maxInv  = Math.max(...MESES.map(x => x.meta.inv + x.google.inv))
  const maxFreq = Math.max(...MESES.map(x => x.meta.freq))
  const maxVr   = Math.max(...MESES.map(x => x.google.vr))

  const delta = (a, b, inv = false) => {
    if (b == null || b === 0) return null
    const d = ((a - b) / b) * 100
    return { v: d, bom: inv ? d < 0 : d > 0 }
  }

  const resumo = () => {
    const p = []
    if (m.meta.ctr >= 2)       p.push(`o interesse foi alto (CTR de ${P(m.meta.ctr)}, acima da média do período)`)
    else if (m.meta.ctr < 1.5) p.push(`o interesse ficou abaixo da média (CTR de ${P(m.meta.ctr)})`)
    else                       p.push(`o interesse ficou na média (CTR de ${P(m.meta.ctr)})`)
    if (m.meta.pecas <= 30)      p.push(`a verba ficou concentrada em poucas peças (${m.meta.pecas} anúncios), o que costuma render mais`)
    else if (m.meta.pecas >= 70) p.push(`a verba se dividiu entre muitas peças (${m.meta.pecas} anúncios), o que dilui a mensagem`)
    if (m.google.conv > 0)     p.push(`e a campanha de rota gerou ${N(m.google.conv)} visitas ao posto`)
    else if (m.google.vr < 10) p.push(`e a retenção do vídeo ficou baixa (${P(m.google.vr)})`)
    return `Em ${m.nome.toLowerCase()} de ${m.ano}, ${p.join(', ')}.`
  }

  return (
    <div className="space-y-5">
      {/* Seletor de meses */}
      <div className="bg-white rounded-2xl p-4" style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted mb-2.5">Escolha o mês</p>
        <div className="flex gap-1.5 flex-wrap">
          {MESES.map(x => (
            <button key={x.key} onClick={() => setSel(x.key)}
              className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
              style={sel === x.key
                ? { background: color, color: '#fff', boxShadow: `0 2px 10px ${color}44` }
                : { background: color + '12', color }}>
              {x.label}
            </button>
          ))}
        </div>
      </div>

      {/* HERO do mês */}
      <motion.div key={m.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.55)' }}>
            {m.nome} de {m.ano}
          </p>
          <div className="flex flex-wrap gap-8 mt-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Investido no mês</p>
              <p className="text-2xl font-black text-white">{R2(m.meta.inv + m.google.inv)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Pessoas alcançadas</p>
              <p className="text-2xl font-black" style={{ color }}>{N(m.meta.alc)}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider font-bold" style={{ color: 'rgba(255,255,255,0.6)' }}>Visitas ao perfil</p>
              <p className="text-2xl font-black" style={{ color: VERDE }}>{m.meta.perfil ? N(m.meta.perfil) : '—'}</p>
            </div>
          </div>
          <p className="text-[11px] mt-3 max-w-2xl leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>{resumo()}</p>
        </div>
      </motion.div>

      {/* KPIs do mês */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <BigKpi icon="📱" label="Instagram" value={R2(m.meta.inv)} sub={`CPM ${R2(m.meta.cpm)} por mil exibições`} color={AZUL} />
        <BigKpi icon="🔁" label="Frequência" value={`${D(m.meta.freq)}x`} sub="ideal entre 3 e 4 vezes" color={semFreq(m.meta.freq)} />
        <BigKpi icon="👆" label="Interesse (CTR)" value={P(m.meta.ctr)} sub={`${R2(m.meta.cpc)} por clique`} color={semCtr(m.meta.ctr)} />
        <BigKpi icon="🎨" label="Peças no ar" value={N(m.meta.pecas)}
          sub={m.meta.pecas <= 30 ? 'verba concentrada' : 'verba dividida entre muitas peças'} color={semPecas(m.meta.pecas)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Funil do mês */}
        <Card titulo="🚶 Caminho da pessoa no Instagram">
          <Funil color={AZUL} etapas={[
            { titulo: 'O anúncio apareceu',       valor: m.meta.impr, desc: 'Vezes que a peça foi exibida no mês.' },
            { titulo: 'Pessoas diferentes viram', valor: m.meta.alc,  desc: `Cada uma viu, em média, ${D(m.meta.freq)} vezes.` },
            { titulo: 'Clicaram',                 valor: m.meta.cliq, desc: `De cada 100 que viram, ${D(m.meta.ctr, 1)} clicaram.` },
            ...(m.meta.perfil ? [{ titulo: 'Chegaram no perfil', valor: m.meta.perfil, desc: `${R2(m.meta.inv / m.meta.perfil)} por visita ao perfil.` }] : []),
          ]} />
        </Card>

        {/* Google do mês */}
        <Card titulo="▶️ Google e YouTube no mês" extra={<Legenda />}>
          <div className="p-5 space-y-0">
            {[
              { l: 'Investimento',        d: `CPM ${R2(m.google.cpm)} por mil exibições`,      v: R2(m.google.inv),   c: LARANJA },
              { l: 'Pessoas alcançadas',  d: `viram, em média, ${D(m.google.freq)} vezes`,     v: N(m.google.users),  c: LARANJA },
              { l: 'Assistiram ao vídeo', d: `${P(m.google.vr)} de quem começou a ver`,        v: N(m.google.views),  c: semVr(m.google.vr) },
              { l: 'Custo por visualização', d: 'quanto custou cada pessoa que assistiu',      v: R2(m.google.cpv),   c: LARANJA },
              { l: 'Visitas ao posto',    d: m.google.conv > 0 ? 'pediram rota ou foram à loja' : 'campanha de rota pausada neste mês', v: N(m.google.conv), c: m.google.conv > 0 ? VERDE : '#c8cce6' },
              { l: 'Curtidas e compartilhamentos', d: 'sinais de envolvimento com a marca',    v: `${N(m.google.likes)} · ${N(m.google.shares)}`, c: ROXO },
            ].map(i => (
              <div key={i.l} className="flex items-center justify-between gap-3 py-2.5" style={{ borderBottom: '1px solid #f1f3f9' }}>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold text-text">{i.l}</p>
                  <p className="text-[10px] text-muted mt-0.5">{i.d}</p>
                </div>
                <span className="text-sm font-extrabold shrink-0" style={{ color: i.c }}>{i.v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Comparativo */}
      {ant && (
        <Card titulo={`📈 Comparado com ${ant.nome.toLowerCase()}`}
          extra={<span className="text-[10px] text-muted">verde é melhora, vermelho é piora</span>}>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-5">
            {[
              { l: 'Interesse (CTR)',    d: delta(m.meta.ctr, ant.meta.ctr),             a: 'quanto mais gente clica, melhor' },
              { l: 'Custo por clique',   d: delta(m.meta.cpc, ant.meta.cpc, true),       a: 'quanto mais barato, melhor' },
              { l: 'Frequência',         d: delta(m.meta.freq, ant.meta.freq),           a: 'quanto mais vezes vista, melhor' },
              { l: 'Retenção do vídeo',  d: delta(m.google.vr, ant.google.vr),           a: 'quanto mais gente assiste, melhor' },
            ].map(x => (
              <div key={x.l} className="rounded-xl p-3.5" style={{ background: '#f7f8fc' }}>
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-muted">{x.l}</p>
                {x.d ? (
                  <p className="text-xl font-black mt-1 flex items-center gap-1" style={{ color: x.d.bom ? VERDE : VERMELHO }}>
                    {x.d.bom ? <TrendingUp size={15} /> : <TrendingDown size={15} />}
                    {x.d.v > 0 ? '+' : ''}{D(x.d.v, 1)}%
                  </p>
                ) : <p className="text-xl font-black mt-1 text-muted">—</p>}
                <p className="text-[10px] text-muted mt-0.5">{x.a}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Tabela de todos os meses */}
      <Card titulo="📅 Todos os meses"
        extra={
          <div className="flex gap-1.5">
            {[['meta', '📱 Instagram'], ['google', '▶️ Google']].map(([k, t]) => (
              <button key={k} onClick={() => setPlat(k)}
                className="text-[11px] font-bold px-3 py-1.5 rounded-lg transition"
                style={plat === k ? { background: color, color: '#fff' } : { background: color + '12', color }}>
                {t}
              </button>
            ))}
          </div>
        }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: '#f7f8fc' }}>
                {(plat === 'meta'
                  ? ['Mês', 'Investimento', 'Impressões', 'Alcance', 'Freq.', 'Cliques', 'CTR', 'Visitas perfil', 'Peças']
                  : ['Mês', 'Investimento', 'Impressões', 'Alcance', 'Freq.', 'Cliques', 'Assistiram', 'Retenção', 'Visitas posto']
                ).map((h, n) => (
                  <th key={h} className={`px-4 py-2.5 text-[10px] font-extrabold uppercase tracking-wider text-muted ${n === 0 ? 'text-left' : 'text-right'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MESES.map((x, n) => (
                <motion.tr key={x.key} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: n * 0.02 }}
                  onClick={() => setSel(x.key)}
                  className="cursor-pointer transition hover:bg-slate-50"
                  style={{ borderTop: '1px solid #f1f3f9', background: sel === x.key ? color + '0d' : undefined }}>
                  <td className="px-4 py-2.5 text-[12px] font-extrabold text-text whitespace-nowrap">{x.label}</td>
                  {plat === 'meta' ? (
                    <>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{R2(x.meta.inv)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.meta.impr)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.meta.alc)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-extrabold tabular-nums" style={{ color: semFreq(x.meta.freq) }}>{D(x.meta.freq)}x</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.meta.cliq)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-extrabold tabular-nums" style={{ color: semCtr(x.meta.ctr) }}>{P(x.meta.ctr)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{x.meta.perfil ? N(x.meta.perfil) : '—'}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-extrabold tabular-nums" style={{ color: semPecas(x.meta.pecas) }}>{x.meta.pecas}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{R2(x.google.inv)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.google.impr)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.google.users)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{D(x.google.freq)}x</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.google.cliq)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] tabular-nums">{N(x.google.views)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-extrabold tabular-nums" style={{ color: semVr(x.google.vr) }}>{P(x.google.vr)}</td>
                      <td className="px-4 py-2.5 text-right text-[12px] font-extrabold tabular-nums" style={{ color: x.google.conv > 0 ? VERDE : '#c8cce6' }}>{N(x.google.conv)}</td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-5 py-3 flex items-center justify-between gap-3 flex-wrap" style={{ borderTop: '1px solid #f1f3f9' }}>
          <Legenda />
          <span className="text-[10px] text-muted">clique em uma linha para abrir o mês acima</span>
        </div>
      </Card>

      {/* Evolução */}
      <Card titulo="📉 Como cada indicador evoluiu">
        <div className="p-5 space-y-5">
          {[
            { t: 'Investimento por mês',        s: 'somando as duas plataformas',                          get: x => x.meta.inv + x.google.inv, max: maxInv,  cor: color,   fmt: R2 },
            { t: 'Frequência no Instagram',     s: 'vezes que a mesma pessoa vê no mês — ideal 3 a 4',      get: x => x.meta.freq,               max: maxFreq, cor: AZUL,    fmt: v => `${D(v)}x` },
            { t: 'Retenção do vídeo no YouTube', s: 'de cada 100 que começaram a ver, quantas assistiram', get: x => x.google.vr,               max: maxVr,   cor: LARANJA, fmt: v => P(v) },
          ].map(serie => (
            <div key={serie.t}>
              <p className="text-xs font-bold text-text">{serie.t}</p>
              <p className="text-[10px] text-muted mb-2">{serie.s}</p>
              <div className="space-y-1">
                {MESES.map(x => {
                  const pct = Math.max(3, Math.round((serie.get(x) / serie.max) * 100))
                  return (
                    <button key={x.key} onClick={() => setSel(x.key)}
                      className="flex w-full items-center gap-3 rounded-lg px-1 py-0.5 transition hover:bg-slate-50">
                      <span className="w-12 shrink-0 text-[10px] font-bold text-muted text-left">{x.label}</span>
                      <span className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: serie.cor + '18' }}>
                        <motion.span className="block h-full rounded-full" style={{ background: serie.cor }}
                          initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} />
                      </span>
                      <span className="w-16 shrink-0 text-right text-[10px] tabular-nums text-muted">{serie.fmt(serie.get(x))}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

/* ═══════════ GLOSSÁRIO ═══════════ */
function Glossario({ color }) {
  const termos = [
    { icon: '👀', t: 'Impressões',        d: 'Quantas vezes o anúncio apareceu na tela de alguém. A mesma pessoa pode ver várias vezes — por isso esse número é sempre maior que o alcance.' },
    { icon: '🧍', t: 'Alcance',           d: 'Quantas pessoas diferentes viram o anúncio. É o tamanho real do público atingido.' },
    { icon: '🔁', t: 'Frequência',        d: 'Quantas vezes, em média, a mesma pessoa viu o anúncio no mês. Para a marca ser lembrada, o ideal fica entre 3 e 4 vezes.' },
    { icon: '👆', t: 'CTR (interesse)',   d: 'De cada 100 pessoas que viram o anúncio, quantas clicaram. Mostra se a peça chamou atenção.' },
    { icon: '💵', t: 'CPC',               d: 'Custo por clique: quanto se pagou cada vez que alguém clicou no anúncio.' },
    { icon: '📊', t: 'CPM',               d: 'Custo por mil: quanto custou para o anúncio aparecer 1.000 vezes.' },
    { icon: '📲', t: 'Visitas ao perfil', d: 'Pessoas que foram até o Instagram do posto depois de ver o anúncio. É o objetivo das campanhas do Meta.' },
    { icon: '🎬', t: 'Retenção do vídeo', d: 'De cada 100 pessoas que viram o vídeo começar, quantas assistiram de fato. Mede se o conteúdo prende.' },
    { icon: '📍', t: 'Visitas ao posto',  d: 'Pessoas que pediram rota ou foram até a loja física depois de ver o anúncio.' },
  ]
  return (
    <div className="space-y-4">
      <div className="rounded-3xl p-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.4)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 80% 20%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <p className="text-lg font-black text-white">📖 O que cada número significa</p>
          <p className="text-[11px] mt-1" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Guia rápido para ler os indicadores sem depender de quem montou o relatório.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {termos.map((x, n) => (
          <motion.div key={x.t} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: n * 0.04 }}
            className="bg-white rounded-2xl p-4 flex gap-3 items-start"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08)' }}>
            <span className="text-xl shrink-0">{x.icon}</span>
            <div>
              <p className="text-[12.5px] font-extrabold text-text">{x.t}</p>
              <p className="text-[11px] text-muted mt-0.5 leading-relaxed">{x.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="rounded-xl p-4" style={{ background: VERDE + '0f', border: `1px solid ${VERDE}30` }}>
        <p className="text-[11px] text-muted leading-relaxed">
          <strong className="text-text">Fonte dos dados:</strong> exportações do Meta Ads (nível campanha e nível anúncio) e do
          Google Ads, de 1º de julho de 2025 a 31 de agosto de 2026. Todos os números desta tela vêm direto desses relatórios.
        </p>
      </div>
    </div>
  )
}

/* ═══════════ RAIZ ═══════════ */
export default function RizzottoResultados({ color = AZUL }) {
  const [aba, setAba] = useState('geral')
  const abas = [
    { id: 'geral',     label: '📊 Visão Geral' },
    { id: 'mensal',    label: '📅 Mês a Mês' },
    { id: 'glossario', label: '📖 Como Ler' },
  ]
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-extrabold text-text flex items-center gap-2 flex-wrap">
          Indicadores
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: color + '15', color }}>Posto Rizzotto</span>
        </h2>
        <p className="text-xs text-muted mt-0.5">Jul/2025 – Ago/2026 · 14 meses · Instagram + Google/YouTube</p>
      </div>

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

      {aba === 'geral' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><VisaoGeral color={color} /></motion.div>
      )}
      {aba === 'mensal' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><MesAMes color={color} /></motion.div>
      )}
      {aba === 'glossario' && (
        <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}><Glossario color={color} /></motion.div>
      )}
    </div>
  )
}
