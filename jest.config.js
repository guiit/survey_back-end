/* eslint-disable no-undef */
module.exports = {
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['<rootDir>/src/**/*.ts',
  '!<rootDir>/src/main/**'],
  coverageDirectory: 'coverage',
  testMatch: ['**/*.spec.ts','**/*.test.ts'],
  testEnvironment: 'node',
  preset: '@shelf/jest-mongodb',
  transform: {
    '.+\\.ts$': 'ts-jest'
  }
}
