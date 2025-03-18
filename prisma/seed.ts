import { PrismaClient } from '@prisma/client'
import { DATABASE_URL_TEST } from '../src/config'

const prisma = new PrismaClient({
  datasources: {
    db: { 
      url: DATABASE_URL_TEST
    }                                                                                                                         
  }                                                                                                                           
})

async function main() {
  await prisma.user.createMany({
    data: [
      {
        id: '6682bf97-236b-4cdd-b4cb-78c4dc6d3a7c',
        name: 'Max Rockatansky',
        username: 'MadMax',
        email: 'mrockatansky@email.com',
        password: '$2a$12$TSG6/dDPUudI4v7QhDVDT.AeuV3UnboEfptoPz0mzanHIQYocR2fa',
        creation_date: new Date()
      },
      {
        id: 'ee98c10b-c1f2-4fa9-82bc-b90ae9b17999',
        name: 'John Wick',
        username: 'Baba_Yaga',
        email: 'john_wick@email.com',
        password: '$2a$12$U..P8k0DzyDhSMeMbQU8W.eMIKIQVQp9z2lm8mLjyl4ijxCuJATgK',
        creation_date: new Date()
      }
    ]
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

