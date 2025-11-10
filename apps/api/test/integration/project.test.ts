import request from 'supertest'
import { afterEach, describe, expect, it } from 'vitest'

import app from '../../src/app'
import { AppDataSource } from '../../src/db/data-source'
import { Project, User } from '../../src/db/index.js'
import { cleanDatabase } from '../helpers/db'
import { makeUser } from '../helpers/factories'

describe('Project Integration', () => {
  const dataSource = AppDataSource
  const userRepo = AppDataSource.getRepository(User)
  const projectRepo = AppDataSource.getRepository(Project)

  afterEach(async () => {
    await cleanDatabase(dataSource)
  })

  it('POST /projects creates a project', async () => {
    const user = await userRepo.save(makeUser())

    const res = await request(app)
      .post('/projects')
      .send({ title: 'Test', ownerId: user.id })
      .expect(201)

    let project = await projectRepo.findOne({
      where: { id: res.body.data.id },
      relations: ['owner'],
    })
    expect(project).toBeDefined()
    project = project!

    expect(res.body.data).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })
  })

  it('GET /projects/:id returns a specific project', async () => {
    const user = await userRepo.save(makeUser())

    const project = await projectRepo.save({
      title: 'Test',
      owner: user,
    })

    const res = await request(app).get(`/projects/${project.id}`).expect(200)

    expect(res.body.data).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })
  })

  it('GET /projects returns a list of projects', async () => {
    const user = await userRepo.save(makeUser())
    await projectRepo.save({ title: 'Project One', owner: user })
    await projectRepo.save({ title: 'Project Two', owner: user })

    const res = await request(app).get('/projects').expect(200)

    expect(res.body.data).toBeInstanceOf(Array)
    expect(res.body.data.length).toBe(2)

    expect(res.body.data[0]).toMatchObject({
      title: 'Project One',
      ownerId: user.id,
    })
    expect(res.body.data[1]).toMatchObject({
      title: 'Project Two',
      ownerId: user.id,
    })
  })

  it('PATCH /projects/:id updates a project', async () => {
    const user = await userRepo.save(makeUser())
    const project = await projectRepo.save({ title: 'Old Title', owner: user })
    const newTitle = 'Updated Title'

    const res = await request(app)
      .patch(`/projects/${project.id}`)
      .send({ title: newTitle })
      .expect(200)

    expect(res.body.data).toMatchObject({
      id: project.id,
      title: newTitle,
      ownerId: user.id,
    })

    const updatedProjectInDB = await projectRepo.findOneBy({ id: project.id })
    expect(updatedProjectInDB).not.toBeNull()
    expect(updatedProjectInDB!.title).toBe(newTitle)
    expect(updatedProjectInDB!.updatedAt.getTime()).toBeGreaterThan(
      updatedProjectInDB!.createdAt.getTime()
    )
  })

  it('DELETE /projects/:id deletes a project', async () => {
    const user = await userRepo.save(makeUser())
    const project = await projectRepo.save({ title: 'Project to Delete', owner: user })

    await request(app).delete(`/projects/${project.id}`).expect(204)

    const deletedProjectInDB = await projectRepo.findOneBy({ id: project.id })
    expect(deletedProjectInDB).toBeNull()
  })
})
