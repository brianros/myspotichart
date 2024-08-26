module.exports = {
  testEnvironment: 'node',
  rootDir: '.',
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
};