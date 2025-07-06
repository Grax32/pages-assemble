#!/usr/bin/env node

// Simple test to verify 11ty setup
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Testing 11ty migration...');

try {
  // Check if 11ty is installed
  console.log('📦 Checking 11ty installation...');
  execSync('npx @11ty/eleventy --version', { stdio: 'pipe' });
  console.log('✅ 11ty is installed');

  // Test dry run
  console.log('🔍 Testing 11ty dry run...');
  const dryRunOutput = execSync('npx @11ty/eleventy --dryrun', { 
    encoding: 'utf8',
    stdio: 'pipe'
  });
  console.log('✅ Dry run successful');
  console.log('📝 Files that will be processed:');
  console.log(dryRunOutput);

  // Test actual build
  console.log('🏗️  Testing actual build...');
  execSync('npx @11ty/eleventy', { stdio: 'pipe' });
  console.log('✅ Build successful');

  // Check if output directory exists
  const outputDir = './static-basedir/build';
  if (fs.existsSync(outputDir)) {
    console.log('✅ Output directory created');
    
    // List generated files
    const files = fs.readdirSync(outputDir);
    console.log('📄 Generated files:');
    files.forEach(file => {
      console.log(`  - ${file}`);
    });
  } else {
    console.log('❌ Output directory not found');
  }

} catch (error) {
  console.error('❌ Test failed:', error.message);
  process.exit(1);
}

console.log('🎉 Migration test complete!');
