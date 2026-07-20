import { Router, Request, Response } from 'express'
import { authenticate } from '../middleware/auth'

const router = Router()

const tasks: any[] = [
  { id: '1', title: 'Design new landing page', status: 'in_progress', priority: 'high', assignee: '1', dueDate: new Date(Date.now() + 86400000 * 3).toISOString() },
  { id: '2', title: 'Implement authentication flow', status: 'todo', priority: 'urgent', assignee: '2', dueDate: new Date(Date.now() + 86400000 * 5).toISOString() },
  { id: '3', title: 'Write API documentation', status: 'review', priority: 'medium', assignee: '3', dueDate: new Date(Date.now() + 86400000 * 2).toISOString() },
]

router.use(authenticate)

router.get('/', (_req: Request, res: Response) => {
  res.json({ tasks })
})

router.get('/:id', (req: Request, res: Response) => {
  const task = tasks.find(t => t.id === req.params.id)
  if (!task) return res.status(404).json({ message: 'Task not found' })
  res.json({ task })
})

router.post('/', (req: Request, res: Response) => {
  const task = { id: Date.now().toString(), ...req.body, createdAt: new Date().toISOString() }
  tasks.unshift(task)
  res.status(201).json({ task })
})

router.put('/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Task not found' })
  tasks[idx] = { ...tasks[idx], ...req.body, updatedAt: new Date().toISOString() }
  res.json({ task: tasks[idx] })
})

router.delete('/:id', (req: Request, res: Response) => {
  const idx = tasks.findIndex(t => t.id === req.params.id)
  if (idx === -1) return res.status(404).json({ message: 'Task not found' })
  tasks.splice(idx, 1)
  res.json({ message: 'Task deleted' })
})

export default router
