import path from 'path';
import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';

export default class ComputeOutputPathModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        const link = <string>(asset.frontMatter.permalink || asset.path.replace(/\.md$/, ''));
        let outputPath = path.join(context.options.output, link);

        if (!outputPath.endsWith('.html')) {
          outputPath += '.html';
        }

        outputPath = outputPath.replace(/\\/g, '/');
        const outputFolder = path.dirname(outputPath);

        asset.outputPath = outputPath;
        asset.outputFolder = outputFolder;
      });

    return this.next(context);
  }
}
