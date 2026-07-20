import { Router } from 'express'
import authRouter from './auth'
import tasksRouter from './tasks'

const router = Router()

router.use('/auth', authRouter)
router.use('/tasks', tasksRouter)

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

export default router
