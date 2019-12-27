"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var command_line_args_1 = __importDefault(require("command-line-args"));
var command_line_usage_1 = __importDefault(require("command-line-usage"));
var minimatch_1 = require("minimatch");
var fs_1 = __importDefault(require("fs"));
var glob_1 = __importDefault(require("glob"));
var package_reference_json_1 = __importDefault(require("./package-reference.json"));
var BuildContext_1 = __importDefault(require("./models/BuildContext"));
var validate_options_1 = __importDefault(require("./utility/validate-options"));
var StaticSiteModule_1 = __importDefault(require("./modules/StaticSiteModule"));
var SimpleTemplateModule_1 = __importDefault(require("./modules/SimpleTemplateModule"));
var MarkdownModule_1 = __importDefault(require("./modules/MarkdownModule"));
var InitialModule_1 = __importDefault(require("./modules/InitialModule"));
var FinalModule_1 = __importDefault(require("./modules/FinalModule"));
var ResultContext_1 = __importDefault(require("./models/ResultContext"));
var BuildAsset_1 = __importDefault(require("./models/BuildAsset"));
var configFileName = 'assemble-config.json';
var optionDefinitions = [];
optionDefinitions.push({ alias: 'b', name: 'baseDirectory', defaultValue: '.' });
optionDefinitions.push({ alias: 's', name: 'source', type: String });
optionDefinitions.push({ alias: 'o', name: 'output', type: String });
optionDefinitions.push({ alias: 'i', name: 'ignore', type: String, multiple: true });
optionDefinitions.push({ alias: 'm', name: 'modules', type: String, multiple: true });
optionDefinitions.push({ alias: 'f', name: 'static', type: String, multiple: true });
optionDefinitions.push({ alias: 'h', name: 'help', type: Boolean });
optionDefinitions.push({ alias: 'v', name: 'verbose', type: Boolean });
optionDefinitions.push({ alias: 't', name: 'template', type: String, defaultValue: '_templates/default.html' });
var options = command_line_args_1.default(optionDefinitions);
if (options.baseDirectory) {
    process.chdir(options.baseDirectory);
}
else {
    options.baseDirectory = '.';
}
if (fs_1.default.existsSync(configFileName)) {
    var configFile = fs_1.default.readFileSync(configFileName, { encoding: 'utf8' });
    var configFileOptions = JSON.parse(configFile);
    if (options.verbose) {
        console.log('Configuration File', configFileOptions);
    }
    // base directory cannot be set from the config file
    delete configFileOptions.baseDirectory;
    // Override file options with command line options
    Object.assign(configFileOptions, options);
    // Apply config to original object
    Object.assign(options, configFileOptions);
}
if (options.verbose) {
    console.log('Prevalidated Options', options);
}
validate_options_1.default.validate(options);
if (options.help) {
    var usage = command_line_usage_1.default([
        {
            header: 'Pages Assemble',
            content: 'Assemble pages into a static web site.',
        },
        {
            header: 'Options',
            optionList: optionDefinitions,
        },
        {
            content: 'Project home: {underline ' + package_reference_json_1.default.repository.url + '}',
        },
    ]);
    console.log(usage);
    process.exit();
}
else {
    if (options.verbose) {
        console.log('Running options', options);
    }
    var isStatic_1 = function (path) { return options.static.some(function (pattern) { return new minimatch_1.Minimatch(pattern).match(path); }); };
    var isIgnored_1 = function (path) { return options.ignore.some(function (pattern) { return new minimatch_1.Minimatch(pattern).match(path); }); };
    var getAllAssets = function (options) {
        var sourceGlobPattern = options.source.replace(/\\/g, '/') + '/**';
        var sourcePattern = glob_1.default.sync(options.source)[0];
        var removeSourceFromFilename = function (file) { return file.replace(new RegExp('^' + sourcePattern), ''); };
        return glob_1.default
            .sync(sourceGlobPattern, { nodir: true })
            .map(removeSourceFromFilename)
            .filter(function (file) { return !isIgnored_1(file); })
            .map(function (file) { return new BuildAsset_1.default(file, isStatic_1(file)); });
    };
    var moduleMap = new Map();
    moduleMap.set(InitialModule_1.default.name, InitialModule_1.default);
    moduleMap.set(StaticSiteModule_1.default.name, StaticSiteModule_1.default);
    moduleMap.set(MarkdownModule_1.default.name, MarkdownModule_1.default);
    moduleMap.set(SimpleTemplateModule_1.default.name, SimpleTemplateModule_1.default);
    moduleMap.set(FinalModule_1.default.name, FinalModule_1.default);
    var modules = [InitialModule_1.default.name, StaticSiteModule_1.default.name, MarkdownModule_1.default.name, SimpleTemplateModule_1.default.name, FinalModule_1.default.name];
    var lastInvoke = function (context) { return new ResultContext_1.default(); };
    var module_1;
    var _loop_1 = function (loopModuleName) {
        var builder = moduleMap.get(loopModuleName);
        var thisModule = new builder();
        var invoke = lastInvoke;
        thisModule.next = function (context) { return invoke(context); };
        lastInvoke = function (context) { return thisModule.invoke(context); };
        module_1 = thisModule;
    };
    for (var loopModuleName = modules.pop(); loopModuleName; loopModuleName = modules.pop()) {
        _loop_1(loopModuleName);
    }
    var allAssets = getAllAssets(options);
    var context = new BuildContext_1.default(options, allAssets);
    if (module_1 === undefined) {
        console.error('No modules configured');
        process.exit(1);
    }
    var result = module_1.invoke(context);
    //console.log(context, result);
}
