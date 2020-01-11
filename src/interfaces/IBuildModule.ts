import { inject } from 'inversify';
import '../inversify.types';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';

interface IBuildModule {
  next: (context: BuildContext) => ResultContext;
  invoke: (context: BuildContext) => ResultContext;
}

interface IBuildModuleStatic {
    new(...args: any): IBuildModule;
}

const IBuildModuleSymbol = Symbol('IBuildModule');
const injectIBuildModule = inject(IBuildModuleSymbol);

export { IBuildModule, IBuildModuleStatic, IBuildModuleSymbol, injectIBuildModule };
export default IBuildModule;
