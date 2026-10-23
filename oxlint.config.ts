import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'error',
  },
  env: {
    builtin: true,
    node: true,
  },
  ignorePatterns: ['**/coverage/', '**/dist/', '**/src/generated/'],
  rules: {
    'no-array-constructor': 'error',
    'no-case-declarations': 'error',
    'no-console': 'error',
    'no-empty': 'error',
    'no-fallthrough': 'error',
    'no-prototype-builtins': 'error',
    'no-regex-spaces': 'error',
    'no-useless-assignment': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-rest-params': 'error',
    'prefer-spread': 'error',
    'preserve-caught-error': 'error',
    'typescript/array-type': [
      'error',
      {
        default: 'generic',
        readonly: 'generic',
      },
    ],
    'typescript/ban-ts-comment': 'error',
    'typescript/explicit-module-boundary-types': 'error',
    'typescript/no-empty-object-type': 'error',
    'typescript/no-explicit-any': 'error',
    'typescript/no-namespace': 'error',
    'typescript/no-require-imports': 'error',
    'typescript/no-unnecessary-type-constraint': 'error',
    'typescript/no-unsafe-function-type': 'error',
  },
});
