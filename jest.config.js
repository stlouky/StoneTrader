module.exports = {
  projects: [
    {
      displayName: 'backend',
      testMatch: ['<rootDir>/backend/tests/**/*.test.js'],
      testEnvironment: 'node',
      setupFilesAfterEnv: ['<rootDir>/backend/tests/setup.js']
    },
    {
      displayName: 'frontend',
      testMatch: ['<rootDir>/frontend/tests/**/*.test.{js,jsx}'],
      testEnvironment: 'jsdom',
      setupFilesAfterEnv: ['<rootDir>/frontend/tests/setup.js'],
      moduleNameMapping: {
        '^@/(.*)$': '<rootDir>/frontend/src/$1'
      },
      transform: {
        '^.+\\.(js|jsx)$': 'babel-jest'
      }
    }
  ],
  collectCoverageFrom: [
    'backend/src/**/*.js',
    'frontend/src/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/tests/**'
  ]
};
