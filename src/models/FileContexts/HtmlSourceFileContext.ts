import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class HtmlSourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === HtmlSourceFileContext.name || super.isType(typeName);
  }

  public static maybeCreateInstance(filePath: string): HtmlSourceFileContext | null {
    return path.extname(filePath) === '.html' ? new HtmlSourceFileContext(filePath) : null;
  }
}
