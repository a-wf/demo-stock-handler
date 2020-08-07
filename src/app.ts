'use strict';
import * as dotenv from 'dotenv';

dotenv.config();
let path;
switch (process.env.NODE_ENV) {
  case 'test':
    path = `${__dirname}/.env.test`;
    break;
  case 'production':
    path = `${__dirname}/.env.production`;
    break;
  default:
    path = `${__dirname}/.env.development`;
}
dotenv.config({ path: path });

import config from './config';
import Logger from './libs/logger';
// import graphqlSchema from './api/graphql-schema';
import promBundle from 'express-prom-bundle';
import express from 'express';
// import { graphqlHTTP } from 'express-graphql';
// import https from 'https';
// import http from 'http';
// import fs from 'fs';

if (!config) {
  throw new Error('No config provided');
}
const logger = new Logger(config.logger);

const app = express();

if (config.monitor.enable) {
  const metricsMiddleware = promBundle({ includeMethod: true, includePath: true });
  app.use(metricsMiddleware);
}

// // app.use('/v1/', controllers(logger))

// app.use(
//   '/api',
//   graphqlHTTP({
//     schema: graphqlSchema,
//     graphiql: true
//   })
// );

// // app.use((err, req, res, next) => {
// //     res.status(err.status || 500).json({
// //         message: err.message,
// //         errors: err.errors,
// //     })
// // })

// if (config.server.protocol === 'https') {
//   const privateKey = fs.readFileSync(config.server.ssl.key, 'utf8');
//   const certificate = fs.readFileSync(config.server.ssl.certificate, 'utf8');

//   https
//     .createServer(
//       {
//         key: privateKey,
//         cert: certificate
//       },
//       app
//     )
//     .listen(config.server.port || 443);

//   logger.Info(
//     'APP',
//     'Init',
//     `process PID ${process.pid}: listening on port ${config.server.port || 443} via protocol https`
//   );
// } else if (config.server.protocol === 'http') {
//   http.createServer(app).listen(config.server.port || 80);
//   logger.Info(
//     'APP',
//     'Init',
//     `process PID ${process.pid}: listening on port ${config.server.port || 80} via protocol http`
//   );
// } else {
//   throw new Error(`unknown server\'s protocol`);
// }

// module.exports = app;
