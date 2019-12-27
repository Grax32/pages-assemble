import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from "../models/BuildContext";
import ResultContext from "../models/ResultContext";
export default class StaticSiteModule implements IBuildModule {
    next: (context: BuildContext) => ResultContext;
    invoke(context: BuildContext): ResultContext;
}
