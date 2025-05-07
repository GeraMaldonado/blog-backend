import { Request, Response } from 'express'
import { validateCategory, validateCategoryQuery } from './categories.validations'
import { CategoriesModel } from './categories.model'

const categoriesModel = CategoriesModel

export class CategoriesController {
  async getAllCategories (req: Request, res: Response): Promise<void> {
    const { name } = validateCategoryQuery(req.query)
    const result = await categoriesModel.getAllCategories(name ?? '')
    res.json({ data: result })
  }

  async createCategory (req: Request, res: Response): Promise<void> {
    const newCategory = validateCategory(req.body)
    const result = await categoriesModel.createCategory(newCategory)
    res.status(201).json({ data: result })
  }
}
