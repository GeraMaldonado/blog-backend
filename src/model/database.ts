import { PrismaClient } from '@prisma/client'
import { NODE_ENV, DATABASE_URL_TEST, DATABASE_URL } from '../config'

export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: NODE_ENV === 'test' ? DATABASE_URL_TEST : DATABASE_URL
    }
  }
})
