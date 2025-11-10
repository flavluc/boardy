import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    name: 'api-unit',
    environment: 'node',
    include: ['test/service/*.test.ts', 'test/unit/*.test.ts'],
  },
})
