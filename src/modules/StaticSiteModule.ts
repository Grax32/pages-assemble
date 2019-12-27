import * as fs from 'fs';
import * as path from 'path';

import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from "../models/BuildContext";
import ResultContext from "../models/ResultContext";

export default class StaticSiteModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering StaticSiteModule');
    }

    const source = context.options.source;
    const dest = context.options.output;

    context.assets
      .filter(v => v.isStatic)
      .forEach(v => {
        const destFile = path.join(dest, v.path);
        const destDir = path.dirname(destFile);
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }

        fs.copyFileSync(path.join(source, v.path), destFile);
      });

    const results = this.next(context);
    return results;
  }
}
