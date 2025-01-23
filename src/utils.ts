import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config'

export const encryptPassword = async (password: string): Promise<string> => {
  const encryptedPassword = await bcrypt.hash(password, SALT_ROUNDS)
  return encryptedPassword
}
