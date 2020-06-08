import path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import OutputType from '../models/OutputType';
import RouteUtility from '../utility/RouteUtility';
import { distinct } from '../utility';
import { FileContext } from '../models';

export default class TagsModule extends BaseModule {
   public async invoke(context: BuildContext): Promise<ResultContext> {
    const routeUtility = new RouteUtility();
 
    context.assets.forEach(asset => {
      if (!asset.frontMatter.tags) {
        asset.frontMatter.tags = [];
      }
    });

    const allTags = context.assets
      .map(asset => asset.frontMatter.tags!)
      .reduce((tags, tagList) => tags.concat(tagList), []);

    const tagCounts: { [key: string]: number } = {};
    allTags.forEach(tag => (tagCounts[tag] = 0));
    allTags.forEach(tag => tagCounts[tag]++);

    const distinctTags = distinct(allTags);
    const filteredTags = distinctTags.filter(tag => tagCounts[tag] > 3);

    context.assets
      .forEach(asset => {
        asset.frontMatter.tags = asset.frontMatter.tags!.filter(tag => filteredTags.includes(tag));
      });

    context.dataStore.tags = filteredTags;

    filteredTags.forEach(tag => {
      const route = '/categories/' + tag;
      const outputType = OutputType.html;
      const outputRoute = routeUtility.getOutputRoute(route, '', outputType);
      const outputPath = path.join(context.options.output, outputRoute);

      const categoryAsset = new FileContext();
      const frontMatter = categoryAsset.frontMatter;
      frontMatter.layout = "pages";
      frontMatter.title = "Tagged " + tag;
      categoryAsset.outputRoute = outputRoute;
      categoryAsset.outputPath = outputPath;
      categoryAsset.outputType = outputType;

      const collection = context.collections[tag];
      const links = collection.map(asset => 
        '<a href="' + asset.outputRoute +'">' + asset.frontMatter.title + '</a>\n');
      categoryAsset.textContent = links.join('<hr/>');
      categoryAsset.sections.main = links.join('<br/>');
      categoryAsset.output = categoryAsset.textContent;

      context.addNewAsset(categoryAsset);
    });

    return await this.next(context);
  }
}
