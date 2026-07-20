import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Badge, Modal, Input } from '../../components/ui'
import { cn } from '../../lib/utils'
import { useTaskStore } from '../../store/taskStore'
import { useNotificationStore } from '../../store/notificationStore'
import { ChevronLeft, ChevronRight, Plus, Clock, Video } from 'lucide-react'
import toast from 'react-hot-toast'

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [view] = useState<'month' | 'week' | 'day'>('month')
  const [showAdd, setShowAdd] = useState(false)
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '' })
  const { tasks } = useTaskStore()
  const { addNotification } = useNotificationStore()

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const getTasksForDay = (day: number) =>
    tasks.filter(t => { const d = new Date(t.dueDate); return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year })

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) { toast.error('Event title is required'); return }
    addNotification({ title: 'Event Created', message: `"${newEvent.title}" added to calendar`, type: 'system_alert' })
    setNewEvent({ title: '', date: '', time: '' })
    setShowAdd(false)
    toast.success(`Event "${newEvent.title}" added!`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Calendar</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Schedule, tasks, and events</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-[var(--bg-surface)] rounded-xl p-1 border border-[var(--border)]">
            {['month', 'week', 'day'].map((v) => (
              <button key={v} onClick={() => toast.success(`Switched to ${v} view`)}
                className={cn('px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  view === v ? 'accent-light-bg accent-text' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]')}>{v}</button>
            ))}
          </div>
          <Button icon={<Plus size={16} />} onClick={() => setShowAdd(true)}>Add Event</Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]"><ChevronLeft size={18} /></button>
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">{monthName}</h2>
              <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)]"><ChevronRight size={18} /></button>
            </div>
            <button onClick={() => { setCurrentDate(new Date()); toast.success('Jumped to today') }} className="text-xs accent-text hover:opacity-80">Today</button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-7 border-b border-[var(--border)]">
            {weekDays.map((d) => <div key={d} className="px-3 py-2.5 text-xs font-medium text-[var(--text-muted)] text-center">{d.slice(0, 3)}</div>)}
          </div>
          <div className="grid grid-cols-7">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} className="min-h-[110px] border-b border-r border-[var(--border)] p-2" />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1
              const d = new Date(year, month, day)
              const isToday = d.toDateString() === new Date().toDateString()
              const dayTasks = getTasksForDay(day)
              return (
                <div key={day} className={cn('min-h-[110px] border-b border-r border-[var(--border)] p-2 transition-colors hover:bg-[var(--bg-surface-hover)]', isToday && 'accent-light-bg')}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={cn('text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full', isToday ? 'accent-bg text-white' : 'text-[var(--text-secondary)]')}>{day}</span>
                  </div>
                  <div className="space-y-1">
                    {dayTasks.slice(0, 3).map((t) => (
                      <div key={t.id} className="text-[10px] px-1.5 py-0.5 rounded accent-light-bg accent-text truncate cursor-pointer hover:opacity-80"
                        onClick={() => toast.success(`Task: ${t.title}`)}>
                        {t.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && <div className="text-[10px] text-[var(--text-muted)] px-1">+{dayTasks.length - 3} more</div>}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Actions</h3></CardHeader>
        <CardContent className="flex gap-3">
          <Button size="sm" variant="secondary" icon={<Plus size={13} />} onClick={() => setShowAdd(true)}>Add Event</Button>
          <Button size="sm" variant="secondary" onClick={() => { setCurrentDate(new Date()); toast.success('Jumped to today') }}>Today</Button>
          <Button size="sm" variant="secondary" onClick={() => toast.success('Calendar synced')}>Sync Calendar</Button>
        </CardContent>
      </Card>

      <Modal open={showAdd} onClose={() => setShowAdd(false)} title="Add Event">
        <div className="space-y-4">
          <Input label="Event Title" placeholder="Enter event title" value={newEvent.title}
            onChange={(e: any) => setNewEvent(p => ({ ...p, title: e.target.value }))} />
          <Input label="Date" type="date" value={newEvent.date}
            onChange={(e: any) => setNewEvent(p => ({ ...p, date: e.target.value }))} />
          <Input label="Time" type="time" value={newEvent.time}
            onChange={(e: any) => setNewEvent(p => ({ ...p, time: e.target.value }))} />
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button onClick={handleAddEvent}>Add Event</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
