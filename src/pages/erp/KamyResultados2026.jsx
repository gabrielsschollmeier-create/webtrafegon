import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Wallet, TrendingUp, Trophy, Ticket, DollarSign, Eye, Users, BarChart3, Info, Lightbulb, Rocket } from 'lucide-react'

const BRL = (n, d = 2) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: d, maximumFractionDigits: d }).format(n)
const K   = n => 'R$ ' + new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n)
const N   = n => new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n)

// Base real jan–jul 2026 (Meta + Google/YouTube) + vendas (funil GHL)
const MESES = [
  { m: 'Jan', vendas: 22119.41,  negocios: 32, meta: { inv: 947.67,  alc: 23410, imp: 175194, leads: 83 },  yt: { inv: 172.64, alc: 35812, imp: 51353,  views: 5908 } },
  { m: 'Fev', vendas: 38518.00,  negocios: 41, meta: { inv: 602.27,  alc: 19313, imp: 115740, leads: 58 },  yt: { inv: 456.37, alc: 53673, imp: 106012, views: 14104 } },
  { m: 'Mar', vendas: 64355.63,  negocios: 51, meta: { inv: 1462.18, alc: 23780, imp: 246139, leads: 118 }, yt: { inv: 456.45, alc: 56942, imp: 118176, views: 11690 } },
  { m: 'Abr', vendas: 70806.92,  negocios: 62, meta: { inv: 1426.91, alc: 21205, imp: 217089, leads: 106 }, yt: { inv: 276.98, alc: 36282, imp: 63386,  views: 6441 } },
  { m: 'Mai', vendas: 71269.00,  negocios: 71, meta: { inv: 1509.74, alc: 19344, imp: 194356, leads: 93 },  yt: { inv: 324.45, alc: 31928, imp: 63083,  views: 6627 } },
  { m: 'Jun', vendas: 110708.20, negocios: 77, meta: { inv: 1564.28, alc: 29734, imp: 183205, leads: 87 },  yt: { inv: 457.00, alc: 47812, imp: 88470,  views: 8853 }, pico: true },
  { m: 'Jul', vendas: 85007.25,  negocios: 80, meta: { inv: 1689.16, alc: 35211, imp: 187183, leads: 73 },  yt: { inv: 456.86, alc: 57350, imp: 92217,  views: 11325 } },
]

const CANAIS = {
  consolidado: { label: 'Consolidado', cor: '#be29ec' },
  meta:        { label: 'Meta Ads',    cor: '#1877f2' },
  youtube:     { label: 'YouTube',     cor: '#ff2d2d' },
}

// extrai as métricas de mídia de um mês pro canal escolhido
const midia = (mo, canal) => {
  if (canal === 'meta')    return { inv: mo.meta.inv, alc: mo.meta.alc, imp: mo.meta.imp, views: null }
  if (canal === 'youtube') return { inv: mo.yt.inv,   alc: mo.yt.alc,   imp: mo.yt.imp,   views: mo.yt.views }
  return { inv: mo.meta.inv + mo.yt.inv, alc: mo.meta.alc + mo.yt.alc, imp: mo.meta.imp + mo.yt.imp, views: mo.yt.views }
}

const shadow = '0 2px 14px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.05)'
const MAX_V = Math.max(...MESES.map(m => m.vendas))

