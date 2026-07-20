import { getInitials } from '../../lib/utils'
import { cn } from '../../lib/utils'

interface AvatarProps {
  name: string
  src?: string
  size?: 'sm' | 'md' | 'lg'
  online?: boolean
  className?: string
}

const sizes = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
}

const dotSizes = {
  sm: 'w-2 h-2',
  md: 'w-2.5 h-2.5',
  lg: 'w-3 h-3',
}

const colors = [
  'bg-violet-500/20 text-violet-600 dark:text-violet-400',
  'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400',
  'bg-amber-500/20 text-amber-600 dark:text-amber-400',
  'bg-rose-500/20 text-rose-600 dark:text-rose-400',
  'bg-blue-500/20 text-blue-600 dark:text-blue-400',
  'bg-cyan-500/20 text-cyan-600 dark:text-cyan-400',
]

function getColor(name: string) {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function Avatar({ name, src, size = 'md', online, className }: AvatarProps) {
  if (src) {
    return (
      <div className={cn('relative shrink-0', className)}>
        <img src={src} alt={name} className={cn('rounded-full object-cover', sizes[size])} />
        {online !== undefined && (
          <span className={cn('absolute bottom-0 right-0 rounded-full border-2 border-[var(--bg-card)] bg-emerald-500', dotSizes[size])} />
        )}
      </div>
    )
  }

  return (
    <div className={cn('relative shrink-0', className)}>
      <div className={cn('rounded-full flex items-center justify-center font-medium', sizes[size], getColor(name))}>
        {getInitials(name)}
      </div>
      {online !== undefined && (
        <span className={cn('absolute bottom-0 right-0 rounded-full border-2 border-[var(--bg-card)]', online ? 'bg-emerald-500' : 'bg-zinc-500', dotSizes[size])} />
      )}
    </div>
  )
}

export function AvatarGroup({ users, size = 'sm', max = 4 }: { users: { name: string }[]; size?: 'sm' | 'md' | 'lg'; max?: number }) {
  const visible = users.slice(0, max)
  const remaining = users.length - max
  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={i} name={u.name} size={size} className="ring-2 ring-[var(--bg-card)]" />
      ))}
      {remaining > 0 && (
        <div className="w-7 h-7 rounded-full bg-[var(--bg-surface-hover)] flex items-center justify-center text-xs text-[var(--text-secondary)] ring-2 ring-[var(--bg-card)]">
          +{remaining}
        </div>
      )}
    </div>
  )
}
