import request from 'supertest'
import { createApp } from '../src/app'
import { UserModel } from '../src/users/users.model'
import { AuthModel } from '../src/auth/auth.model'

const url = '/api/auth'
const app = createApp({ userModel: UserModel, authModel: AuthModel })
let refreshToken: string

describe('Auth Endpoints', () => {
  describe('POST login', () => {
    it(`POST ${url}/login should fail for wrong user`, async () => {
      const response = await request(app).post(`${url}/login`).send({ email: 'mrockatansky@email.com', password: 'password13' })
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Invalid email or password' })
    })

    it(`POST ${url}/login should authenticate a user `, async () => {
      const response = await request(app).post(`${url}/login`).send({ email: 'mrockatansky@email.com', password: 'password123' })
      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Login successful')
      expect(response.headers['set-cookie']).toBeDefined()
      refreshToken = Array.isArray(response.header['set-cookie'])
        ? response.header['set-cookie'].find((cookie) => cookie.includes('refresh_token'))
        : response.header['set-cookie']
    })
  })

  describe('POST refresh', () => {
    it(`POST ${url}/refresh should efresh the acces token`, async () => {
      const response = await request(app).post(`${url}/refresh`).set('Cookie', refreshToken)
      expect(response.status).toBe(200)
      expect(response.body).toEqual({ message: 'Token refreshed successfully' })
    })

    it(`POST ${url}/refresh should fail for token mismatch`, async () => {
      const response = await request(app).post(`${url}/refresh`)
      expect(response.status).toBe(401)
      expect(response.body).toEqual({ type: 'UnauthorizedError', message: 'Refresh token not provided' })
    })
  })

  describe('POST logout', () => {
    it(`POST ${url}/logout should delete the user`, async () => {
      const response = await request(app).post(`${url}/logout`)

      expect(response.status).toBe(200)
      expect(response.body.message).toBe('Logout successful')
    })
  })
})
