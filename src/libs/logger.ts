import Winston from 'winston';
import { common, logger as logconfig } from './../config';
import { LoggerConfig } from 'config';

const logLevels = { error: 0, warn: 1, info: 2, debug: 3 };

class Logger {
  moduleName: string;
  config: LoggerConfig;
  winston: Winston.Logger;
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
  constructor(config: LoggerConfig) {
    this.moduleName = 'Logger';
    if (!config) {
      this.Error(this.moduleName, 'Init', 'No config provided');
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
   * @param {string} functionName  function name where log is
   * @param {string} message log message
   */
  Log(level: string, module: string, functionName: string, message: string): void {
    /* module is null if no arguments have been passed or if null was explicitly passed to module */
    if (!module) {
      this.winston.error('[' + this.moduleName + '] Failed to add log, no module provided');
    } else {
      const moduleName = module + (functionName ? ':' + functionName : '');
      message = message || '';
      this.winston.log({ level, label: moduleName, message });
    }
  }

  /**
   * Error log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} functionName  function name where log is
   * @param {string} message log message
   */
  Error(module: string, functionName: string, message: string): void {
    this.Log('error', module, functionName, message);
  }

  /**
   * Warn log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} functionName  function name where log is
   * @param {string} message log message
   */
  Warn(module: string, functionName: string, message: string): void {
    this.Log('warn', module, functionName, message);
  }

  /**
   * Info log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} functionName  function name where log is
   * @param {string} message log message
   */
  Info(module: string, functionName: string, message: string): void {
    this.Log('info', module, functionName, message);
  }

  /**
   * Debug log medthod
   * @param {string} module module name or classe name where log is
   * @param {string} functionName  function name where log is
   * @param {string} message log message
   */
  Debug(module: string, functionName: string, message: string): void {
    this.Log('debug', module, functionName, message);
  }

  /**
   * Print log medthod - in info mode, only print infoMsg, in debug mode, infoMsg and debug_msg both are printed in one line
   * @param {string} module module name or classe name where log is
   * @param {string} functionName  function name where log is
   * @param {string} message log message
   */
  Print(module: string, functionName: string, infoMsg: string, debugExtra: string): void {
    switch (this.config.level) {
      case 'info':
      case 'Info':
      case 'INFO':
        this.Log('info', module, functionName, infoMsg);
        break;

      case 'debug':
      case 'Debug':
      case 'DEBUG':
      case 'trace':
      case 'Trace':
      case 'TRACE':
        debugExtra = debugExtra && debugExtra !== '' ? `, ${debugExtra}` : '';

        this.Log('debug', module, functionName, `${infoMsg}${debugExtra}`);
        break;
      default:
    }
  }
}

const logger = new Logger(logconfig);

export default Logger;
export { logger };
