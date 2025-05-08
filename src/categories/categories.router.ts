import { Router } from 'express'
import { CategoriesController } from './categories.controller'
import { asyncHandler } from '../errors/asyncHandler'
import { authMiddleware } from '../auth/auth.middleware'

export function createCategoriesRouter (): Router {
  const categoriesRouter = Router()
  const categoriesController = new CategoriesController()

  categoriesRouter.get('/', asyncHandler(categoriesController.getAllCategories))
  categoriesRouter.post('/', authMiddleware, asyncHandler(categoriesController.createCategory))

  return categoriesRouter
}
