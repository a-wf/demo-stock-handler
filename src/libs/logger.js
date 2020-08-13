'use strict';

const Winston = require('winston');
const { common, logger } = require('./../config');

var logLevels = { error: 0, warn: 1, info: 2, debug: 3 };

class Logger {
  /**
   * log file config
   * @typedef {object} File log file configuration
   * @property {string} name log file name
   * @property {string} path log file output path
   * @property {number} maxsize log file maxsize
   * @property {number} maxfiles number max of log files before circular override
   */
  /**
   *  config object
   * @typedef {object} Config
   * @property {string} level logger mode [error, warn, info, debug]
   * @property {File} file log file configuration
   */
  /**
   * logger class constructor
   * @param {Config} config
   */
  constructor(config) {
    this.moduleName = 'Logger';
    if (!config) {
      this.Error(this.moduleName, 'Init', 'No config provided');
      this.Out(this.moduleName, 'Init');
      throw new Error('No config provided');
    }
    this.config = config;

    this.winston = Winston.createLogger({
      exitOnError: true,
      level: config.level,
      levels: logLevels,
      transports: [
        new Winston.transports.Console({
          silent: common.nodeEnv === 'test',
          format: Winston.format.combine(
            Winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            Winston.format.colorize(),
            Winston.format.printf(({ level, message, label, timestamp }) => `${timestamp} ${level} [${label}]: ${message}`)
          )
        }),
        new Winston.transports.File({
          // silent: common.nodeEnv === 'test',
          filename: config.file.path + '/' + config.file.name + '.log',
          maxsize: config.file.maxSize,
          maxFiles: config.file.maxFiles,
          format: Winston.format.combine(
            Winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss'
            }),
            Winston.format.printf(({ level, message, label, timestamp }) => `${timestamp} ${level} [${label}]: ${message}`)
          )
        })
      ]
    });

    if (!this.winston) {
      throw new Error('Failed to init Logger');
    }
  }

  /**
   *  generic method for log
   * @param {string} level log mode
   * @param {string} module module name or classe name where log is
   * @param {string} function_name  function name where log is
   * @param {string} message log message
   */
  Log(level, module, function_name, message) {
    /* module is null if no arguments have been passed or if null was explicitly passed to module */
    if (!module) {
      this.winston.error('[' + this.moduleName + '] Failed to add log, no module provided');
    } else {
      var moduleName = module + (function_name ? ':' + function_name : '');
      message = message || '';
      this.winston.log({ level, label: moduleName, message });
    }
  }

  /**
   * Error log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} function_name  function name where log is
   * @param {string} message log message
   */
  Error(module, function_name, message) {
    this.Log('error', module, function_name, message);
  }

  /**
   * Warn log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} function_name  function name where log is
   * @param {string} message log message
   */
  Warn(module, function_name, message) {
    this.Log('warn', module, function_name, message);
  }

  /**
   * Info log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} function_name  function name where log is
   * @param {string} message log message
   */
  Info(module, function_name, message) {
    this.Log('info', module, function_name, message);
  }

  /**
   * Debug log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} function_name  function name where log is
   * @param {string} message log message
   */
  Debug(module, function_name, message) {
    this.Log('debug', module, function_name, message);
  }

  /**
   * Print log medthod - in info mode, only print info_msg, in debug mode, info_msg and debug_msg both are printed in one line
   * @param {string} module module name or classe name where log is
   * @param {string} function_name  function name where log is
   * @param {string} message log message
   */
  Print(module, function_name, info_msg, debug_extra) {
    switch (this.config.level) {
      case 'info':
      case 'Info':
      case 'INFO':
        this.Log('info', module, function_name, info_msg);
        break;

      case 'debug':
      case 'Debug':
      case 'DEBUG':
      case 'trace':
      case 'Trace':
      case 'TRACE':
        debug_extra = debug_extra && debug_extra !== '' ? `, ${debug_extra}` : '';

        this.Log('debug', module, function_name, `${info_msg}${debug_extra}`);
        break;
      default:
    }
  }
}

module.exports = {
  Logger: Logger,
  logger: new Logger(logger)
};
