import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Eye, Users, Repeat, MousePointerClick, Wallet, PlayCircle, Heart, Target, Lightbulb, AlertTriangle, CheckCircle2 } from 'lucide-react'

const R2     = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)
const fmtNum = n => new Intl.NumberFormat('pt-BR').format(Math.round(n))
const pct    = (n, d = 2) => `${n.toFixed(d).replace('.', ',')}%`
const dec    = (n, d = 2) => n.toFixed(d).replace('.', ',')

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

/* ── UI ── */
function Kpi({ icon: Icon, label, valor, sub, cor, ajuda }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-wide text-muted">
        <Icon size={13} style={{ color: cor }} /> {label}
      </div>
      <div className="text-2xl font-semibold leading-tight" style={{ color: cor }}>{valor}</div>
      {sub && <div className="text-[12px] text-muted">{sub}</div>}
      {ajuda && <div className="text-[11px] text-muted/70 leading-snug mt-1">{ajuda}</div>}
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

function Secao({ titulo, desc, children, cor }) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-base font-semibold flex items-center gap-2">
          <span className="inline-block h-4 w-1 rounded-full" style={{ background: cor }} />
          {titulo}
        </h3>
        {desc && <p className="text-[12.5px] text-muted mt-1 leading-relaxed">{desc}</p>}
      </div>
      {children}
    </section>
  )
}

