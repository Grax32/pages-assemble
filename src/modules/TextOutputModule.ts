import * as path from 'path';
import BuildContext from '../models/BuildContext';
import OutputType from '../models/OutputType';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';

export default class TextOutputModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;

  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', TextOutputModule.name);

    context.assets
      .filter(asset => asset.outputType === OutputType.text)
      .forEach(asset => {
        asset.output = asset.textContent;
      });

    return await this.next(context);
  }
}
