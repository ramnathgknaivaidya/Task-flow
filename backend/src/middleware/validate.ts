import { Request, Response, NextFunction } from 'express'

export function validate(schema: Record<string, string>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = []
    for (const [field, type] of Object.entries(schema)) {
      const value = req.body[field]
      if (!value) {
        errors.push(`${field} is required`)
      } else if (type === 'string' && typeof value !== 'string') {
        errors.push(`${field} must be a string`)
      } else if (type === 'number' && isNaN(Number(value))) {
        errors.push(`${field} must be a number`)
      }
    }
    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors })
    }
    next()
  }
}
