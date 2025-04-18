import { cache, deleteVerificationCache } from './cache.service'
import { sendEmail } from '../emails/email.service'
import { generateVerificationCode } from '../utils/generateCode'
import { InvalidCodeError } from '../errors/customizedError'
import { NODE_ENV } from '../config'

interface VerificationData {
  email: string
  code: string
}

export const requestVerificationCode = async ({ name, email }: { name: string, email: string }): Promise<string> => {
  const code = generateVerificationCode()
  cache.set(email, { name, code })

  if (NODE_ENV !== 'test') {
    await sendEmail(
      email,
      'Código de verificación',
      `<p>Hola ${name}, tu codigo de verificacioón es <strong>${code}</strong></p>`
    )
  }
  return code
}

export const verifyCodeAndGetData = ({ email, code }: { email: string, code: string }): VerificationData => {
  const data = cache.get<VerificationData>(email)
  if ((data == null) || data.code !== code) throw new InvalidCodeError('invalid or expired verification code')
  deleteVerificationCache(email)
  return data
}
