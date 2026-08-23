// `transform: {}` disabled every transform, so the TypeScript specs in this
// service could never run — jest failed on the first `import`. ts-jest is
// required for them to execute at all.
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)', '**/e2e/**/*.test.ts'],
  // Prisma generates to a custom output dir, and workspace packages point main
  // at an unbuilt dist/. jest does not read tsconfig paths, so mirror them.
  moduleNameMapper: {
    '^@prisma/client$': '<rootDir>/prisma/generated/client',
    '^@arman/(.*)$': '<rootDir>/../../packages/$1/src',
    '^@contracts/(.*)$': '<rootDir>/../../contracts/$1/src',
  },
};
