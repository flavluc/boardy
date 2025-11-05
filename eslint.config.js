import js from '@eslint/js'
import prettierPlugin from 'eslint-plugin-prettier'
import simpleImportSort from 'eslint-plugin-simple-import-sort'
import unusedImports from 'eslint-plugin-unused-imports'
import tseslint from 'typescript-eslint'

export default [
  // Shared base config
  js.configs.recommended,
  ...tseslint.configs.recommended,

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
    plugins: {
      react: (await import('eslint-plugin-react')).default,
      'react-hooks': (await import('eslint-plugin-react-hooks')).default,
      a11y: (await import('eslint-plugin-jsx-a11y')).default,
    },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/react-in-jsx-scope': 'off', // Next.js doesn't require it
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
    },
  },

  // Shared packages
  {
    files: ['packages/shared/**/*.{ts,js}', 'packages/shared/**/*.mts'],
    // no special rules needed; inherits shared config
  },
]
