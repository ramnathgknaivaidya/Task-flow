import { useTaskStore } from '../../store/taskStore'
import { formatDate, statusColors, statusLabels, isOverdue } from '../../lib/utils'
import { cn } from '../../lib/utils'
import { AlertCircle, Calendar } from 'lucide-react'

export function TodayTasks() {
  const { tasks } = useTaskStore()
  const todayTasks = tasks.filter(t => {
    const d = new Date(t.dueDate)
    const today = new Date()
    return d.toDateString() === today.toDateString()
  })

  return (
    <div className="space-y-2">
      {todayTasks.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">No tasks due today. You're all caught up!</p>
      ) : (
        todayTasks.map((t) => (
          <div key={t.id} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-colors">
            <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0', t.priority === 'urgent' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-400' : 'bg-zinc-400')} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{t.title}</p>
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded-md font-medium', statusColors[t.status])}>
                  {statusLabels[t.status]}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Calendar size={11} />
                  {formatDate(t.dueDate)}
                </span>
                {isOverdue(t.dueDate) && t.status !== 'done' && (
                  <span className="flex items-center gap-1 text-xs text-red-500 dark:text-red-400">
                    <AlertCircle size={11} /> Overdue
                  </span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export function UpcomingTasks() {
  const { tasks } = useTaskStore()
  const upcoming = tasks
    .filter(t => {
      const d = new Date(t.dueDate)
      const today = new Date()
      const weekLater = new Date(today.getTime() + 86400000 * 7)
      return d > today && d <= weekLater && t.status !== 'done'
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())

  return (
    <div className="space-y-2">
      {upcoming.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">No upcoming tasks this week</p>
      ) : (
        upcoming.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-colors">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn('w-2 h-2 rounded-full shrink-0', t.priority === 'urgent' ? 'bg-red-500' : t.priority === 'high' ? 'bg-orange-400' : 'bg-zinc-400')} />
              <p className="text-sm text-[var(--text-secondary)] truncate">{t.title}</p>
            </div>
            <span className="text-xs text-[var(--text-muted)] shrink-0 ml-3">{formatDate(t.dueDate)}</span>
          </div>
        ))
      )}
    </div>
  )
}

export function OverdueTasks() {
  const { tasks } = useTaskStore()
  const overdue = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done' && t.status !== 'archived')

  return (
    <div className="space-y-2">
      {overdue.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)] text-center py-6">No overdue tasks. Great job!</p>
      ) : (
        overdue.map((t) => (
          <div key={t.id} className="flex items-center justify-between p-3 rounded-xl bg-red-500/5 border border-red-500/10">
            <div className="flex items-center gap-3 min-w-0">
              <AlertCircle size={14} className="text-red-500 dark:text-red-400 shrink-0" />
              <p className="text-sm text-[var(--text-secondary)] truncate">{t.title}</p>
            </div>
            <span className="text-xs text-red-500 dark:text-red-400 shrink-0 ml-3">{formatDate(t.dueDate)}</span>
          </div>
        ))
      )}
    </div>
  )
}
