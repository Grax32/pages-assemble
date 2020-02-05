enum OutputType {
  text = 'text',
  html = 'html',
  style = 'style',
  script = 'script',
  binary = 'binary',
}

export class OutputTypes {
  static readonly OutputType = OutputType;

  public static getOutputTypeFromExtension(extension: string) {
    extension = extension.replace('.', '');

    switch (extension) {
      case 'md':
      case 'html':
      case 'htm':
        return OutputType.html;
      case 'css':
        return OutputType.style;
      case 'js':
        return OutputType.script;
      default:
        return OutputType.binary;
    }
  }

  public static getOutputExtension = (outputType: OutputType) => {
    switch (outputType) {
      case OutputType.text:
        return '.txt';
      case OutputType.html:
        return '.html';
      case OutputType.script:
        return '.js';
      case OutputType.style:
        return '.css';
      default:
        return '.html';
    }
  };
}

export default OutputType;
