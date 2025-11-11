import request from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'

import app from '../../src/app'
import { AppDataSource } from '../../src/db/data-source'
import { User } from '../../src/db/index'
import { cleanDatabase, createUser } from '../helpers/db'
import { getCookie } from '../helpers/http'

describe('Auth HTTP', () => {
  const dataSource = AppDataSource
  const userRepo = AppDataSource.getRepository(User)

  afterEach(async () => {
    await cleanDatabase(dataSource)
  })

  describe('register', () => {
    it('creates a new user', async () => {
      const res = await request(app)
        .post('/auth/register')
        .send({ email: 'new@example.com', password: 'pass123' })

      expect(res.status).toBe(201)
      expect(res.body.data.user.email).toBe('new@example.com')
    })

    it('fails when email already exists', async () => {
      const existing = await createUser(userRepo)

      const res = await request(app)
        .post('/auth/register')
        .send({ email: existing.email, password: existing.password })

      expect(res.status).toBe(409)
      expect(res.body.error.code).toBe('CONFLICT')
    })
  })

  describe('login', () => {
    it('returns access token + refresh cookie', async () => {
      const user = await createUser(userRepo)

      const res = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })

      const cookie = getCookie(res)

      expect(res.status).toBe(200)
      expect(res.body.data.access).toBeDefined()
      expect(cookie).toMatch(/refresh_token=/)
    })

    it('fails with invalid credentials', async () => {
      const res = await request(app)
        .post('/auth/login')
        .send({ email: 'nope@example.com', password: 'wrong_password' })

      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('AUTH_INVALID_CREDENTIALS')
    })
  })

  describe('refresh', () => {
    it('rotates refresh tokens and returns new access', async () => {
      const user = await createUser(userRepo)

      const login = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })

      const oldCookie = getCookie(login)

      const refresh = await request(app).post('/auth/refresh').set('Cookie', oldCookie)

      const newCookie = getCookie(refresh)

      expect(refresh.status).toBe(200)
      expect(refresh.body.data.access).toBeDefined()
      expect(newCookie).not.toBe(oldCookie)
      //@TODO: check token on DB
    })

    it('fails when called without cookie', async () => {
      const res = await request(app).post('/auth/refresh')

      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('AUTH_MISSING_TOKEN')
    })
  })

  describe('logout', () => {
    it('revokes refresh token and prevents reuse', async () => {
      const user = await createUser(userRepo)

      const login = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: user.password })

      const cookie = getCookie(login)

      const logout = await request(app).post('/auth/logout').set('Cookie', cookie)

      expect(logout.status).toBe(204)

      const reuse = await request(app).post('/auth/refresh').set('Cookie', cookie)

      expect(reuse.status).toBe(401)
      expect(reuse.body.error.code).toBe('AUTH_TOKEN_REUSED')
    })
  })

  describe('authGuard', () => {
    it('blocks requests without Authorization header', async () => {
      const res = await request(app).get('/projects')
      expect(res.status).toBe(401)
      expect(res.body.error.code).toBe('AUTH_MISSING_TOKEN')
    })

    it('allows requests with valid access token', async () => {
      const user = await createUser(userRepo)

      const login = await request(app)
        .post('/auth/login')
        .send({ email: user.email, password: 'password' })

      const access = login.body.data.access

      const res = await request(app).get('/projects').set('Authorization', `Bearer ${access}`)

      expect(res.status).toBe(200)
    })
  })
})
