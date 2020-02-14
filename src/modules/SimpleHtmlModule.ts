import path from 'path';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';

export default class SimpleHtmlModule extends BaseModule {

  public next!: (context: BuildContext) => Promise<ResultContext>;

  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', SimpleHtmlModule.name);

    const sharedSections: {[prop: string]: string} = {};

    const htmlAssets = context.assets.filter(v => path.extname(v.path) === '.html');

    htmlAssets
      .forEach(asset => {
        const sectionName = asset.frontMatter.section;
        if (sectionName) {
          sharedSections[sectionName] = asset.output;
        }
      });

    context.assets.forEach(asset => asset.sections = ({
      ...sharedSections,
      ...asset.sections 
    }));

    return await this.next(context);
  }
}
