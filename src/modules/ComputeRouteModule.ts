import path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';

export default class ComputeRouteModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    context.assets
      .filter(v => v.outputType === OutputType.html)
      .forEach(asset => {
        const link = <string>(asset.frontMatter.route || asset.path.replace(/\.md$/, ''));
        let route = path.join(context.options.output, link);

        if (!route.endsWith('.html')) {
          route += '.html';
        }

        // normalize path to forward slash (fix windows paths)
        route = route.replace(/\\/g, '/');
        asset.outputPath = route;
      });

    return this.next(context);
  }
}
