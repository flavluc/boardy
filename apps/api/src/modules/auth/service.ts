import { Errors } from '../../utils/errors'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../../utils/jwt'
import { hashPassword, verifyPassword } from '../../utils/password'
import * as userRepo from '../user/repository'
import * as refreshRepo from './repository'

export async function register(email: string, password: string) {
  const existing = await userRepo.findByEmail(email)
  if (existing) throw Errors.Conflict('Email already registered')

  const user = await userRepo.create({
    email,
    password: await hashPassword(password),
  })

  return user
}

export async function login(email: string, password: string) {
  const user = await userRepo.findByEmail(email)
  if (!user || !(await verifyPassword(password, user.password))) {
    throw Errors.Auth.InvalidCredentials()
  }

  const refresh = await refreshRepo.createForUser(user.id)
  const accessToken = signAccessToken(user.id)
  const refreshToken = signRefreshToken(user.id, refresh.id)

  return { user, accessToken, refreshToken }
}

export async function refresh(oldToken: string) {
  let payload
  try {
    payload = verifyRefreshToken(oldToken)
  } catch {
    throw Errors.Auth.TokenExpired()
  }

  const stored = await refreshRepo.findById(payload.jti)
  if (!stored || stored.revoked) {
    throw Errors.Auth.TokenReused()
  }

  await refreshRepo.revoke(stored.id)

  const newRefresh = await refreshRepo.createForUser(payload.userId)
  const newAccess = signAccessToken(payload.userId)
  const newRefreshToken = signRefreshToken(payload.userId, newRefresh.id)

  return { accessToken: newAccess, refreshToken: newRefreshToken }
}

export async function logout(refreshToken: string) {
  const payload = verifyRefreshToken(refreshToken)
  await refreshRepo.revoke(payload.jti)
}
