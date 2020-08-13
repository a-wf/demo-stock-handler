'use strict';

const config = require('./config');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');
const promBundle = require('express-prom-bundle');

const GraphqlAPI = require('./api-graphql');
const RestAPI = require('./api-rest');

const { logger } = require('./libs/logger');
const db = require('./database');

const { createRateLimiter } = require('./libs/rate-limiter');
const { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, setRequestIdInResponseHeader } = require('./middlewares');

const app = express();

app.use(cors());
app.use(bodyParser.json());

if (config.monitor.enable) {
  const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
  app.use(metricsMiddleware);
  logger.Info('App', 'Init', `API metrics can be found on: ${config.server.protocol}://{address}:${config.monitor.port}/metrics`);
}
app.use(setRequestIdInResponseHeader);
app.use(logMiddleware);
app.use(
  rateLimiterMiddleware(
    createRateLimiter(
      {
        keyPrefix: 'rateLimiterMiddleware',
        ...config.rateLimit
      },
      db.client
    )
  )
);

app.use(apiKeyMiddleware(config.server.apikey));

if (config.server.apiType === 'rest') {
  new RestAPI(app);
} else if (config.server.apiType === 'graphql') {
  new GraphqlAPI(app);
}

module.exports = app;
