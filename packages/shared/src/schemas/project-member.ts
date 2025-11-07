import { z } from 'zod'

import { Id } from '../primitives.js'

// ---- Entities (DTOs the API returns) ----

export const ProjectMemberDTO = z.object({
  userId: Id,
  projectId: Id,
  role: z.enum(['owner', 'member']), // future RBAC-friendly
})
export type ProjectMemberDTO = z.infer<typeof ProjectMemberDTO>
