import type { Config } from 'jest';
const config: Config = {
  testEnvironment: 'node',
  collectCoverage: true,
  coverageReporters: ['text', 'lcov'],
  coverageDirectory: './coverage',
  coverageThreshold: {
    global: {
      branches: 40,
      functions: 50,
      lines: 60,
      statements: 60,
    },
  },
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
  transform: {
    '^.+\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};
export default config;
