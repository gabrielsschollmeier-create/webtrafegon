// Avatares estilo Free Fire — personagens por cargo
// Cada membro tem identidade visual única: fundo escuro, cor vibrante, acessório de função

// ── Gabriel — O Estrategista (Administrador) ───────────────────────
const GabrielSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="gb" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#1e4010"/><stop offset="100%" stopColor="#050d02"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#gb)"/>
    {/* aura */}
    <ellipse cx="50" cy="78" rx="30" ry="10" fill="#6eda2c" opacity="0.18"/>
    {/* corpo */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#162808"/>
    <path d="M38 70 L38 88 Q50 92 62 88 L62 70 Q56 76 50 77 Q44 76 38 70Z" fill="#1f3a0e"/>
    <line x1="43" y1="72" x2="43" y2="87" stroke="#6eda2c" strokeWidth="1.2" opacity="0.8"/>
    <line x1="57" y1="72" x2="57" y2="87" stroke="#6eda2c" strokeWidth="1.2" opacity="0.8"/>
    {/* emblema ON */}
    <rect x="43" y="76" width="14" height="8" rx="2.5" fill="#0a1505" stroke="#6eda2c" strokeWidth="1"/>
    <text x="50" y="82.5" textAnchor="middle" fontSize="5" fontWeight="900" fill="#6eda2c" fontFamily="monospace">ON</text>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#c8925a"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="18" ry="20" fill="#1e4010"/>
    <ellipse cx="50" cy="42" rx="15" ry="17" fill="#c8925a"/>
    {/* cabelo curto */}
    <path d="M35 35 Q35 20 50 19 Q65 20 65 35 L63 33 Q55 24 50 23 Q45 24 37 33Z" fill="#1a0f06"/>
    <path d="M35 35 L37 33 L37 36Z" fill="#1a0f06"/>
    <path d="M65 35 L63 33 L63 36Z" fill="#1a0f06"/>
    {/* visor HUD */}
    <rect x="33" y="38" width="34" height="11" rx="3" fill="#081503" opacity="0.92"/>
    <rect x="35" y="39.5" width="13" height="8" rx="2" fill="#6eda2c" opacity="0.25"/>
    <rect x="52" y="39.5" width="13" height="8" rx="2" fill="#6eda2c" opacity="0.25"/>
    <ellipse cx="41.5" cy="43.5" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9"/>
    <ellipse cx="58.5" cy="43.5" rx="5" ry="3.5" fill="#6eda2c" opacity="0.9"/>
    <ellipse cx="41.5" cy="43.5" rx="2" ry="1.5" fill="#fff" opacity="0.95"/>
    <ellipse cx="58.5" cy="43.5" rx="2" ry="1.5" fill="#fff" opacity="0.95"/>
    {/* nariz boca */}
    <path d="M48 51 Q50 54 52 51" stroke="#a06838" strokeWidth="1" fill="none"/>
    <path d="M44 57 Q50 61 56 57" stroke="#7a3a18" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    {/* badge cargo */}
    <rect x="1" y="2" width="28" height="9" rx="2.5" fill="#081505" stroke="#6eda2c" strokeWidth="0.7"/>
    <text x="15" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#6eda2c" fontFamily="monospace">ADMIN</text>
    {/* placa nome */}
    <rect x="0" y="88" width="100" height="12" fill="#050d02" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#6eda2c" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#6eda2c" fontFamily="sans-serif" letterSpacing="0.5">GABRIEL</text>
  </svg>
)

