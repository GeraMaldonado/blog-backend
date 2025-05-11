import request from 'supertest'
import { createApp } from '../src/app'
import { UserModel } from '../src/users/users.model'
import { AuthModel } from '../src/auth/auth.model'
import { PostModel } from '../src/posts/posts.model'

const app = createApp({ postModel: PostModel, userModel: UserModel, authModel: AuthModel })

const url = '/api/categories'
const user = { email: 'mrockatansky@email.com', password: 'password123' }

let authToken: string

describe('Category Endpoints', () => {
  beforeAll(async () => {
    const loginResponse = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password })
    const cookies = Array.isArray(loginResponse.header['set-cookie']) ? loginResponse.header['set-cookie'] : [loginResponse.header['set-cookie'] || '']
    authToken = cookies.find((cookie: string) => cookie.includes('access_token')) || ''
  })

  describe('GET all categories', () => {
    it(`GET ${url} should return all categories`, async () => {
      const res = await request(app).get(url)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('POST category', () => {
    it('should create a category', async () => {
      const newCategory = { name: 'Autos', description: 'Tipos de autos y caracteristicas' }
      const res = await request(app).post(url).set('Cookie', authToken).send(newCategory)
      expect(res.status).toBe(201)
      expect(typeof res.body.data).toBe('string')
    })

    it('should fail for unauthenticated user', async () => {
      const res = await request(app).post(url).send({ name: 'NoToken', description: 'Sin autorización' })
      expect(res.status).toBe(401)
      expect(res.body.type).toBe('UnauthorizedError')
    })

    it('should fail for invalid category data', async () => {
      const res = await request(app).post(url).set('Cookie', authToken).send({ name: '', description: '' })
      expect(res.status).toBe(400)
      expect(res.body.type).toBe('ValidationError')
    })
  })
})
