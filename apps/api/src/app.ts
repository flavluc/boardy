import * as Sentry from '@sentry/node'

import { env } from './config/env.js'

// Ensure to call this before requiring any other modules!
// @TODO: the docs says to put into instrument.mjs, check if the current approach work
if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: 'https://examplePublicKey@o0.ingest.sentry.io/0',
    // Adds request headers and IP for users, for more info visit:
    // https://docs.sentry.io/platforms/javascript/guides/node/configuration/options/#sendDefaultPii
    sendDefaultPii: true,
  })
}

import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'

import { errorHandler } from './middlewares/errorHandler.js'

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

// @TODO: attach routers here (next step)
// app.use("/auth", authRouter);
// app.use("/projects", projectRouter);
// ...

// Sentry error handler (must be before our own handler)
if (env.SENTRY_DSN) {
  Sentry.setupExpressErrorHandler(app)
}

// Always last
app.use(errorHandler)

export default app
