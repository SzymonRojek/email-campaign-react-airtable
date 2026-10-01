/** server unit tests - the client has its own runner (react-scripts test) */
module.exports = {
  testEnvironment: "node",
  roots: ["<rootDir>"],
  modulePathIgnorePatterns: ["<rootDir>/dist"],
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.test.json" }],
  },
  collectCoverageFrom: [
    "**/*.ts",
    "!dist/**",
    "!node_modules/**",
    "!index.ts",
    "!jest.config.js",
  ],
};
