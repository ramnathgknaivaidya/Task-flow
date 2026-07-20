import { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authReq = req as AuthRequest
  const authHeader = (authReq.headers as Record<string, string>).authorization
  const token = authHeader?.replace('Bearer ', '')
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
    authReq.userId = decoded.userId
    authReq.userRole = decoded.role
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest
    if (!authReq.userRole || !roles.includes(authReq.userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }
    next()
  }
}
