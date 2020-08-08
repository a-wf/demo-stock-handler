'use strict';
const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/.env` });

import config from './config';
import Logger from './libs/logger';

import graphqlSchema from './api/graphql-schema';
import { graphqlHTTP } from 'express-graphql';

import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as express from 'express';
import * as promBundle from 'express-prom-bundle';
import * as createRateLimiter from './libs/rate-limiter';
import { rateLimiterMiddleware, logsMiddleware, errorHandler } from './middlewares';
import db from './database';

if (!config) {
  throw new Error('No config provided');
}

if (config.monitor.enable) {
  const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
  app.use(metricsMiddleware);
}

const app = express();
const logger = new Logger(config.logger);
const rateLimiterConfig = {
  keyPrefix: 'rateLimiterMiddleware',
  storeClient: db,
  storeType: `knex`, // knex requires this option
  ...config.rateLimit
};

app.use(logsMiddleware(logger));
app.use(rateLimiterMiddleware(createRateLimiter(rateLimiterConfig)));

app.use(
  '/api',
  graphqlHTTP({
    schema: graphqlSchema,
    graphiql: true
  })
);

app.use(errorHandler);

if (config.server.protocol === 'https') {
  const privateKey = fs.readFileSync(config.server.ssl.key, 'utf8');
  const certificate = fs.readFileSync(config.server.ssl.certificate, 'utf8');

  https
    .createServer(
      {
        key: privateKey,
        cert: certificate
      },
      app
    )
    .listen(config.server.port || 443);

  logger.Info(
    'APP',
    'Init',
    `process PID ${process.pid}: listening on port ${config.server.port || 443} via protocol https`
  );
} else if (config.server.protocol === 'http') {
  http.createServer(app).listen(config.server.port || 80);
  logger.Info(
    'APP',
    'Init',
    `process PID ${process.pid}: listening on port ${config.server.port || 80} via protocol http`
  );
} else {
  throw new Error(`unknown server's protocol`);
}
