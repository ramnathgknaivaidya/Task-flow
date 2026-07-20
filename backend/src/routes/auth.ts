import { Router, Request, Response } from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { config } from '../config'
import { User } from '../models/User'

const router = Router()

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Name, email, and password are required' })
    }
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const user = await User.create({ name, email, password: hashed, emailVerified: true })
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as SignOptions)
    res.status(201).json({
      message: 'Account created successfully',
      user: { id: user._id, email: user.email, name: user.name, role: 'employee' },
      token,
    })
  } catch (err: any) {
    console.error('[Auth] Register error:', err.message)
    res.status(500).json({ message: err.message || 'Registration failed' })
  }
})

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })
    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as SignOptions)
    res.json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
      token,
    })
  } catch (err: any) {
    console.error('[Auth] Login error:', err.message)
    res.status(500).json({ message: 'Login failed' })
  }
})

router.post('/forgot-password', (_req: Request, res: Response) => {
  res.json({ message: 'Password reset email sent' })
})

router.post('/reset-password', (_req: Request, res: Response) => {
  res.json({ message: 'Password reset successful' })
})

export default router
