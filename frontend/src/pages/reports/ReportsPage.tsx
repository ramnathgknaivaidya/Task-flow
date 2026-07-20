import { Card, CardHeader, CardContent, Button } from '../../components/ui'
import { BarChart3, Download, FileText, TrendingUp, Users, Clock, CheckCircle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell, LineChart, Line } from 'recharts'

const deptData = [
  { name: 'Engineering', completed: 24, pending: 8 },
  { name: 'Design', completed: 12, pending: 3 },
  { name: 'Marketing', completed: 8, pending: 5 },
  { name: 'HR', completed: 5, pending: 2 },
  { name: 'Finance', completed: 6, pending: 4 },
]

const completionData = [
  { name: 'Q1', actual: 78, target: 80 },
  { name: 'Q2', actual: 82, target: 85 },
  { name: 'Q3', actual: 76, target: 80 },
  { name: 'Q4', actual: 88, target: 85 },
]

const pieData = [
  { name: 'On Time', value: 65, color: '#6366f1' },
  { name: 'Overdue', value: 15, color: '#ef4444' },
  { name: 'In Progress', value: 20, color: '#f59e0b' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>{p.name}: {p.value}</p>
        ))}
      </div>
    )
  }
  return null
}

export function ReportsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Reports & Analytics</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">Data-driven insights for your organization</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" icon={<Download size={15} />}>Export</Button>
          <Button icon={<FileText size={15} />}>Generate Report</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-500/15"><CheckCircle size={18} className="text-emerald-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">156</p>
                <p className="text-xs text-[var(--text-muted)]">Tasks Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-500/15"><Users size={18} className="text-blue-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">89%</p>
                <p className="text-xs text-[var(--text-muted)]">Productivity Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/15"><Clock size={18} className="text-amber-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">1,247h</p>
                <p className="text-xs text-[var(--text-muted)]">Total Time Logged</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-purple-500/15"><TrendingUp size={18} className="text-purple-400" /></div>
              <div>
                <p className="text-2xl font-bold text-[var(--text-primary)]">12.4%</p>
                <p className="text-xs text-[var(--text-muted)]">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Department Performance</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={deptData} barGap={4}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="pending" name="Pending" fill="#27272a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Task Completion Status</h3>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 ml-4">
              {pieData.map((d) => (
                <div key={d.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-xs text-[var(--text-secondary)]">{d.name}: {d.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quarterly Completion Rate</h3>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={completionData}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} domain={[0, 100]} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="actual" name="Actual" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 4 }} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#52525b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Export Options</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Task Completion Report', format: 'PDF', icon: FileText },
              { label: 'Productivity Analysis', format: 'Excel', icon: BarChart3 },
              { label: 'Time Tracking Summary', format: 'CSV', icon: Clock },
              { label: 'Team Performance Overview', format: 'PDF', icon: Users },
            ].map((item, i) => {
              const Icon = item.icon
              return (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-hover)]/50 hover:bg-[var(--bg-surface-hover)]/80 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <Icon size={16} className="text-[var(--text-secondary)]" />
                    <span className="text-sm text-[var(--text-secondary)]">{item.label}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--border)] text-[var(--text-secondary)]">{item.format}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
