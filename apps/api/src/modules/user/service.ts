import { Id, ISODate, UpdateUser, UserDTO } from '@boardy/shared'

import { User } from '../../db/index.js'
import { Errors } from '../../utils/errors.js'
import * as repo from './repository.js'

export function toUserDTO(user: User): UserDTO {
  return {
    id: Id.parse(user.id),
    email: user.email,
    password: user.password,
    createdAt: ISODate.parse(user.createdAt.toISOString()),
    updatedAt: ISODate.parse(user.updatedAt.toISOString()),
  }
}

export async function list() {
  const users = await repo.findAll()
  return users.map(toUserDTO)
}

export async function get(id: unknown) {
  const userId = Id.parse(id)
  const user = await repo.findById(userId)
  if (!user) throw Errors.NotFound(userId)
  return toUserDTO(user)
}

export async function update(id: unknown, data: unknown) {
  const userId = Id.parse(id)
  const { email } = UpdateUser.parse(data)
  const user = await repo.update({ id: userId, email })
  if (!user) throw Errors.NotFound(userId)

  return toUserDTO(user)
}

export async function remove(id: unknown) {
  const userId = Id.parse(id)
  const ok = await repo.remove(userId)
  if (!ok) throw Errors.NotFound(userId)
}
