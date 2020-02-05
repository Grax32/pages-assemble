import * as fs from 'fs';
import * as path from 'path';
import minifier from 'html-minifier';
import uglify from 'uglify-js';
import uglifycss from 'uglifycss';

import { BuildContext, SourceFileContext } from '../models';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';
import UrlFetchUtility from '../utility/UrlFetchUtility';
import StringUtility from '../utility/StringUtility';

type stringFunc = (value: string) => string;

export default class MinifyModule extends BaseModule {
  public next!: (context: BuildContext) => Promise<ResultContext>;
  public async invoke(context: BuildContext): Promise<ResultContext> {
    if (context.options.verbose) {
      console.log('Entering', MinifyModule.name);
    }

    const shrinkAssets = context.assets.map(
      async (asset): Promise<void> => {
        const fullPath = path.join(context.options.source, asset.path);
        const fullDirName = path.dirname(fullPath);

        const resolveRelativePath: stringFunc = (relativePath: string) => {
          return path.resolve(fullDirName, relativePath);
        }; 

        switch (asset.outputType) {
          case OutputType.html:
            await this.shrinkHtml(asset);
            break;
          case OutputType.style:
            await this.shrinkStyle(asset, resolveRelativePath);
            break;
          case OutputType.script:
            await this.shrinkScript(asset, resolveRelativePath);
            break;
        }
      },
    );

    await Promise.all(shrinkAssets);
    return await this.next(context);
  }

  private async shrinkHtml(asset: SourceFileContext) {
    asset.output = minifier.minify(asset.output);
  }

  private async shrinkStyle(asset: SourceFileContext, resolveRelativePath: stringFunc) {
    const textContent = asset.frontMatter.webImport
      ? await this.resolveAllLines(asset.textContent, resolveRelativePath)
      : asset.textContent;
    asset.output = asset.frontMatter.minify ? uglifycss.processString(textContent) : textContent;
  }

  private getWebUrlFromLine(line: string) {
    const webUrlPart = line.split(/import.url\(/, 2)[1];

    if (webUrlPart) {
      return StringUtility.trim(webUrlPart.split(')')[0], "'");
    } else {
      return null;
    }
  }

  private async resolveLine(line: string, getAssetPath: stringFunc): Promise<string> {
    const webUrl = this.getWebUrlFromLine(line);

    if (webUrl) {
      if (webUrl.startsWith('http')) {
        return await UrlFetchUtility.get(webUrl);
      } else {
        const filePath = getAssetPath(webUrl);
        return fs.readFileSync(filePath, 'utf-8');
      }
    } else {
      return line;
    }
  }

  private async resolveAllLines(textContent: string, getAssetPath: stringFunc): Promise<string> {
    const linePromises = textContent.split(/[\r\n]/g).map(v => this.resolveLine(v, getAssetPath));

    const lines = await Promise.all(linePromises);

    return lines.join('\n');
  }

  private async shrinkScript(asset: SourceFileContext, resolveRelativePath: stringFunc) {
    const textContent = asset.frontMatter.webImport
      ? await this.resolveAllLines(asset.textContent, resolveRelativePath)
      : asset.textContent;

    if (asset.frontMatter.minify) {
      const result = uglify.minify(textContent);

      if (result.warnings) {
        this.log('Minify warning', ...result.warnings);
      }
      if (result.error) {
        throw result.error;
      }

      asset.output = result.code;
    } else {
      asset.output = textContent;
    }
  }
}
