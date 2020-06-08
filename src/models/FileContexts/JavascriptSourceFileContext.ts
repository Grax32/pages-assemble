import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class JavascriptSourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === JavascriptSourceFileContext.name || super.isType(typeName);
  }

  public static maybeCreateInstance(filePath: string): JavascriptSourceFileContext | null {
    return path.extname(filePath) === '.js' ? new JavascriptSourceFileContext(filePath) : null;
  }
}
