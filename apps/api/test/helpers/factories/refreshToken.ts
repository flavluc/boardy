import type { RefreshToken } from '../../../src/db/entities/RefreshToken'
import { mockEntity, now, uuid } from './index'
import { makeUser } from './user'

export function makeRefreshToken(overrides: Partial<RefreshToken> = {}): RefreshToken {
  const user = overrides.user ?? makeUser()

  return mockEntity<RefreshToken>({
    id: uuid(),
    user,
    revoked: false,
    createdAt: now(),
    ...overrides,
  })
}
