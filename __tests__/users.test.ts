import request from 'supertest'
import { createApp } from '../src/app'
import { UserDTO } from '../src/users/dtos/users.dto'
import { UserModel } from '../src/users/users.model'
import {AuthModel} from '../src/auth/auth.model'

const app = createApp({ userModel: UserModel, authModel: AuthModel })
const url: string = '/api/users'
const user = { name: 'Gerardo Maldonado', password: 'passwordSeguro123', email: 'gmaldonadofelix@gmail.com', username: 'tHOwl953' }
let id: string
let authToken: string

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
      expect(response.body).toEqual({ type: 'ConflictError', message: 'username already in use' })
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
      expect(response.body).toEqual({ type: 'ValidationError', message: 'required: name' })
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
    beforeAll(async () => {
      const loginResponse = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password })
      const cookies = Array.isArray(loginResponse.header['set-cookie']) ? loginResponse.header['set-cookie'] : [loginResponse.header['set-cookie'] || '']

      authToken = cookies.find((cookie: string) => cookie.includes('access_token')) || ''
    })

    it(`PATCH ${url}/:id should modify the user`, async () => {
      const oldUser = await request(app).get(`${url}/${id}`)
      const response = await request(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ name: 'Gerardo' })
      const modifiedUser = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(modifiedUser.body.result.username).toBe(oldUser.body.result.username)
      expect(modifiedUser.body.result.id).toBe(oldUser.body.result.id)
      expect(modifiedUser.body.result.name).not.toBe(oldUser.body.result.name)
      expect(modifiedUser.body.result.email).toBe(oldUser.body.result.email)
    })

    it(`PATCH ${url}/:id should fail for not having authentication`, async () => {
      const response = await request(app).patch(`${url}/${id}`).send({ email: 'gmaldonadofelix@hotmail.com' })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Token not provided' })
    })

    it(`PATCH ${url}/:id should fail due to auth mismatch`, async () => {
      const oterID = 'otherID'
      const response = await request(app).patch(`${url}/${oterID}`).set('Cookie', authToken).send({ email: 'gmaldonadofelix@hotmail.com' })
      expect(response.status).toBe(403)
      expect(response.body).toEqual({ type: 'ForbiddenError', message: 'You do not have permission to modify this resource' })
    })

    it(`PATCH ${url}/:id should fail for repeated user`, async () => {
      const response = await request(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ username: 'MadMax' })
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'username already in use' })
    })

    it(`PATCH ${url}/:id should fail for repeated email`, async () => {
      const response = await request(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ email: 'mrockatansky@email.com' })
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' })
    })

    it(`PATCH ${url}/:id should fail for field empty`, async () => {
      const response = await request(app).patch(`${url}/${id}`).set('Cookie', authToken).send({ email: ' ' })
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ type: 'ValidationError', message: 'required: email' })
    })
  })

  describe('DELETE user by id', () => {
    it(`DELETE ${url}/: should deleted the user`, async () => {
      const response = await request(app).delete(`${url}/${id}`).set('Cookie', authToken)
      const userDeleted = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(userDeleted.body).toEqual({ type: 'NotFoundError', message: 'user not found' })
    })

    it(`DELETE ${url}/:id should fail for not having authentication`, async () => {
      const response = await request(app).delete(`${url}/${id}`)
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Token not provided' })
    })

    it(`DELETE ${url}/: should fail due to auth mismatch`, async () => {
      id = 'otherID'
      const response = await request(app).delete(`${url}/${id}`).set('Cookie', authToken)
      expect(response.status).toBe(403)
      expect(response.body).toEqual({ type: 'ForbiddenError', message: 'You do not have permission to modify this resource' })
    })
  })
})
