import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class DataSourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === DataSourceFileContext.name || super.isType(typeName);
  }

  public static maybeCreateInstance(filePath: string): DataSourceFileContext | null {
    return path.extname(filePath) === '.json' ? new DataSourceFileContext(filePath) : null;
  }
}
