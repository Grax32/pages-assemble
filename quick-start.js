#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

console.log('🎯 Quick Start: Converting to 11ty');
console.log('=====================================');

// Step 1: Backup current package.json
if (fs.existsSync('package.json')) {
  console.log('📦 Backing up current package.json...');
  fs.copyFileSync('package.json', 'package-original.json');
  console.log('✅ Backup created as package-original.json');
}

// Step 2: Use the new package.json
console.log('📝 Installing 11ty package.json...');
if (fs.existsSync('package-eleventy.json')) {
  fs.copyFileSync('package-eleventy.json', 'package.json');
  console.log('✅ New package.json installed');
} else {
  console.log('❌ package-eleventy.json not found');
  process.exit(1);
}

// Step 3: Install dependencies
console.log('⬇️  Installing dependencies...');
try {
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

// Step 4: Run migration script
console.log('🔄 Converting Vash templates to Nunjucks...');
try {
  execSync('node migrate-vash-to-njk.js', { stdio: 'inherit' });
  console.log('✅ Template conversion complete');
} catch (error) {
  console.error('❌ Template conversion failed:', error.message);
}

// Step 5: Test build
console.log('🏗️  Testing build...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build successful!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  console.log('💡 You may need to manually review and fix template syntax');
}

console.log('');
console.log('🎉 Migration setup complete!');
console.log('');
console.log('Next steps:');
console.log('1. Review generated .njk files in _layouts/');
console.log('2. Update any remaining .vash files manually');
console.log('3. Test your site with: npm run serve');
console.log('4. Check MIGRATION-GUIDE.md for detailed instructions');
console.log('');
console.log('Happy coding! 🚀');
