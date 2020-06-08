import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class StyleSheetSourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === StyleSheetSourceFileContext.name || super.isType(typeName);
  }

  public static maybeCreateInstance(filePath: string): StyleSheetSourceFileContext | null {
    return path.extname(filePath) === '.css' ? new StyleSheetSourceFileContext(filePath) : null;
  }
}
