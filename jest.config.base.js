module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.(t|j)sx?$': ['ts-jest', { tsconfig: 'tsconfig.json', diagnostics: false }],
  },
  testMatch: ['**/__tests__/**/*.(spec|test).ts?(x)', '**/*.(spec|test).ts?(x)'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'json-summary'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  // Workspace packages declare main: dist/index.js, which only exists after a
  // build, so tests importing one failed to resolve it. Resolve to source,
  // mirroring the @arman/* and @contracts/* tsconfig paths.
  moduleNameMapper: {
    '^@arman/(.*)$': '<rootDir>/../../packages/$1/src',
    '^@contracts/(.*)$': '<rootDir>/../../contracts/$1/src',
  },
};
