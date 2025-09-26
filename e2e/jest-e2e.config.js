// Jest E2E config (root-level)
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/e2e'],
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: { target: 'ES2020' } }],
  },
  testRegex: '.*\\.e2e\\.(ts|js)$',
  moduleFileExtensions: ['ts', 'js', 'json'],
  reporters: ['default'],
  maxWorkers: 1
};
