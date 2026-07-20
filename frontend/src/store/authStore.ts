import { create } from 'zustand'
import type { User } from '../types'

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

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  verifyOTP: (email: string, otp: string) => Promise<void>
  resendOTP: (email: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (_email: string, _password: string) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))
    set({ user: mockUser, isAuthenticated: true, isLoading: false })
  },
  register: async (_name: string, _email: string, _password: string) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 800))
    set({ isLoading: false })
  },
  verifyOTP: async (_email: string, _otp: string) => {
    set({ isLoading: true })
    await new Promise(r => setTimeout(r, 600))
    set({ user: mockUser, isAuthenticated: true, isLoading: false })
  },
  resendOTP: async (_email: string) => {
    await new Promise(r => setTimeout(r, 400))
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  setUser: (user) => set({ user }),
}))
