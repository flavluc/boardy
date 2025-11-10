import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Errors } from '../../src/errors'
import { makeProject, uuid } from '../helpers/factories'

vi.mock('../../src/modules/project/repository', () => ({
  findAll: vi.fn(),
  findById: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
}))

import * as repo from '../../src/modules/project/repository'
import * as service from '../../src/modules/project/service'

const mockedRepo = vi.mocked(repo)

describe('Project Service', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('list returns DTO', async () => {
    const project = makeProject({ title: 'Test' })
    mockedRepo.findAll.mockResolvedValue([project])

    const result = await service.list()

    expect(mockedRepo.findAll).toHaveBeenCalledTimes(1)
    expect(result).toHaveLength(1)
    expect(result[0]).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })
  })

  it('get() returns DTO when found', async () => {
    const project = makeProject({ title: 'Test' })
    mockedRepo.findById.mockResolvedValue(project)

    const result = await service.get(project.id)

    expect(result).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })
  })

  it('get() throws NotFound when missing', async () => {
    mockedRepo.findById.mockResolvedValue(null)
    const id = uuid()
    await expect(service.get(id)).rejects.toEqual(Errors.NotFound(id))
  })

  it('create() validates input and returns DTO', async () => {
    const project = makeProject({ title: 'Test' })
    mockedRepo.create.mockResolvedValue(project)
    const args = { title: 'Test', ownerId: project.owner.id }

    const result = await service.create(args)

    expect(result).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })
  })

  it('update() returns updated DTO', async () => {
    const project = makeProject({ title: 'Test' })
    mockedRepo.update.mockResolvedValue(project)

    const result = await service.update(project.id, { title: 'Test' })

    expect(result).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
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
