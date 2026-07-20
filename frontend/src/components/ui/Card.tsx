import { cn } from '../../lib/utils'

interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
  style?: React.CSSProperties
}

export function Card({ children, className, hover, onClick, style }: CardProps) {
  return (
    <div
      className={cn(
        'card-bg backdrop-blur-sm border border-[var(--border)] rounded-2xl shadow-card',
        hover && 'hover:border-[var(--border-hover)] cursor-pointer transition-all',
        className
      )}
      onClick={onClick}
      style={style}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4 border-b border-[var(--border)]', className)}>{children}</div>
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}
