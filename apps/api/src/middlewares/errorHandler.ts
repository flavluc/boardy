import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

import { ApiError } from '../utils/errors'
import { apiError, badRequest, internalError } from '../utils/http'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  console.log({ err })
  if (err instanceof ZodError) return badRequest(res, z.treeifyError(err))

  if (err instanceof ApiError) return apiError(res, err)

  // @TODO: add proper logging
  console.error(err)
  return internalError(res)
}
