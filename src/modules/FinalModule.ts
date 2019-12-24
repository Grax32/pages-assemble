import { BuildContext } from '../models/buildcontext';
import { IBuildModule } from '../interfaces/IBuildModule';
import { ResultContext } from '../models/resultcontext';

export class FinalModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    console.log('Final Module');
    return {};
  }
}
