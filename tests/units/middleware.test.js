'use strict';

const { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, errorHandler } = require('../../src/middlewares');
const { logger } = require('../../src/libs/logger');

describe(`Test 'middleware'`, () => {
  let mockReq, mockRes, mockNext;
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
    let mockRateLimiter;

    afterEach(() => {
      mockRateLimiter.consume.mockClear();
      jest.restoreAllMocks();
    });
    test('call good way', () => {
      mockRateLimiter = {
        consume: jest.fn().mockResolvedValue()
      };
      rateLimiterMiddleware(mockRateLimiter)(mockReq, mockRes, mockNext);
      expect(mockRateLimiter.consume.mock.calls.length).toBe(1);
    });
  });

  describe(`logMiddleware: `, () => {
    let mockLogger;
    beforeEach(() => {
      mockLogger = jest.spyOn(logger, 'Info');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('call', () => {
      logMiddleware(
        {
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
        },
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
    let mockLogger;
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
      expect(mockRes.status.mock.calls[0][0]).toEqual(500);
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
