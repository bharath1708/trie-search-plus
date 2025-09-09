export default {
  transform: {},
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  testEnvironment: 'node',
  transformIgnorePatterns: [],
  verbose: true,
  detectOpenHandles: true,
  forceExit: true,
  // Set a shorter timeout for tests
  testTimeout: 10000
};