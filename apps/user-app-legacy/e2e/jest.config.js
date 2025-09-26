module.exports = {
  testRunner: 'jest-circus/runner',
  testTimeout: 120000,
  reporters: ['detox/runners/jest/streamlineReporter'],
  verbose: true,
  setupFilesAfterEnv: ['detox/runners/jest/jestSetup.js'],
};
