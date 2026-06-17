import { useState } from 'react'
import { motion } from 'framer-motion'
import CacarolaTese       from './CacarolaTese'
import CacarolaEstrategia from './CacarolaEstrategia'
import CacarolaArrozPE    from './CacarolaArrozPE'

const OPCOES = [
  { id: 'tese',  label: 'Tese',                emoji: '📋', tag: null },
  { id: 'bolo',  label: 'Mistura pra Bolo',    emoji: '🍰', tag: 'SC' },
  { id: 'arroz', label: 'Arroz Edição Especial', emoji: '🍚', tag: 'PE' },
]

export default function CacarolaMidia({ color }) {
  const [aba, setAba] = useState('tese')

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

      {/* Sub-nav */}
      <div className="mb-6">
        <p className="text-[10px] font-extrabold text-muted uppercase tracking-widest mb-2 ml-1">
          Distribuição
        </p>
        <div className="flex gap-2 flex-wrap">
          {OPCOES.map(o => (
            <button key={o.id} onClick={() => setAba(o.id)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
              style={aba === o.id
                ? { background: color + '18', color, boxShadow: `0 0 0 1.5px ${color}40` }
                : { background: 'white', color: '#8890b5', boxShadow: '0 1px 4px rgba(26,29,46,0.08)' }
              }>
              <span>{o.emoji}</span>
              <span>{o.label}</span>
              {o.tag && (
                <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded-md"
                  style={{ background: aba === o.id ? color + '20' : '#f0f1f7', color: aba === o.id ? color : '#a0a8c8' }}>
                  {o.tag}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conteúdo */}
      <motion.div key={aba} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.18 }}>
        {aba === 'tese'  && <CacarolaTese       color={color} />}
        {aba === 'bolo'  && <CacarolaEstrategia color={color} />}
        {aba === 'arroz' && <CacarolaArrozPE    color={color} />}
      </motion.div>
    </div>
  )
}
