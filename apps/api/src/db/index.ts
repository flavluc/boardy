import { AppDataSource } from './data-source.js'

export async function initDB() {
  if (AppDataSource.isInitialized) return

  try {
    await AppDataSource.initialize()
    console.log('[db] connected')
  } catch (err) {
    console.error('[db] connection error:', err)
    throw err
  }
}

export * from './entities/Column.js'
export * from './entities/Project.js'
export * from './entities/ProjectMember.js'
export * from './entities/Task.js'
export * from './entities/User.js'
