import { Router } from 'express'
import userController from './users.controller'

export const usersRouter = Router()

usersRouter.get('/', userController.getAllUsers)
