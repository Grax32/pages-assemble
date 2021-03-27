import grayMatter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

import ResultContext from '../models/ResultContext';
import BuildContext from '../models/BuildContext';
import { OutputTypes } from '../models/OutputType';
import SourceFileContext from '../models/FileContexts/SourceFileContext';
import BaseModule from './BaseModule';
import { normalizeSortOrder, sortAssets } from '../utility/SortAssetsUtility';

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

      /** Clean up nulls or single string references */
      const normalizeArrayValue = (values: string[] | undefined | null): string[] => {
        if (!values) { return []; }
        if (typeof values === 'string') { return [values]; }
        return values;
      }

      const sortOrder = normalizeSortOrder(matterData.sortOrder || '1000');
      const tags = normalizeArrayValue(matterData.tags);
      const systemTags = normalizeArrayValue(matterData.systemTags);
      const allTags = [...tags, ...systemTags];

      asset.frontMatter = {
        ...matterData,
        sortOrder,
        systemTags,
        tags      
      };
      Object.freeze(asset.frontMatter);
      asset.outputType = outputType;

      for (const tag of allTags) {
        context.getCollection(tag).push(asset);
      }
    });

    const collectionKeys = Object.keys(context.collections);
    for (const key of collectionKeys) {
      const collection = context.getCollection(key);
      // sort in place
      sortAssets(collection);
    }

    return this.next(context);
  }
}
