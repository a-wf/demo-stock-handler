'use strict';

const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');

const stockType = new GraphQLObjectType({
  name: 'stock',
  fields: {
    id: { type: GraphQLString },
    product: {
      type: GraphQLString
    },
    in_stock: {
      type: GraphQLInt
    }
  }
});

// join-monster additional fields
stockType._typeConfig = {
  sqlTable: 'stocks',
  uniqueKey: 'id'
};

module.exports = stockType;
