import { RateLimiterMemory, RateLimiterMongo, RateLimiterStoreAbstract, IRateLimiterMongoOptions } from 'rate-limiter-flexible';

import { common, database } from './../config';
import * as KnexClient from 'knex';
import { Connection as MongooseClient } from 'mongoose';
import { RateLimiterConfig } from 'config';

interface RateLimiterOpts extends RateLimiterConfig {
  keyPrefix: string;
}

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
function createRateLimiter(opts: RateLimiterOpts, db: KnexClient<any, unknown[]> | MongooseClient): RateLimiterStoreAbstract {
  switch (database[common.nodeEnv].client) {
    case 'mongodb':
      const rateLimiterMongoOpts: IRateLimiterMongoOptions = Object.assign({}, opts, { storeClient: db });
      return new RateLimiterMongo(rateLimiterMongoOpts);
    case 'postgresql':
    default:
      return new RateLimiterMemory(opts);
  }
}

export default createRateLimiter;
