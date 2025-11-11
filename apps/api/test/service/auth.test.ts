import { beforeEach, describe, expect, it, vi } from 'vitest'

import * as refreshRepo from '../../src/modules/auth/repository'
import * as auth from '../../src/modules/auth/service'
import * as userRepo from '../../src/modules/user/repository'
import { Errors } from '../../src/utils/errors'
import * as jwt from '../../src/utils/jwt'
import * as password from '../../src/utils/password'
import { makeRefreshToken, makeUser } from '../helpers/factories'

vi.mock('../../src/modules/user/repository', () => ({
  findByEmail: vi.fn(),
  create: vi.fn(),
}))

vi.mock('../../src/modules/auth/repository', () => ({
  createForUser: vi.fn(),
  revoke: vi.fn(),
  findById: vi.fn(),
}))

vi.mock('../../src/utils/jwt', () => ({
  signAccessToken: vi.fn(),
  signRefreshToken: vi.fn(),
  verifyRefreshToken: vi.fn(),
}))

vi.mock('../../src/utils/password', () => ({
  verifyPassword: vi.fn(),
  hashPassword: vi.fn(),
}))

describe('Auth Service', () => {
  beforeEach(() => {
    vi.resetAllMocks()

    vi.mocked(password.verifyPassword).mockImplementation(async (a, b) => a === b)
    vi.mocked(password.hashPassword).mockImplementation(async (p) => `hashed:${p}`)
  })

  describe('register', () => {
    it('throws if email already exists', async () => {
      const user = makeUser()
      vi.mocked(userRepo.findByEmail).mockResolvedValue(user)

      await expect(auth.register(user.email, user.password)).rejects.toThrow(
        Errors.Conflict('Email already registered')
      )
    })

    it('creates user when email is available', async () => {
      const user = makeUser()
      vi.mocked(userRepo.findByEmail).mockResolvedValue(null)
      vi.mocked(userRepo.create).mockResolvedValue(user)

      const registeredUser = await auth.register(user.email, user.password)

      expect(userRepo.findByEmail).toHaveBeenCalled()
      expect(userRepo.create).toHaveBeenCalledWith({
        email: user.email,
        password: `hashed:${user.password}`,
      })
      expect(registeredUser).toMatchObject({
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
      })
    })
  })

  describe('login', () => {
    it('throws on invalid credentials', async () => {
      vi.mocked(userRepo.findByEmail).mockResolvedValue(null)

      await expect(auth.login('no@user.com', 'pass')).rejects.toThrow(
        Errors.Auth.InvalidCredentials()
      )
    })

    it('returns tokens on success', async () => {
      const user = makeUser()
      const refreshToken = makeRefreshToken({ user })

      vi.mocked(userRepo.findByEmail).mockResolvedValue(user)
      vi.mocked(jwt.signAccessToken).mockReturnValue('access123')
      vi.mocked(jwt.signRefreshToken).mockReturnValue('refresh123')
      vi.mocked(refreshRepo.createForUser).mockResolvedValue(refreshToken)

      const result = await auth.login(user.email, user.password)

      expect(result).toMatchObject({
        user: {
          id: user.id,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
          updatedAt: user.updatedAt.toISOString(),
        },
        accessToken: 'access123',
        refreshToken: 'refresh123',
      })
    })
  })

  describe('refresh', () => {
    it('rotates refresh tokens', async () => {
      const user = makeUser()
      const oldRefreshToken = makeRefreshToken(user)
      const newRefreshToken = makeRefreshToken(user)

      vi.mocked(jwt.verifyRefreshToken).mockReturnValue({
        userId: user.id,
        jti: oldRefreshToken.id,
      })
      vi.mocked(refreshRepo.findById).mockResolvedValue(oldRefreshToken)
      vi.mocked(refreshRepo.createForUser).mockResolvedValue(newRefreshToken)
      vi.mocked(jwt.signAccessToken).mockReturnValue('access_new')
      vi.mocked(jwt.signRefreshToken).mockReturnValue('refresh_new')

      const result = await auth.refresh('refresh_old')
      expect(refreshRepo.findById).toHaveBeenCalledWith(oldRefreshToken.id)
      expect(refreshRepo.revoke).toHaveBeenCalledWith(oldRefreshToken.id)
      expect(result).toEqual({
        accessToken: 'access_new',
        refreshToken: 'refresh_new',
      })
    })

    it('rejects reused token', async () => {
      const user = makeUser()
      const refreshToken = makeRefreshToken({ user, revoked: true })

      vi.mocked(jwt.verifyRefreshToken).mockReturnValue({ userId: user.id, jti: refreshToken.id })
      vi.mocked(refreshRepo.findById).mockResolvedValue(refreshToken)

      await expect(auth.refresh('refresh_old')).rejects.toThrow(Errors.Auth.TokenReused())
    })
  })
})
