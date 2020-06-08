import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class RazerSourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === RazerSourceFileContext.name || super.isType(typeName);
  }

  public static maybeCreateInstance(filePath: string): RazerSourceFileContext | null {
    return path.extname(filePath) === '.vash' ? new RazerSourceFileContext(filePath) : null;
  }
}
