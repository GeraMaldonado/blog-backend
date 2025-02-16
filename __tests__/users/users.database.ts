import { randomUUID } from 'node:crypto'
import { IUser } from '../../src/interfaces/users/IUser'

export const usersDatabase: IUser[] = [
  {
    id: randomUUID(),
    name: 'Max Rockatansky',
    username: 'MadMax',
    email: 'mrockatansky@email.com',
    password: '$2a$12$TSG6/dDPUudI4v7QhDVDT.AeuV3UnboEfptoPz0mzanHIQYocR2fa',
    creation_date: new Date()
  }, {
    id: randomUUID(),
    name: 'John Wick',
    username: 'Baba_Yaga',
    email: 'john_wick@email.com',
    password: '$2a$12$U..P8k0DzyDhSMeMbQU8W.eMIKIQVQp9z2lm8mLjyl4ijxCuJATgK',
    creation_date: new Date()
  }
]
