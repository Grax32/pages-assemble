import { IBuildModule } from './IBuildModule';

export interface IBuildModuleConstructor {
  new (): IBuildModule;
}
