import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql'
import { afterAll, beforeAll } from 'vitest'

import { AppDataSource } from '../src/database/data-source'

let container: StartedPostgreSqlContainer

beforeAll(async () => {
  container = await new PostgreSqlContainer('postgres:17').start()
  AppDataSource.setOptions({ url: container.getConnectionUri() })
  await AppDataSource.initialize()
  await AppDataSource.runMigrations()
})

afterAll(async () => {
  await AppDataSource.destroy()
  await container.stop()
})
