import { Clock, CheckCircle, MessageSquare, UserPlus, Edit3 } from 'lucide-react'
import { timeAgo } from '../../lib/utils'

const activities = [
  { id: 'a1', type: 'complete', user: 'Sarah Chen', action: 'completed task', target: 'Set up CI/CD pipeline', time: new Date(Date.now() - 300000).toISOString() },
  { id: 'a2', type: 'comment', user: 'Mike Johnson', action: 'commented on', target: 'Design new landing page', time: new Date(Date.now() - 900000).toISOString() },
  { id: 'a3', type: 'assign', user: 'Alex Morgan', action: 'assigned', target: 'Fix payment gateway timeout to You', time: new Date(Date.now() - 1800000).toISOString() },
  { id: 'a4', type: 'update', user: 'Emily Davis', action: 'updated', target: 'Quarterly review presentation', time: new Date(Date.now() - 3600000).toISOString() },
  { id: 'a5', type: 'complete', user: 'John Lee', action: 'completed milestone', target: 'Design Phase', time: new Date(Date.now() - 7200000).toISOString() },
  { id: 'a6', type: 'comment', user: 'Anna Kim', action: 'mentioned you in', target: 'Implement authentication flow', time: new Date(Date.now() - 10800000).toISOString() },
]

const iconMap: Record<string, React.ReactNode> = {
  complete: <CheckCircle size={14} className="text-emerald-500 dark:text-emerald-400" />,
  comment: <MessageSquare size={14} className="text-blue-500 dark:text-blue-400" />,
  assign: <UserPlus size={14} className="text-amber-500 dark:text-amber-400" />,
  update: <Edit3 size={14} className="text-purple-500 dark:text-purple-400" />,
}

export function ActivityFeed() {
  return (
    <div className="space-y-1">
      {activities.map((a) => (
        <div key={a.id} className="flex items-start gap-3 px-4 py-3 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-colors">
          <div className="p-1.5 rounded-lg bg-[var(--bg-surface-hover)]">
            {iconMap[a.type] || <Clock size={14} className="text-[var(--text-muted)]" />}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-medium text-[var(--text-primary)]">{a.user}</span>{' '}
              {a.action}{' '}
              <span className="text-[var(--text-primary)] font-medium">{a.target}</span>
            </p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{timeAgo(a.time)}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
