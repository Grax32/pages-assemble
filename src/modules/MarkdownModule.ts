import path from 'path';

import MarkdownIt from 'markdown-it';

import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';
import BaseModule from './BaseModule';

export default class MarkdownModule extends BaseModule {
  private markdown = new MarkdownIt({
    html: true,
    langPrefix: '',
    // highlight: function (code, lang) {
    //   var highlighted = lang ? hljs.highlight(lang, code) : hljs.highlightAuto(code)
    //   return highlighted.value
    // }
  });

  public next!: (context: BuildContext) => ResultContext;

  public invoke(context: BuildContext): ResultContext {
    this.log('Entering', MarkdownModule.name);

    context.assets
      .filter(v => path.extname(v.path) === '.md')
      .forEach(asset => {
        asset.outputType = OutputType.html;
        asset.sections.main = this.markdown.render(asset.textContent);
      });

    return this.next(context);
  }
}
