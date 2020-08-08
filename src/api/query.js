'use stric';

const graphql = require('graphql');
const { GraphQLObjectType, GraphQLList, GraphQLInt } = graphql;
const joinMonster = require('join-monster');

const types = require('./types');
const db = require('./../db');

export default new GraphQLObjectType({
  name: 'Query',
  fields: {
    user: {
      type: types.userType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args, context, resolveInfo) => {
        return joinMonster.default(resolveInfo, {}, (sql) => {
          return db.raw(sql);
        });
      }
    }
  },
  stock: {
    type: new GraphQLList(types.stock),
    args: {
      id: { type: GraphQLInt }
    },
    resolve: (parent, args, context, resolveInfo) => {
      return joinMonster.default(resolveInfo, {}, (sql) => {
        return db.raw(sql);
      });
    }
  },
  stocks: {
    type: new GraphQLList(types.stocks),
    resolve: (parent, args, context, resolveInfo) => {
      return joinMonster.default(resolveInfo, {}, (sql) => {
        return db.raw(sql);
      });
    }
  }
});
