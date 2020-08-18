'use strict';

import winston from 'winston';
import { logger as loggerConfig } from './../../src/config';
import Logger, { logger } from './../../src/libs/logger';

describe(`Test 'logger'`, () => {
  describe(`Logger class: `, () => {
    let mockCreateLogger: jest.Mock<any, any>;
    beforeEach(() => {
      mockCreateLogger = winston.createLogger = jest.fn().mockReturnValue({ mock: 'tested' });
    });
    afterEach(() => {
      mockCreateLogger.mockClear();
      jest.restoreAllMocks();
    });
    test('constructor', () => {
      const testLogger = new Logger(loggerConfig);
      expect(testLogger.winston).toStrictEqual({ mock: 'tested' });
      expect((winston.createLogger as jest.Mock).mock.calls.length).toBe(1);
    });
  });

  describe(`logger object: `, () => {
    let spyOnLogMethod: jest.SpyInstance<any, unknown[]>;
    let spyOnWinstonError: jest.SpyInstance<any, unknown[]>;
    let spyOnWinstonLog: jest.SpyInstance<any, unknown[]>;
    beforeEach(() => {
      spyOnLogMethod = jest.spyOn(logger, 'Log');
      spyOnWinstonError = jest.spyOn(logger.winston, 'error');
      spyOnWinstonLog = jest.spyOn(logger.winston, 'log');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('Log method', () => {
      logger.Log('info', 'testModule', 'logMethod', 'log test 1');
      logger.Log('info', undefined, 'logMethod', 'log test 2');
      logger.Log('error', 'testModule', 'logMethod', 'log test 3');
      logger.Log('debug', 'testModule', 'logMethod', 'log test 4');
      expect(spyOnLogMethod.mock.calls.length).toBe(4);
      expect(spyOnLogMethod.mock.calls[0].length).toBe(4);
      expect(spyOnWinstonError.mock.calls.length).toBe(1);
      expect(spyOnWinstonLog.mock.calls.length).toBe(3);

      expect(spyOnLogMethod.mock.calls[0]).toMatchObject(['info', 'testModule', 'logMethod', 'log test 1']);
      expect(spyOnWinstonError.mock.calls[0][0]).toStrictEqual('[' + logger.moduleName + '] Failed to add log, no module provided');
      expect(spyOnWinstonLog.mock.calls[2][0]).toMatchObject({
        level: 'debug',
        label: 'testModule:logMethod',
        message: 'log test 4'
      });
    });

    test('Error method', () => {
      logger.Error('testModule', 'logMethod', 'log test 1');
      expect(spyOnLogMethod.mock.calls.length).toBe(1);
      expect(spyOnWinstonLog.mock.calls.length).toBe(1);

      expect(spyOnLogMethod.mock.calls[0]).toMatchObject(['error', 'testModule', 'logMethod', 'log test 1']);
    });

    test('Info method', () => {
      logger.Info('testModule', 'logMethod', 'log test info');
      expect(spyOnLogMethod.mock.calls.length).toBe(1);
      expect(spyOnWinstonLog.mock.calls.length).toBe(1);

      expect(spyOnLogMethod.mock.calls[0]).toMatchObject(['info', 'testModule', 'logMethod', 'log test info']);
    });

    test('Debug method', () => {
      logger.Debug('testModule', 'logMethod', 'log test 123');
      expect(spyOnLogMethod.mock.calls.length).toBe(1);
      expect(spyOnWinstonLog.mock.calls.length).toBe(1);

      expect(spyOnLogMethod.mock.calls[0]).toMatchObject(['debug', 'testModule', 'logMethod', 'log test 123']);
    });

    test('Warn method', () => {
      logger.Warn('testModule', 'logMethod', 'log test 2');
      expect(spyOnLogMethod.mock.calls.length).toBe(1);
      expect(spyOnWinstonLog.mock.calls.length).toBe(1);

      expect(spyOnLogMethod.mock.calls[0]).toMatchObject(['warn', 'testModule', 'logMethod', 'log test 2']);
    });

    test('Print method', () => {
      const temp = logger.config.level;
      logger.config.level = 'debug';
      logger.Print('testModule', 'logMethod', 'log test 1', 'extra test 1');

      logger.config.level = 'info';
      logger.Print('testModule', 'logMethod', 'log test 2', 'extra test 2');
      logger.config.level = temp;

      expect(spyOnLogMethod.mock.calls.length).toBe(2);
      expect(spyOnWinstonLog.mock.calls.length).toBe(2);

      expect(spyOnLogMethod.mock.calls[0]).toMatchObject(['debug', 'testModule', 'logMethod', 'log test 1, extra test 1']);
      expect(spyOnLogMethod.mock.calls[1]).toMatchObject(['info', 'testModule', 'logMethod', 'log test 2']);
    });
  });
});
