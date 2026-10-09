// This package is ESM ("type": "module", module: ESNext). The shared base
// config transpiled with the package tsconfig, so ts-jest emitted ESM that
// jest's CommonJS runtime could not load ("Cannot use import statement outside
// a module") and the whole suite failed to run. Transpile to CommonJS for
// tests instead, and allow the .js sources through the same transform.
const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  rootDir: __dirname,
  displayName: 'api-gateway',
  transform: {
    '^.+\\.(t|j)sx?$': [
      'ts-jest',
      {
        diagnostics: false,
        useESM: false,
        tsconfig: {
          module: 'CommonJS',
          moduleResolution: 'Node',
          target: 'ES2020',
          allowJs: true,
          esModuleInterop: true,
allowSyntheticDefaultImports: true,
        },
      },
    ],
  },
  moduleNameMapper: {
    ...(base.moduleNameMapper || {}),
    // ESM specifiers carry a .js extension that maps back to the source file.
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
};
