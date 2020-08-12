'use strict';

const config = require('./../config');

let database;

switch (config.database[config.common.nodeEnv].client) {
  case 'mongodb':
    database = require('./mongodb');
    break;
  case 'postgresql':
  default:
    database = require('./postgresql/knexfile');
}

module.exports = database;
