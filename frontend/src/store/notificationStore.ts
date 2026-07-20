import { create } from 'zustand'
import type { Notification } from '../types'
import { generateId } from '../lib/utils'

interface NotificationState {
  notifications: Notification[]
  addNotification: (n: Partial<Notification>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  unreadCount: () => number
}

const mockNotifications: Notification[] = [
  {
    id: 'n1',
    userId: '1',
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'Alex Morgan assigned you to "Fix payment gateway timeout"',
    read: false,
    priority: 'high',
    link: '/tasks/6',
    createdAt: new Date(Date.now() - 600000).toISOString(),
  },
  {
    id: 'n2',
    userId: '1',
    type: 'comment',
    title: 'New comment',
    message: 'Sarah commented on "Design new landing page"',
    read: false,
    priority: 'medium',
    link: '/tasks/1',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'n3',
    userId: '1',
    type: 'deadline',
    title: 'Deadline approaching',
    message: '"Implement authentication flow" is due in 2 days',
    read: true,
    priority: 'high',
    link: '/tasks/2',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'n4',
    userId: '1',
    type: 'approval',
    title: 'Approval pending',
    message: 'Review completed work by Mike on "Set up CI/CD pipeline"',
    read: true,
    priority: 'medium',
    link: '/approvals',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
  {
    id: 'n5',
    userId: '1',
    type: 'mention',
    title: 'You were mentioned',
    message: 'John mentioned you in a comment on "Quarterly review presentation"',
    read: false,
    priority: 'medium',
    link: '/tasks/5',
    createdAt: new Date(Date.now() - 300000).toISOString(),
  },
]

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: mockNotifications,
  addNotification: (n) =>
    set((state) => ({
      notifications: [
        {
          id: generateId(),
          userId: '1',
          type: 'system_alert',
          title: '',
          message: '',
          read: false,
          priority: 'medium',
          ...n,
          createdAt: new Date().toISOString(),
        },
        ...state.notifications,
      ],
    })),
  markAsRead: (id) =>
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    })),
  markAllAsRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    })),
  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}))
