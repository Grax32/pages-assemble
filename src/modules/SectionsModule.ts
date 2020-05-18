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

    // set sections to assets
    assets.forEach(asset => {
      asset.sections = { ...sharedSections, ...asset.sections };
    });

    return await this.next(context);
  }
}
