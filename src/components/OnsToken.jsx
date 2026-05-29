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
          {/* Gradiente metálico principal — dourado-verde */}
          <radialGradient id="coin_face" cx="38%" cy="32%" r="70%">
            <stop offset="0%"   stopColor="#c8f080"/>
            <stop offset="25%"  stopColor="#8ee840"/>
            <stop offset="55%"  stopColor="#5aba18"/>
            <stop offset="80%"  stopColor="#3d8c0a"/>
            <stop offset="100%" stopColor="#285e06"/>
          </radialGradient>

          {/* Borda/bevel */}
          <radialGradient id="coin_edge" cx="30%" cy="20%" r="80%">
            <stop offset="0%"   stopColor="#a0d840"/>
            <stop offset="50%"  stopColor="#4a9a14"/>
            <stop offset="100%" stopColor="#1c4a04"/>
          </radialGradient>

          {/* Brilho topo */}
          <linearGradient id="coin_shine" x1="0%" y1="0%" x2="60%" y2="100%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.55"/>
            <stop offset="40%"  stopColor="#ffffff" stopOpacity="0.15"/>
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0"/>
          </linearGradient>

          {/* Sombra interna */}
          <radialGradient id="coin_inner_shadow" cx="60%" cy="70%" r="65%">
            <stop offset="0%"   stopColor="#000000" stopOpacity="0.25"/>
            <stop offset="100%" stopColor="#000000" stopOpacity="0"/>
          </radialGradient>

          {/* Relevo central */}
          <radialGradient id="coin_relief" cx="35%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#d4ff90"/>
            <stop offset="60%"  stopColor="#6eda2c"/>
            <stop offset="100%" stopColor="#2a6008"/>
          </radialGradient>

          <filter id="relief_shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0.5" dy="1" stdDeviation="0.8" floodColor="#1a4004" floodOpacity="0.6"/>
          </filter>
        </defs>

        {/* Sombra da moeda no chão */}
        <ellipse cx="28" cy="52" rx="18" ry="3" fill="#000000" opacity="0.25"/>

        {/* Borda espessa da moeda (aro) */}
        <circle cx="28" cy="27" r="24" fill="url(#coin_edge)"/>

        {/* Face principal da moeda */}
        <circle cx="28" cy="26" r="22" fill="url(#coin_face)"/>

        {/* Sombra interna para dar curvatura */}
        <circle cx="28" cy="26" r="22" fill="url(#coin_inner_shadow)"/>

        {/* Anel de relevo — bordinha interna */}
        <circle cx="28" cy="26" r="22" fill="none" stroke="#a0e030" strokeWidth="1.2" opacity="0.4"/>
        <circle cx="28" cy="26" r="20" fill="none" stroke="#ffffff" strokeWidth="0.4" opacity="0.2"/>
        <circle cx="28" cy="26" r="19.2" fill="none" stroke="#2a6008" strokeWidth="0.5" opacity="0.3"/>

        {/* Círculo de relevo central */}
        <circle cx="28" cy="26" r="14" fill="url(#coin_relief)" opacity="0.25"/>
        <circle cx="28" cy="26" r="14" fill="none" stroke="#70c020" strokeWidth="0.6" opacity="0.5"/>

        {/* Letra "O" estilizada — relevo */}
        <text
          x="28" y="23"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="900"
          fill="#1a4804"
          fontFamily="'Inter','Arial Black',sans-serif"
          letterSpacing="-1"
          filter="url(#relief_shadow)"
          opacity="0.9"
        >ON</text>

        {/* Texto "ON" com highlight — camada de brilho */}
        <text
          x="27.5" y="22.5"
          textAnchor="middle"
          dominantBaseline="central"
          fontSize="13"
          fontWeight="900"
          fill="#c8ff60"
          fontFamily="'Inter','Arial Black',sans-serif"
          letterSpacing="-1"
          opacity="0.35"
        >ON</text>

        {/* Brilho especular topo-esquerdo */}
        <ellipse cx="20" cy="16" rx="9" ry="6" fill="url(#coin_shine)" transform="rotate(-25 20 16)"/>

        {/* Ponto de luz principal */}
        <ellipse cx="18" cy="14" rx="5" ry="3" fill="#ffffff" opacity="0.3" transform="rotate(-20 18 14)"/>

        {/* Reflexo na borda */}
        <path d="M 10 14 A 22 22 0 0 1 28 4" stroke="#ffffff" strokeWidth="1.5" fill="none" opacity="0.2" strokeLinecap="round"/>
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
