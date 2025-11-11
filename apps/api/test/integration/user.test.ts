import request from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'

import app from '../../src/app'
import { AppDataSource } from '../../src/db/data-source'
import { User } from '../../src/db/index.js'
import { cleanDatabase } from '../helpers/db'
import { makeUser } from '../helpers/factories'

describe('User Integration', () => {
  const dataSource = AppDataSource
  const userRepo = AppDataSource.getRepository(User)

  afterEach(async () => {
    await cleanDatabase(dataSource)
  })

  it('GET /users lists all users', async () => {
    const user1 = await userRepo.save(makeUser({ email: 'user1@email.com' }))
    const user2 = await userRepo.save(makeUser({ email: 'user2@email.com' }))

    const res = await request(app).get('/users')

    expect(res.status).toBe(200)
    expect(res.body.data).toBeInstanceOf(Array)
    expect(res.body.data.length).toBeGreaterThanOrEqual(2)

    const emails = res.body.data.map((u) => u.email)
    expect(emails).toContain(user1.email)
    expect(emails).toContain(user2.email)
  })

  it('GET /users/:id retrieves a specific user', async () => {
    const createdUser = await userRepo.save(makeUser({ email: 'test@email.com' }))

    const res = await request(app).get(`/users/${createdUser.id}`)

    expect(res.status).toBe(200)
    expect(res.body.data).toMatchObject({
      id: createdUser.id,
      email: createdUser.email,
      createdAt: createdUser.createdAt.toISOString(),
      updatedAt: createdUser.updatedAt.toISOString(),
    })
  })

  it('PATCH /users/:id updates a user', async () => {
    const createdUser = await userRepo.save(makeUser({ email: 'old@email.com' }))
    const updatedPayload = { email: 'new@email.com' }

    const res = await request(app).patch(`/users/${createdUser.id}`).send(updatedPayload)

    expect(res.status).toBe(200)
    expect(res.body.data.email).toBe(updatedPayload.email)

    const userInDb = await userRepo.findOne({
      where: { id: createdUser.id },
    })

    expect(userInDb).toBeDefined()
    expect(userInDb!.email).toBe(updatedPayload.email)
    expect(userInDb!.updatedAt.getTime()).toBeGreaterThan(userInDb!.createdAt.getTime())
  })

  it('DELETE /users/:id removes a user', async () => {
    const createdUser = await userRepo.save(makeUser({ email: 'todelete@email.com' }))
    const userId = createdUser.id

    const res = await request(app).delete(`/users/${userId}`)

    expect(res.status).toBe(204)
    expect(res.body).toEqual({})

    const userInDb = await userRepo.findOne({
      where: { id: userId },
    })

    expect(userInDb).toBeNull()
  })
})
