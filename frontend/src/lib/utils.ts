import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatTime(date: string): string {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: string): string {
  return `${formatDate(date)} ${formatTime(date)}`
}

export function timeAgo(date: string): string {
  const now = new Date()
  const d = new Date(date)
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(date)
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11)
}

export function isOverdue(dueDate: string): boolean {
  return new Date(dueDate) < new Date()
}

export function isToday(date: string): boolean {
  const d = new Date(date)
  const today = new Date()
  return d.toDateString() === today.toDateString()
}

export function isThisWeek(date: string): boolean {
  const d = new Date(date)
  const today = new Date()
  const weekStart = new Date(today)
  weekStart.setDate(today.getDate() - today.getDay())
  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 7)
  return d >= weekStart && d < weekEnd
}

export const statusColors: Record<string, string> = {
  backlog: 'bg-gray-500/15 text-gray-600 dark:text-gray-400',
  todo: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  in_progress: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  review: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  done: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  archived: 'bg-gray-500/15 text-gray-600 dark:text-gray-400',
}

export const priorityColors: Record<string, string> = {
  none: 'bg-gray-500/15 text-gray-600 dark:text-gray-400',
  low: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  medium: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  high: 'bg-orange-500/15 text-orange-600 dark:text-orange-400',
  urgent: 'bg-red-500/15 text-red-600 dark:text-red-400',
}

export const statusLabels: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'To Do',
  in_progress: 'In Progress',
  review: 'In Review',
  done: 'Done',
  archived: 'Archived',
}

export const projectStatusColors: Record<string, string> = {
  planning: 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
  active: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
  on_hold: 'bg-amber-500/15 text-amber-600 dark:text-amber-400',
  completed: 'bg-purple-500/15 text-purple-600 dark:text-purple-400',
  cancelled: 'bg-red-500/15 text-red-600 dark:text-red-400',
}
