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
