import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    setupFiles: ['./test/setup-e2e.ts'],
  },
});
