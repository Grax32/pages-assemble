import grayMatter from 'gray-matter';
import fs from 'fs';
import path from 'path';
import glob from 'glob';

import IBuildModule from '../interfaces/IBuildModule';
import ResultContext from '../models/ResultContext';
import BuildContext from '../models/BuildContext';
import OutputType from '../models/OutputType';
import BuildAsset from '../models/BuildAsset';

export default class InitialModule implements IBuildModule {
  private outputTypeValues = Object.values(OutputType);

  public next!: (context: BuildContext) => ResultContext;
  public invoke(context: BuildContext): ResultContext {
    if (context.options.verbose) {
      console.log('Entering InitialModule');
    }

    // delete old output
    const outputGlobPattern = context.options.output + '/**';
    glob.sync(outputGlobPattern, { nodir: true, dot: true }).forEach(v => fs.unlinkSync(v));
    glob
      .sync(outputGlobPattern + '/')
      .sort((a, b) => b.length - a.length) // remove the deepest folders first
      .forEach(v => fs.rmdirSync(v));

    const getSourcePath = (asset: BuildAsset) => path.join(context.options.source, asset.path);
    const getOutputType = (filePath: string, matterData: { [key: string]: any }): OutputType => {
      if (matterData.outputType) {
        if (this.outputTypeValues.includes(matterData.outputType)) {
          return matterData.outputType;
        } else {
          throw Error('Output type is not valid in ' + filePath);
        }
      }

      let outputType = OutputType.binary;

      switch (path.extname(filePath)) {
        case '.md':
        case '.html':
        case '.htm':
          outputType = OutputType.html;
      }

      return outputType;
    };

    context.assets.forEach(asset => {
      const sourcePath = getSourcePath(asset);
      const separator = '---';
      const matter = grayMatter.read(sourcePath);
      const matterData = matter.data || {};
      const outputType = getOutputType(sourcePath, matterData);

      const content = matter.content.split(separator, 2);
      if (content[1]) {
        asset.textContent = content[1];
        asset.sections.excerpt = content[0];
      } else {
        asset.textContent = content[0];
        asset.sections.excerpt = '';
      }

      asset.frontMatter = matterData;
      asset.outputType = outputType;

      for (const tag of matterData.tags || []) {
        InitialModule.getCollection(context, tag).push(asset);
      }
    });

    return this.next(context);
  }

  private static getCollection(context: BuildContext, collectionKey: string): BuildAsset[] {
    if (!context.collections[collectionKey]) {
      context.collections[collectionKey] = [];
    }

    return context.collections[collectionKey];
  }
}
