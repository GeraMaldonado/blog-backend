import { Router } from 'express'
import { TagsController } from './tags.controller'
import { asyncHandler } from '../errors/asyncHandler'
import { authMiddleware } from '../auth/auth.middleware'

export function createTagsRouter (): Router {
  const tagsRouter = Router()
  const tagsController = new TagsController()

  tagsRouter.get('/', asyncHandler(tagsController.getAllTags))
  tagsRouter.post('/', authMiddleware, asyncHandler(tagsController.createTag))

  return tagsRouter
}
