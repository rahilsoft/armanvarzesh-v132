/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: { '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }] },
  collectCoverageFrom: ['**/*.{ts,tsx,js,jsx}', '!**/node_modules/**', '!**/dist/**'],
  coverageThreshold: { global: { lines: 20, statements: 20, branches: 15, functions: 20 } },
  coverageReporters: ['text', 'lcov'],
};
