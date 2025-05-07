import { Router } from 'express'
import { TagsController } from './tags.controller'

export function createTagsRouter (): Router {
  const router = Router()
  const tagsController = new TagsController()

  router.get('/', tagsController.getAllTags)
  router.post('/', tagsController.createTag)

  return router
}
