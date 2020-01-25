import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import { IBuildModule } from '../interfaces/IBuildModule';
import ILogger from '../interfaces/ILogger';

export default abstract class BaseModule implements IBuildModule {
  constructor(public logger: ILogger) {}
  public next!: (context: BuildContext) => Promise<ResultContext>;
  public abstract invoke(context: BuildContext): Promise<ResultContext>;

  public log(message: string, ...args: any[]) {
    if (args) {
      const messageArgs: string[] = [];
      for (const arg of args) {
        if (typeof arg === 'object' || Array.isArray(arg)) {
          messageArgs.push(JSON.stringify(arg, null, 2));
        } else {
          messageArgs.push(arg);
        }
      }

      message += ' ' + messageArgs.join(' ');
    }
    this.logger.information(message);
  }
}
