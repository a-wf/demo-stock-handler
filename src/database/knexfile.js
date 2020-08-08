const { database, common } = require('../config');

module.exports = database[common.nodeEnv];
