import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './auth.service'
import { UnauthorizedError } from '../errors/customizedError'

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.accessToken

    if (!token) throw new UnauthorizedError('Token not provided')

    const decoded = await verifyToken(token)
    req.user = decoded
    return next()
  } catch (err) {
    next(new UnauthorizedError('Invalid token'))
  }
}
