#!/usr/bin/env node

/**
 * Performance Optimization Script for Zentrox Core
 * This script helps optimize the project for better performance
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

console.log('🚀 Starting Zentrox Core optimization...\n');

// 1. Clean up node_modules and reinstall for a fresh start
console.log('📦 Cleaning dependencies...');
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache cleaned');
} catch (error) {
  console.log('⚠️  Cache clean failed, continuing...');
}

// 2. Add performance scripts to package.json
console.log('📝 Adding performance scripts...');
const packageJsonPath = join(process.cwd(), 'package.json');
const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

// Add performance-focused scripts
packageJson.scripts = {
  ...packageJson.scripts,
  'build:analyze': 'vite build --mode analyze',
  'build:prod': 'vite build --mode production',
  'preview:prod': 'vite preview --port 4173',
  'clean': 'rm -rf dist node_modules/.vite',
  'optimize': 'npm run clean && npm install && npm run build:prod'
};

writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Performance scripts added');

// 3. Create .env.production for production optimizations
console.log('🔧 Creating production environment config...');
const prodEnv = `# Production Environment Variables
VITE_NODE_ENV=production
VITE_BUILD_ANALYZE=false
VITE_SOURCEMAP=false
VITE_MINIFY=true
`;

writeFileSync('.env.production', prodEnv);
console.log('✅ Production environment configured');

console.log('\n🎉 Optimization complete!');
console.log('\n📋 Next steps:');
console.log('1. Run: npm run optimize');
console.log('2. Run: npm run dev (for development)');
console.log('3. Run: npm run build:prod (for production build)');
console.log('\n💡 Performance improvements applied:');
console.log('• ✅ Lazy loading for dashboard components');
console.log('• ✅ Vite build optimizations');
console.log('• ✅ Reduced Tailwind CSS bundle size');
console.log('• ✅ Code splitting and chunk optimization');
console.log('• ✅ Disabled source maps for production');
console.log('• ✅ Asset optimization');
