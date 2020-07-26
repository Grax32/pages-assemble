import OutputType from '../OutputType';
import { FrontMatterReadonly } from './related-models';

export default class FileContext {
  public contextType = FileContext.name;

  public outputType: OutputType = OutputType.binary;
  public textContent: string = '';
  public sections: { [prop: string]: string } = {};
  public frontMatter: FrontMatterReadonly = { tags: [], systemTags: [] };
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
