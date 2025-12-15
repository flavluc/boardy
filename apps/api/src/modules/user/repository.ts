import { AppDataSource } from '../../database/data-source.js'
import { User } from '../../database/index.js'

export const userRepo = AppDataSource.getRepository(User)

export async function findAll() {
  return userRepo.find()
}

export async function findById(id: string) {
  return userRepo.findOne({ where: { id } })
}

export async function findByEmail(email: string) {
  return userRepo.findOne({ where: { email } })
}

export async function create({
  name,
  email,
  password,
}: {
  name: string
  email: string
  password: string
}) {
  const user = userRepo.create({ name, email, password })
  return userRepo.save(user)
}

export async function update(id: string, { email }: { email: string }) {
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
