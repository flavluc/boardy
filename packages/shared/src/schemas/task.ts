import { z } from 'zod'

import { Id, ISODate, ItemResponse, ListResponse, PageQuery } from '../primitives.js'

// ---- Entities (DTOs the API returns) ----

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

export const ReorderTask = z.object({
  taskId: Id,
  targetColumnId: Id,
  beforeTaskId: Id.optional(), // if absent, move to end
})

export const TaskListQuery = PageQuery.extend({
  columnId: Id.optional(), // filter tasks within a column
})

export const TaskItem = ItemResponse(TaskDTO)
export const TaskList = ListResponse(TaskDTO)
