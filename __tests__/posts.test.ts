import request from 'supertest'
import { createApp } from '../src/app'
import { PostModel } from '../src/posts/posts.model'
import { UserModel } from '../src/users/users.model'
import { AuthModel } from '../src/auth/auth.model'

const app = createApp({ postModel: PostModel, userModel: UserModel, authModel: AuthModel })

const url = '/api/posts'
const user = { email: 'mrockatansky@email.com', password: 'password123' }

let postId: string
let authToken: string
let authorId: string

describe('Post Endpoints', () => {
    beforeAll(async () => {
      const loginResponse = await request(app).post('/api/auth/login').send({ email: user.email, password: user.password })
      const cookies = Array.isArray(loginResponse.header['set-cookie']) ? loginResponse.header['set-cookie'] : [loginResponse.header['set-cookie'] || '']
      authToken = cookies.find((cookie: string) => cookie.includes('access_token')) || ''
      authorId = loginResponse.body.data.id
    })

  describe('GET all posts', () => {
    it(`GET ${url} should return all posts`, async () => {
      const res = await request(app).get(url)
      expect(res.status).toBe(200)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('POST post', () => {
    it('should create a post', async () => {
      const newPost = { title: 'Este es un post', content: 'contenido de prueba', authorId }
      const res = await request(app).post(url).set('Cookie', authToken).send(newPost)
      postId = res.body.data
      expect(res.status).toBe(201)
      expect(typeof postId).toBe('string')
    })

    it('should fail for unauthenticated user', async () => {
      const res = await request(app).post(url).send({ title: 'Sin token', content: '...' })
      expect(res.status).toBe(401)
      expect(res.body.type).toBe('UnauthorizedError')
    })

    it('should fail for invalid post data', async () => {
      const res = await request(app).post(url).set('Cookie', authToken).send({ title: '' })
      expect(res.status).toBe(400)
      expect(res.body.type).toBe('ValidationError')
    })
  })

  describe('GET post by id', () => {
    it('should get a post by ID', async () => {
      const res = await request(app).get(`${url}/${postId}`)
      expect(res.status).toBe(200)
      expect(res.body.data).toHaveProperty('title')
    })

    it('should return 404 for invalid ID', async () => {
      const res = await request(app).get(`${url}/invalid-id`)
      expect(res.status).toBe(404)
      expect(res.body.type).toBe('NotFoundError')
    })
  })

  describe('PATCH post', () => {
    it('should update a post', async () => {
      const res = await request(app).patch(`${url}/${postId}`).set('Cookie', authToken).send({ title: 'Post editado' })
      expect(res.status).toBe(200)
    })

    it('should fail without authentication', async () => {
      const res = await request(app).patch(`${url}/${postId}`).send({ title: 'fail' })
      expect(res.status).toBe(401)
    })

    it('should fail for mismatched user', async () => {
      const res = await request(app).patch(`${url}/7720d22b-9a8c-4265-af5c-53dde5af12a5`).set('Cookie', authToken).send({ title: 'fail' })
      expect(res.status).toBe(403)
    })
  })

  describe('DELETE post', () => {
    it('should delete a post', async () => {
      const res = await request(app).delete(`${url}/${postId}`).set('Cookie', authToken)
      expect(res.status).toBe(200)
    })

    it('should fail without auth', async () => {
      const res = await request(app).delete(`${url}/${postId}`)
      expect(res.status).toBe(401)
    })

    it('should fail with mismatched user', async () => {
      const res = await request(app).delete(`${url}/7720d22b-9a8c-4265-af5c-53dde5af12a5`).set('Cookie', authToken)
      expect(res.status).toBe(403)
    })
  })
})
