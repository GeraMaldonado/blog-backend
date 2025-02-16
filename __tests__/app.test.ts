import request from 'supertest'
import { createApp } from '../src/app'
import { UserModelTest } from './users/users.model'
import { UserDTO } from '../src/users/dtos/users.dto'

const app = createApp({ userModel: UserModelTest })
const url: string = '/api/users'
const user = { name: 'Gerardo Maldonado', password: 'passwordSeguro123', email: 'gmaldonadofelix@gmail.com', username: 'tHOwl953' }
let id: string

describe('User Endopints', () => {
  describe('GET All users', () => {
    it(`GET ${url} should return a list of users`, async () => {
      const response = await request(app).get(url)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body)).toBe(true)
      response.body.forEach((user: UserDTO) => {
        expect(user).toHaveProperty('username')
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
      const newUser = { ...user, email: 'gmaldonadofelix@hotmail.com', username: 'MadMax' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'username already is use' })
    })

    it(`POST ${url} should fail for repeated email`, async () => {
      const newUser = { ...user, username: 'Owl' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' })
    })

    it(`POST ${url} should fail for field empty`, async () => {
      const newUser = { ...user, name: '' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ type: 'ValidationError', message: 'name is required' })
    })
  })

  describe('GET user by id', () => {
    it(`GET ${url}/:id should return a user by id`, async () => {
      const response = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(response.body.result).toHaveProperty('username')
      expect(response.body.result).toHaveProperty('email')
      expect(response.body.result).not.toHaveProperty('password')
    })

    it(`GET ${url}/:id should fail for non-existent id`, async () => {
      const response = await request(app).get(`${url}/28`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ type: 'NotFoundError', message: 'user not found' })
    })
  })

  describe('PATCH user by id', () => {
    it(`PATCH ${url}/:id should modify the user`, async () => {
      const oldUser = await request(app).get(`${url}/${id}`)
      const response = await request(app).patch(`${url}/${id}`).send({ name: 'Gerardo' })
      const modifiedUser = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(modifiedUser.body.result.username).toBe(oldUser.body.result.username)
      expect(modifiedUser.body.result.id).toBe(oldUser.body.result.id)
      expect(modifiedUser.body.result.name).not.toBe(oldUser.body.result.name)
      expect(modifiedUser.body.result.email).toBe(oldUser.body.result.email)
    })

    it(`PATCH ${url}/:id should fail for repeated user`, async () => {
      const response = await request(app).patch(`${url}/${id}`).send({ username: 'MadMax' })
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'username already is use' })
    })

    it(`PATCH ${url}/:id should fail for repeated email`, async () => {
      const response = await request(app).patch(`${url}/${id}`).send({ email: 'mrockatansky@email.com' })
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' })
    })

    it(`PATCH ${url}/:id should fail for field empty`, async () => {
      const response = await request(app).patch(`${url}/${id}`).send({ email: ' ' })
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ type: 'ValidationError', message: 'invalid email format' })
    })
  })

  describe('DELETE user by id', () => {
    it(`DELETE ${url}/: should deleted the user`, async () => {
      const response = await request(app).delete(`${url}/${id}`)
      const userDeleted = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(userDeleted.body).toEqual({ type: 'NotFoundError', message: 'user not found' })
    })
    it(`DELETE ${url}/: should fail for non-existent id`, async () => {
      const response = await request(app).delete(`${url}/45`)
      expect(response.status).toBe(404)
      expect(response.body).toEqual({ type: 'NotFoundError', message: 'user not found' })
    })
  })
})
