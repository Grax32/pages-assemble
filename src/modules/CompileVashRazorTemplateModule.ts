const Vash = require('vash');
import 'reflect-metadata';
import 'fs';
import 'path';
import { injectable } from 'inversify';

import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';
import ILogger from '../interfaces/ILogger';

export default class CompileVashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering CompileVashRazorTemplateModule');
      console.log(Reflect.getMetadata('injector:parameterTypes', CompileVashRazorTemplateModule));
    }

    context.assets
      .filter(v => v.path.endsWith('.jshtml'))
      .forEach(asset => {
        const compiled = Vash.compile(asset.textContent);

      });

    return new ResultContext();
  }
}
