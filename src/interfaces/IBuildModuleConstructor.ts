import IBuildModule from './IBuildModule';

export default interface IBuildModuleConstructor {
  new (): IBuildModule;
}
