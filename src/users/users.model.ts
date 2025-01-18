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

const getUserById = async (id: string): Promise<UserDTO> => {
  const user = await prisma.usuario.findUnique({
    select: {
      id: true,
      nombre: true,
      nickname: true,
      email: true,
      fecha_creacion: true
    },
    where: { id }
  })
  if (user == null) throw new Error('user not found')
  return user
}

const createUser = async (newUser: CreateUserDTO): Promise<string> => {
  const id: string = randomUUID()
  await prisma.usuario.create({ data: { id, ...newUser } })
  return id
}

export default {
  getAllUsers,
  createUser,
  getUserById
}
