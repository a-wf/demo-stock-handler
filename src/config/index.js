'use strict';
const dotenv = require('dotenv');
const path = process.env.NODE_ENV === 'test' ? `${__dirname}/../../tests/.env.test` : `${__dirname}/../.env`;
dotenv.config({ path });

module.exports = {
  common: require('./common'),
  server: require('./server'),
  rateLimit: require('./rate-limit'),
  logger: require('./logger'),
  monitor: require('./monitor'),
  database: require('./database')
};
