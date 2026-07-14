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

// ── Érica — Atendimento ───────────────────────────────────────────
const EricaSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="er" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#2a1400"/><stop offset="100%" stopColor="#0d0600"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#er)"/>
    {/* aura âmbar */}
    <ellipse cx="50" cy="78" rx="30" ry="10" fill="#f59e0b" opacity="0.15"/>
    {/* brilhos decorativos */}
    <circle cx="15" cy="18" r="2" fill="#f59e0b" opacity="0.35"/>
    <circle cx="83" cy="22" r="1.5" fill="#f59e0b" opacity="0.28"/>
    <circle cx="80" cy="68" r="1.2" fill="#f59e0b" opacity="0.22"/>
    {/* corpo — blusa profissional */}
    <path d="M14 100 Q24 68 36 64 Q43 72 50 74 Q57 72 64 64 Q76 68 86 100Z" fill="#1a0c00"/>
    <path d="M36 66 L50 74 L64 66 L64 100 L36 100Z" fill="#221200"/>
    {/* detalhe colarinho */}
    <path d="M43 66 Q50 70 57 66 L57 72 Q50 76 43 72Z" fill="#2a1600" stroke="#f59e0b" strokeWidth="0.5" opacity="0.6"/>
    {/* pescoço */}
    <rect x="44" y="61" width="12" height="8" rx="3" fill="#c8925a"/>
    {/* cabeça */}
    <ellipse cx="50" cy="43" rx="18" ry="20" fill="#2a1600"/>
    <ellipse cx="50" cy="41" rx="15" ry="17" fill="#c8925a"/>
    {/* cabelo — coque profissional */}
    <path d="M32 37 Q30 18 50 17 Q70 18 68 37 L65 32 Q58 21 50 20 Q42 21 35 32Z" fill="#3d1f00"/>
    <path d="M32 38 L31 52 Q31 58 34 60 L35 50 L34 38Z" fill="#3d1f00"/>
    <path d="M68 38 L69 50 L66 58 Q69 56 69 50 L68 38Z" fill="#3d1f00"/>
    {/* coque no topo */}
    <ellipse cx="50" cy="18" rx="9" ry="5" fill="#3d1f00"/>
    <ellipse cx="50" cy="17" rx="7" ry="3.5" fill="#4a2600"/>
    {/* grampo dourado no coque */}
    <rect x="45" y="15" width="10" height="1.5" rx="0.75" fill="#f59e0b" opacity="0.8"/>
    {/* headset — arco sobre a cabeça */}
    <path d="M28 42 Q28 16 50 16 Q72 16 72 42" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round"/>
    {/* peças do headset nas orelhas */}
    <rect x="24" y="40" width="7" height="9" rx="3.5" fill="#f59e0b" opacity="0.9"/>
    <rect x="69" y="40" width="7" height="9" rx="3.5" fill="#f59e0b" opacity="0.9"/>
    {/* microfone */}
    <path d="M31 47 Q25 52 26 58" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="26" cy="59" r="2.5" fill="#f59e0b" opacity="0.9"/>
    {/* sobrancelhas */}
    <path d="M37 35 Q42 33 44 35" stroke="#3d1f00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    <path d="M56 35 Q58 33 63 35" stroke="#3d1f00" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* olhos */}
    <ellipse cx="40" cy="38" rx="4.5" ry="3.5" fill="#f5a04a" opacity="0.9"/>
    <ellipse cx="60" cy="38" rx="4.5" ry="3.5" fill="#f5a04a" opacity="0.9"/>
    <ellipse cx="40" cy="38" rx="2.2" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="60" cy="38" rx="2.2" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="40.5" cy="38" rx="1.1" ry="1.1" fill="#2a0800"/>
    <ellipse cx="60.5" cy="38" rx="1.1" ry="1.1" fill="#2a0800"/>
    {/* cílios simples */}
    <path d="M36 35.5 L35 33.5" stroke="#3d1f00" strokeWidth="0.8"/>
    <path d="M38 34.5 L37.5 32.5" stroke="#3d1f00" strokeWidth="0.8"/>
    <path d="M40 34 L40 32" stroke="#3d1f00" strokeWidth="0.8"/>
    <path d="M56 35.5 L55 33.5" stroke="#3d1f00" strokeWidth="0.8"/>
    <path d="M60 34 L60 32" stroke="#3d1f00" strokeWidth="0.8"/>
    <path d="M63 35 L64 33.5" stroke="#3d1f00" strokeWidth="0.8"/>
    {/* nariz */}
    <path d="M48 44 Q50 47 52 44" stroke="#904820" strokeWidth="1" fill="none"/>
    {/* sorriso */}
    <path d="M42 52 Q50 58 58 52" stroke="#c07850" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
    {/* badge de função */}
    <rect x="1" y="2" width="30" height="9" rx="2.5" fill="#0d0600" stroke="#f59e0b" strokeWidth="0.7"/>
    <text x="16" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#f59e0b" fontFamily="monospace">ATEND</text>
    {/* banner nome */}
    <rect x="0" y="88" width="100" height="12" fill="#0d0600" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#f59e0b" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#f59e0b" fontFamily="sans-serif" letterSpacing="0.5">ÉRICA</text>
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

