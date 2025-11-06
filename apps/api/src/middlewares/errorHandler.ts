// apps/api/src/middlewares/errorHandler.ts
import { ErrorCode, ErrorEnvelope } from '@boardy/shared'
import type { NextFunction, Request, Response } from 'express'
import { z, ZodError } from 'zod'

export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  // Known validation
  if (err instanceof ZodError) {
    return res.status(400).json({
      error: {
        code: ErrorCode.enum.VALIDATION_ERROR,
        message: 'Invalid request',
        details: z.treeifyError(err),
      },
    } satisfies ErrorEnvelope)
  }

  // Known app errors (we'll formalize these later)
  //   if (err?.code && typeof err.code === 'string' && err.httpStatus) {
  //     return res.status(err.httpStatus).json({
  //       error: {
  //         code: err.code,
  //         message: err.message,
  //         details: err.details,
  //       },
  //     } satisfies ErrorEnvelope)
  //   }

  // Unknown = 500, but never leak details
  console.error(err)
  return res.status(500).json({
    error: {
      code: ErrorCode.enum.INTERNAL,
      message: 'Internal server error',
    },
  } satisfies ErrorEnvelope)
}
