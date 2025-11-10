import { dirname } from 'node:path'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { DataSource } from 'typeorm'

import { env, isTest } from '../config/env.ts'
import { Column as BoardColumn, Project, ProjectMember, Task, User } from './index.ts'

const __dirname = dirname(fileURLToPath(import.meta.url))

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: env.DATABASE_URL,
  ssl: isTest ? false : { rejectUnauthorized: false },
  synchronize: false,
  logging: false,
  entities: [BoardColumn, Project, ProjectMember, Task, User],
  migrations: [path.join(__dirname, '../db/migrations/*.{ts,js}')],
})
