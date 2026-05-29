// Avatares SVG ilustrados por colaborador
// Mapeados por email (chave universal entre auth e mock)

const GabrielSVG = () => (
  <svg viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
    <defs>
      <radialGradient id="bg_gs" cx="50%" cy="40%" r="60%">
        <stop offset="0%" stopColor="#2a3a1a"/>
        <stop offset="100%" stopColor="#0f1a08"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="50" fill="url(#bg_gs)"/>
    {/* Jaqueta / ombros */}
    <path d="M10 110 Q18 82 36 78 L50 88 L64 78 Q82 82 90 110 Z" fill="#1a1a2e"/>
    <path d="M50 88 L44 110 M50 88 L56 110" stroke="#111" strokeWidth="1.5"/>
    {/* Pescoço */}
    <rect x="43" y="72" width="14" height="18" rx="5" fill="#c9956c"/>
    {/* Cabeça */}
    <ellipse cx="50" cy="54" rx="22" ry="25" fill="#c9956c"/>
    {/* Cabelo curto buzz cut */}
    <ellipse cx="50" cy="33" rx="22" ry="10" fill="#111"/>
    <rect x="28" y="30" width="44" height="12" fill="#111"/>
    <rect x="28" y="38" width="4" height="10" rx="2" fill="#111"/>
    <rect x="68" y="38" width="4" height="10" rx="2" fill="#111"/>
    {/* Orelhas */}
    <ellipse cx="28.5" cy="54" rx="4" ry="5.5" fill="#b8845c"/>
    <ellipse cx="71.5" cy="54" rx="4" ry="5.5" fill="#b8845c"/>
    <ellipse cx="28.5" cy="54" rx="2.5" ry="3.5" fill="#a8744c"/>
    <ellipse cx="71.5" cy="54" rx="2.5" ry="3.5" fill="#a8744c"/>
    {/* Sobrancelhas */}
    <rect x="33" y="43" width="15" height="3.5" rx="1.5" fill="#111"/>
    <rect x="52" y="43" width="15" height="3.5" rx="1.5" fill="#111"/>
    {/* Olhos */}
    <ellipse cx="40.5" cy="52" rx="5.5" ry="4.5" fill="#fff"/>
    <circle cx="40.5" cy="52" r="3.2" fill="#2c1a08"/>
    <circle cx="40.5" cy="52" r="1.5" fill="#0a0a0a"/>
    <circle cx="39.2" cy="50.8" r="0.8" fill="#fff" opacity="0.7"/>
    <ellipse cx="59.5" cy="52" rx="5.5" ry="4.5" fill="#fff"/>
    <circle cx="59.5" cy="52" r="3.2" fill="#2c1a08"/>
    <circle cx="59.5" cy="52" r="1.5" fill="#0a0a0a"/>
    <circle cx="58.2" cy="50.8" r="0.8" fill="#fff" opacity="0.7"/>
    {/* Pálpebras */}
    <path d="M35 49 Q40.5 47 46 49" stroke="#111" strokeWidth="1.2" fill="none"/>
    <path d="M54 49 Q59.5 47 65 49" stroke="#111" strokeWidth="1.2" fill="none"/>
    {/* Nariz */}
    <path d="M50 56 Q47.5 61 46 63 Q48 64.5 50 63.5 Q52 64.5 54 63 Q52.5 61 50 56" fill="#b07848"/>
    {/* Boca séria */}
    <path d="M43 69 Q50 71 57 69" stroke="#8a4a28" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
    {/* Sombra queixo */}
    <ellipse cx="50" cy="75" rx="10" ry="3" fill="#a06840" opacity="0.3"/>
  </svg>
)

// Mapa por email → componente SVG
export const AVATAR_BY_EMAIL = {
  'gabrielsschollmeier@gmail.com': GabrielSVG,
}

// Mapa por ID mock → componente SVG
export const AVATAR_BY_ID = {
  gs: GabrielSVG,
}

// Função utilitária — retorna o componente ou null
export function getAvatarComponent(identifier) {
  if (!identifier) return null
  const byEmail = AVATAR_BY_EMAIL[identifier]
  if (byEmail) return byEmail
  const byId = AVATAR_BY_ID[identifier]
  if (byId) return byId
  return null
}
