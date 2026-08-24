import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  // The Prisma client is generated to a custom output dir and mapped via
  // tsconfig paths; jest does not read those, so mirror the mapping here.
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/prisma/generated/client",
    "^@arman/(.*)$": "<rootDir>/../../packages/$1/src",
    "^@contracts/(.*)$": "<rootDir>/../../contracts/$1/src",
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/main.ts',
    '!src/**/graphql/dataloader.ts',
    '!src/**/tracing.ts',
    '!src/**/*.module.ts',
  ],
  coverageThreshold: { global: { branches: 70, functions: 75, lines: 80, statements: 80 } },
};
export default config;
