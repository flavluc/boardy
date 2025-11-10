import { AppDataSource } from '../../db/data-source.js'
import { User } from '../../db/index.js'

export const userRepo = AppDataSource.getRepository(User)

export async function findAll() {
  return userRepo.find()
}

export async function findById(id: string) {
  return userRepo.findOne({ where: { id } })
}

export async function create({ email }: { email: string }) {
  const user = userRepo.create({ email })
  return userRepo.save(user)
}

export async function update({ id, email }: { id: string; email: string }) {
  const user = await findById(id)
  if (!user) return null

  user.email = email
  return userRepo.save(user)
}

export async function remove(id: string) {
  const user = await findById(id)
  if (!user) return false

  await userRepo.remove(user)
  return true
}
