import { makeExecutableSchema } from 'apollo-server-express';

// https://www.graphql-tools.com/docs/api/modules/schema/#makeexecutableschema
// it can deep merge resolvers.
// And event if apollo-server-express is exporting graphql-tool properties

import typeDefs from './design/schema-graphql';
import { account, product, cart } from './resolvers';
const resolvers = [account, product, cart];

module.exports = makeExecutableSchema({ typeDefs, resolvers });
