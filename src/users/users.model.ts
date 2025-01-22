import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CreateUserDTO, UserDTO, UpdateUserDTO } from './dtos/users.dto'
import { NotFoundError } from '../errors/customizedError'

const prisma = new PrismaClient()

const validateUserExistance = async (id: string): Promise<void> => {
  if (await prisma.usuario.findUnique({ where: { id } }) == null) throw new NotFoundError('user not found')
}

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

const getUserById = async (id: string): Promise<UserDTO | null> => {
  await validateUserExistance(id)
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
  return user
}

const createUser = async (newUser: CreateUserDTO): Promise<string> => {
  const id: string = randomUUID()
  await prisma.usuario.create({ data: { id, ...newUser } })
  return id
}

const updateUserById = async (id: string, updateUser: UpdateUserDTO): Promise<string> => {
  await validateUserExistance(id)
  await prisma.usuario.update({
    where: { id },
    data: updateUser
  })
  return `User ${id} updated`
}

const deleteUserById = async (id: string): Promise<string> => {
  await validateUserExistance(id)
  await prisma.usuario.delete({ where: { id } })
  return `User ${id} deleted`
}

export default {
  getAllUsers,
  createUser,
  getUserById,
  updateUserById,
  deleteUserById
}
