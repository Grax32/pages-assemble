import OutputType from '../OutputType';

export default class FileContext {
  public contextType = FileContext.name;

  public outputType: OutputType = OutputType.binary;
  public textContent: string = '';
  public sections: { [prop: string]: string } = {};
  public frontMatter: {
    tags?: string[];
    route?: string;
    alternateRoutes?: string[];
    title?: string;
    section?: string;
    dataKey?: string;
    webImport?: string;
    layout?: string;
    minify?: string;
    category?: string;
  } = {};
  public outputRoute: string = '';
  public outputPath: string = '';
  public isHandled = false;
  public page = this.frontMatter;
  public output: string = '';
  public path?: string;

  public isType(typeName: string) {
    return typeName === FileContext.name;
  }
}
