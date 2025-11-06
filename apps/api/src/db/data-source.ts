import * as dotenv from 'dotenv'
dotenv.config()

import { DataSource, type DataSourceOptions } from 'typeorm'

import { Column as BoardColumn, Project, ProjectMember, Task, User } from '../entities/index.js'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL environment variable is missing')
}

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: databaseUrl,
  ssl: { rejectUnauthorized: false },
  synchronize: false,
  logging: false,
  entities: [BoardColumn, Project, ProjectMember, Task, User],
  migrations: ['src/db/migrations/*.{ts,js}'],
}

export const AppDataSource = new DataSource(dataSourceOptions)
