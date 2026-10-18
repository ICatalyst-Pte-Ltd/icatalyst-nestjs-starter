import { defineConfig } from 'oxlint';

export default defineConfig({
  env: {
    builtin: true,
    node: true,
  },
  ignorePatterns: ['**/coverage/', '**/dist/'],
  rules: {
    'no-console': 'error',
    'typescript/explicit-module-boundary-types': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-floating-promises': 'error',
  },
});
