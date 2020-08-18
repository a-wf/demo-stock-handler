import fs from 'fs';
import path from 'path';

import yamljs from 'yamljs';
import swaggerUi, { JsonObject } from 'swagger-ui-express';
import { OpenApiValidator } from 'express-openapi-validator';
import { Express } from 'express';

import config from './../config';
import { logger } from './../libs/logger';
import { errorHandler } from '../middlewares';
import controllers from './controllers';

class RestAPI {
  /**
   *  RestAPI constructor
   * @param {expressApp} app
   */
  constructor(app: Express) {
    const apiDesign = '/design/openapi.yml';

    if (config.common.nodeEnv === 'development') {
      const swaggerDocument: JsonObject = yamljs.load(path.join(__dirname, apiDesign));
      app.use('/rest-api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
      logger.Debug('RestAPI', 'Init', `OpenApi doc is provided on ${config.server.protocol}://{address}:${config.server.port}/rest-api-doc`);
    }

    new OpenApiValidator({
      apiSpec: path.join(__dirname, apiDesign),
      validateRequests: true, // (default)
      validateResponses: true // false by default
    })
      .install(app)
      .then(() => {
        app.use(errorHandler);
        app.use(controllers());
      })
      .catch(error => {
        throw error;
      });
  }
}

export default RestAPI;
