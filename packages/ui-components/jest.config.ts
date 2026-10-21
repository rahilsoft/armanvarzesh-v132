import base from '../../jest.preset.base';

// Workspace packages are consumed from source (no build step), so map them for jest.
export default {
  ...base,
  moduleNameMapper: { '^@arman/ui-tokens$': '<rootDir>/../ui-tokens/src/index.ts' },
};