// ── Elieser — O Analista (Gestor de Dados) ────────────────────────
const ElieserSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="el" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#1a0e00"/><stop offset="100%" stopColor="#0a0500"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#el)"/>
    {/* aura laranja */}
    <ellipse cx="50" cy="78" rx="28" ry="9" fill="#ea8a29" opacity="0.18"/>
    {/* corpo — camisa social com detalhe de gráfico */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#140a00"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#1c1000"/>
    {/* botões da camisa social */}
    <circle cx="50" cy="71" r="1" fill="#ea8a29" opacity="0.7"/>
    <circle cx="50" cy="76" r="1" fill="#ea8a29" opacity="0.7"/>
    <circle cx="50" cy="81" r="1" fill="#ea8a29" opacity="0.7"/>
    {/* mini gráfico de barras no peito */}
    <rect x="40" y="84" width="3" height="3" rx="0.5" fill="#ea8a29" opacity="0.7"/>
    <rect x="44" y="82" width="3" height="5" rx="0.5" fill="#ea8a29" opacity="0.7"/>
    <rect x="48" y="79" width="3" height="8" rx="0.5" fill="#ea8a29" opacity="0.8"/>
    <rect x="52" y="81" width="3" height="6" rx="0.5" fill="#ea8a29" opacity="0.7"/>
    <rect x="56" y="83" width="3" height="4" rx="0.5" fill="#ea8a29" opacity="0.6"/>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#d4956a"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#1a0e00"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#d4956a"/>
    {/* cabelo curto */}
    <path d="M35 36 Q35 21 50 20 Q65 21 65 36 L63 33 Q56 24 50 23 Q44 24 37 33Z" fill="#0f0804"/>
    <path d="M35 36 L36 38Z" fill="#0f0804"/>
    <path d="M65 36 L64 38Z" fill="#0f0804"/>
    {/* barba curta */}
    <path d="M37 55 Q38 62 50 64 Q62 62 63 55" fill="#0f0804" opacity="0.5"/>
    <path d="M37 55 Q38 60 50 62 Q62 60 63 55" fill="none" stroke="#0f0804" strokeWidth="2" opacity="0.4"/>
    {/* óculos de grau */}
    <rect x="33" y="39" width="14" height="9" rx="3" fill="none" stroke="#ea8a29" strokeWidth="1.5"/>
    <rect x="53" y="39" width="14" height="9" rx="3" fill="none" stroke="#ea8a29" strokeWidth="1.5"/>
    <line x1="47" y1="43.5" x2="53" y2="43.5" stroke="#ea8a29" strokeWidth="1.2"/>
    <line x1="33" y1="43.5" x2="30" y2="42.5" stroke="#ea8a29" strokeWidth="1.2"/>
    <line x1="67" y1="43.5" x2="70" y2="42.5" stroke="#ea8a29" strokeWidth="1.2"/>
    {/* olhos laranja */}
    <ellipse cx="40" cy="43.5" rx="5" ry="3.2" fill="#ea8a29" opacity="0.85"/>
    <ellipse cx="60" cy="43.5" rx="5" ry="3.2" fill="#ea8a29" opacity="0.85"/>
    <ellipse cx="40" cy="43.5" rx="2.5" ry="1.8" fill="#fff" opacity="0.95"/>
    <ellipse cx="60" cy="43.5" rx="2.5" ry="1.8" fill="#fff" opacity="0.95"/>
    <ellipse cx="40.5" cy="43.5" rx="1.2" ry="1.2" fill="#1a0800"/>
    <ellipse cx="60.5" cy="43.5" rx="1.2" ry="1.2" fill="#1a0800"/>
    {/* sobrancelha séria */}
    <path d="M36 37.5 Q40 36 44 37.5" stroke="#0f0804" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    <path d="M56 37.5 Q60 36 64 37.5" stroke="#0f0804" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
    <path d="M48 51 Q50 54 52 51" stroke="#a06030" strokeWidth="1" fill="none"/>
    <path d="M44 56 Q50 60 56 56" stroke="#804020" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="26" height="9" rx="2.5" fill="#0a0500" stroke="#ea8a29" strokeWidth="0.7"/>
    <text x="14" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#ea8a29" fontFamily="monospace">DATA</text>
    <rect x="0" y="88" width="100" height="12" fill="#0a0500" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#ea8a29" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#ea8a29" fontFamily="sans-serif" letterSpacing="0.5">ELIESER</text>
  </svg>
)

