
export default interface ILogger {
  debug(message: string, ...args: any): void;
  information(message: string, ...args: any): void;
  error(message: string, ...args: any): void;
  fatal(message: string, ...args: any): void;
  warning(message: string, ...args: any): void;
}
