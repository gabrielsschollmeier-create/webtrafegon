// ── Avatares estilizados — Lendas Copa Tráfegon ──────────────────────────────

export const PeleSVG = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    {/* BG radial */}
    <defs>
      <radialGradient id="pele-bg" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#f5c400" stopOpacity="0.25"/>
        <stop offset="100%" stopColor="#009C3B" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100" height="120" fill="url(#pele-bg)"/>

    {/* Coroa */}
    <text x="50" y="14" textAnchor="middle" fontSize="13" fill="#f5c400"
      style={{ filter:'drop-shadow(0 0 4px rgba(245,196,0,0.9))' }}>♛</text>

    {/* Pescoço */}
    <rect x="43" y="58" width="14" height="12" rx="3" fill="#4a2510"/>

    {/* Cabeça */}
    <ellipse cx="50" cy="42" rx="22" ry="24" fill="#5C2E10"/>

    {/* Cabelo */}
    <path d="M28 36 Q28 16 50 14 Q72 16 72 36 Q68 22 50 20 Q32 22 28 36Z" fill="#1a0800"/>

    {/* Orelhas */}
    <ellipse cx="28.5" cy="43" rx="4" ry="5.5" fill="#4a2510"/>
    <ellipse cx="71.5" cy="43" rx="4" ry="5.5" fill="#4a2510"/>

    {/* Sobrancelhas */}
    <path d="M36 33 Q42 30 46 32" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M54 32 Q58 30 64 33" stroke="#1a0800" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Olhos */}
    <ellipse cx="42" cy="38" rx="5" ry="4.5" fill="#1a0800"/>
    <ellipse cx="58" cy="38" rx="5" ry="4.5" fill="#1a0800"/>
    <ellipse cx="43" cy="37" rx="2" ry="2" fill="white"/>
    <ellipse cx="59" cy="37" rx="2" ry="2" fill="white"/>
    <circle cx="43.5" cy="37" r="1" fill="#1a0800"/>
    <circle cx="59.5" cy="37" r="1" fill="#1a0800"/>

    {/* Nariz */}
    <path d="M47 44 Q50 48 53 44" stroke="#3a1a08" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

    {/* Sorriso icônico */}
    <path d="M40 52 Q50 61 60 52" stroke="#3a1a08" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M42 53 Q50 60 58 53 Q50 62 42 53Z" fill="white" opacity="0.9"/>

    {/* Camiseta verde Brasil */}
    <path d="M18 72 Q18 66 43 63 L50 66 L57 63 Q82 66 82 72 L86 120 L14 120Z" fill="#009C3B"/>
    {/* Gola */}
    <path d="M43 63 Q50 68 57 63 Q54 70 50 71 Q46 70 43 63Z" fill="#007a2f"/>
    {/* Faixa amarela diagonal */}
    <path d="M18 72 L14 120 L36 120 L42 72Z" fill="#FFDF00" opacity="0.18"/>
    {/* Número */}
    <text x="50" y="102" textAnchor="middle" fontSize="28" fontWeight="900"
      fill="#FFDF00" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-1"
      style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.6))' }}>10</text>
    {/* BRASIL */}
    <text x="50" y="75" textAnchor="middle" fontSize="6.5" fontWeight="800"
      fill="#FFDF00" fontFamily="sans-serif" letterSpacing="2" opacity="0.9">BRASIL</text>

    {/* Nome */}
    <text x="50" y="117" textAnchor="middle" fontSize="6" fontWeight="900"
      fill="#f5c400" fontFamily="sans-serif" letterSpacing="1">PELÉ</text>
  </svg>
)

