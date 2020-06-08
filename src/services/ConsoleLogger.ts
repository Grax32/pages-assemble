import LogLevel from '../models/LogLevel';
import ILogger from '../interfaces/ILogger';

export default class ConsoleLogger implements ILogger {
  constructor(private logLevel: LogLevel) {}

  private log(level: LogLevel, message: string, ...args: any) {
    if (level >= this.logLevel) {
      const levelDisplay = LogLevel[level];
      const logArgs = ['LOG: ' + levelDisplay, message, ...args];

      switch (level) {
        case LogLevel.debug:
          console.debug(...logArgs);
          break;
        case LogLevel.error:
        case LogLevel.fatal:
          console.error(...logArgs);
          break;
        case LogLevel.information:
          console.info(...logArgs);
          break;
        case LogLevel.warning:
          console.warn(...logArgs);
          break;
        default:
          console.log('Log Level Unknown', ...logArgs);
          break;
      }
    }
  }

  debug(message: string, ...args: any): void {
    this.log(LogLevel.debug, message, ...args);
  }
  information(message: string, ...args: any): void {
    this.log(LogLevel.information, message, ...args);
  }
  error(message: string, ...args: any): void {
    this.log(LogLevel.error, message, ...args);
  }
  fatal(message: string, ...args: any): void {
    this.log(LogLevel.fatal, message, ...args);
  }
  warning(message: string, ...args: any): void {
    this.log(LogLevel.warning, message, ...args);
  }
}
