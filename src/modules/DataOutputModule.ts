import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import OutputType from '../models/OutputType';

export default class DataOutputModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', DataOutputModule.name);

    const dataAssets = context.assets.filter(asset => asset.outputType === OutputType.data);

    dataAssets
      .forEach(asset => {
        const source = asset.textContent;
        const result = eval(source);
        asset.output = JSON.stringify(result);
      });

    return await this.next(context);
  }
}
