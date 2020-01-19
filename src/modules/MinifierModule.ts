import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';
import minifier from 'html-minifier';

export default class MinifyModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering', MinifyModule.name);
    }

    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        asset.output = minifier.minify(asset.output);
      });

    return this.next(context);
  }
}
