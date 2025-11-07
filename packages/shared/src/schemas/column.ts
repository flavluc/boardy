import { z } from 'zod'

import { Id, ISODate, ItemResponse, ListResponse, PageQuery } from '../primitives.js'

// ---- Entities (DTOs the API returns) ----

export const ColumnDTO = z.object({
  id: Id,
  projectId: Id,
  title: z.string().min(1).max(120),
  position: z.number().int(), // numeric gaps (1000, 2000, ...)
  createdAt: ISODate,
  updatedAt: ISODate,
})
export type ColumnDTO = z.infer<typeof ColumnDTO>

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

export const ColumnListQuery = PageQuery

export const ColumnItem = ItemResponse(ColumnDTO)
export const ColumnList = ListResponse(ColumnDTO)
