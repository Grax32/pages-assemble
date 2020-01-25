import path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';

export default class ComputeRouteModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;

  public async invoke(context: BuildContext): Promise<ResultContext> {
    const removeExtension = (filePath: string) => {
      const lastDot = filePath.lastIndexOf('.');
      if (lastDot < 0) {
        return filePath;
      }

      return filePath.slice(0, lastDot);
    };

    context.assets
      .filter(asset => asset.outputType !== OutputType.binary)
      .forEach(asset => {
        const link = <string>(asset.frontMatter.route || removeExtension(asset.path));
        let route = path.join(context.options.output, link);

        const extension = asset.outputType === OutputType.text ? ".txt" : ".html";

        if (!route.endsWith(extension)) {
          route += extension;
        }

        // normalize path to forward slash (fix windows paths)
        route = route.replace(/\\/g, '/');
        asset.outputPath = route;
      });

    return await this.next(context);
  }
}
