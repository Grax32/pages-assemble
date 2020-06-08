import SourceFileContext from './SourceFileContext';
import * as path from 'path';

export default class MarkdownSourceFileContext extends SourceFileContext {
  constructor(public path: string) {
    super(path);
  }

  public isType(typeName: string) {
    return typeName === MarkdownSourceFileContext.name || super.isType(typeName);
  }

  public static maybeCreateInstance(filePath: string): MarkdownSourceFileContext | null {
    return path.extname(filePath) === '.md' ? new MarkdownSourceFileContext(filePath) : null;
  }
}
