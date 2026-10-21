/** Unit tests for pure logic (api, stores). Component tests need jest-expo, not installed. */
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/__tests__'],
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        tsconfig: {
          module: 'commonjs',
          moduleResolution: 'node',
          target: 'es2020',
          esModuleInterop: true,
          jsx: 'react',
          strict: true,
          skipLibCheck: true,
        },
      },
    ],
  },
};
