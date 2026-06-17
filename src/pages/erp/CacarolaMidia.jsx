import { useState } from 'react'
import { motion } from 'framer-motion'
import CacarolaEstrategia from './CacarolaEstrategia'
import CacarolaArrozPE    from './CacarolaArrozPE'

const PRODUTOS = [
  { id: 'bolo',  label: 'Mistura pra Bolo', emoji: '🍰', estado: 'SC', budget: 'R$ 4.000' },
  { id: 'arroz', label: 'Dupla de Arroz',   emoji: '🍚', estado: 'PE', budget: 'R$ 1.000' },
]

export default function CacarolaMidia({ color }) {
  const [produto, setProduto] = useState('bolo')

  const ativo = PRODUTOS.find(p => p.id === produto)

  return (
    <div>
      {/* Header macro */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
            style={{ background: color + '18', border: `1.5px solid ${color}35` }}>🧠</div>
          <div>
            <h2 className="text-xl font-extrabold text-text">Estratégia de Mídia</h2>
            <p className="text-xs text-muted">Caçarola · Meta Ads</p>
          </div>
        </div>
      </div>

      {/* Sub-nav: Distribuição */}
      <div className="mb-6">
        <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-2 ml-1">
          Distribuição
        </p>
        <div className="flex gap-2">
          {PRODUTOS.map(p => (
            <button key={p.id} onClick={() => setProduto(p.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={produto === p.id
                ? { background: color + '18', color, boxShadow: `0 0 0 1.5px ${color}40` }
                : { background: 'white', color: '#8890b5', boxShadow: '0 1px 4px rgba(26,29,46,0.08)' }
              }>
              <span>{p.emoji}</span>
              <span>{p.label}</span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md"
                style={{ background: produto === p.id ? color + '20' : '#f0f1f7', color: produto === p.id ? color : '#a0a8c8' }}>
                {p.estado}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <motion.div key={produto} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {produto === 'bolo'  && <CacarolaEstrategia color={color} />}
        {produto === 'arroz' && <CacarolaArrozPE    color={color} />}
      </motion.div>
    </div>
  )
}
