import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import CacarolaEstrategia from './CacarolaEstrategia'
import CacarolaArroz from './CacarolaArroz'

const PRODUTOS = [
  { key: 'bolo',  emoji: '🍰', label: 'Mistura pra Bolo', tag: '97 cidades SC · R$4.000' },
  { key: 'arroz', emoji: '🍚', label: 'Arroz',            tag: '26 cidades BA · R$1.500' },
]

export default function CacarolaDistMidia({ color = '#f87171' }) {
  const [produto, setProduto] = useState('bolo')

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: color + '99' }}>
          Distribuição de Mídia · Caçarola
        </p>
        <div className="flex gap-2 flex-wrap">
          {PRODUTOS.map(p => (
            <motion.button key={p.key} whileHover={{ y: -1 }} onClick={() => setProduto(p.key)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl text-left transition-all"
              style={produto === p.key ? {
                background: 'linear-gradient(135deg, #1a0808 0%, #2d1010 100%)',
                border: `2px solid ${color}`,
                boxShadow: `0 4px 16px ${color}30`,
              } : {
                background: 'white',
                border: '2px solid #e2e5f0',
                boxShadow: '0 2px 8px rgba(26,29,46,0.06)',
              }}>
              <span className="text-xl">{p.emoji}</span>
              <div>
                <p className="text-xs font-extrabold" style={{ color: produto === p.key ? 'white' : '#1a1d2e' }}>
                  {p.label}
                </p>
                <p className="text-[10px]" style={{ color: produto === p.key ? color : '#8890b5' }}>
                  {p.tag}
                </p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={produto} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}>
          {produto === 'bolo'  && <CacarolaEstrategia color={color} />}
          {produto === 'arroz' && <CacarolaArroz      color={color} />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
