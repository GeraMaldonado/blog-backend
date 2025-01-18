import { Router } from 'express'
import userController from './users.controller'
import { asyncHandler } from '../errors/asyncHandler'

export const usersRouter = Router()

usersRouter.get('/', userController.getAllUsers)
usersRouter.post('/', asyncHandler(userController.createUser))
