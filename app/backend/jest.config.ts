import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Align with the tsconfig @prisma/client path mapping: resolve the canonical
  // generated client (the root package is a sibling service's client and lacks
  // this schema's enums/models as runtime values).
  moduleNameMapper: { '^@prisma/client$': '<rootDir>/src/database/prisma/generated/client' },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  verbose: true,
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' } },
  transform: { '^.+\\.(t|j)s$': ['ts-jest', {}] },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
export default config;
