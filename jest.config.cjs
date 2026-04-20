module.exports = {
  clearMocks: true,
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/main.jsx',
    '!src/assets/**',
  ],
  moduleFileExtensions: ['js', 'jsx', 'json'],
  moduleNameMapper: {
    '^.+\\.(css|less|scss|sass)$': '<rootDir>/test/styleMock.js',
    '^.+\\.(png|jpg|jpeg|gif|svg|webp)$': '<rootDir>/test/fileMock.js',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
};
