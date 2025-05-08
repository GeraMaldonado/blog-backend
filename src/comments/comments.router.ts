import { Router } from 'express'
import { CommentsController } from './comments.controller'
import { asyncHandler } from '../errors/asyncHandler'
import { authMiddleware } from '../auth/auth.middleware'

export function createCommentsRouter (): Router {
  const commentsRouter = Router()
  const commentsController = new CommentsController()

  commentsRouter.get('/', asyncHandler(commentsController.getAllComments))
  commentsRouter.post('/', authMiddleware, asyncHandler(commentsController.createComment))

  return commentsRouter
}
