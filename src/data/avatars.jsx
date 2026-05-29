// Avatares — estilo personagem de jogo (RPG card game)
// Cada membro tem uma classe visual única baseada no seu cargo

// ── Gabriel — O Comandante (Gestor de Tráfego) ──────────────────
const GabrielSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="gbg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#1f3a0f"/>
        <stop offset="100%" stopColor="#050d02"/>
      </radialGradient>
      <filter id="gglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gbg)"/>
    {/* Atmosfera */}
    <ellipse cx="50" cy="85" rx="35" ry="12" fill="#6eda2c" opacity="0.12" filter="url(#gglow)"/>
    {/* Armadura ombros */}
    <path d="M12 90 Q22 68 34 65 Q42 74 50 76 Q58 74 66 65 Q78 68 88 90 Z" fill="#1a2e0a"/>
    <path d="M12 90 Q22 68 34 65 Q38 70 42 72" fill="none" stroke="#6eda2c" strokeWidth="0.8" opacity="0.6"/>
    <path d="M88 90 Q78 68 66 65 Q62 70 58 72" fill="none" stroke="#6eda2c" strokeWidth="0.8" opacity="0.6"/>
    {/* Ombreira esq */}
    <path d="M14 78 Q20 65 30 62 L34 65 Q24 70 18 82 Z" fill="#243d12" stroke="#6eda2c" strokeWidth="0.5"/>
    {/* Ombreira dir */}
    <path d="M86 78 Q80 65 70 62 L66 65 Q76 70 82 82 Z" fill="#243d12" stroke="#6eda2c" strokeWidth="0.5"/>
    {/* Pescoço + colarinho tático */}
    <rect x="43" y="64" width="14" height="14" rx="4" fill="#1e3410"/>
    <rect x="45" y="64" width="10" height="5" rx="2" fill="#2a4a18" stroke="#6eda2c" strokeWidth="0.5"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="46" rx="20" ry="22" fill="#1a3008"/>
    <ellipse cx="50" cy="44" rx="17" ry="19" fill="#c8925a"/>
    {/* Capacete tático */}
    <path d="M33 38 Q50 24 67 38 L67 34 Q50 18 33 34 Z" fill="#1a2e0a" stroke="#6eda2c" strokeWidth="0.8"/>
    <rect x="33" y="32" width="34" height="8" rx="2" fill="#1a2e0a"/>
    <line x1="33" y1="36" x2="67" y2="36" stroke="#6eda2c" strokeWidth="0.6" opacity="0.7"/>
    {/* Visor tático sobre olhos */}
    <rect x="33" y="40" width="34" height="10" rx="3" fill="#0a1a05" opacity="0.85"/>
    <rect x="35" y="41.5" width="13" height="7" rx="2" fill="#6eda2c" opacity="0.25"/>
    <rect x="52" y="41.5" width="13" height="7" rx="2" fill="#6eda2c" opacity="0.25"/>
    <rect x="36" y="42.5" width="11" height="5" rx="1.5" fill="#6eda2c" opacity="0.7" filter="url(#gglow)"/>
    <rect x="53" y="42.5" width="11" height="5" rx="1.5" fill="#6eda2c" opacity="0.7" filter="url(#gglow)"/>
    {/* Scanline */}
    <line x1="35" y1="45" x2="65" y2="45" stroke="#6eda2c" strokeWidth="0.4" opacity="0.5"/>
    {/* Nariz e boca */}
    <path d="M48 54 Q50 57 52 54" stroke="#a06838" strokeWidth="1" fill="none"/>
    <path d="M44 59 Q50 62 56 59" stroke="#8a4a28" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Emblema no peito */}
    <polygon points="50,68 53,72 50,76 47,72" fill="#6eda2c" opacity="0.8" filter="url(#gglow)"/>
    {/* Classe badge */}
    <rect x="2" y="2" width="30" height="10" rx="3" fill="#0a1a05" stroke="#6eda2c" strokeWidth="0.6"/>
    <text x="17" y="9.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#6eda2c" fontFamily="monospace">COMANDANTE</text>
    {/* Barra XP fundo */}
    <rect x="8" y="91" width="84" height="5" rx="2.5" fill="#0a1a05" stroke="#6eda2c" strokeWidth="0.4"/>
    <rect x="8" y="91" width="20" height="5" rx="2.5" fill="#6eda2c" opacity="0.8"/>
    <text x="50" y="99" textAnchor="middle" fontSize="4.5" fill="#6eda2c" opacity="0.6" fontFamily="monospace">ons ░░░░░░░░░░░░░░░░ LV.1</text>
  </svg>
)

