module.exports = {
  testEnvironment: 'node',
  transform: {},
  globals: {
    'ts-jest': {
      useESM: true,
    },
  },
  testTimeout: 60000,
};
