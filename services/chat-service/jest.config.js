\1
  // <<< gpt-added-coverage-threshold
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  // >>> gpt-added-coverage-threshold

  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  rootDir: '.',
  testRegex: 'test/.*\.spec\.ts$',
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};