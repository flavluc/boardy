import { NextFunction, Request, Response } from 'express'

import { Id } from '@repo/schemas'
import { Errors } from '../utils/errors'
import { verifyAccessToken } from '../utils/jwt'

export function authGuard(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization
  if (!header) throw Errors.Auth.MissingToken()

  const token = header.replace('Bearer ', '')
  try {
    const payload = verifyAccessToken(token)
    req.userId = Id.parse(payload.userId)
    return next()
  } catch {
    throw Errors.Auth.TokenExpired()
  }
}
