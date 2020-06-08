import path from 'path';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import HtmlSourceFileContext from '../models/FileContexts/HtmlSourceFileContext';

export default class SimpleHtmlModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;

  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', SimpleHtmlModule.name);

    const htmlAssets = context.assets.filter(v => v.isType(HtmlSourceFileContext.name));

    htmlAssets.forEach(asset => {
      asset.sections.main = asset.textContent;
    });

    return await this.next(context);
  }
}
