import { z } from 'zod'

import { Id, ISODate, ItemResponse, ListResponse, PageQuery } from '../primitives.js'

// ---- Entities (DTOs the API returns) ----
export const ProjectDTO = z.object({
  id: Id,
  name: z.string().min(1).max(120),
  ownerId: Id,
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type ProjectDTO = z.infer<typeof ProjectDTO>

export const ColumnDTO = z.object({
  id: Id,
  projectId: Id,
  title: z.string().min(1).max(120),
  position: z.number().int(), // numeric gaps (1000, 2000, ...)
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type ColumnDTO = z.infer<typeof ColumnDTO>

export const TaskDTO = z.object({
  id: Id,
  projectId: Id,
  columnId: Id,
  title: z.string().min(1).max(160),
  description: z.string().max(4000).nullable(),
  position: z.number().int(),
  assigneeId: Id.nullable(),
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type TaskDTO = z.infer<typeof TaskDTO>

export const ProjectMemberDTO = z.object({
  userId: Id,
  projectId: Id,
  role: z.enum(['owner', 'member']), // future RBAC-friendly
})
export type ProjectMemberDTO = z.infer<typeof ProjectMemberDTO>

// ---- Create/Update payloads ----
export const CreateProject = z.object({ name: z.string().min(1).max(120) })
export const UpdateProject = z.object({ name: z.string().min(1).max(120) })

export const CreateColumn = z
  .object({
    projectId: Id,
    title: z.string().min(1).max(120),
    // optional insertion hints for server-side positioning:
    beforeId: Id.optional(),
    afterId: Id.optional(),
  })
  .refine((o) => !(o.beforeId && o.afterId), {
    message: 'Provide either beforeId or afterId, not both',
    path: ['beforeId'],
  })

export const UpdateColumn = z.object({
  title: z.string().min(1).max(120),
})

export const CreateTask = z
  .object({
    projectId: Id,
    columnId: Id,
    title: z.string().min(1).max(160),
    description: z.string().max(4000).optional(),
    assigneeId: Id.optional(),
    beforeId: Id.optional(),
    afterId: Id.optional(),
  })
  .refine((o) => !(o.beforeId && o.afterId), {
    message: 'Provide either beforeId or afterId, not both',
    path: ['beforeId'],
  })

export const UpdateTask = z.object({
  title: z.string().min(1).max(160).optional(),
  description: z.string().max(4000).nullable().optional(),
  assigneeId: Id.nullable().optional(),
})

// ---- Reorder payload (Strategy A: server calculates gaps) ----
export const ReorderTask = z.object({
  taskId: Id,
  targetColumnId: Id,
  beforeTaskId: Id.optional(), // if absent, move to end
})

// ---- Query DTOs ----
export const ProjectListQuery = PageQuery
export const ColumnListQuery = PageQuery
export const TaskListQuery = PageQuery.extend({
  columnId: Id.optional(), // filter tasks within a column
})

// ---- Responses (reusable shapes) ----
export const ProjectItem = ItemResponse(ProjectDTO)
export const ProjectList = ListResponse(ProjectDTO)

export const ColumnItem = ItemResponse(ColumnDTO)
export const ColumnList = ListResponse(ColumnDTO)

export const TaskItem = ItemResponse(TaskDTO)
export const TaskList = ListResponse(TaskDTO)
