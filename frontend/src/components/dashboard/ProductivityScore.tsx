import { cn } from '../../lib/utils'

export function ProductivityScore({ score = 78 }: { score?: number }) {
  const circumference = 2 * Math.PI * 36
  const offset = circumference - (score / 100) * circumference

  const getColor = () => {
    if (score >= 80) return 'stroke-emerald-500 dark:stroke-emerald-400'
    if (score >= 60) return 'stroke-amber-500 dark:stroke-amber-400'
    return 'stroke-rose-500 dark:stroke-rose-400'
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="36" fill="none" className="stroke-[var(--bg-surface-hover)]" strokeWidth="6" />
          <circle
            cx="40" cy="40" r="36"
            fill="none"
            strokeWidth="6"
            strokeLinecap="round"
            className={cn('transition-all duration-1000', getColor())}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-xl font-bold text-[var(--text-primary)]">{score}</span>
        </div>
      </div>
      <div>
        <p className="text-sm font-medium text-[var(--text-primary)]">Productivity Score</p>
        <p className="text-xs text-[var(--text-muted)]">
          {score >= 80 ? 'Excellent performance' : score >= 60 ? 'Good progress' : 'Needs improvement'}
        </p>
      </div>
    </div>
  )
}