// ── Carol — A Arquiteta (Administradora) ──────────────────────────
const CarolSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ca" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#2a0a3e"/><stop offset="100%" stopColor="#08020f"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#ca)"/>
    <ellipse cx="50" cy="78" rx="28" ry="9" fill="#be29ec" opacity="0.18"/>
    {/* corpo blazer */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#1e0a2e"/>
    <path d="M36 68 L42 74 L50 76 L58 74 L64 68 L64 100 L36 100Z" fill="#280f3e"/>
    {/* lapela blazer */}
    <path d="M42 74 L38 68 L44 66 L50 70Z" fill="#1e0a2e" stroke="#be29ec" strokeWidth="0.5"/>
    <path d="M58 74 L62 68 L56 66 L50 70Z" fill="#1e0a2e" stroke="#be29ec" strokeWidth="0.5"/>
    {/* badge hexagonal */}
    <polygon points="50,74 54,76 54,80 50,82 46,80 46,76" fill="#0f0518" stroke="#be29ec" strokeWidth="1"/>
    <text x="50" y="79.5" textAnchor="middle" fontSize="4" fill="#be29ec" fontWeight="bold">✦</text>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#e8b882"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#2a0a3e"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#e8b882"/>
    {/* cabelo bob escuro */}
    <path d="M34 44 Q33 24 50 21 Q67 24 66 44 L64 42 Q62 26 50 24 Q38 26 36 42Z" fill="#1a0a0a"/>
    <path d="M34 44 L34 56 Q34 60 38 60 L38 44Z" fill="#1a0a0a"/>
    <path d="M66 44 L66 56 Q66 60 62 60 L62 44Z" fill="#1a0a0a"/>
    {/* óculos finos */}
    <rect x="34" y="40" width="13" height="8" rx="3" fill="none" stroke="#be29ec" strokeWidth="1.5"/>
    <rect x="53" y="40" width="13" height="8" rx="3" fill="none" stroke="#be29ec" strokeWidth="1.5"/>
    <line x1="47" y1="44" x2="53" y2="44" stroke="#be29ec" strokeWidth="1.2"/>
    <line x1="34" y1="44" x2="31" y2="43" stroke="#be29ec" strokeWidth="1.2"/>
    <line x1="66" y1="44" x2="69" y2="43" stroke="#be29ec" strokeWidth="1.2"/>
    {/* olhos atrás dos óculos */}
    <ellipse cx="40.5" cy="44" rx="3.5" ry="2.5" fill="#be29ec" opacity="0.8"/>
    <ellipse cx="59.5" cy="44" rx="3.5" ry="2.5" fill="#be29ec" opacity="0.8"/>
    <ellipse cx="40.5" cy="44" rx="1.5" ry="1.2" fill="#fff" opacity="0.9"/>
    <ellipse cx="59.5" cy="44" rx="1.5" ry="1.2" fill="#fff" opacity="0.9"/>
    <path d="M48 51 Q50 54 52 51" stroke="#b07840" strokeWidth="1" fill="none"/>
    <path d="M44 57 Q50 61 56 57" stroke="#8a5830" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="28" height="9" rx="2.5" fill="#0f0320" stroke="#be29ec" strokeWidth="0.7"/>
    <text x="15" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#be29ec" fontFamily="monospace">ADMIN</text>
    <rect x="0" y="88" width="100" height="12" fill="#08020f" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#be29ec" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#be29ec" fontFamily="sans-serif" letterSpacing="0.5">CAROL</text>
  </svg>
)

