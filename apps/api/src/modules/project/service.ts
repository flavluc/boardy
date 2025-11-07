import { CreateProject, Id, ISODate, ProjectDTO, UpdateProject } from '@boardy/shared'

import { Project } from '../../db/index.js'
import { Errors } from '../../errors.js'
import * as repo from './repository.js'

export function toProjectDTO(project: Project): ProjectDTO {
  return {
    id: Id.parse(project.id),
    title: project.title,
    ownerId: Id.parse(project.owner),
    createdAt: ISODate.parse(project.createdAt.toISOString()),
    updatedAt: ISODate.parse(project.updatedAt.toISOString()),
  }
}

export async function list() {
  const projects = await repo.findAll()
  return projects.map(toProjectDTO)
}

export async function get(id: unknown) {
  const projectId = Id.parse(id)
  const project = await repo.findById(projectId)
  if (!project) throw Errors.NotFound(projectId)
  return toProjectDTO(project)
}

export async function create(data: unknown) {
  const { title, ownerId } = CreateProject.parse(data)
  const project = await repo.create({ title, ownerId })
  return toProjectDTO(project)
}

export async function update(id: unknown, data: unknown) {
  const projectId = Id.parse(id)
  const { title } = UpdateProject.parse(data)
  const project = await repo.update({ id: projectId, title })
  if (!project) throw Errors.NotFound(projectId)

  return toProjectDTO(project)
}

export async function remove(id: unknown) {
  const projectId = Id.parse(id)
  const ok = await repo.remove(projectId)
  if (!ok) throw Errors.NotFound(projectId)
}
