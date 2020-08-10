'use strict';

const config = require('./config');

const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const promBundle = require('express-prom-bundle');

const { logger } = require('./libs/logger');
const db = require('./database');

const { createRateLimiterMongo } = require('./libs/rate-limiter');
const { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, errorHandler } = require('./middlewares');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const rateLimiterConfig = {
  keyPrefix: 'rateLimiterMiddleware',
  storeClient: db.client,
  // storeType: `knex`, // knex =requires this option
  ...config.rateLimit
};

if (config.monitor.enable) {
  const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
  app.use(metricsMiddleware);
  logger.Info('App', 'Init', `API metrics can be found on: ${config.server.protocol}://{address}:${config.monitor.port}/metrics`);
}
app.use(logMiddleware);
app.use(rateLimiterMiddleware(createRateLimiterMongo(rateLimiterConfig)));

app.use(apiKeyMiddleware(config.server.apikey));

if (config.server.apiType === 'rest') {
  const jsyaml = require('js-yaml');
  const swaggerUi = require('swagger-ui-express');
  const { OpenApiValidator } = require('express-openapi-validator');
  const controllers = require('./api-rest/controllers');

  const apiDesign = '/api-rest/design/openapi.yml';

  if (config.common.nodeEnv === 'development') {
    var spec = fs.readFileSync(path.join(__dirname, apiDesign), 'utf8');
    var swaggerDoc = jsyaml.safeLoad(spec);
    app.use('/rest-api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    logger.Debug('App', 'Init', `swagger doc is provided on ${config.server.protocol}://{address}:${config.server.port}/rest-api-doc`);
  }

  new OpenApiValidator({
    apiSpec: path.join(__dirname, apiDesign),
    validateRequests: true, // (default)
    validateResponses: true // false by default
  })
    .install(app)
    .then(() => {
      app.use(controllers());
      app.use(errorHandler);
    })
    .catch((error) => {
      throw error;
    });
} else if (config.server.apiType === 'graphql') {
  const basicAuthCheck = require('./libs/basic-auth');
  const { ApolloServer } = require('apollo-server-express');
  const schema = require('./api-graphql/schema');
  // const typeDefs = require('./api-graphql/design/schema-graphql');

  const enableDoc = config.common.nodeEnv === 'development' ? true : false;
  const apolloConfig = {
    schema,
    context: ({ event }) => ({
      authValidated: basicAuthCheck(event)
    }),
    introspection: enableDoc, //these lines are required to use the gui
    playground: enableDoc //   of playground
  };

  const apollo = new ApolloServer(apolloConfig);
  apollo.applyMiddleware({
    app,
    path: '/graphql'
  });

  app.use(errorHandler);
}

module.exports = app;
