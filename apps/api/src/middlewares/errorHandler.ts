import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

import { Errors } from '../utils/errors'
import { badRequest, internalError } from '../utils/http'

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return badRequest(res, Errors.Validation(z.treeifyError(err)))
  }

  // @TODO: add proper logging
  console.error(err)
  return internalError(res, Errors.Internal())
}
