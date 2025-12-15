import type { User } from '../../../src/database/entities/User'
import { hashPassword } from '../../../src/utils/password'
import { makeUser } from '../factories'

export async function cleanDatabase(dataSource) {
  const entities = dataSource.entityMetadatas
  const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ')

  await dataSource.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`)
}

export async function createUser(userRepo, overrides: Partial<User> = {}): Promise<User> {
  const user = makeUser(overrides)
  await userRepo.save({ ...user, password: await hashPassword(user.password) })
  return user
}
