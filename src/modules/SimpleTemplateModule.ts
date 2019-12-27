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
      console.log('SimpleTemplateModule');
    }

    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        const outputTemplate = '<html><body>' + asset.sections['main'] + '</body></html>';
        const outputFolder = path.join(context.options.output, path.dirname(asset.path));
        const outputPath = path.join(context.options.output, asset.path);
        console.log(process.cwd(), outputPath);

        fs.mkdirSync(outputFolder, { recursive: true });
        fs.writeFileSync(outputPath, outputTemplate);
      });

    return new ResultContext();
  }
}
