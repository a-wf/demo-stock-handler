'use strict';

const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object({
  MONITOR_ENABLE: Joi.boolean().default('true'),
  MONITOR_PORT: Joi.number().default(7777)
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  enable: envVars.MONITOR_ENABLE,
  port: envVars.MONITOR_PORT
};
