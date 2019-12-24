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
var minimatch_1 = require("minimatch");
var fs = __importStar(require("fs"));
var glob = __importStar(require("glob"));
var packageJson = __importStar(require("./package.json"));
var buildcontext_1 = require("./models/buildcontext");
var validate_options_1 = require("./utility/validate-options");
var StaticSiteModule_1 = require("./modules/StaticSiteModule");
var FinalModule_1 = require("./modules/FinalModule");
var resultcontext_js_1 = require("./models/resultcontext.js");
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
if (fs.existsSync(configFileName)) {
    var configFile = fs.readFileSync(configFileName, { encoding: 'utf8' });
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
    console.log('Configured Options', options);
}
validate_options_1.ValidateOptions.validate(options);
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
            content: 'Project home: {underline ' + packageJson.repository.url + '}',
        },
    ]);
    console.log(usage);
    process.exit();
}
else {
    console.log(options);
    var isStatic_1 = function (path) { return options.static.some(function (pattern) { return new minimatch_1.Minimatch(pattern).match(path); }); };
    var isIgnored_1 = function (path) { return options.ignore.some(function (pattern) { return new minimatch_1.Minimatch(pattern).match(path); }); };
    var getAllAssets = function (options) {
        var sourceGlobPattern = options.source.replace(/\\/g, '/') + '/**';
        var sourcePattern = glob.sync(options.source)[0];
        var removeSourceFromFilename = function (file) { return file.replace(new RegExp('^' + sourcePattern), ''); };
        return glob
            .sync(sourceGlobPattern, { nodir: true })
            .map(removeSourceFromFilename)
            .map(function (file) { return ({ path: file, isStatic: isStatic_1(file), isIgnored: isIgnored_1(file) }); })
            .filter(function (asset) { return !isIgnored_1(asset.path); });
    };
    var moduleMap = new Map();
    moduleMap.set(StaticSiteModule_1.StaticSiteModule.name, StaticSiteModule_1.StaticSiteModule);
    moduleMap.set(FinalModule_1.FinalModule.name, FinalModule_1.FinalModule);
    var modules = [StaticSiteModule_1.StaticSiteModule.name, FinalModule_1.FinalModule.name];
    var lastInvoke = function (context) { return new resultcontext_js_1.ResultContext(); };
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
    var context = new buildcontext_1.BuildContext(options, allAssets);
    if (module_1 === undefined) {
        console.error('No modules configured');
        process.exit(1);
    }
    console.log('module', module_1);
    module_1.invoke(context);
}
