// This config declared only testEnvironment, so there was no TypeScript
// transform and every .ts spec in this package failed to run.
const base = require('../../jest.config.base.js');
module.exports = { ...base, rootDir: __dirname, displayName: '@arman/service-kit' };
