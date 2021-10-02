import jimp                            from 'jimp';
import path                            from 'path';
import { BuildContext, ResultContext } from '../models';
import BaseModule                      from './BaseModule';

export default class ThumbnailModule extends BaseModule {
  public async invoke(context: BuildContext): Promise<ResultContext> {

    const imgPathColors: { [key: string]: string } = context.dataStore.imgPathColors || {};
    context.dataStore.imgPathColors = imgPathColors;

    const assetWithImages = context
      .assets
      .filter(asset => asset.frontMatter.imgPath);

    for (const imageAsset of assetWithImages) {
      const imgPath = imageAsset.frontMatter.imgPath!;
      const realPath = path.join(context.options.source, imgPath);

      const parsedPath = path.parse(imgPath);
      const thumbFileName = parsedPath.name + '.thumb.' + parsedPath.ext;

      const thumbPath = path.join(context.options.output, parsedPath.dir, thumbFileName);
      imageAsset.sections.thumbPath = thumbPath;

      const image = await jimp.read(realPath);
      image.scaleToFit(180, 180);
      await image.writeAsync(thumbPath);
    }

    return await this.next(context);
  }
}
