'use strict';

const config = require('./../config');
const { logger } = require('./../libs/logger');
let database;

switch (config.database[config.common.nodeEnv].client) {
  case 'mongodb':
    logger.Info('Database', 'Init', 'using Mongodb');
    database = require('./mongodb');
    break;
  case 'postgresql':
  default:
    logger.Info('Database', 'Init', 'using PostgresQL');
    database = require('./postgresql');
}

module.exports = database;
