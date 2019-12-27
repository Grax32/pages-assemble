import path from 'path';

import MarkdownIt from 'markdown-it';

import IBuildModule from '../interfaces/IBuildModule';
import BuildContext from '../models/BuildContext';
import ResultContext from '../models/ResultContext';
import OutputType from '../models/OutputType';

export default class MarkdownModule implements IBuildModule {
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
    if (context.options.verbose) {
      console.log('Entering MarkdownModule');
    }
    const markdownAssets = context.assets.filter(v => path.extname(v.path) === '.md');

    markdownAssets.forEach(asset => {
      asset.outputType = OutputType.html;
      asset.sections['main'] = this.markdown.render(asset.textContent);
    });

    return this.next(context);
  }
}
