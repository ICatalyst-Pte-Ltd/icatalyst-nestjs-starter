import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      enabled: true,
      reporter: [...(configDefaults.coverage.reporter ?? []), 'cobertura'],
      thresholds: {
        branches: 95,
        statements: 95,
      },
    },
    environment: 'node',
    exclude: [...configDefaults.exclude],
    globals: true,
    include: ['**/*.spec.ts'],
    logHeapUsage: true,
    reporters: [...configDefaults.reporters, 'junit'],
    root: './',
  },
});
