'use strict';

const { GraphQLObjectType, GraphQLString, GraphQLInt } = require('graphql');
const userType = require('./user');
const stockType = require('./stock');

const holdingType = new GraphQLObjectType({
  name: 'holding',
  fields: {
    id: { type: GraphQLString },
    owner_id: {
      type: userType,
      // eslint-disable-next-line no-unused-vars
      sqlJoin: (holdingTable, userTable, args) => `${holdingTable}.userId = ${userTable}.id`
    },
    stock: {
      type: stockType,
      // eslint-disable-next-line no-unused-vars
      sqlJoin: (holdingTable, stockTable, args) => `${holdingTable}.stockId = ${stockTable}.id`
    },
    holding: {
      type: GraphQLInt
    }
  }
});

// join-monster additional fields
holdingType._typeConfig = {
  sqlTable: 'tasteds',
  uniqueKey: 'id'
};

module.exports = holdingType;
