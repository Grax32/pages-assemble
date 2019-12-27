import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Minimatch } from 'minimatch';

import fs from 'fs';
import glob from 'glob';
import path from 'path';

import packageJson from './package-reference.json';
import IPageAssembleOptions from './interfaces/IPageAssembleOptions';
import BuildContext from './models/BuildContext';
import ValidateOptions from './utility/validate-options';

import StaticSiteModule from './modules/StaticSiteModule';
import SimpleTemplateModule from './modules/SimpleTemplateModule';
import VashRazorTemplateModule from './modules/VashRazorTemplateModule';
import MarkdownModule from './modules/MarkdownModule';
import InitialModule from './modules/InitialModule';
import FinalModule from './modules/FinalModule';

import ResultContext from './models/ResultContext';
import IBuildModule from './interfaces/IBuildModule';
import IBuildModuleConstructor from './interfaces/IBuildModuleConstructor';
import BuildAsset from './models/BuildAsset';

const configFileName = 'assemble-config.json';

const optionDefinitions: commandLineArgs.OptionDefinition[] = [];

optionDefinitions.push({ alias: 'b', name: 'baseDirectory', defaultValue: '.' });
optionDefinitions.push({ alias: 's', name: 'source', type: String });
optionDefinitions.push({ alias: 'o', name: 'output', type: String });
optionDefinitions.push({ alias: 'i', name: 'ignore', type: String, multiple: true });
optionDefinitions.push({ alias: 'm', name: 'modules', type: String, multiple: true });
optionDefinitions.push({ alias: 'f', name: 'static', type: String, multiple: true });
optionDefinitions.push({ alias: 'h', name: 'help', type: Boolean });
optionDefinitions.push({ alias: 'v', name: 'verbose', type: Boolean });
optionDefinitions.push({ alias: 't', name: 'template', type: String, defaultValue: '_templates/default.html' });

const options = <IPageAssembleOptions>commandLineArgs(optionDefinitions);

if (options.baseDirectory) {
  process.chdir(options.baseDirectory);
} else {
  options.baseDirectory = '.';
}

if (fs.existsSync(configFileName)) {
  const configFile = fs.readFileSync(configFileName, { encoding: 'utf8' });
  const configFileOptions = <IPageAssembleOptions>JSON.parse(configFile);

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

ValidateOptions.validate(options);

if (options.help) {
  const usage = commandLineUsage([
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
} else {
  if (options.verbose) {
    console.log('Running options', options);
  }

  const isStatic = (path: string): boolean => options.static.some(pattern => new Minimatch(pattern).match(path));
  const isIgnored = (path: string): boolean => options.ignore.some(pattern => new Minimatch(pattern).match(path));
  const getAllAssets = (options: IPageAssembleOptions): BuildAsset[] => {
    const sourceGlobPattern = options.source.replace(/\\/g, '/') + '/**';
    const sourcePattern = glob.sync(options.source)[0];
    const removeSourceFromFilename = (file: string) => file.replace(new RegExp('^' + sourcePattern), '');

    return glob
      .sync(sourceGlobPattern, { nodir: true })
      .map(removeSourceFromFilename)
      .filter(file => !isIgnored(file))
      .map(file => new BuildAsset(file, isStatic(file)));
  };

  const moduleMap: Map<string, IBuildModuleConstructor> = new Map<string, IBuildModuleConstructor>();
  moduleMap.set(InitialModule.name, InitialModule);
  moduleMap.set(StaticSiteModule.name, StaticSiteModule);
  moduleMap.set(MarkdownModule.name, MarkdownModule);
  moduleMap.set(SimpleTemplateModule.name, SimpleTemplateModule);
  moduleMap.set(VashRazorTemplateModule.name, VashRazorTemplateModule);
  moduleMap.set(FinalModule.name, FinalModule);

  const modules = [InitialModule.name, StaticSiteModule.name, MarkdownModule.name, VashRazorTemplateModule.name, FinalModule.name];
  let lastInvoke = (context: BuildContext) => new ResultContext();
  let module: IBuildModule | undefined;

  for (let loopModuleName = modules.pop(); loopModuleName; loopModuleName = modules.pop()) {
    const builder = moduleMap.get(loopModuleName)!;
    const thisModule = new builder();
    const invoke = lastInvoke;

    thisModule.next = context => invoke(context);
    lastInvoke = context => thisModule.invoke(context);

    module = thisModule;
  }

  const allAssets = getAllAssets(options);
  const context = new BuildContext(options, allAssets);

  if (module === undefined) {
    console.error('No modules configured');
    process.exit(1);
  }

  const result = module.invoke(context);
  console.log(context, result);
}
