import { Request, Response, NextFunction } from 'express'
import { ConflictError, NotFoundError, UnauthorizedError, ValidationError } from '../errors/customizedError'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
//  console.error(err.name, ': ', err.message)
  if (err instanceof ValidationError) {
    res.status(400).json({ type: err.name, message: err.message })
    return
  }
  if (err instanceof NotFoundError) {
    res.status(404).json({ type: err.name, message: err.message })
    return
  }
  if (err instanceof ConflictError) {
    res.status(409).json({ type: err.name, message: err.message })
    return
  }
  if (err instanceof UnauthorizedError) {
    res.status(401).json({ type: err.name, message: err.message })
  }

  res.status(500).json({ type: 'InternalServerError', message: 'Something went wrong' })
}
