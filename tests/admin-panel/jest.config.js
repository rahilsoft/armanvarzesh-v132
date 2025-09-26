
\1
  // <<< gpt-added-coverage-threshold
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 75,
      lines: 80,
      statements: 80
    }
  },
  // >>> gpt-added-coverage-threshold

  preset: "ts-jest",
  testEnvironment: "jsdom",
  roots: ["<rootDir>/unit", "<rootDir>/e2e", "<rootDir>/integration"],
  coverageDirectory: "<rootDir>/coverage",
  collectCoverageFrom: [
    "**/*.{ts,tsx}",
    "!**/node_modules/**",
    "!**/vendor/**"
  ]
};
