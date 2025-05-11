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
    ],
    skipDuplicates: true
  })

  await prisma.category.createMany({
    data: [
      {
        id: '7a105666-2721-433e-87fc-634ed00ce807',
        name: 'Comida',
        description: 'Elementos comestibles y donde encontrarlos en yermo'
      },
      {
        id: '1d5aa7b2-d58a-41f7-b1bd-12992d03f791',
        name: 'Armas',
        description: 'Armamento para asesinos con estilo'
      },
      {
        id: 'f8669665-b05d-4a14-994b-9284339d9d8a',
        name: 'Salud mental',
        description: 'Cuidados para mantener la cordura'
      }
    ],
    skipDuplicates: true
  })

  await prisma.tag.createMany({
    data: [
      { id: '922b5a41-e30f-4947-9acf-14f9db57d647', name: 'gasolina' },
      { id: '47e0813e-0fb4-4d76-bf1d-dca1684e81cf', name: 'comer lagartijas' },
      { id: '612d5cae-0255-4331-b9e8-7b163ab627ef', name: 'subfusiles' },
      { id: '061dd324-6f00-4318-9358-e8a1c66092f7', name: 'cuchillos cortos' },
      { id: '48bf2a4a-1660-4b70-b8d7-30cc5e2cef2c', name: 'plantas comestibles' },
      { id: '1ebdc15a-0e17-4892-87f7-ac3f2cd656be', name: 'Apoyo canino' }
    ],
    skipDuplicates: true
  })

  await prisma.post.createMany({
    data: [
      {
        id: '82d92799-a517-4289-b21f-7e12837f562a',
        title: 'Guia de supervivencia en el yermo',
        content: 'Nunca viajes sin agua ni combustible, es complicado conseguir cualquier cosa en el yermo, como el alimento, ',
        publishedAt: new Date(),
        authorId: '6682bf97-236b-4cdd-b4cb-78c4dc6d3a7c'
      },
      {
        id: '7720d22b-9a8c-4265-af5c-53dde5af12a5',
        title: 'Superar esoty superando una perdida',
        content: 'Estos ultimos dias me he encariñado con una criaturita, un perrro, los perros son animales nobles y maravillosos',
        publishedAt: new Date(),
        authorId: 'ee98c10b-c1f2-4fa9-82bc-b90ae9b17999'
      }
    ],
    skipDuplicates: true
  })

  await prisma.comment.createMany({
    data: [
      {
        id: '9f07c006-975d-472a-8385-ac0367d05e2a',
        content: 'Es posible conseguir agua en el yermo? o solo robandola',
        authorId: 'ee98c10b-c1f2-4fa9-82bc-b90ae9b17999',
        postId: '82d92799-a517-4289-b21f-7e12837f562a'
      },
      {
        id: '953fc40d-cda3-49c6-9863-55f48514761d',
        content: 'Yo tenia un perro, albondiga, y puedo asegurar que son muy nobles, el me cuidabá',
        authorId: '6682bf97-236b-4cdd-b4cb-78c4dc6d3a7c',
        postId: '7720d22b-9a8c-4265-af5c-53dde5af12a5'
      }
    ],
    skipDuplicates: true
  })

  await prisma.post.update({
    where: { id: '82d92799-a517-4289-b21f-7e12837f562a' },
    data: {
      tags: {
        connect: [
          { id: '922b5a41-e30f-4947-9acf-14f9db57d647' },
          { id: '47e0813e-0fb4-4d76-bf1d-dca1684e81cf' },
          { id: '48bf2a4a-1660-4b70-b8d7-30cc5e2cef2c' }
        ]
      }
    }
  })
  
  await prisma.post.update({
    where: { id: '7720d22b-9a8c-4265-af5c-53dde5af12a5' },
    data: {
      tags: {
        connect: [
          { id: '1ebdc15a-0e17-4892-87f7-ac3f2cd656be' },
        ]
      }
    }
  })  
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
