import { Card, CardContent, Badge, Avatar } from '../../components/ui'
import { Search, MapPin, Mail, Briefcase } from 'lucide-react'

const employees = [
  { id: '1', name: 'Alex Morgan', title: 'Senior Product Manager', department: 'Engineering', email: 'alex@taskflow.com', location: 'New York, NY', skills: ['PM', 'Agile', 'Leadership'], experience: 8, projects: 5, online: true },
  { id: '2', name: 'Sarah Chen', title: 'Senior Developer', department: 'Engineering', email: 'sarah@taskflow.com', location: 'San Francisco, CA', skills: ['React', 'Node.js', 'TypeScript'], experience: 6, projects: 3, online: true },
  { id: '3', name: 'Mike Johnson', title: 'Developer', department: 'Engineering', email: 'mike@taskflow.com', location: 'Austin, TX', skills: ['Python', 'AWS', 'Docker'], experience: 4, projects: 2, online: false },
  { id: '4', name: 'Emily Davis', title: 'Senior Designer', department: 'Design', email: 'emily@taskflow.com', location: 'New York, NY', skills: ['Figma', 'UI/UX', 'Design Systems'], experience: 7, projects: 4, online: true },
  { id: '5', name: 'John Lee', title: 'QA Engineer', department: 'Engineering', email: 'john@taskflow.com', location: 'Chicago, IL', skills: ['Testing', 'Cypress', 'Playwright'], experience: 3, projects: 3, online: false },
  { id: '6', name: 'Anna Kim', title: 'Marketing Lead', department: 'Marketing', email: 'anna@taskflow.com', location: 'Los Angeles, CA', skills: ['Content Strategy', 'SEO'], experience: 5, projects: 2, online: true },
]

export function DirectoryPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Employee Directory</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Find and connect with team members</p>
      </div>

      <div className="relative max-w-md">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input type="text" placeholder="Search by name, role, or department..." className="w-full bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl pl-9 pr-4 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-purple-500/50" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {employees.map((emp, i) => (
          <Card key={emp.id} hover className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <Avatar name={emp.name} size="lg" online={emp.online} />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">{emp.name}</h3>
                  <p className="text-xs text-[var(--text-muted)]">{emp.title}</p>
                  <Badge size="sm" className="mt-1">{emp.department}</Badge>
                </div>
              </div>
              <div className="space-y-2 text-xs text-[var(--text-muted)]">
                <div className="flex items-center gap-2"><Mail size={12} /> {emp.email}</div>
                <div className="flex items-center gap-2"><MapPin size={12} /> {emp.location}</div>
                <div className="flex items-center gap-2"><Briefcase size={12} /> {emp.experience} years experience</div>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-[var(--border)]">
                {emp.skills.map((s, j) => (
                  <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]">{s}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
