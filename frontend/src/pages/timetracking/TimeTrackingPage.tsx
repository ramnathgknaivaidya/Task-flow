import { useState, useEffect, useRef } from 'react'
import { Card, CardHeader, CardContent, Button, Badge } from '../../components/ui'
import { cn } from '../../lib/utils'
import { Play, Square, Pause, Clock, Calendar, TrendingUp, Download } from 'lucide-react'
import toast from 'react-hot-toast'

export function TimeTrackingPage() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [currentTask, setCurrentTask] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning])

  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const startTimer = () => {
    if (!currentTask.trim()) { toast.error('Please enter a task name'); return }
    setIsRunning(true)
    toast.success(`Timer started for "${currentTask}"`)
  }

  const stopTimer = () => {
    setIsRunning(false)
    const hours = (seconds / 3600).toFixed(2)
    toast.success(`Logged ${hours}h for "${currentTask}"`)
    setSeconds(0)
    setCurrentTask('')
  }

  const pauseTimer = () => {
    setIsRunning(false)
    toast.info('Timer paused')
  }

  const weeklyEntries = [
    { day: 'Monday', hours: 6.5, tasks: ['Design new landing page', 'API Documentation'] },
    { day: 'Tuesday', hours: 7.2, tasks: ['Authentication flow', 'Team standup'] },
    { day: 'Wednesday', hours: 5.8, tasks: ['Design review', 'Code review'] },
    { day: 'Thursday', hours: 8.1, tasks: ['Payment fix', 'Sprint planning'] },
    { day: 'Friday', hours: 6.9, tasks: ['Documentation', '1:1 meeting'] },
    { day: 'Saturday', hours: 2.0, tasks: ['Catch up on tasks'] },
    { day: 'Sunday', hours: 0, tasks: [] },
  ]
  const totalHours = weeklyEntries.reduce((a, e) => a + e.hours, 0)

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Time Tracking</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Track your work hours and productivity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<Download size={15} />} onClick={() => toast.success('Timesheet exported')}>Export Timesheet</Button>
        </div>
      </div>

      {/* Timer */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-6">
              <div className={cn('p-4 rounded-2xl', isRunning ? 'bg-emerald-500/15' : 'bg-[var(--bg-surface-hover)]')}>
                <Clock size={32} className={isRunning ? 'text-emerald-500' : 'text-[var(--text-muted)]'} />
              </div>
              <div>
                <p className="text-3xl font-bold text-[var(--text-primary)] font-mono">{formatTime(seconds)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <input type="text" placeholder="What are you working on?" value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                    className="input-bg border border-[var(--border)] rounded-lg px-3 py-1.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 w-64"
                    disabled={isRunning} />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {isRunning ? (
                <>
                  <Button variant="secondary" size="sm" icon={<Pause size={14} />} onClick={pauseTimer}>Pause</Button>
                  <Button variant="danger" size="sm" icon={<Square size={14} />} onClick={stopTimer}>Stop</Button>
                </>
              ) : (
                <Button size="lg" icon={<Play size={16} />} onClick={startTimer}>Start Timer</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">This Week</h3>
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-[var(--text-muted)]" />
                  <span className="text-xs text-[var(--text-muted)]">July 14 - July 20, 2026</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {weeklyEntries.map((entry, i) => (
                <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-surface-hover)] transition-colors">
                  <div className="w-20"><span className="text-sm text-[var(--text-primary)]">{entry.day}</span></div>
                  <div className="flex-1">
                    <div className="h-2 rounded-full bg-[var(--bg-surface-hover)] overflow-hidden">
                      <div className="h-full rounded-full accent-bg transition-all" style={{ width: `${(entry.hours / 8) * 100}%` }} />
                    </div>
                    {entry.tasks.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1.5">
                        {entry.tasks.map((t, j) => <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--bg-surface-hover)] text-[var(--text-muted)]">{t}</span>)}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-medium text-[var(--text-primary)] w-16 text-right">{entry.hours}h</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Total Hours</span>
                <span className="text-2xl font-bold text-[var(--text-primary)]">{totalHours}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Billable Hours</span>
                <span className="text-lg font-semibold text-emerald-500">{Math.round(totalHours * 0.85)}h</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--text-muted)]">Daily Average</span>
                <span className="text-lg font-semibold text-[var(--text-primary)]">{(totalHours / 7).toFixed(1)}h</span>
              </div>
              <div className="pt-3 border-t border-[var(--border)]">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-emerald-500" />
                  <span className="text-xs text-emerald-500">12% more than last week</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Actions</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="secondary" size="sm" className="w-full" onClick={() => toast.success('Opening manual log')}>Manual Log Entry</Button>
              <Button variant="secondary" size="sm" className="w-full" onClick={() => toast.success('Weekly report generated')}>Generate Report</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
