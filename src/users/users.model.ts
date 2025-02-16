import { PrismaClient } from '@prisma/client'
import { randomUUID } from 'node:crypto'
import { CreateUserDTO, UserDTO, UpdateUserDTO } from './dtos/users.dto'
import { ConflictError, NotFoundError } from '../errors/customizedError'
import { encryptPassword } from '../utils'
import { IUserModel } from '../interfaces/users/IUserModel'

const prisma = new PrismaClient()

export const UserModel: IUserModel = {
  async validateUserExistance (id: string): Promise<void> {
    if (await prisma.usuario.findUnique({ where: { id } }) == null) throw new NotFoundError('user not found')
  },

  async validateUniqueFields (user: UserDTO | UpdateUserDTO): Promise<void> {
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [
          { nickname: user.nickname },
          { email: user.email }
        ]
      }
    })

    if (existingUser != null) {
      if (existingUser.nickname === user.nickname) throw new ConflictError('nickname already in use')
      if (existingUser.email === user.email) throw new ConflictError('email already in use')
    }
  },

  async getAllUsers (): Promise<UserDTO[]> {
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
  },

  async getUserById (id: string): Promise<UserDTO | null> {
    await this.validateUserExistance(id)
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
  },

  async createUser (newUser: CreateUserDTO): Promise<string> {
    await this.validateUniqueFields(newUser)
    const id: string = randomUUID()
    newUser.password = await encryptPassword(newUser.password)
    await prisma.usuario.create({ data: { id, ...newUser } })
    return id
  },

  async updateUserById (id: string, updateUser: UpdateUserDTO): Promise<string> {
    await this.validateUserExistance(id)
    await this.validateUniqueFields(updateUser)
    if (updateUser.password != null) updateUser.password = await encryptPassword(updateUser.password)
    await prisma.usuario.update({
      where: { id },
      data: updateUser
    })
    return `User ${id} updated`
  },

  async deleteUserById (id: string): Promise<string> {
    await this.validateUserExistance(id)
    await prisma.usuario.delete({ where: { id } })
    return `User ${id} deleted`
  }
}
