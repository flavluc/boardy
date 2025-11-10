import { z } from 'zod'

import { Id, ISODate, ItemResponse, ListResponse, PageQuery } from '../primitives.js'

export const UserDTO = z.object({
  id: Id,
  email: z.email(),
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type UserDTO = z.infer<typeof UserDTO>

export const CreateUser = z.object({ email: z.email() })
export const UpdateUser = z.object({ email: z.email() })

export const UserListQuery = PageQuery

export const UserItem = ItemResponse(UserDTO)
export const UserList = ListResponse(UserDTO)