// ── Carol — A Arquiteta (Administrador) ─────────────────────────
const CarolSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="cbg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#2a0a3e"/>
        <stop offset="100%" stopColor="#08020f"/>
      </radialGradient>
      <filter id="cglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#cbg)"/>
    <ellipse cx="50" cy="88" rx="30" ry="10" fill="#be29ec" opacity="0.15" filter="url(#cglow)"/>
    {/* Manto/robe ombros */}
    <path d="M8 100 Q18 72 32 67 Q40 76 50 78 Q60 76 68 67 Q82 72 92 100 Z" fill="#1e0a2e"/>
    <path d="M32 67 Q28 78 20 88" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    <path d="M68 67 Q72 78 80 88" stroke="#be29ec" strokeWidth="0.8" opacity="0.5"/>
    {/* Colarinho do manto */}
    <path d="M36 67 Q50 62 64 67 Q60 72 50 74 Q40 72 36 67 Z" fill="#2e1040" stroke="#be29ec" strokeWidth="0.6"/>
    {/* Cristal no pescoço */}
    <polygon points="50,65 53,70 50,75 47,70" fill="#be29ec" opacity="0.9" filter="url(#cglow)"/>
    <line x1="50" y1="60" x2="50" y2="65" stroke="#be29ec" strokeWidth="0.8" opacity="0.7"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="19" fill="#c8925a"/>
    {/* Capuz mágico atrás */}
    <path d="M33 32 Q50 14 67 32 Q64 28 50 18 Q36 28 33 32" fill="#2a0a3e"/>
    {/* Cabelo flutuante */}
    <path d="M33 35 Q28 28 30 20 Q35 26 33 35" fill="#1a0828" stroke="#be29ec" strokeWidth="0.3" opacity="0.6"/>
    <path d="M67 35 Q72 28 70 20 Q65 26 67 35" fill="#1a0828" stroke="#be29ec" strokeWidth="0.3" opacity="0.6"/>
    <path d="M33 35 Q36 22 50 20 Q64 22 67 35" fill="#1a0828"/>
    {/* Olhos mágicos */}
    <ellipse cx="41" cy="44" rx="6" ry="5" fill="#0e0418"/>
    <ellipse cx="59" cy="44" rx="6" ry="5" fill="#0e0418"/>
    <ellipse cx="41" cy="44" rx="4" ry="3.5" fill="#be29ec" opacity="0.9" filter="url(#cglow)"/>
    <ellipse cx="59" cy="44" rx="4" ry="3.5" fill="#be29ec" opacity="0.9" filter="url(#cglow)"/>
    <circle cx="41" cy="44" r="1.8" fill="#fff" opacity="0.95"/>
    <circle cx="59" cy="44" r="1.8" fill="#fff" opacity="0.95"/>
    <circle cx="40" cy="43" r="0.6" fill="#be29ec" opacity="0.8"/>
    <circle cx="58" cy="43" r="0.6" fill="#be29ec" opacity="0.8"/>
    {/* Boca */}
    <path d="M44 52 Q50 56 56 52" stroke="#9a5ab8" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Partículas mágicas */}
    {[[22,30],[78,28],[20,55],[80,52],[35,18],[65,17]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={1+i%2} fill="#be29ec" opacity={0.4+i*0.08} filter="url(#cglow)"/>
    ))}
    {/* Classe badge */}
    <rect x="2" y="2" width="28" height="10" rx="3" fill="#0e0418" stroke="#be29ec" strokeWidth="0.6"/>
    <text x="16" y="9.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#be29ec" fontFamily="monospace">ARQUITETA</text>
    <rect x="8" y="91" width="84" height="5" rx="2.5" fill="#0e0418" stroke="#be29ec" strokeWidth="0.4"/>
    <rect x="8" y="91" width="20" height="5" rx="2.5" fill="#be29ec" opacity="0.8"/>
    <text x="50" y="99" textAnchor="middle" fontSize="4.5" fill="#be29ec" opacity="0.6" fontFamily="monospace">ons ░░░░░░░░░░░░░░░░ LV.1</text>
  </svg>
)

