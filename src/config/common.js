'use strict';

const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().valid('development', 'production', 'staging', 'test').default('development')
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  nodeEnv: envVars.NODE_ENV
};