// ── Tochiro — O Navegador (Gestor de Tráfego) ────────────────────
const TochiroSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="to" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#041e22"/><stop offset="100%" stopColor="#010809"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#to)"/>
    <ellipse cx="50" cy="78" rx="28" ry="9" fill="#22d3ee" opacity="0.18"/>
    {/* corpo jaqueta de piloto */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#061820"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#0a2030"/>
    {/* patch Meta */}
    <rect x="38" y="74" width="9" height="6" rx="1.5" fill="#1877f2" opacity="0.9"/>
    <text x="42.5" y="79" textAnchor="middle" fontSize="4" fill="#fff" fontWeight="bold">f</text>
    {/* patch Google */}
    <rect x="53" y="74" width="9" height="6" rx="1.5" fill="#fff" opacity="0.9"/>
    <text x="57.5" y="79" textAnchor="middle" fontSize="3.5" fill="#4285f4" fontWeight="bold">G</text>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#d4a574"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#041e22"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#d4a574"/>
    {/* cabelo escuro + headband */}
    <path d="M35 36 Q35 20 50 19 Q65 20 65 36 L63 33 Q55 24 50 23 Q45 24 37 33Z" fill="#0f0805"/>
    <rect x="33" y="34" width="34" height="5" rx="2" fill="#0a2030" stroke="#22d3ee" strokeWidth="0.8"/>
    {/* headset fone esquerdo */}
    <path d="M33 42 Q28 42 27 46 Q26 50 28 52 Q30 54 34 53" fill="none" stroke="#22d3ee" strokeWidth="2" strokeLinecap="round"/>
    <ellipse cx="28" cy="47" rx="4" ry="5" fill="#0a2030" stroke="#22d3ee" strokeWidth="1"/>
    {/* olhos cyan */}
    <ellipse cx="41" cy="44" rx="5.5" ry="3.5" fill="#22d3ee" opacity="0.9"/>
    <ellipse cx="59" cy="44" rx="5.5" ry="3.5" fill="#22d3ee" opacity="0.9"/>
    <ellipse cx="41" cy="44" rx="2.5" ry="1.8" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="44" rx="2.5" ry="1.8" fill="#fff" opacity="0.95"/>
    <ellipse cx="41" cy="44" rx="1" ry="1" fill="#041e22"/>
    <ellipse cx="59" cy="44" rx="1" ry="1" fill="#041e22"/>
    <path d="M48 51 Q50 54 52 51" stroke="#a07848" strokeWidth="1" fill="none"/>
    <path d="M44 57 Q50 61 56 57" stroke="#7a5828" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="32" height="9" rx="2.5" fill="#020c10" stroke="#22d3ee" strokeWidth="0.7"/>
    <text x="17" y="8.5" textAnchor="middle" fontSize="3.8" fontWeight="bold" fill="#22d3ee" fontFamily="monospace">TRÁFEGO</text>
    <rect x="0" y="88" width="100" height="12" fill="#010809" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#22d3ee" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#22d3ee" fontFamily="sans-serif" letterSpacing="0.5">TOCHIRO</text>
  </svg>
)

