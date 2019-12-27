import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
import BuildAsset from './BuildAsset';
export default class BuildContext {
  public collections: { [key: string]: BuildAsset[] } = {};
  constructor(public options: IPageAssembleOptions, public assets: BuildAsset[]) {}
}
