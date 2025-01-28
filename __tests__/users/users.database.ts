import { randomUUID } from 'node:crypto'
import { IUser } from '../../src/users/dtos/users.dto'      

export const usersDatabase: IUser[] = [
  {
    id: randomUUID(),
    nombre: 'Max Rockatansky',
    nickname: 'MadMax',
    email: 'gmaldonadofelix@gmail.com',
    password: 'password123',
    fecha_creacion: new Date()
  }, {
    id: randomUUID(),
    nombre: 'John Wick',
    nickname: 'Baba_Yaga',
    email: 'gmaldonadofelix@gmail.com',
    password: 'password123',
    fecha_creacion: new Date()
  }
]

