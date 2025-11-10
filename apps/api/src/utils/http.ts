import { HttpStatus } from '@boardy/shared'
import { Response } from 'express'

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

export const badRequest = (res: Response, data: unknown) => {
  res.status(HttpStatus.BAD_REQUEST).json(data)
}

export const internalError = (res: Response, data: unknown) => {
  res.status(HttpStatus.INTERNAL_SERVER_ERROR).json(data)
}
