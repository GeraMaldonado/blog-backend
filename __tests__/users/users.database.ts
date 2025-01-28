import { randomUUID } from 'node:crypto'
import { IUser } from '../../src/users/dtos/users.dto'

export const usersDatabase: IUser[] = [
  {
    id: randomUUID(),
    nombre: 'Max Rockatansky',
    nickname: 'MadMax',
    email: 'mrockatansky@email.com',
    password: '$2a$12$TSG6/dDPUudI4v7QhDVDT.AeuV3UnboEfptoPz0mzanHIQYocR2fa',
    fecha_creacion: new Date()
  }, {
    id: randomUUID(),
    nombre: 'John Wick',
    nickname: 'Baba_Yaga',
    email: 'john_wick@email.com',
    password: '$2a$12$U..P8k0DzyDhSMeMbQU8W.eMIKIQVQp9z2lm8mLjyl4ijxCuJATgK',
    fecha_creacion: new Date()
  }
]
