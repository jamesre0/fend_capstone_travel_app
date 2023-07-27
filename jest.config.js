module.exports = {
    testEnvironment: 'jsdom',
    setupFiles: ['./jest.setup.js'],
    transformIgnorePatterns: [
      '/node_modules/(?!node-fetch).+\\.js$'
    ],
  };
  