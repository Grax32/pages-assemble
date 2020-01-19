import * as path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import OutputType from '../models/OutputType';

export default class TextOutputModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    this.log('Entering', TextOutputModule.name);

    context.assets
      .filter(asset => asset.outputType === OutputType.text)
      .forEach(asset => {
        if (!asset.outputPath) {
          const extension = path.extname(asset.path);
          asset.outputPath = path.basename(asset.path, extension) + '.txt';
          console.log(asset.outputPath);
          process.exit();
        }
        asset.output = asset.textContent;
      });

    return this.next(context);
  }
}
