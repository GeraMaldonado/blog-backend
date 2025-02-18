import { Request, Response, NextFunction } from 'express'
import { verifyToken } from './auth.service'
import { UnauthorizedError } from '../errors/customizedError'
import { IUser } from '../interfaces/users/IUser'

declare module 'express-serve-static-core' {
  interface Request {
    user?: IUser
  }
}

export const authMiddleware = async (req: Request, _res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.access_token

    if (!token) {
      return next(new UnauthorizedError('Token not provided'))
    }

    const decoded = await verifyToken(token)
    req.user = decoded

    return next()
  } catch (err) {
    return next(new UnauthorizedError('Invalid token'))
  }
}
