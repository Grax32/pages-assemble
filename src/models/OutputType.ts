enum OutputType {
  text = 'text',
  html = 'html',
  style = 'style',
  script = 'script',
  binary = 'binary',
  raw = 'raw',
  data = 'data'
}

export class OutputTypes {
  static readonly OutputType = OutputType;

  public static getOutputTypeFromExtension(extension: string) {
    extension = extension.replace('.', '');

    switch (extension) {
      case 'md':
      case 'html':
      case 'htm':
      case 'vash':
        return OutputType.html;
      case 'css':
        return OutputType.style;
      case 'js':
        return OutputType.script;
      case 'json':
        return OutputType.data;
      case 'svg':
        return OutputType.raw;
      default:
        return OutputType.binary;
    }
  }

  public static getOutputExtension = (outputType: OutputType) => {
    switch (outputType) {
      case OutputType.data:
        return '.json';
      case OutputType.text:
        return '.txt';
      case OutputType.html:
        return '.html';
      case OutputType.script:
        return '.js';
      case OutputType.style:
        return '.css';
      case OutputType.raw:
      case OutputType.binary:
        return '';
      default:
        return '.html';
    }
  };
}

export default OutputType;
