import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  verbose: true,
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' } },
  transform: { '^.+\\.(t|j)s$': ['ts-jest', {}] },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
export default config;
