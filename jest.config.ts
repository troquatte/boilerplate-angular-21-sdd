import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/src/server/tests/**/*.spec.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1',
    '\\./server/utils/ssr-compat$': '<rootDir>/src/server/utils/ssr-compat.mock.ts',
    '^@angular/ssr/node$': '<rootDir>/src/server/tests/mocks/angular-ssr-node.mock.ts',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
};

export default config;
