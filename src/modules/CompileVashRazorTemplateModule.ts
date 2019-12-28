const Vash = require('vash');
import fs from 'fs';
import path from 'path';

import { injectable } from '../decorators/injectable';

import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';

@injectable<CompileVashRazorTemplateModule, IBuildModule>()
export default class CompileVashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering SimpleTemplateModule');
    }

    context.assets
      .filter(v => v.path.endsWith('.jshtml'))
      .forEach(asset => {
        const compiled = Vash.compile(asset.textContent);

      });

    return new ResultContext();
  }
}
