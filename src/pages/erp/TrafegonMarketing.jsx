import { useState } from 'react'
import { motion } from 'framer-motion'
import TrafegonEstrategia from './TrafegonEstrategia'
import TrafegonResultados from './TrafegonResultados'
import TrafegonComunicacao from './TrafegonComunicacao'
import DestravaDigital from '../DestravaDigital'

const COR = '#6eda2c'

const PRODUTOS = [
  { key: 'destrava',   icon: '🔓', label: 'Destrava Digital', desc: 'Estruturação e aceleração de conta',     color: '#f59e0b' },
  { key: 'assessoria', icon: '🔄', label: 'Assessoria',       desc: 'Gestão recorrente de tráfego e social', color: '#6eda2c' },
  { key: 'sites',      icon: '🌐', label: 'Sites',            desc: 'Criação de sites e landing pages',      color: '#60a5fa' },
]

function ProdutosHubView() {
  const [produto, setProduto] = useState(null)

  if (produto === 'destrava') {
    return (
      <div>
        <button onClick={() => setProduto(null)}
          className="flex items-center gap-2 text-xs font-bold text-muted hover:text-text mb-4 mt-2 transition-colors">
          ← Voltar para Produtos
        </button>
        <DestravaDigital autoFormat="estruturacao" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-10 max-w-3xl mx-auto">
      <p className="text-xs font-semibold text-muted uppercase tracking-widest mb-1">Hub</p>
      <h2 className="text-2xl font-extrabold text-text mb-1">Produtos</h2>
      <p className="text-sm text-muted mb-8">Selecione o produto para acessar seu conteúdo</p>
      <div className="flex flex-col gap-4">
        {PRODUTOS.map(p => (
          <motion.button
            key={p.key}
            onClick={() => p.key === 'destrava' ? setProduto('destrava') : null}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-5 p-5 rounded-2xl text-left transition-all group"
            style={{
              background: `${p.color}0a`,
              border: `1.5px solid ${p.color}25`,
              cursor: p.key === 'destrava' ? 'pointer' : 'default',
              opacity: p.key !== 'destrava' ? 0.6 : 1,
            }}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 text-2xl transition-all group-hover:scale-105"
              style={{ background: `${p.color}18`, border: `1.5px solid ${p.color}35` }}>
              {p.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-extrabold text-text mb-0.5">{p.label}</p>
              <p className="text-sm text-muted">{p.desc}</p>
            </div>
            {p.key === 'destrava' ? (
              <span className="text-xs font-bold px-3 py-1 rounded-full flex-shrink-0"
                style={{ background: `${p.color}20`, color: p.color }}>
                Acessar →
              </span>
            ) : (
              <span className="text-xs font-semibold text-muted flex-shrink-0">Em breve</span>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default function TrafegonMarketing({ color = COR }) {
  const [subTab, setSubTab] = useState('estrategia')

  const tabs = [
    { key: 'estrategia',  label: '🧠 Estratégia',  sub: 'ICP · Canais · Mídia' },
    { key: 'resultados',  label: '🏆 Resultados',  sub: 'Performance' },
    { key: 'produtos',    label: '📦 Produtos',    sub: 'Destrava · Assessoria' },
    { key: 'comunicacao', label: '📱 Comunicação', sub: '30 dias · Social' },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 lg:px-8 pt-4 lg:pt-8 pb-4">
        <div>
          <h2 className="text-lg font-extrabold text-text flex items-center gap-2">
            📊 Marketing
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: color + '15', color }}>TráfegOn</span>
          </h2>
          <p className="text-xs text-muted mt-0.5">Estratégia · Resultados · Produtos · Comunicação</p>
        </div>
        <div className="flex items-center gap-1 rounded-2xl p-1 bg-white"
          style={{ boxShadow: '0 2px 8px rgba(26,29,46,0.09)', border: '1px solid rgba(26,29,46,0.06)' }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setSubTab(t.key)}
              className="flex flex-col items-start px-3 py-2 rounded-xl text-left transition-all"
              style={subTab === t.key ? { background: color + '18', color } : { color: '#8890b5' }}>
              <span className="text-xs font-extrabold">{t.label}</span>
              <span className="text-[10px] opacity-60 hidden sm:block">{t.sub}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 lg:px-8 pb-8">
        <motion.div key={subTab} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
          {subTab === 'estrategia'  && <TrafegonEstrategia color={color} />}
          {subTab === 'resultados'  && <TrafegonResultados color={color} />}
          {subTab === 'produtos'    && <ProdutosHubView />}
          {subTab === 'comunicacao' && <TrafegonComunicacao color={color} />}
        </motion.div>
      </div>
    </div>
  )
}
