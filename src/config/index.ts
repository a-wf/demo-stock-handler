'use strict';

// import common from './common';
import server from './server';
import rateLimit from './rate-limit';
import logger from './logger';
import monitor from './monitor';
import database from './knexfile';

export default { server, database, rateLimit, logger, monitor };
