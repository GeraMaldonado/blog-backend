import { randomUUID } from 'node:crypto'
import { CreateUserDTO, UpdateUserDTO, UserDTO, IUser } from '../../src/users/dtos/users.dto'
import { IUserModel } from '../../src/users/IUserModel'
import { ConflictError, NotFoundError } from '../../src/errors/customizedError'

const usersDatabaseTest: IUser[] = [{
  id: randomUUID(),
  nombre: 'Gerardo Maldonado Félix',
  nickname: 'tHOwl953',
  email: 'gmaldonadofelix@gmail.com',
  password: 'password123',
  fecha_creacion: new Date()
}]

export const UserModelTest: IUserModel = {
  async getAllUsers (): Promise<UserDTO[]> {
    console.log(usersDatabaseTest)
    return usersDatabaseTest
  },
  async getUserById (id: string): Promise<UserDTO | null> {
    await this.validateUserExistance(id)
    console.log(usersDatabaseTest.find(u => u.id === id))
    return usersDatabaseTest.find(u => u.id === id) ?? null
  },
  async createUser (newUser: CreateUserDTO): Promise<string> {
    await this.validateUniqueFields(newUser)
    const id = randomUUID()
    usersDatabaseTest.push({ id, fecha_creacion: new Date(), ...newUser })
    console.log({ id, fecha_creacion: new Date(), ...newUser })
    return id
  },
  async updateUserById (id: string, updateUser: UpdateUserDTO): Promise<string> {
    await this.validateUserExistance(id)
    await this.validateUniqueFields(updateUser)
    const indexUser = usersDatabaseTest.findIndex(u => u.id === id)
    usersDatabaseTest[indexUser] = { ...usersDatabaseTest[indexUser], ...updateUser }
    console.log(updateUser)
    return `User ${id} updated`
  },
  async deleteUserById (id: string): Promise<string> {
    await this.validateUserExistance(id)
    const indexUser = usersDatabaseTest.findIndex(u => u.id === id)
    usersDatabaseTest.splice(indexUser, 1)
    console.log(`user ${id} deleted`)
    return `User ${id} deleted`
  },
  async validateUserExistance (id: string): Promise<void> {
    if (usersDatabaseTest.findIndex(u => u.id === id) === -1) throw new NotFoundError('user not found')
  },
  async validateUniqueFields (user: UserDTO | UpdateUserDTO): Promise<void> {
    if ((usersDatabaseTest.filter(x => x.nickname === user.nickname)).length >= 1) throw new ConflictError('nickname already is use')
    if ((usersDatabaseTest.filter(x => x.email === user.email)).length >= 1) throw new ConflictError('email already in use')
  }
}
