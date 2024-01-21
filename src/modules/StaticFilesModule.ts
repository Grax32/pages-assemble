import { Minimatch } from 'minimatch';
import * as path from 'path';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import FileSystemUtility from '../utility/FileSystemUtility';
import BaseModule from './BaseModule';

export default class StaticFilesModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;

  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', StaticFilesModule.name);

    const source = context.options.source;
    const dest = context.options.output;

    const isStatic = (filename: string | undefined) => {
      if (!filename) { return false; }

      for (let pattern of context.options.static) {
        if (/^\.\w*?$/.test(pattern)) {
          // pattern is an extension matching pattern.  i.e. .gif
          pattern = '**/*' + pattern;
        }

        if( new Minimatch(pattern).match(filename)) {
          return true;
        }         
      }

      return false;
    };

    context.assets
      .filter(asset => asset.path)
      .filter(asset => isStatic(asset.path))
      .forEach(asset => {
        const assetPath = asset.path!;

        const sourceFile = path.join(source, assetPath);
        const destFile = path.join(dest, assetPath);
        FileSystemUtility.copyFile(sourceFile, destFile);
        asset.isHandled = true;
      });

    return await this.next(context);
  }
}
