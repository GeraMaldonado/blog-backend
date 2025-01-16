import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'crypto'
import { CreateUserDTO, UserDTO } from './dtos/users.dto'

const prisma = new PrismaClient()

const getAllUsers = async (): Promise<UserDTO[]> => {
  const allUsers: UserDTO[] = await prisma.usuario.findMany({
    select: {
      id: true,
      nombre: true,
      nickname: true,
      email: true,
      fecha_creacion: true
    }
  })
  return allUsers
}

const createUser = async (newUser: CreateUserDTO): Promise<string> => {
  const id: string = randomUUID()
  await prisma.usuario.create({ data: { id, ...newUser } })
  return id
}

export default {
  getAllUsers,
  createUser
}
