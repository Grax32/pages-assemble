import * as path from 'path';
import BuildContext from '../models/BuildContext';
import OutputType from '../models/OutputType';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';

export default class DataModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', DataModule.name);

    const dataAssets = context.assets.filter(asset => asset.outputType === OutputType.data);

    dataAssets
      .filter(asset => asset.textContent)      
      .forEach(asset => {
        let source = asset.textContent.trim();
        if (source.startsWith('{')) {
          source = "x=" + source;
        }
        const result = eval(source);
        const dataKey = (asset.frontMatter.dataKey || path.basename(asset.path ?? 'unknown', '.json'))
          .replace(/[ -](\w)/g, v => v.toUpperCase())
          .replace(/[ -]/g, '');

        if (dataKey) {
          context.dataStore[dataKey] = result;
        }
        asset.output = JSON.stringify({
          DataModuleKey: dataKey,
          ...result
        });
      });

    return await this.next(context);
  }
}
