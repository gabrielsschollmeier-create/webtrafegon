// ── Avatares SVG — Lendas Copa Tráfegon ──────────────────────────────────────
// Pelé: pele negra, cabelo afro curto, sorriso icônico, jersey verde #10
// Ronaldo: pele morena, moicano 2002 (triângulo), sorriso largo, jersey amarelo #9
// Neymar: pele clara/caramelo, loiro/claro, brincos, jersey amarelo #11

export const PeleSVG = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="pk-glow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#f5c400" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <clipPath id="pk-head"><ellipse cx="50" cy="41" rx="21" ry="23"/></clipPath>
    </defs>
    <rect width="100" height="120" fill="url(#pk-glow)"/>

    {/* Sombra do corpo */}
    <ellipse cx="50" cy="118" rx="28" ry="4" fill="rgba(0,0,0,0.3)"/>

    {/* Jersey verde Brasil — corpo */}
    <path d="M16 76 Q15 68 42 64 L50 68 L58 64 Q85 68 84 76 L88 120 L12 120Z" fill="#005f22"/>
    <path d="M16 76 Q15 68 42 64 L50 68 L58 64 Q85 68 84 76 L88 120 L12 120Z" fill="#009C3B"/>
    {/* Faixa amarela diagonal */}
    <path d="M22 76 L16 120 L38 120 L46 76Z" fill="#FFDF00" opacity="0.22"/>
    {/* Gola */}
    <path d="M42 64 Q50 70 58 64 Q55 72 50 73 Q45 72 42 64Z" fill="#007a30"/>
    {/* Número 10 */}
    <text x="57" y="100" textAnchor="middle" fontSize="19" fontWeight="900"
      fill="#FFDF00" fontFamily="Impact,Arial Black,sans-serif" letterSpacing="-1">10</text>
    {/* Escudo CBF estilizado */}
    <ellipse cx="36" cy="82" rx="5" ry="6" fill="#FFDF00" opacity="0.7"/>
    <ellipse cx="36" cy="82" rx="3.5" ry="4.5" fill="#009C3B"/>
    <ellipse cx="36" cy="82" rx="2" ry="2.5" fill="#002776"/>

    {/* Pescoço */}
    <rect x="44" y="59" width="12" height="10" rx="4" fill="#1a0a04"/>

    {/* Orelhas */}
    <ellipse cx="29" cy="42" rx="4.5" ry="5.5" fill="#1a0a04"/>
    <ellipse cx="71" cy="42" rx="4.5" ry="5.5" fill="#1a0a04"/>
    <ellipse cx="29" cy="42" rx="2.5" ry="3" fill="#2a1008"/>
    <ellipse cx="71" cy="42" rx="2.5" ry="3" fill="#2a1008"/>

    {/* Cabeça — pele negra */}
    <ellipse cx="50" cy="41" rx="21" ry="23" fill="#1a0a04"/>
    {/* Gradiente de iluminação natural */}
    <ellipse cx="44" cy="35" rx="10" ry="8" fill="#2a1208" opacity="0.6"/>

    {/* Cabelo afro curto — muito escuro, texturizado */}
    <path d="M29 37 Q28 15 50 13 Q72 15 71 37 Q70 22 50 20 Q30 22 29 37Z" fill="#0d0402"/>
    {/* Textura afro — pequenos "pontos" para dar volume */}
    <circle cx="36" cy="19" r="2.5" fill="#0d0402"/>
    <circle cx="42" cy="16" r="2.5" fill="#0d0402"/>
    <circle cx="50" cy="15" r="3" fill="#0d0402"/>
    <circle cx="58" cy="16" r="2.5" fill="#0d0402"/>
    <circle cx="64" cy="19" r="2.5" fill="#0d0402"/>
    <circle cx="32" cy="24" r="2" fill="#0d0402"/>
    <circle cx="68" cy="24" r="2" fill="#0d0402"/>

    {/* Testa */}
    <path d="M30 36 Q30 30 50 28 Q70 30 70 36" fill="#1a0a04"/>

    {/* Sobrancelhas grossas */}
    <path d="M34 34 Q41 31 46 33" stroke="#0d0402" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
    <path d="M54 33 Q59 31 66 34" stroke="#0d0402" strokeWidth="2.5" fill="none" strokeLinecap="round"/>

    {/* Olhos — expressivos e quentes */}
    <ellipse cx="41" cy="38" rx="5.5" ry="4.5" fill="#0d0402"/>
    <ellipse cx="59" cy="38" rx="5.5" ry="4.5" fill="#0d0402"/>
    {/* Esclerótica */}
    <ellipse cx="41.5" cy="37.5" rx="3" ry="2.5" fill="white"/>
    <ellipse cx="59.5" cy="37.5" rx="3" ry="2.5" fill="white"/>
    {/* Íris castanha */}
    <circle cx="42" cy="38" r="2" fill="#3d1a00"/>
    <circle cx="60" cy="38" r="2" fill="#3d1a00"/>
    {/* Pupila */}
    <circle cx="42" cy="38" r="1.1" fill="#0d0402"/>
    <circle cx="60" cy="38" r="1.1" fill="#0d0402"/>
    {/* Brilho */}
    <circle cx="41" cy="37" r="0.6" fill="white"/>
    <circle cx="59" cy="37" r="0.6" fill="white"/>

    {/* Nariz largo e arredondado */}
    <path d="M46 45 Q50 49 54 45" stroke="#0d0402" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="46.5" cy="46" rx="3" ry="2" fill="#150704"/>
    <ellipse cx="53.5" cy="46" rx="3" ry="2" fill="#150704"/>
    <circle cx="46.5" cy="46" r="1.2" fill="#0a0402"/>
    <circle cx="53.5" cy="46" r="1.2" fill="#0a0402"/>

    {/* Sorriso ICÔNICO — largo e caloroso */}
    <path d="M37 53 Q50 64 63 53" stroke="#0d0402" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Lábios */}
    <path d="M38 53 Q50 58 62 53 Q58 60 50 61 Q42 60 38 53Z" fill="#5a2010"/>
    {/* Dentes — sorriso largo */}
    <path d="M40 54 Q50 60 60 54 Q55 62 50 63 Q45 62 40 54Z" fill="white" opacity="0.92"/>
    {/* Linha entre dentes */}
    <line x1="50" y1="54.5" x2="50" y2="61.5" stroke="#e0d0c0" strokeWidth="0.4" opacity="0.5"/>
    <line x1="44" y1="54.5" x2="43" y2="61" stroke="#e0d0c0" strokeWidth="0.4" opacity="0.4"/>
    <line x1="56" y1="54.5" x2="57" y2="61" stroke="#e0d0c0" strokeWidth="0.4" opacity="0.4"/>

    {/* Nome */}
    <text x="50" y="116" textAnchor="middle" fontSize="7" fontWeight="900"
      fill="#f5c400" fontFamily="sans-serif" letterSpacing="1.5">P E L É</text>
  </svg>
)

