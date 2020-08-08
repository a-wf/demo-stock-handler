'use strict';

var Winston = require('winston');

var logLevels = { error: 0, warn: 1, info: 2, debug: 3 };

class Logger {
  constructor(config) {
    this.moduleName = 'Logger';
    if (!config) {
      this.Error(this.moduleName, 'Init', 'No config provided');
      this.Out(this.moduleName, 'Init');
      throw new Error('No config provided');
    }

    this.winston = Winston.createLogger({
      exitOnError: true,
      level: config.level,
      levels: logLevels,
      transports: [
        new Winston.transports.Console({
          silent: process.env.NODE_ENV === 'test',
          format: Winston.format.combine(
            Winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            Winston.format.colorize(),
            Winston.format.printf(
              ({ level, message, label, timestamp }) => `${timestamp} ${level} [${label}]: ${message}`,
            ),
          ),
        }),
        new Winston.transports.File({
          silent: process.env.NODE_ENV === 'test',
          filename: config.file.path + '/' + config.file.name + '.log',
          maxsize: config.file.maxSize,
          maxFiles: config.file.maxFiles,
          format: Winston.format.combine(
            Winston.format.timestamp({
              format: 'YYYY-MM-DD HH:mm:ss',
            }),
            config.jsonFormat ? Winston.format.json() : Winston.format.simple(),
          ),
        }),
      ],
    });

    if (!this.winston) {
      throw new Error('Failed to init Logger');
    }
  }

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

  Error(module, function_name, message) {
    this.Log('error', module, function_name, message);
  }
  Warn(module, function_name, message) {
    this.Log('warn', module, function_name, message);
  }
  Info(module, function_name, message) {
    this.Log('info', module, function_name, message);
  }
  Debug(module, function_name, message) {
    this.Log('debug', module, function_name, message);
  }
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

module.exports = Logger;
