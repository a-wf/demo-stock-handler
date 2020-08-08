import { RateLimiterPostgres } from 'rate-limiter-flexible';

export default async (opts) => {
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
