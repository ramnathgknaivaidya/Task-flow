import { create } from 'zustand'
import type { Project } from '../types'

interface ProjectState {
  projects: Project[]
  selectedProject: Project | null
  setSelectedProject: (project: Project | null) => void
  addProject: (project: Partial<Project>) => void
}

const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Complete overhaul of the company website with modern design and improved UX.',
    client: 'Internal',
    department: 'Engineering',
    team: ['1', '2', '3'],
    budget: 50000,
    timeline: 'Q3 2026',
    status: 'active',
    priority: 'high',
    milestones: [
      { id: 'm1', name: 'Design Phase', description: 'Complete all design mockups', dueDate: new Date(Date.now() + 86400000 * 7).toISOString(), status: 'in_progress', tasks: ['1'] },
      { id: 'm2', name: 'Development Phase', description: 'Implement all features', dueDate: new Date(Date.now() + 86400000 * 30).toISOString(), status: 'pending', tasks: ['2'] },
    ],
    risks: [],
    documents: [],
    files: [],
    activities: [],
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
  },
  {
    id: 'p2',
    name: 'Payment System Upgrade',
    description: 'Upgrade payment processing to support new payment methods and improve reliability.',
    client: 'Finance',
    department: 'Engineering',
    team: ['2', '4'],
    budget: 35000,
    timeline: 'Q3 2026',
    status: 'active',
    priority: 'critical',
    milestones: [],
    risks: [
      { id: 'r1', description: 'Third-party API deprecation', impact: 'high', probability: 'medium', mitigation: 'Monitor API changelog', status: 'open' },
    ],
    documents: [],
    files: [],
    activities: [],
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '1',
  },
  {
    id: 'p3',
    name: 'Mobile App v2',
    description: 'Major version upgrade of the mobile application with new features.',
    client: 'External',
    department: 'Engineering',
    team: ['1', '3', '4'],
    budget: 80000,
    timeline: 'Q4 2026',
    status: 'planning',
    priority: 'medium',
    milestones: [],
    risks: [],
    documents: [],
    files: [],
    activities: [],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: '3',
  },
]

export const useProjectStore = create<ProjectState>((set) => ({
  projects: mockProjects,
  selectedProject: null,
  setSelectedProject: (project) => set({ selectedProject: project }),
  addProject: (project) =>
    set((state) => ({
      projects: [
        {
          id: `p${Date.now()}`,
          name: '',
          description: '',
          department: '',
          team: [],
          timeline: '',
          status: 'planning',
          priority: 'medium',
          milestones: [],
          risks: [],
          documents: [],
          files: [],
          activities: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: '1',
          ...project,
        },
        ...state.projects,
      ],
    })),
}))
