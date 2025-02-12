import request from 'supertest'
import { createApp } from '../src/app'
import { UserModelTest } from './users/users.model'
import { UserDTO } from '../src/users/dtos/users.dto'

const app = createApp({ userModel: UserModelTest })
const url: string = '/api/users'
const user = { nombre: 'Gerardo Maldonado', password: 'passwordSeguro123', email: 'gmaldonadofelix@gmail.com', nickname: 'tHOwl953' }
let id: string

describe('User Endopints', () => {
  describe('GET All users', () => {
    it(`GET ${url} should return a list of users`, async () => {
      const response = await request(app).get(url)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      response.body.forEach((user: UserDTO) => {
        expect(user).toHaveProperty('nickname')
        expect(user).not.toHaveProperty('password')
        expect(user).toHaveProperty('email')
      })
    })
  })

  describe('POST user', () => {
    it(`POST ${url} should create a user`, async () => {
      const newUser = { ...user }
      const response = await request(app).post(url).send(newUser)
      id = response.body.result
      expect(response.status).toBe(201)
      expect(typeof response.body.result).toBe('string')
    })

    it(`POST ${url} should fail for repeated user`, async () => {
      const newUser = { ...user, email: 'gmaldonadofelix@hotmail.com' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'nickname already is use' })
    })

    it(`POST ${url} should fail for repeated email`, async () => {
      const newUser = { ...user, nickname: 'Owl' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' })
    })

    it(`POST ${url} should fail for field empty`, async () => {
      const newUser = { ...user, nombre: '' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ type: 'ValidationError', message: 'nombre is required' })
    })
  })

  describe('GET user by id', () => {
    it(`GET ${url} sould return a userb by id`, async () => {
      const response = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(response.body.result).toHaveProperty('nickname')
      expect(response.body.result).toHaveProperty('email')
      expect(response.body.result).not.toHaveProperty('password')
    })
  })
})
