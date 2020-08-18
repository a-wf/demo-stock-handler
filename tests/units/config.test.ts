'use strict';

import config from '../../src/config';

describe(`Test 'config loading' code`, () => {
  const { common } = config;

  describe(`Common: `, () => {
    test('it should contains mandatory fields', () => {
      const expected = { nodeEnv: 'test' };
      expect(common).toStrictEqual(expected);
    });
  });

  describe(`Database: `, () => {
    test('it should contains mandatory fields', () => {
      const { database } = config;
      const expected = {
        client: 'mongodb',
        connection: {
          host: 'localhost',
          user: 'test',
          password: 'test_pwd',
          database: 'test_db'
        },
        pool: { min: 1, max: 5 },
        migrations: { directory: 'migrations/path' },
        seeds: { directory: 'seeds/path' }
      };
      expect(database[common.nodeEnv]).toStrictEqual(expected);
      // expect(database[common.nodeEnv]).toStrictEqual(database[common.nodeEnv]); // use it when running integration tests with postgresql
    });
  });

  describe(`Logger: `, () => {
    test('it should contains mandatory fields', () => {
      const { logger } = config;
      const expected = {
        level: 'debug',
        file: {
          name: 'service_test',
          path: 'logs/test',
          maxSize: 1024000,
          maxFiles: 3
        }
      };
      expect(logger).toStrictEqual(expected);
    });
  });

  describe(`Monitor: `, () => {
    test('it should contains mandatory fields', () => {
      const { monitor } = config;
      const expected = {
        enable: true,
        port: 7777
      };
      expect(monitor).toStrictEqual(expected);
    });
  });

  describe(`Rate limiter: `, () => {
    test('it should contains mandatory fields', () => {
      const { rateLimit } = config;
      const expected = {
        points: 20,
        duration: 1
      };
      expect(rateLimit).toStrictEqual(expected);
    });
  });

  describe(`Server: `, () => {
    test('it should contains mandatory fields', () => {
      const { server } = config;
      const expected: any = {
        apiType: 'graphql',
        protocol: 'http',
        port: 8080,
        adminLogin: 'admin_test',
        adminPassword: 'admin_test_pwd',
        token_secret: 'admin-secret',
        apikey: 'apiKey test 123',
        ssl: { key: undefined, cert: undefined }
      };
      expect(server).toStrictEqual(expected);
    });
  });
});
