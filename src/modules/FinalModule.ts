import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import FileSystemUtility from '../utility/FileSystemUtility';

export default class FinalModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', FinalModule.name);

    context.assets
    .filter(asset => !asset.isHandled)
    .forEach(asset => {
      if (!asset.output) {
        throw new Error('No output was generated for source file ' + asset.path);
        process.exit(1);
      }

      if (!asset.outputPath) {
        throw new Error('No output path was generated for source file ' + asset.path);
        process.exit(1);
      }

      FileSystemUtility.saveFile(asset.outputPath, asset.output);
    });

    return new ResultContext();
  }
}
