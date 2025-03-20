import { Request, Response, NextFunction } from 'express'
import { ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from '../errors/customizedError'
import { NODE_ENV } from '../config'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction): void => {
  if (NODE_ENV !== 'test') console.error(err.name, ': ', err.message)

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
    return
  }
  if (err instanceof ForbiddenError) {
    res.status(403).json({ type: err.name, message: err.message })
    return
  }

  res.status(500).json({ type: 'InternalServerError', message: 'Something went wrong' })
}
