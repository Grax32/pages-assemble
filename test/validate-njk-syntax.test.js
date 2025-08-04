// test/validate-njk-syntax.test.js
// This test checks that all .njk files in the src/ directory are valid Nunjucks syntax.

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const nunjucks = require('nunjucks');
const assert = require('assert');

describe('Validate Nunjucks (.njk) syntax in src/', function () {
  const njkFiles = glob.sync('src/**/*.njk');
  const env = new nunjucks.Environment();
  const knownShortcodes = ['buildtime', 'buildinfo']; // add your custom shortcodes here

  njkFiles.forEach(file => {
    it(`should be valid Nunjucks: ${file}`, () => {
      const code = fs.readFileSync(file, 'utf8');
      try {
        nunjucks.parser.parse(code, env.extensionsList, {filename: file});
      } catch (err) {
        // Ignore unknown custom shortcode errors
        if (
          err.message &&
          knownShortcodes.some(sc => err.message.includes(`unknown block tag: ${sc}`) || err.message.includes(`unknown tag: ${sc}`))
        ) {
          // Optionally log a warning here
          return;
        }
        assert.fail(`Syntax error in ${file}:\n${err.message}`);
      }
    });
  });
});
