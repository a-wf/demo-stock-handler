import fs from 'fs';
import http from 'http';
import https from 'https';

import app from './app';
// import db from './database';

import { common, server as serverConfig } from './config';

import { logger } from './libs/logger';

let server: https.Server | http.Server;

if (common.nodeEnv !== 'test') {
  if (serverConfig.protocol === 'https') {
    const privateKey = fs.readFileSync(serverConfig.ssl.key, 'utf8');
    const certificate = fs.readFileSync(serverConfig.ssl.cert, 'utf8');

    server = https
      .createServer(
        {
          key: privateKey,
          cert: certificate
        },
        app
      )
      .listen(serverConfig.port || 443);

    logger.Info('Server', 'Init', `process PID ${process.pid}: listening on port ${serverConfig.port || 443} via protocol https`);
  } else if (serverConfig.protocol === 'http') {
    server = http.createServer(app).listen(serverConfig.port || 80);
    logger.Info('Server', 'Init', `process PID ${process.pid}: listening on port ${serverConfig.port || 80} via protocol http`);
  } else {
    throw new Error(`unknown server's protocol`);
  }
}

process
  .on('unhandledRejection', (reason: Error, promise: Promise<any>) => {
    if (logger) {
      logger.Error('Process', 'unhandledRejection', `${promise}: ${reason.stack}`);
    } else {
      // eslint-disable-next-line no-console
      // tslint:disable-next-line: no-console
      console.error(reason, 'Unhandled Rejection at Promise', promise);
    }
  })
  .on('uncaughtException', (error: Error) => {
    if (logger) {
      logger.Error('Process', 'uncaughtException', error.stack);
    } else {
      // eslint-disable-next-line no-console
      // tslint:disable-next-line: no-console
      console.error(error.message, 'Uncaught Exception thrown');
    }
  });

['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal: string) =>
  process.on(signal, async () => {
    if (logger) {
      logger.Info('Process', 'onSIGTERM', `stoping service`);
    } else {
      // eslint-disable-next-line no-console
      // tslint:disable-next-line: no-console
      console.log('Process:', 'onSIGTERM:', `stoping service`);
    }

    if (server) await server.close();
    logger.Info('Process', 'onSIGTERM', `server is stopped`);
    // if (db) await db.client.close();
    process.exit(0);
  })
);
