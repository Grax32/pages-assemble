#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Migration script to convert Vash files to Nunjucks
const sourceDir = './static-basedir/static-source';

function convertVashToNunjucks(content) {
  // Replace Vash template syntax with Nunjucks
  let converted = content;
  
  // Replace @model. with direct variable references
  converted = converted.replace(/@model\./g, '');
  
  // Replace @html.extend with layout frontmatter (manual process)
  // This is complex and needs manual review
  
  // Replace @if statements
  converted = converted.replace(/@if\s*\(([^)]+)\)\s*{/g, '{% if $1 %}');
  converted = converted.replace(/}\s*else\s*{/g, '{% else %}');
  converted = converted.replace(/}\s*$/gm, '{% endif %}');
  
  // Replace @foreach loops
  converted = converted.replace(/@([^.]+)\.forEach\(([^)]+)\s*=>\s*{/g, '{% for $2 in $1 %}');
  
  // Replace @variable with {{ variable }}
  converted = converted.replace(/@([a-zA-Z_][a-zA-Z0-9_]*)/g, '{{ $1 }}');
  
  // Replace @html.raw() with | safe filter
  converted = converted.replace(/@html\.raw\(([^)]+)\)/g, '{{ $1 | safe }}');
  
  return converted;
}

function processFile(filePath) {
  if (path.extname(filePath) === '.vash') {
    const content = fs.readFileSync(filePath, 'utf8');
    const converted = convertVashToNunjucks(content);
    const newPath = filePath.replace('.vash', '.njk');
    
    console.log(`Converting ${filePath} to ${newPath}`);
    fs.writeFileSync(newPath, converted);
    
    // Note: You may want to manually review and delete the original .vash files
    // fs.unlinkSync(filePath);
  }
}

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      walkDirectory(fullPath);
    } else {
      processFile(fullPath);
    }
  });
}

console.log('Starting Vash to Nunjucks conversion...');
walkDirectory(sourceDir);
console.log('Conversion complete! Please review the generated .njk files manually.');
console.log('Note: Complex template logic may need manual adjustment.');
