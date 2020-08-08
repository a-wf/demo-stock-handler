'use strict';
const { buildSchema } = require('graphql');

module.exports = buildSchema(`
  """
  User type
  """
  type UserType {
    "User ID from DB"
    ID: ID!
    "Name of user"
    Name: String!
  }
  type RootQuery {
    user(userId: String!): UserType!
  }
  schema {
    query: RootQuery
  }
`);
