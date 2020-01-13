const vash = require('vash');
import * as path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import SourceFileContext from '../models/SourceFileContext';
import OutputType from '../models/OutputType';
import FileSystemUtility from '../utility/FileSystemUtility';

type applyTemplate = (asset: SourceFileContext) => string;
type templateCollection = { [key: string]: any };

export default class CompileVashRazorTemplateModule extends BaseModule {
  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    this.log('Entering', CompileVashRazorTemplateModule.name);

    const viewsFolder = path.join(context.options.source, '_layouts');
    vash.config.settings = { views: viewsFolder };

    const templates: templateCollection = {};

    this.log(vash, vash.config);

    context.assets
      .filter(asset => asset.path.endsWith('.vash'))
      .forEach(asset => {
        this.log('Compiling', asset.path);

        const compiled = vash.compile(asset.textContent);
        const layoutName = asset.frontMatter.layout || asset.path;
        vash.install(layoutName, compiled);

        const applyTemplateFunc: applyTemplate = (asset: SourceFileContext): string => compiled({ model: asset, page: asset.frontMatter });
        templates[layoutName] = applyTemplateFunc;

        asset.isHandled = true;
      });

    this.log('Applying templates');

    context.assets
      .filter(asset => asset.outputType === OutputType.html)
      .forEach(asset => {
        const template = asset.frontMatter.layout || context.options.template;
        const applyTemplate = templates[template];
        if (applyTemplate) {
          this.log('applying template', template, 'to asset', asset.path, 'output', asset.outputPath);
          const result = applyTemplate(asset);
          FileSystemUtility.saveFile(asset.outputPath, result);
        } else {
          this.log("Template", template, "was not found");
        }
      });

    return this.next(context);
  }
}
