const vash = require('vash');
import * as path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import SourceFileContext from '../models/SourceFileContext';
import OutputType from '../models/OutputType';

export default class CompileVashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', CompileVashRazorTemplateModule.name);

    const viewsFolder = path.join(context.options.source, '_layouts');
    vash.config.settings = { views: viewsFolder };
    vash.config.useWith = true;

    this.log('Compiling templates');

    const finishLayout = (err: any, ctx: { finishLayout: () => void }) => ctx.finishLayout();

    const getTemplateName = (templateAsset: SourceFileContext) => {
      return templateAsset.frontMatter.layout || path.basename(templateAsset.path, '.vash');
    };

    const templates = vash.helpers.tplcache;

    context.assets
      .filter(asset => asset.path.endsWith('.vash'))
      .forEach(templateAsset => {
        const compiledTemplate = vash.compile(templateAsset.textContent);
        vash.install(getTemplateName(templateAsset), compiledTemplate);
        templateAsset.isHandled = true;
      });

    this.log('Applying templates');

    context.assets
      .filter(asset => asset.outputType === OutputType.html)
      .forEach(asset => {
        const baseModel = { title: '' };
        const templateName = asset.frontMatter.layout || context.options.template;
        const applyTemplate = templates[templateName];
        if (applyTemplate) {
          this.log('applying template', templateName, 'to asset', asset.path, 'output', asset.outputPath);
          try {
            const model = {
              ...baseModel,
              sections: asset.sections,
              page: asset,
              ...asset.frontMatter,
            };
            asset.output = applyTemplate(model, finishLayout);
          } catch (exception) {
            this.log('error applying template', JSON.stringify(asset.frontMatter));
            throw exception;
          }
        } else {
          this.log('Template', templateName, 'was not found');
          process.exit(1);
        }
      });

    return await this.next(context);
  }
}
