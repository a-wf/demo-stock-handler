require('ts-node/register');
import { database, common } from '../../config';

module.exports = database[common.nodeEnv];
