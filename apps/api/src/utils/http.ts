import { ErrorCode, ErrorEnvelope, HttpStatus } from '@repo/schemas'
import { Response } from 'express'

import { ApiError, Errors } from '../utils/errors'

export const created = (res: Response, data: unknown) => {
  res.status(HttpStatus.CREATED).json(data)
}

export const ok = (res: Response, data: unknown) => {
  res.status(HttpStatus.OK).json(data)
}

export const noContent = (res: Response) => {
  res.status(HttpStatus.NO_CONTENT).send()
}

export const notFound = (res: Response) => {
  res.status(HttpStatus.NOT_FOUND).send()
}

export const badRequest = (res: Response, error: unknown) => {
  res.status(HttpStatus.BAD_REQUEST).json(ErrorEnvelope.parse({ error: Errors.Validation(error) }))
}

export const internalError = (res: Response) => {
  res
    .status(HttpStatus.INTERNAL_SERVER_ERROR)
    .json(ErrorEnvelope.parse({ error: Errors.Internal() }))
}

const errorToStatusCode: Record<ErrorCode, HttpStatus> = {
  [ErrorCode.enum.VALIDATION_ERROR]: HttpStatus.BAD_REQUEST,
  [ErrorCode.enum.AUTH_INVALID_CREDENTIALS]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_MISSING_TOKEN]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_TOKEN_EXPIRED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_TOKEN_REUSED]: HttpStatus.UNAUTHORIZED,
  [ErrorCode.enum.AUTH_FORBIDDEN]: HttpStatus.FORBIDDEN,
  [ErrorCode.enum.NOT_FOUND]: HttpStatus.NOT_FOUND,
  [ErrorCode.enum.CONFLICT]: HttpStatus.CONFLICT,
  [ErrorCode.enum.RATE_LIMITED]: HttpStatus.TOO_MANY_REQUESTS,
  [ErrorCode.enum.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
}

export const apiError = (res: Response, error: ApiError) => {
  res.status(errorToStatusCode[error.code]).json(ErrorEnvelope.parse({ error }))
}
