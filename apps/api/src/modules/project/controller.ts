import { ProjectItem, ProjectList } from '@repo/schemas'
import type { Request, Response } from 'express'

import { created, noContent, ok } from '../../utils/http'
import * as service from './service.js'

export async function list(_req: Request, res: Response) {
  const projects = await service.list()
  ok(res, ProjectList.parse({ data: projects }))
}

export async function get(req: Request, res: Response) {
  const project = await service.get(req.params.id)
  ok(res, ProjectItem.parse({ data: project }))
}

export async function create(req: Request, res: Response) {
  const project = await service.create(req.body)
  created(res, ProjectItem.parse({ data: project }))
}

export async function update(req: Request, res: Response) {
  const project = await service.update(req.params.id, req.body)
  ok(res, ProjectItem.parse({ data: project }))
}

export async function remove(req: Request, res: Response) {
  await service.remove(req.params.id)
  noContent(res)
}
