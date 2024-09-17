import js from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import ts from 'typescript-eslint';

/** @type { Array<import('eslint').Linter.Config> } */
export default [
  {
    ignores: ['**/coverage/', '**/dist/'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'no-console': 'error',
      '@typescript-eslint/explicit-module-boundary-types': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },
];
