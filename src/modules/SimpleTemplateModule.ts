import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import fs from 'fs';
import path from 'path';
import BaseModule from './BaseModule';

export default class SimpleTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;
  public async invoke(context: BuildContext): Promise<ResultContext> {
    if (context.options.verbose) {
      console.log('Entering', SimpleTemplateModule.name);
    }

    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        const outputTemplate = '<html><body>' + asset.sections.main + '</body></html>';
        const link = <string>(asset.frontMatter.route || asset.path.replace(/\.md$/, ''));
        let outputPath = path.join(context.options.output, link);

        if (!outputPath.endsWith('.html')) {
          outputPath += '.html';
        }

        outputPath = outputPath.replace(/\\/g, '/');

        const outputFolder = path.dirname(outputPath);

        if (context.options.verbose) {
          console.log('writing simple file ' + outputPath);
        }

        fs.mkdirSync(outputFolder, { recursive: true });
        fs.writeFileSync(outputPath, outputTemplate);
      });

    return await this.next(context);
  }
}
