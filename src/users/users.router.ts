import { Router } from 'express'
import { UserController } from './users.controller'
import { asyncHandler } from '../errors/asyncHandler'
import { IUserModel } from '../interfaces/users/IUserModel'

export const createUserRouter = ({ userModel }: { userModel: IUserModel }): Router => {
  const usersRouter = Router()

  const userController = new UserController({ userModel })

  usersRouter.get('/', userController.getAllUsers)
  usersRouter.post('/', asyncHandler(userController.createUser))
  usersRouter.get('/:id', asyncHandler(userController.getUserById))
  usersRouter.patch('/:id', asyncHandler(userController.updateUserById))
  usersRouter.delete('/:id', asyncHandler(userController.deleteUserById))
  return usersRouter
}
