import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import reactPlugin from 'eslint-plugin-react'
import reactHooksPlugin from 'eslint-plugin-react-hooks'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
import pluginQuery from '@tanstack/eslint-plugin-query'

export default tseslint.config(
  {
    ignores: [
      '**/build/**',
      '**/dist/**',
      '**/node_modules/**',
      '**/.react-router/**',
      '**/coverage/**',
      '**/*.min.js',
      '**/public/**',
    ],
  },
  js.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      react: reactPlugin,
      'react-hooks': reactHooksPlugin,
      prettier: prettierPlugin,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // TypeScript rules - Type Safety
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/no-unsafe-argument': 'error',

      // TypeScript rules - Best Practices
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off', // Too strict
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/no-empty-function': 'error', // Changed from warn
      '@typescript-eslint/no-non-null-assertion': 'error', // Changed from warn
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/no-unnecessary-condition': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off', // Too strict
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/unbound-method': 'error', // Changed from off
      '@typescript-eslint/require-await': 'error',
      '@typescript-eslint/only-throw-error': 'error', // Correct rule name
      '@typescript-eslint/switch-exhaustiveness-check': 'error',

      // TypeScript rules - Shadowing
      'no-shadow': 'off', // Must be off for TS version
      '@typescript-eslint/no-shadow': 'error',

      // React rules
      ...reactPlugin.configs.recommended.rules,
      ...reactPlugin.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/self-closing-comp': 'error',
      'react/jsx-curly-brace-presence': [
        'error',
        { props: 'never', children: 'never' },
      ],
      'react/no-array-index-key': 'error',
      'react/no-unstable-nested-components': 'error',

      // React Hooks rules
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'error', // Changed from warn

      // General rules
      'no-console': ['error', { allow: ['warn', 'error'] }], // Changed from warn
      'no-debugger': 'error',
      'no-alert': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'error',
      'prefer-template': 'error',
      'prefer-destructuring': [
        'error',
        {
          array: true, // Changed to true
          object: true,
        },
      ],
      'no-nested-ternary': 'error', // Changed from warn
      'no-unneeded-ternary': 'error',
      'no-param-reassign': 'error',
      'no-implicit-coercion': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],

      // Complexity rules
      complexity: ['error', 15],
      'max-depth': ['error', 4],
      'max-lines-per-function': [
        'error',
        {
          max: 100,
          skipBlankLines: true,
          skipComments: true,
        },
      ],

      // Prettier integration
      'prettier/prettier': 'error',
    },
  },
  {
    // Disable type-checking for JavaScript files
    files: ['**/*.{js,jsx}'],
    ...tseslint.configs.disableTypeChecked,
  },
  {
    // Configuration files
    files: ['*.config.{js,ts}', 'eslint.config.js'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },
  prettierConfig,
)
