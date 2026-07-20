import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line, AreaChart, Area } from 'recharts'

const weeklyData = [
  { day: 'Mon', completed: 4, created: 6 },
  { day: 'Tue', completed: 6, created: 4 },
  { day: 'Wed', completed: 3, created: 5 },
  { day: 'Thu', completed: 7, created: 3 },
  { day: 'Fri', completed: 5, created: 7 },
  { day: 'Sat', completed: 2, created: 1 },
  { day: 'Sun', completed: 1, created: 0 },
]

const productivityData = [
  { day: 'Mon', hours: 6.5 },
  { day: 'Tue', hours: 7.2 },
  { day: 'Wed', hours: 5.8 },
  { day: 'Thu', hours: 8.1 },
  { day: 'Fri', hours: 6.9 },
  { day: 'Sat', hours: 3.2 },
  { day: 'Sun', hours: 1.5 },
]

const burndownData = [
  { day: 'Week 1', ideal: 40, actual: 40 },
  { day: 'Week 2', ideal: 32, actual: 35 },
  { day: 'Week 3', ideal: 24, actual: 22 },
  { day: 'Week 4', ideal: 16, actual: 18 },
  { day: 'Week 5', ideal: 8, actual: 10 },
  { day: 'Week 6', ideal: 0, actual: 3 },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-lg">
        <p className="text-xs text-[var(--text-secondary)] mb-1">{label}</p>
        {payload.map((p: any, i: number) => (
          <p key={i} className="text-sm font-medium" style={{ color: p.color }}>
            {p.name}: {p.value}
          </p>
        ))}
      </div>
    )
  }
  return null
}

export function WeeklyCompletionChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={weeklyData} barGap={4}>
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="completed" name="Completed" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="created" name="Created" fill="#27272a" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function ProductivityTrend() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={productivityData}>
        <defs>
          <linearGradient id="productivityGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Area type="monotone" dataKey="hours" name="Hours" stroke="#6366f1" fill="url(#productivityGrad)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

export function BurndownChart() {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={burndownData}>
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a', fontSize: 11 }} />
        <Tooltip content={<CustomTooltip />} />
        <Line type="monotone" dataKey="ideal" name="Ideal" stroke="#52525b" strokeWidth={2} strokeDasharray="4 4" dot={false} />
        <Line type="monotone" dataKey="actual" name="Actual" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}
