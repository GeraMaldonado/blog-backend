import z from 'zod'
import { ValidationError } from '../errors/error'

const User = z.object({
  nombre: z.string().min(1, 'nombre is required').max(150, 'nombre is too long'),
  nickname: z.string().min(1, 'nickname is required').max(50, 'nickname is too long'),
  password: z.string().min(20, 'password must be al least 20 characters'),
  email: z.string().email('invalid emial format')
})

export type ValidateUser = z.infer<typeof User>

export const validateUser = (input: any): ValidateUser => {
  const result = User.safeParse(input)

  if (!result.success) throw new ValidationError(`${result.error.errors.map(err => err.message).join(', ')}`)

  return result.data
}
