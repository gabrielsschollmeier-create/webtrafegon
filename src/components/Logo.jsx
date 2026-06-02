/* Logo TráfegOn — componente reutilizável
   Props:
     variant: 'full' (padrão) | 'icon' (só o quadrado verde)
     size: 'sm' | 'md' | 'lg'
     dark: bool — fundo escuro usa texto branco, claro usa #1c1f35
*/
export default function Logo({ variant = 'full', size = 'md', dark = false }) {
  const scales = { sm: 0.55, md: 0.8, lg: 1.1 }
  const s = scales[size] || 0.8

  if (variant === 'icon') {
    return (
      <svg width={Math.round(44 * s)} height={Math.round(44 * s)} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="44" height="44" rx="10" fill="#6ED42A"/>
        <text x="22" y="30" fontFamily="'Nunito','Varela Round','Arial Rounded MT Bold','Trebuchet MS',sans-serif" fontSize="22" fontWeight="900" fill="#1a2035" textAnchor="middle" letterSpacing="-0.5">on</text>
      </svg>
    )
  }

  const textColor = dark ? '#ffffff' : '#1a2035'

  return (
    <svg width={Math.round(175 * s)} height={Math.round(44 * s)} viewBox="0 0 175 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* "tráfeg" */}
      <text x="0" y="34" fontFamily="'Inter','Arial Black',sans-serif" fontSize="32" fontWeight="900" fill={textColor} letterSpacing="-1">tráfeg</text>
      {/* Caixinha verde */}
      <rect x="108" y="2" width="67" height="40" rx="9" fill="#6ED42A"/>
      {/* "on" escuro sobre verde — contraste correto */}
      <text x="141" y="33" fontFamily="'Inter','Arial Black',sans-serif" fontSize="30" fontWeight="900" fill="#1a2035" textAnchor="middle" letterSpacing="-1">on</text>
    </svg>
  )
}
