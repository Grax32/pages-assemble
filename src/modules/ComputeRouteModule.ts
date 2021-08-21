import path                  from 'path';
import { BuildContext, OutputType, ResultContext, SourceFileContext } from '../models';
import { RouteUtility }      from '../utility';
import BaseModule            from './BaseModule';

export default class ComputeRouteModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    const routeUtility = new RouteUtility();

    context.assets
      .filter(asset => asset.outputType !== OutputType.binary)
      .forEach(asset => {
        const assetPath = (asset as SourceFileContext).path;
        const route = routeUtility.getBasicOutputRoute(asset.frontMatter.route, assetPath, asset.outputType);
        asset.outputRoute = route;

        const outputRoutePath = routeUtility.getOutputRoute(asset.frontMatter.route, assetPath, asset.outputType);
        const outputPath = path.join(context.options.output, outputRoutePath);

        asset.outputPath = outputPath;
      });

    return await this.next(context);
  }
}
