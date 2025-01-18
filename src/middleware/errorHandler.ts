import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../errors/customizedError'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  if (err instanceof ValidationError) {
    res.status(400).json({ type: err.name, message: err.message })
    return
  }

  res.status(500).json({ type: 'InternalServerError', message: 'Something went wrong' })
}
