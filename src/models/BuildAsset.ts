import OutputType from '../models/OutputType';

export default class BuildAsset {
  public outputType: OutputType;
  public textContent: string;
  public sections: { [prop: string]: string };
  public frontMatter: any;

  constructor(public path: string, public isStatic: boolean) {
    this.outputType = OutputType.binary;
    this.textContent = '';
    this.sections = {};
    this.frontMatter = {};
  }
}