const INSIGHTS = [
  { cor: '#6eda2c', icon: Rocket, titulo: 'Retorno excepcional com verba baixa',
    dado: 'ROAS de 39,2× investindo só R$ 11,8 mil em 7 meses. O gargalo não é a conversão — é o volume de mídia.',
    acao: 'Escalar o orçamento gradualmente; há muito espaço acima do investido hoje.' },
  { cor: '#ea8a29', icon: TrendingUp, titulo: 'Custo do lead subindo no Meta',
    dado: 'CPL foi de R$ 10,38 (fev) para R$ 23,14 (jul) — mais que dobrou, e com menos leads no mês.',
    acao: 'Renovar criativos e revisar público: sinal de saturação da campanha.' },
  { cor: '#be29ec', icon: Trophy, titulo: 'Junho foi o pico em tudo',
    dado: 'R$ 110,7 mil em vendas, ROAS 54,8× e ticket médio R$ 1.438 — o melhor mês do período.',
    acao: 'Mapear ofertas e criativos de junho e repetir a fórmula.' },
  { cor: '#3b82f6', icon: Eye, titulo: 'YouTube sustenta o topo de funil',
    dado: '64,9 mil views a ~R$ 0,04/view (22% da verba) alimentando reconhecimento de marca barato.',
    acao: 'Manter como awareness e corrigir o tracking para medir a venda influenciada.' },
  { cor: '#ef4444', icon: Info, titulo: 'Conversões do Google sem medição',
    dado: 'Desde março o Google Ads registra 0 conversões — o acompanhamento está incompleto.',
    acao: 'Corrigir o acompanhamento de conversões no Google Ads para medir o retorno real do YouTube.' },
]

function MidiaCard({ icon: Icon, label, value, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay, duration: 0.35 }}
      className="bg-white rounded-2xl p-4 flex flex-col gap-1.5" style={{ boxShadow: shadow }}
    >
      <div className="flex items-center gap-1.5" style={{ color }}>
        <Icon size={14} strokeWidth={2.4} />
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{label}</span>
      </div>
      <p className="text-2xl font-black tabular-nums tracking-tight" style={{ color }}>{value}</p>
    </motion.div>
  )
}

