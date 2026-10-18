export default {
  testEnvironment: "node",
  transform: {},
  testTimeout: 180000,
  collectCoverageFrom: [
    "Src/**/*.js",
    "!Src/seed.js",
  ],
  coverageDirectory: "coverage",
};
