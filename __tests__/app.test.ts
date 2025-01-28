import request from 'supertest'
import { createApp } from '../src/app'
import { UserModelTest } from './users/users.model.test'

const app = createApp({ userModel: UserModelTest })

describe('User Endpoints', () => {
  it('GET /api should return a list of users', async () => {
    const response = await request(app).get('/api')
    console.log(response.body)
    expect(response.status).toBe(200)
  })
})
