import { Router } from 'express'
import { createUserRouter } from '../users/users.router'
import { createAuthRouter } from '../auth/auth.router'
import { IUserModel } from '../interfaces/users/IUserModel'
import { IAuthModel } from '../interfaces/auth/IAuthModel'

export function createRouter ({ userModel, authModel }: { userModel: IUserModel, authModel: IAuthModel }): Router {
  const router = Router()
  router.use('/users', createUserRouter({ userModel }))
  router.use('/auth', createAuthRouter({ authModel }))

  return router
}
