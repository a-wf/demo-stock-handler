'use strict';

const { logger } = require('./../libs/logger');
const basicAuthCheck = require('./../libs/basic-auth');

/**
 * retae limiter middleware
 * @param {object} rateLimiter the rate limiter create with rate-limiter-flexible module
 * @return {Function} rate limiter middleware, (req, res, next) => {}
 */
function rateLimiterMiddleware(rateLimiter) {
  return (req, res, next) => {
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
function logMiddleware(req, res, next) {
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
 * @return {Function} apiKey Middleware, (req, res, next) => {}
 */
function apiKeyMiddleware(apiKeyValue) {
  return (req, res, next) => {
    if (!apiKeyValue) next();
    const apiKey = req.header('X-API-KEY');
    if (apiKey === apiKeyValue) {
      next();
    } else {
      res.status(401).send('Unauthorized');
    }
  };
}

// /**
//  * basic authentication middleware
//  * @param {object} req
//  * @param {object} res
//  * @param {Function} next
//  */
// function basicAuth(req, res, next) {
//  Finally not implemented because express-baisc-auth is more efficient
// }

/**
 * error handler middleware
 * @param {Error|string} err
 * @param {object} req
 * @param {object} res
 * @param {Function} next
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const requestId = { 'request-id': req.header('X-REQUEST-ID') };
  if (err instanceof Error) {
    logger.Error('App', 'errorHandler', `${err.stack}`);
    res.status(err.status || 500).json({
      data: err.message,
      ...requestId
    });
  } else {
    logger.Error('App', 'errorHandler', `${err}`); // maybe just log as info message, because it is not server-side bug error
    res.status(400).json({
      data: err,
      ...requestId
    });
  }
}

module.exports = {
  rateLimiterMiddleware,
  logMiddleware,
  apiKeyMiddleware,
  errorHandler
};
