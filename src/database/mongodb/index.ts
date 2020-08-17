import mongoose from 'mongoose';
import { common, database } from '../../config';
import { logger } from '../../libs/logger';

import { accounts, products, carts } from './models';

const dbConfig = database[common.nodeEnv].connection;
let client: mongoose.Connection;

if (common.nodeEnv !== 'test') {
  let mongoUrl = 'mongodb://';

  if (dbConfig.user) {
    mongoUrl = mongoUrl + encodeURIComponent(dbConfig.user);
    if (dbConfig.password) {
      mongoUrl = mongoUrl + ':' + encodeURIComponent(dbConfig.password);
    }
    mongoUrl = mongoUrl + '@';
  }
  mongoUrl = `${mongoUrl}${dbConfig.host}/${dbConfig.database}`;
  logger.Info('Database', 'Init', `${mongoUrl}`);

  mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

  client = mongoose.connection;

  client.on('connected', () => {
    logger.Info(
      'Database',
      'connect',
      `Mongoose connection is opened at url: ${mongoUrl.includes('@') ? 'mongodb://' + mongoUrl.split('@')[1] : mongoUrl}`
    );
  });

  client.on('error', err => {
    logger.Error('Database', 'connect', `Failed to connect to the database , errormsg=${err.message}`);
  });

  client.on('disconnected', () => {
    logger.Info('Database', 'connect', 'Mongoose connection is disconnected');
  });
}

export default { client, accounts, products, carts };
