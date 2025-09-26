module.exports = {
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/utils/setup-env.ts'],
  transform: { '^.+\\.(t|j)s$': ['ts-jest', { isolatedModules: true }] },
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: ['**/?(*.)+(spec|test).(ts|js)'],
  collectCoverageFrom: ['src/**/*.(ts|js)'],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov'],
  coverageProvider: 'v8',
  testPathIgnorePatterns: ['/node_modules/', '/dist/']
};
