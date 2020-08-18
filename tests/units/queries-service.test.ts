'use strict';
process.env.NODE_ENV = 'test';

jest.mock('./../../src/database');
import { logger } from '../../src/libs/logger';
import { queries } from '../../src/services';

describe(`Test 'Sevices:queries'`, () => {
  let spyOnLogInfo: jest.SpyInstance<void, [string, string, string]>;
  beforeEach(() => {
    spyOnLogInfo = jest.spyOn(logger, 'Info');
  });
  afterEach(() => {
    jest.restoreAllMocks();
  });
  describe(`addAccount method: `, () => {
    let spyOnQueryAddAccount: jest.SpyInstance<any, unknown[]>;
    beforeEach(() => {
      spyOnQueryAddAccount = jest.spyOn(queries.dbQueries, 'addAccount');
    });
    test('shoudl call db.account.create', async () => {
      const username = 'usertest';
      const accountId = 'user-123';
      spyOnQueryAddAccount.mockReturnValue({ id: accountId });
      const data = await queries.addAccount({ username });

      expect(spyOnQueryAddAccount.mock.calls.length).toBe(1);
      expect(spyOnLogInfo.mock.calls.length).toBe(1);
      expect(spyOnQueryAddAccount.mock.calls[0][0]).toMatchObject({ username });
      expect(data).toMatchObject({ id: accountId });
    });

    test('shoudl throw error', async () => {
      const username = 'usertest';
      const error = new Error('other error');
      spyOnQueryAddAccount.mockRejectedValue(new Error('E11000 duplicate key'));
      await expect(queries.addAccount({ username })).rejects.toBe('username already exists');
      spyOnQueryAddAccount.mockRejectedValue(error);
      await expect(queries.addAccount({ username })).rejects.toThrow('other error');

      expect(spyOnQueryAddAccount.mock.calls.length).toBe(2);
      expect(spyOnQueryAddAccount.mock.calls[0][0]).toMatchObject({ username });
    });
  });
});
