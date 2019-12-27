import BuildContext from "../models/BuildContext";
import ResultContext from "../models/ResultContext";
export default interface IBuildModule {
    next: (context: BuildContext) => ResultContext;
    invoke: (context: BuildContext) => ResultContext;
}
