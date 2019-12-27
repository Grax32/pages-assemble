import IPageAssembleOptions from '../interfaces/IPageAssembleOptions';
interface optionValue {
    value: any;
    description: string;
}
export default class ValidateOptions {
    static validate(options: IPageAssembleOptions): void;
    static forceDirectoryExists(outputOption: optionValue): void;
    private static require;
    private static requireDirectoryExists;
    private static exitWithError;
}
export {};
