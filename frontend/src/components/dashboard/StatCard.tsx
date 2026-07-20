import { cn } from '../../lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  change?: number
  icon: React.ReactNode
  color?: string
  subtitle?: string
}

export function StatCard({ title, value, change, icon, color = 'purple', subtitle }: StatCardProps) {
  const colorMap: Record<string, string> = {
    purple: 'accent-light-bg accent-text',
    emerald: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
    amber: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
    rose: 'bg-rose-500/15 text-rose-600 dark:text-rose-400',
    blue: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
    cyan: 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400',
  }

  return (
    <div className="card-bg backdrop-blur-sm border border-[var(--border)] rounded-2xl p-5 hover:border-[var(--border-hover)] transition-all">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {subtitle && <p className="text-xs text-[var(--text-muted)]">{subtitle}</p>}
        </div>
        <div className={cn('p-2.5 rounded-xl', colorMap[color] || colorMap.purple)}>
          {icon}
        </div>
      </div>
      {change !== undefined && (
        <div className="flex items-center gap-1 mt-3">
          {change >= 0 ? (
            <TrendingUp size={14} className="text-emerald-500 dark:text-emerald-400" />
          ) : (
            <TrendingDown size={14} className="text-rose-500 dark:text-rose-400" />
          )}
          <span className={cn('text-xs font-medium', change >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
            {Math.abs(change)}% from last week
          </span>
        </div>
      )}
    </div>
  )
}
