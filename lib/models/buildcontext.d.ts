import { IPageAssembleOptions } from "../interfaces/IPageAssembleOptions";
import { BuildAsset } from '../models/buildasset';
export declare class BuildContext {
    options: IPageAssembleOptions;
    assets: BuildAsset[];
    constructor(options: IPageAssembleOptions, assets: BuildAsset[]);
}
