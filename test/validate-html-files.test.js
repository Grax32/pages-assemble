// test/validate-html-files.test.js
// This test checks that all HTML files in the _site folder are valid HTML5 using the 'html-validator' package.

const fs = require('fs');
const glob = require('glob');
const validator = require('html-validator');
const assert = require('assert');

const ignoreList = [
    'Initial heading level must be',
    '<img> is missing required \"alt\" attribute',
    'Element <style> is not permitted as content',
    '<th> is missing required "scope" attribute',
    'Heading level can only increase by one, expected'
];

function applyIgnoreFilters(result) {
    // Apply any ignore filters to the validation result
    if (result.errors) {
        result.errors = result.errors.filter(err => {
            return !ignoreList.some(ignore => err.message.includes(ignore));
        });
    }

    if (!result.errors || result.errors.length === 0) {
        return ''; // Return empty string if no errors after filtering
    }

    return result;
}

describe.only('Validate generated HTML files in _site', function () {

    const htmlFiles = glob.sync('_site/**/*.html');

    htmlFiles.forEach(file => {
        it(`should be valid HTML: ${file}`, async () => {
            const html = fs.readFileSync(file, 'utf8');
            const options = { data: html, format: 'json', validator: 'WHATWG' };
            const initialResult = await validator(options);
            if (initialResult === '') {
                // HTML file is valid, no further checks needed
                return;
            }

            const result = applyIgnoreFilters(initialResult);
            // The WHATWG validator returns an empty string if valid

            if (result === '') {
                // HTML file is valid, no further checks needed
                return;
            } else if (typeof result === 'object') {
                if (result.errorCount && result.errors) {
                    const errorMessage = result.errors.map(err => {
                        return `Error: ${err.message} at line ${err.line}, column ${err.column}`;
                    });
                    assert.fail(`HTML file ${file} is not valid: ${result.errors.length} errors found:\n${errorMessage.join('\n')}`);
                } else {
                    assert.fail(`HTML file ${file} is not valid: ${result}.  Unexpected result: ${result}`);
                }
            } else {
                assert.fail(`HTML file ${file} is not valid: Unexpected result: ${result}`);
            }
        });
    });
});
