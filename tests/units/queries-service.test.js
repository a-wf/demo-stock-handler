'use strict';

jest.mock('./../../src/database');
const { logger } = require('../../src/libs/logger');
const db = require('./../../src/database');
const queries = require('../../src/services/queries');

describe(`Test 'Sevices:queries'`, () => {
  describe(`addAccount method: `, () => {
    let spyOnLogInfo, spyOnLogWarn, spyOnLogError, spyOnLogDebug;
    beforeEach(() => {
      spyOnLogInfo = jest.spyOn(logger, 'Info');
      spyOnLogWarn = jest.spyOn(logger, 'Warn');
      spyOnLogError = jest.spyOn(logger, 'Error');
      spyOnLogDebug = jest.spyOn(logger, 'Debug');
    });
    afterEach(() => {
      jest.restoreAllMocks();
    });
    test('shoudl call db.account.create', async () => {
      const username = 'usertest';
      const accountId = 'user-123';
      db.accounts.create.mockReturnValue({ id: accountId });
      const data = await queries.addAccount({ username });

      expect(db.accounts.create.mock.calls.length).toBe(1);
      expect(spyOnLogInfo.mock.calls.length).toBe(1);
      expect(db.accounts.create.mock.calls[0][0]).toMatchObject({ username });
      expect(data).toMatchObject({ id: accountId });
    });

    test('shoudl throw error', async () => {
      let username = 'usertest';
      const error = new Error('other error');
      db.accounts.create.mockRejectedValue(new Error('E11000 duplicate key'));
      await expect(queries.addAccount({ username })).rejects.toBe('username already exists');
      db.accounts.create.mockRejectedValue(error);
      await expect(queries.addAccount({ username })).rejects.toThrow('other error');

      expect(db.accounts.create.mock.calls.length).toBe(2);
      expect(db.accounts.create.mock.calls[0][0]).toMatchObject({ username });
    });
  });
});
