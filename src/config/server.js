'use strict';

const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object({
  API_TYPE: Joi.string().valid('rest', 'graphql').default('graphql'),
  API_PROTOCOL: Joi.string().valid('http', 'https').default('http'),
  API_PORT: Joi.number().default(8080),
  API_ADMIN_LOGIN: Joi.string().default('admin'),
  API_ADMIN_PASSWORD: Joi.string().default('admin'),
  API_APIKEY_VALUE: Joi.string(),
  API_SSL_KEY: Joi.string(),
  API_SSL_CERT: Joi.string()
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  apiType: envVars.API_TYPE,
  protocol: envVars.API_PROTOCOL,
  port: envVars.API_PORT,
  basicAuth: {
    [`${envVars.API_ADMIN_LOGIN}`]: envVars.API_ADMIN_PASSWORD
  },
  apikey: envVars.API_APIKEY_VALUE,
  ssl: {
    key: envVars.API_SSL_KEY,
    cert: envVars.API_SSL_CERT
  }
};
