import js from '@eslint/js'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTypescript from 'eslint-config-next/typescript'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  // Shared base config
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // Apply Next.js config properly under /apps/web
  ...nextVitals.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx,js,jsx}', 'apps/web/**/*.mts'],
  })),

  ...nextTypescript.map((config) => ({
    ...config,
    files: ['apps/web/**/*.{ts,tsx,js,jsx}', 'apps/web/**/*.mts'],
  })),

  {
    plugins: {
      prettier: prettierPlugin,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },

    rules: {
      // Prettier formatting
      'prettier/prettier': 'error',

      // Remove unused imports automatically
      'unused-imports/no-unused-imports': 'error',

      // Sort imports
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },

    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },

  // --- Overrides per package ---

  // Backend (Node)
  {
    files: ['apps/api/**/*.{ts,js}', 'apps/api/**/*.mts'],
    languageOptions: {
      globals: {
        console: true,
        process: true,
        module: true,
        require: true,
      },
    },
  },

  // Frontend (Next.js)
  {
    files: ['apps/web/**/*.{ts,tsx,js,jsx}', 'apps/web/**/*.mts'],

    languageOptions: {
      parser: tseslint.parser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },

    plugins: {
      react: (await import('eslint-plugin-react')).default,
      'react-hooks': (await import('eslint-plugin-react-hooks')).default,
      a11y: (await import('eslint-plugin-jsx-a11y')).default,
    },

    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off',
    },
  },

  // Shared packages
  {
    files: ['packages/shared/**/*.{ts,js}', 'packages/shared/**/*.mts'],
    // no special rules needed; inherits shared config
  },
]