export default function KamyResultados2026({ color = '#be29ec' }) {
  const [canal, setCanal] = useState('consolidado')
  const cor = CANAIS[canal].cor

  // Totais de negócio (sempre consolidado)
  const bio = useMemo(() => {
    const vendas   = MESES.reduce((s, m) => s + m.vendas, 0)
    const negocios = MESES.reduce((s, m) => s + m.negocios, 0)
    const invTotal = MESES.reduce((s, m) => s + m.meta.inv + m.yt.inv, 0)
    const leads    = MESES.reduce((s, m) => s + m.meta.leads, 0)
    return { vendas, negocios, invTotal, leads, roas: vendas / invTotal, ticket: vendas / negocios }
  }, [])

  // Totais de mídia do canal selecionado
  const mid = useMemo(() => {
    const rows = MESES.map(m => ({ ...midia(m, canal), m: m.m }))
    const inv = rows.reduce((s, r) => s + r.inv, 0)
    const alc = rows.reduce((s, r) => s + r.alc, 0)
    const imp = rows.reduce((s, r) => s + r.imp, 0)
    const alcMedia = Math.round(alc / MESES.length) // alcance médio mensal (mesmas pessoas se repetem)
    const impMedia = Math.round(imp / MESES.length) // impressões médias por mês
    const views = canal === 'meta' ? null : rows.reduce((s, r) => s + (r.views || 0), 0) // views = total do período (só YouTube/consolidado)
    return { rows, inv, alc, alcMedia, imp, impMedia, views }
  }, [canal])

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">

      {/* Hero — negócio consolidado */}
      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-6 lg:p-7 text-white"
        style={{ background: `linear-gradient(135deg, ${color}, #7a1bb0 55%, #2a1250)` }}
      >
        <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #fff6, transparent 70%)' }} />
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/70">Kamy · Materiais de Construção &amp; Tintas</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">Resultados 2026</h2>
            <p className="text-xs text-white/70 mt-1">Janeiro a julho · Meta Ads + YouTube + funil de vendas (GHL)</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/70">Vendas fechadas</p>
            <p className="text-3xl lg:text-4xl font-black tabular-nums">{K(bio.vendas)}</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          {[
            ['ROAS', `${bio.roas.toFixed(1)}×`],
            ['Investido', K(bio.invTotal)],
            ['Negócios', N(bio.negocios)],
            ['Ticket médio', K(bio.ticket)],
            ['Leads', N(bio.leads)],
          ].map(([l, v]) => (
            <div key={l} className="rounded-xl px-3 py-1.5 bg-white/12 backdrop-blur flex items-baseline gap-1.5">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-white/70">{l}</span>
              <span className="text-sm font-black tabular-nums">{v}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Vendas × Investimento por mês (negócio) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-2 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-text">Vendas fechadas × Investimento</h3>
            <p className="text-xs text-muted">Por mês · investimento total (Meta + YouTube) e ROAS à direita</p>
          </div>
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ color, background: color + '14' }}>+5× de jan a jun</span>
        </div>
        <div className="flex flex-col gap-3">
          {MESES.map((mo, i) => {
            const inv = mo.meta.inv + mo.yt.inv
            const roas = mo.vendas / inv
            return (
              <div key={mo.m} className="flex items-center gap-3">
                <span className="w-8 text-xs font-bold text-muted">{mo.m}</span>
                <div className="flex-1 h-9 rounded-lg relative overflow-hidden" style={{ background: '#eceef8' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${(mo.vendas / MAX_V) * 100}%` }}
                    transition={{ delay: 0.3 + i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-lg flex items-center justify-end pr-2.5 min-w-[92px]"
                    style={{ background: mo.pico ? 'linear-gradient(90deg,#ea8a29,#f5a94e)' : `linear-gradient(90deg,${color},${color}bb)` }}
                  >
                    <span className="text-[12px] font-black text-white tabular-nums whitespace-nowrap">{K(mo.vendas)}</span>
                  </motion.div>
                </div>
                <div className="w-24 text-right leading-tight">
                  <p className="text-[11px] font-bold text-text-2 tabular-nums">{K(inv)}</p>
                  <p className="text-[10px] font-black tabular-nums" style={{ color: '#ea8a29' }}>{roas.toFixed(1)}× ROAS</p>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Mídia por canal */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-text">Mídia por canal</h3>
            <p className="text-xs text-muted">Investimento, alcance e impressões (méd./mês) e vendas</p>
          </div>
          <div className="flex items-center bg-[#f3f4fb] rounded-xl p-0.5">
            {Object.entries(CANAIS).map(([k, c]) => (
              <button key={k} onClick={() => setCanal(k)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all"
                style={canal === k ? { backgroundColor: c.cor, color: '#fff' } : { color: '#7680a8' }}>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={canal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
            {/* KPIs do canal */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
              <MidiaCard icon={Wallet}     label="Investimento"     value={K(mid.inv)}      color={cor} delay={0.02} />
              {canal === 'youtube'
                ? <MidiaCard icon={Eye}   label="Views"            value={N(mid.views)}    color={cor} delay={0.06} />
                : <MidiaCard icon={Users} label="Alcance méd./mês" value={N(mid.alcMedia)} color={cor} delay={0.06} />}
              <MidiaCard icon={BarChart3}  label="Impressões méd./mês" value={N(mid.impMedia)} color={cor} delay={0.10} />
              <MidiaCard icon={DollarSign} label="Vendas (período)" value={K(bio.vendas)}   color="#6eda2c" delay={0.14} />
            </div>

            {/* Tabela mensal do canal */}
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid #e0e3f0' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: cor + '0c' }}>
                    <th className="text-left px-4 py-2.5 text-muted font-bold uppercase tracking-wider text-[10px]">Mês</th>
                    <th className="text-right px-4 py-2.5 text-muted font-bold uppercase tracking-wider text-[10px]">Investimento</th>
                    <th className="text-right px-4 py-2.5 text-muted font-bold uppercase tracking-wider text-[10px]">{canal === 'youtube' ? 'Views' : 'Alcance'}</th>
                    <th className="text-right px-4 py-2.5 text-muted font-bold uppercase tracking-wider text-[10px]">Impressões</th>
                    {canal === 'consolidado' && <th className="text-right px-4 py-2.5 text-muted font-bold uppercase tracking-wider text-[10px]">Vendas</th>}
                  </tr>
                </thead>
                <tbody>
                  {MESES.map((mo, i) => {
                    const d = midia(mo, canal)
                    return (
                      <tr key={mo.m} style={{ borderTop: i ? '1px solid #f0f2fb' : 'none' }}>
                        <td className="px-4 py-2.5 font-bold text-text">{mo.m}</td>
                        <td className="px-4 py-2.5 text-right font-semibold text-text-2 tabular-nums">{BRL(d.inv)}</td>
                        <td className="px-4 py-2.5 text-right text-muted tabular-nums">{canal === 'youtube' ? N(d.views) : N(d.alc)}</td>
                        <td className="px-4 py-2.5 text-right text-muted tabular-nums">{N(d.imp)}</td>
                        {canal === 'consolidado' && <td className="px-4 py-2.5 text-right font-black tabular-nums" style={{ color }}>{K(mo.vendas)}</td>}
                      </tr>
                    )
                  })}
                  <tr style={{ borderTop: '2px solid #e0e3f0', background: '#f6f7fc' }}>
                    <td className="px-4 py-2.5 font-black text-text">Total <span className="font-semibold text-muted lowercase">{canal === 'youtube' ? '· views = total · impr. = méd./mês' : '· alcance e impr. = méd./mês'}</span></td>
                    <td className="px-4 py-2.5 text-right font-black tabular-nums" style={{ color: cor }}>{BRL(mid.inv)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-text-2 tabular-nums">{canal === 'youtube' ? N(mid.views) : N(mid.alcMedia)}</td>
                    <td className="px-4 py-2.5 text-right font-bold text-text-2 tabular-nums">{N(mid.impMedia)}</td>
                    {canal === 'consolidado' && <td className="px-4 py-2.5 text-right font-black tabular-nums" style={{ color }}>{K(bio.vendas)}</td>}
                  </tr>
                </tbody>
              </table>
            </div>

            {canal === 'meta'    && <p className="text-[11px] text-muted mt-3"><b className="text-text-2">Alcance</b> = pessoas únicas alcançadas no Meta, exibido como <b>média mensal</b>. Leads (conversas WhatsApp) no período: <b className="text-text-2">{N(bio.leads)}</b>.</p>}
            {canal === 'youtube' && <p className="text-[11px] text-muted mt-3"><b className="text-text-2">Views</b> = visualizações do TrueView (métrica nativa do YouTube), total do período. Impressões como média mensal. CPV médio ~R$ 0,04 por view.</p>}
            {canal === 'consolidado' && <p className="text-[11px] text-muted mt-3"><b className="text-text-2">Alcance e impressões = média mensal</b> (no alcance, as mesmas pessoas se repetem entre os meses). <b className="text-text-2">Vendas</b> = total do período (só no consolidado, não atribuível a um canal isolado).</p>}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Insights & recomendações */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <h3 className="text-base font-extrabold text-text mb-1 flex items-center gap-2">
          <Lightbulb size={16} style={{ color }} /> Insights &amp; recomendações
        </h3>
        <p className="text-xs text-muted mb-4">Leitura dos números de jan–jul e próximos passos</p>
        <div className="grid md:grid-cols-2 gap-3">
          {INSIGHTS.map((it, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.42 + i * 0.05 }}
              className="rounded-2xl p-4 flex gap-3" style={{ background: it.cor + '0a', border: `1px solid ${it.cor}22` }}
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: it.cor + '1a', color: it.cor }}>
                <it.icon size={16} strokeWidth={2.4} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-text leading-snug">{it.titulo}</p>
                <p className="text-[11px] text-muted mt-1 leading-relaxed">{it.dado}</p>
                <p className="text-[11px] font-semibold mt-1.5" style={{ color: it.cor }}>→ {it.acao}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Nota */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        className="px-4 py-3 rounded-2xl flex items-start gap-2.5"
        style={{ background: '#ea8a290a', border: '1px solid #ea8a2925' }}
      >
        <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#ea8a29' }} />
        <p className="text-[11px] text-muted leading-relaxed">
          <b className="text-text-2">Método:</b> investimento por mês vindo dos relatórios do Meta Ads e Google Ads (YouTube);
alcance = pessoas únicas por plataforma (Meta: alcance · YouTube: "usuários exclusivos"), exibido como média mensal, pois as mesmas pessoas se repetem entre os meses.
          Vendas = oportunidades com status <b>ganho</b> no GHL. ROAS é direcional — nem todo negócio veio 100% da mídia paga.
        </p>
      </motion.div>

    </div>
  )
}
