import { Router, Request, Response } from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import { config } from '../config'
import { validate } from '../middleware/validate'

const router = Router()

router.post('/register', validate({ email: 'string', password: 'string', name: 'string' }), (req: Request, res: Response) => {
  const { email, password, name } = req.body
  const opts: SignOptions = { expiresIn: config.jwt.expiresIn as any }
  const token = jwt.sign({ userId: Date.now().toString(), role: 'employee' }, config.jwt.secret, opts)
  res.status(201).json({ message: 'User created', user: { id: Date.now(), email, name, role: 'employee' }, token })
})

router.post('/login', validate({ email: 'string', password: 'string' }), (req: Request, res: Response) => {
  const { email } = req.body
  const opts: SignOptions = { expiresIn: config.jwt.expiresIn as any }
  const token = jwt.sign({ userId: '1', role: 'admin' }, config.jwt.secret, opts)
  res.json({ message: 'Login successful', user: { id: '1', email, name: 'Alex Morgan', role: 'admin' }, token })
})

router.post('/forgot-password', (_req: Request, res: Response) => {
  res.json({ message: 'Password reset email sent' })
})

router.post('/reset-password', (_req: Request, res: Response) => {
  res.json({ message: 'Password reset successful' })
})

export default router
