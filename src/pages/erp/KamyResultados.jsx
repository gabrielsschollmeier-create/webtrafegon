import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, TrendingDown } from 'lucide-react'

const R2 = n => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n)

const MESES = [
  {
    key: 'abril',
    label: 'Abril',
    periodo: 'Abr/2026',
    investimento: 1426.91,
    custoLead:    13.46,
    conversao:    null,
    faturamento:  70418.92,
    roas:         49.35,
  },
  {
    key: 'maio',
    label: 'Maio',
    periodo: 'Mai/2026',
    investimento: 1509.64,
    custoLead:    16.23,
    conversao:    67.59,
    faturamento:  72354.00,
    roas:         47.92,
  },
]

function KPI({ label, value, sub, color, delay = 0, trend = null }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl overflow-hidden"
      style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.05)' }}
    >
      <div className="h-1" style={{ background: `linear-gradient(90deg, ${color}, ${color}60)` }} />
      <div className="p-4">
        <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{label}</p>
        <p className="text-xl font-black" style={{ color }}>{value}</p>
        {sub && <p className="text-[11px] text-muted mt-0.5">{sub}</p>}
        {trend !== null && (
          <div className="flex items-center gap-1 mt-1">
            {trend >= 0
              ? <TrendingUp size={11} className="text-green-500" />
              : <TrendingDown size={11} className="text-red-400" />}
            <span className="text-[10px] font-bold" style={{ color: trend >= 0 ? '#6eda2c' : '#ef4444' }}>
              {trend >= 0 ? '+' : ''}{trend.toFixed(2)}% vs mês anterior
            </span>
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default function KamyResultados({ color = '#be29ec' }) {
  const [mes, setMes] = useState('maio')
  const data  = MESES.find(m => m.key === mes)
  const prev  = MESES.find(m => m.key !== mes)

  const trendFat  = ((data.faturamento  - prev.faturamento)  / prev.faturamento)  * 100
  const trendInv  = ((data.investimento - prev.investimento) / prev.investimento) * 100
  const trendCpl  = ((data.custoLead    - prev.custoLead)    / prev.custoLead)    * 100
  const trendRoas = ((data.roas         - prev.roas)         / prev.roas)         * 100

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            🏆 Resultados das Campanhas
          </h2>
          <p className="text-xs text-muted mt-0.5">Kamy Materiais de Construção · Meta Ads</p>
        </div>

        {/* Seletor de mês */}
        <div className="flex items-center bg-white border border-border rounded-xl p-0.5"
          style={{ boxShadow: '0 1px 4px rgba(26,29,46,0.06)' }}>
          {MESES.map(m => (
            <button key={m.key} onClick={() => setMes(m.key)}
              className="px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
              style={mes === m.key
                ? { backgroundColor: color, color: '#fff' }
                : { color: '#8890b5' }}>
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI cards */}
      <AnimatePresence mode="wait">
        <motion.div key={mes}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <KPI
              label="Investimento"
              value={R2(data.investimento)}
              sub="em anúncios Meta Ads"
              color="#60a5fa"
              delay={0.05}
              trend={trendInv}
            />
            <KPI
              label="Custo por Lead"
              value={R2(data.custoLead)}
              sub="por lead gerado"
              color={color}
              delay={0.10}
              trend={trendCpl * -1}
            />
            <KPI
              label="Faturamento"
              value={R2(data.faturamento)}
              sub="receita gerada no mês"
              color="#6eda2c"
              delay={0.15}
              trend={trendFat}
            />
            <KPI
              label="ROAS"
              value={`${data.roas.toFixed(2)}x`}
              sub={`R$1 investido → R$${data.roas.toFixed(0)} retornado`}
              color="#f59e0b"
              delay={0.20}
              trend={trendRoas}
            />
          </div>

          {/* Taxa de conversão — só em meses que têm o dado */}
          {data.conversao !== null && (
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-6 rounded-2xl p-4 flex items-center gap-4"
              style={{ background: `${color}10`, border: `1px solid ${color}30` }}
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ backgroundColor: color + '20' }}>
                🎯
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-muted uppercase tracking-wider">Taxa de Conversão</p>
                <p className="text-2xl font-black" style={{ color }}>{data.conversao.toFixed(2)}%</p>
                <p className="text-[11px] text-muted">dos leads gerados foram convertidos em vendas</p>
              </div>
            </motion.div>
          )}

          {/* Comparativo */}
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl overflow-hidden"
            style={{ boxShadow: '0 2px 12px rgba(26,29,46,0.08), 0 0 0 1px rgba(26,29,46,0.05)' }}
          >
            <div className="px-5 py-3 border-b border-border flex items-center gap-2"
              style={{ background: `${color}08` }}>
              <p className="text-xs font-extrabold text-text">Comparativo Abril × Maio</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ borderBottom: '1px solid #e0e3f0' }}>
                    <th className="text-left px-5 py-3 text-muted font-bold uppercase tracking-wider text-[10px]">Métrica</th>
                    {MESES.map(m => (
                      <th key={m.key} className="text-right px-5 py-3 font-extrabold text-[11px]"
                        style={{ color: m.key === mes ? color : '#8890b5' }}>
                        {m.label} {m.key === mes ? '●' : ''}
                      </th>
                    ))}
                    <th className="text-right px-5 py-3 text-muted font-bold uppercase tracking-wider text-[10px]">Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      label: 'Investimento',
                      abril: R2(MESES[0].investimento),
                      maio:  R2(MESES[1].investimento),
                      delta: ((MESES[1].investimento - MESES[0].investimento) / MESES[0].investimento * 100),
                      up: false,
                    },
                    {
                      label: 'Custo por Lead',
                      abril: R2(MESES[0].custoLead),
                      maio:  R2(MESES[1].custoLead),
                      delta: ((MESES[1].custoLead - MESES[0].custoLead) / MESES[0].custoLead * 100),
                      up: false,
                    },
                    {
                      label: 'Faturamento',
                      abril: R2(MESES[0].faturamento),
                      maio:  R2(MESES[1].faturamento),
                      delta: ((MESES[1].faturamento - MESES[0].faturamento) / MESES[0].faturamento * 100),
                      up: true,
                    },
                    {
                      label: 'ROAS',
                      abril: `${MESES[0].roas.toFixed(2)}x`,
                      maio:  `${MESES[1].roas.toFixed(2)}x`,
                      delta: ((MESES[1].roas - MESES[0].roas) / MESES[0].roas * 100),
                      up: true,
                    },
                  ].map((row, i) => {
                    const isGood = row.up ? row.delta >= 0 : row.delta <= 0
                    return (
                      <tr key={row.label} style={{ borderBottom: i < 3 ? '1px solid #f0f2fb' : 'none' }}>
                        <td className="px-5 py-3 font-semibold text-text">{row.label}</td>
                        <td className="px-5 py-3 text-right text-muted">{row.abril}</td>
                        <td className="px-5 py-3 text-right font-bold" style={{ color }}>{row.maio}</td>
                        <td className="px-5 py-3 text-right">
                          <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded-full"
                            style={{
                              color: isGood ? '#6eda2c' : '#ef4444',
                              backgroundColor: isGood ? '#6eda2c18' : '#ef444418',
                            }}>
                            {row.delta >= 0 ? '+' : ''}{row.delta.toFixed(1)}%
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Nota ROAS */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="mt-4 px-4 py-3 rounded-xl flex items-start gap-2"
            style={{ background: '#f59e0b0a', border: '1px solid #f59e0b25' }}
          >
            <span className="text-sm flex-shrink-0 mt-0.5">💡</span>
            <p className="text-[11px] text-muted leading-relaxed">
              <strong className="text-text-2">ROAS</strong> indica o retorno sobre o investimento em anúncios.
              No mês de {data.label === 'Maio' ? 'Maio' : 'Abril'}, a cada{' '}
              <strong className="text-text-2">R$1 investido</strong> em anúncios,
              retornamos <strong style={{ color: '#f59e0b' }}>R${data.roas.toFixed(0)} em faturamento</strong>. 🚀
            </p>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
