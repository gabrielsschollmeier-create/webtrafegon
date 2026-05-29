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
        <rect width="44" height="44" rx="10" fill="#6eda2c"/>
        <text x="7" y="33" fontFamily="'Inter','Arial Black',sans-serif" fontSize="26" fontWeight="900" fill="#ffffff">on</text>
      </svg>
    )
  }

  const textColor = dark ? '#ffffff' : '#1c1f35'

  return (
    <svg width={Math.round(168 * s)} height={Math.round(44 * s)} viewBox="0 0 168 44" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* "Tráfeg" */}
      <text x="0" y="34" fontFamily="'Inter','Arial Black',sans-serif" fontSize="32" fontWeight="900" fill={textColor} letterSpacing="-1">Tráfeg</text>
      {/* Caixinha verde "On" */}
      <rect x="110" y="3" width="58" height="38" rx="8" fill="#6eda2c"/>
      <text x="115" y="33" fontFamily="'Inter','Arial Black',sans-serif" fontSize="28" fontWeight="900" fill="#ffffff" letterSpacing="-1">On</text>
    </svg>
  )
}
