import * as path from 'path';
import { AssetGroup, getCategoryFolder } from '../utility/SysUtilities';
import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
import FileContext from './FileContexts/FileContext';
import { SourceFileContext } from '.';

export default class BuildContext {
  public collections: { [key: string]: FileContext[] } = {};
  public dataStore: { [key: string]: any } = {};
  private readonly includesFolder = getCategoryFolder(AssetGroup.includes);

  constructor(public options: IPageAssembleOptions, public assets: FileContext[]) {}

  public addNewAsset(asset: FileContext) {
    this.assets.push(asset);
  }

  public getInclude(name: string, pathContext?: string) {
    const assets = <SourceFileContext[]>this.assets.filter(asset => asset.isType(SourceFileContext.name));

    const pathStartsWith = ['', this.includesFolder, pathContext || ''].join('/');

    const files = assets
      .filter(asset => asset.path.startsWith(pathStartsWith))
      .filter(asset => path.basename(asset.path).startsWith(name + '.'));

    if (files.length > 1) {
      console.log(files.map(v => v.path));
      throw Error('Multiple files match include name of ' + name);
    }

    return files[0];
  }
}
