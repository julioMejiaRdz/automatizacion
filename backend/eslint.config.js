// @ts-check
const js = require('@eslint/js')
const globals = require('globals')
const tseslint = require('typescript-eslint')
const prettier = require('eslint-config-prettier')

module.exports = tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.ts'],
    extends: [js.configs.recommended, tseslint.configs.recommended, prettier],
    languageOptions: {
      ecmaVersion: 2024,
      globals: globals.node,
    },
  },
  {
    files: ['eslint.config.js'],
    languageOptions: { globals: globals.node, sourceType: 'commonjs' },
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
)
