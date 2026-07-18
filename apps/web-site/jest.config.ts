import base from '../../jest.preset.base';

export default {
  ...base,
  // Playwright suites live in e2e/ and tests/e2e/ and must only run under
  // `playwright test`; importing @playwright/test inside Jest aborts the run.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/', '<rootDir>/tests/e2e/', '<rootDir>/__e2e__/'],
  // Workspace packages (@arman/ui, …) still resolve their own React 18 copy;
  // mixing element versions crashes React 19's reconciler in tests. Pin every
  // react entrypoint to this app's single React 19 instance, mirroring what
  // Next's bundler does at build time.
  moduleNameMapper: {
    '^react$': '<rootDir>/node_modules/react',
    '^react-dom$': '<rootDir>/node_modules/react-dom',
    '^react/jsx-runtime$': '<rootDir>/node_modules/react/jsx-runtime',
    '^react/jsx-dev-runtime$': '<rootDir>/node_modules/react/jsx-dev-runtime',
    '^react-dom/client$': '<rootDir>/node_modules/react-dom/client',
    '^react-dom/test-utils$': '<rootDir>/node_modules/react-dom/test-utils',
  },
};
