import request from 'supertest'
import { createApp } from '../src/app'
import { UserModel } from '../src/users/users.model'
import { AuthModel } from '../src/auth/auth.model'
import { PostModel } from '../src/posts/posts.model'

const app = createApp({ postModel: PostModel, userModel: UserModel, authModel: AuthModel })

const url = '/api/comments'
const user = { email: 'mrockatansky@email.com', password: 'password123' }
let authToken: string
let authorId: string
let commentId: string

describe('Comment Endpoints', () => {
  beforeAll(async () => {
    const loginRes = await request(app).post('/api/auth/login').send(user)
    const cookies = Array.isArray(loginRes.header['set-cookie']) ? loginRes.header['set-cookie'] : [loginRes.header['set-cookie'] || '']
    authToken = cookies.find((c: string) => c.includes('access_token')) || ''
    authorId = loginRes.body.data.id
  })

  describe('GET comments', () => {
    it('should return all comments', async () => {
      const res = await request(app).get(url)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('POST comment', () => {
    it('should create a comment', async () => {
      const res = await request(app).post(url).set('Cookie', authToken).send({
        content: 'Excelente contenido.',
        authorId: authorId,
        postId: '7720d22b-9a8c-4265-af5c-53dde5af12a5'
      })
      commentId = res.body.data
      expect(res.status).toBe(201)
      expect(typeof commentId).toBe('string')
    })

    it('should fail for unauthenticated user', async () => {
      const res = await request(app).post(url).send({
        content: 'Sin login',
        postId: '7720d22b-9a8c-4265-af5c-53dde5af12a5'
      })
      expect(res.status).toBe(401)
      expect(res.body.type).toBe('UnauthorizedError')
    })

    it('should fail for missing content', async () => {
      const res = await request(app).post(url).set('Cookie', authToken).send({
        content: '',
        postId: '7720d22b-9a8c-4265-af5c-53dde5af12a5'
      })
      expect(res.status).toBe(400)
      expect(res.body.type).toBe('ValidationError')
    })
  })
})
