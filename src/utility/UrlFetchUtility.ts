import https from 'https';
import { IncomingMessage } from 'http';
import * as uglify from 'uglify-js';

const scripts = [
  'https://code.jquery.com/jquery-3.4.1.slim.min.js',
  'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-core.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/plugins/autoloader/prism-autoloader.min.js',
];

const promiseGetBody = (result: IncomingMessage): Promise<string> =>
  new Promise((resolve, reject) => {
    result.setEncoding('utf8');
    const output: string[] = [];
    result.on('data', (chunk: string) => output.push(chunk));
    result.on('end', () => resolve(output.join('')));
  });

const promiseGet = (url: string): Promise<string> =>
  new Promise((resolve, reject) => {
    try {
      https.get(url, result => promiseGetBody(result).then(resolve, reject));
    } catch (exception) {
      reject(exception);
    }
  });

Promise.all(scripts.map(promiseGet)).then(
  v => {
    const output = uglify.minify(v.join('\n'));
    console.log(output);
  },
  err => {
    console.log(err);
    process.exit(1);
  },
);