// ── Tochiro — O Analista (Gestor de Tráfego) ────────────────────
const TochiroSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="tbg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#041e2e"/>
        <stop offset="100%" stopColor="#010810"/>
      </radialGradient>
      <filter id="tglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#tbg)"/>
    <ellipse cx="50" cy="88" rx="30" ry="10" fill="#22d3ee" opacity="0.12" filter="url(#tglow)"/>
    {/* Armadura tech */}
    <path d="M10 100 Q20 72 34 68 Q42 77 50 79 Q58 77 66 68 Q80 72 90 100 Z" fill="#051825"/>
    {/* Detalhes tech nos ombros */}
    <path d="M16 85 Q22 70 32 67" stroke="#22d3ee" strokeWidth="1" opacity="0.5"/>
    <path d="M84 85 Q78 70 68 67" stroke="#22d3ee" strokeWidth="1" opacity="0.5"/>
    <circle cx="30" cy="68" r="3" fill="#22d3ee" opacity="0.5" filter="url(#tglow)"/>
    <circle cx="70" cy="68" r="3" fill="#22d3ee" opacity="0.5" filter="url(#tglow)"/>
    {/* Colarinho */}
    <path d="M37 68 Q50 64 63 68 Q58 73 50 75 Q42 73 37 68 Z" fill="#061e2a" stroke="#22d3ee" strokeWidth="0.7"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="19" fill="#c8925a"/>
    {/* Capuz/elmo tech */}
    <path d="M33 34 Q50 18 67 34 L67 30 Q50 12 33 30 Z" fill="#051825" stroke="#22d3ee" strokeWidth="0.7"/>
    <rect x="33" y="28" width="34" height="10" rx="2" fill="#051825"/>
    {/* Antena lateral */}
    <line x1="67" y1="30" x2="76" y2="20" stroke="#22d3ee" strokeWidth="1" opacity="0.7"/>
    <circle cx="77" cy="19" r="2.5" fill="#22d3ee" filter="url(#tglow)"/>
    {/* Monóculo/visor */}
    <circle cx="41" cy="44" r="8" fill="#041018" stroke="#22d3ee" strokeWidth="1"/>
    <circle cx="41" cy="44" r="5.5" fill="#22d3ee" opacity="0.15"/>
    <circle cx="41" cy="44" r="3.5" fill="#22d3ee" opacity="0.5" filter="url(#tglow)"/>
    <circle cx="41" cy="44" r="1.5" fill="#fff"/>
    <line x1="47" y1="41" x2="50" y2="39" stroke="#22d3ee" strokeWidth="0.8" opacity="0.6"/>
    {/* Olho normal */}
    <ellipse cx="59" cy="44" rx="5.5" ry="4.5" fill="#0a1820"/>
    <circle cx="59" cy="44" r="3" fill="#22d3ee" opacity="0.7" filter="url(#tglow)"/>
    <circle cx="59" cy="44" r="1.5" fill="#fff"/>
    {/* Boca */}
    <path d="M44 53 Q50 57 56 53" stroke="#1a8a9a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* Dados flutuando */}
    <text x="72" y="35" fontSize="5" fill="#22d3ee" opacity="0.5" fontFamily="monospace">01</text>
    <text x="16" y="40" fontSize="5" fill="#22d3ee" opacity="0.4" fontFamily="monospace">10</text>
    {/* Classe badge */}
    <rect x="2" y="2" width="26" height="10" rx="3" fill="#041018" stroke="#22d3ee" strokeWidth="0.6"/>
    <text x="15" y="9.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">ANALISTA</text>
    <rect x="8" y="91" width="84" height="5" rx="2.5" fill="#041018" stroke="#22d3ee" strokeWidth="0.4"/>
    <rect x="8" y="91" width="20" height="5" rx="2.5" fill="#22d3ee" opacity="0.8"/>
    <text x="50" y="99" textAnchor="middle" fontSize="4.5" fill="#22d3ee" opacity="0.6" fontFamily="monospace">ons ░░░░░░░░░░░░░░░░ LV.1</text>
  </svg>
)

