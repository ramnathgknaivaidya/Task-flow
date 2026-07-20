import { create } from 'zustand'
import type { User } from '../types'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

const mockUser: User = {
  id: '1',
  email: 'admin@taskflow.com',
  name: 'Alex Morgan',
  role: 'admin',
  department: 'Engineering',
  title: 'Senior Product Manager',
  skills: ['Project Management', 'Agile', 'Leadership'],
  timezone: 'America/New_York',
  online: true,
  lastActive: new Date().toISOString(),
  experience: 8,
  availability: 'available',
}

export const useAuthStore = create<AuthState>((set) => ({
  user: mockUser,
  isAuthenticated: true,
  isLoading: false,
  login: async (_email: string, _password: string) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))
    set({ user: mockUser, isAuthenticated: true, isLoading: false })
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  setUser: (user) => set({ user }),
}))
