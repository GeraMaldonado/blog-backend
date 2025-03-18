import { config } from 'dotenv'
config()

export const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY,
  SECRET_REFRESH_JWT_KEY,
  NODE_ENV,
  DATABASE_URL,
  DATABASE_URL_TEST
} = process.env
