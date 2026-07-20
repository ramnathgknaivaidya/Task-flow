import { Card, CardHeader, CardContent, Badge } from '../../components/ui'
import { cn } from '../../lib/utils'
import { Building2, Users, Target, BarChart3, MoreHorizontal, ArrowUpRight } from 'lucide-react'

const departments = [
  { id: 'd1', name: 'Engineering', head: 'Alex Morgan', members: 24, projects: 5, completion: 78, budget: 250000, color: 'blue' },
  { id: 'd2', name: 'Design', head: 'Emily Davis', members: 8, projects: 3, completion: 92, budget: 120000, color: 'purple' },
  { id: 'd3', name: 'Marketing', head: 'Anna Kim', members: 12, projects: 4, completion: 65, budget: 180000, color: 'emerald' },
  { id: 'd4', name: 'HR', head: 'Lisa Thompson', members: 6, projects: 2, completion: 88, budget: 80000, color: 'amber' },
  { id: 'd5', name: 'Finance', head: 'Robert Brown', members: 10, projects: 3, completion: 71, budget: 150000, color: 'rose' },
]

const colorMap: Record<string, string> = {
  blue: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  purple: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  emerald: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  amber: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  rose: 'bg-rose-500/15 text-rose-400 border-rose-500/20',
}

export function DepartmentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Departments</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Overview of all departments and their performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {departments.map((dept, i) => (
          <Card key={dept.id} hover className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className={cn('p-3 rounded-xl', colorMap[dept.color].split(' ')[0])}>
                  <Building2 size={20} className={colorMap[dept.color].split(' ')[1]} />
                </div>
                <button className="p-1 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)]">
                  <MoreHorizontal size={15} />
                </button>
              </div>
              <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">{dept.name}</h3>
              <p className="text-xs text-[var(--text-muted)] mb-4">Head: {dept.head}</p>
              
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="p-3 rounded-xl bg-[var(--bg-surface-hover)]/50">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                    <Users size={12} /> Members
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{dept.members}</p>
                </div>
                <div className="p-3 rounded-xl bg-[var(--bg-surface-hover)]/50">
                  <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-1">
                    <Target size={12} /> Projects
                  </div>
                  <p className="text-lg font-semibold text-[var(--text-primary)]">{dept.projects}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Completion Rate</span>
                  <span className={cn('font-medium', dept.completion >= 80 ? 'text-emerald-400' : dept.completion >= 60 ? 'text-amber-400' : 'text-rose-400')}>
                    {dept.completion}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-[var(--bg-surface-hover)] overflow-hidden">
                  <div
                    className={cn('h-full rounded-full transition-all', dept.completion >= 80 ? 'bg-emerald-500' : dept.completion >= 60 ? 'bg-amber-500' : 'bg-rose-500')}
                    style={{ width: `${dept.completion}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
                <span className="text-xs text-[var(--text-muted)]">Budget: ${dept.budget.toLocaleString()}</span>
                <button className="flex items-center gap-1 text-xs text-purple-400 hover:text-purple-300">
                  Details <ArrowUpRight size={11} />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
