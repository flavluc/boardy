import { z } from 'zod'

import { Id, ISODate, ItemResponse, ListResponse, PageQuery } from '../primitives.js'

export const ProjectDTO = z.object({
  id: Id,
  title: z.string().min(1).max(120),
  ownerId: Id,
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type ProjectDTO = z.infer<typeof ProjectDTO>

export const CreateProject = z.object({ title: z.string().min(1).max(120), ownerId: Id })
export const UpdateProject = z.object({ title: z.string().min(1).max(120) })

export const ProjectListQuery = PageQuery

export const ProjectItem = ItemResponse(ProjectDTO)
export const ProjectList = ListResponse(ProjectDTO)
