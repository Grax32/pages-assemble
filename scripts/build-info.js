#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

function getBuildInfo() {
  const buildInfo = {
    buildTime: new Date().toISOString(),
    buildTimestamp: Date.now(),
    buildDate: new Date().toLocaleDateString(),
    nodeVersion: process.version,
    platform: process.platform,
    arch: process.arch
  };

  // Get Git information
  try {
    buildInfo.git = {
      commit: execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim(),
      commitShort: execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim(),
      branch: execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim(),
      isDirty: execSync('git status --porcelain', { encoding: 'utf8' }).trim() !== ''
    };
    
    // Try to get tag, but don't fail if none exists
    try {
      buildInfo.git.tag = execSync('git describe --tags --abbrev=0', { encoding: 'utf8' }).trim();
    } catch (tagError) {
      buildInfo.git.tag = 'no-tags';
    }
    
    // Add remote URL if available
    try {
      const remoteUrl = execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
      buildInfo.git.remoteUrl = remoteUrl;
      
      // Extract GitHub info if it's a GitHub repo
      const githubMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (githubMatch) {
        buildInfo.github = {
          owner: githubMatch[1],
          repo: githubMatch[2],
          url: `https://github.com/${githubMatch[1]}/${githubMatch[2]}`
        };
      }
    } catch (remoteError) {
      // Remote URL not available
    }
    
  } catch (error) {
    console.warn('Git information not available:', error.message);
    buildInfo.git = {
      commit: 'not-a-git-repo',
      commitShort: 'not-a-git-repo',
      branch: 'not-a-git-repo',
      tag: 'not-a-git-repo',
      isDirty: false
    };
  }

  // Get package.json info
  try {
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    buildInfo.package = {
      name: packageJson.name,
      version: packageJson.version,
      description: packageJson.description
    };
  } catch (error) {
    console.warn('Package.json not available:', error.message);
  }

  return buildInfo;
}

function generateBuildInfo() {
  const buildInfo = getBuildInfo();
  
  // Create build info directory if it doesn't exist
  const buildDir = path.join('src', 'data');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  
  // Write build info to JSON file
  const buildInfoPath = path.join(buildDir, 'build-info.json');
  fs.writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2));
  
  console.log('✅ Build info generated:', buildInfoPath);
  console.log('📦 Version:', buildInfo.package?.version || 'unknown');
  console.log('🔧 Git commit:', buildInfo.git?.commitShort || 'unknown');
  console.log('📅 Build time:', buildInfo.buildTime);
  
  return buildInfo;
}

// Run if called directly
if (require.main === module) {
  generateBuildInfo();
}

module.exports = { getBuildInfo, generateBuildInfo };
