import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Trophy, TrendingUp, Globe, Info, Lightbulb, Target } from 'lucide-react'

const BRL = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 }).format(n)
const K   = n => 'R$ ' + new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n)
const N   = n => n == null ? '—' : new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 0 }).format(n)
const P   = n => n == null ? '—' : n.toFixed(1).replace('.', ',') + '%'

// Agosto veio sem leads (null = sem dado, nunca zero). As vendas de agosto
// foram derivadas de faturamento ÷ ticket médio, que fecha exato (15 e 9).
const MESES = [
  { m: 'Ago', meta: { leads: null, vendas: 15, fat: 13525.60 }, site: { leads: null, vendas: 9, fat: 7227.00 } },
  { m: 'Set', meta: { leads: 469,  vendas: 21, fat: 11897.65 }, site: { leads: 12,   vendas: 2, fat: 350.00 } },
  { m: 'Out', meta: { leads: 395,  vendas: 18, fat: 15341.00 }, site: { leads: 12,   vendas: 3, fat: 1735.00 } },
]

const CANAIS = {
  consolidado: { label: 'Consolidado', cor: '#ea8a29' },
  meta:        { label: 'Meta Ads',    cor: '#1877f2' },
  site:        { label: 'Site',        cor: '#16a34a' },
}

// Conversão informada pelo cliente: em agosto não há leads para recalcular.
const CONV_INFORMADA = { Ago: { meta: 3.1, site: 22.0 } }

const linha = (mo, canal) => {
  const somaLeads = (a, b) => (a == null || b == null) ? null : a + b
  const d = canal === 'meta' ? mo.meta
    : canal === 'site' ? mo.site
    : { leads: somaLeads(mo.meta.leads, mo.site.leads), vendas: mo.meta.vendas + mo.site.vendas, fat: mo.meta.fat + mo.site.fat }
  const conv = d.leads ? (d.vendas / d.leads) * 100 : (canal !== 'consolidado' ? CONV_INFORMADA[mo.m]?.[canal] ?? null : null)
  return { ...d, ticket: d.fat / d.vendas, conv }
}

const shadow = '0 2px 14px rgba(26,29,46,0.07), 0 0 0 1px rgba(26,29,46,0.05)'

const INSIGHTS = [
  { cor: '#ea8a29', icon: Trophy, titulo: 'Outubro foi o melhor mês do Meta Ads',
    dado: 'R$ 15,3 mil em faturamento, mesmo com menos leads que setembro (395 contra 469).',
    acao: 'Os leads de outubro foram mais qualificados. Vale entender o que mudou nos anúncios e manter.' },
  { cor: '#1877f2', icon: Target, titulo: 'Meta Ads é o motor das vendas',
    dado: '81% do faturamento de agosto a outubro (R$ 40,8 mil de R$ 50,1 mil).',
    acao: 'Manter o canal estável enquanto os outros crescem.' },
  { cor: '#6eda2c', icon: TrendingUp, titulo: 'Conversão do Meta Ads subindo todo mês',
    dado: '3,1% → 4,5% → 4,6%. Cada lead está virando venda com mais frequência.',
    acao: 'Seguir com o atendimento atual: é ele que transforma o lead em venda.' },
  { cor: '#16a34a', icon: Globe, titulo: 'O site converte muito, mas recebe pouca gente',
    dado: 'Converte de 17% a 25%, contra 3% a 5% do Meta Ads, com apenas 12 leads por mês.',
    acao: 'É a maior oportunidade: levar mais visitantes ao site.' },
]

function Pilula({ label, valor }) {
  return (
    <div className="rounded-xl px-3 py-1.5 bg-white/15 backdrop-blur flex items-baseline gap-1.5">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-white/75">{label}</span>
      <span className="text-sm font-black tabular-nums">{valor}</span>
    </div>
  )
}

