import * as Sentry from '@sentry/node'

import { env } from './config/env'
import authRouter from './modules/auth/router'
import projectRouter from './modules/project/router'
import userRouter from './modules/user/router'

// @TODO: the docs says to put into instrument.mjs, check if the current approach work
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
    sendDefaultPii: true,
  })
}

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'

import { errorHandler } from './middlewares/errorHandler'

const app: Express = express()

app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
  })
)

app.use(express.json())
app.use(cookieParser())

app.get('/healthz', (_req, res) => res.status(200).send('ok'))
app.get('/readyz', async (_req, res) => {
  // @TODO: check DB connectivity here
  res.status(200).send('ready')
})

app.use('/projects', projectRouter)
app.use('/users', userRouter)
app.use('/auth', authRouter)

if (env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app)
}

app.use(errorHandler)

export default app
