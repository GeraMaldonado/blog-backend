import { config } from 'dotenv'
if (process.env.NODE_ENV !== 'production') config()

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = 'SECRET_JWT_KEY',
  SECRET_REFRESH_JWT_KEY = 'SECRET_REFRESH_JWT_KEY',
  NODE_ENV = 'development',
  DATABASE_URL = '',
  DATABASE_URL_TEST = ''
} = process.env
