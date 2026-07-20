import { Router, Request, Response } from 'express'
import { authenticate } from '../middleware/auth'
import { Task } from '../models/Task'

const router = Router()
router.use(authenticate)

router.get('/', async (_req: Request, res: Response) => {
  try {
    const tasks = await Task.find().sort({ createdAt: -1 })
    res.json({ tasks })
  } catch (err) { res.status(500).json({ message: 'Failed to fetch tasks' }) }
})

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ task })
  } catch (err) { res.status(500).json({ message: 'Failed to fetch task' }) }
})

router.post('/', async (req: Request, res: Response) => {
  try {
    const task = await Task.create(req.body)
    res.status(201).json({ task })
  } catch (err) { res.status(500).json({ message: 'Failed to create task' }) }
})

router.put('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ task })
  } catch (err) { res.status(500).json({ message: 'Failed to update task' }) }
})

router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id)
    if (!task) return res.status(404).json({ message: 'Task not found' })
    res.json({ message: 'Task deleted' })
  } catch (err) { res.status(500).json({ message: 'Failed to delete task' }) }
})

export default router
