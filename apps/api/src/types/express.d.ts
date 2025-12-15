import 'express'

import { Id } from '@repo/schemas'

declare module 'express-serve-static-core' {
  interface Request {
    userId: Id
  }
}
