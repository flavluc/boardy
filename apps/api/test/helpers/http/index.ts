import request from 'supertest'
import { expect } from 'vitest'

export function getCookie(res: request.Response) {
  const cookie = res.headers['set-cookie']?.[0]
  expect(cookie, 'Expected Set-Cookie header').toBeDefined()
  return cookie
}
