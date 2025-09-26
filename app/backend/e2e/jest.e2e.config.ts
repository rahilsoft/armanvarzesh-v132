import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  roots: ['<rootDir>/e2e'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: { '^.+\\.(t)s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json' }] },
  testMatch: ['**/*.e2e.spec.ts'],
  verbose: true,
  maxWorkers: 1,
};
export default config;
