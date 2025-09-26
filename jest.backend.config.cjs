module.exports = {
  rootDir: '.',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/app/backend/**/?(*.)+(spec|test).[tj]s'],
  collectCoverage: true,
  collectCoverageFrom: [
    'app/backend/src/**/*.{ts,js}',
    '!app/backend/src/**/__tests__/**',
    '!**/*.d.ts'
  ],
  coverageDirectory: 'coverage-backend',
  coverageReporters: ['text','lcov'],
  coverageThreshold: {
    global: {
      lines: 0,
      statements: 0
    },
    './app/backend/src/': {
      lines: 0
    }
  }
};
