export interface IPageAssembleOptions {
    baseDirectory: string;
    source: string;
    output: string;
    ignore: string[];
    modules: string[];
    static: string[];
    help: boolean;
    verbose: boolean;
    template: string;
}