// ── Ana — A Criadora (Social Media) ─────────────────────────────
const AnaSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="abg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#2e0a1e"/>
        <stop offset="100%" stopColor="#0a0208"/>
      </radialGradient>
      <filter id="aglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#abg)"/>
    <ellipse cx="50" cy="88" rx="30" ry="10" fill="#ec4899" opacity="0.15" filter="url(#aglow)"/>
    {/* Roupa criativa */}
    <path d="M10 100 Q20 74 34 70 Q42 79 50 81 Q58 79 66 70 Q80 74 90 100 Z" fill="#1e0814"/>
    <path d="M34 70 Q30 80 24 90" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
    <path d="M66 70 Q70 80 76 90" stroke="#ec4899" strokeWidth="1" opacity="0.4"/>
    {/* Estrelas no manto */}
    {[[25,80],[75,78],[20,90],[80,88]].map(([x,y],i)=>(
      <polygon key={i} points={`${x},${y-3} ${x+1},${y} ${x+3},${y} ${x+1.5},${y+1.5} ${x+2},${y+3.5} ${x},${y+2} ${x-2},${y+3.5} ${x-1.5},${y+1.5} ${x-3},${y} ${x-1},${y}`}
        fill="#ec4899" opacity="0.5" filter="url(#aglow)"/>
    ))}
    {/* Gema no peito */}
    <polygon points="50,72 54,77 50,82 46,77" fill="#ec4899" opacity="0.9" filter="url(#aglow)"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="19" fill="#c8925a"/>
    {/* Cabelo estilizado */}
    <path d="M33 36 Q50 16 67 36" fill="#1a0812"/>
    <path d="M33 36 Q30 26 33 18 Q38 26 36 36" fill="#1a0812"/>
    <path d="M67 36 Q70 26 67 18 Q62 26 64 36" fill="#1a0812"/>
    {/* Reflexo cabelo */}
    <path d="M38 22 Q50 18 62 22" stroke="#ec4899" strokeWidth="0.6" opacity="0.4" fill="none"/>
    {/* Tiara */}
    <path d="M36 34 Q50 28 64 34" stroke="#ec4899" strokeWidth="1.5" fill="none" opacity="0.8"/>
    <polygon points="50,26 52,30 50,34 48,30" fill="#ec4899" filter="url(#aglow)"/>
    {/* Olhos grandes expressivos */}
    <ellipse cx="41" cy="45" rx="7" ry="6" fill="#0e0408"/>
    <ellipse cx="59" cy="45" rx="7" ry="6" fill="#0e0408"/>
    <ellipse cx="41" cy="45" rx="5" ry="4.5" fill="#ec4899" opacity="0.3"/>
    <ellipse cx="59" cy="45" rx="5" ry="4.5" fill="#ec4899" opacity="0.3"/>
    <circle cx="41" cy="45" r="3.5" fill="#1a0812"/>
    <circle cx="59" cy="45" r="3.5" fill="#1a0812"/>
    <circle cx="41" cy="45" r="2" fill="#2a1020"/>
    <circle cx="59" cy="45" r="2" fill="#2a1020"/>
    <circle cx="39.5" cy="43.5" r="1.2" fill="#fff" opacity="0.9"/>
    <circle cx="57.5" cy="43.5" r="1.2" fill="#fff" opacity="0.9"/>
    {/* Cílios */}
    <line x1="35" y1="41" x2="37" y2="39" stroke="#1a0812" strokeWidth="1"/>
    <line x1="38" y1="40" x2="39" y2="38" stroke="#1a0812" strokeWidth="1"/>
    <line x1="53" y1="41" x2="55" y2="39" stroke="#1a0812" strokeWidth="1"/>
    <line x1="56" y1="40" x2="57" y2="38" stroke="#1a0812" strokeWidth="1"/>
    {/* Bochechas rosadas */}
    <ellipse cx="36" cy="50" rx="4" ry="2.5" fill="#ec4899" opacity="0.2"/>
    <ellipse cx="64" cy="50" rx="4" ry="2.5" fill="#ec4899" opacity="0.2"/>
    {/* Boca sorridente */}
    <path d="M43 54 Q50 59 57 54" stroke="#ec4899" strokeWidth="2" fill="none" strokeLinecap="round"/>
    {/* Sparkles flutuantes */}
    {[[18,25],[82,30],[15,60],[85,55],[30,10],[70,12]].map(([x,y],i)=>(
      <text key={i} x={x} y={y} fontSize="8" fill="#ec4899" opacity={0.3+i*0.06} filter="url(#aglow)">✦</text>
    ))}
    {/* Classe badge */}
    <rect x="2" y="2" width="26" height="10" rx="3" fill="#0e0408" stroke="#ec4899" strokeWidth="0.6"/>
    <text x="15" y="9.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#ec4899" fontFamily="monospace">CRIADORA</text>
    <rect x="8" y="91" width="84" height="5" rx="2.5" fill="#0e0408" stroke="#ec4899" strokeWidth="0.4"/>
    <rect x="8" y="91" width="20" height="5" rx="2.5" fill="#ec4899" opacity="0.8"/>
    <text x="50" y="99" textAnchor="middle" fontSize="4.5" fill="#ec4899" opacity="0.6" fontFamily="monospace">ons ░░░░░░░░░░░░░░░░ LV.1</text>
  </svg>
)