// ── Deivisson — O Arquiteto Web (Web Designer) ────────────────────
const DeivissonSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="dv" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#0e0a1f"/><stop offset="100%" stopColor="#050310"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#dv)"/>
    {/* aura índigo */}
    <ellipse cx="50" cy="78" rx="28" ry="9" fill="#818cf8" opacity="0.18"/>
    {/* partículas de código */}
    <text x="12" y="22" fontSize="5" fill="#818cf8" opacity="0.25" fontFamily="monospace">{`</>`}</text>
    <text x="76" y="30" fontSize="4" fill="#818cf8" opacity="0.2" fontFamily="monospace">{`{}`}</text>
    <text x="80" y="68" fontSize="3.5" fill="#818cf8" opacity="0.18" fontFamily="monospace">;;</text>
    {/* corpo — moletom com capuz */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#0c0820"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#110e28"/>
    {/* capuz caído nas costas */}
    <path d="M34 66 Q32 58 34 54 Q36 50 40 52 Q38 58 38 68Z" fill="#0c0820"/>
    <path d="M66 66 Q68 58 66 54 Q64 50 60 52 Q62 58 62 68Z" fill="#0c0820"/>
    {/* ícone </> no peito do moletom */}
    <rect x="38" y="76" width="24" height="12" rx="3" fill="#0a0818" stroke="#818cf8" strokeWidth="0.8" opacity="0.9"/>
    <text x="50" y="85" textAnchor="middle" fontSize="6.5" fontWeight="bold" fill="#818cf8" fontFamily="monospace">{`</>`}</text>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#b88060"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#0e0a1f"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#b88060"/>
    {/* cabelo levemente despenteado */}
    <path d="M34 36 Q33 20 50 19 Q67 20 66 36 L64 32 Q58 23 50 22 Q42 23 36 32Z" fill="#100818"/>
    {/* mechas despenteadas */}
    <path d="M35 28 Q33 24 34 20 Q36 19 38 22" fill="#100818"/>
    <path d="M65 28 Q67 24 66 20 Q64 19 62 22" fill="#100818"/>
    <path d="M48 19 Q50 16 52 19" fill="#100818" stroke="#100818" strokeWidth="1.5"/>
    {/* olhos índigo */}
    <ellipse cx="41" cy="44" rx="5.5" ry="3.5" fill="#818cf8" opacity="0.85"/>
    <ellipse cx="59" cy="44" rx="5.5" ry="3.5" fill="#818cf8" opacity="0.85"/>
    <ellipse cx="41" cy="44" rx="2.5" ry="1.8" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="44" rx="2.5" ry="1.8" fill="#fff" opacity="0.95"/>
    <ellipse cx="41.5" cy="44" rx="1.2" ry="1.2" fill="#050310"/>
    <ellipse cx="59.5" cy="44" rx="1.2" ry="1.2" fill="#050310"/>
    <path d="M48 51 Q50 54 52 51" stroke="#906040" strokeWidth="1" fill="none"/>
    <path d="M44 57 Q50 61 56 57" stroke="#704030" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="24" height="9" rx="2.5" fill="#050310" stroke="#818cf8" strokeWidth="0.7"/>
    <text x="13" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#818cf8" fontFamily="monospace">WEB</text>
    <rect x="0" y="88" width="100" height="12" fill="#050310" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#818cf8" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#818cf8" fontFamily="sans-serif" letterSpacing="0.5">DEIVISSON</text>
  </svg>
)

