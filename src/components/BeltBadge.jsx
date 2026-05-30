import { BELTS } from '../data/belt-system'

const SIZES = {
  xs: { px: 4, py: 1, fontSize: 7,  dot: 4, gap: 2 },
  sm: { px: 6, py: 2, fontSize: 9,  dot: 5, gap: 2 },
  md: { px: 9, py: 3, fontSize: 11, dot: 6, gap: 3 },
}

export default function BeltBadge({ beltId = 'branca', grau = 0, size = 'sm', showLabel = true }) {
  const belt = BELTS.find(b => b.id === beltId) || BELTS[0]
  const s    = SIZES[size] || SIZES.sm
  const dotColor = belt.id === 'preta' ? '#e2e8f0' : belt.color

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: s.gap, verticalAlign: 'middle' }}>
      {showLabel && (
        <span style={{
          background: belt.color,
          color: belt.textColor,
          padding: `${s.py}px ${s.px}px`,
          borderRadius: 4,
          fontSize: s.fontSize,
          fontWeight: 800,
          letterSpacing: '0.05em',
          border: belt.id === 'branca' ? '1px solid #cbd5e1' : 'none',
          lineHeight: 1.25,
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {belt.label.toUpperCase()}
        </span>
      )}
      {grau > 0 && (
        <span style={{ display: 'inline-flex', gap: 2, alignItems: 'center' }}>
          {Array.from({ length: grau }).map((_, i) => (
            <span key={i} style={{
              display: 'inline-block',
              width: s.dot, height: s.dot, borderRadius: '50%',
              background: dotColor,
              border: `1px solid ${belt.id === 'preta' ? '#374151' : belt.color + '80'}`,
            }} />
          ))}
        </span>
      )}
    </span>
  )
}
