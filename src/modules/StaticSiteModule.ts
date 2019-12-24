import * as fs from 'fs';
import * as path from 'path';

import { IBuildModule } from '../interfaces/IBuildModule';
import { BuildContext } from '../models/buildcontext';
import { ResultContext } from '../models/resultcontext';

export class StaticSiteModule implements IBuildModule {
  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    console.log('StaticSiteModule', context.assets);
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

        console.log(path.join(source, v.path), destFile);
        fs.copyFileSync(path.join(source, v.path), destFile);
      });

    const results = this.next(context);
    return results;
  }
}
