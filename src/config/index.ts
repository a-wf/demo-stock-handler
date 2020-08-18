import dotenv from 'dotenv';
const dotEnvPath = process.env.NODE_ENV === 'test' ? `${__dirname}/../../tests/.env.test` : `${__dirname}/../.env`;
dotenv.config({ path: dotEnvPath });

import { common } from './common';
import { server } from './server';
import { rateLimit } from './rate-limit';
import { logger } from './logger';
import { monitor } from './monitor';
import { database } from './database';

export default { common, server, rateLimit, logger, monitor, database };
export { common, server, rateLimit, logger, monitor, database };
