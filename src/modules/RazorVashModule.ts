const vash = require('vash');
import * as path from 'path';

import { AssetGroup, getCategory, isSystemFolder, getCategoryFolder } from '../utility/SysUtilities';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import SourceFileContext from '../models/FileContexts/SourceFileContext';
import OutputType from '../models/OutputType';
import RazerSourceFileContext from '../models/FileContexts/RazerSourceFileContext';

function toGrouping<T, V>(array: T[], keyExpression: (value: T) => string, valueExpression: (value: T) => V) {
  const grouping: { [key: string]: V[] } = {};

  array.forEach(arrayValue => {
    const key = keyExpression(arrayValue);

    if (!grouping[key]) {
      grouping[key] = [];
    }

    grouping[key].push(valueExpression(arrayValue));
  });

  return grouping;
}

export default class RazorVashModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', RazorVashModule.name);

    const templatesFolder = path.join(context.options.source, getCategoryFolder(AssetGroup.template));
    vash.config.settings = { views: templatesFolder };
    vash.config.useWith = true;

    this.log('Compiling razor templates');

    const finishLayout = (err: any, ctx: { finishLayout: () => void }) => ctx.finishLayout();

    const getTemplateName = (templateAsset: SourceFileContext) => {
      return path.basename(templateAsset.path, '.vash');
    };

    const templates = vash.helpers.tplcache;

    const allVashAssets = <RazerSourceFileContext[]>(
      context.assets.filter(asset => asset.isType(RazerSourceFileContext.name))
    );
    const assetGrouping = toGrouping(
      allVashAssets,
      v => getCategory(v.path),
      v => v,
    );

    const razorTemplates = assetGrouping[AssetGroup.template] || [];
    const razorIncludes = assetGrouping[AssetGroup.includes] || [];
    const razorPages = assetGrouping[AssetGroup.general] || [];

    razorTemplates.forEach(templateAsset => {
      if (!templateAsset.textContent) {
        console.error('Error parsing', templateAsset);
      }
      const compiledTemplate = vash.compile(templateAsset.textContent);
      vash.install(getTemplateName(templateAsset), compiledTemplate);
      templateAsset.isHandled = true;
    });

    const compileOutput = (asset: SourceFileContext) => {
      const model = {
        sections: asset.sections,
        page: asset,
        context: context,
        ...asset.frontMatter,
      };

      if (asset.textContent) {
        const page = vash.compile(asset.textContent);
        const output = page(model, finishLayout);
        asset.sections.main = output;
        asset.output = output;
      } else {
        this.log(asset.path, ' cannot be compiled', asset.textContent);
      }
    };

    this.log('Compiled includes');
    razorIncludes.forEach(compileOutput);

    this.log('Compiling pages');
    razorPages.forEach(compileOutput);

    this.log('Applying razor templates');

    context.assets
      .filter(asset => isSystemFolder(asset.path))
      .filter(asset => asset.outputType === OutputType.html)
      .forEach(asset => (asset.isHandled = true));

    context.assets
      .filter(asset => !isSystemFolder(asset.path))
      .filter(asset => asset.outputType === OutputType.html)
      .forEach(asset => {
        const baseModel = {
          category: 'tech',
          title: '',
          titleonly: '',
          excerpt: '',
          hidebyline: false,
          tags: [],
        };
        const templateName = asset.frontMatter.layout || context.options.template;
        const applyTemplate = templates[templateName];

        if (applyTemplate) {
          try {
            const model = {
              ...baseModel,
              sections: asset.sections,
              page: asset,
              context: context,
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
