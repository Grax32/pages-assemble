import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';
import * as fs from 'fs';
import * as packageJson from '../package.json';

const configFile = fs.readFileSync('');

const configFilePath = 'assemble-config.json';

function FilePath(path: string): string {
  const fileStat = fs.existsSync(path) && fs.statSync(path);

  if (!fileStat) {
    throw new Error("Path '" + path + "' was not found.");
  } else if (!fs.statSync(path).isFile()) {
    throw new Error("Path '" + path + "' must be a file or a folder with an index.js.");
  }

  return path;
}

const optionDefinitions: commandLineArgs.OptionDefinition[] = [];

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

const baseOptions = commandLineArgs(optionDefinitions);

if (fs.existsSync(configFilePath)) {
  const configFile = fs.readFileSync(configFilePath);
  Object.assign(baseOptions, configFile);
}

const commandLineOptions = commandLineArgs(optionDefinitions);
const options = Object.assign(baseOptions, commandLineOptions);

if (options.help) {
  const usage = commandLineUsage([
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
} else {
  console.log(options);
}
