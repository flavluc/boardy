import type { Project } from '../../../src/database/entities/Project'
import { mockEntity, now, uuid } from './index'
import { makeUser } from './user'

export function makeProject(overrides: Partial<Project> = {}): Project {
  const owner = overrides.owner ?? makeUser()

  return mockEntity<Project>({
    id: uuid(),
    title: 'Test Project',
    owner,
    createdAt: now(),
    updatedAt: now(),
    ...overrides,
  })
}
