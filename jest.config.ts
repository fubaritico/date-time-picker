import { type JestConfigWithTsJest } from 'ts-jest'

const customJestConfig: JestConfigWithTsJest = {
  collectCoverage: false,
  coverageDirectory: 'reports',
  coverageProvider: 'v8',
  coverageReporters: ['cobertura', 'lcov', 'text-summary'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.stories.{ts,tsx}',
    '!src/**/index.{ts,tsx}',
  ],
  // coverageThreshold: {
  //   global: {
  //     lines: 80,
  //     branches: 80,
  //     functions: 80,
  //     statements: 80,
  //   },
  // },
  preset: 'ts-jest',
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  setupFilesAfterEnv: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/jest.setup.afterEnv.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}

export default customJestConfig
