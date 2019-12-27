import IPageAssembleOptions from "../interfaces/IPageAssembleOptions";
import BuildAsset from "./BuildAsset";
export default class BuildContext {
  constructor(public options: IPageAssembleOptions, public assets: BuildAsset[]) { }
}
