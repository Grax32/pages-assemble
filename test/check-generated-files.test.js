// test/check-generated-files.test.js
// This script checks that for every .md and .html file in src/articles/, a corresponding file exists in _site/ at the expected output path.

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const assert = require('assert');

// Helper to get permalink from front matter
function getPermalink(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const match = content.match(/permalink:\s*([^\s]+)/);
    if (match) {
        // Remove leading/trailing quotes and slashes
        return match[1].replace(/^['"]|['"]$/g, '').replace(/^\//, '');
    }
    // Default: replace src/articles/ with articles/ and .md with .html
    return filePath.replace(/^src\//, '').replace(/\.md$/, '.html');
}

describe('Generated files exist in _site', () => {
    const articleFiles = glob.sync('src/articles/*.{md,html}');

    articleFiles.forEach(srcFile => {
        it(`should have a generated file for ${srcFile}`, () => {
            let outPath;

            const permalink = getPermalink(srcFile);
            outPath = path.join('_site', permalink);

            assert(fs.existsSync(outPath), `Missing generated file: ${outPath}`);
        });
    });
});
