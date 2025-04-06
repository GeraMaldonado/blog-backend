import { NODE_ENV } from '../config'

export function generateVerificationCode (): string {
  return NODE_ENV === 'test' ? '123456' : Math.random().toString(36).substring(2, 8).toUpperCase()
}
