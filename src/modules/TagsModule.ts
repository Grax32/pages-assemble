import path from 'path';
import { FileContext } from '../models';
import BuildContext from '../models/BuildContext';
import OutputType from '../models/OutputType';
import ResultContext from '../models/ResultContext';
import RouteUtility from '../utility/RouteUtility';
import BaseModule from './BaseModule';

export default class TagsModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    const routeUtility = new RouteUtility();
    const filteredTags = context.getFilteredTagList();

    function filterHiddenTags(tags: string[] | undefined | null) {
      if (!tags) { return []; }

      return tags.filter(tag => filteredTags.includes(tag));
    }

    context.assets.forEach(asset => {
      const tags = filterHiddenTags(asset.frontMatter.tags);
      asset.frontMatter = { ...asset.frontMatter, tags };
    });

    context.dataStore.tags = filteredTags;

    filteredTags.forEach(tag => {
      const route = '/tag/' + tag;
      const outputType = OutputType.html;
      const outputRoute = routeUtility.getOutputRoute(route, '', outputType);
      const outputPath = path.join(context.options.output, outputRoute);

      const categoryAsset = new FileContext();

      categoryAsset.frontMatter = {
        ...categoryAsset.frontMatter,
        layout: 'pages',
        title: 'Tagged ' + tag
      };

      categoryAsset.outputRoute = outputRoute;
      categoryAsset.outputPath = outputPath;
      categoryAsset.outputType = outputType;

      const collection = context.getCollection(tag);
      const links = collection.map(
        asset => '<a href="' + asset.outputRoute + '">' + asset.frontMatter.title + '</a>\n',
      );

      categoryAsset.textContent = links.join('<hr/>');
      categoryAsset.sections.main = links.join('<br/>');
      categoryAsset.output = categoryAsset.textContent;

      context.addNewAsset(categoryAsset);
    });

    return await this.next(context);
  }
}
