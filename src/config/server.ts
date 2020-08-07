'use strict';

import Joi from '@hapi/joi';

const envVarsSchema = Joi.object({
  EYMEAL_BACKEND_PROTOCOL: Joi.string().valid('http', 'https').default('http'),
  EYMEAL_BACKEND_PORT: Joi.number().default(8080),
  EYMEAL_SSL_KEY: Joi.string(),
  EYMEAL_SSL_CERT: Joi.string()
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  protocol: envVars.EYMEAL_BACKEND_PROTOCOL,
  port: envVars.EYMEAL_BACKEND_PORT,
  ssl: {
    key: envVars.EYMEAL_SSL_KEY,
    cert: envVars.EYMEAL_SSL_CERT
  }
};
