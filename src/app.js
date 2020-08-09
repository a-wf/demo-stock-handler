'use strict';

const config = require('./config');
const fs = require('fs');
const http = require('http');
const https = require('https');
const jsyaml = require('js-yaml');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const promBundle = require('express-prom-bundle');

const OpenApiValidator = require('express-openapi-validator').OpenApiValidator;

const { logger } = require('./libs/logger');
const db = require('./database');
const controllers = require('./controllers');
const { createRateLimiterMongo } = require('./libs/rate-limiter');
const { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, errorHandler } = require('./middlewares');

const app = express();
app.use('*', cors());
app.use(bodyParser.json());

if (config.common.nodeEnv === 'development') {
  var spec = fs.readFileSync(__dirname + '/api/openapi.yml', 'utf8');
  var swaggerDoc = jsyaml.safeLoad(spec);
  app.use('/rest-api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  logger.Debug('App', 'Init', `swagger doc is provided on ${config.server.protocol}://{address}:${config.server.port}/rest-api-doc`);
}

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

let server;
new OpenApiValidator({
  apiSpec: __dirname + '/api/openapi.yml',
  validateRequests: true, // (default)
  validateResponses: true // false by default
})
  .install(app)
  .then(() => {
    app.use(apiKeyMiddleware(config.server.apikey));

    app.use('/', controllers());
    app.use(errorHandler);

    if (config.server.protocol === 'https') {
      var privateKey = fs.readFileSync(config.server.ssl.key, 'utf8');
      var certificate = fs.readFileSync(config.server.ssl.certificate, 'utf8');

      server = https
        .createServer(
          {
            key: privateKey,
            cert: certificate
          },
          app
        )
        .listen(config.server.port || 443);

      logger.Info('App', 'Init', `process PID ${process.pid}: listening on port ${config.server.port || 443} via protocol https`);
    } else if (config.server.protocol === 'http') {
      server = http.createServer(app).listen(config.server.port || 80);
      logger.Info('App', 'Init', `process PID ${process.pid}: listening on port ${config.server.port || 80} via protocol http`);
    } else {
      throw new Error(`unknown server's protocol`);
    }
  })
  .catch((error) => {
    throw error;
  });

module.exports = app;

process
  .on('unhandledRejection', (reason, promise) => {
    if (logger) {
      logger.Error('App', 'unhandledRejection', `${promise}: ${reason}`);
    } else {
      // eslint-disable-next-line no-console
      console.error(reason, 'Unhandled Rejection at Promise', promise);
    }
  })
  .on('uncaughtException', (error) => {
    if (logger) {
      logger.Error('App', 'uncaughtException', error.stack);
    } else {
      // eslint-disable-next-line no-console
      console.error(error.message, 'Uncaught Exception thrown');
    }
  });

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
  process.on(signal, async () => {
    if (logger) {
      logger.Info('App', 'onSIGTERM', `stoping service`);
    } else {
      // eslint-disable-next-line no-console
      console.log('App:', 'onSIGTERM:', `stoping service`);
    }

    await server.close();
    logger.Info('App', 'onSIGTERM', `server is stopped`);
    await db.client.close();
    process.exit(0);
  })
);
