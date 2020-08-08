'use strict';

const { GraphQLObjectType, GraphQLString } = require('graphql');

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString },
    name: {
      type: GraphQLString
    }
  }
});

// join-monster additional fields
userType._typeConfig = {
  sqlTable: 'users',
  uniqueKey: 'id'
};

module.exports = userType;
