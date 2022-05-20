import type { Config } from 'jest';
import { defaults } from 'jest-config';

const config: Config = {
  collectCoverageFrom: ['**/*.(t|j)s'],
  coverageDirectory: '../coverage',
  coverageReporters: defaults.coverageReporters.concat('cobertura'),
  coverageThreshold: {
    global: {
      branches: 92,
      statements: 95,
    },
  },
  logHeapUsage: true,
  moduleFileExtensions: ['js', 'json', 'ts'],
  reporters: ['default', 'jest-junit'],
  rootDir: 'src',
  setupFilesAfterEnv: ['../jest.setup.ts'],
  testEnvironment: 'node',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  workerIdleMemoryLimit: '512MB',
};
export default config;
