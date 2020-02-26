import * as path from 'path';
import { AssetGroup, getCategoryFolder } from '../utility/SysUtilities';
import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
import SourceFileContext from './SourceFileContext';

export default class BuildContext {
  public collections: { [key: string]: SourceFileContext[] } = {};
  public dataStore: { [key: string]: any } = {};
  private readonly includesFolder = getCategoryFolder(AssetGroup.includes);

  constructor(public options: IPageAssembleOptions, public assets: SourceFileContext[]) {}

  public getInclude(name: string, pathContext?: string) {
    const pathStartsWith = ['', this.includesFolder, pathContext || ''].join('/');

    const files = this.assets
      .filter(asset => asset.path.startsWith(pathStartsWith))
      .filter(asset => path.basename(asset.path).startsWith(name + '.'));

    if (files.length > 1) {
      console.log(files.map(v => v.path));
      throw Error('Multiple files match include name of ' + name);
    }

    console.log(JSON.stringify(files[0],null,2));

    return files[0];
  }
}
