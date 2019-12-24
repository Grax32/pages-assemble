import { BuildContext } from '../models/buildcontext';
import { IBuildModule } from '../interfaces/IBuildModule';
import { ResultContext } from '../models/resultcontext';
export declare class FinalModule implements IBuildModule {
    next: (context: BuildContext) => ResultContext;
    invoke(context: BuildContext): ResultContext;
}
