import jwt from 'jsonwebtoken'

import { env } from '../config/env.js'

export function signAccessToken(userId: string) {
  return jwt.sign({ userId }, env.JWT_ACCESS_SECRET, { expiresIn: '15m' })
}

export function signRefreshToken(userId: string, jti: string) {
  return jwt.sign({ userId, jti }, env.JWT_REFRESH_SECRET, { expiresIn: '7d' })
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; jti: string }
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string }
}
