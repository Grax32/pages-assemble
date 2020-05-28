import path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType, { OutputTypes } from '../models/OutputType';
import BaseModule from './BaseModule';
import RouteUtility from '../utility/RouteUtility';

export default class ComputeRouteModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    const routeUtility = new RouteUtility();

    context.assets
      .filter(asset => asset.outputType !== OutputType.binary)
      .forEach(asset => {

        const outputRoute = routeUtility.getOutputRoute(asset.frontMatter.route, asset.path, asset.outputType);
        const outputPath = path.join(context.options.output, outputRoute);

        asset.outputRoute = outputRoute;
        asset.outputPath = outputPath;
      });

    return await this.next(context);
  }
}
