import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/?(*.)+(spec|test).ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // Mirror the tsconfig path mappings so jest resolves workspace packages at
  // runtime (their package.json `main` points at TS source, which node's
  // resolver can't load; e2e imports the full AppModule, which pulls the
  // `@arman/*` / `@contracts/*` graph in). @prisma/client resolves to the
  // canonical generated client (the root package is a sibling service's client
  // and lacks this schema's enums/models as runtime values).
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/src/database/prisma/generated/client',
    // Subpath import must be mapped before the bare-package rule below.
    '^@arman/observability-sdk/register$': '<rootDir>/../../packages/observability-sdk/src/register',
    '^@arman/([^/]+)$': '<rootDir>/../../packages/$1/src',
    '^@contracts/([^/]+)$': '<rootDir>/../../contracts/$1/src',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  verbose: true,
  globals: { 'ts-jest': { tsconfig: '<rootDir>/tsconfig.json' } },
  transform: { '^.+\\.(t|j)s$': ['ts-jest', {}] },
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
export default config;
