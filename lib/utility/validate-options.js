"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = __importStar(require("fs"));
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
        this.requireDirectoryExists(baseDirectoryOption);
        this.requireDirectoryExists(sourceOption);
        this.forceDirectoryExists(outputOption);
    };
    ValidateOptions.forceDirectoryExists = function (outputOption) {
        if (!fs.existsSync(outputOption.value)) {
            fs.mkdirSync(outputOption.value);
        }
    };
    ValidateOptions.require = function (opt) {
        if (!opt.value) {
            this.exitWithError(opt.description + ' must be specified');
        }
    };
    ValidateOptions.requireDirectoryExists = function (opt) {
        if (!fs.existsSync(opt.value)) {
            this.exitWithError('Directory not found: ' + opt.description);
        }
        if (!fs.statSync(opt.value).isDirectory()) {
            this.exitWithError(opt.description + ' is not a directory.');
        }
    };
    ValidateOptions.exitWithError = function (message) {
        console.error(message);
        process.exit(1);
    };
    return ValidateOptions;
}());
exports.ValidateOptions = ValidateOptions;
