import { Router } from 'express'
import { asyncHandler } from '../errors/asyncHandler'
import { AuthController } from './auth.controller'

export const authRouter = Router()

const authController = new AuthController()

authRouter.post('/login', asyncHandler(authController.login))
authRouter.post('/refresh', asyncHandler(authController.refreshToken))
authRouter.post('/logout', asyncHandler(authController.logout))
