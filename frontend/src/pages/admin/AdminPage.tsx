import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Badge } from '../../components/ui'
import { cn } from '../../lib/utils'
import { Shield, Users, Activity, Database, Settings, UserPlus, Lock, RefreshCw, Download, Sliders, CheckCircle, XCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'roles', label: 'Roles & Permissions', icon: Shield },
  { id: 'audit', label: 'Audit Logs', icon: Activity },
  { id: 'backup', label: 'Backup & Restore', icon: Database },
  { id: 'settings', label: 'System Settings', icon: Settings },
]

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('users')
  const [users, setUsers] = useState([
    { name: 'Alex Morgan', email: 'alex@taskflow.com', role: 'Admin', status: 'active' as const },
    { name: 'Sarah Chen', email: 'sarah@taskflow.com', role: 'Developer', status: 'active' as const },
    { name: 'Mike Johnson', email: 'mike@taskflow.com', role: 'Developer', status: 'active' as const },
    { name: 'Emily Davis', email: 'emily@taskflow.com', role: 'Designer', status: 'active' as const },
    { name: 'John Lee', email: 'john@taskflow.com', role: 'QA', status: 'inactive' as const },
  ])
  const [backups] = useState([
    { date: 'Jul 20, 2026', size: '256 MB', status: 'Completed' as const },
    { date: 'Jul 19, 2026', size: '254 MB', status: 'Completed' as const },
    { date: 'Jul 18, 2026', size: '250 MB', status: 'Completed' as const },
  ])

  const toggleUserStatus = (email: string) => {
    setUsers(prev => prev.map(u => u.email === email ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u))
    const user = users.find(u => u.email === email)
    toast.success(`${user?.name} ${user?.status === 'active' ? 'deactivated' : 'activated'}`)
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Admin Panel</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">System administration and configuration</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="w-full lg:w-48 shrink-0 space-y-1 flex lg:flex-col gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={cn('flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm transition-all whitespace-nowrap',
                  activeTab === tab.id ? 'accent-light-bg accent-text font-medium' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]')}>
                <Icon size={16} /> <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        <div className="flex-1 max-w-3xl">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">User Management ({users.length} total)</h3>
                <Button size="sm" icon={<UserPlus size={14} />} onClick={() => toast.success('Invitation sent!')}>Invite User</Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  {users.map((u, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-surface-hover)]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full accent-light-bg accent-text flex items-center justify-center text-xs font-medium">
                          {u.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div><p className="text-sm text-[var(--text-primary)]">{u.name}</p><p className="text-xs text-[var(--text-muted)]">{u.email}</p></div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge size="sm">{u.role}</Badge>
                        <Badge variant={u.status === 'active' ? 'success' : 'default'} size="sm">{u.status}</Badge>
                        <button onClick={() => toggleUserStatus(u.email)} className="p-1.5 rounded-lg hover:bg-[var(--bg-surface-hover)] text-[var(--text-muted)] hover:text-[var(--text-primary)]" title="Toggle user status">
                          <Lock size={13} />
                        </button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[var(--text-primary)]">Roles & Permissions</h3>
                <Button size="sm" icon={<Sliders size={14} />} onClick={() => toast.success('Role manager opened')}>Manage Roles</Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  {[
                    { role: 'Administrator', users: 2, permissions: 'Full access to all features' },
                    { role: 'Manager', users: 5, permissions: 'Department management, reports, approvals' },
                    { role: 'Team Lead', users: 8, permissions: 'Team management, task assignment' },
                    { role: 'Employee', users: 20, permissions: 'Task management, personal workspace' },
                    { role: 'HR', users: 3, permissions: 'Employee management, departments' },
                  ].map((r, i) => (
                    <div key={i} className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-surface-hover)]">
                      <div><p className="text-sm font-medium text-[var(--text-primary)]">{r.role}</p><p className="text-xs text-[var(--text-muted)]">{r.permissions}</p></div>
                      <div className="flex items-center gap-3">
                        <Badge size="sm">{r.users} users</Badge>
                        <Button size="sm" variant="ghost" onClick={() => toast.success(`Editing ${r.role} permissions`)}>Edit</Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'audit' && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-[var(--text-primary)]">Audit Logs</h3>
                  <Button size="sm" variant="outline" icon={<Download size={13} />} onClick={() => toast.success('Audit log exported')}>Export</Button>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {[
                  { action: 'User login', user: 'Alex Morgan', time: '2 min ago', ip: '192.168.1.1' },
                  { action: 'Task created', user: 'Sarah Chen', time: '15 min ago', ip: '192.168.1.2' },
                  { action: 'Project updated', user: 'Alex Morgan', time: '1 hour ago', ip: '192.168.1.1' },
                  { action: 'Role modified', user: 'Admin', time: '3 hours ago', ip: '192.168.1.1' },
                  { action: 'User invited', user: 'Admin', time: '1 day ago', ip: '192.168.1.1' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] last:border-0 text-sm">
                    <div className="flex items-center gap-3">
                      <Activity size={12} className="text-[var(--text-muted)]" />
                      <span className="text-[var(--text-primary)]">{log.action}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-muted)]">
                      <span>{log.user}</span><span>{log.time}</span>
                      <code className="text-[10px] bg-[var(--bg-surface-hover)] px-1.5 py-0.5 rounded">{log.ip}</code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <Card>
                <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Backup & Restore</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-surface-hover)]">
                    <div className="flex items-center gap-3">
                      <Database size={18} className="accent-text" />
                      <div><p className="text-sm text-[var(--text-primary)]">Latest Backup</p><p className="text-xs text-[var(--text-muted)]">July 20, 2026 at 02:00 AM · 256 MB</p></div>
                    </div>
                    <Badge variant="success">Completed</Badge>
                  </div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <Button icon={<RefreshCw size={14} />} onClick={() => toast.success('Backup initiated')}>Create Backup Now</Button>
                    <Button variant="outline" icon={<Download size={14} />} onClick={() => toast.success('Backup downloaded')}>Download Backup</Button>
                    <Button variant="ghost" onClick={() => toast.success('Restore wizard opened')}>Restore</Button>
                  </div>
                  <div className="space-y-2 pt-4 border-t border-[var(--border)]">
                    <h4 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">Backup History</h4>
                    {backups.map((b, i) => (
                      <div key={i} className="flex items-center justify-between py-2 text-sm">
                        <span className="text-[var(--text-secondary)]">{b.date}</span>
                        <div className="flex items-center gap-4">
                          <span className="text-[var(--text-muted)]">{b.size}</span>
                          <Badge variant="success" size="sm">{b.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'settings' && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">System Settings</h3></CardHeader>
              <CardContent className="space-y-5">
                {[
                  { label: 'Organization Name', value: 'TaskFlow Inc.' },
                  { label: 'Default Timezone', value: 'America/New_York' },
                  { label: 'Max Upload Size', value: '50 MB' },
                  { label: 'Session Timeout', value: '30 minutes' },
                  { label: 'Password Policy', value: '8+ chars, special chars required' },
                ].map((setting, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-[var(--border)] last:border-0">
                    <span className="text-sm text-[var(--text-primary)]">{setting.label}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[var(--text-muted)]">{setting.value}</span>
                      <button onClick={() => toast.success(`Editing ${setting.label}`)} className="text-xs accent-text hover:opacity-80">Edit</button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
