import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const TagSchema = z.object({
  name: z.string().min(1, 'name is required').max(100)
})

export type TagValidated = z.infer<typeof TagSchema>

export const validateTag = (input: unknown): TagValidated => {
  const result = TagSchema.safeParse(input)
  if (!result.success) {
    throw new ValidationError(`required: ${result.error.errors.map(err => err.path.join('.')).join(', ')}`)
  }
  return result.data
}
