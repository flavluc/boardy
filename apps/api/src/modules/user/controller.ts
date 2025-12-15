import { UserItem } from '@repo/schemas'
import type { Request, Response } from 'express'

import { noContent, ok } from '../../utils/http'
import * as service from './service.js'

export async function get(req: Request, res: Response) {
  const user = await service.get(req.userId)

  ok(res, UserItem.parse({ data: user }))
}

export async function update(req: Request, res: Response) {
  const user = await service.update(req.userId, req.body)
  ok(res, UserItem.parse({ data: user }))
}

export async function remove(req: Request, res: Response) {
  await service.remove(req.params.id)
  noContent(res)
}
