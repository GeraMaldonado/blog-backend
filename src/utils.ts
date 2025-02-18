import bcrypt from 'bcrypt'
import { SALT_ROUNDS } from './config'

export const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

export const encryptCompare = async (encryptPassword: string, password: string): Promise<boolean> => {
  return await bcrypt.compare(encryptPassword, password)
}
