import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Errors } from '../../src/utils/errors'
import { makeUser, uuid } from '../helpers/factories'

vi.mock('../../src/modules/user/repository', () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

import * as repo from '../../src/modules/user/repository'
import * as service from '../../src/modules/user/service'

const mockedRepo = vi.mocked(repo)

describe('User Service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('list returns DTO', async () => {
    const user = makeUser()
    mockedRepo.findAll.mockResolvedValue([user])

    const result = await service.list()

    expect(mockedRepo.findAll).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  })

  it('get() returns DTO when found', async () => {
    const user = makeUser()
    mockedRepo.findById.mockResolvedValue(user)

    const result = await service.get(user.id)

    expect(result).toMatchObject({
      id: user.id,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  })

  it('get() throws NotFound when missing', async () => {
    mockedRepo.findById.mockResolvedValue(null)
    const id = uuid()
    await expect(service.get(id)).rejects.toEqual(Errors.NotFound(id))
  })

  it('update() returns updated DTO', async () => {
    const user = makeUser()
    const args = { email: 'updated@test.com' }

    mockedRepo.update.mockResolvedValue({ ...user, email: args.email })
    const result = await service.update(user.id, args)

    expect(result).toMatchObject({
      id: user.id,
      email: args.email,
      createdAt: user.createdAt.toISOString(),
      updatedAt: user.updatedAt.toISOString(),
    })
  })

  it('update() throws NotFound if repo returns null', async () => {
    mockedRepo.update.mockResolvedValue(null)

    const id = uuid()
    await expect(service.get(id)).rejects.toEqual(Errors.NotFound(id))
  })

  it('remove() succeeds when repo returns true', async () => {
    mockedRepo.remove.mockResolvedValue(true)

    await expect(service.remove(uuid())).resolves.toBeUndefined()
  })

  it('remove() throws NotFound if deletion fails', async () => {
    mockedRepo.remove.mockResolvedValue(false)

    const id = uuid()
    await expect(service.get(id)).rejects.toEqual(Errors.NotFound(id))
  })
})
