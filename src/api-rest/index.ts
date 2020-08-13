import fs from 'fs';
import path from 'path';

import config from './../config';
import { logger } from './../libs/logger';
import jsyaml from 'js-yaml';
import swaggerUi from 'swagger-ui-express';
import { OpenApiValidator } from 'express-openapi-validator';
import { errorHandler } from '../middlewares';
import controllers from './controllers';

class RestAPI {
  /**
   *  RestAPI constructor
   * @param {expressApp} app
   */
  constructor(app) {
    const apiDesign = '/design/openapi.yml';

    if (config.common.nodeEnv === 'development') {
      var spec = fs.readFileSync(path.join(__dirname, apiDesign), 'utf8');
      var swaggerDoc = jsyaml.safeLoad(spec);
      app.use('/rest-api-doc', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
      logger.Debug('RestAPI', 'Init', `OpenApi doc is provided on ${config.server.protocol}://{address}:${config.server.port}/rest-api-doc`);
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
      .catch(error => {
        throw error;
      });
  }
}

module.exports = RestAPI;