export default function ArarasturResultados({ color = '#ea8a29' }) {
  const [canal, setCanal] = useState('consolidado')
  const cor = CANAIS[canal].cor

  const tot = useMemo(() => {
    const fatMeta = MESES.reduce((s, m) => s + m.meta.fat, 0)
    const fatSite = MESES.reduce((s, m) => s + m.site.fat, 0)
    const vendas  = MESES.reduce((s, m) => s + m.meta.vendas + m.site.vendas, 0)
    const fat     = fatMeta + fatSite
    return { fat, vendas, ticket: fat / vendas, partMeta: (fatMeta / fat) * 100 }
  }, [])

  const rows = useMemo(() => MESES.map(mo => ({ m: mo.m, ...linha(mo, canal) })), [canal])
  const maxFat = Math.max(...MESES.map(mo => mo.meta.fat + mo.site.fat))

  return (
    <div className="max-w-4xl mx-auto flex flex-col gap-5">

      <motion.div
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-3xl p-6 lg:p-7 text-white"
        style={{ background: `linear-gradient(135deg, ${color}, #c2410c 55%, #431407)` }}
      >
        <div className="relative flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-white/75">Ararastur</p>
            <h2 className="text-2xl lg:text-3xl font-black mt-1">Resultados</h2>
            <p className="text-xs text-white/75 mt-1">Agosto a outubro de 2026 · Meta Ads + Site</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-bold uppercase tracking-widest text-white/75">Faturamento</p>
            <p className="text-3xl lg:text-4xl font-black tabular-nums">{K(tot.fat)}</p>
          </div>
        </div>
        <div className="relative flex flex-wrap gap-2 mt-5">
          <Pilula label="Vendas" valor={N(tot.vendas)} />
          <Pilula label="Ticket médio" valor={K(tot.ticket)} />
          <Pilula label="Meta Ads no faturamento" valor={`${tot.partMeta.toFixed(0)}%`} />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <h3 className="text-base font-extrabold text-text">Faturamento por mês</h3>
        <p className="text-xs text-muted mb-5">Meta Ads e site somados</p>
        <div className="flex flex-col gap-3">
          {MESES.map((mo, i) => {
            const fat = mo.meta.fat + mo.site.fat
            return (
              <div key={mo.m} className="flex items-center gap-3">
                <span className="w-8 text-xs font-bold text-muted">{mo.m}</span>
                <div className="flex-1 h-9 rounded-lg relative overflow-hidden" style={{ background: '#f3efe9' }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${(fat / maxFat) * 100}%` }}
                    transition={{ delay: 0.25 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-lg flex items-center justify-end pr-2.5 min-w-[92px]"
                    style={{ background: `linear-gradient(90deg,${color},${color}bb)` }}
                  >
                    <span className="text-[12px] font-black text-white tabular-nums whitespace-nowrap">{K(fat)}</span>
                  </motion.div>
                </div>
                <span className="w-24 text-right text-[11px] font-bold text-text-2 tabular-nums">{mo.meta.vendas + mo.site.vendas} vendas</span>
              </div>
            )
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-text">Resultados por canal</h3>
            <p className="text-xs text-muted">Leads, vendas, faturamento, ticket e conversão</p>
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
            <div className="overflow-x-auto rounded-2xl" style={{ border: '1px solid #e0e3f0' }}>
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: cor + '0c' }}>
                    {['Mês', 'Leads', 'Vendas', 'Faturamento', 'Ticket médio', 'Conversão'].map((h, i) => (
                      <th key={h} className={`${i ? 'text-right' : 'text-left'} px-4 py-2.5 text-muted font-bold uppercase tracking-wider text-[10px]`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.m} style={{ borderTop: i ? '1px solid #f0f2fb' : 'none' }}>
                      <td className="px-4 py-2.5 font-bold text-text">{r.m}</td>
                      <td className="px-4 py-2.5 text-right text-muted tabular-nums">{N(r.leads)}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-text-2 tabular-nums">{N(r.vendas)}</td>
                      <td className="px-4 py-2.5 text-right font-black tabular-nums" style={{ color: cor }}>{BRL(r.fat)}</td>
                      <td className="px-4 py-2.5 text-right text-text-2 tabular-nums">{BRL(r.ticket)}</td>
                      <td className="px-4 py-2.5 text-right font-bold tabular-nums" style={{ color: cor }}>{P(r.conv)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        className="bg-white rounded-3xl p-5 lg:p-6" style={{ boxShadow: shadow }}
      >
        <h3 className="text-base font-extrabold text-text mb-1 flex items-center gap-2">
          <Lightbulb size={16} style={{ color }} /> Insights &amp; recomendações
        </h3>
        <p className="text-xs text-muted mb-4">Leitura dos números de agosto a outubro e próximos passos</p>
        <div className="grid md:grid-cols-2 gap-3">
          {INSIGHTS.map((it, i) => (
            <motion.div
              key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 + i * 0.05 }}
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

      <div className="px-4 py-3 rounded-2xl flex items-start gap-2.5" style={{ background: '#ea8a290a', border: '1px solid #ea8a2925' }}>
        <Info size={15} className="flex-shrink-0 mt-0.5" style={{ color: '#ea8a29' }} />
        <p className="text-[11px] text-muted leading-relaxed">
          <b className="text-text-2">Método:</b> conversão = vendas ÷ leads. Em agosto os leads não foram registrados: a conversão
          exibida é a informada no fechamento do mês, e o total de leads aparece como "—".
        </p>
      </div>
    </div>
  )
}
