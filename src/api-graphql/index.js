'use strict';
const { ApolloServer } = require('apollo-server-express');

const config = require('./../config');
const { logger } = require('./../libs/logger');
const { createToken, validateToken } = require('../libs/token-auth');

const schema = require('./schema');

class GraphqlAPI {
  /**
   *  GraphqlAPI constructor
   * @param {expressApp} app
   */
  constructor(app) {
    const enableDoc = config.common.nodeEnv === 'development' ? true : false;

    createToken({ username: config.server.adminLogin, password: config.server.adminPassword })
      .then(token => {
        logger.Debug('GraphqlAPI', 'Init', `API admin token: 'Bearer ${token}', to provide in 'Authorization' header`); // log it for dev and test mode
      })
      .catch(error => {
        logger.Error('GraphqlAPI', 'Init', `failed to generate token for API: ${error.stack}`);
      });

    if (enableDoc) logger.Debug('GraphqlAPI', 'Init', `API doc is provided on ${config.server.protocol}://{address}:${config.server.port}/graphql`);

    const apolloConfig = {
      schema,
      context: async ({ req }) => {
        try {
          const tokenWithBearer = req.get('authorization') || '';
          const token = tokenWithBearer.split(' ')[1];
          let authValidated = false;
          if (!token) return { authValidated };
          authValidated = await validateToken({ username: config.server.adminLogin, password: config.server.adminPassword, token });
          return { authValidated };
        } catch (error) {
          return error;
        }
      },
      introspection: enableDoc, // these lines are required to use the gui
      playground: enableDoc // of playground
    };

    const apollo = new ApolloServer(apolloConfig);
    apollo.applyMiddleware({
      app,
      path: '/graphql'
    });
  }
}

module.exports = GraphqlAPI;
