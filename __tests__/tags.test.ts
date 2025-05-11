import request from 'supertest'
import { createApp } from '../src/app'
import { UserModel } from '../src/users/users.model'
import { AuthModel } from '../src/auth/auth.model'
import { PostModel } from '../src/posts/posts.model'

const app = createApp({ postModel: PostModel, userModel: UserModel, authModel: AuthModel })

const url = '/api/tags'
const user = { email: 'mrockatansky@email.com', password: 'password123' }

let authToken: string

describe('Tag Endpoints', () => {
  beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send(user)
    const cookies = Array.isArray(loginRes.header['set-cookie']) ? loginRes.header['set-cookie'] : [loginRes.header['set-cookie'] || '']
    authToken = cookies.find((c: string) => c.includes('access_token')) || ''
  })

  describe('GET tags', () => {
    it(`GET ${url} should return all tags`, async () => {
      const res = await request(app).get(url)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('POST tag', () => {
    it('should create a tag', async () => {
      const res = await request(app).post(url).set('Cookie', authToken).send({ name: 'pruebatag' })
      expect(res.status).toBe(201)
      expect(typeof res.body.data).toBe('string')
    })

    it('should fail without authentication', async () => {
      const res = await request(app).post(url).send({ name: 'noAuthTag' })
      expect(res.status).toBe(401)
      expect(res.body.type).toBe('UnauthorizedError')
    })

    it('should fail with empty name', async () => {
      const res = await request(app).post(url).set('Cookie', authToken).send({ name: '' })
      expect(res.status).toBe(400)
      expect(res.body.type).toBe('ValidationError')
    })
  })
})
