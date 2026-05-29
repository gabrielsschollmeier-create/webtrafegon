import { motion } from 'framer-motion'

/* ── Moeda ONs — inspirada em moedas reais ────────────────────────
   Circular, metálica, com profundidade, brilho, sombra e relevo.

   Uso:
     <OnsToken />                     → ícone puro (18px)
     <OnsToken size="lg" />           → ícone grande (36px)
     <OnsDisplay value={1240} />      → moeda + valor + "ons"
     <OnsDisplay value={400} size="lg" showLabel={false} />
     <OnsGain value={100} />          → badge de ganho animado
*/

export function OnsToken({ size = 'sm', animate = true }) {
  const dim = { xs: 13, sm: 18, md: 26, lg: 38, xl: 56 }[size] || 18

  return (
    <motion.span
      style={{ display: 'inline-flex', flexShrink: 0, width: dim, height: dim }}
      animate={animate ? {
        filter: [
          'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 0 4px #6eda2c44)',
          'drop-shadow(0 2px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 10px #6eda2c88)',
          'drop-shadow(0 2px 4px rgba(0,0,0,0.5)) drop-shadow(0 0 4px #6eda2c44)',
        ]
      } : { filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg" width={dim} height={dim}>
        <defs>
          {/* Face metálica — exatamente #6eda2c como base com brilho real */}
          <radialGradient id="coin_face" cx="35%" cy="28%" r="72%">
            <stop offset="0%"   stopColor="#e8ffb0"/>
            <stop offset="18%"  stopColor="#b4f060"/>
            <stop offset="42%"  stopColor="#6eda2c"/>
            <stop offset="70%"  stopColor="#4db81e"/>
            <stop offset="100%" stopColor="#2a7008"/>
          </radialGradient>

          {/* Aro externo mais escuro para dar profundidade */}
          <radialGradient id="coin_edge" cx="25%" cy="18%" r="85%">
            <stop offset="0%"   stopColor="#8ae830"/>
            <stop offset="45%"  stopColor="#3a9010"/>
            <stop offset="100%" stopColor="#144804"/>
          </radialGradient>

          {/* Brilho especular principal — raio de luz real */}
          <linearGradient id="coin_shine" x1="5%" y1="5%" x2="55%" y2="65%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.75"/>
            <stop offset="30%"  stopColor="#ffffff" stopOpacity="0.30"/>
            <stop offset="70%"  stopColor="#ffffff" stopOpacity="0.05"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </linearGradient>

          {/* Brilho secundário no canto inferior direito */}
          <radialGradient id="coin_shine2" cx="75%" cy="75%" r="40%">
            <stop offset="0%"   stopColor="#6eda2c" stopOpacity="0.5"/>
            <stop offset="100%" stopColor="#6eda2c" stopOpacity="0"/>
          </radialGradient>

          {/* Sombra interna para volume */}
          <radialGradient id="coin_depth" cx="65%" cy="68%" r="60%">
            <stop offset="0%"   stopColor="#000000" stopOpacity="0.3"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>

          <filter id="relief_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.4" dy="0.8" stdDeviation="0.7" floodColor="#0a3002" floodOpacity="0.7"/>
          </filter>
          <filter id="coin_glow_filter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2" result="blur"/>
            <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>

        {/* Sombra no chão */}
        <ellipse cx="28" cy="53" rx="20" ry="3.5" fill="#000000" opacity="0.3"/>
        {/* Aro externo — espessura da moeda */}
        <circle cx="28" cy="27" r="24" fill="url(#coin_edge)"/>
        {/* Face */}
        <circle cx="28" cy="26" r="22" fill="url(#coin_face)"/>
        {/* Volume */}
        <circle cx="28" cy="26" r="22" fill="url(#coin_depth)"/>
        {/* Brilho reflexo lateral */}
        <circle cx="28" cy="26" r="22" fill="url(#coin_shine2)"/>
        {/* Anéis internos gravados */}
        <circle cx="28" cy="26" r="21.5" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.2"/>
        <circle cx="28" cy="26" r="19.5" fill="none" stroke="#a8f040" strokeWidth="0.8" opacity="0.3"/>
        <circle cx="28" cy="26" r="18.5" fill="none" stroke="#1a5008" strokeWidth="0.5" opacity="0.35"/>
        {/* Texto ON — sombra de relevo */}
        <text x="29" y="28" textAnchor="middle" dominantBaseline="central"
          fontSize="14" fontWeight="900" fill="#0a3002" opacity="0.55"
          fontFamily="'Inter','Arial Black',sans-serif" letterSpacing="-1">ON</text>
        {/* Texto ON — face */}
        <text x="28" y="27" textAnchor="middle" dominantBaseline="central"
          fontSize="14" fontWeight="900" fill="#e8ffc0"
          fontFamily="'Inter','Arial Black',sans-serif" letterSpacing="-1"
          filter="url(#relief_shadow)">ON</text>
        {/* Brilho especular principal — reflexo de luz */}
        <ellipse cx="18" cy="14" rx="10" ry="6.5" fill="url(#coin_shine)" transform="rotate(-30 18 14)"/>
        {/* Ponto de luz concentrado */}
        <ellipse cx="16" cy="12" rx="4.5" ry="2.8" fill="#ffffff" opacity="0.6" transform="rotate(-25 16 12)"/>
        {/* Arco de reflexo na borda */}
        <path d="M 8 16 A 22 22 0 0 1 28 4.5" stroke="#ffffff" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round"/>
        {/* Micro ponto de luz */}
        <circle cx="13" cy="10" r="2" fill="#ffffff" opacity="0.45"/>
      </svg>
    </motion.span>
  )
}

/* ── Display de valor com a moeda ─────────────────────────────── */
export function OnsDisplay({ value, size = 'sm', showLabel = true, className = '', color = '#6eda2c' }) {
  const textSize = { xs: 'text-[10px]', sm: 'text-xs', md: 'text-sm', lg: 'text-base', xl: 'text-2xl' }[size] || 'text-xs'
  const weight   = size === 'xl' || size === 'lg' ? 'font-black' : 'font-extrabold'
  const gap      = { xs: 'gap-0.5', sm: 'gap-1', md: 'gap-1.5', lg: 'gap-2', xl: 'gap-2' }[size] || 'gap-1'

  return (
    <span className={`inline-flex items-center ${gap} ${className}`}>
      <OnsToken size={size} />
      <span className={`${textSize} ${weight} tabular-nums leading-none`} style={{ color }}>
        {typeof value === 'number' ? value.toLocaleString('pt-BR') : value}
      </span>
      {showLabel && (
        <span className={`${textSize} font-semibold leading-none`} style={{ color, opacity: 0.65 }}>ons</span>
      )}
    </span>
  )
}

/* ── Badge de ganho animado (ex: missão concluída) ─────────────── */
export function OnsGain({ value, className = '' }) {
  return (
    <motion.div
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl ${className}`}
      style={{ background: 'linear-gradient(135deg, #6eda2c18, #6eda2c08)', border: '1px solid #6eda2c35' }}
      initial={{ scale: 0.75, opacity: 0, y: 4 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 22 }}
    >
      <OnsToken size="sm" />
      <span className="text-xs font-extrabold" style={{ color: '#6eda2c' }}>
        +{typeof value === 'number' ? value.toLocaleString('pt-BR') : value} ons
      </span>
    </motion.div>
  )
}
