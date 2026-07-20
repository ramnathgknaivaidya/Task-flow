import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '../../store/uiStore'
import { cn } from '../../lib/utils'

export function Layout() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen bg-[var(--bg-base)] text-[var(--text-primary)]">
      <Sidebar />
      <div className={cn(
        'flex-1 flex flex-col transition-all duration-200',
        sidebarCollapsed ? 'ml-[68px]' : 'ml-60'
      )}>
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
