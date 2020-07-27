import * as path from 'path';
import { AssetGroup, getCategoryFolder } from '../utility/SysUtilities';
import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
import FileContext from './FileContexts/FileContext';
import SourceFileContext from './FileContexts/SourceFileContext';
import { sortAssets } from '../utility/SortAssetsUtility';

export default class BuildContext {
  public collections: { [key: string]: FileContext[] } = {};
  public dataStore: { [key: string]: any } = {};
  private readonly includesFolder = getCategoryFolder(AssetGroup.includes);

  constructor(public options: IPageAssembleOptions, public assets: FileContext[]) {}

  public addNewAsset(asset: FileContext) {
    this.assets.push(asset);
  }

  public getCollection(name: string, ...collectionsToSubtract: string[]) {
    if (!this.collections[name]) {
      this.collections[name] = [];
    }

    const collection = this.collections[name];
    return this.subtractCollection(collection, collectionsToSubtract);
  }

  private subtractCollection(collection: FileContext[], collectionsToSubtract: string[]) {
    for (const collectionName of collectionsToSubtract) {
      const collectionToSubtract = this.getCollection(collectionName);
      collection = collection.filter(c => !collectionToSubtract.includes(c));
    }

    return collection;
  }

  public getArchiveCollection() {
    const pageTagPrefix = 'page:';
    const neverArchiveTagName = 'never-archive';

    function filterByTags(tags: string[] | undefined | null) {
      if (!tags) return true;

      const hasTag = (tag: string) => tags.includes(tag);

      if (hasTag(neverArchiveTagName)) return false;
      if (tags.find(tag => tag.startsWith(pageTagPrefix))) return false;

      return true;      
    }

    const archive = this.assets
      .filter(asset => asset.frontMatter.title)
      .filter(asset => asset.frontMatter.layout === 'pages') // find a better way to filter out redirects/etc
      .filter(asset => !asset.outputRoute.startsWith('/tag/'))
      .filter(asset => filterByTags(asset.frontMatter.tags))
      .filter(asset => filterByTags(asset.frontMatter.systemTags));

    sortAssets(archive);
    return archive;
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
