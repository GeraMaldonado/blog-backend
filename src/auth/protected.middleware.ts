import { Request, Response, NextFunction } from 'express'
import { ForbiddenError } from '../errors/customizedError'

export const protectRoutes = async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
  if (req.user?.id !== req.params.id) next(new ForbiddenError('You do not have permission to modify this resource'))
  next()
}
