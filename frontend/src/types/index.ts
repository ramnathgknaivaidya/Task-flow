export type UserRole = 'employee' | 'team_lead' | 'manager' | 'hr' | 'admin'

export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done' | 'archived'
export type TaskPriority = 'none' | 'low' | 'medium' | 'high' | 'urgent'
export type TaskSeverity = 'trivial' | 'minor' | 'major' | 'critical' | 'blocker'

export type ProjectStatus = 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled'
export type ProjectPriority = 'low' | 'medium' | 'high' | 'critical'

export type NotificationType =
  | 'task_assigned'
  | 'task_completed'
  | 'comment'
  | 'mention'
  | 'deadline'
  | 'project_update'
  | 'approval'
  | 'system_alert'
  | 'reminder'

export type ReminderType = 'before_deadline' | 'at_deadline' | 'after_deadline' | 'daily' | 'weekly' | 'monthly' | 'recurring' | 'escalation'

export type ViewMode = 'kanban' | 'list' | 'table' | 'calendar' | 'timeline' | 'gantt'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  role: UserRole
  department: string
  title: string
  skills: string[]
  phone?: string
  timezone: string
  online: boolean
  lastActive: string
  experience: number
  availability: 'available' | 'busy' | 'away' | 'offline'
}

export interface Task {
  id: string
  title: string
  description: string
  status: TaskStatus
  priority: TaskPriority
  severity: TaskSeverity
  category: string
  department: string
  projectId?: string
  milestoneId?: string
  assignees: string[]
  watchers: string[]
  tags: string[]
  labels: string[]
  progress: number
  estimatedTime: number
  actualTime: number
  startDate: string
  dueDate: string
  completedDate?: string
  parentId?: string
  subtasks: string[]
  checklist: ChecklistItem[]
  attachments: Attachment[]
  comments: Comment[]
  activity: Activity[]
  dependencies: string[]
  customFields: Record<string, string>
  createdAt: string
  updatedAt: string
  createdBy: string
  isRecurring: boolean
  recurringPattern?: string
  templateId?: string
}

export interface ChecklistItem {
  id: string
  text: string
  completed: boolean
}

export interface Attachment {
  id: string
  name: string
  url: string
  size: number
  type: string
  uploadedBy: string
  uploadedAt: string
}

export interface Comment {
  id: string
  taskId: string
  userId: string
  content: string
  mentions: string[]
  reactions: Reaction[]
  parentId?: string
  createdAt: string
  updatedAt: string
}

export interface Reaction {
  emoji: string
  userIds: string[]
}

export interface Activity {
  id: string
  taskId: string
  userId: string
  action: string
  details: string
  timestamp: string
}

export interface Project {
  id: string
  name: string
  description: string
  client?: string
  department: string
  team: string[]
  budget?: number
  timeline: string
  status: ProjectStatus
  priority: ProjectPriority
  milestones: Milestone[]
  risks: Risk[]
  documents: Attachment[]
  files: Attachment[]
  activities: Activity[]
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Milestone {
  id: string
  name: string
  description: string
  dueDate: string
  status: 'pending' | 'in_progress' | 'completed'
  tasks: string[]
}

export interface Risk {
  id: string
  description: string
  impact: 'low' | 'medium' | 'high'
  probability: 'low' | 'medium' | 'high'
  mitigation: string
  status: 'open' | 'mitigated' | 'closed'
}

export interface Reminder {
  id: string
  taskId?: string
  userId: string
  type: ReminderType
  title: string
  message: string
  triggerAt: string
  snoozed: boolean
  snoozedUntil?: string
  completed: boolean
  escalated: boolean
  createdAt: string
}

export interface Meeting {
  id: string
  title: string
  agenda: string
  participants: string[]
  notes?: string
  recordingLink?: string
  actionItems: string[]
  startTime: string
  endTime: string
  recurring: boolean
  recurringPattern?: string
  reminders: Reminder[]
  createdBy: string
}

export interface TimeEntry {
  id: string
  taskId: string
  userId: string
  startTime: string
  endTime?: string
  duration: number
  billable: boolean
  description: string
}

export interface Goal {
  id: string
  title: string
  description: string
  type: 'personal' | 'department' | 'company'
  quarter: string
  year: number
  keyResults: KeyResult[]
  progress: number
  owner: string
  createdAt: string
}

export interface KeyResult {
  id: string
  title: string
  target: number
  current: number
  unit: string
}

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  link?: string
  createdAt: string
}

export interface Department {
  id: string
  name: string
  head: string
  members: string[]
  budget?: number
  goals: string[]
  announcements: string[]
}

export interface Team {
  id: string
  name: string
  projectId: string
  members: string[]
  lead: string
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'system'
  language: string
  timezone: string
  sidebarCollapsed: boolean
  notifications: {
    email: boolean
    browser: boolean
    push: boolean
    sms: boolean
  }
}
