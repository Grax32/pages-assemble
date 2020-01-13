import * as path from 'path';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import FileSystemUtility from '../utility/FileSystemUtility';
import BaseModule from './BaseModule';

export default class StaticFilesModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    this.log('Entering', StaticFilesModule.name);

    const source = context.options.source;
    const dest = context.options.output;

    context.assets
      .filter(asset => asset.isStatic)
      .forEach(asset => {
        const sourceFile = path.join(source, asset.path);
        const destFile = path.join(dest, asset.path);

        console.log('Writing', sourceFile, destFile);
        FileSystemUtility.copyFile(sourceFile, destFile);
        asset.isHandled = true;
      });

    return this.next(context);
  }
}
