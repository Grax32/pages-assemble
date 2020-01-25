const https = require('https');

const scripts = [
  'https://code.jquery.com/jquery-3.4.1.slim.min.js',
  'https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js',
  'https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/components/prism-core.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/prism/1.17.1/plugins/autoloader/prism-autoloader.min.js',
];

const promiseGetBody = result =>
  new Promise((resolve, reject) => {
    result.setEncoding('utf8');
    const output = [];
    result.on('data', chunk => {
      output.push(chunk);
    });
    result.on('end', () => {
      try {
        resolve(output.join(''));
      } catch (e) {
        reject(e);
      }
    });
  });

const promiseGet = url =>
  new Promise((resolve, reject) => {
    try {
      https.get(url, result => promiseGetBody(result).then(resolve, reject));
    } catch (exception) {
      reject(exception);
    }
  });

const results = Promise.all(scripts.map(promiseGet)).then(
  v => {
    v.forEach(x => console.log('RESULT! = ', x));
  },
  err => {
    console.log(err);
    process.exit(1);
  },
);

