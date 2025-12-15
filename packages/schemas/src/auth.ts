import { z } from 'zod'

import { Email, Password, UserName } from './primitives'
import { UserDTO } from './user'

export const RegisterRequest = z.object({
  email: Email,
  name: UserName,
  password: Password,
})
export type RegisterRequest = z.infer<typeof RegisterRequest>

export const LoginRequest = RegisterRequest.pick({
  email: true,
  password: true,
})
export type LoginRequest = z.infer<typeof LoginRequest>

export const LoginResponse = z.object({
  data: z.object({
    user: UserDTO,
    access: z.string(), // JWT
  }),
})
export type LoginResponse = z.infer<typeof LoginResponse>

export const RegisterResponse = z.object({
  data: z.object({
    user: UserDTO,
    access: z.string(), // JWT
  }),
})
export type RegisterResponse = z.infer<typeof RegisterResponse>

export const RefreshResponse = z.object({
  data: z.object({
    access: z.string(),
  }),
})
export type RefreshResponse = z.infer<typeof RefreshResponse>

export const MeResponse = z.object({
  data: z.object({
    user: UserDTO,
  }),
})
export type MeResponse = z.infer<typeof MeResponse>
