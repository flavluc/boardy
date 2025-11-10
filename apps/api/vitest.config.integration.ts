import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'api-integration',
    environment: 'node',
    setupFiles: ['test/setup.integration.ts'],
    include: ['test/integration/*.test.ts'],
    pool: 'forks', // run each test file in its own Node process @TODO: if slow, then change to threads
    hookTimeout: 60_000,
    testTimeout: 60_000,
  },
})
