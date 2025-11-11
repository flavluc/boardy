import { randomUUID } from 'crypto'

export function mockEntity<T>(data: Partial<T>): T {
  return data as T
}

export function uuid() {
  return randomUUID()
}

export function now() {
  return new Date()
}

export * from './project'
export * from './refreshToken'
export * from './user'
