import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import fs from 'fs';
import path from 'path';

export default class SimpleTemplateModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering SimpleTemplateModule');
    }

    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        const outputTemplate = '<html><body>' + asset.sections['main'] + '</body></html>';
        const link = <string>(asset.frontMatter.permalink || asset.path.replace(/\.md$/, ''));
        let outputPath = path.join(context.options.output, link);

        if (!outputPath.endsWith('.html')) {
          outputPath += '.html';
        }

        outputPath = outputPath.replace(/\\/g, '/');

        const outputFolder = path.dirname(outputPath);

        fs.mkdirSync(outputFolder, { recursive: true });
        fs.writeFileSync(outputPath, outputTemplate);
      });

    return this.next(context);
  }
}
