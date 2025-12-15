import { AppDataSource } from '../../database/data-source.js'
import { RefreshToken } from '../../database/entities/RefreshToken.js'

const repo = AppDataSource.getRepository(RefreshToken)

export async function createForUser(userId: string) {
  const token = repo.create({ user: { id: userId } })
  return repo.save(token)
}

export async function revoke(id: string) {
  await repo.update({ id }, { revoked: true })
}

export async function findById(id: string) {
  return repo.findOne({ where: { id }, relations: ['user'] })
}
