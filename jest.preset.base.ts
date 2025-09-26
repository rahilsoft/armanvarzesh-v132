import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/__mocks__/**'],
  coverageReporters: ['text', 'lcov', 'json-summary'],
  coverageThreshold: { global: { lines: 70, statements: 70, branches: 60, functions: 65 } },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
  transform: { '^.+\\.(t|j)sx?$': ['@swc/jest'] },
};
export default config;