// ── Mariana — A Jurista Social (Social Media TráfegOn Jurídico) ──
const MarianaSVG = () => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="mr" cx="50%" cy="35%" r="75%">
        <stop offset="0%" stopColor="#021a18"/><stop offset="100%" stopColor="#000806"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#mr)"/>
    {/* ícone balança topo direito */}
    <text x="76" y="22" fontSize="9" fill="#14b8a6" opacity="0.35">⚖</text>
    <text x="14" y="26" fontSize="4" fill="#14b8a6" opacity="0.4">✦</text>
    <text x="80" y="64" fontSize="3.5" fill="#14b8a6" opacity="0.3">✦</text>
    <ellipse cx="50" cy="78" rx="26" ry="8" fill="#14b8a6" opacity="0.18"/>
    {/* corpo — blazer profissional */}
    <path d="M16 100 Q26 70 36 66 Q43 74 50 76 Q57 74 64 66 Q74 70 84 100Z" fill="#011210"/>
    <path d="M36 68 L50 76 L64 68 L64 100 L36 100Z" fill="#031a18"/>
    {/* lapelas blazer */}
    <path d="M42 74 L38 68 L44 66 L50 70Z" fill="#011210" stroke="#14b8a6" strokeWidth="0.5"/>
    <path d="M58 74 L62 68 L56 66 L50 70Z" fill="#011210" stroke="#14b8a6" strokeWidth="0.5"/>
    {/* ícone balança da justiça no peito */}
    <line x1="50" y1="78" x2="50" y2="85" stroke="#14b8a6" strokeWidth="1.2" opacity="0.9"/>
    <line x1="44" y1="80" x2="56" y2="80" stroke="#14b8a6" strokeWidth="1" opacity="0.9"/>
    <ellipse cx="44.5" cy="82.5" rx="3" ry="1.8" fill="none" stroke="#14b8a6" strokeWidth="0.8" opacity="0.8"/>
    <ellipse cx="55.5" cy="82.5" rx="3" ry="1.8" fill="none" stroke="#14b8a6" strokeWidth="0.8" opacity="0.8"/>
    <line x1="44.5" y1="80" x2="44.5" y2="82.5" stroke="#14b8a6" strokeWidth="0.7" opacity="0.7"/>
    <line x1="55.5" y1="80" x2="55.5" y2="82.5" stroke="#14b8a6" strokeWidth="0.7" opacity="0.7"/>
    {/* pescoço */}
    <rect x="44" y="63" width="12" height="8" rx="3" fill="#d4956a"/>
    {/* cabeça */}
    <ellipse cx="50" cy="44" rx="17" ry="20" fill="#021a18"/>
    <ellipse cx="50" cy="42" rx="14" ry="17" fill="#d4956a"/>
    {/* cabelo cacheado volumoso */}
    <path d="M34 38 Q31 18 50 18 Q69 18 66 38 L64 33 Q57 22 50 21 Q43 22 36 33Z" fill="#0a0604"/>
    <path d="M33 40 Q28 35 30 26 Q32 20 36 24 Q33 29 34 38Z" fill="#0a0604"/>
    <path d="M67 40 Q72 35 70 26 Q68 20 64 24 Q67 29 66 38Z" fill="#0a0604"/>
    {/* textura cacheada lateral esquerda */}
    <path d="M33 44 Q29 42 30 38" fill="none" stroke="#0a0604" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M33 50 Q29 48 30 44" fill="none" stroke="#0a0604" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M32 56 Q29 54 30 50" fill="none" stroke="#0a0604" strokeWidth="2.2" strokeLinecap="round"/>
    {/* textura cacheada lateral direita */}
    <path d="M67 44 Q71 42 70 38" fill="none" stroke="#0a0604" strokeWidth="2.8" strokeLinecap="round"/>
    <path d="M67 50 Q71 48 70 44" fill="none" stroke="#0a0604" strokeWidth="2.5" strokeLinecap="round"/>
    <path d="M68 56 Q71 54 70 50" fill="none" stroke="#0a0604" strokeWidth="2.2" strokeLinecap="round"/>
    {/* brincos teal */}
    <circle cx="34" cy="52" r="1.8" fill="#14b8a6" opacity="0.75"/>
    <circle cx="66" cy="52" r="1.8" fill="#14b8a6" opacity="0.75"/>
    {/* olhos teal */}
    <ellipse cx="41" cy="43" rx="5" ry="3.5" fill="#14b8a6" opacity="0.85"/>
    <ellipse cx="59" cy="43" rx="5" ry="3.5" fill="#14b8a6" opacity="0.85"/>
    <ellipse cx="41" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="59" cy="43" rx="2.5" ry="2" fill="#fff" opacity="0.95"/>
    <ellipse cx="41.5" cy="43" rx="1.2" ry="1.2" fill="#021a18"/>
    <ellipse cx="59.5" cy="43" rx="1.2" ry="1.2" fill="#021a18"/>
    {/* sobrancelhas */}
    <path d="M37 39 Q41 37.5 45 39" stroke="#0a0604" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M55 39 Q59 37.5 63 39" stroke="#0a0604" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
    <path d="M48 50 Q50 53 52 50" stroke="#904820" strokeWidth="1" fill="none"/>
    <path d="M44 56 Q50 61 56 56" stroke="#c07850" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
    <rect x="1" y="2" width="30" height="9" rx="2.5" fill="#000806" stroke="#14b8a6" strokeWidth="0.7"/>
    <text x="16" y="8.5" textAnchor="middle" fontSize="4.2" fontWeight="bold" fill="#14b8a6" fontFamily="monospace">SOCIAL</text>
    <rect x="0" y="88" width="100" height="12" fill="#000806" opacity="0.95"/>
    <line x1="0" y1="88" x2="100" y2="88" stroke="#14b8a6" strokeWidth="0.6" opacity="0.6"/>
    <text x="50" y="97" textAnchor="middle" fontSize="5.5" fontWeight="bold" fill="#14b8a6" fontFamily="sans-serif" letterSpacing="0.5">MARIANA</text>
  </svg>
)

