'use strict';

const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object({
  LOG_LEVEL: Joi.string().valid('info', 'debug', 'error', 'warning').default('debug'),
  LOG_FILE: Joi.string().default(`service`),
  LOG_PATH: Joi.string().default(`./logs`),
  LOG_FILE_MAXSIZE: Joi.number().default(1024000),
  LOG_MAXFILES: Joi.number().default(7)
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  level: envVars.LOG_LEVEL,
  file: envVars.LOG_FILE
    ? {
        name: envVars.LOG_FILE,
        path: envVars.LOG_PATH,
        maxsize: envVars.LOG_FILE_MAXSIZE,
        maxfiles: envVars.LOG_MAXFILES
      }
    : undefined
};
