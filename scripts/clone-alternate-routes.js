// Script to clone article files for each alternateRoute in frontmatter
// Usage: node scripts/clone-alternate-routes.js

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.join(__dirname, '../src/articles');

function getFrontmatter(content) {
  const match = content.match(/^---([\s\S]*?)---/);
  if (!match) return null;
  return match[1];
}

function parseFrontmatter(content) {
  const fm = getFrontmatter(content);
  if (!fm) return {};
  // Simple YAML parser for alternateRoutes and route
  const lines = fm.split(/\r?\n/);
  const data = {};
  let key = null;
  for (let line of lines) {
    const m = line.match(/^([a-zA-Z0-9_]+):\s*(.*)$/);
    if (m) {
      key = m[1];
      let val = m[2];
      if (val.startsWith('[') && val.endsWith(']')) {
        // Array
        val = val.slice(1, -1).split(',').map(s => s.trim().replace(/^['"]|['"]$/g, ''));
      }
      data[key] = val;
    } else if (key && line.trim().startsWith('- ')) {
      // Array item
      if (!Array.isArray(data[key])) data[key] = [];
      data[key].push(line.trim().slice(2));
    }
  }
  return data;
}

function replaceFrontmatter(content, newFrontmatter) {
  return content.replace(/^---([\s\S]*?)---/, `---\n${newFrontmatter}\n---`);
}

function buildFrontmatter(data) {
  let out = '';
  for (const [k, v] of Object.entries(data)) {
    if (Array.isArray(v)) {
      out += `${k}:\n`;
      for (const item of v) {
        out += ` - ${item}\n`;
      }
    } else {
      out += `${k}: ${v}\n`;
    }
  }
  return out.trim();
}

function cloneForAlternateRoutes(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const data = parseFrontmatter(content);
  if (!data.alternateRoutes || !Array.isArray(data.alternateRoutes) || data.alternateRoutes.length === 0) return;
  const ext = path.extname(filePath);
  const base = filePath.slice(0, -ext.length);
  data.alternateRoutes.forEach((route, idx) => {
    const cloneData = { ...data, route };
    delete cloneData.alternateRoutes;
    const newFrontmatter = buildFrontmatter(cloneData);
    const newContent = replaceFrontmatter(content, newFrontmatter);
    const newFile = `${base}-${idx + 2}${ext}`;
    fs.writeFileSync(newFile, newContent, 'utf8');
    console.log(`Created: ${newFile}`);
  });
}

fs.readdirSync(ARTICLES_DIR).forEach(file => {
  const filePath = path.join(ARTICLES_DIR, file);
  if (fs.statSync(filePath).isFile() && /\.(md|html)$/i.test(file)) {
    cloneForAlternateRoutes(filePath);
  }
});
