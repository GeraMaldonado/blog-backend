import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const Post = z.object({
  title: z.string().min(1, 'title is required').max(150),
  authorId: z.string().uuid('invalid authorId format'),
  content: z.string().nullable().optional(),
  categoryId: z.string().uuid().nullable().optional()
})

export const PartialPost = Post.partial()

export type ValidatePost = z.infer<typeof Post>
export type PartialValidatePost = z.infer<typeof PartialPost>

const validateSchema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) {
    throw new ValidationError(
      `required: ${result.error.errors.map(err => err.path.join('.')).join(', ')}`
    )
  }
  return result.data
}

export const validatePost = (input: unknown): ValidatePost => validateSchema(Post, input)

export const validatePartialPost = (input: unknown): PartialValidatePost => validateSchema(PartialPost, input)
