import { ICategoriesModel } from '../interfaces/categories/ICategoriesModel'
import { CategoryDTO, newCategoryDTO } from './dto/categories.dto'
import { prisma } from '../database/mysql'
import { randomUUID } from 'node:crypto'

export const CategoriesModel: ICategoriesModel = {
  async getAllCategories (name: string): Promise<CategoryDTO[]> {
    const categories = await prisma.category.findMany({ where: name ? { name: { contains: name } } : undefined })
    return categories
  },

  async createCategory (newCategory: newCategoryDTO): Promise<string> {
    const id = randomUUID()
    await prisma.category.create({
      data: {
        id,
        name: newCategory.name,
        description: newCategory.description
      }
    })
    return id
  }
}
