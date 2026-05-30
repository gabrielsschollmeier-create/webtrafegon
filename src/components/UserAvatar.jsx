import { getAvatarComponent } from '../data/avatars'

export default function UserAvatar({ user, size = 28, rounded = 'full', className = '', style = {} }) {
  const Svg = user ? (getAvatarComponent(user.email) || getAvatarComponent(user.id)) : null
  const radius = rounded === 'full' ? '9999px' : rounded === 'xl' ? '12px' : rounded === 'lg' ? '8px' : rounded

  if (Svg) {
    return (
      <div
        className={`overflow-hidden flex-shrink-0 ${className}`}
        style={{ width: size, height: size, borderRadius: radius, ...style }}
      >
        <Svg />
      </div>
    )
  }

  return (
    <div
      className={`flex items-center justify-center font-bold text-white flex-shrink-0 ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: radius,
        backgroundColor: user?.color || '#6eda2c',
        fontSize: Math.max(8, Math.round(size * 0.36)),
        ...style,
      }}
    >
      {user?.avatar || '?'}
    </div>
  )
}
