'use strict';

import { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, errorHandler } from '../../src/middlewares';
import { logger } from '../../src/libs/logger';
import { Request } from 'express';
import { RateLimiterStoreAbstract } from 'rate-limiter-flexible';

describe(`Test 'middleware'`, () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  beforeEach(() => {
    mockReq = {
      get: jest.fn()
    };
    mockRes = {
      status: jest.fn(),
      send: jest.fn(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });
  afterEach(() => {
    mockRes.send.mockClear();
    mockRes.status.mockClear();
    mockNext.mockClear();
    jest.restoreAllMocks();
  });

  describe(`rateLimiterMiddleware: `, () => {
    let mockRateLimiter: any;

    afterEach(() => {
      mockRateLimiter.consume.mockClear();
      jest.restoreAllMocks();
    });
    test('call good way', () => {
      mockRateLimiter = {
        consume: jest.fn().mockResolvedValue(undefined)
      };
      rateLimiterMiddleware((mockRateLimiter as unknown) as RateLimiterStoreAbstract)(mockReq, mockRes, mockNext);
      expect(mockRateLimiter.consume.mock.calls.length).toBe(1);
    });
  });

  describe(`logMiddleware: `, () => {
    let mockLogger: jest.SpyInstance<void, [string, string, string]>;
    beforeEach(() => {
      mockLogger = jest.spyOn(logger, 'Info');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('call', () => {
      logMiddleware(
        ({
          method: 'post',
          originalUrl: 'url-test',
          params: {
            data: 'params'
          },
          query: {
            data: 'query'
          },
          body: {
            data: 'body'
          }
        } as unknown) as Request,
        undefined,
        mockNext
      );
      expect(mockNext.mock.calls.length).toBe(1);
      expect(mockLogger.mock.calls.length).toBe(1);
      expect(mockLogger.mock.calls[0]).toMatchObject([
        'App',
        'api',
        'post url-test params={"data":"params"} query={"data":"query"} body={"data":"body"}'
      ]);
    });
  });

  describe(`apiKeyMiddleware: `, () => {
    test('call', () => {
      const apiKeyValue = 'apikey test 123';
      mockReq.get.mockReturnValue(apiKeyValue);
      mockRes.status.mockReturnValue({ send: mockRes.send });
      apiKeyMiddleware(apiKeyValue)(mockReq, mockRes, mockNext);

      expect(mockNext.mock.calls.length).toBe(1);
      expect(mockReq.get.mock.calls.length).toBe(1);
      expect(mockReq.get.mock.calls[0][0]).toEqual('X-API-KEY');

      apiKeyMiddleware('wrong apikey')(mockReq, mockRes, mockNext);
      expect(mockRes.status.mock.calls.length).toBe(1);
      expect(mockRes.send.mock.calls.length).toBe(1);
      expect(mockReq.get.mock.calls.length).toBe(2);
      expect(mockReq.get.mock.calls[1][0]).toEqual('X-API-KEY');
      expect(mockRes.status.mock.calls[0][0]).toEqual(401);
      expect(mockRes.send.mock.calls[0][0]).toEqual('Unauthorized');
    });
  });

  describe(`errorHandler: `, () => {
    let mockLogger: jest.SpyInstance<void, [string, string, string]>;
    beforeEach(() => {
      mockLogger = jest.spyOn(logger, 'Error');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('call', () => {
      mockRes.status.mockReturnValue({ json: mockRes.json });
      const err = new Error();
      errorHandler(err, mockReq, mockRes, mockNext);

      expect(mockLogger.mock.calls.length).toBe(1);
      expect(mockLogger.mock.calls[0]).toMatchObject(['App', 'errorHandler', `${err.stack}`]);
      expect(mockRes.status.mock.calls.length).toBe(1);
      expect(mockRes.status.mock.calls[0][0]).toEqual(400);
      expect(mockRes.json.mock.calls.length).toBe(1);
      expect(mockRes.json.mock.calls[0][0]).toMatchObject({
        data: err.message
      });

      errorHandler('string error', mockReq, mockRes, mockNext);
      expect(mockLogger.mock.calls.length).toBe(2);
      expect(mockLogger.mock.calls[1]).toMatchObject(['App', 'errorHandler', `string error`]);
      expect(mockRes.status.mock.calls.length).toBe(2);
      expect(mockRes.status.mock.calls[1][0]).toEqual(400);
      expect(mockRes.json.mock.calls.length).toBe(2);
      expect(mockRes.json.mock.calls[1][0]).toMatchObject({
        data: `string error`
      });
    });
  });
});
