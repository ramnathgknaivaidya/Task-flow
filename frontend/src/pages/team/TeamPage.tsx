import { Card, CardHeader, CardContent, Badge, Avatar } from '../../components/ui'
import { cn } from '../../lib/utils'
import { Users, Calendar, Target, MessageSquare, MoreHorizontal, Search } from 'lucide-react'

const teamMembers = [
  { id: '1', name: 'Alex Morgan', role: 'Product Manager', department: 'Engineering', online: true, tasks: 8, hours: 32, skills: ['Project Management', 'Agile', 'Leadership'], email: 'alex@taskflow.com' },
  { id: '2', name: 'Sarah Chen', role: 'Senior Developer', department: 'Engineering', online: true, tasks: 12, hours: 38, skills: ['React', 'Node.js', 'TypeScript', 'GraphQL'], email: 'sarah@taskflow.com' },
  { id: '3', name: 'Mike Johnson', role: 'Developer', department: 'Engineering', online: false, tasks: 5, hours: 28, skills: ['Python', 'AWS', 'Docker'], email: 'mike@taskflow.com' },
  { id: '4', name: 'Emily Davis', role: 'Designer', department: 'Design', online: true, tasks: 9, hours: 35, skills: ['Figma', 'UI/UX', 'Design Systems'], email: 'emily@taskflow.com' },
  { id: '5', name: 'John Lee', role: 'QA Engineer', department: 'Engineering', online: false, tasks: 14, hours: 40, skills: ['Testing', 'Cypress', 'Playwright'], email: 'john@taskflow.com' },
  { id: '6', name: 'Anna Kim', role: 'Marketing Lead', department: 'Marketing', online: true, tasks: 7, hours: 30, skills: ['Content Strategy', 'SEO', 'Analytics'], email: 'anna@taskflow.com' },
  { id: '7', name: 'David Wilson', role: 'DevOps Engineer', department: 'Engineering', online: false, tasks: 6, hours: 36, skills: ['Kubernetes', 'Terraform', 'CI/CD'], email: 'david@taskflow.com' },
  { id: '8', name: 'Lisa Thompson', role: 'HR Manager', department: 'HR', online: true, tasks: 4, hours: 25, skills: ['Recruiting', 'Employee Relations', 'Payroll'], email: 'lisa@taskflow.com' },
]

export function TeamPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Team</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{teamMembers.length} team members</p>
        </div>
      </div>

      {/* Team overview cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/15"><Users size={18} className="text-blue-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{teamMembers.length}</p>
                <p className="text-xs text-[var(--text-muted)]">Total Members</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15">
                <div className="w-4 h-4 rounded-full bg-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-400">{teamMembers.filter(m => m.online).length}</p>
                <p className="text-xs text-[var(--text-muted)]">Online Now</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15"><Target size={18} className="text-amber-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{teamMembers.reduce((a, m) => a + m.tasks, 0)}</p>
                <p className="text-xs text-[var(--text-muted)]">Total Tasks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15"><Calendar size={18} className="text-purple-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">{Math.round(teamMembers.reduce((a, m) => a + m.hours, 0) / teamMembers.length)}h</p>
                <p className="text-xs text-[var(--text-muted)]">Avg. Weekly Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          placeholder="Search team members..."
          className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50"
        />
      </div>

      {/* Team grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {teamMembers.map((member, i) => (
          <Card key={member.id} hover className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar name={member.name} size="lg" online={member.online} />
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--text-primary)]">{member.name}</h3>
                    <p className="text-xs text-[var(--text-muted)]">{member.role}</p>
                  </div>
                </div>
                <button className="p-1 rounded-md hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)]">
                  <MoreHorizontal size={14} />
                </button>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <Badge size="sm">{member.department}</Badge>
                {member.online ? (
                  <Badge variant="success" size="sm">Online</Badge>
                ) : (
                  <Badge size="sm">Offline</Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {member.skills.slice(0, 3).map((s, j) => (
                  <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]">{s}</span>
                ))}
                {member.skills.length > 3 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-hover)] text-[var(--text-muted)]">+{member.skills.length - 3}</span>
                )}
              </div>
              <div className="flex items-center justify-between text-xs text-[var(--text-muted)] pt-3 border-t border-[var(--border)]">
                <span>{member.tasks} tasks</span>
                <span>{member.hours}h / week</span>
                <span className="text-purple-400 cursor-pointer hover:text-purple-300">Message</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
