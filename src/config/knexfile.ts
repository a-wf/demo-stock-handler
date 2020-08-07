'use strict';

import path from 'path';
import Joi from '@hapi/joi';

const envVarsSchema = Joi.object({
  DATABASE_TYPE: Joi.string().default('pg'),
  DATABSE_HOST: Joi.string().default('localhost'),
  DATABASE_USERNAME: Joi.string().default('postgres'),
  DATABASE_PASSWORD: Joi.string(),
  DATABASE_NAME: Joi.string(),
  DATABASE_POOL_MIN: Joi.number().default(2),
  DATABASE_POOL_MAX: Joi.number().default(10),
  DATABASE_MIGRATIONS_PATH: Joi.string().default(path.join(__dirname, './../db/migrations')),
  DATABASE_SEEDS_PATH: Joi.string()
})
  .unknown()
  .required();

const { error, value: envVars } = envVarsSchema.validate(process.env);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

export default {
  development: {
    client: envVars.DATABASE_TYPE,
    connection: {
      host: envVars.DATABSE_HOST,
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
  },
  staging: {
    client: envVars.DATABASE_TYPE,
    connection: {
      host: envVars.DATABSE_HOST,
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
  },
  production: {
    client: envVars.DATABASE_TYPE,
    connection: {
      host: envVars.DATABSE_HOST,
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
  }
};

// import path from 'path';

// export default {
//   development: {
//     client: 'postgresql',
//     connection: {
//       host: 'localhost',
//       database: 'enjoy_ur_meal',
//       user: 'postgres',
//       password: undefined
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: path.join(__dirname, '/db/migrations')
//     }
//   },

//   staging: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user: 'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: 'knex_migrations'
//     }
//   },

//   production: {
//     client: 'postgresql',
//     connection: {
//       database: 'my_db',
//       user: 'username',
//       password: 'password'
//     },
//     pool: {
//       min: 2,
//       max: 10
//     },
//     migrations: {
//       directory: 'knex_migrations'
//     }
//   }
// };
