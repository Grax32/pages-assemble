import { IBuildModule } from '../interfaces/IBuildModule';
import { BuildContext } from '../models/buildcontext';
import { ResultContext } from '../models/resultcontext';
export declare class StaticSiteModule implements IBuildModule {
    next: (context: BuildContext) => ResultContext;
    invoke(context: BuildContext): ResultContext;
}
