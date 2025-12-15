import cookieParser from 'cookie-parser'
import cors from 'cors'
import express, { type Express } from 'express'

import { env } from './config/env'
import { AppDataSource } from './database/data-source.js'
import { errorHandler } from './middlewares/errorHandler'
import authRouter from './modules/auth/router'
import projectRouter from './modules/project/router'
import userRouter from './modules/user/router'

const app: Express = express()

app.use(
  cors({
    origin: env.WEB_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
)

app.use(express.json())
app.use(cookieParser())

app.get('/healthz', (_req, res) => res.status(200).send('ok'))
app.get('/readyz', async (_req, res) => {
  try {
    await AppDataSource.query('SELECT 1')
    res.status(200).send('ready')
  } catch {
    res.status(503).send('not ready')
  }
})

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/projects', projectRouter)

app.use(errorHandler)

export default app
