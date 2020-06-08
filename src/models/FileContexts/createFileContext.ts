import DataSourceFileContext from './DataSourceFileContext';
import HtmlSourceFileContext from './HtmlSourceFileContext';
import JavascriptSourceFileContext from './JavascriptSourceFileContext';
import RazerSourceFileContext from './RazerSourceFileContext';
import StyleSheetSourceFileContext from './StyleSheetSourceFileContext';
import MarkdownSourceFileContext from './MarkdownSourceFileContext';
import BinarySourceFileContext from './BinarySourceFileContext';
import SourceFileContext from './SourceFileContext';

export function createFileContext(path: string): SourceFileContext {
  return (
    DataSourceFileContext.maybeCreateInstance(path) ||
    HtmlSourceFileContext.maybeCreateInstance(path) ||
    JavascriptSourceFileContext.maybeCreateInstance(path) ||
    MarkdownSourceFileContext.maybeCreateInstance(path) ||
    RazerSourceFileContext.maybeCreateInstance(path) ||
    StyleSheetSourceFileContext.maybeCreateInstance(path) ||
    BinarySourceFileContext.createInstance(path)
  );
}
