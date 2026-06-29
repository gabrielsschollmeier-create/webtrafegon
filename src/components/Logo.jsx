export default function Logo({ variant = 'full', size = 'md', dark = false }) {
  const s = { sm: 0.6, md: 0.85, lg: 1.2 }[size] || 0.85
  const font = "'Nunito','Varela Round','Arial Rounded MT Bold',sans-serif"

  const onBox = (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#6ED42A',
      borderRadius: `${9 * s}px`,
      width: `${44 * s}px`,
      height: `${40 * s}px`,
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: font,
        fontWeight: 900,
        fontSize: `${26 * s}px`,
        color: '#ffffff',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        userSelect: 'none',
      }}>on</span>
    </div>
  )

  if (variant === 'icon') return onBox

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: `${2 * s}px` }}>
      <span style={{
        fontFamily: font,
        fontWeight: 900,
        fontSize: `${29 * s}px`,
        color: dark ? '#ffffff' : '#1a2035',
        letterSpacing: '-0.03em',
        lineHeight: 1,
        userSelect: 'none',
      }}>tráfeg</span>
      {onBox}
    </div>
  )
}
