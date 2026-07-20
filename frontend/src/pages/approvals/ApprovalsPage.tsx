import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Badge } from '../../components/ui'
import { cn, timeAgo } from '../../lib/utils'
import { CheckCircle, XCircle, FileText, UserPlus, Target, DollarSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { useNotificationStore } from '../../store/notificationStore'

interface ApprovalItem {
  id: string
  type: string
  title: string
  submittedBy: string
  date: string
  status: string
  priority: string
  details?: string
}

export function ApprovalsPage() {
  const { addNotification } = useNotificationStore()
  const [items, setItems] = useState<ApprovalItem[]>([
    { id: 'a1', type: 'task', title: 'Set up CI/CD pipeline', submittedBy: 'Mike Johnson', date: new Date(Date.now() - 86400000).toISOString(), status: 'pending', priority: 'high' },
    { id: 'a2', type: 'leave', title: 'Annual Leave - Sarah Chen', submittedBy: 'Sarah Chen', date: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'pending', priority: 'medium', details: '5 days (Aug 10-14)' },
    { id: 'a3', type: 'milestone', title: 'Design Phase Completed', submittedBy: 'Emily Davis', date: new Date(Date.now() - 86400000 * 3).toISOString(), status: 'approved', priority: 'high' },
    { id: 'a4', type: 'budget', title: 'Design Tool License Renewal', submittedBy: 'Emily Davis', date: new Date(Date.now() - 86400000 * 4).toISOString(), status: 'pending', priority: 'medium', details: '$2,400/year' },
    { id: 'a5', type: 'task', title: 'API Documentation', submittedBy: 'John Lee', date: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'rejected', priority: 'low' },
  ])

  const handleApprove = (id: string, title: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'approved' } : i))
    addNotification({ title: 'Approved', message: `"${title}" has been approved`, type: 'approval' })
    toast.success(`"${title}" approved!`)
  }

  const handleReject = (id: string, title: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'rejected' } : i))
    addNotification({ title: 'Rejected', message: `"${title}" has been rejected`, type: 'approval' })
    toast.success(`"${title}" rejected`)
  }

  const typeIcons: Record<string, React.ReactNode> = {
    task: <FileText size={16} />, leave: <UserPlus size={16} />,
    milestone: <Target size={16} />, budget: <DollarSign size={16} />,
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Approval Center</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">Review and manage pending approvals</p>
        </div>
        <Badge variant="warning" size="md">{items.filter(a => a.status === 'pending').length} Pending</Badge>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <Card key={item.id} className="animate-slide-in" style={{ animationDelay: `${i * 50}ms` } as any}>
            <CardContent className="p-5">
              <div className="flex items-start gap-4">
                <div className={cn('p-2.5 rounded-xl', item.type === 'leave' ? 'bg-amber-500/15' : item.type === 'budget' ? 'bg-emerald-500/15' : item.type === 'milestone' ? 'bg-purple-500/15' : 'bg-blue-500/15')}>
                  {typeIcons[item.type]}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-[var(--text-primary)]">{item.title}</h3>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">Submitted by {item.submittedBy} · {timeAgo(item.date)}</p>
                      {item.details && <p className="text-xs text-[var(--text-secondary)] mt-1">{item.details}</p>}
                    </div>
                    <Badge variant={item.status === 'approved' ? 'success' : item.status === 'rejected' ? 'danger' : 'warning'} size="sm">{item.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    {item.status === 'pending' ? (
                      <>
                        <Button size="sm" variant="primary" icon={<CheckCircle size={14} />} onClick={() => handleApprove(item.id, item.title)}>Approve</Button>
                        <Button size="sm" variant="ghost" icon={<XCircle size={14} />} onClick={() => handleReject(item.id, item.title)}>Reject</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" onClick={() => toast.success(`Viewing details for "${item.title}"`)}>View Details</Button>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