// ── Mapas de lookup ───────────────────────────────────────────────
export const AVATAR_BY_EMAIL = {
  'gabrielsschollmeier@gmail.com': GabrielSVG,
  'carolinepaganiadv@gmail.com':   CarolSVG,
  'gestaotrafegon@gmail.com':      TochiroSVG,
  'socialmediatrafegon@gmail.com':           BeatrizSVG,
  'socialmediaclientestrafegon@gmail.com':   AnaSVG,
  'atendimentotrafegon@gmail.com': EricaSVG,
  'elieserpeper@gmail.com':        ElieserSVG,
  'contato@tudoinforj.com.br':     DeivissonSVG,
  'socialmediatrafegonjuridico@gmail.com': MarianaSVG,
}

export const AVATAR_BY_ID = {
  gs:        GabrielSVG,
  carol:     CarolSVG,
  tochiro:   TochiroSVG,
  ana_sm:    AnaSVG,
  beatriz:   BeatrizSVG,
  adm_at:    EricaSVG,
  elieser:   ElieserSVG,
  deivisson: DeivissonSVG,
  mariana:   MarianaSVG,
}

export function getAvatarComponent(identifier) {
  if (!identifier) return null
  return AVATAR_BY_EMAIL[identifier] || AVATAR_BY_ID[identifier] || null
}
