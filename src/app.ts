import config from './config';

import cors from 'cors';
import express, { Express } from 'express';
import bodyParser from 'body-parser';
import promBundle from 'express-prom-bundle';

import GraphqlAPI from './api-graphql';
import RestAPI from './api-rest';

import { logger } from './libs/logger';
import database from './database';

import createRateLimiter from './libs/rate-limiter';
import { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, setRequestIdInResponseHeader } from './middlewares';

const app: Express = express();

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
      database.client
    )
  )
);

app.use(apiKeyMiddleware(config.server.apikey));

if (config.server.apiType === 'rest') {
  // tslint:disable-next-line: no-unused-expression
  new RestAPI(app);
} else if (config.server.apiType === 'graphql') {
  // tslint:disable-next-line: no-unused-expression
  new GraphqlAPI(app);
}

export default app;
