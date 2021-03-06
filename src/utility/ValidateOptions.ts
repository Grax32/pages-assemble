import fs from 'fs';

import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
import IBuildModule from '../interfaces/IBuildModule';

interface optionValue {
  value: any;
  description: string;
}

export default class ValidateOptions {
constructor(public bw: IBuildModule){}

  public static validate(options: IPageAssembleOptions) {
    if (!options) {
      this.exitWithError('Options must not be null');
    }

    const sourceOption = { value: options.source, description: 'Source' };
    const outputOption = { value: options.output, description: 'Output' };
    const templateOption = { value: options.template, description: 'Template' };

    this.require(sourceOption);
    this.require(outputOption);
    this.require(templateOption);

    this.requireDirectoryExists(sourceOption);
    this.forceDirectoryExists(outputOption);
  }
  static forceDirectoryExists(outputOption: optionValue) {
    if (!fs.existsSync(outputOption.value)) {
      fs.mkdirSync(outputOption.value);
    }
  }

  private static require(opt: optionValue): void {
    if (!opt.value) {
      this.exitWithError(opt.description + ' must be specified');
    }
  }

  private static requireDirectoryExists(opt: optionValue): void {
    if (!fs.existsSync(opt.value)) {
      this.exitWithError('Directory not found: ' + opt.description);
    }

    if (!fs.statSync(opt.value).isDirectory()) {
      this.exitWithError(opt.description + ' is not a directory.');
    }
  }

  private static exitWithError(message: string) {
    console.error(message);
    process.exit(1);
  }
}
