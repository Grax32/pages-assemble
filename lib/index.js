"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_args_1 = __importDefault(require("command-line-args"));
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var fs = __importStar(require("fs"));
var configFile = fs.readFileSync('');
var configFilePath = 'assemble-config.json';
function FilePath(path) {
    var fileStat = fs.existsSync(path) && fs.statSync(path);
    if (!fileStat) {
        throw new Error("Path '" + path + "' was not found.");
    }
    else if (!fs.statSync(path).isFile()) {
        throw new Error("Path '" + path + "' must be a file or a folder with an index.js.");
    }
    return path;
}
var optionDefinitions = [];
optionDefinitions.push({ name: 'source', alias: 's', type: String });
optionDefinitions.push({ name: 'verbose', alias: 'v', type: Boolean });
optionDefinitions.push({ name: 'build', type: String });
optionDefinitions.push({ name: 'ignore', alias: 'i', type: String, multiple: true });
optionDefinitions.push({ name: 'modules', alias: 'm', type: FilePath, multiple: true });
optionDefinitions.push({ name: 'help', alias: 'h', type: Boolean });
// optionDefinitions.push({ name: 'modules', type: });
/*
{
    "source": "source",
    "build": "dist",
    "helpers": [
      "helpers/trim-content.js",
      "helpers/normalize-paths.js",
      "helpers/apply-permalink.js",
      "helpers/tags.js"
    ],
    "ignore": ["_*"],
    "template": "_templates/default.html",
    "staticFolders": ["images", "content"]
  } */
var baseOptions = command_line_args_1.default(optionDefinitions);
if (fs.existsSync(configFilePath)) {
    var configFile_1 = fs.readFileSync(configFilePath);
    Object.assign(baseOptions, configFile_1);
}
var commandLineOptions = command_line_args_1.default(optionDefinitions);
var options = Object.assign(baseOptions, commandLineOptions);
if (options.help) {
    var usage = command_line_usage_1.default([
        {
            header: 'Typical Example',
            content: 'A simple example demonstrating typical usage.',
        },
        {
            header: 'Options',
            optionList: optionDefinitions,
        },
        {
            content: 'Project home: {underline https://github.com/me/example}',
        },
    ]);
    console.log(usage);
}
else {
    console.log(options);
}
