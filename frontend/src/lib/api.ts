const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_URL}${path}`, { credentials: 'include' })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
  post: async (path: string, body?: any) => {
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST', credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) throw new Error(await res.text())
    return res.json()
  },
}
