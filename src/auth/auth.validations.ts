import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const UserAuth = z.object({
  email: z.string().email('invalid email forat'),
  password: z.string().min(10, 'password must be al least 10 characters')
})

export type ValidateUserAuth = z.infer<typeof UserAuth>

const validateShcema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) throw new ValidationError(`${result.error.errors.map(err => err.message).join(', ')}`)
  return result.data
}

export const validateUserAuth = (input: unknown): ValidateUserAuth => validateShcema(UserAuth, input)
