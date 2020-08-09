'use strict';

const mongoose = require('mongoose');
const { common, database } = require('./../config');
const { logger } = require('./../libs/logger');
const dbConfig = database[common.nodeEnv].connection;

module.exports = {
  ...require('./models')
};

if (common.nodeEnv !== 'test') {
  let mongo_url = 'mongodb://';

  if (dbConfig.user) {
    mongo_url = mongo_url + encodeURIComponent(dbConfig.user);
    if (dbConfig.password) {
      mongo_url = mongo_url + ':' + encodeURIComponent(dbConfig.password);
    }
    mongo_url = mongo_url + '@';
  }
  mongo_url = `${mongo_url}${dbConfig.host}/${dbConfig.database}`;
  logger.Info('Database', 'Init', `${mongo_url}`);

  mongoose.connect(mongo_url, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  const client = mongoose.connection;

  client.on('connected', () => {
    logger.Info(
      'Database',
      'connect',
      `Mongoose connection is opened at url: ${mongo_url.includes('@') ? 'mongodb://' + mongo_url.split('@')[1] : mongo_url}`
    );
  });

  client.on('error', (err) => {
    logger.Error('Database', 'connect', `Failed to connect to the database , errormsg=${err.message}`);
  });

  client.on('disconnected', () => {
    logger.Info('Database', 'connect', 'Mongoose connection is disconnected');
  });
  module.exports.client = client;
}
