#!/usr/bin/env node

/**
 * Production Preparation Script
 * Ensures the codebase is ready for Vercel deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔧 Preparing codebase for production deployment...');

// Check Node.js version
const nodeVersion = process.version;
console.log(`📋 Node.js version: ${nodeVersion}`);

if (parseInt(nodeVersion.slice(1)) < 18) {
  console.warn('⚠️  Warning: Node.js 18+ is recommended for Vercel deployment');
}

// Validate package.json
console.log('📦 Validating package.json...');
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

// Check for required dependencies
const requiredDeps = [
  'next',
  'react',
  'react-dom',
  'next-auth',
  'mongoose'
];

for (const dep of requiredDeps) {
  if (!packageJson.dependencies[dep]) {
    console.error(`❌ Missing required dependency: ${dep}`);
    process.exit(1);
  }
}

console.log('✅ All required dependencies found');

// Check for production scripts
const requiredScripts = ['build', 'start', 'vercel-build'];
for (const script of requiredScripts) {
  if (!packageJson.scripts[script]) {
    console.error(`❌ Missing required script: ${script}`);
    process.exit(1);
  }
}

console.log('✅ All required scripts found');

// Validate Next.js configuration
console.log('⚙️  Validating Next.js configuration...');
if (!fs.existsSync('next.config.mjs')) {
  console.error('❌ Missing next.config.mjs file');
  process.exit(1);
}

// Validate Vercel configuration
console.log('🔧 Validating Vercel configuration...');
if (!fs.existsSync('vercel.json')) {
  console.error('❌ Missing vercel.json file');
  process.exit(1);
}

// Check environment files
console.log('🌍 Checking environment configuration...');
if (!fs.existsSync('.env.example')) {
  console.warn('⚠️  Missing .env.example file');
}

if (!fs.existsSync('.env.production')) {
  console.warn('⚠️  Missing .env.production file');
}

// Validate TypeScript configuration
if (fs.existsSync('tsconfig.json')) {
  console.log('📝 Validating TypeScript configuration...');
  try {
    const tsConfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
    if (!tsConfig.compilerOptions) {
      console.error('❌ Invalid tsconfig.json: missing compilerOptions');
      process.exit(1);
    }
    console.log('✅ TypeScript configuration valid');
  } catch (error) {
    console.error('❌ Invalid tsconfig.json format');
    process.exit(1);
  }
}

// Check for common issues
console.log('🔍 Checking for common deployment issues...');

// Check for hardcoded localhost URLs
const filesToCheck = [
  'lib/auth.js',
  'middleware.js',
  'next.config.mjs'
];

for (const file of filesToCheck) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    if (content.includes('localhost:3000') || content.includes('127.0.0.1')) {
      console.warn(`⚠️  Found hardcoded localhost URL in ${file}`);
    }
  }
}

// Test build
console.log('🏗️  Testing production build...');
try {
  execSync('npm run build', { stdio: 'pipe' });
  console.log('✅ Production build successful');
} catch (error) {
  console.error('❌ Production build failed');
  console.error('Please fix build errors before deploying');
  process.exit(1);
}

// Clean up build artifacts
console.log('🧹 Cleaning up build artifacts...');
if (fs.existsSync('.next')) {
  execSync('rm -rf .next', { stdio: 'pipe' });
}

console.log('✅ Codebase is ready for production deployment!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Set environment variables in Vercel Dashboard');
console.log('2. Run: npm run deploy:vercel');
console.log('3. Test the deployed application');
console.log('4. Seed admin data if needed');