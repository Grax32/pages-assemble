const Vash = require('vash');
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import fs from 'fs';
import path from 'path';
import BaseModule from './BaseModule';

export default class VashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering SimpleTemplateModule');
    }

    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        const outputTemplate = '<html><body>@html.raw(model.asset.sections.main)</body></html>';
        const compiled = Vash.compile(outputTemplate);
        const result = compiled({ asset: asset});
        const link = <string>(asset.frontMatter.route || asset.path.replace(/\.md$/, ''));
        let outputPath = path.join(context.options.output, link);

        if (!outputPath.endsWith('.html')) {
          outputPath += '.html';
        }

        outputPath = outputPath.replace(/\\/g, '/');

        const outputFolder = path.dirname(outputPath);

        if (context.options.verbose) {
          console.log('writing templated file ' + outputPath);
        }

        fs.mkdirSync(outputFolder, { recursive: true });
        fs.writeFileSync(outputPath, result);
      });

      return this.next(context);
  }
}
