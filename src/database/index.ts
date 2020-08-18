import config from './../config';
import { logger } from './../libs/logger';
import { KnexClient } from 'knex-extended-types';
import mongoose from 'mongoose';

interface DBObject {
  client: KnexClient | mongoose.Connection;
}

let database: DBObject;

switch (config.database[config.common.nodeEnv].client) {
  case 'mongodb':
    logger.Info('Database', 'Init', 'using Mongodb');
    // tslint:disable-next-line: no-var-requires
    database = require('./mongodb');
    break;
  case 'postgresql':
  default:
    logger.Info('Database', 'Init', 'using PostgresQL');
    // tslint:disable-next-line: no-var-requires
    database = require('./postgresql');
}

export default database;
