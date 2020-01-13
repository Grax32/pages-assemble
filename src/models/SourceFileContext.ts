import OutputType from './OutputType';

export default class SourceFileContext {
  public outputType: OutputType = OutputType.binary;
  public textContent: string = '';
  public sections: { [prop: string]: string } = {};
  public frontMatter: { [prop: string]: string } = {};
  public children: SourceFileContext[] = [];
  public outputPath: string = '';
  public isHandled = false;
  public page = this.frontMatter;

  constructor(public path: string, public isStatic: boolean) {}
}
