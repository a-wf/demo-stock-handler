import { logger } from './../libs/logger';
import { Request, Response, NextFunction } from 'express';
import { RateLimiterStoreAbstract } from 'rate-limiter-flexible';

/**
 * retae limiter middleware
 * @param {object} rateLimiter the rate limiter create with rate-limiter-flexible module
 * @return {Function} rate limiter middleware, (req: Request, res: Response, next: NextFunction) => {}
 */
function rateLimiterMiddleware(rateLimiter: RateLimiterStoreAbstract): (req: Request, res: Response, next: NextFunction) => Promise<void> {
  return async (req: Request, res: Response, next: NextFunction) => {
    rateLimiter
      .consume(req.ip)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(429).send('Too Many Requests');
      });
  };
}

/**
 * log middleware, to output basic request descritpion
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
function logMiddleware(req: Request, res: Response, next: NextFunction): void {
  if (req.body.operationName !== 'IntrospectionQuery')
    logger.Info(
      'App',
      'api',
      `${req.method} ${req.originalUrl} params=${JSON.stringify(req.params)} query=${JSON.stringify(req.query)} body=${JSON.stringify(req.body)}`
    );
  next();
}

/**
 * auth apiKey middleware, compare apikey value
 * @param {string} apiKeyValue
 * @return {Function} apiKey Middleware, (req: Request, res: Response, next: NextFunction) => {}
 */
function apiKeyMiddleware(apiKeyValue: string): (req: Request, res: Response, next: NextFunction) => void {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!apiKeyValue) {
      next();
    } else {
      const apiKey = req.get('X-API-KEY');
      if (apiKey === apiKeyValue) {
        next();
      } else {
        res.status(401).send('Unauthorized');
      }
    }
  };
}

/**
 * set resquestId in Header of response
 * @param {Error|string} err
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
// eslint-disable-next-line no-unused-vars
function setRequestIdInResponseHeader(req: Request, res: Response, next: NextFunction): void {
  res.set('X-REQUEST-ID', req.get('X-REQUEST-ID'));
  next();
}

/**
 * error handler middleware
 * @param {Error|string} err
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof Error) {
    logger.Error('App', 'errorHandler', `${err.stack}`);
    res.status(500).json({
      data: err.message
    });
  } else {
    logger.Error('App', 'errorHandler', `${err}`); // maybe just log as info message, because it is not server-side bug error
    res.status(400).json({
      data: err
    });
  }
}

export { rateLimiterMiddleware, logMiddleware, apiKeyMiddleware, setRequestIdInResponseHeader, errorHandler };
