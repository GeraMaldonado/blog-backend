import { ICategory } from '../../interfaces/categories/iCategory'

export type CategoryDTO = ICategory
export type newCategoryDTO = Pick<CategoryDTO, 'name' | 'description'>
