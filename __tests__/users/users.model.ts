import { randomUUID } from 'node:crypto'
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../src/users/dtos/users.dto'
import { IUserModel } from '../../src/users/IUserModel'
import { ConflictError, NotFoundError } from '../../src/errors/customizedError'
import { usersDatabase } from './users.database'
import { encryptPassword } from '../../src/utils'

export const UserModelTest: IUserModel = {
  async getAllUsers (): Promise<UserDTO[]> {
    return usersDatabase.map(({ password, ...userWithoutPassword }) => userWithoutPassword)
  },
  async getUserById (id: string): Promise<UserDTO | null> {
    await this.validateUserExistance(id)
    return usersDatabase.find(u => u.id === id) ?? null
  },
  async createUser (newUser: CreateUserDTO): Promise<string> {
    await this.validateUniqueFields(newUser)
    const id = randomUUID()
    newUser.password = await encryptPassword(newUser.password)
    usersDatabase.push({ id, fecha_creacion: new Date(), ...newUser })
    return id
  },
  async updateUserById (id: string, updateUser: UpdateUserDTO): Promise<string> {
    await this.validateUserExistance(id)
    await this.validateUniqueFields(updateUser)
    if (updateUser.password != null) updateUser.password = await encryptPassword(updateUser.password)
    const indexUser = usersDatabase.findIndex(u => u.id === id)
    usersDatabase[indexUser] = { ...usersDatabase[indexUser], ...updateUser }
    return `User ${id} updated`
  },
  async deleteUserById (id: string): Promise<string> {
    await this.validateUserExistance(id)
    const indexUser = usersDatabase.findIndex(u => u.id === id)
    usersDatabase.splice(indexUser, 1)
    return `User ${id} deleted`
  },
  async validateUserExistance (id: string): Promise<void> {
    if (usersDatabase.findIndex(u => u.id === id) === -1) throw new NotFoundError('user not found')
  },
  async validateUniqueFields (user: UserDTO | UpdateUserDTO): Promise<void> {
    if ((usersDatabase.filter(x => x.nickname === user.nickname)).length >= 1) throw new ConflictError('nickname already is use')
    if ((usersDatabase.filter(x => x.email === user.email)).length >= 1) throw new ConflictError('email already in use')
  }
}
