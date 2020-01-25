import { inject } from 'inversify';
import '../inversify.types';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import { ILogger } from '.';

interface IBuildModule {
  next: (context: BuildContext) => Promise<ResultContext>;
  invoke: (context: BuildContext) => Promise<ResultContext>;
}

interface IBuildModuleStatic {
    new(logger: ILogger): IBuildModule;
}

const IBuildModuleSymbol = Symbol('IBuildModule');
const injectIBuildModule = inject(IBuildModuleSymbol);

export { IBuildModule, IBuildModuleStatic, IBuildModuleSymbol, injectIBuildModule };
export default IBuildModule;
