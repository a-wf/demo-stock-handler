'use strict';

const Joi = require('@hapi/joi');
const path = require('path');

const envVarsSchema = Joi.object({
  DATABASE_TYPE: Joi.string().valid('mongodb', 'postgresql').default('postgresql'),
  DATABASE_HOST: Joi.string().default('localhost'),
  DATABASE_USERNAME: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string().default('postgres'),
  DATABASE_NAME: Joi.string().default('products_depot_db'),
  DATABASE_POOL_MIN: Joi.number().default(2),
  DATABASE_POOL_MAX: Joi.number().default(10),
  DATABASE_MIGRATIONS_PATH: Joi.string().default(path.join(__dirname, './../database/postgresql/migrations')),
  DATABASE_SEEDS_PATH: Joi.string().default(path.join(__dirname, './../database/postgresql/seeds'))
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  client: envVars.DATABASE_TYPE,
  connection: {
    host: envVars.DATABASE_HOST,
    user: envVars.DATABASE_USERNAME,
    password: envVars.DATABASE_PASSWORD,
    database: envVars.DATABASE_NAME
  },
  pool: {
    min: envVars.DATABASE_POOL_MIN,
    max: envVars.DATABASE_POOL_MAX
  },
  migrations: envVars.DATABASE_MIGRATIONS_PATH
    ? {
        directory: envVars.DATABASE_MIGRATIONS_PATH
      }
    : undefined,
  seeds: envVars.DATABASE_SEEDS_PATH
    ? {
        directory: envVars.DATABASE_SEEDS_PATH
      }
    : undefined
};

module.exports = {
  development: {
    ...config
  },
  staging: {
    ...config
  },
  test: {
    ...config
  },
  production: {
    ...config
  }
};