// ── Ana — A Faísca (Estagiária Social Media) ──────────────────────
const AnaSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="an" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#2a0420"/><stop offset="100%" stopColor="#0a010a"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#an)"/>
    {/* sparkles */}
    <text x="18" y="22" fontSize="7" opacity="0.7">✦</text>
    <text x="76" y="28" fontSize="5" opacity="0.5">✦</text>
    <text x="82" y="60" fontSize="4" opacity="0.4">★</text>
    <text x="12" y="55" fontSize="4" opacity="0.4">★</text>
    <ellipse cx="50" cy="78" rx="26" ry="8" fill="#ec4899" opacity="0.18"/>
    {/* corpo casual */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#1e0414"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#2a0820"/>
    {/* detalhe colorido na roupa */}
    <line x1="43" y1="70" x2="43" y2="86" stroke="#ec4899" strokeWidth="1.5" opacity="0.6"/>
    <line x1="57" y1="70" x2="57" y2="86" stroke="#ec4899" strokeWidth="1.5" opacity="0.6"/>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#d4956a"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#2a0420"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#d4956a"/>
    {/* cabelo solto animado */}
    <path d="M34 38 Q32 20 50 19 Q68 20 66 38 L63 32 Q56 23 50 22 Q44 23 37 32Z" fill="#1a0808"/>
    <path d="M34 38 L33 55 Q33 62 36 63 L37 55 L36 38Z" fill="#1a0808"/>
    <path d="M66 38 L67 50 Q67 58 64 60 L63 52 L64 38Z" fill="#1a0808"/>
    {/* mecha colorida */}
    <path d="M33 44 L32 55" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
    {/* FONE GRANDE — elemento mais distintivo */}
    <path d="M31 40 Q28 40 27 44 Q26 49 28 52 Q30 55 33 54" fill="none" stroke="#333" strokeWidth="2.5"/>
    <ellipse cx="27.5" cy="46.5" rx="5" ry="6" fill="#ec4899"/>
    <ellipse cx="27.5" cy="46.5" rx="3" ry="4" fill="#2a0420"/>
    <path d="M69 40 Q72 40 73 44 Q74 49 72 52 Q70 55 67 54" fill="none" stroke="#333" strokeWidth="2.5"/>
    <ellipse cx="72.5" cy="46.5" rx="5" ry="6" fill="#ec4899"/>
    <ellipse cx="72.5" cy="46.5" rx="3" ry="4" fill="#2a0420"/>
    {/* arco do fone */}
    <path d="M32 35 Q50 28 68 35" fill="none" stroke="#ec4899" strokeWidth="3" strokeLinecap="round"/>
    {/* olhos grandes expressivos */}
    <ellipse cx="41" cy="44" rx="5.5" ry="4" fill="#ec4899" opacity="0.85"/>
    <ellipse cx="59" cy="44" rx="5.5" ry="4" fill="#ec4899" opacity="0.85"/>
    <ellipse cx="41" cy="44" rx="3" ry="2.5" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="44" rx="3" ry="2.5" fill="#fff" opacity="0.95"/>
    <ellipse cx="41.5" cy="44" rx="1.5" ry="1.5" fill="#1a0408"/>
    <ellipse cx="59.5" cy="44" rx="1.5" ry="1.5" fill="#1a0408"/>
    <path d="M48 51 Q50 54 52 51" stroke="#a06040" strokeWidth="1" fill="none"/>
    <path d="M44 57 Q50 62 56 57" stroke="#c08060" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="28" height="9" rx="2.5" fill="#0a010a" stroke="#ec4899" strokeWidth="0.7"/>
    <text x="15" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#ec4899" fontFamily="monospace">INTERN</text>
    <rect x="0" y="88" width="100" height="12" fill="#0a010a" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#ec4899" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#ec4899" fontFamily="sans-serif" letterSpacing="0.5">ANA</text>
  </svg>
)

// ── Beatriz — A Diretora (Social Media) ──────────────────────────
const BeatrizSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bz" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#2a1004"/><stop offset="100%" stopColor="#0a0401"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bz)"/>
    <ellipse cx="50" cy="78" rx="28" ry="9" fill="#f97316" opacity="0.18"/>
    {/* corpo jaqueta editorial */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#1e0c04"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#2a1208"/>
    {/* tira de câmera no pescoço */}
    <path d="M38 68 L44 76 L50 78" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    <path d="M62 68 L56 76 L50 78" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" opacity="0.8"/>
    {/* lente câmera no peito */}
    <circle cx="50" cy="82" r="5" fill="#0a0401" stroke="#f97316" strokeWidth="1.2"/>
    <circle cx="50" cy="82" r="3" fill="#1a0a04" stroke="#f97316" strokeWidth="0.7"/>
    <circle cx="50" cy="82" r="1.2" fill="#f97316" opacity="0.8"/>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#c07040"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#2a1004"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#c07040"/>
    {/* coque alto */}
    <ellipse cx="50" cy="23" rx="9" ry="7" fill="#1a0808"/>
    <path d="M35 35 Q35 26 41 23 L43 26 Q38 28 38 35Z" fill="#1a0808"/>
    <path d="M65 35 Q65 26 59 23 L57 26 Q62 28 62 35Z" fill="#1a0808"/>
    <rect x="44" y="19" width="12" height="5" rx="2.5" fill="#f97316" opacity="0.6"/>
    {/* olhos expressivos */}
    <ellipse cx="41" cy="43" rx="5" ry="3.5" fill="#f97316" opacity="0.85"/>
    <ellipse cx="59" cy="43" rx="5" ry="3.5" fill="#f97316" opacity="0.85"/>
    <ellipse cx="41" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="41.5" cy="43" rx="1.2" ry="1.2" fill="#1a0408"/>
    <ellipse cx="59.5" cy="43" rx="1.2" ry="1.2" fill="#1a0408"/>
    {/* sobrancelhas marcadas */}
    <path d="M37 39 Q41 37.5 45 39" stroke="#1a0808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M55 39 Q59 37.5 63 39" stroke="#1a0808" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M48 50 Q50 53 52 50" stroke="#904820" strokeWidth="1" fill="none"/>
    <path d="M44 56 Q50 61 56 56" stroke="#c07850" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="30" height="9" rx="2.5" fill="#0a0401" stroke="#f97316" strokeWidth="0.7"/>
    <text x="16" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#f97316" fontFamily="monospace">SOCIAL</text>
    <rect x="0" y="88" width="100" height="12" fill="#0a0401" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#f97316" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#f97316" fontFamily="sans-serif" letterSpacing="0.5">BEATRIZ</text>
  </svg>
)

