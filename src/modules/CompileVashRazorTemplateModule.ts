const Vash = require('vash');
import 'fs';
import 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';

export default class CompileVashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering CompileVashRazorTemplateModule');
    }

    context.assets
      .filter(v => v.path.endsWith('.jshtml'))
      .forEach(asset => {
        const compiled = Vash.compile(asset.textContent);

      });

    return new ResultContext();
  }
}
