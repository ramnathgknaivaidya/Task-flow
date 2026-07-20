import { useState } from 'react'
import { Card, CardHeader, CardContent, Button, Input } from '../../components/ui'
import { cn } from '../../lib/utils'
import { useUIStore } from '../../store/uiStore'
import { User, Palette, Bell, Shield, Key, Sun, Moon, Monitor } from 'lucide-react'
import toast from 'react-hot-toast'

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'api', label: 'API Keys', icon: Key },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState('appearance')
  const { theme, setTheme } = useUIStore()
  const [notifPrefs, setNotifPrefs] = useState({
    email: true, browser: true, mobile: false, sms: false, weeklyDigest: true, taskAssignment: true, deadlineReminders: true, mentions: true,
  })
  const [profile, setProfile] = useState({ firstName: 'Alex', lastName: 'Morgan', email: 'alex@taskflow.com', phone: '+1 (555) 123-4567', title: 'Senior Product Manager', department: 'Engineering' })

  const toggleNotif = (key: keyof typeof notifPrefs) => {
    setNotifPrefs(prev => ({ ...prev, [key]: !prev[key] }))
    toast.success('Preference updated')
  }

  const saveProfile = () => {
    toast.success('Profile saved successfully!')
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">Manage your account and application preferences</p>
      </div>

      <div className="flex gap-6 flex-col lg:flex-row">
        <div className="w-full lg:w-56 shrink-0 space-y-1 flex lg:flex-col gap-1 overflow-x-auto">
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

        <div className="flex-1 max-w-2xl">
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <Card>
                <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Theme</h3></CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { id: 'light', label: 'Light', icon: Sun, desc: 'Light mode' },
                      { id: 'dark', label: 'Dark', icon: Moon, desc: 'Dark mode' },
                      { id: 'system', label: 'System', icon: Monitor, desc: 'Follow system' },
                    ].map((t) => {
                      const Icon = t.icon
                      return (
                        <button key={t.id} onClick={() => { if (t.id !== 'system') { setTheme(t.id as any); toast.success(`${t.label} theme activated`) } }}
                          className={cn('flex flex-col items-center gap-2 p-4 rounded-xl border transition-all',
                            theme === t.id ? 'border-[var(--accent)]/50 accent-light-bg' : 'border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-hover)]')}>
                          <Icon size={24} className={theme === t.id ? 'accent-text' : 'text-[var(--text-secondary)]'} />
                          <span className="text-sm font-medium text-[var(--text-primary)]">{t.label}</span>
                          <span className="text-xs text-[var(--text-muted)]">{t.desc}</span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Layout</h3></CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-[var(--text-primary)]">Compact Sidebar</p><p className="text-xs text-[var(--text-muted)]">Show less detail in sidebar</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" onChange={() => toast.success('Layout preference updated')} />
                      <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:accent-bg after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                  <div className="flex items-center justify-between">
                    <div><p className="text-sm text-[var(--text-primary)]">Reduced Motion</p><p className="text-xs text-[var(--text-muted)]">Minimize animations</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" onChange={() => toast.success('Accessibility preference updated')} />
                      <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:accent-bg after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Notification Preferences</h3></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email' as const, label: 'Email Notifications', desc: 'Receive email updates about tasks' },
                  { key: 'browser' as const, label: 'Browser Notifications', desc: 'Get desktop push notifications' },
                  { key: 'mobile' as const, label: 'Mobile Push', desc: 'Push notifications to your phone' },
                  { key: 'sms' as const, label: 'SMS Notifications', desc: 'Get text messages for urgent items' },
                  { key: 'weeklyDigest' as const, label: 'Weekly Digest', desc: 'Receive a weekly summary email' },
                  { key: 'taskAssignment' as const, label: 'Task Assignment', desc: 'Notify when tasks are assigned to you' },
                  { key: 'deadlineReminders' as const, label: 'Deadline Reminders', desc: 'Get reminded before deadlines' },
                  { key: 'mentions' as const, label: 'Mentions', desc: "Notify when you're mentioned in comments" },
                ].map((n) => (
                  <div key={n.key} className="flex items-center justify-between py-2">
                    <div><p className="text-sm text-[var(--text-primary)]">{n.label}</p><p className="text-xs text-[var(--text-muted)]">{n.desc}</p></div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={notifPrefs[n.key]} onChange={() => toggleNotif(n.key)} />
                      <div className="w-9 h-5 bg-zinc-700 rounded-full peer peer-checked:accent-bg after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-full" />
                    </label>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {activeTab === 'profile' && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Profile Information</h3></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Input label="First Name" value={profile.firstName} onChange={(e: any) => setProfile(p => ({ ...p, firstName: e.target.value }))} />
                  <Input label="Last Name" value={profile.lastName} onChange={(e: any) => setProfile(p => ({ ...p, lastName: e.target.value }))} />
                </div>
                <Input label="Email" value={profile.email} onChange={(e: any) => setProfile(p => ({ ...p, email: e.target.value }))} />
                <Input label="Phone" value={profile.phone} onChange={(e: any) => setProfile(p => ({ ...p, phone: e.target.value }))} />
                <Input label="Job Title" value={profile.title} onChange={(e: any) => setProfile(p => ({ ...p, title: e.target.value }))} />
                <Input label="Department" value={profile.department} onChange={(e: any) => setProfile(p => ({ ...p, department: e.target.value }))} />
                <div className="flex justify-end pt-2"><Button onClick={saveProfile}>Save Changes</Button></div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">Security Settings</h3></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm text-[var(--text-primary)]">Two-Factor Authentication</p><p className="text-xs text-[var(--text-muted)]">Add an extra layer of security</p></div>
                  <Button variant="outline" size="sm" onClick={() => toast.success('2FA setup initiated')}>Enable</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm text-[var(--text-primary)]">Active Sessions</p><p className="text-xs text-[var(--text-muted)]">Manage your active sessions</p></div>
                  <Button variant="outline" size="sm" onClick={() => toast.success('Viewing active sessions')}>View</Button>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div><p className="text-sm text-[var(--text-primary)]">Password</p><p className="text-xs text-[var(--text-muted)]">Last changed 3 months ago</p></div>
                  <Button variant="outline" size="sm" onClick={() => toast.success('Password change dialog opened')}>Change</Button>
                </div>
                <div className="pt-4 border-t border-[var(--border)]">
                  <Button variant="danger" size="sm" onClick={() => { if (confirm('Are you sure you want to delete your account?')) toast.success('Account deletion request submitted') }}>Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === 'api' && (
            <Card>
              <CardHeader><h3 className="text-sm font-semibold text-[var(--text-primary)]">API Keys</h3></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-hover)]">
                  <div><p className="text-sm text-[var(--text-primary)]">Production Key</p><p className="text-xs text-[var(--text-muted)]">Created Jan 15, 2026</p></div>
                  <code className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-1 rounded-lg">tf_live_•••••••••••</code>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-surface-hover)]">
                  <div><p className="text-sm text-[var(--text-primary)]">Development Key</p><p className="text-xs text-[var(--text-muted)]">Created Mar 2, 2026</p></div>
                  <code className="text-xs text-[var(--text-muted)] bg-[var(--bg-surface)] px-2 py-1 rounded-lg">tf_test_•••••••••••</code>
                </div>
                <Button variant="outline" size="sm" onClick={() => toast.success('New API key generated')}>Generate New Key</Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
