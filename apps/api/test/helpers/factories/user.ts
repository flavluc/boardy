import type { User } from '../../../src/database/entities/User'
import { mockEntity, now, uuid } from './index'

export function makeUser(overrides: Partial<User> = {}): User {
  return mockEntity<User>({
    id: uuid(),
    email: 'test@example.com',
    password: 'password',
    createdAt: now(),
    updatedAt: now(),
    ...overrides,
  })
}
