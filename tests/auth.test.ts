import request from 'supertest'
import app from '../src/server.ts'
import env from '../env.ts'
import { createTestUser, cleanUpDataBase } from './setup/dbHelpers.ts'


describe('Authentication endpoint', () => {
  afterEach(async () => {
    await cleanUpDataBase()
  })

  describe('POST /api/auth/register', () => {
    test('should registera new user with valid data', async () => {
      const userData = {
        email: 'testemail@test.com',
        username: 'testuser',
        password: 'admin1234',
      }

      const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201)
    expect(response.body).toHaveProperty('user')
    expect(response.body).toHaveProperty('token')
    expect(response.body.user).not.toHaveProperty('password')
    })

    describe('POST /api/auth/login', () => {
      it('should login with a valid credentials', async () => {
        const testUser = await createTestUser()

        const credentials = { 
          email: testUser.user.email,
          password: testUser.rawPassword,
        }

        const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        expect(201)
      
      expect(response.body).toHaveProperty('message')
      expect(response.body).toHaveProperty('user')
      expect(response.body).toHaveProperty('token')
      expect(response.body.user).not.toHaveProperty('password')

      })
    })
  })
})