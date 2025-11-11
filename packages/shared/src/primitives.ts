import { z } from 'zod'

export const Id = z.uuid().brand<'Id'>()
export type Id = z.infer<typeof Id>

export const Email = z.email()
export const Password = z.string().min(6).max(128)

export const ISODate = z.iso.datetime({ offset: true }).brand<'ISODate'>()
export type ISODate = z.infer<typeof ISODate>

// Pagination
export const Cursor = z.string().min(1)
export const PageQuery = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(20),
  cursor: Cursor.optional(),
})
export type PageQuery = z.infer<typeof PageQuery>

export const PageMeta = z.object({
  nextCursor: Cursor.nullable(),
})
export type PageMeta = z.infer<typeof PageMeta>

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  CONFLICT = 409,
  TOO_MANY_REQUESTS = 429,
  INTERNAL_SERVER_ERROR = 500,
}

export const ErrorCode = z.enum([
  'VALIDATION_ERROR',
  'AUTH_INVALID_CREDENTIALS',
  'AUTH_MISSING_TOKEN',
  'AUTH_TOKEN_EXPIRED',
  'AUTH_TOKEN_REUSED',
  'AUTH_FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'RATE_LIMITED',
  'INTERNAL',
])
export type ErrorCode = z.infer<typeof ErrorCode>

export const ErrorEnvelope = z.object({
  error: z.object({
    code: ErrorCode,
    message: z.string(),
    details: z.unknown().optional(),
  }),
})
export type ErrorEnvelope = z.infer<typeof ErrorEnvelope>

// Standard list response shape
export const ListResponse = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    meta: PageMeta.optional(),
  })

// Single item response
export const ItemResponse = <T extends z.ZodTypeAny>(item: T) => z.object({ data: item })