// ── Juliano — O Caçador (SDR) ─────────────────────────────────────
const JulianoSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="ju" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#150a28"/><stop offset="100%" stopColor="#05020f"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#ju)"/>
    <ellipse cx="50" cy="78" rx="28" ry="9" fill="#a78bfa" opacity="0.18"/>
    {/* corpo terno */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#110820"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#1a1030"/>
    {/* gravata */}
    <path d="M48 70 L50 76 L52 70 L51 67 L49 67Z" fill="#a78bfa"/>
    <path d="M48 70 L46 68 L49 67Z" fill="#8060e0"/>
    <path d="M52 70 L54 68 L51 67Z" fill="#8060e0"/>
    {/* colarinho branco */}
    <path d="M43 66 L38 68 L42 72 L50 70Z" fill="#e8e4f4"/>
    <path d="M57 66 L62 68 L58 72 L50 70Z" fill="#e8e4f4"/>
    {/* fone auricular SDR */}
    <path d="M66 44 Q70 44 71 47 Q72 50 70 52" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round"/>
    <circle cx="71" cy="48" r="3" fill="#1a1030" stroke="#a78bfa" strokeWidth="1"/>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#c8a070"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#150a28"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#c8a070"/>
    {/* cabelo penteado */}
    <path d="M35 35 Q35 20 50 19 Q65 20 65 35 L63 32 Q56 22 50 21 Q44 22 37 32Z" fill="#0f0805"/>
    {/* risco no cabelo */}
    <line x1="50" y1="21" x2="50" y2="30" stroke="#1a1030" strokeWidth="1.5"/>
    {/* olhos confiantes */}
    <ellipse cx="41" cy="43" rx="5" ry="3.5" fill="#a78bfa" opacity="0.85"/>
    <ellipse cx="59" cy="43" rx="5" ry="3.5" fill="#a78bfa" opacity="0.85"/>
    <ellipse cx="41" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="41.5" cy="43" rx="1.2" ry="1.2" fill="#150a28"/>
    <ellipse cx="59.5" cy="43" rx="1.2" ry="1.2" fill="#150a28"/>
    {/* sobrancelha mais séria */}
    <path d="M36 39 Q41 37 45 39" stroke="#0f0805" strokeWidth="1.8" fill="none"/>
    <path d="M55 39 Q59 37 64 39" stroke="#0f0805" strokeWidth="1.8" fill="none"/>
    <path d="M48 50 Q50 53 52 50" stroke="#906030" strokeWidth="1" fill="none"/>
    <path d="M44 56 Q50 60 56 56" stroke="#a07040" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    {/* target badge */}
    <circle cx="88" cy="15" r="7" fill="#110820" stroke="#a78bfa" strokeWidth="0.8"/>
    <circle cx="88" cy="15" r="4.5" fill="none" stroke="#a78bfa" strokeWidth="0.6"/>
    <circle cx="88" cy="15" r="1.5" fill="#a78bfa" opacity="0.9"/>
    <line x1="81" y1="15" x2="84" y2="15" stroke="#a78bfa" strokeWidth="0.7" opacity="0.7"/>
    <line x1="92" y1="15" x2="95" y2="15" stroke="#a78bfa" strokeWidth="0.7" opacity="0.7"/>
    <line x1="88" y1="8" x2="88" y2="11" stroke="#a78bfa" strokeWidth="0.7" opacity="0.7"/>
    <line x1="88" y1="19" x2="88" y2="22" stroke="#a78bfa" strokeWidth="0.7" opacity="0.7"/>
    <rect x="1" y="2" width="22" height="9" rx="2.5" fill="#05020f" stroke="#a78bfa" strokeWidth="0.7"/>
    <text x="12" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#a78bfa" fontFamily="monospace">SDR</text>
    <rect x="0" y="88" width="100" height="12" fill="#05020f" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#a78bfa" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#a78bfa" fontFamily="sans-serif" letterSpacing="0.5">JULIANO</text>
  </svg>
)

