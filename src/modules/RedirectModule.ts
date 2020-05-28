import path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import OutputType from '../models/OutputType';
import RouteUtility from '../utility/RouteUtility';

export default class RedirectModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    const routeUtility = new RouteUtility();

    const redirectAssets = context.assets
      .filter(asset => asset.frontMatter && asset.frontMatter.alternateRoutes)
      .map(asset => ({
        routes: <string[]>(<unknown>asset.frontMatter.alternateRoutes),
        destinationlink: asset.outputRoute,
        title: asset.frontMatter.title,
      }));

    redirectAssets.forEach(redirect => {
      const { destinationlink, title } = redirect;

      redirect.routes.forEach(route => {
        const frontMatter = {
          route,
          destinationlink,
          title,
          layout: 'redirect',
        };

        const outputType = OutputType.html;
        const outputRoute = routeUtility.getOutputRoute(frontMatter.route, '', outputType);
        const outputPath = path.join(context.options.output, outputRoute);

        context.assets.push({
          outputRoute,
          outputPath,
          outputType,
          textContent: '',
          sections: {},
          frontMatter,
          children: [],
          isHandled: false,
          page: {},
          output: '',
          path: '',
        });
      });
    });

    return await this.next(context);
  }
}
