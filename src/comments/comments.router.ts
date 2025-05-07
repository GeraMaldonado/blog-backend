import { Router } from 'express'
import { CommentsController } from './comments.controller'

export function createCommentsRouter (): Router {
  const router = Router()
  const commentsController = new CommentsController()

  router.get('/', commentsController.getAllComments)
  router.post('/', commentsController.createComment)

  return router
}
