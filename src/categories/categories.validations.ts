import z from 'zod'
import { ValidationError } from '../errors/customizedError'

export const CategorySchema = z.object({
  name: z.string().min(1, 'name is required').max(50),
  description: z.string().min(1, 'description is required').max(255)
})

export const CategoryQuerySchema = z.object({
  name: z.string().max(50).optional()
})

export type ValidateCategory = z.infer<typeof CategorySchema>
export type ValidateCategoryQuery = z.infer<typeof CategoryQuerySchema>

const validateSchema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new ValidationError(
      `required: ${result.error.errors.map(err => err.path.join('.')).join(', ')}`
    )
  }
  return result.data
}

export const validateCategory = (input: unknown): ValidateCategory =>
  validateSchema(CategorySchema, input)

export const validateCategoryQuery = (input: unknown): ValidateCategoryQuery =>
  validateSchema(CategoryQuerySchema, input)
