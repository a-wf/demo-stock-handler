'use strict';

const { RateLimiterMemory, RateLimiterMongo } = require('rate-limiter-flexible');
const { common, database } = require('./../config');

/**
 *
 * @typedef {object} Opts
 * @property {number} points number of requests in a specific duration
 * @property {number} duration the specific duration in seconds
 * @property {databaseClient} storeClient the database client
 */
/**
 * create a rate limiter using prosgresql db
 * @param {Opts} opts
 */
module.exports.createRateLimiter = (opts, db) => {
  switch (database[common.nodeEnv].client) {
    case 'mongodb':
      opts.storeClient = db;
      return new RateLimiterMongo(opts);
    case 'postgresql':
    default:
      return new RateLimiterMemory(opts);
  }
};
