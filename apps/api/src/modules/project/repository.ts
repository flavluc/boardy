import { AppDataSource } from '../../database/data-source'
import { Project } from '../../database/index'

export const projectRepo = AppDataSource.getRepository(Project)

export async function findAll() {
  return projectRepo.find({ relations: ['owner'] })
}

export async function findById(id: string) {
  return projectRepo.findOne({ where: { id }, relations: ['owner'] })
}

export async function create({ title, ownerId }: { title: string; ownerId: string }) {
  const project = projectRepo.create({ title, owner: { id: ownerId } })
  return projectRepo.save(project)
}

export async function update({ id, title }: { id: string; title: string }) {
  const project = await findById(id)
  if (!project) return null

  project.title = title
  return projectRepo.save(project)
}

export async function remove(id: string) {
  const project = await findById(id)
  if (!project) return false

  await projectRepo.remove(project)
  return true
}
