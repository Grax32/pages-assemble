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
}
