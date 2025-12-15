import { z } from 'zod'

import {
  Email,
  Id,
  ISODate,
  ItemResponse,
  ListResponse,
  PageQuery,
  Password,
  UserName,
} from './primitives.js'

export const UserDTO = z.object({
  id: Id,
  email: Email,
  name: UserName,
  password: Password,
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type UserDTO = z.infer<typeof UserDTO>

export const UpdateUser = z.object({ email: Email })

export const UserListQuery = PageQuery

export const UserItem = ItemResponse(UserDTO.omit({ password: true }))
export const UserList = ListResponse(UserDTO.omit({ password: true }))
