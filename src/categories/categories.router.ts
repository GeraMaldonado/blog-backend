import { Router } from 'express'
import { CategoriesController } from './categories.controller'
import { asyncHandler } from '../errors/asyncHandler'

export function createCategoriesRouter (): Router {
  const router = Router()
  const categoriesController = new CategoriesController()

  router.get('/', asyncHandler(categoriesController.getAllCategories))
  router.post('/', categoriesController.createCategory)

  return router
}
