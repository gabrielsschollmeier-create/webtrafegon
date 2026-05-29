// Avatares gamificados — estilo tech/sci-fi, um por colaborador

const GabrielSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_gs" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#1a2e10"/>
        <stop offset="100%" stopColor="#060e04"/>
      </radialGradient>
      <filter id="glow_gs"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_gs)"/>
    {/* Grid tech */}
    {[20,35,50,65,80].map(x => <line key={x} x1={x} y1="0" x2={x} y2="100" stroke="#6eda2c" strokeWidth="0.3" opacity="0.15"/>)}
    {[20,35,50,65,80].map(y => <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#6eda2c" strokeWidth="0.3" opacity="0.15"/>)}
    {/* Hexágono externo */}
    <polygon points="50,8 82,26 82,62 50,80 18,62 18,26" fill="none" stroke="#6eda2c" strokeWidth="1.2" opacity="0.5"/>
    {/* Hexágono interno */}
    <polygon points="50,18 72,30 72,54 50,66 28,54 28,30" fill="#6eda2c" opacity="0.07"/>
    {/* Rosto geométrico */}
    <ellipse cx="50" cy="44" rx="16" ry="18" fill="#111" stroke="#6eda2c" strokeWidth="1" opacity="0.9"/>
    {/* Visor / olhos */}
    <rect x="34" y="38" width="32" height="9" rx="4" fill="#6eda2c" opacity="0.15"/>
    <rect x="34" y="38" width="32" height="9" rx="4" fill="none" stroke="#6eda2c" strokeWidth="0.8"/>
    <rect x="37" y="40" width="11" height="5" rx="2.5" fill="#6eda2c" opacity="0.9" filter="url(#glow_gs)"/>
    <rect x="52" y="40" width="11" height="5" rx="2.5" fill="#6eda2c" opacity="0.9" filter="url(#glow_gs)"/>
    {/* Scanline */}
    <line x1="34" y1="42.5" x2="66" y2="42.5" stroke="#6eda2c" strokeWidth="0.5" opacity="0.4"/>
    {/* Boca — traço */}
    <rect x="42" y="52" width="16" height="2.5" rx="1.2" fill="#6eda2c" opacity="0.6"/>
    {/* Antena */}
    <line x1="50" y1="26" x2="50" y2="18" stroke="#6eda2c" strokeWidth="1" opacity="0.7"/>
    <circle cx="50" cy="17" r="2" fill="#6eda2c" filter="url(#glow_gs)"/>
    {/* Badge role */}
    <circle cx="78" cy="22" r="9" fill="#0a1a06" stroke="#6eda2c" strokeWidth="1"/>
    <text x="78" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#6eda2c" fontFamily="monospace">GS</text>
    {/* Barra de status */}
    <rect x="18" y="84" width="64" height="4" rx="2" fill="#111"/>
    <rect x="18" y="84" width="48" height="4" rx="2" fill="#6eda2c" opacity="0.7"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#6eda2c" opacity="0.7" fontFamily="monospace">TRÁFEGO · LV.1</text>
  </svg>
)

const CarolSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_ca" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#1e0a2e"/>
        <stop offset="100%" stopColor="#080410"/>
      </radialGradient>
      <filter id="glow_ca"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_ca)"/>
    {/* Círculos concêntricos tech */}
    <circle cx="50" cy="50" r="40" fill="none" stroke="#be29ec" strokeWidth="0.4" opacity="0.2"/>
    <circle cx="50" cy="50" r="30" fill="none" stroke="#be29ec" strokeWidth="0.4" opacity="0.2"/>
    <circle cx="50" cy="50" r="20" fill="none" stroke="#be29ec" strokeWidth="0.4" opacity="0.3"/>
    {/* Losango frame */}
    <polygon points="50,10 82,50 50,90 18,50" fill="none" stroke="#be29ec" strokeWidth="1" opacity="0.5"/>
    {/* Rosto — diamante */}
    <ellipse cx="50" cy="46" rx="15" ry="17" fill="#110820" stroke="#be29ec" strokeWidth="1"/>
    {/* Olhos — diamantes */}
    <polygon points="40,43 43,40 46,43 43,46" fill="#be29ec" opacity="0.9" filter="url(#glow_ca)"/>
    <polygon points="54,43 57,40 60,43 57,46" fill="#be29ec" opacity="0.9" filter="url(#glow_ca)"/>
    {/* Nariz — linha */}
    <line x1="50" y1="46" x2="50" y2="52" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    {/* Boca curva */}
    <path d="M44 55 Q50 59 56 55" stroke="#be29ec" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.8"/>
    {/* Ornamentos laterais */}
    <line x1="10" y1="38" x2="24" y2="44" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    <line x1="10" y1="62" x2="24" y2="56" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    <line x1="90" y1="38" x2="76" y2="44" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    <line x1="90" y1="62" x2="76" y2="56" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    {/* Badge */}
    <circle cx="78" cy="22" r="9" fill="#0d0420" stroke="#be29ec" strokeWidth="1"/>
    <text x="78" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#be29ec" fontFamily="monospace">CA</text>
    {/* Status */}
    <rect x="18" y="84" width="64" height="4" rx="2" fill="#111"/>
    <rect x="18" y="84" width="32" height="4" rx="2" fill="#be29ec" opacity="0.7"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#be29ec" opacity="0.7" fontFamily="monospace">ADMIN · LV.1</text>
  </svg>
)

const TochiroSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_to" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#041e2e"/>
        <stop offset="100%" stopColor="#010810"/>
      </radialGradient>
      <filter id="glow_to"><feGaussianBlur stdDeviation="2.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_to)"/>
    {/* Linhas diagonais tech */}
    {[-30,-15,0,15,30,45,60].map((offset,i) => (
      <line key={i} x1={offset} y1="0" x2={offset+70} y2="100" stroke="#22d3ee" strokeWidth="0.4" opacity="0.12"/>
    ))}
    {/* Octógono */}
    <polygon points="50,8 72,15 88,35 88,65 72,85 50,92 28,85 12,65 12,35 28,15" fill="none" stroke="#22d3ee" strokeWidth="1" opacity="0.4"/>
    {/* Rosto — escudo/visor */}
    <ellipse cx="50" cy="46" rx="16" ry="18" fill="#030f18" stroke="#22d3ee" strokeWidth="1"/>
    {/* Visor único — estilo capacete */}
    <path d="M34 43 Q50 36 66 43 L66 50 Q50 57 34 50 Z" fill="#22d3ee" opacity="0.1"/>
    <path d="M34 43 Q50 36 66 43 L66 50 Q50 57 34 50 Z" fill="none" stroke="#22d3ee" strokeWidth="0.8"/>
    {/* Olhos internos */}
    <ellipse cx="42" cy="46" rx="5" ry="3.5" fill="#22d3ee" opacity="0.8" filter="url(#glow_to)"/>
    <ellipse cx="58" cy="46" rx="5" ry="3.5" fill="#22d3ee" opacity="0.8" filter="url(#glow_to)"/>
    <ellipse cx="42" cy="46" rx="2.5" ry="1.8" fill="#fff" opacity="0.9"/>
    <ellipse cx="58" cy="46" rx="2.5" ry="1.8" fill="#fff" opacity="0.9"/>
    {/* Boca — grade */}
    {[0,3,6].map(i => <line key={i} x1={43+i*4} y1="53" x2={43+i*4} y2="57" stroke="#22d3ee" strokeWidth="1" strokeLinecap="round" opacity="0.6"/>)}
    {/* Conectores laterais */}
    <circle cx="20" cy="46" r="3" fill="#22d3ee" opacity="0.4" filter="url(#glow_to)"/>
    <line x1="23" y1="46" x2="34" y2="46" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4"/>
    <circle cx="80" cy="46" r="3" fill="#22d3ee" opacity="0.4" filter="url(#glow_to)"/>
    <line x1="77" y1="46" x2="66" y2="46" stroke="#22d3ee" strokeWidth="0.8" opacity="0.4"/>
    {/* Badge */}
    <circle cx="78" cy="22" r="9" fill="#010c14" stroke="#22d3ee" strokeWidth="1"/>
    <text x="78" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">TO</text>
    {/* Status */}
    <rect x="18" y="84" width="64" height="4" rx="2" fill="#111"/>
    <rect x="18" y="84" width="40" height="4" rx="2" fill="#22d3ee" opacity="0.7"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#22d3ee" opacity="0.7" fontFamily="monospace">TRÁFEGO · LV.1</text>
  </svg>
)

const AnaSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_an" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#2e0a1e"/>
        <stop offset="100%" stopColor="#100408"/>
      </radialGradient>
      <filter id="glow_an"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_an)"/>
    {/* Pontos flutuantes */}
    {[[15,20],[30,15],[70,18],[82,25],[85,70],[72,85],[28,82],[12,68]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r="1.5" fill="#ec4899" opacity="0.5"/>
    ))}
    {/* Estrela — frame */}
    <polygon points="50,8 58,36 88,36 65,54 73,82 50,66 27,82 35,54 12,36 42,36" fill="none" stroke="#ec4899" strokeWidth="0.8" opacity="0.35"/>
    {/* Rosto oval */}
    <ellipse cx="50" cy="46" rx="15" ry="17" fill="#180810" stroke="#ec4899" strokeWidth="1"/>
    {/* Olhos — estrela */}
    <polygon points="40,42 41.5,38 43,42 47,43 43,44.5 41.5,48.5 40,44.5 36,43" fill="#ec4899" opacity="0.9" filter="url(#glow_an)"/>
    <polygon points="57,42 58.5,38 60,42 64,43 60,44.5 58.5,48.5 57,44.5 53,43" fill="#ec4899" opacity="0.9" filter="url(#glow_an)"/>
    {/* Boca — sorriso */}
    <path d="M42 55 Q50 61 58 55" stroke="#ec4899" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9"/>
    <path d="M44 55 Q50 59 56 55" fill="#ec4899" opacity="0.2"/>
    {/* Ornamento topo */}
    <path d="M38 28 Q50 22 62 28" stroke="#ec4899" strokeWidth="1" fill="none" opacity="0.5"/>
    <circle cx="50" cy="22" r="2.5" fill="#ec4899" filter="url(#glow_an)"/>
    {/* Badge */}
    <circle cx="78" cy="22" r="9" fill="#140408" stroke="#ec4899" strokeWidth="1"/>
    <text x="78" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#ec4899" fontFamily="monospace">AN</text>
    {/* Status */}
    <rect x="18" y="84" width="64" height="4" rx="2" fill="#111"/>
    <rect x="18" y="84" width="36" height="4" rx="2" fill="#ec4899" opacity="0.7"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#ec4899" opacity="0.7" fontFamily="monospace">SOCIAL · LV.1</text>
  </svg>
)

const AdmSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_ad" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#2e1a04"/>
        <stop offset="100%" stopColor="#100804"/>
      </radialGradient>
      <filter id="glow_ad"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_ad)"/>
    {/* Engrenagem fundo */}
    <circle cx="50" cy="50" r="38" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2" strokeDasharray="4 3"/>
    <circle cx="50" cy="50" r="28" fill="none" stroke="#f59e0b" strokeWidth="0.5" opacity="0.2"/>
    {/* Escudo — frame */}
    <path d="M50,10 L78,22 L78,52 Q78,74 50,88 Q22,74 22,52 L22,22 Z" fill="none" stroke="#f59e0b" strokeWidth="1" opacity="0.5"/>
    <path d="M50,18 L70,27 L70,52 Q70,68 50,78 Q30,68 30,52 L30,27 Z" fill="#f59e0b" opacity="0.05"/>
    {/* Rosto */}
    <ellipse cx="50" cy="47" rx="15" ry="17" fill="#180e02" stroke="#f59e0b" strokeWidth="1"/>
    {/* Olhos — quadrado/sólido */}
    <rect x="36" y="40" width="10" height="8" rx="2" fill="#f59e0b" opacity="0.9" filter="url(#glow_ad)"/>
    <rect x="54" y="40" width="10" height="8" rx="2" fill="#f59e0b" opacity="0.9" filter="url(#glow_ad)"/>
    <rect x="38" y="42" width="6" height="4" rx="1" fill="#2e1a04"/>
    <rect x="56" y="42" width="6" height="4" rx="1" fill="#2e1a04"/>
    {/* Boca — linha reta */}
    <rect x="41" y="54" width="18" height="2.5" rx="1.2" fill="#f59e0b" opacity="0.7"/>
    {/* Parafusos laterais */}
    <circle cx="26" cy="40" r="3" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5"/>
    <line x1="24" y1="40" x2="28" y2="40" stroke="#f59e0b" strokeWidth="0.6" opacity="0.5"/>
    <line x1="26" y1="38" x2="26" y2="42" stroke="#f59e0b" strokeWidth="0.6" opacity="0.5"/>
    <circle cx="74" cy="40" r="3" fill="none" stroke="#f59e0b" strokeWidth="0.8" opacity="0.5"/>
    <line x1="72" y1="40" x2="76" y2="40" stroke="#f59e0b" strokeWidth="0.6" opacity="0.5"/>
    <line x1="74" y1="38" x2="74" y2="42" stroke="#f59e0b" strokeWidth="0.6" opacity="0.5"/>
    {/* Badge */}
    <circle cx="78" cy="22" r="9" fill="#100802" stroke="#f59e0b" strokeWidth="1"/>
    <text x="78" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">AD</text>
    {/* Status */}
    <rect x="18" y="84" width="64" height="4" rx="2" fill="#111"/>
    <rect x="18" y="84" width="28" height="4" rx="2" fill="#f59e0b" opacity="0.7"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#f59e0b" opacity="0.7" fontFamily="monospace">SUPORTE · LV.1</text>
  </svg>
)

const JulianoSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_ju" cx="50%" cy="50%" r="70%">
        <stop offset="0%" stopColor="#14102e"/>
        <stop offset="100%" stopColor="#060410"/>
      </radialGradient>
      <filter id="glow_ju"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_ju)"/>
    {/* Grade hexagonal */}
    <circle cx="50" cy="50" r="42" fill="none" stroke="#a78bfa" strokeWidth="0.4" opacity="0.15"/>
    {/* Raios */}
    {[0,30,60,90,120,150].map((angle, i) => {
      const rad = (angle * Math.PI) / 180
      return <line key={i} x1="50" y1="50" x2={50 + 42 * Math.cos(rad)} y2={50 + 42 * Math.sin(rad)} stroke="#a78bfa" strokeWidth="0.4" opacity="0.15"/>
    })}
    {/* Triângulo — frame caçador */}
    <polygon points="50,8 88,72 12,72" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.45"/>
    <polygon points="50,18 78,65 22,65" fill="#a78bfa" opacity="0.05"/>
    {/* Rosto */}
    <ellipse cx="50" cy="47" rx="15" ry="17" fill="#0c0820" stroke="#a78bfa" strokeWidth="1"/>
    {/* Olhos — seta/mira */}
    <circle cx="41" cy="43" r="5" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.8"/>
    <circle cx="41" cy="43" r="2.5" fill="#a78bfa" opacity="0.9" filter="url(#glow_ju)"/>
    <line x1="35" y1="43" x2="37" y2="43" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    <line x1="45" y1="43" x2="47" y2="43" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    <circle cx="59" cy="43" r="5" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.8"/>
    <circle cx="59" cy="43" r="2.5" fill="#a78bfa" opacity="0.9" filter="url(#glow_ju)"/>
    <line x1="53" y1="43" x2="55" y2="43" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    <line x1="63" y1="43" x2="65" y2="43" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    {/* Boca — sorriso confiante */}
    <path d="M42 54 Q50 60 58 54" stroke="#a78bfa" strokeWidth="1.8" fill="none" strokeLinecap="round" opacity="0.9"/>
    {/* Raio no topo */}
    <path d="M50 10 L53 18 L50 16 L47 18 Z" fill="#a78bfa" opacity="0.7" filter="url(#glow_ju)"/>
    {/* Badge */}
    <circle cx="78" cy="22" r="9" fill="#08041a" stroke="#a78bfa" strokeWidth="1"/>
    <text x="78" y="26" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#a78bfa" fontFamily="monospace">JU</text>
    {/* Status */}
    <rect x="18" y="84" width="64" height="4" rx="2" fill="#111"/>
    <rect x="18" y="84" width="24" height="4" rx="2" fill="#a78bfa" opacity="0.7"/>
    <text x="50" y="95" textAnchor="middle" fontSize="6" fill="#a78bfa" opacity="0.7" fontFamily="monospace">VENDAS · LV.1</text>
  </svg>
)

// Mapa por email
export const AVATAR_BY_EMAIL = {
  'gabrielsschollmeier@gmail.com': GabrielSVG,
  'carolinepaganiadv@gmail.com':   CarolSVG,
  'gestaotrafegon@gmail.com':      TochiroSVG,
  'socialmediatrafegon@gmail.com': AnaSVG,
  'atendimentotrafegon@gmail.com': AdmSVG,
  'trafegonvendas@gmail.com':      JulianoSVG,
}

// Mapa por ID mock
export const AVATAR_BY_ID = {
  gs:      GabrielSVG,
  carol:   CarolSVG,
  tochiro: TochiroSVG,
  ana_sm:  AnaSVG,
  adm_at:  AdmSVG,
  juliano: JulianoSVG,
}

export function getAvatarComponent(identifier) {
  if (!identifier) return null
  return AVATAR_BY_EMAIL[identifier] || AVATAR_BY_ID[identifier] || null
}
