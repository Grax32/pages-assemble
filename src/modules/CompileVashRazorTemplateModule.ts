const Vash = require('vash');
import * as fs from 'fs';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import SourceFileContext from '../models/SourceFileContext';
import OutputType from '../models/OutputType';

type applyTemplate = (asset: SourceFileContext) => string;
type templateCollection = { [key: string]: any };

export default class CompileVashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    function log(...args: any[]) {
      if (context.options.verbose) {
        console.log(...args);
      }
    }

    log('Entering', CompileVashRazorTemplateModule.name);

    const templates: templateCollection = {};

    context.assets
      .filter(asset => asset.path.endsWith('.jshtml'))
      .forEach(asset => {
        log('Compiling', asset.path);
        const compiled = Vash.compile(asset.textContent);
        const applyTemplateFunc: applyTemplate = (asset: SourceFileContext): string => compiled({ asset: asset });
        const layoutName = asset.frontMatter.layout || asset.path;
        templates[layoutName] = applyTemplateFunc;
      });

    context.assets
      .filter(asset => asset.outputType === OutputType.html)
      .forEach(asset => {
        console.log(asset.path, asset.frontMatter);
        const template = asset.frontMatter.layout || context.options.template;
        const applyTemplate = templates[template];
        if (applyTemplate) {
          log('apply template', asset.path, template);
          const result = applyTemplate(asset);
          fs.mkdirSync(asset.outputFolder, { recursive: true });
          fs.writeFileSync(asset.outputPath, result);
        }
      });

    return this.next(context);
  }
}
