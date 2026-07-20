import { Request, Response, NextFunction } from 'express'

export interface AuthRequest extends Request {
  userId?: string
  userRole?: string
}

function getToken(req: Request): string | null {
  const h = (req as any).headers
  if (!h || !h.authorization) return null
  return h.authorization.replace('Bearer ', '')
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = getToken(req)
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' })
  }
  try {
    const jwt = require('jsonwebtoken')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret')
    ;(req as AuthRequest).userId = decoded.userId
    ;(req as AuthRequest).userRole = decoded.role
    next()
  } catch {
    return res.status(401).json({ message: 'Invalid token' })
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!(req as AuthRequest).userRole || !roles.includes((req as AuthRequest).userRole!)) {
      return res.status(403).json({ message: 'Insufficient permissions' })
    }
    next()
  }
}