export const RonaldoSVG = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ron-bg" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#00aaff" stopOpacity="0.22"/>
        <stop offset="100%" stopColor="#f5c400" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100" height="120" fill="url(#ron-bg)"/>

    {/* Ícone raio */}
    <text x="50" y="14" textAnchor="middle" fontSize="12" fill="#7dd3fc"
      style={{ filter:'drop-shadow(0 0 5px rgba(125,211,252,0.9))' }}>⚡</text>

    {/* Pescoço */}
    <rect x="43" y="58" width="14" height="12" rx="3" fill="#6B3A1F"/>

    {/* Cabeça */}
    <ellipse cx="50" cy="42" rx="22" ry="24" fill="#7B4522"/>

    {/* Crânio raspado — base */}
    <path d="M28 36 Q28 16 50 14 Q72 16 72 36 Q68 22 50 20 Q32 22 28 36Z" fill="#5a2e0e"/>

    {/* Moicano icônico 2002 — faixa central de cabelo */}
    <path d="M42 20 Q50 14 58 20 Q55 30 50 32 Q45 30 42 20Z" fill="#1a0800"/>
    {/* Crista do moicano */}
    <path d="M46 17 Q50 11 54 17 Q52 22 50 24 Q48 22 46 17Z" fill="#1a0800"/>

    {/* Orelhas */}
    <ellipse cx="28.5" cy="43" rx="4" ry="5.5" fill="#6B3A1F"/>
    <ellipse cx="71.5" cy="43" rx="4" ry="5.5" fill="#6B3A1F"/>

    {/* Sobrancelhas grossas */}
    <path d="M35 33 Q42 29 47 32" stroke="#1a0800" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M53 32 Q58 29 65 33" stroke="#1a0800" strokeWidth="3" fill="none" strokeLinecap="round"/>

    {/* Olhos */}
    <ellipse cx="42" cy="38" rx="5" ry="4.5" fill="#1a0800"/>
    <ellipse cx="58" cy="38" rx="5" ry="4.5" fill="#1a0800"/>
    <ellipse cx="43" cy="37" rx="2" ry="2" fill="white"/>
    <ellipse cx="59" cy="37" rx="2" ry="2" fill="white"/>
    <circle cx="43.5" cy="37" r="1.2" fill="#1a0800"/>
    <circle cx="59.5" cy="37" r="1.2" fill="#1a0800"/>

    {/* Nariz largo */}
    <path d="M46 44 Q50 48 54 44" stroke="#4a2510" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="47" cy="45" rx="2.5" ry="1.5" fill="#5a2e0e"/>
    <ellipse cx="53" cy="45" rx="2.5" ry="1.5" fill="#5a2e0e"/>

    {/* Sorriso largo */}
    <path d="M40 52 Q50 62 60 52" stroke="#4a2510" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M42 53 Q50 61 58 53 Q50 63 42 53Z" fill="white" opacity="0.9"/>

    {/* Camiseta amarela Brasil */}
    <path d="M18 72 Q18 66 43 63 L50 66 L57 63 Q82 66 82 72 L86 120 L14 120Z" fill="#FFDF00"/>
    <path d="M43 63 Q50 68 57 63 Q54 70 50 71 Q46 70 43 63Z" fill="#e6c800"/>
    {/* Detalhe azul */}
    <path d="M18 72 L14 120 L30 120 L36 72Z" fill="#0038a8" opacity="0.25"/>
    <path d="M82 72 L86 120 L70 120 L64 72Z" fill="#0038a8" opacity="0.25"/>
    {/* Número */}
    <text x="50" y="102" textAnchor="middle" fontSize="30" fontWeight="900"
      fill="#0038a8" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-1"
      style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>9</text>
    {/* BRASIL */}
    <text x="50" y="75" textAnchor="middle" fontSize="6.5" fontWeight="800"
      fill="#0038a8" fontFamily="sans-serif" letterSpacing="2" opacity="0.9">BRASIL</text>

    {/* Nome */}
    <text x="50" y="117" textAnchor="middle" fontSize="5.5" fontWeight="900"
      fill="#7dd3fc" fontFamily="sans-serif" letterSpacing="0.5">RONALDO</text>
  </svg>
)

