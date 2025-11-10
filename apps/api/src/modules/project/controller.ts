import { ProjectItem, ProjectList } from '@boardy/shared'
import type { Request, Response } from 'express'

import * as service from './service.js'

export async function list(_req: Request, res: Response) {
  const projects = await service.list()
  res.json(ProjectList.parse({ data: projects }))
}

export async function get(req: Request, res: Response) {
  const project = await service.get(req.params.id)
  res.json(ProjectItem.parse({ data: project }))
}

export async function create(req: Request, res: Response) {
  const project = await service.create(req.body)
  // @TODO: centralize these status code
  res.status(201).json(ProjectItem.parse({ data: project }))
}

export async function update(req: Request, res: Response) {
  const project = await service.update(req.params.id, req.body)
  res.json(ProjectItem.parse({ data: project }))
}

export async function remove(req: Request, res: Response) {
  await service.remove(req.params.id)
  res.status(204).send()
}
