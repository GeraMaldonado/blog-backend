import { Router } from 'express'
import { UserController } from './users.controller'
import { asyncHandler } from '../errors/asyncHandler'
import { IUserModel } from '../interfaces/users/IUserModel'
import { authMiddleware } from '../auth/auth.middleware'
import { protectRoutes } from '../auth/protected.middleware'

export const createUserRouter = ({ userModel }: { userModel: IUserModel }): Router => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/', userController.getAllUsers)
  usersRouter.post('/verify-request', asyncHandler(userController.requestUserVerification))
  usersRouter.post('/', asyncHandler(userController.createUser))
  usersRouter.get('/:id', asyncHandler(userController.getUserById))
  usersRouter.patch('/:id', authMiddleware, protectRoutes, asyncHandler(userController.updateUserById))
  usersRouter.delete('/:id', authMiddleware, protectRoutes, asyncHandler(userController.deleteUserById))
  return usersRouter
}
