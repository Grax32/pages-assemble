import * as fs from 'fs';
import * as path from 'path';
import minifier from 'html-minifier';
import uglify from 'uglify-js';
import uglifycss from 'uglifycss';

import * as base64Img from 'base64-img';

import { BuildContext, FileContext } from '../models';
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
        const assetPath = asset.path || 'no-path';
        const fullPath = path.join(context.options.source, assetPath);
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

  private async shrinkHtml(asset: FileContext) {
    // const options: minifier.Options = {
    //   collapseWhitespace: true,
    //   collapseInlineTagWhitespace: true,
    //   ignoreCustomFragments: [/<svg.*?>.*<\/svg>/g]
    // };
    // asset.output = minifier.minify(asset.output, options);
  }

  private async shrinkStyle(asset: FileContext, resolveRelativePath: stringFunc) {
    const textContent = asset.frontMatter.webImport
      ? await this.resolveAllLines(asset.textContent, resolveRelativePath)
      : asset.textContent;
    asset.output = asset.frontMatter.minify ? uglifycss.processString(textContent) : textContent;
  }

  private importUrlRegex = /import.url\((.*?)\)/;
  private urlRegex = /(.*?)url\((.*?)\)(.*?)/;

  private async resolveLine(line: string, getAssetPath: stringFunc): Promise<string> {
    const replaceUrlsInLine = async (line: string): Promise<string> => {
      const importUrlMatch = this.importUrlRegex.exec(line);
      const embeddedImageUrlMatch = this.urlRegex.exec(line);

      if (importUrlMatch) {
        const importUrl = StringUtility.trim(importUrlMatch[1], "'");
        const value = await fetchPath(importUrl);
        const debugLeader = '// File: ' + importUrl + ';\n';
        return debugLeader + value + ';';
      } else if (embeddedImageUrlMatch && !embeddedImageUrlMatch[2].startsWith('/')) {
        const embeddedPath = getAssetPath(StringUtility.trim(embeddedImageUrlMatch[2], "'"));
        const encoded = base64Img.base64Sync(embeddedPath);

        return `${embeddedImageUrlMatch[1]} url(${encoded})${embeddedImageUrlMatch[3]}`;
      } else {
        return line;
      }
    };

    const fetchPath = async (path: string) => {
      if (path.startsWith('http')) {
        return await UrlFetchUtility.get(path);
      } else {
        const filePath = getAssetPath(path);
        return fs.readFileSync(filePath, 'utf-8');
      }
    };

    return replaceUrlsInLine(line);
  }

  private async resolveAllLines(textContent: string, getAssetPath: stringFunc): Promise<string> {
    const linePromises = textContent.split(/[\r\n]/g).map(v => this.resolveLine(v, getAssetPath));

    const lines = await Promise.all(linePromises);

    return lines.join('\n');
  }

  private async shrinkScript(asset: FileContext, resolveRelativePath: stringFunc) {
    const textContent = asset.frontMatter.webImport
      ? await this.resolveAllLines(asset.textContent, resolveRelativePath)
      : asset.textContent;

    // if (asset.frontMatter.minify) {
    //   const result = uglify.minify(textContent);

    //   if (result.warnings) {
    //     this.log('Minify warning', ...result.warnings);
    //   }

    //   if (result.error) {
    //     const error = <any>result.error;

    //     console.error('Error minifying ' + asset.path);
    //     if (error.pos) {
    //       const errorSourceSourceStart = textContent.lastIndexOf('\n', error.pos);
    //       const returnCharAfterErrorPos = textContent.indexOf('\n', error.pos);
    //       const errorSourceEnd = returnCharAfterErrorPos === -1 ? textContent.length : returnCharAfterErrorPos;

    //       if (errorSourceSourceStart > -1 && errorSourceEnd > -1) {
    //         console.error('ErrorLine: ' + textContent.slice(errorSourceSourceStart, errorSourceEnd));
    //       }
    //       console.error(result.error);

    //       // console.error('Source: ' + textContent);
    //       throw result.error;
    //     }

    //     asset.output = result.code;
    //   } else {
    asset.output = textContent;
    //   }
    // }
  }
}
