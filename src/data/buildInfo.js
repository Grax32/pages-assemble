const { execSync } = require('child_process');
const fs = require('fs');

function safeExecSync(command) {
  try {
    return execSync(command, { encoding: 'utf8' }).trim();
  } catch (error) {
    console.error(`Git command error (${command}):`, error.message);
    return '';
  }
}

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
      commit: safeExecSync('git rev-parse HEAD'),
      commitShort: safeExecSync('git rev-parse --short HEAD'),
      branch: safeExecSync('git rev-parse --abbrev-ref HEAD'),
      isDirty: safeExecSync('git status --porcelain') !== ''
    };
    
    // Try to get tag, but don't fail if none exists
    buildInfo.git.tag = safeExecSync('git describe --tags --abbrev=0');
    
    // Add remote URL if available
    const remoteUrl = safeExecSync('git config --get remote.origin.url');
    buildInfo.git.remoteUrl = remoteUrl;
    
    // Extract GitHub info if it's a GitHub repo
    if (remoteUrl) {
      const githubMatch = remoteUrl.match(/github\.com[:/]([^/]+)\/([^/.]+)/);
      if (githubMatch) {
        buildInfo.github = {
          owner: githubMatch[1],
          repo: githubMatch[2],
          url: `https://github.com/${githubMatch[1]}/${githubMatch[2]}`
        };
      }
    }
    
  } catch (error) {
    console.error('Git information not available:', error.message);
    buildInfo.git = {
      commit: '',
      commitShort: '',
      branch: '',
      tag: '',
      isDirty: false,
      remoteUrl: ''
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
    buildInfo.package = {
      name: 'unknown',
      version: 'unknown',
      description: 'unknown'
    };
  }

  return buildInfo;
}

module.exports = getBuildInfo();
