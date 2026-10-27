import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [],
  resolve: { tsconfigPaths: true },
  test: {
    coverage: {
      enabled: true,
      exclude: ['**/*.utils.spec.ts', '**/generated/**', '**/index.ts'],
      include: ['src/**/*.ts'],
      reporter: [
        ...(configDefaults.coverage.reporter
          ? Array.isArray(configDefaults.coverage.reporter)
            ? configDefaults.coverage.reporter
            : [configDefaults.coverage.reporter]
          : []),
        'cobertura',
      ],
      thresholds: {
        // decorator metadata emits a branch per injected constructor parameter
        // that cannot be covered by tests
        branches: 90,
        statements: 95,
      },
    },
    // *.utils.spec.ts files contain reusable test utilities, not tests
    exclude: [...configDefaults.exclude, '**/*.utils.spec.ts'],
    globals: true,
    logHeapUsage: true,
    reporters: [...configDefaults.reporters, 'junit'],
    root: './',
    setupFiles: ['./vitest.setup.ts'],
  },
});
