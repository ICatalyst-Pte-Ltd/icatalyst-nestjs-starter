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
        // decorator metadata emits a branch per injected constructor parameter
        // that cannot be covered by tests
        branches: 90,
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
