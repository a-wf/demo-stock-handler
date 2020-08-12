'use strict';
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const queries = require('../../services/queries');

module.exports = {
  Query: {
    /**
     * @typedef {object} accountIDNAME
     * @property {string} accountId unique id
     * @property {string} username
     */
    /**
     * get account data
     * @param {any} rootValue
     * @param {accountIDNAME} args
     */
    account: async (rootValue, args) => {
      const { accountId, username } = args;
      if (!accountId) return new UserInputError('Bad parameters');
      return await queries.getAccount({ accountId, username });
    },
    /**
     * get account id
     * @param {AccountID} id
     * @return {Array<Cart>}
     */
    getAccountHolds: async (rootValue, args) => {
      const { accountId } = args;
      if (!accountId) return new UserInputError('Bad parameters');

      return await queries.getAccountHolds({ accountId });
    }
  },
  Account: {
    /**
     * @typedef {object} AccountID
     * @property {string} id
     */
    /**
     * get account id
     * @param {AccountID} parent
     * @return {string} id
     */
    id: parent => {
      return parent.id;
    },
    /**
     * @typedef {object} AccountUsername
     * @property {string} username
     */
    /**
     * get account id
     * @param {AccountUsername} username
     * @return {string} username
     */
    username: parent => {
      return parent.username;
    },

    /**
     * get account id
     * @param {AccountID} id
     * @return {Array<Cart>}
     */
    getAccountHolds: async parent => {
      return await queries.getAccountHolds({ accountId: parent.id });
    }
  },
  Mutation: {
    /**
     * jwt token validation process result
     * @typedef {object} Context
     * @property {boolean} authValidated
     */
    /**
     * add new account
     * @param {any} rootValue
     * @param {AccountUsername} args
     * @param {Context} context
     */
    addAccount: async (rootValue, args, context) => {
      const { authValidated } = context;
      if (authValidated instanceof Error) {
        return new AuthenticationError(authValidated.message);
      } else if (!authValidated) {
        return new AuthenticationError('must be authenticated as admin');
      }
      const { username } = args;

      if (!username) return new UserInputError('Bad parameters');
      return await queries.addAccount({ username });
    },

    /**
     * remove an account
     * @param {any} rootValue
     * @param {AccountID} args
     * @param {Context} context
     */
    removeAccount: async (rootValue, args, context) => {
      const { authValidated } = context;
      if (authValidated instanceof Error) {
        return new AuthenticationError('authValidated.message;');
      } else if (!authValidated) {
        return new AuthenticationError('must be authenticated as admin');
      }

      const { accountId } = args;

      if (!accountId) return new UserInputError('Bad parameters');
      await queries.removeAccount({ accountId });
    }
  }
};
