module.exports = {
  moduleNameMapper: {
    "^@prisma/client$": "<rootDir>/prisma/generated/client",
    "^@arman/(.*)$": "<rootDir>/../../packages/$1/src",
    "^@contracts/(.*)$": "<rootDir>/../../contracts/$1/src",
  },
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)','**/e2e/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        types: ['jest', 'node']
      }
    }]
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json']
};