// ── ADM — O Guardião (Atendimento) ──────────────────────────────
const AdmSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="dbg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#2e1a04"/>
        <stop offset="100%" stopColor="#0a0602"/>
      </radialGradient>
      <filter id="dglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#dbg)"/>
    <ellipse cx="50" cy="88" rx="30" ry="10" fill="#f59e0b" opacity="0.15" filter="url(#dglow)"/>
    {/* Armadura pesada */}
    <path d="M6 100 Q16 70 30 66 Q40 76 50 78 Q60 76 70 66 Q84 70 94 100 Z" fill="#1e1204"/>
    {/* Escudo lateral esq */}
    <path d="M8 88 Q14 72 26 68 Q22 78 16 90 Z" fill="#2e1a06" stroke="#f59e0b" strokeWidth="0.7"/>
    {/* Escudo lateral dir */}
    <path d="M92 88 Q86 72 74 68 Q78 78 84 90 Z" fill="#2e1a06" stroke="#f59e0b" strokeWidth="0.7"/>
    {/* Detalhes armadura */}
    <path d="M30 66 Q26 76 22 84" stroke="#f59e0b" strokeWidth="1" opacity="0.5"/>
    <path d="M70 66 Q74 76 78 84" stroke="#f59e0b" strokeWidth="1" opacity="0.5"/>
    {/* Emblema no peito */}
    <polygon points="50,72 56,76 54,82 50,80 46,82 44,76" fill="#f59e0b" opacity="0.9" filter="url(#dglow)"/>
    {/* Colarinho armadura */}
    <path d="M36 66 Q50 60 64 66 Q58 72 50 74 Q42 72 36 66 Z" fill="#2a1608" stroke="#f59e0b" strokeWidth="0.8"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="19" fill="#c8925a"/>
    {/* Elmo aberto */}
    <path d="M33 34 Q50 16 67 34 L67 30 Q50 10 33 30 Z" fill="#1e1204" stroke="#f59e0b" strokeWidth="0.8"/>
    <rect x="33" y="28" width="34" height="10" rx="2" fill="#1e1204" stroke="#f59e0b" strokeWidth="0.5"/>
    {/* Viseira do elmo */}
    <path d="M33 38 Q50 33 67 38" stroke="#f59e0b" strokeWidth="1.2" fill="none" opacity="0.7"/>
    {/* Ornamento topo elmo */}
    <path d="M44 20 Q50 14 56 20" stroke="#f59e0b" strokeWidth="2" fill="none" filter="url(#dglow)"/>
    <circle cx="50" cy="14" r="3" fill="#f59e0b" filter="url(#dglow)"/>
    {/* Olhos sólidos confiantes */}
    <ellipse cx="41" cy="45" rx="6" ry="5" fill="#0e0802"/>
    <ellipse cx="59" cy="45" rx="6" ry="5" fill="#0e0802"/>
    <ellipse cx="41" cy="45" rx="4" ry="3.5" fill="#f59e0b" opacity="0.8" filter="url(#dglow)"/>
    <ellipse cx="59" cy="45" rx="4" ry="3.5" fill="#f59e0b" opacity="0.8" filter="url(#dglow)"/>
    <circle cx="41" cy="45" r="2" fill="#fff" opacity="0.9"/>
    <circle cx="59" cy="45" r="2" fill="#fff" opacity="0.9"/>
    {/* Sobrancelha séria */}
    <rect x="35" y="38" width="12" height="2.5" rx="1.2" fill="#2e1604" opacity="0.8"/>
    <rect x="53" y="38" width="12" height="2.5" rx="1.2" fill="#2e1604" opacity="0.8"/>
    {/* Boca firme */}
    <rect x="43" y="53" width="14" height="2.5" rx="1.2" fill="#a06828" opacity="0.8"/>
    {/* Classe badge */}
    <rect x="2" y="2" width="26" height="10" rx="3" fill="#0e0802" stroke="#f59e0b" strokeWidth="0.6"/>
    <text x="15" y="9.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">GUARDIÃO</text>
    <rect x="8" y="91" width="84" height="5" rx="2.5" fill="#0e0802" stroke="#f59e0b" strokeWidth="0.4"/>
    <rect x="8" y="91" width="20" height="5" rx="2.5" fill="#f59e0b" opacity="0.8"/>
    <text x="50" y="99" textAnchor="middle" fontSize="4.5" fill="#f59e0b" opacity="0.6" fontFamily="monospace">ons ░░░░░░░░░░░░░░░░ LV.1</text>
  </svg>
)

