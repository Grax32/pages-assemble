import grayMatter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

import ResultContext from '../models/ResultContext';
import BuildContext from '../models/BuildContext';
import { OutputTypes } from '../models/OutputType';
import SourceFileContext from '../models/FileContexts/SourceFileContext';
import BaseModule from './BaseModule';
import { FileContext } from '../models';

export default class InitialModule extends BaseModule {
  private outputTypeValues = Object.values(OutputTypes.OutputType);

  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', InitialModule.name);

    // delete old output
    const outputGlobPattern = context.options.output + '/**';
    glob.sync(outputGlobPattern, { nodir: true, dot: true }).forEach(v => fs.unlinkSync(v));
    glob
      .sync(outputGlobPattern + '/')
      .sort((a, b) => b.length - a.length) // remove the deepest folders first
      .forEach(v => fs.rmdirSync(v));

    const getSourcePath = (asset: SourceFileContext) => path.join(context.options.source, asset.path);
    const getOutputType = (filePath: string, matterData: { [key: string]: any }) => {
      if (matterData.outputType) {
        if (this.outputTypeValues.includes(matterData.outputType)) {
          return matterData.outputType;
        } else {
          throw Error('Output type is not valid in ' + filePath);
        }
      }

      return OutputTypes.getOutputTypeFromExtension(path.extname(filePath));
    };

    const sourceFileAssets = <SourceFileContext[]>context.assets.filter(asset => asset.isType(SourceFileContext.name));

    sourceFileAssets.forEach(asset => {
      const sourcePath = getSourcePath(asset);
      const defaultSeparator = '---';
      let separator: string | [string, string] = defaultSeparator;

      if (!asset.textContent.startsWith(defaultSeparator)) {
        // custom separators for file types
        // TODO: Move to file-type component
        switch (path.extname(asset.path)) {
          case '.css':
          case '.js':
            separator = ['/****', '****/'];
            break;
        }
      }

      const matter = grayMatter.read(sourcePath, { delimiters: separator });
      const matterData = matter.data || {};
      const outputType = getOutputType(sourcePath, matterData);

      const excerptSeparator = '/* end excerpt */';
      const content = matter.content.split(excerptSeparator, 2);
      if (content.length === 1) {
        asset.textContent = matter.content;
        asset.sections.excerpt = '';
      } else {
        asset.textContent = content[1];
        asset.sections.excerpt = content[0];
      }

      asset.frontMatter = matterData;
      asset.outputType = outputType;

      for (const tag of matterData.tags || []) {
        InitialModule.getCollection(context, tag).push(asset);
      }
    });

    return this.next(context);
  }

  private static getCollection(context: BuildContext, collectionKey: string): FileContext[] {
    if (!context.collections[collectionKey]) {
      context.collections[collectionKey] = [];
    }

    return context.collections[collectionKey];
  }
}
