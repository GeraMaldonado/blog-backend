import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const User = z.object({
  nombre: z.string().min(1, 'nombre is required').max(150, 'nombre is too long'),
  nickname: z.string().min(1, 'nickname is required').max(50, 'nickname is too long'),
  password: z.string().min(10, 'password must be al least 10 characters'),
  email: z.string().email('invalid email format')
})

export type ValidateUser = z.infer<typeof User>
export type PartialValidateUser = z.infer<ReturnType<typeof User.partial>>

const validateShcema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) throw new ValidationError(`${result.error.errors.map(err => err.message).join(', ')}`)
  return result.data
}

export const validateUser = (input: unknown): ValidateUser => validateShcema(User, input)

export const validatePatialUser = (input: unknown): PartialValidateUser => validateShcema(User.partial(), input)
