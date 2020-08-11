'use strict';

const Joi = require('@hapi/joi');

const envVarsSchema = Joi.object({
  RATE_MAX_COUNTS: Joi.number().default(5),
  RATE_WINDOW_DURATION: Joi.number().default(1) // in seconds
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  points: envVars.RATE_MAX_COUNTS,
  duration: envVars.RATE_WINDOW_DURATION
};
