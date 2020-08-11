'use strict';

const { UserInputError } = require('apollo-server-express');
const queries = require('../../services/queries');

module.exports = {
  Cart: {
    id: (parent) => {
      return parent.id;
    },
    amount: (parent) => {
      return parent.amount;
    },
    holder: (parent) => {
      return parent.holder;
    },
    product: (parent) => {
      return parent.product;
    }
  },
  Mutation: {
    holdProduct: (rootValue, args) => {
      const { accountId, productId, amount } = args;
      if (!accountId || !productId || !amount) return new UserInputError('Bad parameters');
      return queries.holdProduct({ accountId, productId, amount });
    },
    updateCartAmount: (rootValue, args) => {
      const { accountId, productId, amount } = args;
      if (!accountId || !productId || !amount) return new UserInputError('Bad parameters');
      return queries.updateCartAmount({ accountId, productId, amount });
    },
    moveCart: (rootValue, args) => {
      const { accountId, productId } = args;
      if (!accountId || !productId) return new UserInputError('Bad parameters');
      return queries.updateCartAmount({ accountId, productId });
    }
  }
};
