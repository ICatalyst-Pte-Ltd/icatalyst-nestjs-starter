import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      enabled: true,
      exclude: ['src/generated/**', '**/*.utils.spec.ts'],
      reporter: [...(configDefaults.coverage.reporter ?? []), 'cobertura'],
      thresholds: {
        branches: 95,
        statements: 95,
      },
    },
    environment: 'node',
    // *.utils.spec.ts files contain reusable test utilities, not tests
    exclude: [...configDefaults.exclude, '**/*.utils.spec.ts'],
    globals: true,
    include: ['**/*.spec.ts'],
    logHeapUsage: true,
    reporters: [...configDefaults.reporters, 'junit'],
    root: './',
    setupFiles: ['./vitest.setup.ts'],
  },
});
