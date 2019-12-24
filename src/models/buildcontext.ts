import { IPageAssembleOptions } from "../interfaces/IPageAssembleOptions";
import { BuildAsset } from '../models/buildasset';

export class BuildContext {
  constructor(public options: IPageAssembleOptions, public assets: BuildAsset[]) {}
}
