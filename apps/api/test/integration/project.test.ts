import request from 'supertest'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import app from '../../src/app'
import { AppDataSource } from '../../src/db/data-source'
import { Project, User } from '../../src/db/index.js'
import { cleanDatabase, createUser } from '../helpers/db'

let authToken: string, user: User

describe('Project Integration', () => {
  const dataSource = AppDataSource
  const userRepo = AppDataSource.getRepository(User)
  const projectRepo = AppDataSource.getRepository(Project)

  beforeEach(async () => {
    user = await createUser(userRepo)

    const res = await request(app)
      .post('/auth/login')
      .send({ email: user.email, password: user.password })

    console.log({ res: res })

    authToken = res.body.data.access
  })

  afterEach(async () => {
    await cleanDatabase(dataSource)
  })

  it('POST /projects creates a project', async () => {
    const res = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${authToken}`)
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
    const project = await projectRepo.save({
      title: 'Test',
      owner: user,
    })

    const res = await request(app)
      .get(`/projects/${project.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)

    expect(res.body.data).toMatchObject({
      id: project.id,
      title: 'Test',
      ownerId: project.owner.id,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    })
  })

  it('GET /projects returns a list of projects', async () => {
    await projectRepo.save({ title: 'Project One', owner: user })
    await projectRepo.save({ title: 'Project Two', owner: user })

    const res = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)

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
    const project = await projectRepo.save({ title: 'Old Title', owner: user })
    const newTitle = 'Updated Title'

    const res = await request(app)
      .patch(`/projects/${project.id}`)
      .set('Authorization', `Bearer ${authToken}`)
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
    const project = await projectRepo.save({ title: 'Project to Delete', owner: user })

    await request(app)
      .delete(`/projects/${project.id}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(204)

    const deletedProjectInDB = await projectRepo.findOneBy({ id: project.id })
    expect(deletedProjectInDB).toBeNull()
  })
})
