module.exports = {
  testEnvironment: "jsdom",
  clearMocks: true,
  coverageDirectory: "./coverage/",
  collectCoverage: true,
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  setupFiles: ["jest-localstorage-mock"],
};