function Glossario({ itens }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
      <div className="text-[11px] uppercase tracking-wide text-muted mb-3 flex items-center gap-2">
        <Lightbulb size={13} /> O que cada número significa
      </div>
      <dl className="grid gap-2.5 sm:grid-cols-2">
        {itens.map(i => (
          <div key={i.termo} className="text-[12.5px] leading-snug">
            <dt className="font-medium">{i.termo}</dt>
            <dd className="text-muted">{i.desc}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

export default function RizzottoResultados({ color = '#60a5fa' }) {
  const [visao, setVisao] = useState('agrupado')
  const [mesKey, setMesKey] = useState(MESES[MESES.length - 1].key)
  const mes = useMemo(() => MESES.find(m => m.key === mesKey), [mesKey])
  const idx = MESES.findIndex(m => m.key === mesKey)
  const anterior = idx > 0 ? MESES[idx - 1] : null

  const maxInvest = Math.max(...MESES.map(m => m.meta.investimento + m.google.investimento))
  const maxFreqMeta = Math.max(...MESES.map(m => m.meta.frequencia))
  const maxViewRate = Math.max(...MESES.map(m => m.google.viewRate))

  const delta = (atual, ant, inverso = false) => {
    if (ant == null || ant === 0) return null
    const d = ((atual - ant) / ant) * 100
    const bom = inverso ? d < 0 : d > 0
    return { valor: d, bom }
  }

  return (
    <div className="space-y-8">
      {/* Cabeçalho */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.06] to-transparent p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-muted">Posto Rizzotto · Mídia paga</div>
            <h2 className="text-2xl font-semibold mt-1">Indicadores de julho/2025 a agosto/2026</h2>
            <p className="text-[13px] text-muted mt-2 max-w-2xl leading-relaxed">
              14 meses de investimento em Meta Ads (Instagram e Facebook) e Google/YouTube Ads.
              Use os botões abaixo para ver o <strong>resultado somado do período</strong> ou <strong>mês a mês</strong>.
            </p>
          </div>
          <div className="flex gap-2">
            {[['agrupado', 'Visão agrupada'], ['mensal', 'Mês a mês']].map(([k, t]) => (
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
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          {/* Consolidado */}
          <Secao titulo="O período inteiro em números" cor={color}
            desc="Soma dos 14 meses nas duas plataformas juntas.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={Wallet} label="Investimento total" valor={R2(INVEST_TOTAL)} cor={color}
                sub="≈ R$ 1.900 por mês" ajuda="Quanto foi aplicado em anúncios no período." />
              <Kpi icon={Eye} label="Impressões" valor={fmtNum(IMPR_TOTAL)} cor={color}
                sub="Meta + Google" ajuda="Quantas vezes os anúncios apareceram na tela de alguém." />
              <Kpi icon={Users} label="Alcance no Meta" valor={fmtNum(TOTAIS.meta.alcance)} cor={META_COR}
                sub="pessoas atingidas" ajuda="Pessoas diferentes que viram os anúncios no Instagram/Facebook." />
              <Kpi icon={MousePointerClick} label="Cliques" valor={fmtNum(TOTAIS.meta.cliques + TOTAIS.google.cliques)} cor={color}
                sub={`${fmtNum(TOTAIS.meta.cliques)} Meta · ${fmtNum(TOTAIS.google.cliques)} Google`}
                ajuda="Pessoas que interagiram e foram até o perfil ou site." />
            </div>
          </Secao>

          {/* Divisão do investimento */}
          <Secao titulo="Como o investimento foi dividido" cor={color}
            desc="O Google recebeu 60% da verba; o Meta, 40%.">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { nome: 'Meta Ads (Instagram/Facebook)', v: TOTAIS.meta.investimento, cor: META_COR },
                { nome: 'Google / YouTube Ads',          v: TOTAIS.google.investimento, cor: GOOGLE_COR },
              ].map(c => (
                <div key={c.nome} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
                  <div className="flex items-baseline justify-between">
                    <span className="text-[12.5px]">{c.nome}</span>
                    <span className="text-lg font-semibold" style={{ color: c.cor }}>{R2(c.v)}</span>
                  </div>
                  <Barra valor={c.v} max={INVEST_TOTAL} cor={c.cor} />
                  <div className="text-[11.5px] text-muted">{pct(c.v / INVEST_TOTAL * 100, 1)} do total</div>
                </div>
              ))}
            </div>
          </Secao>

          {/* Meta */}
          <Secao titulo="Meta Ads — Instagram e Facebook" cor={META_COR}
            desc="Campanhas de tráfego para o perfil. O objetivo aqui é levar gente para o Instagram do posto.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={Wallet} label="Investimento" valor={R2(TOTAIS.meta.investimento)} cor={META_COR} />
              <Kpi icon={Eye} label="Impressões" valor={fmtNum(TOTAIS.meta.impressoes)} cor={META_COR} />
              <Kpi icon={Users} label="Alcance" valor={fmtNum(TOTAIS.meta.alcance)} cor={META_COR}
                sub="pessoas diferentes" ajuda="Quantas pessoas distintas viram os anúncios." />
              <Kpi icon={Repeat} label="Frequência média" valor={`${dec(TOTAIS.meta.frequencia)}x`} cor={META_COR}
                sub="por pessoa/mês" ajuda="Quantas vezes a mesma pessoa viu o anúncio no mês." />
              <Kpi icon={MousePointerClick} label="Cliques" valor={fmtNum(TOTAIS.meta.cliques)} cor={META_COR}
                sub={`CTR ${pct(TOTAIS.meta.ctr)} · CPC ${R2(TOTAIS.meta.cpc)}`} ajuda="De cada 100 pessoas que viram, quantas clicaram." />
              <Kpi icon={Target} label="Visitas ao perfil" valor={fmtNum(TOTAIS.meta.visitasPerfil)} cor={META_COR}
                sub={`${R2(TOTAIS.meta.custoVisita)} por visita · ago/25 a ago/26`}
                ajuda="Pessoas que foram até o Instagram do posto depois de ver o anúncio." />
            </div>
          </Secao>

          {/* Google */}
          <Secao titulo="Google e YouTube Ads" cor={GOOGLE_COR}
            desc="Campanhas de vídeo com foco em alcance na região de Araranguá e Arroio do Silva.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Kpi icon={Wallet} label="Investimento" valor={R2(TOTAIS.google.investimento)} cor={GOOGLE_COR} />
              <Kpi icon={Eye} label="Impressões" valor={fmtNum(TOTAIS.google.impressoes)} cor={GOOGLE_COR} />
              <Kpi icon={PlayCircle} label="Visualizações" valor={fmtNum(TOTAIS.google.views)} cor={GOOGLE_COR}
                sub={`${pct(TOTAIS.google.viewRate)} de retenção`} ajuda="Quantas pessoas assistiram ao vídeo de fato." />
              <Kpi icon={Target} label="Visitas ao local" valor={fmtNum(TOTAIS.google.conversoes)} cor={GOOGLE_COR}
                sub="dez/25 a fev/26" ajuda="Cliques em 'ver rota' e visitas ao posto geradas pela campanha Performance Max." />
            </div>
          </Secao>

          {/* Engajamento */}
          <Secao titulo="Sinais de relacionamento com a marca" cor={color}
            desc="Curtidas, compartilhamentos e comentários mostram se as pessoas se envolvem — não só assistem.">
            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi icon={Heart} label="Curtidas no YouTube" valor={fmtNum(TOTAIS.google.likes)} cor={GOOGLE_COR} sub="a partir de jan/26" />
              <Kpi icon={TrendingUp} label="Compartilhamentos" valor={fmtNum(TOTAIS.google.shares)} cor={GOOGLE_COR} sub="a partir de jan/26" />
              <Kpi icon={AlertTriangle} label="Comentários" valor="0" cor="#ef4444" sub="em 5,1 mi de impressões" />
            </div>
          </Secao>

          {/* Leitura */}
          <Secao titulo="Leitura do período" cor={color} desc="O que os números contam, em linguagem simples.">
            <div className="grid gap-3 lg:grid-cols-2">
              {[
                { tipo: 'ok', titulo: 'Julho e agosto/26 foram os melhores meses',
                  txt: 'Com menos anúncios no ar (15 e 27, contra 79 em junho), o CTR subiu para 2,46% e 2,78% — o melhor de todo o período. Concentrar a verba em menos peças funcionou.' },
                { tipo: 'ok', titulo: 'Procedência do combustível é o tema campeão',
                  txt: 'A peça "Você sabe o que tem no tanque" teve CTR de 5,28% e custo por clique de R$ 0,15 — três vezes melhor que a média da conta.' },
                { tipo: 'alerta', titulo: 'A frequência está caindo',
                  txt: 'No Meta, a mesma pessoa via o anúncio 2,43x por mês em jul/25 e passou a ver 1,69x em ago/26. Para a marca ser lembrada, o ideal é entre 3 e 4 vezes.' },
                { tipo: 'alerta', titulo: 'A mensagem está espalhada demais',
                  txt: '312 anúncios diferentes em 14 meses, com R$ 34 em média cada um. Nenhuma mensagem fica no ar tempo suficiente para ser memorizada.' },
                { tipo: 'alerta', titulo: 'A retenção do vídeo no YouTube caiu pela metade',
                  txt: 'De 17,33% em jul/25 para 10,06% em ago/26. A campanha institucional "Seu dia começa aqui" está em 1,5% de retenção.' },
                { tipo: 'ok', titulo: 'A campanha de visitas ao local funcionava',
                  txt: '2.339 visitas ao posto e cliques em rota por R$ 751 (cerca de R$ 0,32 cada) entre dez/25 e fev/26, quando foi pausada.' },
              ].map(i => (
                <div key={i.titulo} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 flex gap-3">
                  {i.tipo === 'ok'
                    ? <CheckCircle2 size={16} className="mt-0.5 shrink-0" style={{ color: '#6eda2c' }} />
                    : <AlertTriangle size={16} className="mt-0.5 shrink-0" style={{ color: '#f59e0b' }} />}
                  <div>
                    <div className="text-[13px] font-medium">{i.titulo}</div>
                    <p className="text-[12.5px] text-muted mt-1 leading-relaxed">{i.txt}</p>
                  </div>
                </div>
              ))}
            </div>
          </Secao>

          <Glossario itens={[
            { termo: 'Impressões', desc: 'Quantas vezes o anúncio apareceu na tela de alguém.' },
            { termo: 'Alcance', desc: 'Quantas pessoas diferentes viram o anúncio.' },
            { termo: 'Frequência', desc: 'Quantas vezes, em média, a mesma pessoa viu o anúncio no mês.' },
            { termo: 'CTR', desc: 'De cada 100 pessoas que viram, quantas clicaram.' },
            { termo: 'CPC', desc: 'Quanto custou cada clique.' },
            { termo: 'CPM', desc: 'Quanto custou para aparecer 1.000 vezes.' },
            { termo: 'Retenção (view rate)', desc: 'De cada 100 pessoas que viram o vídeo começar, quantas assistiram.' },
            { termo: 'Visitas ao local', desc: 'Pessoas que pediram rota ou foram até o posto depois de ver o anúncio.' },
          ]} />
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

          <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 space-y-6">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h3 className="text-xl font-semibold">{mes.label} de {mes.ano}</h3>
              <div className="text-[13px] text-muted">
                Investimento do mês: <strong style={{ color }}>{R2(mes.meta.investimento + mes.google.investimento)}</strong>
              </div>
            </div>

            {/* Meta do mês */}
            <Secao titulo="Meta Ads" cor={META_COR} desc="Instagram e Facebook.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi icon={Wallet} label="Investimento" valor={R2(mes.meta.investimento)} cor={META_COR} />
                <Kpi icon={Eye} label="Impressões" valor={fmtNum(mes.meta.impressoes)} cor={META_COR} />
                <Kpi icon={Users} label="Alcance" valor={fmtNum(mes.meta.alcance)} cor={META_COR} sub="pessoas diferentes" />
                <Kpi icon={Repeat} label="Frequência" valor={`${dec(mes.meta.frequencia)}x`} cor={META_COR} sub="vezes por pessoa" />
                <Kpi icon={MousePointerClick} label="Cliques" valor={fmtNum(mes.meta.cliques)} cor={META_COR} />
                <Kpi icon={TrendingUp} label="CTR" valor={pct(mes.meta.ctr)} cor={META_COR} />
                <Kpi icon={Users} label="Visitas ao perfil" valor={mes.meta.resultados ? fmtNum(mes.meta.resultados) : '—'} cor={META_COR}
                  sub={mes.meta.resultados ? `${R2(mes.meta.investimento / mes.meta.resultados)} por visita` : 'indicador diferente no mês'}
                  ajuda="Pessoas que foram até o Instagram do posto depois de ver o anúncio." />
                <Kpi icon={Wallet} label="CPC" valor={R2(mes.meta.cpc)} cor={META_COR} sub={`CPM ${R2(mes.meta.cpm)}`} />
                <Kpi icon={Target} label="Anúncios no ar" valor={fmtNum(mes.meta.criativos)} cor={META_COR}
                  sub={mes.meta.criativos <= 30 ? 'verba concentrada' : 'verba diluída'} />
              </div>
            </Secao>

            {/* Google do mês */}
            <Secao titulo="Google e YouTube Ads" cor={GOOGLE_COR} desc="Campanhas de vídeo na região.">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi icon={Wallet} label="Investimento" valor={R2(mes.google.investimento)} cor={GOOGLE_COR} />
                <Kpi icon={Eye} label="Impressões" valor={fmtNum(mes.google.impressoes)} cor={GOOGLE_COR} />
                <Kpi icon={Users} label="Usuários únicos" valor={fmtNum(mes.google.usuarios)} cor={GOOGLE_COR} sub="pessoas diferentes" />
                <Kpi icon={Repeat} label="Frequência" valor={`${dec(mes.google.frequencia)}x`} cor={GOOGLE_COR} sub="vezes por pessoa" />
                <Kpi icon={PlayCircle} label="Visualizações" valor={fmtNum(mes.google.views)} cor={GOOGLE_COR} />
                <Kpi icon={TrendingUp} label="Retenção do vídeo" valor={pct(mes.google.viewRate)} cor={GOOGLE_COR}
                  sub={mes.google.viewRate >= 13 ? 'boa' : 'abaixo do ideal'} />
                <Kpi icon={Wallet} label="Custo por visualização" valor={R2(mes.google.cpv)} cor={GOOGLE_COR} sub={`CPM ${R2(mes.google.cpm)}`} />
                <Kpi icon={Target} label="Visitas ao local" valor={fmtNum(mes.google.conversoes)} cor={GOOGLE_COR}
                  sub={mes.google.conversoes > 0 ? 'campanha ativa' : 'campanha pausada'} />
              </div>
            </Secao>

            {/* Comparativo com mês anterior */}
            {anterior && (
              <Secao titulo={`Comparado a ${anterior.label.toLowerCase()}`} cor={color} desc="Verde é melhora, vermelho é piora.">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    { label: 'CTR do Meta',        d: delta(mes.meta.ctr, anterior.meta.ctr) },
                    { label: 'CPC do Meta',        d: delta(mes.meta.cpc, anterior.meta.cpc, true) },
                    { label: 'Frequência no Meta', d: delta(mes.meta.frequencia, anterior.meta.frequencia) },
                    { label: 'Retenção no YouTube',d: delta(mes.google.viewRate, anterior.google.viewRate) },
                  ].map(i => (
                    <div key={i.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-wide text-muted">{i.label}</div>
                      {i.d ? (
                        <div className="mt-1 flex items-center gap-1.5 text-xl font-semibold"
                          style={{ color: i.d.bom ? '#6eda2c' : '#ef4444' }}>
                          {i.d.bom ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                          {i.d.valor > 0 ? '+' : ''}{dec(i.d.valor, 1)}%
                        </div>
                      ) : <div className="mt-1 text-xl font-semibold text-muted">—</div>}
                    </div>
                  ))}
                </div>
              </Secao>
            )}
          </div>

          {/* Evolução */}
          <Secao titulo="Evolução ao longo dos 14 meses" cor={color}
            desc="Barras maiores indicam valores maiores. Clique no mês acima para ver o detalhe.">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-4">
              {[
                { titulo: 'Investimento total por mês', get: m => m.meta.investimento + m.google.investimento, max: maxInvest, cor: color, fmt: R2 },
                { titulo: 'Frequência no Meta (vezes por pessoa)', get: m => m.meta.frequencia, max: maxFreqMeta, cor: META_COR, fmt: v => `${dec(v)}x` },
                { titulo: 'Retenção do vídeo no YouTube', get: m => m.google.viewRate, max: maxViewRate, cor: GOOGLE_COR, fmt: v => pct(v) },
              ].map(serie => (
                <div key={serie.titulo} className="space-y-2">
                  <div className="text-[12px] font-medium">{serie.titulo}</div>
                  <div className="space-y-1.5">
                    {MESES.map(m => (
                      <div key={m.key} className="flex items-center gap-3">
                        <span className="w-14 shrink-0 text-[11px] text-muted">{m.badge}</span>
                        <div className="flex-1"><Barra valor={serie.get(m)} max={serie.max} cor={serie.cor} /></div>
                        <span className="w-20 shrink-0 text-right text-[11px] tabular-nums text-muted">{serie.fmt(serie.get(m))}</span>
                      </div>
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
