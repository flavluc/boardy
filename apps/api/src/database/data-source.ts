import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { DataSource } from 'typeorm'

import { env } from '../config/env.ts'
import { Project, RefreshToken, User } from './index.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  ssl: false, //@TODO: fix for production
  synchronize: false,
  logging: false,
  entities: [Project, RefreshToken, User],
  migrations: [path.join(__dirname, '../database/migrations/*.{ts,js}')],
})
