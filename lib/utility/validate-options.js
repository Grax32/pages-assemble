"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var ValidateOptions = /** @class */ (function () {
    function ValidateOptions() {
    }
    ValidateOptions.validate = function (options) {
        if (!options) {
            this.exitWithError('Options must not be null');
        }
        var baseDirectoryOption = { value: options.baseDirectory, description: 'BaseDirectory' };
        var sourceOption = { value: options.source, description: 'Source' };
        var outputOption = { value: options.output, description: 'Output' };
        var templateOption = { value: options.template, description: 'Template' };
        this.require(sourceOption);
        this.require(outputOption);
        this.require(templateOption);
        this.requireDirectoryExists(sourceOption);
        this.forceDirectoryExists(outputOption);
    };
    ValidateOptions.forceDirectoryExists = function (outputOption) {
        if (!fs_1.default.existsSync(outputOption.value)) {
            fs_1.default.mkdirSync(outputOption.value);
        }
    };
    ValidateOptions.require = function (opt) {
        if (!opt.value) {
            this.exitWithError(opt.description + ' must be specified');
        }
    };
    ValidateOptions.requireDirectoryExists = function (opt) {
        if (!fs_1.default.existsSync(opt.value)) {
            this.exitWithError('Directory not found: ' + opt.description);
        }
        if (!fs_1.default.statSync(opt.value).isDirectory()) {
            this.exitWithError(opt.description + ' is not a directory.');
        }
    };
    ValidateOptions.exitWithError = function (message) {
        console.error(message);
        process.exit(1);
    };
    return ValidateOptions;
}());
exports.default = ValidateOptions;
