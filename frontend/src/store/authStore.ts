import { create } from 'zustand'
import type { User } from '../types'

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

async function apiPost(path: string, body: any) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
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

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (name: string, email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async (email, password) => {
    set({ isLoading: true })
    try {
      const data = await apiPost('/auth/login', { email, password })
      const u = data.user
      set({
        user: { ...mockUser, id: u.id, email: u.email, name: u.name, role: u.role },
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err: any) {
      set({ isLoading: false })
      throw err
    }
  },
  register: async (name, email, password) => {
    set({ isLoading: true })
    try {
      const data = await apiPost('/auth/register', { name, email, password })
      const u = data.user
      set({
        user: { ...mockUser, id: u.id, email: u.email, name: u.name, role: u.role },
        isAuthenticated: true,
        isLoading: false,
      })
    } catch (err: any) {
      set({ isLoading: false })
      throw err
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false })
  },
  setUser: (user) => set({ user }),
}))
