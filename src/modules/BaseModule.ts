import { IBuildModule } from '../interfaces/IBuildModule';
import ILogger from '../interfaces/ILogger';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';

export default abstract class BaseModule implements IBuildModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;
  constructor(public logger: ILogger) {}
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
