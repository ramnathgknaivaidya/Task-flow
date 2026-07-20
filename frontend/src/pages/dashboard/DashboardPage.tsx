import { useNavigate } from 'react-router-dom'
import { Card, CardHeader, CardContent } from '../../components/ui'
import { StatCard } from '../../components/dashboard/StatCard'
import { TodayTasks, UpcomingTasks, OverdueTasks } from '../../components/dashboard/TaskList'
import { ActivityFeed } from '../../components/dashboard/ActivityFeed'
import { WeeklyCompletionChart, ProductivityTrend, BurndownChart } from '../../components/dashboard/ProgressChart'
import { ProductivityScore } from '../../components/dashboard/ProductivityScore'
import { TeamWorkloadChart } from '../../components/dashboard/TeamWorkload'
import { useTaskStore } from '../../store/taskStore'
import { useProjectStore } from '../../store/projectStore'
import { CheckSquare, Clock, AlertTriangle, TrendingUp, FolderKanban } from 'lucide-react'
import { isOverdue } from '../../lib/utils'
import toast from 'react-hot-toast'

export function DashboardPage() {
  const navigate = useNavigate()
  const { tasks } = useTaskStore()
  const { projects } = useProjectStore()

  const totalTasks = tasks.length
  const completedToday = tasks.filter(t => {
    const d = new Date(t.completedDate || '')
    const today = new Date()
    return d.toDateString() === today.toDateString()
  }).length
  const inProgress = tasks.filter(t => t.status === 'in_progress').length
  const overdue = tasks.filter(t => isOverdue(t.dueDate) && t.status !== 'done' && t.status !== 'archived').length
  const pendingApprovals = tasks.filter(t => t.status === 'review').length
  const activeProjects = projects.filter(p => p.status === 'active').length
  const weeklyCompleted = tasks.filter(t => {
    const d = new Date(t.completedDate || t.updatedAt)
    const weekAgo = new Date(Date.now() - 86400000 * 7)
    return d > weekAgo
  }).length

  return (
    <div className="space-y-6 max-w-[1600px] animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Welcome back, Alex. Here's your overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => toast.success('Dashboard refreshed')} className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            ↻ Refresh
          </button>
        </div>
      </div>

      {/* Stat Cards - all clickable */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div onClick={() => navigate('/tasks')} className="cursor-pointer"><StatCard title="Total Tasks" value={totalTasks} icon={<CheckSquare size={18} />} color="purple" change={12} subtitle="All projects" /></div>
        <div onClick={() => navigate('/tasks')} className="cursor-pointer"><StatCard title="In Progress" value={inProgress} icon={<Clock size={18} />} color="blue" subtitle="Active tasks" /></div>
        <div onClick={() => navigate('/tasks')} className="cursor-pointer"><StatCard title="Overdue" value={overdue} icon={<AlertTriangle size={18} />} color="rose" change={-5} subtitle="Requires attention" /></div>
        <div onClick={() => navigate('/tasks')} className="cursor-pointer"><StatCard title="Completed Today" value={completedToday} icon={<TrendingUp size={18} />} color="emerald" subtitle="Great progress!" /></div>
        <div onClick={() => navigate('/projects')} className="cursor-pointer"><StatCard title="Active Projects" value={activeProjects} icon={<FolderKanban size={18} />} color="purple" subtitle={projects.filter(p => p.status === 'planning').length + ' in planning'} /></div>
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Weekly Completion</h3>
                  <span className="text-xs text-[var(--text-muted)]">{weeklyCompleted} completed this week</span>
                </div>
              </CardHeader>
              <CardContent><WeeklyCompletionChart /></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Productivity Trend</h3>
                  <span className="text-xs text-[var(--text-muted)]">Hours logged</span>
                </div>
              </CardHeader>
              <CardContent><ProductivityTrend /></CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Burndown Chart</h3>
                  <button onClick={() => navigate('/reports')} className="text-xs accent-text hover:opacity-80">Full report</button>
                </div>
              </CardHeader>
              <CardContent><BurndownChart /></CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Team Workload</h3>
                  <button onClick={() => navigate('/team')} className="text-xs accent-text hover:opacity-80">View team</button>
                </div>
              </CardHeader>
              <CardContent><TeamWorkloadChart /></CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Recent Activity</h3>
                <button onClick={() => toast.success('Loading full activity log...')} className="text-xs accent-text hover:opacity-80">View all</button>
              </div>
            </CardHeader>
            <CardContent className="p-0"><ActivityFeed /></CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Performance Overview</h3>
            </CardHeader>
            <CardContent>
              <ProductivityScore score={78} />
              <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[var(--border)]">
                <div onClick={() => navigate('/tasks')} className="text-center p-3 rounded-xl bg-[var(--bg-surface-hover)] cursor-pointer hover:bg-[var(--bg-input)] transition-colors">
                  <p className="text-lg font-bold text-emerald-500 dark:text-emerald-400">{weeklyCompleted}</p>
                  <p className="text-xs text-[var(--text-muted)]">Done this week</p>
                </div>
                <div onClick={() => navigate('/approvals')} className="text-center p-3 rounded-xl bg-[var(--bg-surface-hover)] cursor-pointer hover:bg-[var(--bg-input)] transition-colors">
                  <p className="text-lg font-bold text-amber-500 dark:text-amber-400">{pendingApprovals}</p>
                  <p className="text-xs text-[var(--text-muted)]">Awaiting review</p>
                </div>
                <div onClick={() => navigate('/timetracking')} className="text-center p-3 rounded-xl bg-[var(--bg-surface-hover)] cursor-pointer hover:bg-[var(--bg-input)] transition-colors">
                  <p className="text-lg font-bold text-blue-500 dark:text-blue-400">{tasks.reduce((a, t) => a + t.actualTime, 0)}h</p>
                  <p className="text-xs text-[var(--text-muted)]">Time logged</p>
                </div>
                <div onClick={() => navigate('/goals')} className="text-center p-3 rounded-xl bg-[var(--bg-surface-hover)] cursor-pointer hover:bg-[var(--bg-input)] transition-colors">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{Math.round(tasks.filter(t => t.status === 'done').length / totalTasks * 100)}%</p>
                  <p className="text-xs text-[var(--text-muted)]">Completion rate</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Today's Tasks</h3>
                <button onClick={() => navigate('/tasks')} className="text-xs accent-text hover:opacity-80">View all</button>
              </div>
            </CardHeader>
            <CardContent className="p-0"><TodayTasks /></CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Upcoming Deadlines</h3>
                <button onClick={() => navigate('/tasks')} className="text-xs accent-text hover:opacity-80">View all</button>
              </div>
            </CardHeader>
            <CardContent className="p-0"><UpcomingTasks /></CardContent>
          </Card>

          {overdue > 0 && (
            <Card className="border-red-500/20">
              <CardHeader className="border-red-500/10">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-red-500 dark:text-red-400" />
                  <h3 className="text-sm font-semibold text-red-600 dark:text-red-400">Overdue Tasks</h3>
                  <span className="text-xs text-red-500 dark:text-red-400 ml-auto">{overdue} items</span>
                </div>
              </CardHeader>
              <CardContent className="p-0"><OverdueTasks /></CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
