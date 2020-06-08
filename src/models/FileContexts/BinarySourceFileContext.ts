import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class BinarySourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === BinarySourceFileContext.name || super.isType(typeName);
  }

  public static createInstance(filePath: string): BinarySourceFileContext {
    return new BinarySourceFileContext(filePath);
  }
}
