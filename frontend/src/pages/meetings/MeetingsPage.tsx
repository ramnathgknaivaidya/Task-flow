import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Badge, Avatar, Input, Modal } from '../../components/ui'
import { cn, formatDate } from '../../lib/utils'
import { Video, Plus, Clock, Users, Calendar, Play, FileText, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNotificationStore } from '../../store/notificationStore'

export function MeetingsPage() {
  const { addNotification } = useNotificationStore()
  const [showNew, setShowNew] = useState(false)
  const [filter, setFilter] = useState('all')
  const [newMeeting, setNewMeeting] = useState({ title: '', agenda: '', date: '', time: '', participants: '' })

  const meetings = [
    { id: 'm1', title: 'Sprint Planning', agenda: 'Plan sprint goals, assign tasks, and estimate effort.', date: new Date(Date.now() + 86400000).toISOString(), startTime: '10:00', endTime: '11:30', participants: ['Alex M.', 'Sarah C.', 'Mike J.', 'Emily D.'], recurring: true, status: 'upcoming' },
    { id: 'm2', title: 'Design Review', agenda: 'Review the new landing page designs and provide feedback.', date: new Date(Date.now() + 86400000 * 2).toISOString(), startTime: '14:00', endTime: '15:00', participants: ['Emily D.', 'Alex M.'], recurring: false, status: 'upcoming' },
    { id: 'm3', title: 'Weekly Team Standup', agenda: 'Quick sync on progress, blockers, and priorities.', date: new Date().toISOString(), startTime: '09:30', endTime: '09:45', participants: ['Team'], recurring: true, status: 'in_progress' },
    { id: 'm4', title: 'Product Demo', agenda: 'Demo new features to stakeholders and collect feedback.', date: new Date(Date.now() + 86400000 * 5).toISOString(), startTime: '15:00', endTime: '16:00', participants: ['Alex M.', 'Sarah C.', 'John L.'], recurring: false, status: 'upcoming' },
    { id: 'm5', title: 'Q3 Planning Session', agenda: 'Plan objectives and key results for Q3 2026.', date: new Date(Date.now() - 86400000 * 2).toISOString(), startTime: '10:00', endTime: '12:00', participants: ['Alex M.', 'Anna K.', 'David W.'], recurring: false, status: 'completed' },
  ]

  const filtered = filter === 'all' ? meetings : meetings.filter(m => m.status === filter)

  const handleSchedule = () => {
    if (!newMeeting.title.trim()) { toast.error('Meeting title is required'); return }
    addNotification({ title: 'Meeting Scheduled', message: `"${newMeeting.title}" has been created`, type: 'system_alert' })
    setNewMeeting({ title: '', agenda: '', date: '', time: '', participants: '' })
    setShowNew(false)
    toast.success(`Meeting "${newMeeting.title}" scheduled!`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Meetings</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Schedule and manage team meetings</p>
        </div>
        <Button icon={<Plus size={16} />} onClick={() => setShowNew(true)}>Schedule Meeting</Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {['all', 'upcoming', 'in_progress', 'completed'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={cn('px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all',
              filter === s ? 'accent-light-bg accent-text' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] bg-[var(--bg-surface)]')}>
            {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((meeting, i) => (
          <Card key={meeting.id} hover className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={cn('p-3 rounded-xl', meeting.status === 'completed' ? 'bg-emerald-500/15' : meeting.status === 'in_progress' ? 'bg-amber-500/15' : 'bg-blue-500/15')}>
                  <Video size={20} className={meeting.status === 'completed' ? 'text-emerald-500' : meeting.status === 'in_progress' ? 'text-amber-500' : 'text-blue-500'} />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-base font-semibold text-[var(--text-primary)]">{meeting.title}</h3>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">{meeting.agenda}</p>
                    </div>
                    <Badge variant={meeting.status === 'completed' ? 'success' : meeting.status === 'in_progress' ? 'warning' : 'info'} size="sm">
                      {meeting.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(meeting.date)}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {meeting.startTime} - {meeting.endTime}</span>
                    <span className="flex items-center gap-1"><Users size={12} /> {meeting.participants.length} participants</span>
                    {meeting.recurring && <Badge size="sm">Recurring</Badge>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-3">
                    {meeting.participants.slice(0, 5).map((p, j) => <Avatar key={j} name={p} size="sm" />)}
                    {meeting.participants.length > 5 && <span className="text-xs text-[var(--text-muted)] ml-1">+{meeting.participants.length - 5}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {meeting.status === 'upcoming' && (
                    <Button size="sm" icon={<Play size={13} />} onClick={() => toast.success(`Joining "${meeting.title}"...`)}>Join</Button>
                  )}
                  {meeting.status === 'completed' && (
                    <Button size="sm" variant="ghost" icon={<FileText size={13} />} onClick={() => toast.success(`Viewing notes for "${meeting.title}"`)}>Notes</Button>
                  )}
                  {meeting.status === 'in_progress' && (
                    <Button size="sm" icon={<Play size={13} />} onClick={() => toast.success(`Joining "${meeting.title}"...`)}>Join Now</Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Modal open={showNew} onClose={() => setShowNew(false)} title="Schedule New Meeting" size="lg">
        <div className="space-y-4">
          <Input label="Meeting Title" placeholder="Enter meeting title" value={newMeeting.title}
            onChange={(e: any) => setNewMeeting(p => ({ ...p, title: e.target.value }))} />
          <div>
            <label className="text-sm font-medium text-[var(--text-primary)] block mb-1.5">Agenda</label>
            <textarea value={newMeeting.agenda} onChange={(e) => setNewMeeting(p => ({ ...p, agenda: e.target.value }))}
              className="w-full input-bg border border-[var(--border)] rounded-xl px-3.5 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/50 min-h-[80px]" placeholder="Describe the meeting agenda..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={newMeeting.date}
              onChange={(e: any) => setNewMeeting(p => ({ ...p, date: e.target.value }))} />
            <Input label="Time" type="time" value={newMeeting.time}
              onChange={(e: any) => setNewMeeting(p => ({ ...p, time: e.target.value }))} />
          </div>
          <Input label="Participants" placeholder="Add participants..." value={newMeeting.participants}
            onChange={(e: any) => setNewMeeting(p => ({ ...p, participants: e.target.value }))} />
          <div className="flex items-center gap-2">
            <input type="checkbox" id="recurring" className="rounded border-zinc-700 accent-[var(--accent)]" />
            <label htmlFor="recurring" className="text-sm text-[var(--text-primary)]">Recurring meeting</label>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowNew(false)}>Cancel</Button>
            <Button onClick={handleSchedule}>Schedule</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
