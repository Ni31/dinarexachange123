#!/usr/bin/env node

/**
 * Vercel Deployment Script
 * Automates the deployment process and checks for common issues
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting Vercel Deployment Process...');

// Check if required files exist
const requiredFiles = [
  'package.json',
  'next.config.mjs',
  'vercel.json',
  '.env.production'
];

console.log('📋 Checking required files...');
for (const file of requiredFiles) {
  if (!fs.existsSync(file)) {
    console.error(`❌ Missing required file: ${file}`);
    process.exit(1);
  }
  console.log(`✅ Found: ${file}`);
}

// Check package.json for required scripts
console.log('📦 Checking package.json scripts...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const requiredScripts = ['build', 'start', 'vercel-build'];

for (const script of requiredScripts) {
  if (!packageJson.scripts[script]) {
    console.error(`❌ Missing required script: ${script}`);
    process.exit(1);
  }
  console.log(`✅ Found script: ${script}`);
}

// Run pre-deployment checks
console.log('🔍 Running pre-deployment checks...');

try {
  // Check if Vercel CLI is installed
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('📥 Installing Vercel CLI...');
  execSync('npm install -g vercel', { stdio: 'inherit' });
}

// Run linting
console.log('🔧 Running linter...');
try {
  execSync('npm run lint', { stdio: 'inherit' });
  console.log('✅ Linting passed');
} catch (error) {
  console.log('⚠️  Linting issues found, but continuing...');
}

// Test build locally
console.log('🏗️  Testing build locally...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Local build successful');
} catch (error) {
  console.error('❌ Local build failed');
  console.error('Please fix build errors before deploying');
  process.exit(1);
}

// Deploy to Vercel
console.log('🚀 Deploying to Vercel...');
try {
  const deployCommand = process.argv.includes('--preview') ? 'vercel' : 'vercel --prod';
  execSync(deployCommand, { stdio: 'inherit' });
  console.log('✅ Deployment successful!');
} catch (error) {
  console.error('❌ Deployment failed');
  process.exit(1);
}

console.log('🎉 Deployment completed successfully!');
console.log('📝 Next steps:');
console.log('1. Set environment variables in Vercel Dashboard');
console.log('2. Configure custom domain (if needed)');
console.log('3. Run health checks on deployed application');
console.log('4. Seed admin data: npm run seed-admin:production');