import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, FolderKanban, Users, Calendar,
  Clock, FileText, BarChart3, CheckCircle, UserCircle, Building2,
  Target, Settings, Shield, ChevronLeft, ChevronRight,
  LogOut, Bell, Search, ChevronDown,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { useUIStore } from '../../store/uiStore'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useState } from 'react'

const menuGroups = [
  {
    label: 'Main',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
      { icon: CheckSquare, label: 'Tasks', path: '/tasks' },
      { icon: FolderKanban, label: 'Projects', path: '/projects' },
      { icon: Users, label: 'Team', path: '/team' },
      { icon: Calendar, label: 'Calendar', path: '/calendar' },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { icon: Clock, label: 'Meetings', path: '/meetings' },
      { icon: Clock, label: 'Time Tracking', path: '/timetracking' },
      { icon: FileText, label: 'Files', path: '/files' },
    ],
  },
  {
    label: 'Analytics',
    items: [
      { icon: BarChart3, label: 'Reports', path: '/reports' },
      { icon: CheckCircle, label: 'Approvals', path: '/approvals' },
    ],
  },
  {
    label: 'Organization',
    items: [
      { icon: UserCircle, label: 'Directory', path: '/directory' },
      { icon: Building2, label: 'Departments', path: '/departments' },
      { icon: Target, label: 'Goals & OKRs', path: '/goals' },
    ],
  },
  {
    label: 'System',
    items: [
      { icon: Settings, label: 'Settings', path: '/settings' },
      { icon: Shield, label: 'Admin', path: '/admin' },
    ],
  },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { user, logout } = useAuthStore()
  const location = useLocation()
  const [expandedGroups] = useState<string[] | undefined>()

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen sidebar-bg border-r border-[var(--border)] flex flex-col z-40 transition-all duration-200',
        sidebarCollapsed ? 'w-[68px]' : 'w-60'
      )}
    >
      {/* Logo */}
      <div className={cn('flex items-center h-16 px-4 border-b border-[var(--border)] shrink-0', sidebarCollapsed && 'justify-center')}>
        {sidebarCollapsed ? (
          <div className="w-8 h-8 rounded-lg accent-bg flex items-center justify-center">
            <CheckSquare size={16} className="text-white" />
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg accent-bg flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <span className="font-semibold text-base text-[var(--text-primary)]">TaskFlow</span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2.5 py-4 space-y-5">
        {menuGroups.map((group) => (
          <div key={group.label}>
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between w-full px-2 mb-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                  {group.label}
                </span>
              </div>
            )}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all',
                      isActive
                        ? 'accent-light-bg accent-text font-medium'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]',
                      sidebarCollapsed && 'justify-center px-2'
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon size={18} className="shrink-0" />
                    {!sidebarCollapsed && <span>{item.label}</span>}
                    {item.label === 'Tasks' && !sidebarCollapsed && (
                      <span className="ml-auto text-xs accent-light-bg accent-text px-1.5 py-0.5 rounded-md font-medium">
                        12
                      </span>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User */}
      <div className={cn('border-t border-[var(--border)] p-3 shrink-0', sidebarCollapsed && 'px-2')}>
        {sidebarCollapsed ? (
          <div className="flex flex-col items-center gap-2">
            <div className="w-9 h-9 rounded-full accent-light-bg accent-text flex items-center justify-center text-sm font-medium cursor-pointer">
              {user?.name.charAt(0)}
            </div>
            <button onClick={logout} className="p-2 rounded-xl text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]">
              <LogOut size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full accent-light-bg accent-text flex items-center justify-center text-sm font-medium">
              {user?.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name}</p>
              <p className="text-xs text-[var(--text-muted)] truncate capitalize">{user?.role}</p>
            </div>
            <button onClick={logout} className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]">
              <LogOut size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[var(--bg-elevated)] border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-secondary)] z-50"
      >
        {sidebarCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </button>
    </aside>
  )
}
