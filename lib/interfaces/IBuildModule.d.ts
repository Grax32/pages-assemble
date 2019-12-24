import { BuildContext } from '../models/buildcontext';
import { ResultContext } from '../models/resultcontext';
export interface IBuildModule {
    next: (context: BuildContext) => ResultContext;
    invoke: (context: BuildContext) => ResultContext;
}
