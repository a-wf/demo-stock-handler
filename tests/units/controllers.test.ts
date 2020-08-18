'use strict';

jest.mock('./../../src/services/queries');
import * as accountControllers from '../../src/api-rest/controllers/account';
import queries from '../../src/services/queries';

describe(`Test 'controllers'`, () => {
  let mockReq: any;
  let mockRes: any;
  let mockNext: any;
  beforeEach(() => {
    mockReq = {};
    mockRes = {
      status: jest.fn(),
      send: jest.fn(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    mockRes.status.mockClear();
    mockNext.mockClear();
    jest.restoreAllMocks();
  });

  describe('Account controllers', () => {
    describe('addAccount', () => {
      test('addAccount with a valid body', async () => {
        mockRes.status.mockReturnValue({ json: mockRes.json });
        const username = 'testUser';
        mockReq.body = { username };
        const data = await accountControllers.addAccount(mockReq, mockRes, mockNext);
        expect((queries.addAccount as jest.Mock).mock.calls.length).toBe(1);
        expect((queries.addAccount as jest.Mock).mock.calls[0][0]).toMatchObject({ username });
        expect(mockRes.status.mock.calls.length).toBe(1);
        expect(mockRes.status.mock.calls[0][0]).toEqual(200);
        expect(mockRes.json.mock.calls.length).toBe(1);
        expect(mockRes.json.mock.calls[0][0]).toMatchObject({ data });
      });
      test('addAccount with a invalid body', async () => {
        mockRes.status.mockReturnValue({ send: mockRes.send });
        mockReq.body = {};
        await accountControllers.addAccount(mockReq, mockRes, mockNext);
        expect((queries.addAccount as jest.Mock).mock.calls.length).toBe(0);
        expect(mockRes.status.mock.calls.length).toBe(1);
        expect(mockRes.status.mock.calls[0][0]).toEqual(400);
        expect(mockRes.send.mock.calls.length).toBe(1);
        expect(mockRes.send.mock.calls[0][0]).toEqual('Bad request');
      });

      test('addAccount with a invalid body', async () => {
        mockRes.status.mockReturnValue({ send: mockRes.send });
        await accountControllers.addAccount(mockReq, mockRes, mockNext);
        expect((queries.addAccount as jest.Mock).mock.calls.length).toBe(0);
        expect(mockRes.status.mock.calls.length).toBe(0);
        expect(mockNext.mock.calls.length).toBe(1);
        expect(mockNext.mock.calls[0][0]).toBeInstanceOf(Error);
      });
    });

    describe('removeAccount', () => {
      test('removeAccount with a valid params', async () => {
        mockRes.status.mockReturnValue({ json: mockRes.json });
        const accountId = '5f2f17b1e010e81f505fa541';
        mockReq.params = { accountId };
        const data = await accountControllers.removeAccount(mockReq, mockRes, mockNext);
        expect((queries.removeAccount as jest.Mock).mock.calls.length).toBe(1);
        expect((queries.removeAccount as jest.Mock).mock.calls[0][0]).toMatchObject({ accountId });
        expect(mockRes.status.mock.calls.length).toBe(1);
        expect(mockRes.status.mock.calls[0][0]).toEqual(200);
      });
      test('removeAccount with a invalid params', async () => {
        mockReq.params = {};
        mockRes.status.mockReturnValue({ send: mockRes.send });
        await accountControllers.removeAccount(mockReq, mockRes, mockNext);
        expect((queries.removeAccount as jest.Mock).mock.calls.length).toBe(0);
        expect(mockRes.status.mock.calls.length).toBe(1);
        expect(mockRes.status.mock.calls[0][0]).toEqual(400);
        expect(mockRes.send.mock.calls.length).toBe(1);
        expect(mockRes.send.mock.calls[0][0]).toEqual('Bad request');
      });
    });
  });
});
