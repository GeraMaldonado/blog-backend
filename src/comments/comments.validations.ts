import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const CreateCommentSchema = z.object({
  content: z.string().min(1, 'content is required'),
  authorId: z.string().uuid('invalid authorId'),
  postId: z.string().uuid('invalid postId')
})

const CommentQuerySchema = z.object({
  authorId: z.string().uuid().optional(),
  postId: z.string().uuid().optional()
})

export type CreateCommentDTO = z.infer<typeof CreateCommentSchema>
export type CommentQueryDTO = z.infer<typeof CommentQuerySchema>

const validateSchema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) {
    const errors = result.error.errors.map(e => e.path.join('.')).join(', ')
    throw new ValidationError(`required: ${errors}`)
  }
  return result.data
}

export const validateCreateComment = (input: unknown): CreateCommentDTO =>
  validateSchema(CreateCommentSchema, input)

export const validateCommentQuery = (input: unknown): CommentQueryDTO =>
  validateSchema(CommentQuerySchema, input)
