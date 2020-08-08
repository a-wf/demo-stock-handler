'use strict';

const graphql = require('graphql');
const { GraphQLObjectType,,GraphQLString, GraphQLInt } = graphql;
const types = require('./types');
const db = require('./../db');

export default new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    user: {
      type: types.userType,
      args: {
        name: { type: graphql.GraphQLNonNull(GraphQLString) },
      },
      resolve: async (parent, args, context, resolveInfo) => {
        try {
          return (
            await db.raw('INSERT INTO users (name) VALUES ($1) RETURNING *', [
              args.name,
            ])
          );
        } catch (err) {
          throw new Error('Failed to insert new user');
        }
      }
    }
  })
});
