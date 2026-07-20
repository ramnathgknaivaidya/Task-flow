import { create } from 'zustand'
import type { Task, TaskStatus } from '../types'
import { generateId } from '../lib/utils'

interface TaskState {
  tasks: Task[]
  selectedTask: Task | null
  filter: {
    status: TaskStatus | 'all'
    priority: string
    assignee: string
    search: string
  }
  addTask: (task: Partial<Task>) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  deleteTask: (id: string) => void
  setSelectedTask: (task: Task | null) => void
  setFilter: (filter: Partial<TaskState['filter']>) => void
  moveTask: (taskId: string, newStatus: TaskStatus) => void
  duplicateTask: (id: string) => void
}

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design new landing page',
    description: 'Create wireframes and high-fidelity mockups for the new product landing page following the brand guidelines.',
    status: 'in_progress',
    priority: 'high',
    severity: 'major',
    category: 'Design',
    department: 'Engineering',
    projectId: 'p1',
    assignees: ['1', '2'],
    watchers: ['3'],
    tags: ['design', 'frontend'],
    labels: ['UI/UX'],
    progress: 65,
    estimatedTime: 16,
    actualTime: 10,
    startDate: new Date(Date.now() - 86400000 * 5).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    subtasks: [],
    checklist: [
      { id: 'c1', text: 'Research competitor pages', completed: true },
      { id: 'c2', text: 'Create wireframes', completed: true },
      { id: 'c3', text: 'Design high-fidelity mockups', completed: false },
    ],
    attachments: [],
    comments: [],
    activity: [],
    dependencies: [],
    customFields: {},
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    isRecurring: false,
  },
  {
    id: '2',
    title: 'Implement authentication flow',
    description: 'Build login, registration, and password reset flows with JWT authentication.',
    status: 'todo',
    priority: 'urgent',
    severity: 'critical',
    category: 'Development',
    department: 'Engineering',
    projectId: 'p1',
    assignees: ['2'],
    watchers: ['1', '3'],
    tags: ['backend', 'security'],
    labels: ['Feature'],
    progress: 0,
    estimatedTime: 24,
    actualTime: 0,
    startDate: new Date().toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    subtasks: [],
    checklist: [],
    attachments: [],
    comments: [],
    activity: [],
    dependencies: ['1'],
    customFields: {},
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    isRecurring: false,
  },
  {
    id: '3',
    title: 'Write API documentation',
    description: 'Document all REST API endpoints with request/response examples using OpenAPI spec.',
    status: 'review',
    priority: 'medium',
    severity: 'minor',
    category: 'Documentation',
    department: 'Engineering',
    assignees: ['3'],
    watchers: ['1'],
    tags: ['docs', 'api'],
    labels: ['Documentation'],
    progress: 90,
    estimatedTime: 8,
    actualTime: 7,
    startDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString(),
    subtasks: [],
    checklist: [
      { id: 'c4', text: 'Document auth endpoints', completed: true },
      { id: 'c5', text: 'Document task endpoints', completed: true },
      { id: 'c6', text: 'Add code examples', completed: false },
    ],
    attachments: [],
    comments: [],
    activity: [],
    dependencies: [],
    customFields: {},
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    isRecurring: false,
  },
  {
    id: '4',
    title: 'Set up CI/CD pipeline',
    description: 'Configure GitHub Actions for automated testing, building, and deployment.',
    status: 'done',
    priority: 'high',
    severity: 'major',
    category: 'DevOps',
    department: 'Engineering',
    projectId: 'p1',
    assignees: ['2'],
    watchers: ['1'],
    tags: ['devops', 'automation'],
    labels: ['Infrastructure'],
    progress: 100,
    estimatedTime: 12,
    actualTime: 14,
    startDate: new Date(Date.now() - 86400000 * 10).toISOString(),
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    completedDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    subtasks: [],
    checklist: [],
    attachments: [],
    comments: [],
    activity: [],
    dependencies: [],
    customFields: {},
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    createdBy: '2',
    isRecurring: false,
  },
  {
    id: '5',
    title: 'Quarterly review presentation',
    description: 'Prepare slides and data for the quarterly business review meeting.',
    status: 'backlog',
    priority: 'medium',
    severity: 'minor',
    category: 'Business',
    department: 'Management',
    assignees: ['1'],
    watchers: [],
    tags: ['presentation', 'review'],
    labels: ['Business'],
    progress: 15,
    estimatedTime: 6,
    actualTime: 1,
    startDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    subtasks: [],
    checklist: [],
    attachments: [],
    comments: [],
    activity: [],
    dependencies: [],
    customFields: {},
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    isRecurring: false,
  },
  {
    id: '6',
    title: 'Fix payment gateway timeout',
    description: 'Investigate and resolve the timeout issue in the payment processing service.',
    status: 'in_progress',
    priority: 'urgent',
    severity: 'critical',
    category: 'Development',
    department: 'Engineering',
    projectId: 'p2',
    assignees: ['2'],
    watchers: ['1', '3'],
    tags: ['backend', 'fix'],
    labels: ['Bug'],
    progress: 40,
    estimatedTime: 8,
    actualTime: 3,
    startDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    subtasks: [],
    checklist: [],
    attachments: [],
    comments: [],
    activity: [],
    dependencies: [],
    customFields: {},
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
    isRecurring: false,
  },
]

export const useTaskStore = create<TaskState>((set) => ({
  tasks: mockTasks,
  selectedTask: null,
  filter: {
    status: 'all',
    priority: 'all',
    assignee: 'all',
    search: '',
  },
  addTask: (task) =>
    set((state) => ({
      tasks: [
        {
          id: generateId(),
          title: '',
          description: '',
          status: 'todo',
          priority: 'medium',
          severity: 'minor',
          category: '',
          department: '',
          assignees: [],
          watchers: [],
          tags: [],
          labels: [],
          progress: 0,
          estimatedTime: 0,
          actualTime: 0,
          startDate: new Date().toISOString(),
          dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
          subtasks: [],
          checklist: [],
          attachments: [],
          comments: [],
          activity: [],
          dependencies: [],
          customFields: {},
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '1',
          isRecurring: false,
          ...task,
        },
        ...state.tasks,
      ],
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      ),
      selectedTask:
        state.selectedTask?.id === id
          ? { ...state.selectedTask, ...updates, updatedAt: new Date().toISOString() }
          : state.selectedTask,
    })),
  deleteTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
      selectedTask: state.selectedTask?.id === id ? null : state.selectedTask,
    })),
  setSelectedTask: (task) => set({ selectedTask: task }),
  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),
  moveTask: (taskId, newStatus) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t
      ),
    })),
  duplicateTask: (id) => {
    const task = mockTasks.find((t) => t.id === id)
    if (task) {
      set((state) => ({
        tasks: [
          { ...task, id: generateId(), title: `${task.title} (Copy)`, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
          ...state.tasks,
        ],
      }))
    }
  },
}))
