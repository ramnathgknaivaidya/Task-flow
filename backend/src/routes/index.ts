import { Router } from 'express'
import { config } from '../config'
import authRouter from './auth'
import tasksRouter from './tasks'

const router = Router()

router.use('/auth', authRouter)
router.use('/tasks', tasksRouter)

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    smtp: config.smtp.host ? 'configured' : 'not configured',
    mongodb: config.mongodb.uri ? 'configured' : 'not configured',
    timestamp: new Date().toISOString(),
  })
})

export default router
