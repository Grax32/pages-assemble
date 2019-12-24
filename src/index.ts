import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Minimatch } from 'minimatch';

import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import * as packageJson from './package.json';
import { IPageAssembleOptions } from './interfaces/IPageAssembleOptions';
import { BuildContext } from './models/buildcontext';
import { ValidateOptions } from './utility/validate-options';

import { StaticSiteModule } from './modules/StaticSiteModule';
import { FinalModule } from './modules/FinalModule';

import { ResultContext } from './models/resultcontext.js';
import { IBuildModule } from './interfaces/IBuildModule';
import { IBuildModuleConstructor } from './interfaces/IBuildModuleConstructor';

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
  console.log('Configured Options', options);
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
  console.log(options);

  const isStatic = (path: string): boolean => options.static.some(pattern => new Minimatch(pattern).match(path));
  const isIgnored = (path: string): boolean => options.ignore.some(pattern => new Minimatch(pattern).match(path));
  const getAllAssets = (options: IPageAssembleOptions): { path: string; isStatic: boolean }[] => {
    const sourceGlobPattern = options.source.replace(/\\/g, '/') + '/**';
    const sourcePattern = glob.sync(options.source)[0];
    const removeSourceFromFilename = (file:string) => file.replace(new RegExp('^' + sourcePattern), '');

    return glob
      .sync(sourceGlobPattern, { nodir: true })
      .map(removeSourceFromFilename)
      .map(file => ({ path: file, isStatic: isStatic(file), isIgnored: isIgnored(file) }))
      .filter(asset => !isIgnored(asset.path));
  };

  const moduleMap: Map<string, IBuildModuleConstructor> = new Map<string, IBuildModuleConstructor>();
  moduleMap.set(StaticSiteModule.name, StaticSiteModule);
  moduleMap.set(FinalModule.name, FinalModule);

  const modules = [StaticSiteModule.name, FinalModule.name];
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
  console.log('module', module);
  module.invoke(context);
}
