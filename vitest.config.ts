import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      './packages/*',
      './apps/api/vitest.config.unit.ts',
      './apps/api/vitest.config.integration.ts',
    ],
    coverage: {
      provider: 'istanbul',
      include: ['packages/shared/src/**', 'apps/api/src/**'],
      exclude: ['node_modules/**'],
    },
  },
})
