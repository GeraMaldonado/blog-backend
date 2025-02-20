import { Router } from 'express'
import { asyncHandler } from '../errors/asyncHandler'
import { AuthController } from './auth.controller'
import { IAuthModel } from '../interfaces/auth/IAuthModel'

export const createAuthRouter = ({ authModel }: { authModel: IAuthModel }): Router => {
  const authRouter = Router()
  const authController = new AuthController({ authModel })

  authRouter.post('/login', asyncHandler(authController.login))
  authRouter.post('/refresh', asyncHandler(authController.refreshToken))
  authRouter.post('/logout', asyncHandler(authController.logout))
  return authRouter
}
