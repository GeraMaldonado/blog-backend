import { CategoryDTO, newCategoryDTO } from '../../categories/dto/categories.dto'

export interface ICategoriesModel {
  getAllCategories: (name: string) => Promise<CategoryDTO[]>
  createCategory: (newCategory: newCategoryDTO) => Promise<string>
}
