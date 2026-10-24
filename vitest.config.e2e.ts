import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: { tsconfigPaths: true },
  test: {
    globals: true,
    include: ['**/*.e2e-spec.ts'],
    root: './',
    setupFiles: ['./test/setup-e2e.ts'],
  },
});
