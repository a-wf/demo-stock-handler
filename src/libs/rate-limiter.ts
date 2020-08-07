import { RateLimiterPostgres, IRateLimiterStoreOptions } from 'rate-limiter-flexible';

export default async (opts: IRateLimiterStoreOptions) => {
  return new Promise((resolve, reject) => {
    let rateLimiter;
    const ready = (err: Error) => {
      if (err) {
        reject(err);
      } else {
        resolve(rateLimiter);
      }
    };

    rateLimiter = new RateLimiterPostgres(opts, ready);
  });
};
