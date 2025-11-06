import { z } from 'zod'

import { Id, ISODate } from '../primitives.js'

export const Email = z.email()
export const Password = z.string().min(6).max(128)

export const RegisterRequest = z.object({
  email: Email,
  password: Password,
})
export type RegisterRequest = z.infer<typeof RegisterRequest>

export const LoginRequest = RegisterRequest
export type LoginRequest = z.infer<typeof LoginRequest>

export const PublicUser = z.object({
  id: Id,
  email: Email,
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type PublicUser = z.infer<typeof PublicUser>

export const LoginResponse = z.object({
  data: z.object({
    user: PublicUser,
    access: z.string(), // JWT
  }),
})
// refresh token is httpOnly cookie; no body content

export const RegisterResponse = z.object({
  data: z.object({
    user: PublicUser,
  }),
})

export const RefreshResponse = z.object({
  data: z.object({
    access: z.string(),
  }),
})
