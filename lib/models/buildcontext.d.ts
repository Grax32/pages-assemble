import IPageAssembleOptions from "../interfaces/IPageAssembleOptions";
import BuildAsset from "./BuildAsset";
export default class BuildContext {
    options: IPageAssembleOptions;
    assets: BuildAsset[];
    constructor(options: IPageAssembleOptions, assets: BuildAsset[]);
}
