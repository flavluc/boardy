import type { User } from '../../../src/db/entities/User'
import { mockEntity, now, uuid } from './index'

export function makeUser(overrides: Partial<User> = {}): User {
  return mockEntity<User>({
    id: uuid(),
    email: 'test@example.com',
    createdAt: now(),
    updatedAt: now(),
    ...overrides,
  })
}
