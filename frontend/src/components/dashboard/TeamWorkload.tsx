import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts'

const data = [
  { name: 'Alex M.', tasks: 8, color: '#6366f1' },
  { name: 'Sarah C.', tasks: 12, color: '#a78bfa' },
  { name: 'Mike J.', tasks: 5, color: '#34d399' },
  { name: 'Emily D.', tasks: 9, color: '#f59e0b' },
  { name: 'John L.', tasks: 14, color: '#ef4444' },
  { name: 'Anna K.', tasks: 7, color: '#06b6d4' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-[var(--text-secondary)]">{label}</p>
        <p className="text-sm font-medium text-[var(--text-primary)]">{payload[0].value} active tasks</p>
      </div>
    )
  }
  return null
}

export function TeamWorkloadChart() {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" barSize={8}>
        <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 12 }} width={70} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="tasks" name="Tasks" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
