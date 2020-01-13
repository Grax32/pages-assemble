import LogLevel from '../models/LogLevel';
import ILogger from '../interfaces/ILogger';

export default class ConsoleLogger implements ILogger {
  constructor(
    private logLevel: LogLevel) {}

  private log(level: LogLevel, message: string, ...args: any) {
    if (level >= this.logLevel) {
      console.log(message, ...args);
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
