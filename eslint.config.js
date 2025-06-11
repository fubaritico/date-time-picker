import eslint from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import importPlugin from 'eslint-plugin-import'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'

export default tseslint.config(
  // Plugins first
  {
    plugins: {
      ['@typescript-eslint']: tseslint.plugin,
      ['react']: react,
      ['react-hooks']: reactHooks,
      ['react-refresh']: reactRefresh,
      ['jsxA11y']: jsxA11y,
      ['import']: importPlugin,
    },
  },

  // Files to be ignored
  {
    ignores: [
      'dist',
      'dev',
      'coverage',
      'node_modules',
      'rollup.config.js',
      'jest.config.ts',
      'jest.setup.ts',
      'jest.setup.afterEnv.ts',
      'postcss.config.js',
      'tailwind.config.js',
      'vite.config.ts',
      'vite.storybook.config.ts',
      '__mocks__',
      '.storybook',
      'storybook-static',
      'eslint.config.js',
      'commitlint.config.js',
      'add-tailwind-prefix.ts',
    ],
  },

  // extends
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  eslintPluginPrettierRecommended,

  // base/common config
  {
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      '@typescript-eslint/no-empty-function': [
        'error',
        { allow: ['functions', 'arrowFunctions'] },
      ],
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unused-vars': 'error',
      '@typescript-eslint/no-explicit-any': 'error',
      'no-console': [
        'error',
        {
          allow: ['error', 'warn'],
        },
      ],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/require-default-props': 'off',
      'react/function-component-definition': [
        0,
        {
          namedComponents: 'arrow-function',
        },
      ],
      'react/react-in-jsx-scope': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/jsx-no-useless-fragment': [
        0,
        {
          allowExpressions: true,
        },
      ],
      'react/jsx-filename-extension': ['off'],
      'import/prefer-default-export': ['off'],
      'import/no-extraneous-dependencies': ['off'],
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
            'type',
          ],
          'newlines-between': 'always',
          pathGroups: [
            {
              pattern: '@components',
              group: 'internal',
              position: 'after',
            },
            {
              pattern: '@constants',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@enums',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '@utils',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['type'],
          distinctGroup: false,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreDeclarationSort: true,
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
        },
      ],
    },
  }
)
