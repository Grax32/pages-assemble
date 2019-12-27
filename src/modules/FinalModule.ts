import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';

export default class FinalModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Final Module');
    }
    return new ResultContext();
  }
}
