const base = require('../../jest.config.base.js');
module.exports = { ...base, rootDir: __dirname, displayName: '@arman/analytics-service',
  // Prisma generates to a custom output dir; jest does not read tsconfig paths.
  moduleNameMapper: { ...(base.moduleNameMapper || {}), "^@prisma/client$": "<rootDir>/prisma/generated/client" },
};