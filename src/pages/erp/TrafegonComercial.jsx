import { motion } from 'framer-motion'

const COR = '#60a5fa'

export default function TrafegonComercial({ color = COR }) {
  return (
    <div className="p-4 lg:p-8">
      <div className="max-w-xl rounded-3xl p-8 relative overflow-hidden text-center mx-auto"
        style={{ background: 'linear-gradient(135deg, #14122a 0%, #1e1250 100%)', boxShadow: '0 8px 32px rgba(10,10,30,0.3)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at 50% 0%, ${color}22 0%, transparent 60%)` }} />
        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="text-5xl mb-4">🤝</motion.div>
          <p className="text-[10px] font-extrabold uppercase tracking-widest mb-2" style={{ color: color + 'aa' }}>Em construção</p>
          <h2 className="text-2xl font-black text-white mb-3">Comercial</h2>
          <p className="text-sm text-white/50 max-w-sm mx-auto leading-relaxed">
            Pipeline de vendas, processo comercial, scripts e indicadores de fechamento.<br />Em breve.
          </p>
        </div>
      </div>
    </div>
  )
}
