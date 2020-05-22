import * as path from 'path';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import BaseModule from './BaseModule';
import OutputType from '../models/OutputType';
import { exists } from 'fs';

export default class SectionsModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {
    this.log('Entering', SectionsModule.name);

    const sharedSections: { [prop: string]: string } = {};
    const assets = context.assets;

    // get sections from assets
    assets
      .filter(asset => asset && asset.frontMatter && asset.frontMatter.section)
      .forEach(asset => (sharedSections[asset.frontMatter.section] = asset.sections.main));

    const frontMatterSectionPrefix = 'section-';
    const getKey = (frontMatterKey: string) => frontMatterKey.slice(frontMatterSectionPrefix.length);

    // set sections to assets
    assets.forEach(asset => {
      const frontMatterSectionKeys = Object.keys(asset.frontMatter).filter(key => key.startsWith('section-'));
      const frontMatterSections = frontMatterSectionKeys
        .map(key => ({
          key: getKey(key), // convert frontMatter key to section key
          value: asset.frontMatter[key],
        }))
        .forEach(frontMatterSection => { // assign section value to section
          asset.sections[frontMatterSection.key] = frontMatterSection.value;
        });

      asset.sections = { ...sharedSections, ...asset.sections };
    });

    return await this.next(context);
  }
}
