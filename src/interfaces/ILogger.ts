export default interface ILogger {
  debug(message: string): void;
  information(message: string): void;
  error(message: string): void;
  fatal(message: string): void;
  warning(message: string): void;
}