// ── ADM — O Fantasma (conta fantasma da agência) ─────────────────
const AdmSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="adm" cx="50%" cy="40%" r="70%">
        <stop offset="0%" stopColor="#141414"/><stop offset="100%" stopColor="#030303"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#adm)"/>
    {/* anéis fantasma */}
    <circle cx="50" cy="50" r="35" fill="none" stroke="#555" strokeWidth="0.5" opacity="0.3" strokeDasharray="3,4"/>
    <circle cx="50" cy="50" r="25" fill="none" stroke="#555" strokeWidth="0.5" opacity="0.2" strokeDasharray="2,3"/>
    {/* silhueta fantasma */}
    <path d="M30 85 Q28 65 30 55 Q32 42 50 38 Q68 42 70 55 Q72 65 70 85 Q65 80 60 85 Q55 80 50 85 Q45 80 40 85 Q35 80 30 85Z"
      fill="#1e1e1e" stroke="#444" strokeWidth="1" opacity="0.7"/>
    {/* olhos fantasma — só dois buracos */}
    <ellipse cx="41" cy="58" rx="5" ry="6" fill="#030303" opacity="0.9"/>
    <ellipse cx="59" cy="58" rx="5" ry="6" fill="#030303" opacity="0.9"/>
    {/* ponto de luz mínimo */}
    <ellipse cx="41" cy="57" rx="1.5" ry="1.5" fill="#666" opacity="0.5"/>
    <ellipse cx="59" cy="57" rx="1.5" ry="1.5" fill="#666" opacity="0.5"/>
    {/* ? centralizado */}
    <text x="50" y="52" textAnchor="middle" fontSize="16" fill="#444" fontWeight="bold" fontFamily="monospace" opacity="0.6">?</text>
    <rect x="1" y="2" width="22" height="9" rx="2.5" fill="#030303" stroke="#444" strokeWidth="0.7"/>
    <text x="12" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#555" fontFamily="monospace">ADM</text>
    <rect x="0" y="88" width="100" height="12" fill="#030303" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#444" strokeWidth="0.6" opacity="0.5"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#555" fontFamily="sans-serif" letterSpacing="0.5">???</text>
  </svg>
)

// ── Mapas de lookup ───────────────────────────────────────────────
export const AVATAR_BY_EMAIL = {
  'gabrielsschollmeier@gmail.com': GabrielSVG,
  'carolinepaganiadv@gmail.com':   CarolSVG,
  'gestaotrafegon@gmail.com':      TochiroSVG,
  'socialmediatrafegon@gmail.com': AnaSVG,
  'beatriz@trafegon.com':          BeatrizSVG,
  'atendimentotrafegon@gmail.com': AdmSVG,
  'trafegonvendas@gmail.com':      JulianoSVG,
}

export const AVATAR_BY_ID = {
  gs:       GabrielSVG,
  carol:    CarolSVG,
  tochiro:  TochiroSVG,
  ana_sm:   AnaSVG,
  beatriz:  BeatrizSVG,
  adm_at:   AdmSVG,
  juliano:  JulianoSVG,
}

export function getAvatarComponent(identifier) {
  if (!identifier) return null
  return AVATAR_BY_EMAIL[identifier] || AVATAR_BY_ID[identifier] || null
}
