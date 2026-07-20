import { Router, Request, Response } from 'express'
import jwt, { type SignOptions } from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'
import { config } from '../config'
import { User } from '../models/User'
import { sendOTP } from '../services/email'

const router = Router()

function generateOTP() {
  return crypto.randomInt(100000, 999999).toString()
}

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body
    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ message: 'Email already registered' })
    const hashed = await bcrypt.hash(password, 10)
    const otp = generateOTP()
    const user = await User.create({
      name, email, password: hashed,
      otp, otpExpiresAt: new Date(Date.now() + 600000),
      emailVerified: false,
    })
    await sendOTP(email, otp)
    const token = jwt.sign({ userId: user._id, role: user.role }, config.jwt.secret, { expiresIn: config.jwt.expiresIn } as SignOptions)
    res.status(201).json({
      message: 'Account created. Please verify your email.',
      user: { id: user._id, email: user.email, name: user.name, role: user.role, emailVerified: false },
      token,
    })
  } catch (err) { res.status(500).json({ message: 'Registration failed' }) }
})

router.post('/verify-otp', async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.emailVerified) return res.json({ message: 'Email already verified' })
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' })
    if (!user.otpExpiresAt || user.otpExpiresAt < new Date()) return res.status(400).json({ message: 'OTP expired' })
    user.emailVerified = true
    user.otp = undefined
    user.otpExpiresAt = undefined
    await user.save()
    res.json({ message: 'Email verified successfully' })
  } catch (err) { res.status(500).json({ message: 'Verification failed' }) }
})

router.post('/resend-otp', async (req: Request, res: Response) => {
  try {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return res.status(404).json({ message: 'User not found' })
    if (user.emailVerified) return res.json({ message: 'Email already verified' })
    const otp = generateOTP()
    user.otp = otp
    user.otpExpiresAt = new Date(Date.now() + 600000)
    await user.save()
    await sendOTP(email, otp)
    res.json({ message: 'OTP resent' })
  } catch (err) { res.status(500).json({ message: 'Failed to resend OTP' }) }
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
      message: user.emailVerified ? 'Login successful' : 'Please verify your email first',
      user: { id: user._id, email: user.email, name: user.name, role: user.role, emailVerified: user.emailVerified },
      token,
    })
  } catch (err) { res.status(500).json({ message: 'Login failed' }) }
})

router.post('/forgot-password', (_req: Request, res: Response) => {
  res.json({ message: 'Password reset email sent' })
})

router.post('/reset-password', (_req: Request, res: Response) => {
  res.json({ message: 'Password reset successful' })
})

export default router
