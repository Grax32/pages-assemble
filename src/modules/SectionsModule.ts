import * as path from 'path';
import { FrontMatter } from '../models';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';

export default class SectionsModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', SectionsModule.name);

    const sharedSections: { [prop: string]: string } = {};
    const assets = context.assets;

    // get sections from assets
    assets
      .filter(asset => asset?.frontMatter?.section)
      .forEach(asset => (sharedSections[asset.frontMatter.section!] = asset.sections.main));

    const frontMatterSectionPrefix = 'section-';
    const getKey = (frontMatterKey: string) => frontMatterKey.slice(frontMatterSectionPrefix.length);

    // set sections to assets
    assets.forEach(asset => {
      const frontMatterSectionKeys = Object.keys(asset.frontMatter).filter(key => key.startsWith('section-'));
      const fm: Omit<FrontMatter, 'tags' | 'systemTags'> = asset.frontMatter;
      const frontMatter = fm as { [key: string]: string };

      const assetSections = Object.fromEntries(
        frontMatterSectionKeys.map(key => [
          getKey(key), // convert frontMatter key to section key
          frontMatter[key],
        ]),
      );

      asset.sections = {
        ...assetSections,
        ...sharedSections,
        ...asset.sections,
      };
    });

    return await this.next(context);
  }
}
