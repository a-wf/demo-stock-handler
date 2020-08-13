'use strict';

const { makeExecutableSchema } = require('apollo-server-express');
// const { makeExecutableSchema } = require('graphql-tools');

//https://www.graphql-tools.com/docs/api/modules/schema/#makeexecutableschema
// it can deep merge resolvers.
// And event if apollo-server-express is exporting graphql-tool properties

const typeDefs = require('./design/schema-graphql');
const { account, product, cart } = require('./resolvers'); // not secure to do const resolvers = Object.value(require('./resolvers));
const resolvers = [account, product, cart];

module.exports = makeExecutableSchema({ typeDefs, resolvers });
