'use strict';

const { RateLimiterPostgres, RateLimiterMongo } = require('rate-limiter-flexible');

/**
 *
 * @typedef {object} Opts
 * @property {number} points number of requests in a specific duration
 * @property {number} duration the specific duration in seconds
 * @property {string} keyPrefix the  db table prefix
 * @property {databaseClient} storeClient the database client
 * @property {string} storeType value 'knex' for determine database type
 */
/**
 * create a rate limiter using prosgresql db
 * @param {Opts} opts
 */
module.exports.createRateLimiterPostgres = async (opts) => {
  return new Promise((resolve, reject) => {
    let rateLimiter;
    const ready = (err) => {
      if (err) {
        reject(err);
      } else {
        resolve(rateLimiter);
      }
    };
    rateLimiter = new RateLimiterPostgres(opts, ready);
  });
};

/**
 *
 * @typedef {object} OptsMongo
 * @property {number} points number of requests in a specific duration
 * @property {number} duration the specific duration in seconds
 * @property {string} keyPrefix the  db table prefix
 * @property {databaseClient} storeClient the database client
 */
/**
 * create a rate limiter using mongo db
 * @param {OptsMongo} opts
 */
module.exports.createRateLimiterMongo = (opts) => {
  return new RateLimiterMongo(opts);
};
