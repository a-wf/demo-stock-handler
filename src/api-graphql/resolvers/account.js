'use strict';
const { AuthenticationError, UserInputError } = require('apollo-server-express');
const queries = require('../../services/queries');

module.exports = {
  Query: {
    account: (rootValue, args) => {
      const { accountId, username } = args;
      if (!accountId) return new UserInputError('Bad parameters');
      return queries.getAccount({ accountId, username });
    }
  },
  Account: {
    id: (parent) => {
      return parent.id;
    },
    username: (parent) => {
      return parent.username;
    },
    getAccountHolds: (parent) => {
      return queries.getAccountHolds({ accountId: parent.id });
    }
  },
  Mutation: {
    addAccount: (rootValue, args, context) => {
      if (!context.authValidated) return new AuthenticationError('must be authenticated as admin');
      const { username } = args;

      if (!username) return new UserInputError('Bad parameters');
      return queries.addAccount({ username });
    },
    removeAccount: (rootValue, args, context) => {
      if (!context.authValidated) return new AuthenticationError('must be authenticated as admin');
      const { accountId } = args;

      if (!accountId) return new UserInputError('Bad parameters');
      return queries.removeAccount({ accountId });
    }
  }
};
