import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const User = z.object({
  name: z.string().min(1, 'name is required').max(150, 'name is too long'),
  username: z.string().min(1, 'username is required').max(50, 'username is too long'),
  password: z.string().min(10, 'password must be al least 10 characters'),
  email: z.string().email('invalid email format')
})

export type ValidateUser = z.infer<typeof User>
export type PartialValidateUser = z.infer<ReturnType<typeof User.partial>>

const validateShcema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) throw new ValidationError(`required: ${result.error.errors.map(err => err.path).join(', ')}`)
  return result.data
}

export const validateUser = (input: unknown): ValidateUser => validateShcema(User, input)

export const validatePatialUser = (input: unknown): PartialValidateUser => validateShcema(User.partial(), input)
