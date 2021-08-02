// tslint:disable:no-console

process.on('uncaughtException', err => {
  console.error(err);
  process.exit(99);
})

import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import { Minimatch } from 'minimatch';

import fs from 'fs';
import glob from 'glob';

import * as interfaces from './interfaces/index';
import * as modules from './modules/buildModules';

import BuildContext from './models/BuildContext';
import packageJson from './package-reference.json';
import ValidateOptions from './utility/ValidateOptions';

import { createFileContext } from './models';
import SourceFileContext from './models/FileContexts/SourceFileContext';
import LogLevel from './models/LogLevel.js';
import ResultContext from './models/ResultContext';
import ConsoleLogger from './services/ConsoleLogger.js';

const asyncRoot = async () => {
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
  optionDefinitions.push({ alias: 't', name: 'template', type: String, defaultValue: 'default' });

  const options = commandLineArgs(optionDefinitions) as interfaces.IPageAssembleOptions;
  const optionsNoDefaults = (
    commandLineArgs(optionDefinitions.map(v => Object.assign({}, v, { defaultValue: undefined })))
  ) as interfaces.IPageAssembleOptions;

  if (options.baseDirectory) {
    process.chdir(options.baseDirectory);
  } else {
    options.baseDirectory = '.';
  }

  if (fs.existsSync(configFileName)) {
    const configFile = fs.readFileSync(configFileName, { encoding: 'utf8' });
    const configFileOptions = JSON.parse(configFile) as interfaces.IPageAssembleOptions;

    if (options.verbose) {
      console.log('Configuration File', configFileOptions);
    }

    // base directory cannot be set from the config file
    delete (configFileOptions as any).baseDirectory;

    // Override file options with command line options
    Object.assign(configFileOptions, optionsNoDefaults);

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
        content: 'Assemble pages into a static web site.',
        header: 'Pages Assemble',
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

    const isIgnored = (path: string): boolean => options.ignore.some(pattern => new Minimatch(pattern).match(path));
    const getAllAssets = (opt: interfaces.IPageAssembleOptions): SourceFileContext[] => {
      const sourceGlobPattern = opt.source.replace(/\\/g, '/') + '/**';
      const sourcePattern = glob.sync(opt.source)[0];
      const removeSourceFromFilename = (file: string) => file.replace(new RegExp('^' + sourcePattern), '');

      return glob
        .sync(sourceGlobPattern, { nodir: true })
        .map(removeSourceFromFilename)
        .filter(file => !isIgnored(file))
        .map(file => createFileContext(file));
    };

    const moduleMap = new Map<string, interfaces.IBuildModuleStatic>();
    const modulesTypes: interfaces.IBuildModuleStatic[] = [
      modules.InitialModule,
      modules.ComputeRouteModule,
      modules.StaticFilesModule,
      modules.MarkdownModule,
      modules.SimpleHtmlModule,
      modules.DataModule,
      modules.SectionsModule,
      modules.RedirectModule,
      modules.TagsModule,
      modules.RazorVashModule,
      modules.MinifierModule,
      modules.TextOutputModule,
      modules.FinalModule,
    ];

    modulesTypes.forEach(v => moduleMap.set(v.name, v));

    let lastInvoke = async (ctx: BuildContext) => new ResultContext();
    let module: interfaces.IBuildModule | undefined;

    const logLevel = options.verbose ? LogLevel.information : LogLevel.error;
    const logger = new ConsoleLogger(logLevel);

    for (const loopModule of [...modulesTypes].reverse()) {
      const thisModule = new loopModule(logger);
      const thisModuleName = loopModule.name;
      const invoke = lastInvoke;
      thisModule.next = ctx => invoke(ctx);

      const invokeThis = async (ctx: BuildContext): Promise<ResultContext> => {
        if (ctx.options.verbose) {
          console.log('Entering module ' + thisModuleName);
        }
        return await thisModule.invoke(ctx);
      };

      lastInvoke = invokeThis;

      module = thisModule;
    }

    const allAssets = getAllAssets(options);
    const context = new BuildContext(options, allAssets);

    if (module === undefined) {
      console.error('No modules configured');
      process.exit(1);
    }

    const result = await module.invoke(context);
    // console.log(context, result);
  }
};

// initiate the async stack
asyncRoot().then(
  () => console.log('Program Complete'),
  reason => {
    console.error(reason);
    process.exit(1);
  }
);
