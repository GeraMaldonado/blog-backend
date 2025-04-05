import z from 'zod'
import { ValidationError } from '../errors/customizedError'

const User = z.object({
  name: z.string().min(1, 'name is required').max(150, 'name is too long'),
  username: z.string().min(1, 'username is required').max(50, 'username is too long'),
  password: z.string().min(10, 'password must be al least 10 characters'),
  email: z.string().email('invalid email format'),
  code: z.string().min(1, 'verification code is required')
})

export type ValidateUser = z.infer<typeof User>
export type PartialValidateUser = z.infer<ReturnType<typeof User.partial>>

const validateSchema = <T>(schema: z.ZodSchema<T>, input: unknown): T => {
  const result = schema.safeParse(input)
  if (!result.success) throw new ValidationError(`required: ${result.error.errors.map(err => err.path).join(', ')}`)
  return result.data
}

export const validateUser = (input: unknown): ValidateUser => validateSchema(User, input)

export const validatePartialUser = (input: unknown): PartialValidateUser => validateSchema(User.partial(), input)

export const VerificationRequest = z.object({
  name: z.string().min(1, 'name is required').max(150, 'name is too long'),
  email: z.string().email('invalid email format')
})

export type ValidateUserVerificationRequest = z.infer<typeof VerificationRequest>

export const validateUserVerificationRequest = (input: unknown): ValidateUserVerificationRequest =>
  validateSchema(VerificationRequest, input)
