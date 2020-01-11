import 'reflect-metadata';
import LogLevel from '../models/LogLevel';
import ILogger from '../interfaces/ILogger';
import { IBuildModule, injectIBuildModule } from '../interfaces/IBuildModule';
import { injectable } from 'inversify';

@injectable()
export default class ConsoleLogger implements ILogger {
  constructor(
    private logLevel: LogLevel,    
    @injectIBuildModule private arbitrary: IBuildModule) {}

  private log(level: LogLevel, message: string) {
    if (level >= this.logLevel) {
      console.log(level.toString(), message);
    }
  }

  debug(message: string): void {
    this.log(LogLevel.debug, message);
  }
  information(message: string): void {
    this.log(LogLevel.information, message);
  }
  error(message: string): void {
    this.log(LogLevel.error, message);
  }
  fatal(message: string): void {
    this.log(LogLevel.fatal, message);
  }
  warning(message: string): void {
    this.log(LogLevel.warning, message);
  }
}