export const RonaldoSVG = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="rn-glow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#00aaff" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
    </defs>
    <rect width="100" height="120" fill="url(#rn-glow)"/>
    <ellipse cx="50" cy="118" rx="28" ry="4" fill="rgba(0,0,0,0.3)"/>

    {/* Jersey amarela Brasil #9 */}
    <path d="M16 76 Q15 68 42 64 L50 68 L58 64 Q85 68 84 76 L88 120 L12 120Z" fill="#d4ac00"/>
    <path d="M16 76 Q15 68 42 64 L50 68 L58 64 Q85 68 84 76 L88 120 L12 120Z" fill="#FFDF00"/>
    <path d="M22 76 L16 120 L34 120 L40 76Z" fill="#0038a8" opacity="0.2"/>
    <path d="M78 76 L84 120 L66 120 L60 76Z" fill="#0038a8" opacity="0.2"/>
    <path d="M42 64 Q50 70 58 64 Q55 72 50 73 Q45 72 42 64Z" fill="#e6c800"/>
    <text x="57" y="100" textAnchor="middle" fontSize="22" fontWeight="900"
      fill="#0038a8" fontFamily="Impact,Arial Black,sans-serif">9</text>
    <ellipse cx="36" cy="82" rx="5" ry="6" fill="#0038a8" opacity="0.8"/>
    <ellipse cx="36" cy="82" rx="3.5" ry="4.5" fill="#FFDF00"/>
    <ellipse cx="36" cy="82" rx="2" ry="2.5" fill="#009C3B"/>

    {/* Pescoço */}
    <rect x="44" y="59" width="12" height="10" rx="4" fill="#7B4A25"/>

    {/* Orelhas */}
    <ellipse cx="29" cy="42" rx="4.5" ry="5.5" fill="#7B4A25"/>
    <ellipse cx="71" cy="42" rx="4.5" ry="5.5" fill="#7B4A25"/>
    <ellipse cx="29" cy="42" rx="2.5" ry="3" fill="#6a3c1a"/>
    <ellipse cx="71" cy="42" rx="2.5" ry="3" fill="#6a3c1a"/>

    {/* Cabeça — pele morena escura */}
    <ellipse cx="50" cy="41" rx="21" ry="23" fill="#8B4A20"/>
    <ellipse cx="44" cy="35" rx="9" ry="7" fill="#9a5528" opacity="0.5"/>

    {/* MOICANO ICÔNICO 2002 — crânio raspado + triângulo na frente */}
    {/* Base raspada (crânio visível) */}
    <path d="M29 36 Q29 18 50 16 Q71 18 71 36 Q69 24 50 22 Q31 24 29 36Z" fill="#6a3c1a"/>
    {/* Triângulo/patch de cabelo icônico NO CENTRO DA TESTA */}
    <path d="M44 22 Q50 14 56 22 Q54 28 50 30 Q46 28 44 22Z" fill="#1a0a04"/>
    {/* Ponta do triângulo para cima */}
    <path d="M47 18 Q50 12 53 18 Q51 22 50 23 Q49 22 47 18Z" fill="#1a0a04"/>
    {/* Sombra ao redor do patch */}
    <path d="M40 22 Q42 18 44 22 Q46 26 44 28 Q40 26 40 22Z" fill="#5a3010" opacity="0.5"/>
    <path d="M56 22 Q58 18 60 22 Q60 26 56 28 Q54 26 56 22Z" fill="#5a3010" opacity="0.5"/>

    {/* Sobrancelhas grossas e expressivas */}
    <path d="M33 34 Q41 30 47 32" stroke="#1a0a04" strokeWidth="3" fill="none" strokeLinecap="round"/>
    <path d="M53 32 Q59 30 67 34" stroke="#1a0a04" strokeWidth="3" fill="none" strokeLinecap="round"/>

    {/* Olhos grandes e confiantes */}
    <ellipse cx="41" cy="38" rx="5.5" ry="4.5" fill="#1a0a04"/>
    <ellipse cx="59" cy="38" rx="5.5" ry="4.5" fill="#1a0a04"/>
    <ellipse cx="41.5" cy="37.5" rx="3" ry="2.5" fill="white"/>
    <ellipse cx="59.5" cy="37.5" rx="3" ry="2.5" fill="white"/>
    <circle cx="42" cy="38" r="2" fill="#3d1a00"/>
    <circle cx="60" cy="38" r="2" fill="#3d1a00"/>
    <circle cx="42" cy="38" r="1.1" fill="#1a0a04"/>
    <circle cx="60" cy="38" r="1.1" fill="#1a0a04"/>
    <circle cx="41" cy="37" r="0.6" fill="white"/>
    <circle cx="59" cy="37" r="0.6" fill="white"/>

    {/* Nariz largo */}
    <path d="M46 44 Q50 48 54 44" stroke="#4a2010" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <ellipse cx="46.5" cy="45.5" rx="3.5" ry="2.2" fill="#6a3c1a"/>
    <ellipse cx="53.5" cy="45.5" rx="3.5" ry="2.2" fill="#6a3c1a"/>
    <circle cx="46.5" cy="45.5" r="1.4" fill="#3a1808"/>
    <circle cx="53.5" cy="45.5" r="1.4" fill="#3a1808"/>

    {/* Sorriso ICÔNICO — dentes com leve protrusão superior */}
    <path d="M38 52 Q50 63 62 52" stroke="#4a2010" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M39 52 Q50 60 61 52 Q57 59 50 61 Q43 59 39 52Z" fill="#5a2810"/>
    {/* Dentes com "destaque" superior — traço característico */}
    <path d="M41 53 Q50 61 59 53 Q56 62 50 63 Q44 62 41 53Z" fill="white" opacity="0.92"/>
    <line x1="50" y1="54" x2="50" y2="62" stroke="#e0d0c0" strokeWidth="0.4" opacity="0.5"/>

    {/* Nome */}
    <text x="50" y="116" textAnchor="middle" fontSize="6.5" fontWeight="900"
      fill="#7dd3fc" fontFamily="sans-serif" letterSpacing="1">RONALDO</text>
  </svg>
)

