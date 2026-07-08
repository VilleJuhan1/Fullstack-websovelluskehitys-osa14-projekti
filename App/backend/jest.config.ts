// jest.config.ts
export default {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/index.ts',
    '!src/server.ts',
    '!src/migrations/*.ts',
    '!src/plugins/**',
    '!src/utils/logger.ts',
    '!src/schema/typeDefs.ts',
    '!src/schema/resolvers.ts',
    '!src/db/index.ts',
    '!src/db/sequelize.ts'
  ],
};