// ── Juliano — O Caçador (Vendas) ─────────────────────────────────
const JulianoSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="jbg" cx="50%" cy="30%" r="80%">
        <stop offset="0%" stopColor="#140a2e"/>
        <stop offset="100%" stopColor="#060210"/>
      </radialGradient>
      <filter id="jglow"><feGaussianBlur stdDeviation="3" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#jbg)"/>
    <ellipse cx="50" cy="88" rx="30" ry="10" fill="#a78bfa" opacity="0.15" filter="url(#jglow)"/>
    {/* Capa do caçador */}
    <path d="M8 100 Q18 72 32 68 Q40 77 50 79 Q60 77 68 68 Q82 72 92 100 Z" fill="#0e0820"/>
    <path d="M32 68 Q24 80 18 94" stroke="#a78bfa" strokeWidth="1.2" opacity="0.5"/>
    <path d="M68 68 Q76 80 82 94" stroke="#a78bfa" strokeWidth="1.2" opacity="0.5"/>
    {/* Correntes/acessórios */}
    <line x1="38" y1="72" x2="32" y2="82" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2"/>
    <line x1="62" y1="72" x2="68" y2="82" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 2"/>
    {/* Mira no peito */}
    <circle cx="50" cy="74" r="4" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>
    <circle cx="50" cy="74" r="1.5" fill="#a78bfa" opacity="0.8" filter="url(#jglow)"/>
    <line x1="50" y1="69" x2="50" y2="70.5" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    <line x1="50" y1="77.5" x2="50" y2="79" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    <line x1="45" y1="74" x2="46.5" y2="74" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    <line x1="53.5" y1="74" x2="55" y2="74" stroke="#a78bfa" strokeWidth="0.8" opacity="0.6"/>
    {/* Colarinho */}
    <path d="M37 68 Q50 63 63 68 Q58 73 50 75 Q42 73 37 68 Z" fill="#140830" stroke="#a78bfa" strokeWidth="0.7"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="19" fill="#c8925a"/>
    {/* Capuz caçador */}
    <path d="M33 36 Q50 16 67 36 Q64 30 50 20 Q36 30 33 36" fill="#0e0820"/>
    <path d="M33 36 Q30 28 32 20" fill="#0e0820"/>
    <path d="M67 36 Q70 28 68 20" fill="#0e0820"/>
    {/* Sombra capuz sobre testa */}
    <path d="M34 38 Q50 32 66 38" fill="#0e0820" opacity="0.5"/>
    {/* Olhos — mira */}
    <ellipse cx="41" cy="44" rx="6.5" ry="5.5" fill="#080416"/>
    <ellipse cx="59" cy="44" rx="6.5" ry="5.5" fill="#080416"/>
    <circle cx="41" cy="44" r="4" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>
    <circle cx="59" cy="44" r="4" fill="none" stroke="#a78bfa" strokeWidth="1" opacity="0.7"/>
    <circle cx="41" cy="44" r="2.5" fill="#a78bfa" opacity="0.85" filter="url(#jglow)"/>
    <circle cx="59" cy="44" r="2.5" fill="#a78bfa" opacity="0.85" filter="url(#jglow)"/>
    <circle cx="41" cy="44" r="1.2" fill="#fff" opacity="0.95"/>
    <circle cx="59" cy="44" r="1.2" fill="#fff" opacity="0.95"/>
    {/* Linha de mira */}
    <line x1="34" y1="44" x2="36" y2="44" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5"/>
    <line x1="46" y1="44" x2="53" y2="44" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5"/>
    <line x1="64" y1="44" x2="66" y2="44" stroke="#a78bfa" strokeWidth="0.6" opacity="0.5"/>
    {/* Boca — sorriso confiante */}
    <path d="M43 53 Q50 58 57 53" stroke="#7a5ab8" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* Pontos de mira flutuando */}
    {[[18,22],[82,20],[14,55],[86,58]].map(([x,y],i)=>(
      <circle key={i} cx={x} cy={y} r="1.5" fill="none" stroke="#a78bfa" strokeWidth="0.8" opacity="0.4"/>
    ))}
    {/* Classe badge */}
    <rect x="2" y="2" width="24" height="10" rx="3" fill="#080416" stroke="#a78bfa" strokeWidth="0.6"/>
    <text x="14" y="9.5" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#a78bfa" fontFamily="monospace">CAÇADOR</text>
    <rect x="8" y="91" width="84" height="5" rx="2.5" fill="#080416" stroke="#a78bfa" strokeWidth="0.4"/>
    <rect x="8" y="91" width="20" height="5" rx="2.5" fill="#a78bfa" opacity="0.8"/>
    <text x="50" y="99" textAnchor="middle" fontSize="4.5" fill="#a78bfa" opacity="0.6" fontFamily="monospace">ons ░░░░░░░░░░░░░░░░ LV.1</text>
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
