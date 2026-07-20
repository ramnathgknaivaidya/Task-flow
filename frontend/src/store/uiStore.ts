import { create } from 'zustand'
import type { ViewMode } from '../types'

interface UIState {
  sidebarCollapsed: boolean
  theme: 'light' | 'dark'
  viewMode: ViewMode
  toggleSidebar: () => void
  setTheme: (theme: 'light' | 'dark') => void
  setViewMode: (mode: ViewMode) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  theme: 'dark',
  viewMode: 'kanban',
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setTheme: (theme) => {
    set({ theme })
    document.documentElement.classList.toggle('dark', theme === 'dark')
  },
  setViewMode: (mode) => set({ viewMode: mode }),
}))
