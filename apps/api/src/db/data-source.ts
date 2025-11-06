import 'reflect-metadata'

import { Column as BoardColumn, Project, ProjectMember, Task, User } from '@boardy/shared'
import * as dotenv from 'dotenv'
import { DataSource, type DataSourceOptions } from 'typeorm'
import { z } from 'zod'

dotenv.config()

const env = z
  .object({
    DATABASE_URL: z.url(),
  })
  .parse(process.env)

const databaseUrl = env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is missing')
}

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: false,
  entities: [User, Project, BoardColumn, Task, ProjectMember],
  migrations: ['src/db/migrations/*.{ts,js}'],
}

export const AppDataSource = new DataSource(dataSourceOptions)
