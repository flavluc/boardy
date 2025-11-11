import {
  LoginRequest,
  LoginResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
} from '@boardy/shared'
import { Request, Response } from 'express'

import { created, noContent, ok } from '../../utils/http'
import * as service from './service'

export async function register(req: Request, res: Response) {
  const { email, password } = RegisterRequest.parse(req.body)
  const user = await service.register(email, password)
  created(res, RegisterResponse.parse({ data: user }))
}

export async function login(req: Request, res: Response) {
  const { email, password } = LoginRequest.parse(req.body)
  const { user, accessToken, refreshToken } = await service.login(email, password)

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false, // @TODO: change to true in prod
    path: '/auth',
  })

  ok(res, LoginResponse.parse({ data: { user, access: accessToken } }))
}

export async function refresh(req: Request, res: Response) {
  const token = req.cookies.refresh_token
  const { accessToken, refreshToken } = await service.refresh(token)

  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    sameSite: 'strict',
    secure: false,
    path: '/auth',
  })

  ok(res, RefreshResponse.parse({ data: { access: accessToken } }))
}

export async function logout(req: Request, res: Response) {
  const token = req.cookies.refresh_token
  await service.logout(token)

  res.clearCookie('refresh_token', { path: '/auth' })
  noContent(res)
}
