import { prisma } from '../model/database'
import { randomUUID } from 'node:crypto'
import { CreateUserDTO, UserDTO, UpdateUserDTO } from './dtos/users.dto'
import { ConflictError, NotFoundError } from '../errors/customizedError'
import { encryptPassword } from '../utils'
import { IUserModel } from '../interfaces/users/IUserModel'

export const UserModel: IUserModel = {
  async validateUserExistance (id: string): Promise<void> {
    if (await prisma.user.findUnique({ where: { id } }) == null) throw new NotFoundError('user not found')
  },

  async validateUniqueFields (user: UserDTO | UpdateUserDTO): Promise<void> {
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: user.username },
          { email: user.email }
        ]
      }
    })

    if (existingUser != null) {
      if (existingUser.username === user.username) throw new ConflictError('username already in use')
      if (existingUser.email === user.email) throw new ConflictError('email already in use')
    }
  },

  async getAllUsers (): Promise<UserDTO[]> {
    const allUsers: UserDTO[] = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        creation_date: true
      }
    })
    return allUsers
  },

  async getUserById (id: string): Promise<UserDTO | null> {
    await this.validateUserExistance(id)
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        creation_date: true
      },
      where: { id }
    })
    return user
  },

  async createUser (newUser: CreateUserDTO): Promise<string> {
    await this.validateUniqueFields(newUser)
    const id: string = randomUUID()
    newUser.password = await encryptPassword(newUser.password)
    await prisma.user.create({ data: { id, ...newUser } })
    return id
  },

  async updateUserById (id: string, updateUser: UpdateUserDTO): Promise<string> {
    await this.validateUserExistance(id)
    await this.validateUniqueFields(updateUser)
    if (updateUser.password != null) updateUser.password = await encryptPassword(updateUser.password)
    await prisma.user.update({
      where: { id },
      data: updateUser
    })
    return `User ${id} updated`
  },

  async deleteUserById (id: string): Promise<string> {
    await this.validateUserExistance(id)
    await prisma.user.delete({ where: { id } })
    return `User ${id} deleted`
  }
}
