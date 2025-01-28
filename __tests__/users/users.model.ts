import { randomUUID } from 'node:crypto'
import { CreateUserDTO, UpdateUserDTO, UserDTO } from '../../src/users/dtos/users.dto'
import { IUserModel } from '../../src/users/IUserModel'
import { ConflictError, NotFoundError } from '../../src/errors/customizedError'
import { usersDatabase } from './users.database'

export const UserModelTest: IUserModel = {
  async getAllUsers (): Promise<UserDTO[]> {
    console.log(usersDatabase)
    return usersDatabase
  },
  async getUserById (id: string): Promise<UserDTO | null> {
    await this.validateUserExistance(id)
    console.log(usersDatabase.find(u => u.id === id))
    return usersDatabase.find(u => u.id === id) ?? null
  },
  async createUser (newUser: CreateUserDTO): Promise<string> {
    await this.validateUniqueFields(newUser)
    const id = randomUUID()
    usersDatabase.push({ id, fecha_creacion: new Date(), ...newUser })
    console.log({ id, fecha_creacion: new Date(), ...newUser })
    return id
  },
  async updateUserById (id: string, updateUser: UpdateUserDTO): Promise<string> {
    await this.validateUserExistance(id)
    await this.validateUniqueFields(updateUser)
    const indexUser = usersDatabase.findIndex(u => u.id === id)
    usersDatabase[indexUser] = { ...usersDatabase[indexUser], ...updateUser }
    console.log(updateUser)
    return `User ${id} updated`
  },
  async deleteUserById (id: string): Promise<string> {
    await this.validateUserExistance(id)
    const indexUser = usersDatabase.findIndex(u => u.id === id)
    usersDatabase.splice(indexUser, 1)
    console.log(`user ${id} deleted`)
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
