'use strict';

const queries = require('../../services/queries');
const { AuthenticationError, UserInputError } = require('apollo-server-express');

module.exports = {
  Query: {
    products: (rootValue, args) => {
      const { productId, name } = args;
      return queries.listProducts({ productId, name });
    }
  },
  Product: {
    id: (parent) => {
      return parent.id;
    },
    name: (parent) => {
      return parent.name;
    },
    amount: (parent) => {
      return parent.amount;
    },
    getProductHolders: (parent) => {
      return queries.getProductHolders(parent.id, parent.name);
    }
  },
  Mutation: {
    addProduct: (rootValue, args, context) => {
      if (!context.authValidated) return new AuthenticationError('must be authenticated as admin');
      const { name, amount } = args;

      if (!name || !amount) return new UserInputError('Bad parameters');
      return queries.addProductd({ name, amount });
    },
    updateProductStock: (rootValue, args, context) => {
      if (!context.authValidated) return new AuthenticationError('must be authenticated as admin');
      const { productId, amount } = args;

      if (!productId || !amount) return new UserInputError('Bad parameters');
      return queries.updateProductStock({ productId, amount });
    }
  }
};
