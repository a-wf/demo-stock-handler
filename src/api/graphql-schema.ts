'use strict';

import { GraphQLSchema } from 'graphql';
import queryRoot from './query';

// const mutationRoot = require('./mutation')
const schema = new GraphQLSchema({
  query: queryRoot
});

export default schema;
