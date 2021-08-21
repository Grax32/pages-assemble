import base64Img                       from 'base64-img';
import { getColorFromURL }             from 'color-thief-node';
import path                            from 'path';
import { BuildContext, ResultContext } from '../models';
import BaseModule                      from './BaseModule';

export default class ColorThiefModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {

    const imgPathColors: { [key: string]: string } = context.dataStore.imgPathColors || {};
    context.dataStore.imgPathColors = imgPathColors;

    const imagePaths = context.assets.filter(asset => asset.frontMatter.imgPath).map(asset => asset.frontMatter.imgPath!);

    for (const imgPath of imagePaths) {

      if (!imgPathColors[imgPath]) {

        const realPath = path.join(context.options.source, imgPath);
        const encoded = base64Img.base64Sync(realPath);
        const color = await getColorFromURL(encoded);
        const rgbColor = 'rgb(' + color.join(',') + ')';

        imgPathColors[imgPath] = rgbColor;
      }
    }

    return await this.next(context);
  }
}
