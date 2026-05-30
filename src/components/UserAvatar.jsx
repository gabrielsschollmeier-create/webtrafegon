import { getAvatarComponent } from '../data/avatars'
import { BELTS } from '../data/belt-system'

export default function UserAvatar({ user, size = 28, rounded = 'full', className = '', style = {}, showBelt = false }) {
  const Svg    = user ? (getAvatarComponent(user.email) || getAvatarComponent(user.id)) : null
  const radius = rounded === 'full' ? '9999px' : rounded === 'xl' ? '12px' : rounded === 'lg' ? '8px' : rounded
  const belt   = showBelt && user?.belt ? BELTS.find(b => b.id === user.belt) : null
  const dotSize = Math.max(6, Math.round(size * 0.28))

  const avatarEl = Svg ? (
    <div className={`overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size, borderRadius: radius, ...style }}>
      <Svg />
    </div>
  ) : (
    <div className={`flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{
        width: size, height: size, borderRadius: radius,
        backgroundColor: user?.color || '#6eda2c',
        fontSize: Math.max(8, Math.round(size * 0.36)),
        ...style,
      }}>
      {user?.avatar || '?'}
    </div>
  )

  if (!belt) return avatarEl

  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {avatarEl}
      <span style={{
        position: 'absolute', bottom: 0, right: 0,
        width: dotSize, height: dotSize,
        borderRadius: '50%',
        background: belt.color,
        border: `${Math.max(1, dotSize * 0.2)}px solid white`,
        boxShadow: belt.id === 'branca' ? '0 0 0 1px #cbd5e1' : 'none',
      }} />
    </div>
  )
}
