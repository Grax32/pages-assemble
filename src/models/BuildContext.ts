import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
import SourceFileContext from './SourceFileContext';

export default class BuildContext {
  public collections: { [key: string]: SourceFileContext[] } = {};
  constructor(public options: IPageAssembleOptions, public assets: SourceFileContext[]) {}
}