export const NeymarSVG = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ney-bg" cx="50%" cy="40%" r="55%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.22"/>
        <stop offset="100%" stopColor="#f5c400" stopOpacity="0"/>
      </radialGradient>
    </defs>
    <rect width="100" height="120" fill="url(#ney-bg)"/>

    {/* Ícone paleta */}
    <text x="50" y="14" textAnchor="middle" fontSize="12" fill="#e9d5ff"
      style={{ filter:'drop-shadow(0 0 5px rgba(192,132,252,0.9))' }}>🎨</text>

    {/* Pescoço */}
    <rect x="43" y="58" width="14" height="12" rx="3" fill="#C08060"/>

    {/* Cabeça */}
    <ellipse cx="50" cy="42" rx="22" ry="24" fill="#D4956A"/>

    {/* Cabelo loiro/dreads característico */}
    {/* Base do cabelo */}
    <path d="M28 36 Q28 14 50 12 Q72 14 72 36 Q68 20 50 18 Q32 20 28 36Z" fill="#c8a44a"/>
    {/* Topete/franja lateral esquerda */}
    <path d="M28 28 Q24 20 26 12 Q30 18 34 24Z" fill="#c8a44a"/>
    {/* Dreads caindo */}
    <path d="M30 22 Q26 30 24 42 Q22 50 25 55" stroke="#b8942a" strokeWidth="4" fill="none" strokeLinecap="round"/>
    <path d="M34 18 Q30 28 28 40 Q26 50 28 58" stroke="#c8a44a" strokeWidth="3.5" fill="none" strokeLinecap="round"/>
    {/* Dread direito */}
    <path d="M70 22 Q74 32 72 44 Q70 52 72 58" stroke="#b8942a" strokeWidth="4" fill="none" strokeLinecap="round"/>

    {/* Orelhas */}
    <ellipse cx="28.5" cy="43" rx="4" ry="5.5" fill="#C08060"/>
    <ellipse cx="71.5" cy="43" rx="4" ry="5.5" fill="#C08060"/>

    {/* Brinco esquerdo */}
    <circle cx="26" cy="46" r="2" fill="#f5c400"/>
    {/* Brinco direito */}
    <circle cx="74" cy="46" r="2" fill="#f5c400"/>

    {/* Sobrancelhas finas */}
    <path d="M36 33 Q42 30 47 32" stroke="#8B5E3C" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M53 32 Q58 30 64 33" stroke="#8B5E3C" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Olhos */}
    <ellipse cx="42" cy="38" rx="5" ry="4.5" fill="#2a1a0e"/>
    <ellipse cx="58" cy="38" rx="5" ry="4.5" fill="#2a1a0e"/>
    <ellipse cx="43" cy="37" rx="2.5" ry="2" fill="white"/>
    <ellipse cx="59" cy="37" rx="2.5" ry="2" fill="white"/>
    <circle cx="43.5" cy="37" r="1.2" fill="#2a1a0e"/>
    <circle cx="59.5" cy="37" r="1.2" fill="#2a1a0e"/>

    {/* Nariz */}
    <path d="M47 44 Q50 47 53 44" stroke="#A06040" strokeWidth="1.5" fill="none" strokeLinecap="round"/>

    {/* Sorriso com dente */}
    <path d="M40 52 Q50 60 60 52" stroke="#A06040" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    <path d="M43 52 Q50 59 57 52 Q50 61 43 52Z" fill="white" opacity="0.85"/>

    {/* Camiseta amarela Brasil */}
    <path d="M18 72 Q18 66 43 63 L50 66 L57 63 Q82 66 82 72 L86 120 L14 120Z" fill="#FFDF00"/>
    <path d="M43 63 Q50 68 57 63 Q54 70 50 71 Q46 70 43 63Z" fill="#e6c800"/>
    {/* Detalhe roxo/moderno */}
    <path d="M18 72 L14 120 L32 120 L38 72Z" fill="#7c3aed" opacity="0.2"/>
    <path d="M82 72 L86 120 L68 120 L62 72Z" fill="#7c3aed" opacity="0.2"/>
    {/* Número */}
    <text x="50" y="102" textAnchor="middle" fontSize="28" fontWeight="900"
      fill="#7c3aed" fontFamily="Impact, Arial Black, sans-serif" letterSpacing="-1"
      style={{ filter:'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }}>11</text>
    {/* BRASIL */}
    <text x="50" y="75" textAnchor="middle" fontSize="6.5" fontWeight="800"
      fill="#7c3aed" fontFamily="sans-serif" letterSpacing="2" opacity="0.9">BRASIL</text>

    {/* Nome */}
    <text x="50" y="117" textAnchor="middle" fontSize="5.5" fontWeight="900"
      fill="#e9d5ff" fontFamily="sans-serif" letterSpacing="0.5">NEYMAR JR.</text>
  </svg>
)
