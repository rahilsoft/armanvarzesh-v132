// Tests are TypeScript; the previous `transform: {}` disabled all transforms,
// so every suite died on "Cannot use import statement outside a module".
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)', '**/e2e/**/*.test.ts'],
};
