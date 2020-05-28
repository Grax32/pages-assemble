import OutputType from './OutputType';

export default class SourceFileContext {
  public outputType: OutputType = OutputType.binary;
  public textContent: string = '';
  public sections: { [prop: string]: string } = {};
  public frontMatter: { [prop: string]: string } = {};
  public children: SourceFileContext[] = [];
  public outputRoute: string = '';
  public outputPath: string = '';
  public isHandled = false;
  public page = this.frontMatter;
  public output: string = '';

  constructor(public path: string) {}
}
