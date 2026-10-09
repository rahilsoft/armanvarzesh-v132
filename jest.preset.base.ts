import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/__mocks__/**'],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: { global: { lines: 70, statements: 70, branches: 60, functions: 65 } },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  // Workspace packages point main at dist/, which only exists after a build,
  // so tests importing one failed to resolve it. Resolve to source, matching
  // the @arman/* and @contracts/* tsconfig paths.
  moduleNameMapper: {
    '^@arman/(.*)$': '<rootDir>/../../packages/$1/src',
    '^@contracts/(.*)$': '<rootDir>/../../contracts/$1/src',
  },
  transform: { '^.+\\.(t|j)sx?$': ['@swc/jest', {}] },
};
export default config;
