import { Search, Bell, Moon, Sun, Menu, Plus, ChevronDown, Settings, LogOut, Shield } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useUIStore } from '../../store/uiStore'
import { useNotificationStore } from '../../store/notificationStore'
import { useAuthStore } from '../../store/authStore'
import { Dropdown, DropdownItem } from '../ui/Dropdown'
import { Avatar } from '../ui/Avatar'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export function Header() {
  const { theme, setTheme } = useUIStore()
  const { notifications, markAllAsRead, markAsRead, unreadCount } = useNotificationStore()
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/tasks?search=${encodeURIComponent(searchQuery.trim())}`)
      toast.success(`Searching for "${searchQuery}"`)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out successfully')
  }

  return (
    <header className="h-16 header-bg backdrop-blur-md border-b border-[var(--border)] flex items-center justify-between px-4 lg:px-6 shrink-0">
      <div className="flex items-center gap-4">
        <button
          onClick={() => {}} 
          className="lg:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
          aria-label="Toggle menu"
        >
          <Menu size={20} />
        </button>
        <div className={cn(
          'hidden md:flex items-center gap-2.5 input-bg border rounded-xl px-3.5 py-2 w-72 transition-all',
          searchFocused ? 'border-[var(--accent)]/50 ring-1 ring-[var(--accent)]/20' : 'border-[var(--border)]'
        )}>
          <Search size={16} className="text-[var(--text-muted)] shrink-0" />
          <input
            ref={searchRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search tasks, projects, people..."
            className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none w-full"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <kbd className="text-[11px] text-[var(--text-muted)] bg-[var(--bg-surface-hover)] px-1.5 py-0.5 rounded-md hidden lg:inline">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Dropdown
          trigger={
            <button className="hidden sm:flex items-center gap-2 accent-bg hover:opacity-90 text-white text-sm font-medium px-4 py-2 rounded-xl transition-all">
              <Plus size={16} /> <span>Quick Add</span> <ChevronDown size={14} />
            </button>
          }
          align="right"
        >
          <DropdownItem onClick={() => { navigate('/tasks'); toast.success('Opening task creator') }}>
            <Plus size={14} /> Add Task
          </DropdownItem>
          <DropdownItem onClick={() => { navigate('/meetings'); toast.success('Opening meeting scheduler') }}>
            <Plus size={14} /> Schedule Meeting
          </DropdownItem>
          <DropdownItem onClick={() => { navigate('/projects'); toast.success('Opening project creator') }}>
            <Plus size={14} /> Create Project
          </DropdownItem>
        </Dropdown>

        <button
          onClick={() => {
            const newTheme = theme === 'dark' ? 'light' : 'dark'
            setTheme(newTheme)
            toast.success(`${newTheme === 'dark' ? 'Dark' : 'Light'} mode activated`)
          }}
          className="p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <Dropdown
          trigger={
            <button className="relative p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]" aria-label="Notifications">
              <Bell size={18} />
              {unreadCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount()}
                </span>
              )}
            </button>
          }
          align="right"
          className="w-80"
        >
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
            <span className="text-sm font-medium text-[var(--text-primary)]">Notifications</span>
            <button onClick={() => { markAllAsRead(); toast.success('All notifications marked as read') }} className="text-xs accent-text hover:opacity-80">
              Mark all read
            </button>
          </div>
          <div className="max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-sm text-[var(--text-muted)] text-center py-6">No notifications</p>
            ) : (
              notifications.slice(0, 5).map((n) => (
                <button
                  key={n.id}
                  onClick={() => { markAsRead(n.id); if (n.link) navigate(n.link) }}
                  className={cn(
                    'w-full text-left px-4 py-3 border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-surface-hover)] transition-colors',
                    !n.read && 'accent-light-bg'
                  )}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', !n.read ? 'accent-bg' : 'bg-transparent')} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--text-primary)]">{n.title}</p>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
          <div className="px-4 py-2 border-t border-[var(--border)]">
            <button onClick={() => navigate('/settings')} className="w-full text-center text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)]">
              View all notifications
            </button>
          </div>
        </Dropdown>

        <Dropdown
          trigger={
            <button className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-[var(--bg-surface-hover)] transition-colors">
              <Avatar name={user?.name || 'User'} size="sm" />
              <span className="hidden lg:block text-sm text-[var(--text-primary)]">{user?.name}</span>
            </button>
          }
          align="right"
        >
          <div className="px-4 py-2.5 border-b border-[var(--border)]">
            <p className="text-sm font-medium text-[var(--text-primary)]">{user?.name}</p>
            <p className="text-xs text-[var(--text-secondary)]">{user?.email}</p>
          </div>
          <DropdownItem onClick={() => navigate('/settings')}><Settings size={14} /> Settings</DropdownItem>
          <DropdownItem onClick={() => navigate('/admin')}><Shield size={14} /> Admin Panel</DropdownItem>
          <div className="border-t border-[var(--border)] mt-1 pt-1">
            <DropdownItem onClick={handleLogout} danger><LogOut size={14} /> Sign Out</DropdownItem>
          </div>
        </Dropdown>
      </div>
    </header>
  )
}
