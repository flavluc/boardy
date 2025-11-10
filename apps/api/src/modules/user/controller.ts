import { UserItem, UserList } from '@boardy/shared'
import type { Request, Response } from 'express'

import { created, noContent, ok } from '../../utils/http'
import * as service from './service.js'

export async function list(_req: Request, res: Response) {
  const users = await service.list()
  ok(res, UserList.parse({ data: users }))
}

export async function get(req: Request, res: Response) {
  const user = await service.get(req.params.id)
  ok(res, UserItem.parse({ data: user }))
}

export async function create(req: Request, res: Response) {
  const user = await service.create(req.body)
  created(res, UserItem.parse({ data: user }))
}

export async function update(req: Request, res: Response) {
  const user = await service.update(req.params.id, req.body)
  ok(res, UserItem.parse({ data: user }))
}

export async function remove(req: Request, res: Response) {
  await service.remove(req.params.id)
  noContent(res)
}

// @TODO: test database errors like duplicated email, wrong FK, etc
