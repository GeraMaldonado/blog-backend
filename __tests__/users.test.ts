import request from 'supertest'
import { createApp } from '../src/app'
import { UserDTO } from '../src/users/dtos/users.dto'
import { UserModel } from '../src/users/users.model'
import {AuthModel} from '../src/auth/auth.model'
import { PostModel } from '../src/posts/posts.model'

const app = createApp({ postModel: PostModel, userModel: UserModel, authModel: AuthModel })
const url: string = '/api/users'
const user = { name: 'Gerardo Maldonado', password: 'passwordSeguro123', email: 'gmaldonadofelix@gmail.com', username: 'tHOwl953', code: '123456' }
let id: string
let authToken: string

describe('User Endopints', () => {
  describe('GET All users', () => {
    it(`GET ${url} should return a list of users`, async () => {
      const response = await request(app).get(url)
      expect(response.status).toBe(200)
      expect(Array.isArray(response.body.data)).toBe(true)
      response.body.data.forEach((user: UserDTO) => {
        expect(user).toHaveProperty('username')
        expect(user).not.toHaveProperty('password')
        expect(user).toHaveProperty('email')
      })
    })
  })

  describe('POST verify-request', () => {
  it('should send a verification code', async () => {
    const response = await request(app).post(`${url}/verify-request`).send({ name: user.name, email: user.email })
    expect(response.status).toBe(200)
    expect(response.body.message).toMatch(/código/i)
  })
})

  describe('POST user', () => {
    beforeEach(async () => {
      await request(app).post(`${url}/verify-request`).send({ name: user.name, email: user.email })
    })

    it('should create user after verification code', async () => {
      const response = await request(app).post(url).send({ ...user })
      id = response.body.data
      expect(response.status).toBe(201)
      expect(typeof response.body.data).toBe('string')
    })
    it(`POST ${url} should fail for repeated user`, async () => {
      const newUser = { ...user, email: 'gmaldonadofelix@hotmail.com', username: 'MadMax' }
      await request(app).post(`${url}/verify-request`).send({ name: newUser.name, email: newUser.email })
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'username already in use' })
    })

    it(`POST ${url} should fail for repeated email`, async () => {
      const newUser = { ...user, username: 'Owl', code: '123456' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(409)
      expect(response.body).toEqual({ type: 'ConflictError', message: 'email already in use' })
    })

    it(`POST ${url} should fail for field empty`, async () => {
      const newUser = { ...user, name: '' }
      const response = await request(app).post(url).send(newUser)
      expect(response.status).toBe(400)
      expect(response.body).toEqual({ type: 'ValidationError', message: "required: name" })
    })
  })
  describe('GET user by id', () => {
    it(`GET ${url}/:id should return a user by id`, async () => {
      const response = await request(app).get(`${url}/${id}`)
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty('username')
      expect(response.body.data).toHaveProperty('email')
      expect(response.body.data).not.toHaveProperty('password')
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
      expect(modifiedUser.body.data.username).toBe(oldUser.body.data.username)
      expect(modifiedUser.body.data.id).toBe(oldUser.body.data.id)
      expect(modifiedUser.body.data.name).not.toBe(oldUser.body.data.name)
      expect(modifiedUser.body.data.email).toBe(oldUser.body.data.email)
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
