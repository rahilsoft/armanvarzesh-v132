import base from '../../jest.preset.base';

export default {
  ...base,
  // Playwright suites live in e2e/ and tests/e2e/ and must only run under
  // `playwright test`; importing @playwright/test inside Jest aborts the run.
  testPathIgnorePatterns: ['/node_modules/', '<rootDir>/e2e/', '<rootDir>/tests/e2e/', '<rootDir>/__e2e__/'],
};