export const NeymarSVG = () => (
  <svg viewBox="0 0 100 120" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ny-glow" cx="50%" cy="45%" r="50%">
        <stop offset="0%" stopColor="#c084fc" stopOpacity="0.18"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
    </defs>
    <rect width="100" height="120" fill="url(#ny-glow)"/>
    <ellipse cx="50" cy="118" rx="28" ry="4" fill="rgba(0,0,0,0.3)"/>

    {/* Jersey amarela Brasil #11 */}
    <path d="M16 76 Q15 68 42 64 L50 68 L58 64 Q85 68 84 76 L88 120 L12 120Z" fill="#d4ac00"/>
    <path d="M16 76 Q15 68 42 64 L50 68 L58 64 Q85 68 84 76 L88 120 L12 120Z" fill="#FFDF00"/>
    <path d="M22 76 L16 120 L34 120 L40 76Z" fill="#7c3aed" opacity="0.18"/>
    <path d="M78 76 L84 120 L66 120 L60 76Z" fill="#7c3aed" opacity="0.18"/>
    <path d="M42 64 Q50 70 58 64 Q55 72 50 73 Q45 72 42 64Z" fill="#e6c800"/>
    <text x="57" y="100" textAnchor="middle" fontSize="18" fontWeight="900"
      fill="#7c3aed" fontFamily="Impact,Arial Black,sans-serif" letterSpacing="-1">11</text>
    <ellipse cx="36" cy="82" rx="5" ry="6" fill="#7c3aed" opacity="0.8"/>
    <ellipse cx="36" cy="82" rx="3.5" ry="4.5" fill="#FFDF00"/>
    <ellipse cx="36" cy="82" rx="2" ry="2.5" fill="#009C3B"/>

    {/* Pescoço */}
    <rect x="44" y="59" width="12" height="10" rx="4" fill="#C28B5A"/>

    {/* Orelhas */}
    <ellipse cx="29" cy="42" rx="4.5" ry="5.5" fill="#C28B5A"/>
    <ellipse cx="71" cy="42" rx="4.5" ry="5.5" fill="#C28B5A"/>
    <ellipse cx="29" cy="42" rx="2.5" ry="3" fill="#B07848"/>
    <ellipse cx="71" cy="42" rx="2.5" ry="3" fill="#B07848"/>
    {/* Brincos dourados icônicos */}
    <circle cx="26.5" cy="46" r="2.5" fill="#f5c400"/>
    <circle cx="73.5" cy="46" r="2.5" fill="#f5c400"/>
    <circle cx="26.5" cy="46" r="1.2" fill="#c89000"/>
    <circle cx="73.5" cy="46" r="1.2" fill="#c89000"/>

    {/* Cabeça — pele caramelo clara */}
    <ellipse cx="50" cy="41" rx="21" ry="23" fill="#D4956A"/>
    {/* Iluminação */}
    <ellipse cx="44" cy="35" rx="8" ry="6" fill="#e0a878" opacity="0.4"/>

    {/* Cabelo — loiro platinado com topete icônico (2022-2026 era) */}
    {/* Base do cabelo nas laterais — curto e escuro */}
    <path d="M29 36 Q29 22 50 18 Q71 22 71 36 Q69 25 50 23 Q31 25 29 36Z" fill="#8a6a20"/>
    {/* Topete/franja — loiro platinado */}
    <path d="M36 20 Q50 13 64 20 Q60 24 50 25 Q40 24 36 20Z" fill="#e8d060"/>
    {/* Reflexo loiro */}
    <path d="M42 17 Q50 12 58 17 Q55 20 50 21 Q45 20 42 17Z" fill="#f5e898"/>
    {/* Degradê lateral */}
    <path d="M30 26 Q29 20 34 18 Q30 22 30 30Z" fill="#6a5010" opacity="0.7"/>
    <path d="M70 26 Q71 20 66 18 Q70 22 70 30Z" fill="#6a5010" opacity="0.7"/>
    {/* Mechas loiras caindo na testa */}
    <path d="M42 22 Q46 26 44 30" stroke="#e8d060" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.8"/>
    <path d="M50 20 Q50 25 49 29" stroke="#f5e898" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.7"/>

    {/* Sobrancelhas finas e well-groomed */}
    <path d="M35 33 Q42 30 47 32" stroke="#6a4a10" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M53 32 Q58 30 65 33" stroke="#6a4a10" strokeWidth="2" fill="none" strokeLinecap="round"/>

    {/* Olhos — amendoados, expressivos */}
    <ellipse cx="41" cy="38" rx="5.5" ry="4" fill="#2a1a0a"/>
    <ellipse cx="59" cy="38" rx="5.5" ry="4" fill="#2a1a0a"/>
    {/* Pálpebra superior */}
    <path d="M36 36 Q41 33 46 36" stroke="#2a1a0a" strokeWidth="1" fill="none"/>
    <path d="M54 36 Q59 33 64 36" stroke="#2a1a0a" strokeWidth="1" fill="none"/>
    <ellipse cx="41.5" cy="38" rx="3.2" ry="2.5" fill="white"/>
    <ellipse cx="59.5" cy="38" rx="3.2" ry="2.5" fill="white"/>
    {/* Íris castanha/avelã */}
    <circle cx="42" cy="38" r="2.2" fill="#5a3a10"/>
    <circle cx="60" cy="38" r="2.2" fill="#5a3a10"/>
    <circle cx="42" cy="38" r="1.2" fill="#2a1a0a"/>
    <circle cx="60" cy="38" r="1.2" fill="#2a1a0a"/>
    <circle cx="41.2" cy="37.2" r="0.6" fill="white"/>
    <circle cx="59.2" cy="37.2" r="0.6" fill="white"/>

    {/* Nariz mais fino e delicado */}
    <path d="M48 44 Q50 47 52 44" stroke="#8a5a30" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <ellipse cx="47.5" cy="45" rx="2.5" ry="1.8" fill="#B07848"/>
    <ellipse cx="52.5" cy="45" rx="2.5" ry="1.8" fill="#B07848"/>
    <circle cx="47.5" cy="45" r="1" fill="#8a5a30"/>
    <circle cx="52.5" cy="45" r="1" fill="#8a5a30"/>

    {/* Sorriso jovem e playful */}
    <path d="M40 52 Q50 61 60 52" stroke="#7a4a20" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M41 52 Q50 60 59 52 Q56 58 50 59 Q44 58 41 52Z" fill="#8a4a20"/>
    <path d="M43 53 Q50 59 57 53 Q54 60 50 61 Q46 60 43 53Z" fill="white" opacity="0.9"/>
    <line x1="50" y1="54" x2="50" y2="60" stroke="#e0d0c0" strokeWidth="0.4" opacity="0.5"/>

    {/* Barba leve / sombra de barba */}
    <path d="M38 55 Q50 65 62 55 Q62 62 50 65 Q38 62 38 55Z" fill="#a06030" opacity="0.1"/>

    {/* Nome */}
    <text x="50" y="116" textAnchor="middle" fontSize="6" fontWeight="900"
      fill="#e9d5ff" fontFamily="sans-serif" letterSpacing="0.8">NEYMAR JR.</text>
  </svg>
)
