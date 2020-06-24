import path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';
import { RouteUtility } from '../utility';
import { SourceFileContext } from '../models';

export default class ComputeRouteModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    const routeUtility = new RouteUtility();

    context.assets
      .filter(asset => asset.outputType !== OutputType.binary)
      .forEach(asset => {
        const assetPath = (<SourceFileContext>asset).path;
        const route = routeUtility.getBasicOutputRoute(asset.frontMatter.route, assetPath, asset.outputType);
        asset.outputRoute = route;

        const outputRoutePath = routeUtility.getOutputRoute(asset.frontMatter.route, assetPath, asset.outputType);
        const outputPath = path.join(context.options.output, outputRoutePath);

        asset.outputPath = outputPath;
      });

    return await this.next(context);
  }
}
