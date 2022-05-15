/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  resolver: "jest-node-exports-resolver",
  testEnvironment: "node",
  testPathIgnorePatterns: ["/__testutils__/"],
  setupFiles: ["./lib/db.ts", "./__tests__/__testutils__/jestEnviromentVars.js"],
};
