import 'reflect-metadata'

import app from './app.js'
import { env } from './config/env.js'
import { initDB } from './db/index.js'

async function main() {
  await initDB()

  app.listen(env.PORT, () => {
    console.log(`API running on http://localhost:${env.PORT}`)
  })
}

if (process.env.NODE_ENV !== 'test') {
  main().catch((err) => {
    console.error('Startup error:', err)
    process.exit(1)
  })
}
