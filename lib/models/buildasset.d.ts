import OutputType from './OutputType';
export default class BuildAsset {
    path: string;
    isStatic: boolean;
    outputType: OutputType;
    textContent: string;
    sections: {
        [prop: string]: string;
    };
    frontMatter: any;
    constructor(path: string, isStatic: boolean);
}
