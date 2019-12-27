"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var OutputType_1 = __importDefault(require("./OutputType"));
var BuildAsset = /** @class */ (function () {
    function BuildAsset(path, isStatic) {
        this.path = path;
        this.isStatic = isStatic;
        this.outputType = OutputType_1.default.binary;
        this.textContent = '';
        this.sections = {};
        this.frontMatter = {};
    }
    return BuildAsset;
}());
exports.default = BuildAsset;
