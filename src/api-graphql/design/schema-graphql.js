'use strict';

const { gql } = require('apollo-server-express');

module.exports = gql`
  type Account {
    id: ID!
    username: String
    getAccountHolds: [Cart]
  }

  type Product {
    id: ID!
    name: String
    amount: Int
    getProductHolders: [Account]
  }

  type Cart {
    id: ID
    holder: Account!
    product: Product!
    amount: Int!
  }

  type Query {
    account(accountId: ID!, username: String): Account
    products(productId: ID, name: String): [Product]
    getAccountHolds(accountId: ID!): [Cart]
  }

  type Mutation {
    addAccount(username: String!): Account
    removeAccount(accountId: ID!): ID

    addProduct(name: String!, amount: Int!): Product
    updateProductStock(productId: ID!, amount: Int!): Product

    holdProduct(accountId: ID!, productId: ID!, amount: Int!): Cart
    updateCartAmount(accountId: ID!, productId: ID!, amount: Int!): Cart
    moveCart(accountId: ID!, productId: ID!): Cart
  }
`;
