import { Card, CardHeader, CardContent, Badge, Button } from '../../components/ui'
import { cn } from '../../lib/utils'
import { Target, TrendingUp, Plus, MoreHorizontal } from 'lucide-react'

const goals = [
  {
    id: 'g1', title: 'Increase Product Adoption', description: 'Drive MAU growth through improved onboarding and feature discovery.',
    type: 'company' as const, quarter: 'Q3 2026', progress: 65,
    keyResults: [
      { title: 'Increase MAU by 25%', target: 25, current: 16, unit: '%' },
      { title: 'Improve onboarding completion', target: 80, current: 62, unit: '%' },
      { title: 'Reduce churn rate', target: 5, current: 3.2, unit: '%' },
    ],
  },
  {
    id: 'g2', title: 'Improve Engineering Velocity', description: 'Ship features faster with better quality through process improvements.',
    type: 'department' as const, quarter: 'Q3 2026', progress: 45,
    keyResults: [
      { title: 'Reduce cycle time', target: 5, current: 7, unit: 'days' },
      { title: 'Increase deployment frequency', target: 20, current: 12, unit: '/week' },
      { title: 'Improve test coverage', target: 85, current: 72, unit: '%' },
    ],
  },
  {
    id: 'g3', title: 'Personal Development', description: 'Complete certifications and improve leadership skills.',
    type: 'personal' as const, quarter: 'Q3 2026', progress: 30,
    keyResults: [
      { title: 'Complete AWS certification', target: 1, current: 0, unit: '' },
      { title: 'Lead team retro sessions', target: 6, current: 2, unit: 'sessions' },
      { title: 'Mentor 2 junior developers', target: 2, current: 1, unit: 'mentees' },
    ],
  },
]

const typeColors: Record<string, string> = {
  company: 'bg-purple-500/15 text-purple-400',
  department: 'bg-blue-500/15 text-blue-400',
  personal: 'bg-emerald-500/15 text-emerald-400',
}

export function GoalsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Goals & OKRs</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Track objectives and key results across the organization</p>
        </div>
        <Button icon={<Plus size={16} />}>New Goal</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {[
          { label: 'Company Goals', value: '2', change: '+1 this quarter', color: 'purple' },
          { label: 'Department Goals', value: '5', change: 'On track', color: 'blue' },
          { label: 'Personal Goals', value: '12', change: '3 completed', color: 'emerald' },
        ].map((stat, i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                <div className={cn('p-2 rounded-xl', `bg-${stat.color}-500/15`)}>
                  <Target size={16} className={cn(`text-${stat.color}-400`)} />
                </div>
              </div>
              <p className="text-2xl font-bold text-[var(--text-primary)] mt-2">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        {goals.map((goal, i) => (
          <Card key={goal.id} className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className={cn('p-3 rounded-xl', typeColors[goal.type])}>
                    <Target size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">{goal.title}</h3>
                      <Badge size="sm" className={typeColors[goal.type]}>{goal.type}</Badge>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{goal.description}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-1">{goal.quarter}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--text-primary)]">{goal.progress}%</p>
                    <p className="text-xs text-[var(--text-muted)]">Complete</p>
                  </div>
                  <div className="w-14 h-14 relative">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#27272a" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#6366f1" strokeWidth="4" strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 24}`}
                        strokeDashoffset={`${2 * Math.PI * 24 * (1 - goal.progress / 100)}`}
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {goal.keyResults.map((kr, j) => {
                  const krProgress = (kr.current / kr.target) * 100
                  return (
                    <div key={j} className="p-3 rounded-xl bg-[var(--bg-surface-hover)]/50">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-[var(--text-secondary)]">{kr.title}</span>
                        <span className="text-xs text-[var(--text-secondary)]">
                          {kr.current}/{kr.target}{kr.unit}
                        </span>
                      </div>
                      <div className="h-1.5 rounded-full bg-[var(--border)] overflow-hidden">
                        <div
                          className={cn('h-full rounded-full transition-all', krProgress >= 80 ? 'bg-emerald-500' : krProgress >= 50 ? 'bg-amber-500' : 'bg-purple-500')}
                          style={{ width: `${Math.min(krProgress, 100)}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
