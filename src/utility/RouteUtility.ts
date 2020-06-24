import { OutputTypes, OutputType } from '../models';

type keyValue = { [key: string]: keyValue | string };

export default class RouteUtility {
  public getPropertyByName(obj: keyValue, propertyNames: string[]): string {
    const val = obj[propertyNames[0]];

    if (!val) {
      return '';
    }

    if (propertyNames.length > 1) {
      return this.getPropertyByName(<keyValue>val, propertyNames.slice(1));
    }

    return <string>val;
  }

  public fillRoute(route: string, model: keyValue): string {
    return route.replace(/{(.*?)}/g, (_, v) => this.getPropertyByName(model, v.split('.')));
  }

  public removeExtension(filePath: string) {
    const lastDot = filePath.lastIndexOf('.');
    if (lastDot < 0) {
      return filePath;
    }

    return filePath.slice(0, lastDot);
  }

  public getBasicOutputRoute(frontMatterRoute: string | undefined, filePath: string, outputType: OutputType) {
    // resolve path and normalize to forward slash (fix windows paths)
    return (
       frontMatterRoute || this.removeExtension(filePath)
    ).replace(/\\/g, '/');
  }

  public getOutputRoute(frontMatterRoute: string | undefined, filePath: string, outputType: OutputType) {
    const basicRoute = this.getBasicOutputRoute(frontMatterRoute, filePath, outputType);    
    const extension = OutputTypes.getOutputExtension(outputType);

    return basicRoute.endsWith(extension) ? basicRoute : basicRoute + extension;
  }
}
