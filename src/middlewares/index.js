'use strict';

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

function logsMiddleware(logger) {
  return (req, res, next) => {
    logger.info(`${req.method} ${req.baseUrl} query=%o body=%o`, req.query, req.body);
    next();
  };
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message
  });
}

export { rateLimiterMiddleware, logsMiddleware, errorHandler };
