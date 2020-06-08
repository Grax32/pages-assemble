import FileContext from './FileContext';

export default class SourceFileContext extends FileContext {
  constructor(public path: string) {
    super();
  }

  public isType(typeName: string) {
    return typeName === SourceFileContext.name || super.isType(typeName);
  }
}
