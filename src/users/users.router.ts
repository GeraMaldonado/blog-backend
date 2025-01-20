import { Router } from 'express'
import userController from './users.controller'
import { asyncHandler } from '../errors/asyncHandler'

export const usersRouter = Router()

usersRouter.get('/', userController.getAllUsers)
usersRouter.post('/', asyncHandler(userController.createUser))
usersRouter.get('/:id', asyncHandler(userController.getUserById))
usersRouter.patch('/:id', asyncHandler(userController.updateUserById))
usersRouter.delete('/:id', asyncHandler(userController.deleteUserById))
