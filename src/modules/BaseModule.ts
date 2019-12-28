import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import IBuildModule from '../interfaces/IBuildModule';

export default abstract class BaseModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;
  public abstract invoke(context: BuildContext): ResultContext;

  public log(context: BuildContext, message: string) {
    if (context.options.verbose) {
      console.log(message);
    }
  }
}
